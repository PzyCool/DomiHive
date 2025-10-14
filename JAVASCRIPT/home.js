// Process Section Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
    const processSteps = document.querySelectorAll('.process-step');
    
    // Initial state - hide all steps
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-50px)';
        
        // For even steps (right side)
        if (parseInt(step.dataset.step) % 2 === 0) {
            step.style.transform = 'translateX(50px)';
        }
        
        // Reset icons to inactive state
        const stepIcon = step.querySelector('.step-icon');
        const stepIconI = step.querySelector('.step-icon i');
        const stepContent = step.querySelector('.step-content');
        const stepDot = step;
        
        stepIcon.style.background = 'var(--white)';
        stepIcon.style.boxShadow = 'none';
        stepIcon.style.transform = 'scale(1)';
        stepIconI.style.color = 'var(--accent-color)';
        stepContent.style.background = 'var(--light-gray)';
        stepContent.style.boxShadow = 'none';
        stepContent.style.transform = 'translateY(0)';
        stepDot.style.setProperty('--dot-scale', '0');
        stepDot.style.setProperty('--dot-shadow', 'none');
    });

    // Create Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const processObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Step is in view - animate it in
                animateStepIn(entry.target);
            } else {
                // Step is out of view - animate it out (for reverse scroll)
                animateStepOut(entry.target);
            }
        });
    }, observerOptions);

    // Observe each process step
    processSteps.forEach(step => {
        processObserver.observe(step);
    });

    function animateStepIn(step) {
        const stepNumber = parseInt(step.dataset.step);
        const delay = (stepNumber - 1) * 200; // Stagger animation
        
        setTimeout(() => {
            // Animate main step container
            step.style.transition = 'all 0.8s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
            
            // Animate icon
            const stepIcon = step.querySelector('.step-icon');
            const stepIconI = step.querySelector('.step-icon i');
            stepIcon.style.transition = 'all 0.5s ease 0.3s';
            stepIcon.style.background = 'var(--accent-color)';
            stepIcon.style.boxShadow = '0 10px 30px rgba(159, 117, 57, 0.3)';
            stepIcon.style.transform = 'scale(1.1)';
            stepIconI.style.transition = 'all 0.5s ease 0.3s';
            stepIconI.style.color = 'var(--white)';
            
            // Animate content card
            const stepContent = step.querySelector('.step-content');
            stepContent.style.transition = 'all 0.5s ease 0.5s';
            stepContent.style.background = 'var(--white)';
            stepContent.style.boxShadow = '0 10px 40px rgba(14, 31, 66, 0.1)';
            stepContent.style.transform = 'translateY(-5px)';
            
            // Animate connector dot
            step.style.setProperty('--dot-scale', '1');
            step.style.setProperty('--dot-shadow', '0 0 0 8px rgba(159, 117, 57, 0.2)');
            
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
        stepIcon.style.transition = 'all 0.4s ease';
        stepIcon.style.background = 'var(--white)';
        stepIcon.style.boxShadow = 'none';
        stepIcon.style.transform = 'scale(1)';
        stepIconI.style.transition = 'all 0.4s ease';
        stepIconI.style.color = 'var(--accent-color)';
        
        // Reset content card
        const stepContent = step.querySelector('.step-content');
        stepContent.style.transition = 'all 0.4s ease';
        stepContent.style.background = 'var(--light-gray)';
        stepContent.style.boxShadow = 'none';
        stepContent.style.transform = 'translateY(0)';
        
        // Reset connector dot
        step.style.setProperty('--dot-scale', '0');
        step.style.setProperty('--dot-shadow', 'none');
    }

    // Add CSS variables for dot animation
    const style = document.createElement('style');
    style.textContent = `
        .process-step::before {
            transform: scale(var(--dot-scale, 0));
            box-shadow: var(--dot-shadow, none);
            transition: all 0.5s ease 0.3s;
        }
    `;
    document.head.appendChild(style);
});

// DEBUG VERSION - Features Section Animations
function initFeaturesAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    const featuresSection = document.querySelector('.features-section');
    
    console.log('=== DEBUG FEATURES ANIMATIONS ===');
    console.log('Feature cards found:', featureCards.length);
    console.log('Features section found:', !!featuresSection);
    
    if (featureCards.length === 0) {
        console.error('No feature cards found! Check your HTML structure.');
        return;
    }

    // Make cards immediately visible for testing
    featureCards.forEach((card, index) => {
        console.log(`Card ${index + 1}:`, card);
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.background = '#f0f8ff'; // Blue background to see them clearly
        card.style.border = '2px solid red';
    });

    // After 3 seconds, apply the animations
    setTimeout(() => {
        console.log('Applying animations now...');
        
        featureCards.forEach((card, index) => {
            card.style.background = '';
            card.style.border = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });

        // Now set up the intersection observer
        const featureObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                console.log('Intersection observed:', entry.isIntersecting, entry.target);
                
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const cardNumber = parseInt(card.dataset.feature) || 0;
                    const delay = cardNumber * 100;
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.classList.add('active');
                        console.log('Animated card:', cardNumber);
                    }, delay);
                } else {
                    const card = entry.target;
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.classList.remove('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });

        featureCards.forEach(card => {
            featureObserver.observe(card);
        });
        
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', initFeaturesAnimations);

// Users Section Scroll Animations
function initUsersAnimations() {
    const userCards = document.querySelectorAll('.user-card');
    
    if (userCards.length === 0) return;

    // Initial state
    userCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });

    // Intersection Observer
    const usersObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = (parseInt(card.dataset.user === 'tenant' ? 1 : 2) - 1) * 200;
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.classList.add('active');
                }, delay);
            } else {
                const card = entry.target;
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.classList.remove('active');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe each user card
    userCards.forEach(card => {
        usersObserver.observe(card);
    });
}

