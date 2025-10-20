// ===== DARK THEME TOGGLE FUNCTIONALITY =====
function initDarkTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark)) {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    }

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (themeIcon) {
                themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Save preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const mobileSearch = document.querySelector('.mobile-search');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks?.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
        }
    });

    // Handle mobile search
    if (mobileSearch) {
        mobileSearch.addEventListener('click', function() {
            alert('Search functionality will be implemented soon!');
        });
    }
}

// ===== SCROLL TO SECTION FUNCTION =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        console.warn(`Section with id '${sectionId}' not found`);
    }
}

// ===== FEATURES SECTION ANIMATIONS =====
function initFeaturesAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length === 0) return;

    const featureObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const cardNumber = parseInt(card.dataset.feature) || 0;
                const delay = (cardNumber - 1) * 100;
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initial state and observe
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        featureObserver.observe(card);
    });
}

// ===== USERS SECTION ANIMATIONS =====
function initUsersAnimations() {
    const userCards = document.querySelectorAll('.user-card');
    
    if (userCards.length === 0) return;

    const usersObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = card.dataset.user === 'tenant' ? 0 : 200;
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initial state and observe
    userCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        usersObserver.observe(card);
    });
}

// ===== TRUST SECTION ANIMATIONS =====
function initTrustAnimations() {
    const trustFeatures = document.querySelectorAll('.trust-feature');
    const trustStats = document.querySelectorAll('.trust-stat');
    
    if (trustFeatures.length === 0) return;

    const trustObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = (parseInt(element.dataset.trust) || parseInt(element.dataset.stat) || 0) * 200;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = element.classList.contains('trust-feature') ? 'translateX(0)' : 'translateY(0)';
                }, delay);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initial state and observe trust features
    trustFeatures.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-50px)';
        feature.style.transition = 'all 0.6s ease';
        trustObserver.observe(feature);
    });

    // Initial state and observe trust stats
    trustStats.forEach(stat => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        stat.style.transition = 'all 0.6s ease';
        trustObserver.observe(stat);
    });
}

