// dashboard-core.js - Complete Core Framework
class DomiHiveDashboard {
    constructor() {
        this.currentSection = 'browse';
        this.isInitialized = false;
        this.currentUser = null;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 DomiHive Dashboard Core Initialized');
        
        // Load user first (required for everything)
        this.loadUserData();
        
        // Setup core framework
        this.setupCoreInteractions();
        this.setupNavigation();
        this.loadInitialSection();
        this.updateNotificationBadges();
        
        this.isInitialized = true;
    }

    // ===== USER MANAGEMENT =====
    loadUserData() {
        const userData = localStorage.getItem('domihive_current_user');
        const userAvatar = localStorage.getItem('domihive_user_avatar');
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUserInterface(this.currentUser, userAvatar);
                console.log('👤 User loaded:', this.currentUser.name);
            } catch (error) {
                console.error('Error loading user data:', error);
                this.redirectToLogin();
            }
        } else {
            console.log('❌ No user found, redirecting to login');
            this.redirectToLogin();
        }
    }

    updateUserInterface(user, avatarUrl) {
        // Update sidebar
        const sidebarUserName = document.getElementById('sidebarUserName');
        const sidebarAvatar = document.getElementById('userAvatarImg');
        
        // Update header
        const headerUserName = document.getElementById('headerUserName');
        const headerAvatar = document.getElementById('headerAvatarImg');
        
        if (sidebarUserName) sidebarUserName.textContent = user.name;
        if (headerUserName) headerUserName.textContent = user.name;
        
        const avatarSrc = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=9f7539&color=fff`;
        if (sidebarAvatar) sidebarAvatar.src = avatarSrc;
        if (headerAvatar) headerAvatar.src = avatarSrc;
    }

    redirectToLogin() {
        window.location.href = './login.html';
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('domihive_current_user');
            localStorage.removeItem('domihive_user_avatar');
            localStorage.removeItem('domihive_remembered_phone');
            localStorage.removeItem('domihive_user_favorites');
            window.location.href = '/index.html';
        }
    }

    // ===== CORE INTERACTIONS =====
    setupCoreInteractions() {
        this.setupSidebarToggle();
        this.setupUserMenu();
        this.setupMobileMenu();
        console.log('✅ Core interactions setup complete');
    }

    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('dashboardSidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                this.saveSidebarState(sidebar.classList.contains('collapsed'));
            });
            
            this.loadSidebarState(sidebar);
        }
    }

    setupUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('dashboardSidebar');
        
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
            
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 900 && 
                    !sidebar.contains(e.target) && 
                    !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            });
        }
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link[data-section]');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section, link);
            });
        });
    }

    navigateToSection(section, clickedLink = null) {
        console.log(`🔄 Navigating to section: ${section}`);
        
        this.currentSection = section;
        this.updateActiveNavLink(clickedLink);
        this.updateBreadcrumb(section);
        this.loadSectionContent(section);
        this.updateURL(section);
    }

    updateActiveNavLink(clickedLink) {
        const allLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        allLinks.forEach(link => link.classList.remove('active'));
        
        if (clickedLink) {
            clickedLink.classList.add('active');
        } else {
            const currentLink = document.querySelector(`.sidebar-nav .nav-link[data-section="${this.currentSection}"]`);
            if (currentLink) currentLink.classList.add('active');
        }
    }

    updateBreadcrumb(section) {
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
        
        if (breadcrumbActive) {
            breadcrumbActive.textContent = sectionNames[section] || 'Dashboard';
        }
    }

    loadSectionContent(section) {
        const contentArea = document.getElementById('contentArea');
        
        switch(section) {
            case 'browse':
                this.loadBrowseProperties();
                break;
            case 'applications':
                this.loadApplications();
                break;
            case 'overview':
                this.loadOverview();
                break;
            default:
                this.loadDefaultSection(section);
                break;
        }
    }

    // ===== SECTION CONTENT =====
    loadBrowseProperties() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = this.getBrowsePropertiesHTML();
        
        // Initialize rent properties AFTER content is loaded
        setTimeout(() => {
            if (window.initializeRentProperties) {
                window.initializeRentProperties();
            }
        }, 100);
    }

    getBrowsePropertiesHTML() {
        return `
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
                            <button class="tab" data-type="shortlet" role="tab" aria-selected="false">🏨 Short Lets</button>
                            <button class="tab" data-type="commercial" role="tab" aria-selected="false">🏢 Commercial</button>
                            <button class="tab" data-type="student" role="tab" aria-selected="false">🎓 Hostels</button>
                            <button class="tab" data-type="buy" role="tab" aria-selected="false">💰 Buy</button>
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

                            <!-- Location -->
                            <div class="filter-select-wrapper">
                                <select id="locationSelect" aria-label="Choose location">
                                    <option value="">Location</option>
                                </select>
                            </div>

                            <!-- Property Type -->
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

                            <!-- Price Range -->
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

                            <!-- Bedrooms & Bathrooms -->
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
                                    <label class="filter-option">
                                        <input type="checkbox" name="bedrooms" value="3">
                                        <span>3 Bedrooms</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="bedrooms" value="4">
                                        <span>4+ Bedrooms</span>
                                    </label>
                                </div>
                            </div>

                            <div class="filter-group">
                                <h4>Bathrooms</h4>
                                <div class="filter-options">
                                    <label class="filter-option">
                                        <input type="checkbox" name="bathrooms" value="1">
                                        <span>1 Bathroom</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="bathrooms" value="2">
                                        <span>2 Bathrooms</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="bathrooms" value="3">
                                        <span>3+ Bathrooms</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Property Type -->
                            <div class="filter-group">
                                <h4>Property Type</h4>
                                <div class="filter-options">
                                    <label class="filter-option">
                                        <input type="checkbox" name="propertyType" value="apartment">
                                        <span>Apartment</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="propertyType" value="house">
                                        <span>House</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="propertyType" value="duplex">
                                        <span>Duplex</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="propertyType" value="studio">
                                        <span>Studio</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="propertyType" value="shared">
                                        <span>Shared</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Furnishing -->
                            <div class="filter-group">
                                <h4>Furnishing</h4>
                                <div class="filter-options">
                                    <label class="filter-option">
                                        <input type="checkbox" name="furnishing" value="furnished">
                                        <span>Furnished</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="furnishing" value="semi-furnished">
                                        <span>Semi-Furnished</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="furnishing" value="unfurnished">
                                        <span>Unfurnished</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Amenities -->
                            <div class="filter-group">
                                <h4>Amenities</h4>
                                <div class="filter-options">
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="wifi">
                                        <span>WiFi</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="parking">
                                        <span>Parking</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="security">
                                        <span>24/7 Security</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="pool">
                                        <span>Swimming Pool</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="gym">
                                        <span>Gym</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="ac">
                                        <span>Air Conditioning</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="generator">
                                        <span>Generator</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="amenities" value="water">
                                        <span>Constant Water</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Location Areas -->
                            <div class="filter-group">
                                <h4>Location Areas</h4>
                                <div class="filter-options">
                                    <label class="filter-option">
                                        <input type="checkbox" name="area" value="mainland">
                                        <span>Mainland Areas</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="area" value="island">
                                        <span>Island Areas</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Pet Policy -->
                            <div class="filter-group">
                                <h4>Pet Policy</h4>
                                <div class="filter-options">
                                    <label class="filter-option">
                                        <input type="checkbox" name="pets" value="allowed">
                                        <span>Pets Allowed</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="pets" value="not-allowed">
                                        <span>No Pets</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Property Age -->
                            <div class="filter-group">
                                <h4>Property Age</h4>
                                <div class="filter-options">
                                    <label class="filter-option">
                                        <input type="checkbox" name="age" value="new">
                                        <span>New (0-2 years)</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="age" value="modern">
                                        <span>Modern (3-10 years)</span>
                                    </label>
                                    <label class="filter-option">
                                        <input type="checkbox" name="age" value="established">
                                        <span>Established (10+ years)</span>
                                    </label>
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

   loadApplications() {
    const contentArea = document.getElementById('contentArea');
    
    // Show loading state
    contentArea.innerHTML = `
        <div class="loading-section">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <h2>Loading Applications...</h2>
        </div>
    `;
    
    // Load your actual applications HTML
    fetch('/Pages/applications-rent.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            console.log('✅ Applications page loaded successfully');
            
            // Initialize applications JavaScript after content loads
            setTimeout(() => {
                if (window.initializeApplications) {
                    window.initializeApplications();
                }
            }, 100);
        })
        .catch(error => {
            console.error('❌ Error loading applications page:', error);
            contentArea.innerHTML = `
                <div class="error-section">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>Unable to Load Applications</h2>
                    <p>There was an error loading the applications page. Please try again.</p>
                    <button class="btn-primary" onclick="dashboard.navigateToSection('applications')">
                        <i class="fas fa-redo"></i>
                        Retry
                    </button>
                </div>
            `;
        });
}

    loadOverview() {
    const contentArea = document.getElementById('contentArea');
    
    // Show loading state
    contentArea.innerHTML = `
        <div class="loading-section">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <h2>Loading Dashboard...</h2>
        </div>
    `;
    
    // Load the overview HTML file
    fetch('/Pages/overview-rent.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            console.log('✅ Overview page loaded successfully');
            
            // Initialize overview JavaScript after content loads
            setTimeout(() => {
                if (window.initializeOverview) {
                    window.initializeOverview();
                }
                
                // Also update the breadcrumb
                this.updateBreadcrumb('overview');
            }, 100);
        })
        .catch(error => {
            console.error('❌ Error loading overview page:', error);
            contentArea.innerHTML = `
                <div class="error-section">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>Unable to Load Overview</h2>
                    <p>There was an error loading the dashboard overview. Please try again.</p>
                    <button class="btn-primary" onclick="dashboard.loadOverview()">
                        <i class="fas fa-redo"></i>
                        Retry
                    </button>
                </div>
            `;
        });
}

    loadDefaultSection(section) {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="section-placeholder">
                <div class="placeholder-icon">
                    <i class="fas fa-cogs"></i>
                </div>
                <h2>${section.charAt(0).toUpperCase() + section.slice(1)} Section</h2>
                <p>This section is coming soon!</p>
                <button class="btn-primary" onclick="dashboard.navigateToSection('browse')">
                    Back to Properties
                </button>
            </div>
        `;
    }

    loadInitialSection() {
        const urlParams = new URLSearchParams(window.location.search);
        const sectionFromURL = urlParams.get('section');
        
        if (sectionFromURL && this.isValidSection(sectionFromURL)) {
            this.navigateToSection(sectionFromURL);
        } else {
            this.navigateToSection('browse');
        }
    }

    isValidSection(section) {
        const validSections = [
            'browse', 'applications', 'overview', 'inspections', 
            'my-properties', 'maintenance', 'payments', 'favorites', 
            'messages', 'settings'
        ];
        return validSections.includes(section);
    }

    updateURL(section) {
        const newURL = `${window.location.pathname}?section=${section}`;
        window.history.pushState({ section }, '', newURL);
    }

    updateNotificationBadges() {
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

    saveSidebarState(isCollapsed) {
        localStorage.setItem('domihive_sidebar_collapsed', isCollapsed);
    }

    loadSidebarState(sidebar) {
        const isCollapsed = localStorage.getItem('domihive_sidebar_collapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
    }
}

// Create global dashboard instance
const dashboard = new DomiHiveDashboard();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    dashboard.init();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.section) {
        dashboard.navigateToSection(event.state.section);
    }
});

// Make dashboard globally available
window.dashboard = dashboard;
window.handleLogout = () => dashboard.handleLogout();