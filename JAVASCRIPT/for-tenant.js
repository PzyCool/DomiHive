// for-tenant.js - Tenant Properties Grid Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Track user type for smart application flow
    sessionStorage.setItem('domihive_user_type', 'tenant');
    console.log('👤 User type set: Tenant');

    // Elements
    const propertiesGrid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('results-count');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortSelect');
    const viewBtns = document.querySelectorAll('.view-btn');
    const loadMoreBtn = document.getElementById('loadMore');
    const filterInputs = document.querySelectorAll('input[type="checkbox"], input[type="number"], input[type="range"]');
    
    // State
    let allProperties = [];
    let filteredProperties = [];
    let currentPage = 1;
    const propertiesPerPage = 12;
    let favorites = JSON.parse(localStorage.getItem('domihive_favorites')) || [];

    // Initialize
    initPropertiesGrid();

    // Event Listeners
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    sortSelect.addEventListener('change', sortProperties);
    loadMoreBtn.addEventListener('click', loadMoreProperties);
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Real-time filtering with proper debouncing
    filterInputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.addEventListener('change', debounce(applyFilters, 300));
        } else if (input.type === 'number') {
            input.addEventListener('input', debounce(applyFilters, 500));
        } else if (input.type === 'range') {
            input.addEventListener('input', debounce(applyFilters, 300));
        }
    });

    // Price range slider synchronization
    const priceRange = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (priceRange && minPriceInput && maxPriceInput) {
        priceRange.addEventListener('input', function() {
            maxPriceInput.value = this.value;
            debounce(applyFilters, 300)();
        });
        
        minPriceInput.addEventListener('input', debounce(applyFilters, 500));
        maxPriceInput.addEventListener('input', debounce(applyFilters, 500));
    }

    // Functions
    function initPropertiesGrid() {
        console.log('🏠 Initializing Tenant Properties Grid...');
        
        // Generate TENANT-FOCUSED properties
        generateTenantProperties();
        
        // Apply any saved search criteria from hero search
        applySavedSearchCriteria();
        
        // Load initial properties
        displayProperties();
        
        // Update favorites count in navigation
        updateGlobalFavoritesCount();
        
        console.log(`✅ Loaded ${allProperties.length} tenant properties`);
    }

    function generateTenantProperties() {
        const propertyTypes = ['apartment', 'house', 'duplex', 'bungalow', 'terrace'];
        const locations = {
            mainland: [
                'Ikeja GRA', 'Yaba', 'Surulere', 'Ojota', 'Oshodi', 'Ilupeju',
                'Egbeda', 'Maryland', 'Ikorodu', 'Agege', 'Festac Town', 'Gbagada',
                'Mushin', 'Mende', 'Ogba', 'Alausa', 'Anthony', 'Palmgroove'
            ],
            island: [
                'Ikoyi', 'Lekki Phase 1', 'Victoria Island', 'Ajah', 'Sangotedo',
                'Chevron', 'Oniru', 'Banana Island', 'Lekki Phase 2', 'VGC'
            ]
        };
        
        const amenitiesList = ['wifi', 'parking', 'security', 'pool', 'gym', 'ac', 'generator', 'water', 'playground'];
        
        // TENANT-FOCUSED property images (family homes, apartments, houses)
        const tenantPropertyImages = [
            // Family Apartments
            'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560448078-8b7a9c7b7c7c?w=800&h=600&fit=crop',
            
            // Family Houses
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
            
            // Living Rooms (Family focused)
            'https://images.unsplash.com/photo-1567496898662-9f5c56f86314?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1582263989365-b4cd47d4d9a9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560185893-4c7b8b8b8b8b?w=800&h=600&fit=crop',
            
            // Bedrooms (Family sized)
            'https://images.unsplash.com/photo-1586023494248-875d6f6f0f73?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1554995201-8cec4b1d1b7a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560185893-4c7b8b8b8b8c?w=800&h=600&fit=crop',
            
            // Kitchens (Family homes)
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            
            // Exteriors (Family properties)
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop'
        ];
        
        // Generate 60 TENANT properties (family-focused)
        for (let i = 1; i <= 60; i++) {
            const isMainland = Math.random() > 0.5;
            const area = isMainland ? 'mainland' : 'island';
            const locationArray = locations[area];
            const randomLocation = locationArray[Math.floor(Math.random() * locationArray.length)];
            
            // TENANT-SPECIFIC: No studios, no shared apartments - only family properties
            const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const bedrooms = Math.floor(Math.random() * 3) + 2; // 2-4 bedrooms (family sizes)
            
            // Pick random images from tenant-focused list
            const img1 = tenantPropertyImages[Math.floor(Math.random() * tenantPropertyImages.length)];
            const img2 = tenantPropertyImages[Math.floor(Math.random() * tenantPropertyImages.length)];
            const img3 = tenantPropertyImages[Math.floor(Math.random() * tenantPropertyImages.length)];
            
            const property = {
                id: i,
                title: `${getRandomPropertyType()} in ${randomLocation}`,
                price: getRandomPrice(area),
                location: randomLocation,
                area: area,
                type: propertyType,
                bedrooms: bedrooms,
                bathrooms: Math.max(1, bedrooms - 1), // Appropriate bathrooms for family
                size: `${Math.floor(Math.random() * 200) + 80} sqm`, // Larger sizes for families
                furnishing: ['furnished', 'semi-furnished', 'unfurnished'][Math.floor(Math.random() * 3)],
                amenities: getRandomAmenities(amenitiesList),
                petsAllowed: Math.random() > 0.5, // More pet-friendly for families
                age: ['new', 'modern', 'established'][Math.floor(Math.random() * 3)],
                images: [img1, img2, img3],
                isVerified: Math.random() > 0.2,
                isFeatured: Math.random() > 0.8,
                isNew: i > 45,
                description: `Beautiful family ${getRandomPropertyType()} located in the heart of ${randomLocation}. Perfect for tenants seeking comfortable living spaces.`,
                dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
                userType: 'tenant' // Track that this is a tenant property
            };
            
            allProperties.push(property);
        }
        
        filteredProperties = [...allProperties];
    }

    function getRandomPropertyType() {
        const types = ['Apartment', 'House', 'Duplex', 'Bungalow', 'Terrace House'];
        return types[Math.floor(Math.random() * types.length)];
    }

    function getRandomPrice(area) {
        const basePrice = area === 'island' ? 1000000 : 600000; // Higher prices for family homes
        const variation = Math.random() * 500000;
        return Math.floor(basePrice + variation);
    }

    function getRandomAmenities(amenitiesList) {
        const count = Math.floor(Math.random() * 4) + 4; // More amenities for family homes
        const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function applySavedSearchCriteria() {
        const savedSearch = sessionStorage.getItem('domihive_search_criteria');
        if (savedSearch) {
            try {
                const criteria = JSON.parse(savedSearch);
                console.log('🔍 Applying saved search criteria:', criteria);
                
                // Apply basic filters from hero search
                if (criteria.areaType) {
                    const areaCheckbox = document.querySelector(`input[name="area"][value="${criteria.areaType}"]`);
                    if (areaCheckbox) areaCheckbox.checked = true;
                }
                
                if (criteria.propertyType) {
                    const typeCheckbox = document.querySelector(`input[name="propertyType"][value="${criteria.propertyType}"]`);
                    if (typeCheckbox) typeCheckbox.checked = true;
                }
                
                if (criteria.minPrice) {
                    const minPriceInput = document.getElementById('minPrice');
                    if (minPriceInput) minPriceInput.value = criteria.minPrice;
                }
                
                if (criteria.maxPrice) {
                    const maxPriceInput = document.getElementById('maxPrice');
                    if (maxPriceInput) maxPriceInput.value = criteria.maxPrice;
                }
                
                // Apply bedroom filter if specified
                if (criteria.bedrooms) {
                    const bedroomCheckbox = document.querySelector(`input[name="bedrooms"][value="${criteria.bedrooms}"]`);
                    if (bedroomCheckbox) bedroomCheckbox.checked = true;
                }
                
                applyFilters();
                sessionStorage.removeItem('domihive_search_criteria');
            } catch (error) {
                console.error('Error applying saved search criteria:', error);
            }
        }
    }

    function applyFilters() {
        console.log('🎯 Applying tenant filters...');
        
        const filters = getCurrentFilters();
        filteredProperties = allProperties.filter(property => {
            return matchesAllFilters(property, filters);
        });
        
        currentPage = 1;
        sortProperties();
        displayProperties();
        
        console.log(`📊 Filtered to ${filteredProperties.length} tenant properties`);
    }

    function getCurrentFilters() {
        const minPriceValue = parseInt(document.getElementById('minPrice').value) || 0;
        const maxPriceValue = parseInt(document.getElementById('maxPrice').value) || 100000000;
        
        const filters = {
            priceRange: {
                min: minPriceValue,
                max: maxPriceValue
            },
            bedrooms: getCheckedValues('bedrooms'),
            bathrooms: getCheckedValues('bathrooms'),
            propertyType: getCheckedValues('propertyType'),
            furnishing: getCheckedValues('furnishing'),
            amenities: getCheckedValues('amenities'),
            area: getCheckedValues('area'),
            pets: getCheckedValues('pets'),
            age: getCheckedValues('age')
        };
        
        return filters;
    }

    function getCheckedValues(name) {
        const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checked).map(input => input.value);
    }

    function matchesAllFilters(property, filters) {
        // Price range
        if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
            return false;
        }
        
        // Bedrooms
        if (filters.bedrooms.length > 0) {
            const bedroomValue = property.bedrooms >= 4 ? '4' : property.bedrooms.toString();
            if (!filters.bedrooms.includes(bedroomValue)) return false;
        }
        
        // Bathrooms
        if (filters.bathrooms.length > 0) {
            const bathroomValue = property.bathrooms >= 3 ? '3' : property.bathrooms.toString();
            if (!filters.bathrooms.includes(bathroomValue)) return false;
        }
        
        // Property type
        if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type)) {
            return false;
        }
        
        // Furnishing
        if (filters.furnishing.length > 0 && !filters.furnishing.includes(property.furnishing)) {
            return false;
        }
        
        // Amenities (all selected amenities must be present)
        if (filters.amenities.length > 0) {
            const hasAllAmenities = filters.amenities.every(amenity => 
                property.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
        }
        
        // Area
        if (filters.area.length > 0 && !filters.area.includes(property.area)) {
            return false;
        }
        
        // Pets
        if (filters.pets.length > 0) {
            if (filters.pets.includes('allowed') && !property.petsAllowed) return false;
            if (filters.pets.includes('not-allowed') && property.petsAllowed) return false;
        }
        
        // Age
        if (filters.age.length > 0 && !filters.age.includes(property.age)) {
            return false;
        }
        
        return true;
    }

    function sortProperties() {
        const sortBy = sortSelect.value;
        
        filteredProperties.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'popular':
                    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
                case 'verified':
                    return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0);
                default:
                    return 0;
            }
        });
        
        displayProperties();
    }

    function displayProperties() {
        const startIndex = (currentPage - 1) * propertiesPerPage;
        const endIndex = startIndex + propertiesPerPage;
        const propertiesToShow = filteredProperties.slice(0, endIndex);
        
        propertiesGrid.innerHTML = '';
        
        if (propertiesToShow.length === 0) {
            showNoResultsMessage();
        } else {
            propertiesToShow.forEach(property => {
                const propertyCard = createPropertyCard(property);
                propertiesGrid.appendChild(propertyCard);
            });
        }
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = filteredProperties.length + '+';
        }
        
        // Show/hide load more button
        const totalDisplayed = Math.min(endIndex, filteredProperties.length);
        const hasMoreProperties = totalDisplayed < filteredProperties.length;
        
        loadMoreBtn.style.display = hasMoreProperties ? 'flex' : 'none';
        
        // Update load more text
        if (hasMoreProperties) {
            const remaining = filteredProperties.length - totalDisplayed;
            const nextBatch = Math.min(remaining, propertiesPerPage);
            loadMoreBtn.innerHTML = `<i class="fas fa-arrow-down"></i> Load ${nextBatch} More Properties`;
        } else if (filteredProperties.length > 0) {
            loadMoreBtn.innerHTML = `<i class="fas fa-check"></i> All ${filteredProperties.length} Properties Loaded`;
        }
        
        console.log(`📄 Displaying ${totalDisplayed} of ${filteredProperties.length} tenant properties (Page ${currentPage})`);
    }

    function showNoResultsMessage() {
        propertiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No tenant properties found</h3>
                <p>Try adjusting your filters to see more family homes and apartments, or let us know what you're looking for.</p>
                <button class="btn-view-details" onclick="clearAllFilters()" style="margin-top: 1rem; display: inline-block;">Clear All Filters</button>
                
                <div class="request-form">
                    <h4>Can't find what you're looking for?</h4>
                    <p>Let us help you find your perfect family home</p>
                    <input type="text" placeholder="Your Name" id="requestName">
                    <input type="email" placeholder="Your Email" id="requestEmail">
                    <input type="tel" placeholder="Your Phone" id="requestPhone">
                    <textarea placeholder="Tell us about your family property requirements..." rows="4" id="requestMessage"></textarea>
                    <button onclick="submitPropertyRequest()">Submit Request</button>
                </div>
            </div>
        `;
    }

    function createPropertyCard(property) {
        const isFavorite = favorites.includes(property.id);
        const isListView = propertiesGrid.classList.contains('list-view');
        
        const card = document.createElement('div');
        card.className = `property-card ${isListView ? 'list-view' : ''}`;
        card.innerHTML = `
            <div class="property-image">
                <div class="property-carousel" data-property-id="${property.id}">
                    ${property.images.map((img, index) => `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" 
                             style="background-image: url('${img}')"></div>
                    `).join('')}
                </div>
                
                <div class="carousel-controls">
                    <button class="carousel-btn prev-btn" onclick="navCarousel(${property.id}, -1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-btn next-btn" onclick="navCarousel(${property.id}, 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="carousel-dots">
                    ${property.images.map((_, index) => `
                        <span class="carousel-dot ${index === 0 ? 'active' : ''}" 
                              onclick="goToSlide(${property.id}, ${index})"></span>
                    `).join('')}
                </div>
                
                <div class="property-badges">
                    ${property.isVerified ? '<span class="property-badge badge-verified">Verified</span>' : ''}
                    ${property.isFeatured ? '<span class="property-badge badge-featured">Featured</span>' : ''}
                    ${property.isNew ? '<span class="property-badge badge-new">New</span>' : ''}
                    <span class="property-badge" style="background: var(--primary-color);">For Tenants</span>
                </div>
                
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="toggleFavorite(${property.id}, this)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            
            <div class="property-details">
                <div class="property-price">₦${property.price.toLocaleString()}/year</div>
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                
                <div class="property-features">
                    <span class="property-feature">
                        <i class="fas fa-bed"></i> ${property.bedrooms} bed
                    </span>
                    <span class="property-feature">
                        <i class="fas fa-bath"></i> ${property.bathrooms} bath
                    </span>
                    <span class="property-feature">
                        <i class="fas fa-ruler-combined"></i> ${property.size}
                    </span>
                </div>
                
                <p class="property-description">${property.description}</p>
                
                <div class="property-actions">
                    <a href="property-details.html?id=${property.id}&userType=tenant" class="btn-view-details">
                        View Details
                    </a>
                    <button class="btn-save ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${property.id}, this)">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    function loadMoreProperties() {
        currentPage++;
        displayProperties();
        
        // Scroll to show new properties
        setTimeout(() => {
            const newProperties = propertiesGrid.children;
            if (newProperties.length > 0) {
                const lastNewProperty = newProperties[newProperties.length - 1];
                lastNewProperty.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
        
        console.log(`📄 Loaded page ${currentPage}, showing ${Math.min(currentPage * propertiesPerPage, filteredProperties.length)} tenant properties`);
    }

    function switchView(view) {
        viewBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        if (view === 'list') {
            propertiesGrid.classList.add('list-view');
        } else {
            propertiesGrid.classList.remove('list-view');
        }
        
        displayProperties();
    }

    function clearAllFilters() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear number inputs
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        
        // Reset range slider
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = 5000000;
        }
        
        // Reset sort to default
        sortSelect.value = 'newest';
        
        applyFilters();
        console.log('🧹 All tenant filters cleared');
    }

    function updateGlobalFavoritesCount() {
        const favorites = JSON.parse(localStorage.getItem('domihive_favorites')) || [];
        const favoriteBadge = document.querySelector('.favorite-badge');
        if (favoriteBadge) {
            favoriteBadge.textContent = favorites.length;
            favoriteBadge.style.display = favorites.length > 0 ? 'flex' : 'none';
        }
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Export functions to global scope
    window.navCarousel = function(propertyId, direction) {
        const carousel = document.querySelector(`.property-carousel[data-property-id="${propertyId}"]`);
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
        
        let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        let newIndex = (currentIndex + direction + slides.length) % slides.length;
        
        // Update slides
        slides[currentIndex].classList.remove('active');
        slides[newIndex].classList.add('active');
        
        // Update dots
        dots[currentIndex].classList.remove('active');
        dots[newIndex].classList.add('active');
    };

    window.goToSlide = function(propertyId, slideIndex) {
        const carousel = document.querySelector(`.property-carousel[data-property-id="${propertyId}"]`);
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
        
        // Update all slides and dots
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
    };

    window.toggleFavorite = function(propertyId, buttonElement) {
        let favorites = JSON.parse(localStorage.getItem('domihive_favorites')) || [];
        const index = favorites.indexOf(propertyId);
        
        if (index > -1) {
            // Remove from favorites
            favorites.splice(index, 1);
        } else {
            // Add to favorites
            favorites.push(propertyId);
        }
        
        // Save to localStorage
        localStorage.setItem('domihive_favorites', JSON.stringify(favorites));
        
        // Update global favorites count
        updateGlobalFavoritesCount();
        
        // Update UI buttons
        const favoriteBtns = document.querySelectorAll(`.favorite-btn[onclick*="toggleFavorite(${propertyId}"]`);
        const saveBtns = document.querySelectorAll(`.btn-save[onclick*="toggleFavorite(${propertyId}"]`);
        
        favoriteBtns.forEach(btn => btn.classList.toggle('active'));
        saveBtns.forEach(btn => btn.classList.toggle('active'));
        
        console.log(`💖 ${index > -1 ? 'Removed from' : 'Added to'} favorites: Tenant Property ${propertyId}`);
    };

    window.submitPropertyRequest = function() {
        const name = document.getElementById('requestName')?.value || '';
        const email = document.getElementById('requestEmail')?.value || '';
        const phone = document.getElementById('requestPhone')?.value || '';
        const message = document.getElementById('requestMessage')?.value || '';
        
        if (!name || !email || !message) {
            alert('Please fill in all required fields: Name, Email, and Message');
            return;
        }
        
        // Simulate form submission
        console.log('📧 Tenant Property Request Submitted:', { name, email, phone, message, userType: 'tenant' });
        alert('Thank you! Your tenant property request has been submitted to DomiHive support. We\'ll contact you soon!');
        
        // Clear form
        document.getElementById('requestName').value = '';
        document.getElementById('requestEmail').value = '';
        document.getElementById('requestPhone').value = '';
        document.getElementById('requestMessage').value = '';
    };

    // Make functions available globally
    window.propertiesGrid = {
        applyFilters: applyFilters,
        clearAllFilters: clearAllFilters,
        applyHeroSearch: function(searchCriteria) {
            console.log('🎯 Applying hero search criteria for tenant:', searchCriteria);
            
            // Clear existing filters first
            clearAllFilters();
            
            // Apply hero search filters to advanced sidebar
            if (searchCriteria.areaType) {
                const areaCheckbox = document.querySelector(`input[name="area"][value="${searchCriteria.areaType}"]`);
                if (areaCheckbox) areaCheckbox.checked = true;
            }
            
            if (searchCriteria.propertyType) {
                const typeCheckbox = document.querySelector(`input[name="propertyType"][value="${searchCriteria.propertyType}"]`);
                if (typeCheckbox) typeCheckbox.checked = true;
            }
            
            if (searchCriteria.bedrooms) {
                const bedroomCheckbox = document.querySelector(`input[name="bedrooms"][value="${searchCriteria.bedrooms}"]`);
                if (bedroomCheckbox) bedroomCheckbox.checked = true;
            }
            
            if (searchCriteria.minPrice) {
                const minPriceInput = document.getElementById('minPrice');
                if (minPriceInput) minPriceInput.value = searchCriteria.minPrice;
            }
            
            if (searchCriteria.maxPrice) {
                const maxPriceInput = document.getElementById('maxPrice');
                if (maxPriceInput) maxPriceInput.value = searchCriteria.maxPrice;
            }
            
            // Apply the filters
            setTimeout(() => {
                applyFilters();
                console.log('✅ Tenant hero search filters applied successfully');
            }, 100);
        },
        getFilteredProperties: () => filteredProperties,
        getFavorites: () => favorites
    };
});