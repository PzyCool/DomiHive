// dashboard-router.js - Fixed SPA Navigation Router
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the router
    initDashboardRouter();
    
    // Initialize sidebar toggle (your existing functionality)
    initSidebarToggle();
});

function initDashboardRouter() {
    console.log('🚀 Initializing Dashboard Router...');
    
    // Set up sidebar navigation
    setupSidebarNavigation();
    
    // Your existing content is already visible, just initialize it
    initializeCurrentSection();
    
    // Update notification badges
    updateNotificationBadges();
}

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link[data-section]');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            if (section) {
                loadSection(section);
                updateActiveNavLink(this);
                updateBreadcrumb(section);
            }
        });
    });
}

function initializeCurrentSection() {
    // Initialize whatever section is currently active
    const activeSection = document.querySelector('.sidebar-nav .nav-link.active')?.getAttribute('data-section') || 'browse';
    initSectionJavaScript(activeSection);
}

function loadSection(section) {
    console.log('📂 Loading section:', section);
    
    const contentArea = document.getElementById('contentArea');
    
    // Store current scroll position if needed
    const scrollPos = window.scrollY;
    
    switch(section) {
        case 'browse':
            loadBrowsePropertiesContent();
            break;
            
        case 'applications':
            loadApplicationsContent();
            break;
            
        case 'overview':
            loadOverviewContent();
            break;
            
        default:
            loadDefaultContent(section);
            break;
    }
    
    // Reinitialize section-specific JavaScript
    setTimeout(() => {
        initSectionJavaScript(section);
        window.scrollTo(0, 0); // Scroll to top on section change
    }, 100);
}