// Add to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    initFeaturesAnimations();
    initUsersAnimations(); // Add this line
});

// Trust Section Scroll Animations
function initTrustAnimations() {
    const trustFeatures = document.querySelectorAll('.trust-feature');
    const trustStats = document.querySelectorAll('.trust-stat');
    
    if (trustFeatures.length === 0) return;

    // Initial state
    trustFeatures.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-50px)';
        feature.style.transition = 'all 0.6s ease';
    });

    trustStats.forEach(stat => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        stat.style.transition = 'all 0.6s ease';
    });

    // Intersection Observer for trust features
    const trustObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = (parseInt(element.dataset.trust) || parseInt(element.dataset.stat) || 0) * 200;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = element.classList.contains('trust-feature') ? 'translateX(0)' : 'translateY(0)';
                    element.classList.add('active');
                }, delay);
            } else {
                const element = entry.target;
                if (element.classList.contains('trust-feature')) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateX(-50px)';
                    if (parseInt(element.dataset.trust) % 2 === 0) {
                        element.style.transform = 'translateX(50px)';
                    }
                } else {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                }
                element.classList.remove('active');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    trustFeatures.forEach(feature => trustObserver.observe(feature));
    trustStats.forEach(stat => trustObserver.observe(stat));
}

// Update your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    initFeaturesAnimations();
    initUsersAnimations();
    initTrustAnimations(); // Add this line
});

// Mobile App Section - Complete Walkthrough Demo
function initAppSection() {
    console.log('🚀 Initializing App Demo Section');
    
    const appSection = document.querySelector('.app-section');
    if (!appSection) {
        console.log('❌ App section not found');
        return;
    }

    const appScreens = document.querySelectorAll('.app-screen');
    const demoDots = document.querySelectorAll('.demo-dots .dot');
    const featureItems = document.querySelectorAll('.feature-item');
    const currentScreenElement = document.querySelector('.current-screen');
    
    if (appScreens.length === 0) {
        console.log('❌ No app screens found');
        return;
    }

    console.log(`📱 Found ${appScreens.length} app screens`);

    // Demo configuration
    const config = {
        screenDuration: 3000, // 3 seconds per screen
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
        console.log('🎬 Starting app demo');
        
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

        console.log('🔄 Auto-rotation started');
    }

    // Stop auto-rotation
    function stopAutoRotation() {
        if (screenInterval) {
            clearInterval(screenInterval);
            screenInterval = null;
            console.log('⏹️ Auto-rotation stopped');
        }
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

        console.log(`🔄 Switching from screen ${currentScreenIndex} to ${newIndex}`);

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
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Manual dot controls
    demoDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log(`🎯 Manual navigation to screen ${index}`);
            
            // Stop auto-rotation temporarily
            stopAutoRotation();
            
            // Show selected screen
            showScreen(index);
            
            // Restart auto-rotation after longer delay
            setTimeout(() => {
                if (config.autoPlay) {
                    startAutoRotation();
                }
            }, 10000); // Wait 10 seconds before resuming
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
        console.log('✨ Animating feature items');
        featureItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.classList.add('active');
            }, index * 100 + 200);
        });
    }

    function resetFeatures() {
        featureItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.classList.remove('active');
        });
    }

    // Intersection Observer for scroll animations
    const appObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('👀 App section in view - starting demo');
                
                // Start demo
                initDemo();
                animateFeatures();
                
            } else {
                console.log('👋 App section out of view - pausing demo');
                
                // Stop demo and reset
                stopAutoRotation();
                resetFeatures();
                
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

    // Download button handlers
    function initDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-btn');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isPlayStore = this.classList.contains('play-store');
                const storeName = isPlayStore ? 'Google Play Store' : 'Apple App Store';
                
                console.log(`📲 Download button clicked: ${storeName}`);
                
                // Show loading state
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><div><span>Preparing</span><strong>Download...</strong></div>';
                this.disabled = true;
                
                // Simulate download process
                setTimeout(() => {
                    alert(`🚀 DomiHive app download for ${storeName} will be available soon!\n\nThis will redirect to the actual app store when the app is published.`);
                    
                    // Restore button
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    
                    // For future implementation:
                    // if (isPlayStore) {
                    //     window.location.href = 'https://play.google.com/store/apps/details?id=com.domihive.app';
                    // } else {
                    //     window.location.href = 'https://apps.apple.com/app/domihive/id123456789';
                    // }
                }, 1000);
            });
        });
    }

    // QR code interaction
    function initQRCode() {
        const qrCode = document.querySelector('.qr-code');
        
        if (qrCode) {
            qrCode.addEventListener('click', function() {
                console.log('📷 QR code clicked');
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Show QR info
                alert('📱 QR Code Scanner\n\nWhen the DomiHive app is published, this QR code will direct users to download the app from their respective app stores.\n\nFor now, use the download buttons above to get notified when the app launches!');
            });
            
            // Add hover effect
            qrCode.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                this.style.transform = 'translateY(-2px)';
            });
            
            qrCode.addEventListener('mouseleave', function() {
                this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                this.style.transform = 'translateY(0)';
            });
        }
    }

    // Feature button hover effects in demo
    function initFeatureButtonInteractions() {
        const featureButtons = document.querySelectorAll('.feature-btn');
        
        featureButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            });
        });
    }

    // Initialize everything
    function init() {
        console.log('🎛️ Initializing app section components');
        
        initFeatureAnimations();
        initDownloadButtons();
        initQRCode();
        initFeatureButtonInteractions();
        
        // Observe the app section
        appObserver.observe(appSection);
        
        console.log('✅ App section fully initialized');
    }

    // Start initialization
    init();

    // Return control functions for external use
    return {
        showScreen: (index) => showScreen(index),
        play: () => startAutoRotation(),
        pause: () => stopAutoRotation(),
        next: () => showNextScreen(),
        getCurrentScreen: () => currentScreenIndex
    };
}

