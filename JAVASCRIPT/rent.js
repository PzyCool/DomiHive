// rent-hero.js - Hero Search Functionality

document.addEventListener('DOMContentLoaded', function() {
    // ELEMENTS
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('typeSelect');
    const areaTypeSelect = document.getElementById('areaTypeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const doSearchBtn = document.getElementById('doSearch');

    // PROPERTY OPTIONS FOR ALL 5 TABS
    const propertyOptions = {
        rent: [
            "Apartment", 
            "Self Contain", 
            "Mini Flat", 
            "Duplex", 
            "Bungalow",
            "Terrace House",
            "Detached House",
            "Shared Apartment"
        ],
        shortlet: [
            "Studio Apartment",
            "1 Bedroom Shortlet", 
            "2 Bedroom Shortlet", 
            "3 Bedroom Shortlet",
            "Luxury Apartment", 
            "Serviced Apartment",
            "Executive Suite"
        ],
        commercial: [
            "Office Space",
            "Shop", 
            "Warehouse",
            "Commercial Building",
            "Co-working Space",
            "Retail Space",
            "Industrial Property"
        ],
        student: [
            "Student Hostel",
            "Shared Room",
            "Private Room", 
            "Studio Apartment",
            "Campus Housing",
            "Off-Campus Housing",
            "Student Lodge"
        ],
        buy: [
            "Residential Apartment",
            "Detached House",
            "Semi-Detached House", 
            "Terrace House",
            "Duplex",
            "Bungalow",
            "Land/Plot",
            "Commercial Property"
        ]
    };

    // LAGOS AREAS WITH ALL CITIES
    const lagosAreas = {
        mainland: [
            "Ikeja", "Ikeja GRA", "Yaba", "Surulere", "Ojota", "Oshodi", "Ilupeju",
            "Egbeda", "Maryland", "Ikorodu", "Agege", "Festac Town", "Gbagada",
            "Mushin", "Mende", "Ogba", "Alausa", "Anthony", "Palmgroove", "Somolu",
            "Bariga", "Ketu", "Magodo", "Omole", "Isolo", "Ejigbo", "Amuwo Odofin",
            "Satellite Town", "Apapa", "Mile 2", "Alaba", "Ojo", "Badagry", "Agbara"
        ],
        island: [
            "Ikoyi", "Lekki Phase 1", "Victoria Island", "Ajah", "Sangotedo",
            "Chevron", "Oniru", "Epe", "Banana Island", "Lekki Phase 2", 
            "Victoria Garden City (VGC)", "Lekki Scheme 2", "Osapa London",
            "Jakande", "Awoyaya", "Abraham Adesanya", "Lakowe", "Ibeju Lekki",
            "Marina", "Dolphin Estate", "1004 Estate", "Parkview Estate"
        ]
    };

    // Populate property type dropdown for chosen tab
    function populateTypeOptions(type) {
        typeSelect.innerHTML = "";
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Property Type";
        typeSelect.appendChild(placeholder);

        (propertyOptions[type] || []).forEach(optText => {
            const opt = document.createElement('option');
            opt.value = optText.toLowerCase().replace(/\s+/g,'-');
            opt.textContent = optText;
            typeSelect.appendChild(opt);
        });
    }

    // Populate locations for chosen area type
    function populateLocations(areaKey) {
        locationSelect.innerHTML = "";
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Location";
        locationSelect.appendChild(placeholder);

        if (!areaKey || !lagosAreas[areaKey]) return;

        // Sort locations alphabetically
        const sortedLocations = lagosAreas[areaKey].sort();
        
        sortedLocations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.toLowerCase().replace(/\s+/g,'-');
            option.textContent = loc;
            locationSelect.appendChild(option);
        });
    }

    // Tab click behavior
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Update property type options
            const selectedType = tab.getAttribute('data-type');
            populateTypeOptions(selectedType);
            
            // Update search placeholder based on tab
            const placeholders = {
                rent: 'Search for rental properties — e.g. "Lekki 3 bedroom"',
                shortlet: 'Search for shortlet properties — e.g. "VI luxury apartment"',
                commercial: 'Search for commercial properties — e.g. "Ikeja office space"',
                student: 'Search for student housing — e.g. "Yaba hostel"',
                buy: 'Search for properties to buy — e.g. "Lekki 4 bedroom house"'
            };
            
            searchInput.placeholder = placeholders[selectedType] || 'Search properties...';
            
            console.log(`🏠 Tab switched to: ${selectedType}`);
        });
    });

    // Area selection behavior
    areaTypeSelect.addEventListener('change', () => {
        const area = areaTypeSelect.value;
        populateLocations(area);
        
        if (area) {
            console.log(`📍 Area type selected: ${area}`);
        }
    });

    // Search handler - REAL ACTION (no prompts)
    doSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const activeTab = document.querySelector('.tab.active')?.getAttribute('data-type') || 'rent';
        const query = searchInput.value.trim();
        const areaType = areaTypeSelect.value;
        const location = locationSelect.value;
        const propType = typeSelect.value;
        const bedrooms = document.getElementById('bedroomsSelect').value;
        const minPrice = document.getElementById('minPriceSelect').value;
        const maxPrice = document.getElementById('maxPriceSelect').value;

        // Build search criteria
        const searchCriteria = {
            action: activeTab,
            query: query,
            areaType: areaType,
            location: location,
            propertyType: propType,
            bedrooms: bedrooms,
            minPrice: minPrice,
            maxPrice: maxPrice,
            timestamp: new Date().toISOString()
        };

        // Store search for property grid
        sessionStorage.setItem('domihive_search_criteria', JSON.stringify(searchCriteria));
        
        console.log('🔍 Search submitted:', searchCriteria);
        
        // Apply search immediately to properties grid
        if (window.propertiesGrid && typeof window.propertiesGrid.applyHeroSearch === 'function') {
            window.propertiesGrid.applyHeroSearch(searchCriteria);
            // Scroll to properties section
            document.querySelector('.properties-section')?.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    });

    // Keyboard accessibility - press Enter to search
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            doSearchBtn.click();
        }
    });

    // Initialize
    function initHeroSearch() {
        // Set default property types
        populateTypeOptions('rent');
        
        // Clear any previous search
        searchInput.value = '';
        
        console.log('🎯 Rent Hero Search Initialized with 5 tabs');
    }

    // Start initialization
    initHeroSearch();
});