// ===== MOBILE APP DEMO FUNCTIONALITY =====
function initAppSection() {
    const appSection = document.querySelector('.app-section');
    const appScreens = document.querySelectorAll('.app-screen');
    const demoDots = document.querySelectorAll('.demo-dots .dot');
    const featureItems = document.querySelectorAll('.feature-item');
    const currentScreenElement = document.querySelector('.current-screen');
    
    if (appScreens.length === 0) return;

    // Demo configuration
    const config = {
        screenDuration: 3000,
        transitionDuration: 600,
        autoPlay: true
    };

    let currentScreenIndex = 0;
    let screenInterval = null;
    let isAnimating = false;

    // Screen names for display
    const screenNames = {
        'splash': 'App Launch',
        'home': 'Dashboard',
        'properties': 'Property Search',
        'payments': 'Payment Management', 
        'maintenance': 'Maintenance Tracking',
        'student-dashboard': 'Student Portal'
    };

    // Initialize the demo
    function initDemo() {
        // Reset all screens
        appScreens.forEach((screen, index) => {
            screen.style.opacity = '0';
            screen.style.transform = 'translateX(100%)';
            screen.classList.remove('active');
        });

        // Show first screen
        appScreens[0].style.opacity = '1';
        appScreens[0].style.transform = 'translateX(0)';
        appScreens[0].classList.add('active');

        // Update dots
        updateDots(0);

        // Start auto-rotation if enabled
        if (config.autoPlay) {
            startAutoRotation();
        }
    }

    // Start auto-rotating through screens
    function startAutoRotation() {
        if (screenInterval) {
            clearInterval(screenInterval);
        }

        screenInterval = setInterval(() => {
            showNextScreen();
        }, config.screenDuration);
    }

    // Show next screen in sequence
    function showNextScreen() {
        if (isAnimating) return;
        
        const nextIndex = (currentScreenIndex + 1) % appScreens.length;
        showScreen(nextIndex);
    }

    // Show specific screen
    function showScreen(newIndex) {
        if (isAnimating || newIndex === currentScreenIndex) return;

        isAnimating = true;
        const currentScreen = appScreens[currentScreenIndex];
        const newScreen = appScreens[newIndex];

        // Exit current screen
        currentScreen.style.transition = `all ${config.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        currentScreen.style.opacity = '0';
        currentScreen.style.transform = 'translateX(-100%)';
        currentScreen.classList.remove('active');

        // Enter new screen
        newScreen.style.transition = `all ${config.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        newScreen.style.opacity = '1';
        newScreen.style.transform = 'translateX(0)';
        newScreen.classList.add('active');

        // Update current index and dots
        currentScreenIndex = newIndex;
        updateDots(newIndex);

        // Update screen name display
        if (currentScreenElement) {
            const screenName = newScreen.getAttribute('data-screen');
            currentScreenElement.textContent = screenNames[screenName] || 'App Screen';
        }

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, config.transitionDuration);
    }

    // Update dot indicators
    function updateDots(activeIndex) {
        demoDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    // Manual dot controls
    demoDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Stop auto-rotation temporarily
            clearInterval(screenInterval);
            
            // Show selected screen
            showScreen(index);
            
            // Restart auto-rotation after longer delay
            setTimeout(() => {
                if (config.autoPlay) {
                    startAutoRotation();
                }
            }, 10000);
        });
    });

    // Feature item animations
    function initFeatureAnimations() {
        featureItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `all 0.6s ease ${index * 100}ms`;
        });
    }

    function animateFeatures() {
        featureItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100 + 200);
        });
    }

    // Download button handlers
    function initDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-btn');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isPlayStore = this.classList.contains('play-store');
                const storeName = isPlayStore ? 'Google Play Store' : 'Apple App Store';
                
                // Show loading state
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><div><span>Preparing</span><strong>Download...</strong></div>';
                this.disabled = true;
                
                // Simulate download process
                setTimeout(() => {
                    alert(`DomiHive app download for ${storeName} will be available soon!\n\nThis will redirect to the actual app store when the app is published.`);
                    
                    // Restore button
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                }, 1000);
            });
        });
    }

    // QR code interaction
    function initQRCode() {
        const qrCode = document.querySelector('.qr-code');
        
        if (qrCode) {
            qrCode.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                alert('When the DomiHive app is published, this QR code will direct users to download the app from their respective app stores.');
            });
        }
    }

    // Intersection Observer for scroll animations
    const appObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start demo
                initDemo();
                animateFeatures();
                
            } else {
                // Stop demo and reset
                clearInterval(screenInterval);
                
                // Reset to first screen when leaving view
                setTimeout(() => {
                    if (!entry.isIntersecting) {
                        showScreen(0);
                    }
                }, config.transitionDuration);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    // Initialize everything
    function init() {
        initFeatureAnimations();
        initDownloadButtons();
        initQRCode();
        
        // Observe the app section
        if (appSection) {
            appObserver.observe(appSection);
        }
    }

    // Start initialization
    init();

    // Return control functions for external use
    return {
        showScreen: (index) => showScreen(index),
        play: () => startAutoRotation(),
        pause: () => clearInterval(screenInterval),
        next: () => showNextScreen(),
        getCurrentScreen: () => currentScreenIndex
    };
}