// Global initialization with error handling
let appDemoController = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM fully loaded');
    
    try {
        appDemoController = initAppSection();
        
        // Initialize other sections
        if (typeof initFeaturesAnimations === 'function') initFeaturesAnimations();
        if (typeof initUsersAnimations === 'function') initUsersAnimations();
        if (typeof initTrustAnimations === 'function') initTrustAnimations();
        
        console.log('🎉 All sections initialized successfully');
        
    } catch (error) {
        console.error('💥 Error initializing app section:', error);
    }
});

// Fallback initialization for when DOM is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppSection);
} else {
    setTimeout(initAppSection, 100);
}

// Make controller available globally for debugging
window.appDemo = {
    getController: () => appDemoController,
    showScreen: (index) => appDemoController?.showScreen(index),
    play: () => appDemoController?.play(),
    pause: () => appDemoController?.pause()
};

// Performance optimization: Pause when page is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('⏸️ Page hidden - pausing demo');
        appDemoController?.pause();
    } else {
        console.log('▶️ Page visible - demo can resume');
        // Demo will resume when section comes into view again
    }
});

// Debug helper: Log demo state
console.log('🔧 App demo controller available as window.appDemo');


// Final CTA Section Animations
function initFinalCTA() {
    console.log('🎯 Initializing Final CTA Section');
    
    const finalCTASection = document.querySelector('.final-cta');
    if (!finalCTASection) {
        console.log('❌ Final CTA section not found');
        return;
    }

    const ctaCards = document.querySelectorAll('.cta-card');
    const trustBadge = document.querySelector('.trust-badge');
    
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
                console.log('✨ Animating Final CTA elements');
                
                // Animate cards with stagger
                ctaCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.classList.add('active');
                    }, index * 200);
                });

                // Animate trust badge
                if (trustBadge) {
                    setTimeout(() => {
                        trustBadge.style.opacity = '1';
                        trustBadge.style.transform = 'translateY(0)';
                        trustBadge.classList.add('active');
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
            
            // Log the action
            const card = this.closest('.cta-card');
            const cardType = card ? card.getAttribute('data-card') : 'unknown';
            console.log(`📝 CTA Card clicked: ${cardType}`);
        });
    });
}

// Update main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM fully loaded - initializing all sections');
    
    // Initialize all sections in order
    if (typeof initFeaturesAnimations === 'function') initFeaturesAnimations();
    if (typeof initUsersAnimations === 'function') initUsersAnimations();
    if (typeof initTrustAnimations === 'function') initTrustAnimations();
    if (typeof initAppSection === 'function') initAppSection();
    if (typeof initFinalCTA === 'function') initFinalCTA();
    
    console.log('🎉 All homepage sections initialized successfully');
});

// Footer Animations (Optional)
function initFooterAnimations() {
    console.log('🦶 Initializing Footer');
    
    const footer = document.querySelector('.main-footer');
    if (!footer) return;

    const hierarchyItems = document.querySelectorAll('.hierarchy-item');
    
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

// Update main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM fully loaded - initializing all sections');
    
    // Initialize all sections
    if (typeof initFeaturesAnimations === 'function') initFeaturesAnimations();
    if (typeof initUsersAnimations === 'function') initUsersAnimations();
    if (typeof initTrustAnimations === 'function') initTrustAnimations();
    if (typeof initAppSection === 'function') initAppSection();
    if (typeof initFinalCTA === 'function') initFinalCTA();
    if (typeof initFooterAnimations === 'function') initFooterAnimations();
    
    console.log('🎉 All sections including footer initialized successfully');
});