function loadBrowsePropertiesContent() {
    const contentArea = document.getElementById('contentArea');
    
    // Your original browse properties content
    contentArea.innerHTML = `
        <!-- Rent Hero Section -->
        <section class="rent-hero" aria-label="Find your property">
            <div class="hero-background">
                <div class="hero-overlay"></div>
            </div>
            
            <div class="hero-inner">
                <h1 class="hero-title">Find Your Perfect Rental</h1>
                <p class="hero-subtitle">Discover verified rental properties across Lagos with professional management</p>
            </div>

            <!-- Search wrapper -->
            <div class="search-wrap" role="search" aria-label="Property search box">
                <div class="search-box">
                    <!-- Tabs - Property Categories -->
                    <div class="tabs" role="tablist" aria-label="Property type">
                        <button class="tab active" data-type="rent" role="tab" aria-selected="true">🏠 For Rent</button>
                        <button class="tab" data-type="shortlet" role="tab" aria-selected="false" onclick="window.location.href='/dashboard-shortlet.html'">🏨 Short Lets</button>
                        <button class="tab" data-type="commercial" role="tab" aria-selected="false" onclick="window.location.href='/dashboard-commercial.html'">🏢 Commercial</button>
                        <button class="tab" data-type="student" role="tab" aria-selected="false" onclick="window.location.href='/dashboard-student.html'">🎓 Student Housing</button>
                        <button class="tab" data-type="buy" role="tab" aria-selected="false" onclick="window.location.href='/dashboard-buy.html'">💰 Buy</button>
                    </div>

                    <!-- Filters grid -->
                    <div class="filters" id="filtersGrid">
                        <!-- Area Type -->
                        <div class="filter-select-wrapper">
                            <select id="areaTypeSelect" aria-label="Choose Mainland or Island">
                                <option value="">Area Type</option>
                                <option value="mainland">Lagos Mainland</option>
                                <option value="island">Lagos Island</option>
                            </select>
                        </div>

                        <!-- Location (populated based on Area Type) -->
                        <div class="filter-select-wrapper">
                            <select id="locationSelect" aria-label="Choose location">
                                <option value="">Location</option>
                            </select>
                        </div>

                        <!-- Property Type (populated based on tab selection) -->
                        <div class="filter-select-wrapper">
                            <select id="typeSelect" aria-label="Property type">
                                <option value="">Property Type</option>
                                <option value="apartment">Apartment</option>
                                <option value="self-contain">Self Contain</option>
                                <option value="mini-flat">Mini Flat</option>
                                <option value="duplex">Duplex</option>
                                <option value="bungalow">Bungalow</option>
                                <option value="shared">Shared Apartment</option>
                            </select>
                        </div>

                        <!-- Bedrooms -->
                        <div class="filter-select-wrapper">
                            <select id="bedroomsSelect" aria-label="Bedrooms">
                                <option value="">Bedrooms</option>
                                <option value="1">1 Bedroom</option>
                                <option value="2">2 Bedrooms</option>
                                <option value="3">3 Bedrooms</option>
                                <option value="4">4+ Bedrooms</option>
                            </select>
                        </div>

                        <!-- Min Price -->
                        <div class="filter-select-wrapper">
                            <select id="minPriceSelect" aria-label="Minimum price">
                                <option value="">Min. Price</option>
                                <option value="50000">₦50,000/year</option>
                                <option value="100000">₦100,000/year</option>
                                <option value="300000">₦300,000/year</option>
                                <option value="500000">₦500,000/year</option>
                                <option value="1000000">₦1,000,000/year</option>
                            </select>
                        </div>

                        <!-- Max Price -->
                        <div class="filter-select-wrapper">
                            <select id="maxPriceSelect" aria-label="Maximum price">
                                <option value="">Max. Price</option>
                                <option value="200000">₦200,000/year</option>
                                <option value="500000">₦500,000/year</option>
                                <option value="1000000">₦1,000,000/year</option>
                                <option value="2000000">₦2,000,000/year</option>
                                <option value="5000000">₦5,000,000+</option>
                            </select>
                        </div>
                    </div>

                    <!-- Search input row -->
                    <div class="search-row">
                        <input id="searchInput" class="search-input" type="search" placeholder="Search rental properties by name, estate, or features (e.g. 'Lekki 3 bedroom')" aria-label="Search input" />
                        <button class="search-btn" id="doSearch" aria-label="Search">
                            <i class="fas fa-search"></i>
                            Search
                        </button>
                    </div>

                    <div class="helper">Choose <strong>Area Type</strong> first to see available locations. All properties are <strong>verified by DomiHive</strong></div>
                </div>
            </div>
        </section>

        <!-- Properties Grid Section -->
        <section class="properties-section">
            <div class="container">
                <div class="properties-header">
                    <h2>Available Rental Properties</h2>
                    <div class="results-info">
                        <span id="results-count">80+</span> rental properties found
                    </div>
                </div>

                <div class="properties-layout">
                    <!-- Advanced Filter Sidebar -->
                    <aside class="filter-sidebar">
                        <div class="filter-header">
                            <h3>Advanced Filters</h3>
                            <button class="clear-filters" id="clearFilters">Clear All</button>
                        </div>

                        <!-- Your existing advanced filters content -->
                        <div class="filter-group">
                            <h4>Price Range (₦/year)</h4>
                            <div class="price-inputs">
                                <input type="number" id="minPrice" placeholder="Min" class="price-input">
                                <span>-</span>
                                <input type="number" id="maxPrice" placeholder="Max" class="price-input">
                            </div>
                            <div class="price-slider">
                                <input type="range" id="priceRange" min="0" max="10000000" step="100000" class="range-slider">
                            </div>
                        </div>

                        <!-- Add all your other filter groups here -->
                        <div class="filter-group">
                            <h4>Bedrooms</h4>
                            <div class="filter-options">
                                <label class="filter-option">
                                    <input type="checkbox" name="bedrooms" value="1">
                                    <span>1 Bedroom</span>
                                </label>
                                <label class="filter-option">
                                    <input type="checkbox" name="bedrooms" value="2">
                                    <span>2 Bedrooms</span>
                                </label>
                                <!-- ... rest of your filters -->
                            </div>
                        </div>
                    </aside>

                    <!-- Properties Grid -->
                    <div class="properties-grid-container">
                        <!-- Sort Options -->
                        <div class="sort-options">
                            <span>Sort by:</span>
                            <select id="sortSelect" class="sort-select">
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                                <option value="verified">Verified First</option>
                            </select>
                            <div class="view-options">
                                <button class="view-btn active" data-view="grid">
                                    <i class="fas fa-th"></i>
                                </button>
                                <button class="view-btn" data-view="list">
                                    <i class="fas fa-list"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Properties Grid -->
                        <div class="properties-grid" id="propertiesGrid">
                            <!-- Property cards will be dynamically loaded here -->
                        </div>

                        <!-- Loading More -->
                        <div class="load-more-container">
                            <button class="load-more-btn" id="loadMore">
                                <i class="fas fa-spinner"></i>
                                Load More Properties
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function loadApplicationsContent() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="applications-content">
            <div class="applications-header">
                <h1>My Applications</h1>
                <p>Manage your property applications and inspection progress</p>
            </div>
            
            <div class="empty-applications">
                <div class="empty-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h2>No Applications Yet</h2>
                <p>You haven't booked any property inspections yet.</p>
                <button class="btn-primary" onclick="loadSection('browse')">
                    <i class="fas fa-search"></i>
                    Browse Properties
                </button>
            </div>
        </div>
    `;
}

