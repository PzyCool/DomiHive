// dashboard-rent.js - Complete Property Functionality
let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 12;
let userFavorites = new Set();

// ===== INITIALIZATION =====
function initializeRentProperties() {
    console.log('🏠 Initializing Rent Properties Module');
    
    loadUserFavorites();
    initHeroSearch();
    initPropertiesGrid();
    
    console.log('✅ Rent Properties Module loaded');
}

function loadUserFavorites() {
    const favorites = localStorage.getItem('domihive_user_favorites');
    if (favorites) {
        try {
            userFavorites = new Set(JSON.parse(favorites));
            console.log('💖 Loaded user favorites:', userFavorites.size);
        } catch (error) {
            console.error('Error loading favorites:', error);
            userFavorites = new Set();
        }
    }
}

function saveUserFavorites() {
    localStorage.setItem('domihive_user_favorites', JSON.stringify([...userFavorites]));
}

// ===== HERO SEARCH FUNCTIONALITY =====
function initHeroSearch() {
    // ELEMENTS
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('typeSelect');
    const areaTypeSelect = document.getElementById('areaTypeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const doSearchBtn = document.getElementById('doSearch');

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

    // Area selection behavior
    areaTypeSelect.addEventListener('change', () => {
        const area = areaTypeSelect.value;
        populateLocations(area);
        
        if (area) {
            console.log(`📍 Area type selected: ${area}`);
        }
    });

    // Search handler
    doSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const query = searchInput.value.trim();
        const areaType = areaTypeSelect.value;
        const location = locationSelect.value;
        const propType = typeSelect.value;
        const bedrooms = document.getElementById('bedroomsSelect').value;
        const minPrice = document.getElementById('minPriceSelect').value;
        const maxPrice = document.getElementById('maxPriceSelect').value;

        // Build search criteria
        const searchCriteria = {
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
        applyHeroSearch(searchCriteria);
        
        // Scroll to properties section
        document.querySelector('.properties-section')?.scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Keyboard accessibility - press Enter to search
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            doSearchBtn.click();
        }
    });

    // Initialize locations
    populateLocations('mainland');
    
    console.log('✅ Rent Hero Search Initialized');
}

function applyHeroSearch(searchCriteria) {
    console.log('🎯 Applying hero search criteria:', searchCriteria);
    
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
    
    // Apply text search
    if (searchCriteria.query) {
        document.getElementById('searchInput').value = searchCriteria.query;
    }
    
    // Apply the filters
    setTimeout(() => {
        applyFilters();
        console.log('✅ Hero search filters applied successfully');
    }, 100);
}

// ===== PROPERTIES GRID FUNCTIONALITY =====
function initPropertiesGrid() {
    console.log('🏠 Initializing Properties Grid...');
    
    // Generate sample rental properties
    generateRentalProperties();
    
    // Apply any saved search criteria from hero search
    applySavedSearchCriteria();
    
    // Load initial properties
    displayProperties();
    
    // Initialize event listeners
    initPropertiesEventListeners();
    
    console.log(`✅ Loaded ${allProperties.length} rental properties`);
}

function generateRentalProperties() {
    const propertyTypes = ['apartment', 'self-contain', 'mini-flat', 'duplex', 'bungalow', 'shared'];
    const locations = {
        mainland: [
            'Ikeja GRA', 'Yaba', 'Surulere', 'Ojota', 'Oshodi', 'Ilupeju',
            'Egbeda', 'Maryland', 'Ikorodu', 'Agege', 'Festac Town', 'Gbagada'
        ],
        island: [
            'Ikoyi', 'Lekki Phase 1', 'Victoria Island', 'Ajah', 'Sangotedo',
            'Chevron', 'Oniru', 'Banana Island', 'Lekki Phase 2', 'VGC'
        ]
    };
    
    const amenitiesList = ['wifi', 'parking', 'security', 'pool', 'gym', 'ac', 'generator', 'water'];
    
    // Property images array - using Unsplash for realistic images
    const propertyImages = [
        'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448078-8b7a9c7b7c7c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'
    ];
    
    // Generate 84 rental properties
    for (let i = 1; i <= 84; i++) {
        const isMainland = Math.random() > 0.5;
        const area = isMainland ? 'mainland' : 'island';
        const locationArray = locations[area];
        const randomLocation = locationArray[Math.floor(Math.random() * locationArray.length)];
        
        const img1 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
        const img2 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
        const img3 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
        
        const property = {
            id: `rent_${i}`,
            title: `${getRandomRentalType()} in ${randomLocation}`,
            price: getRentalPrice(area),
            location: randomLocation,
            area: area,
            type: 'rent',
            propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
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
            description: `Beautiful ${getRandomRentalType()} located in the heart of ${randomLocation}. This rental property offers modern amenities and comfortable living spaces perfect for families and professionals.`,
            dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        };
        
        allProperties.push(property);
    }

    filteredProperties = [...allProperties];
}