// properties-grid.js - Properties Grid Functionality

document.addEventListener('DOMContentLoaded', function() {
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
        console.log('🏠 Initializing Properties Grid...');
        
        // Generate sample properties (80+ listings)
        generateSampleProperties();
        
        // Apply any saved search criteria from hero search
        applySavedSearchCriteria();
        
        // Load initial properties
        displayProperties();
        
        // Update favorites count in navigation
        updateGlobalFavoritesCount();
        
        console.log(`✅ Loaded ${allProperties.length} properties`);
    }

    function generateSampleProperties() {
        const propertyTypes = ['apartment', 'house', 'duplex', 'studio', 'shared'];
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
        
        const amenitiesList = ['wifi', 'parking', 'security', 'pool', 'gym', 'ac', 'generator', 'water'];
        
        // Property images array
        const propertyImages = [
            'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560448078-8b7a9c7b7c7c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop'
        ];
        
        // Generate 84 properties with mixed types
        for (let i = 1; i <= 84; i++) {
            const isMainland = Math.random() > 0.5;
            const area = isMainland ? 'mainland' : 'island';
            const locationArray = locations[area];
            const randomLocation = locationArray[Math.floor(Math.random() * locationArray.length)];
            
            // Assign property types based on categories
            let propertyCategory = 'rent';
            if (i > 60) propertyCategory = 'buy';
            else if (i > 45) propertyCategory = 'student';
            else if (i > 30) propertyCategory = 'commercial';
            else if (i > 15) propertyCategory = 'shortlet';
            
            const img1 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
            const img2 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
            const img3 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
            
            const property = {
                id: i,
                title: `${getRandomPropertyType()} in ${randomLocation}`,
                price: getRandomPrice(area, propertyCategory),
                location: randomLocation,
                area: area,
                category: propertyCategory,
                type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
                bedrooms: Math.floor(Math.random() * 4) + 1,
                bathrooms: Math.floor(Math.random() * 3) + 1,
                size: `${Math.floor(Math.random() * 200) + 50} sqm`,
                furnishing: ['furnished', 'semi-furnished', 'unfurnished'][Math.floor(Math.random() * 3)],
                amenities: getRandomAmenities(amenitiesList),
                petsAllowed: Math.random() > 0.7,
                age: ['new', 'modern', 'established'][Math.floor(Math.random() * 3)],
                images: [img1, img2, img3],
                isVerified: Math.random() > 0.2,
                isFeatured: Math.random() > 0.8,
                isNew: i > 60,
                description: `Beautiful ${getRandomPropertyType()} located in the heart of ${randomLocation}. This property offers modern amenities and comfortable living spaces.`,
                dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
            };
            
            allProperties.push(property);
        }
    
        filteredProperties = [...allProperties];
    }

    function getRandomPropertyType() {
        const types = ['Apartment', 'House', 'Duplex', 'Studio', 'Shared Apartment'];
        return types[Math.floor(Math.random() * types.length)];
    }

    function getRandomPrice(area, category) {
        let basePrice = 400000; // Default for rent
        
        switch(category) {
            case 'buy':
                basePrice = area === 'island' ? 80000000 : 40000000; // Millions for buying
                break;
            case 'shortlet':
                basePrice = area === 'island' ? 1200000 : 600000; // Higher for shortlets
                break;
            case 'commercial':
                basePrice = area === 'island' ? 1500000 : 800000; // Commercial rates
                break;
            case 'student':
                basePrice = area === 'island' ? 600000 : 300000; // Student rates
                break;
            default: // rent
                basePrice = area === 'island' ? 800000 : 400000;
        }
        
        const variation = Math.random() * (basePrice * 0.5); // 50% variation
        return Math.floor(basePrice + variation);
    }

    function getRandomAmenities(amenitiesList) {
        const count = Math.floor(Math.random() * 4) + 3;
        const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function applySavedSearchCriteria() {
        const savedSearch = sessionStorage.getItem('domihive_search_criteria');
        if (savedSearch) {
            try {
                const criteria = JSON.parse(savedSearch);
                console.log('🔍 Applying saved search criteria:', criteria);
                
                // Filter properties by category first
                if (criteria.action) {
                    filteredProperties = allProperties.filter(property => 
                        property.category === criteria.action
                    );
                }
                
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
        console.log('🎯 Applying filters...');
        
        const filters = getCurrentFilters();
        filteredProperties = allProperties.filter(property => {
            return matchesAllFilters(property, filters);
        });
        
        currentPage = 1;
        sortProperties();
        displayProperties();
        
        console.log(`📊 Filtered to ${filteredProperties.length} properties`);
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
        
        console.log(`📄 Displaying ${totalDisplayed} of ${filteredProperties.length} properties (Page ${currentPage})`);
    }

    // MISSING FUNCTION ADDED BACK
    function showNoResultsMessage() {
        propertiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No properties found</h3>
                <p>Try adjusting your filters to see more results, or let us know what you're looking for.</p>
                <button class="btn-view-details" onclick="clearAllFilters()" style="margin-top: 1rem; display: inline-block;">Clear All Filters</button>
                
                <div class="request-form">
                    <h4>Can't find what you're looking for?</h4>
                    <p>Let us help you find your perfect property</p>
                    <input type="text" placeholder="Your Name" id="requestName">
                    <input type="email" placeholder="Your Email" id="requestEmail">
                    <input type="tel" placeholder="Your Phone" id="requestPhone">
                    <textarea placeholder="Tell us about your property requirements..." rows="4" id="requestMessage"></textarea>
                    <button onclick="submitPropertyRequest()">Submit Request</button>
                </div>
            </div>
        `;
    }

    // MISSING FUNCTION ADDED BACK - createPropertyCard
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
                    <a href="property-details.html?id=${property.id}" class="btn-view-details">
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
        
        console.log(`📄 Loaded page ${currentPage}, showing ${Math.min(currentPage * propertiesPerPage, filteredProperties.length)} properties`);
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
        console.log('🧹 All filters cleared');
    }

    function updateGlobalFavoritesCount() {
        const favorites = JSON.parse(localStorage.getItem('domihive_favorites')) || [];
        const favoriteBadge = document.querySelector('.favorite-badge');
        if (favoriteBadge) {
            favoriteBadge.textContent = favorites.length;
            // Show/hide badge based on count
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
        
        console.log(`💖 ${index > -1 ? 'Removed from' : 'Added to'} favorites: Property ${propertyId}`);
    };

    window.submitPropertyRequest = function() {
        const name = document.getElementById('requestName')?.value || '';
        const email = document.getElementById('requestEmail')?.value || '';
        const phone = document.getElementById('requestPhone')?.value || '';
        const message = document.getElementById('requestMessage')?.value || '';
        
        if (!name || !email || !message) {
            // REAL ACTION: Show error message in UI instead of alert
            const errorElement = document.createElement('div');
            errorElement.style.background = '#fee2e2';
            errorElement.style.color = '#dc2626';
            errorElement.style.padding = '1rem';
            errorElement.style.borderRadius = '8px';
            errorElement.style.marginTop = '1rem';
            errorElement.innerHTML = 'Please fill in all required fields: Name, Email, and Message';
            
            const requestForm = document.querySelector('.request-form');
            if (requestForm) {
                requestForm.appendChild(errorElement);
                setTimeout(() => errorElement.remove(), 5000);
            }
            return;
        }
        
        // REAL ACTION: Submit form data (simulate API call)
        console.log('📧 Property Request Submitted:', { name, email, phone, message });
        
        // Show success message in UI
        const successElement = document.createElement('div');
        successElement.style.background = '#d1fae5';
        successElement.style.color = '#065f46';
        successElement.style.padding = '1rem';
        successElement.style.borderRadius = '8px';
        successElement.style.marginTop = '1rem';
        successElement.innerHTML = 'Thank you! Your property request has been submitted to DomiHive support. We\'ll contact you soon!';
        
        const requestForm = document.querySelector('.request-form');
        if (requestForm) {
            requestForm.appendChild(successElement);
        }
        
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
            console.log('🎯 Applying hero search criteria:', searchCriteria);
            
            // Clear existing filters first
            clearAllFilters();
            
            // Filter by category first
            if (searchCriteria.action) {
                filteredProperties = allProperties.filter(property => 
                    property.category === searchCriteria.action
                );
            }
            
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
                console.log('✅ Hero search filters applied successfully');
            }, 100);
        },
        getFilteredProperties: () => filteredProperties,
        getFavorites: () => favorites
    };
});