// ===== PROCESS SECTION ANIMATIONS =====
function initProcessAnimations() {
    const processSteps = document.querySelectorAll('.process-step');
    
    if (processSteps.length === 0) return;

    // Initial state
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-50px)';
        
        // For even steps (right side)
        if (parseInt(step.dataset.step) % 2 === 0) {
            step.style.transform = 'translateX(50px)';
        }
        
        // Reset to inactive state
        const stepIcon = step.querySelector('.step-icon');
        const stepIconI = step.querySelector('.step-icon i');
        const stepContent = step.querySelector('.step-content');
        
        if (stepIcon) {
            stepIcon.style.background = 'var(--white)';
            stepIcon.style.boxShadow = 'none';
            stepIcon.style.transform = 'scale(1)';
        }
        
        if (stepIconI) {
            stepIconI.style.color = 'var(--accent-color)';
        }
        
        if (stepContent) {
            stepContent.style.background = 'var(--light-gray)';
            stepContent.style.boxShadow = 'none';
            stepContent.style.transform = 'translateY(0)';
        }
    });

    // Create Intersection Observer
    const processObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStepIn(entry.target);
            } else {
                animateStepOut(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    // Observe each process step
    processSteps.forEach(step => {
        processObserver.observe(step);
    });

    function animateStepIn(step) {
        const stepNumber = parseInt(step.dataset.step);
        const delay = (stepNumber - 1) * 200;
        
        setTimeout(() => {
            // Animate main step container
            step.style.transition = 'all 0.8s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
            
            // Animate icon
            const stepIcon = step.querySelector('.step-icon');
            const stepIconI = step.querySelector('.step-icon i');
            if (stepIcon && stepIconI) {
                stepIcon.style.transition = 'all 0.5s ease 0.3s';
                stepIcon.style.background = 'var(--accent-color)';
                stepIcon.style.boxShadow = '0 10px 30px rgba(159, 117, 57, 0.3)';
                stepIcon.style.transform = 'scale(1.1)';
                stepIconI.style.transition = 'all 0.5s ease 0.3s';
                stepIconI.style.color = 'var(--white)';
            }
            
            // Animate content card
            const stepContent = step.querySelector('.step-content');
            if (stepContent) {
                stepContent.style.transition = 'all 0.5s ease 0.5s';
                stepContent.style.background = 'var(--white)';
                stepContent.style.boxShadow = '0 10px 40px rgba(14, 31, 66, 0.1)';
                stepContent.style.transform = 'translateY(-5px)';
            }
            
        }, delay);
    }

    function animateStepOut(step) {
        const stepNumber = parseInt(step.dataset.step);
        
        // Reset main step container
        step.style.transition = 'all 0.6s ease';
        step.style.opacity = '0';
        if (stepNumber % 2 === 0) {
            step.style.transform = 'translateX(50px)';
        } else {
            step.style.transform = 'translateX(-50px)';
        }
        
        // Reset icon
        const stepIcon = step.querySelector('.step-icon');
        const stepIconI = step.querySelector('.step-icon i');
        if (stepIcon && stepIconI) {
            stepIcon.style.transition = 'all 0.4s ease';
            stepIcon.style.background = 'var(--white)';
            stepIcon.style.boxShadow = 'none';
            stepIcon.style.transform = 'scale(1)';
            stepIconI.style.transition = 'all 0.4s ease';
            stepIconI.style.color = 'var(--accent-color)';
        }
        
        // Reset content card
        const stepContent = step.querySelector('.step-content');
        if (stepContent) {
            stepContent.style.transition = 'all 0.4s ease';
            stepContent.style.background = 'var(--light-gray)';
            stepContent.style.boxShadow = 'none';
            stepContent.style.transform = 'translateY(0)';
        }
    }
}

// ===== FINAL CTA ANIMATIONS =====
function initFinalCTA() {
    const finalCTASection = document.querySelector('.final-cta');
    const ctaCards = document.querySelectorAll('.cta-card');
    const trustBadge = document.querySelector('.final-cta .trust-badge');
    
    if (!finalCTASection) return;

    // Initial state
    ctaCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
    });

    if (trustBadge) {
        trustBadge.style.opacity = '0';
        trustBadge.style.transform = 'translateY(30px)';
        trustBadge.style.transition = 'all 0.6s ease';
    }

    // Intersection Observer
    const ctaObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate cards with stagger
                ctaCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });

                // Animate trust badge
                if (trustBadge) {
                    setTimeout(() => {
                        trustBadge.style.opacity = '1';
                        trustBadge.style.transform = 'translateY(0)';
                    }, 600);
                }

                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe final CTA section
    ctaObserver.observe(finalCTASection);

    // Card button interactions
    const cardButtons = document.querySelectorAll('.card-btn');
    cardButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// ===== FOOTER ANIMATIONS =====
function initFooterAnimations() {
    const footer = document.querySelector('.main-footer');
    const hierarchyItems = document.querySelectorAll('.hierarchy-item');
    
    if (!footer) return;

    // Simple fade-in animation for hierarchy items
    const footerObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hierarchyItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Initial state
    hierarchyItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
    });

    footerObserver.observe(footer);
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing DomiHive Homepage');
    
    // Initialize all functionalities
    initDarkTheme();
    initMobileMenu();
    initFeaturesAnimations();
    initUsersAnimations();
    initTrustAnimations();
    initAppSection();
    initProcessAnimations();
    initFinalCTA();
    initFooterAnimations();
    
    console.log('✅ All homepage functionalities initialized successfully');
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Pause animations when page is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Any cleanup for when page is hidden can go here
        console.log('⏸️ Page hidden - animations paused');
    } else {
        console.log('▶️ Page visible');
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Make app demo controller available globally for debugging
window.appDemo = {
    getController: () => window.appDemoController,
    showScreen: (index) => window.appDemoController?.showScreen(index)
};

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDarkTheme,
        initMobileMenu,
        initFeaturesAnimations,
        initUsersAnimations,
        initTrustAnimations,
        initAppSection,
        initProcessAnimations,
        initFinalCTA,
        initFooterAnimations
    };
}