function getRandomRentalType() {
    const types = ['Apartment', 'Self Contain', 'Mini Flat', 'Duplex', 'Bungalow', 'Shared Apartment'];
    return types[Math.floor(Math.random() * types.length)];
}

function getRentalPrice(area) {
    let basePrice = area === 'island' ? 800000 : 400000;
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
            applyHeroSearch(criteria);
            sessionStorage.removeItem('domihive_search_criteria');
        } catch (error) {
            console.error('Error applying saved search criteria:', error);
        }
    }
}

function initPropertiesEventListeners() {
    const clearFiltersBtn = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortSelect');
    const viewBtns = document.querySelectorAll('.view-btn');
    const loadMoreBtn = document.getElementById('loadMore');
    const filterInputs = document.querySelectorAll('input[type="checkbox"], input[type="number"], input[type="range"]');

    // Event Listeners
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearAllFilters);
    if (sortSelect) sortSelect.addEventListener('change', sortProperties);
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreProperties);
    
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
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) {
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
    const sortBy = document.getElementById('sortSelect').value;
    
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
    const propertiesGrid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('results-count');
    const loadMoreBtn = document.getElementById('loadMore');
    
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
    
    if (loadMoreBtn) {
        loadMoreBtn.style.display = hasMoreProperties ? 'flex' : 'none';
        
        // Update load more text
        if (hasMoreProperties) {
            const remaining = filteredProperties.length - totalDisplayed;
            const nextBatch = Math.min(remaining, propertiesPerPage);
            loadMoreBtn.innerHTML = `<i class="fas fa-arrow-down"></i> Load ${nextBatch} More Properties`;
        } else if (filteredProperties.length > 0) {
            loadMoreBtn.innerHTML = `<i class="fas fa-check"></i> All ${filteredProperties.length} Properties Loaded`;
        }
    }
    
    console.log(`📄 Displaying ${totalDisplayed} of ${filteredProperties.length} properties (Page ${currentPage})`);
}