function loadOverviewContent() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        
    `;
}

function loadDefaultContent(section) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div class="section-placeholder">
            <div class="placeholder-icon">
                <i class="fas fa-cogs"></i>
            </div>
            <h2>${section.charAt(0).toUpperCase() + section.slice(1)} Section</h2>
            <p>This section is coming soon!</p>
            <button class="btn-primary" onclick="loadSection('browse')">
                Back to Properties
            </button>
        </div>
    `;
}

function initSectionJavaScript(section) {
    console.log('🔄 Initializing JavaScript for:', section);
    
    switch(section) {
        case 'browse':
            initBrowsePropertiesJS();
            break;
        case 'applications':
            initApplicationsJS();
            break;
        case 'overview':
            initOverviewJS();
            break;
    }
    
    // Reinitialize sidebar toggle (important!)
    initSidebarToggle();
}

function initBrowsePropertiesJS() {
    console.log('🏠 Initializing browse properties JavaScript');
    
    // Reinitialize all your existing event listeners
    // This is where you'd call your existing dashboard-rent.js functions
    
    // Example: Reinitialize search functionality
    const searchBtn = document.getElementById('doSearch');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Reinitialize filter functionality
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', handleClearFilters);
    }
    
    // Load property cards
    loadPropertyCards();
    
    // Call your existing initialization function if it exists
    if (window.initRentDashboard) {
        window.initRentDashboard();
    }
}

function initApplicationsJS() {
    console.log('📄 Initializing applications JavaScript');
    // Applications-specific JavaScript will go here
}

function initOverviewJS() {
    console.log('📊 Initializing overview JavaScript');
    // Overview-specific JavaScript will go here
}

function initSidebarToggle() {
    // Your existing sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const dashboardSidebar = document.getElementById('dashboardSidebar');
    
    if (sidebarToggle && dashboardSidebar) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('collapsed');
        });
    }
    
    if (mobileMenuBtn && dashboardSidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('mobile-open');
        });
    }
}

function handleSearch() {
    console.log('🔍 Search triggered');
    // Your existing search functionality
}

function handleClearFilters() {
    console.log('🗑️ Clear filters triggered');
    // Your existing clear filters functionality
}

function loadPropertyCards() {
    console.log('🃏 Loading property cards');
    // Your existing property cards loading functionality
    // This should populate the #propertiesGrid
}

function updateActiveNavLink(clickedLink) {
    const allLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    allLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

function updateBreadcrumb(section) {
    const breadcrumbActive = document.getElementById('breadcrumbActive');
    const sectionNames = {
        'browse': 'Rent Properties',
        'applications': 'My Applications', 
        'overview': 'Overview',
        'inspections': 'Booked Inspections',
        'my-properties': 'My Properties',
        'maintenance': 'Maintenance',
        'payments': 'Payments',
        'favorites': 'Favorites',
        'messages': 'Messages',
        'settings': 'Settings'
    };
    
    breadcrumbActive.textContent = sectionNames[section] || 'Dashboard';
}

function updateNotificationBadges() {
    const applications = JSON.parse(localStorage.getItem('domihive_inspection_bookings')) || [];
    const applicationsBadge = document.getElementById('applicationsBadge');
    
    if (applicationsBadge) {
        applicationsBadge.textContent = applications.length > 0 ? applications.length : '0';
    }
    
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    const unreadNotifications = notifications.filter(n => !n.read).length;
    const headerBadge = document.getElementById('headerNotificationBadge');
    
    if (headerBadge) {
        headerBadge.textContent = unreadNotifications > 0 ? unreadNotifications : '0';
    }
}

// Make functions globally available
window.loadSection = loadSection;
window.updateNotificationBadges = updateNotificationBadges;