// ===== PROPERTY CARD CREATION =====
function createPropertyCard(property) {
    const isListView = document.getElementById('propertiesGrid').classList.contains('list-view');
    const isFavorite = userFavorites.has(property.id);
    
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
                <button class="carousel-btn prev-btn" onclick="navCarousel('${property.id}', -1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-btn next-btn" onclick="navCarousel('${property.id}', 1)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="carousel-dots">
                ${property.images.map((_, index) => `
                    <span class="carousel-dot ${index === 0 ? 'active' : ''}" 
                          onclick="goToSlide('${property.id}', ${index})"></span>
                `).join('')}
            </div>
            
            <div class="property-badges">
                ${property.isVerified ? '<span class="property-badge badge-verified">Verified</span>' : ''}
                ${property.isFeatured ? '<span class="property-badge badge-featured">Featured</span>' : ''}
                ${property.isNew ? '<span class="property-badge badge-new">New</span>' : ''}
            </div>
            
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="handleFavoriteClick('${property.id}', this)">
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
                <button class="btn-view-details" onclick="handleViewDetailsClick('${property.id}')">
                    View Details
                </button>
                <button class="btn-save ${isFavorite ? 'active' : ''}" onclick="handleFavoriteClick('${property.id}', this)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===== PROPERTY INTERACTION HANDLERS =====
function handleViewDetailsClick(propertyId) {
    console.log(`👀 View details clicked for property ${propertyId}`);
    // Redirect to property details page with the specific property ID
    window.location.href = `./property-details.html?id=${propertyId}`;
}

function handleFavoriteClick(propertyId, buttonElement) {
    console.log(`💖 Favorite clicked for property ${propertyId}`);
    
    if (userFavorites.has(propertyId)) {
        // Remove from favorites
        userFavorites.delete(propertyId);
        buttonElement.classList.remove('active');
        showNotification('Property removed from favorites', 'success');
    } else {
        // Add to favorites
        userFavorites.add(propertyId);
        buttonElement.classList.add('active');
        showNotification('Property added to favorites!', 'success');
    }
    
    // Save updated favorites
    saveUserFavorites();
    
    // Update favorites count in sidebar if needed
    updateFavoritesCount();
}

function updateFavoritesCount() {
    const favoritesCount = document.getElementById('sidebarFavoritesCount');
    if (favoritesCount) {
        favoritesCount.textContent = userFavorites.size;
        favoritesCount.style.display = userFavorites.size > 0 ? 'flex' : 'none';
    }
}

function loadMoreProperties() {
    currentPage++;
    displayProperties();
    
    // Scroll to show new properties
    setTimeout(() => {
        const newProperties = document.getElementById('propertiesGrid').children;
        if (newProperties.length > 0) {
            const lastNewProperty = newProperties[newProperties.length - 1];
            lastNewProperty.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
    
    console.log(`📄 Loaded page ${currentPage}, showing ${Math.min(currentPage * propertiesPerPage, filteredProperties.length)} properties`);
}

function switchView(view) {
    const viewBtns = document.querySelectorAll('.view-btn');
    const propertiesGrid = document.getElementById('propertiesGrid');
    
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
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    
    // Reset range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 5000000;
    }
    
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset sort to default
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'newest';
    
    applyFilters();
    console.log('🧹 All filters cleared');
}

function showNoResultsMessage() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    propertiesGrid.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No rental properties found</h3>
            <p>Try adjusting your filters to see more results, or let us know what you're looking for.</p>
            <button class="btn-view-details" onclick="clearAllFilters()" style="margin-top: 1rem; display: inline-block;">Clear All Filters</button>
            
            <div class="request-form">
                <h4>Can't find what you're looking for?</h4>
                <p>Let us help you find your perfect rental property</p>
                <input type="text" placeholder="Your Name" id="requestName">
                <input type="email" placeholder="Your Email" id="requestEmail">
                <input type="tel" placeholder="Your Phone" id="requestPhone">
                <textarea placeholder="Tell us about your rental requirements..." rows="4" id="requestMessage"></textarea>
                <button onclick="submitPropertyRequest()">Submit Request</button>
            </div>
        </div>
    `;
}

// ===== CAROUSEL FUNCTIONS =====
function navCarousel(propertyId, direction) {
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
}

function goToSlide(propertyId, slideIndex) {
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
}

// ===== UTILITY FUNCTIONS =====
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

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.global-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function submitPropertyRequest() {
    const name = document.getElementById('requestName')?.value || '';
    const email = document.getElementById('requestEmail')?.value || '';
    const phone = document.getElementById('requestPhone')?.value || '';
    const message = document.getElementById('requestMessage')?.value || '';
    
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields: Name, Email, and Message', 'error');
        return;
    }
    
    // Submit form data (simulate API call)
    console.log('📧 Property Request Submitted:', { name, email, phone, message });
    showNotification('Thank you! Your rental request has been submitted to DomiHive support.', 'success');
    
    // Clear form
    document.getElementById('requestName').value = '';
    document.getElementById('requestEmail').value = '';
    document.getElementById('requestPhone').value = '';
    document.getElementById('requestMessage').value = '';
}

// ===== GLOBAL FUNCTIONS =====
window.navCarousel = navCarousel;
window.goToSlide = goToSlide;
window.handleViewDetailsClick = handleViewDetailsClick;
window.handleFavoriteClick = handleFavoriteClick;
window.clearAllFilters = clearAllFilters;
window.submitPropertyRequest = submitPropertyRequest;

// Make initialization function globally available
window.initializeRentProperties = initializeRentProperties;

console.log('🎉 DomiHive Rent Properties Module Loaded!');