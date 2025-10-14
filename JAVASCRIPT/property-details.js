// property-details.js - Property Details Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let propertyId = urlParams.get('id');
    
    // If no ID in URL, use default property for demo
    if (!propertyId) {
        propertyId = '1';
        console.log('ℹ️ No property ID in URL, using default property for demo');
    }
    
    const userType = urlParams.get('userType') || detectUserType();
    
    // Track user type for smart application flow
    if (userType) {
        sessionStorage.setItem('domihive_user_type', userType);
        console.log('👤 User type detected:', userType);
    }

    // Property data
    const propertyData = getPropertyData(propertyId);
    
    // Initialize the page
    initPropertyDetails(propertyData);
    initEventListeners();

    // Functions
    function initPropertyDetails(property) {
        if (!property) {
            showPropertyNotFound();
            return;
        }

        // Update all page content with property data
        updatePropertyContent(property);
        updateImageGallery(property);
        updateVideos(property);
        updateSpecifications(property);
        updateLocationDetails(property);
        updateTermsAndAmenities(property);
        
        console.log('🏠 Property details loaded:', property.title);
    }

    function getPropertyData(id) {
        // Property data with real image paths
        const properties = {
            '1': {
                id: 1,
                title: "Luxury 3-Bedroom Apartment in Ikoyi",
                type: "tenant",
                price: 4500000,
                location: "Ikoyi, Lagos Island",
                bedrooms: 3,
                bathrooms: 3,
                size: "180 sqm",
                propertyType: "Apartment",
                description: "This stunning 3-bedroom apartment offers luxurious living in the heart of Ikoyi. Featuring modern finishes, spacious rooms, and premium amenities, this property is perfect for families seeking comfort and style.",
                
                // Use your actual images
                images: [
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
                ],
                
                // Use your actual videos
                videos: [
                    {
                        title: "Full Property Walkthrough",
                        src: "/ASSECT/6026331_People_Person_3840x2160.mp4",
                        thumbnail: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
                    },
                    {
                        title: "Neighborhood Tour", 
                        src: "/ASSECT/6026331_People_Person_3840x2160.mp4",
                        thumbnail: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
                    }
                ],
                
                highlights: [
                    "Spacious living area with modern furniture",
                    "Fully equipped modern kitchen", 
                    "Master bedroom with ensuite bathroom",
                    "24/7 security and CCTV",
                    "Swimming pool and gym access",
                    "Children's playground"
                ],
                
                features: {
                    building: [
                        "New construction (2023)",
                        "6-floor building with elevator",
                        "Modern architectural design",
                        "Energy efficient windows",
                        "Fire safety system"
                    ],
                    interior: [
                        "Marble flooring in living areas",
                        "Fitted wardrobes in all bedrooms", 
                        "Modern ceiling lights",
                        "Central air conditioning",
                        "Smart home ready"
                    ],
                    exterior: [
                        "Swimming pool",
                        "Children's playground",
                        "Landscaped gardens", 
                        "Secure parking space",
                        "24/7 security guard"
                    ],
                    utilities: [
                        "Constant water supply",
                        "Backup generator",
                        "High-speed fiber internet",
                        "CCTV surveillance",
                        "Waste management"
                    ]
                },
                
                locationDetails: {
                    address: "24 Bourdillon Road, Ikoyi, Lagos",
                    landmarks: [
                        "5 mins to Falomo Shopping Centre",
                        "10 mins to Ikoyi Club",
                        "15 mins to Victoria Island",
                        "20 mins to Lagos Island"
                    ],
                    amenities: [
                        { name: "Shopping Mall", distance: "0.5km", icon: "shopping-cart" },
                        { name: "Hospital", distance: "1.2km", icon: "hospital" },
                        { name: "School", distance: "0.8km", icon: "school" },
                        { name: "Restaurant", distance: "0.3km", icon: "utensils" }
                    ]
                },
                
                terms: {
                    leaseDuration: "1-2 years",
                    paymentTerms: "Annual payment preferred",
                    securityDeposit: "2 months rent",
                    maintenance: "Landlord responsible for major repairs"
                },
                
                isVerified: true,
                isFeatured: true,
                isNew: true
            },
            
            '2': {
                id: 2,
                title: "Modern Student Hostel near UNILAG",
                type: "student", 
                price: 180000,
                location: "Akoka, Yaba, Lagos Mainland",
                bedrooms: "shared",
                bathrooms: "shared",
                size: "12 sqm (per room)",
                propertyType: "Student Hostel",
                description: "Affordable and secure student accommodation located just 10 minutes walk from UNILAG campus. Perfect for students seeking comfortable living with excellent study facilities.",
                
                images: [
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg", 
                    "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
                ],
                
                videos: [
                    {
                        title: "Hostel Tour & Rooms",
                        src: "/ASSECT/6026331_People_Person_3840x2160.mp4",
                        thumbnail: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
                    },
                    {
                        title: "Campus Access Route",
                        src: "/ASSECT/6026331_People_Person_3840x2160.mp4", 
                        thumbnail: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
                    }
                ],
                
                highlights: [
                    "5 minutes walk to UNILAG main gate",
                    "24/7 high-speed WiFi for studies",
                    "Dedicated study rooms and library",
                    "Shared kitchen and common areas",
                    "Secure environment with CCTV",
                    "Laundry facilities available"
                ],
                
                features: {
                    building: [
                        "4-floor purpose-built hostel",
                        "Newly renovated (2024)",
                        "Fire safety compliant", 
                        "24/7 security personnel",
                        "Well-maintained common areas"
                    ],
                    interior: [
                        "Study desk and chair in each room",
                        "Comfortable single bed",
                        "Reading lamp and power outlets",
                        "Storage space and wardrobe",
                        "Shared bathroom facilities"
                    ],
                    exterior: [
                        "Common study areas",
                        "Shared kitchen facilities", 
                        "Laundry room",
                        "Recreation area",
                        "Secure bicycle parking"
                    ],
                    utilities: [
                        "24/7 electricity with generator",
                        "Constant water supply",
                        "High-speed internet",
                        "Regular cleaning service",
                        "Maintenance support"
                    ]
                },
                
                locationDetails: {
                    address: "15 University Road, Akoka, Yaba",
                    landmarks: [
                        "5 mins walk to UNILAG main gate",
                        "10 mins to Yaba Market",
                        "15 mins to Yaba Tech",
                        "20 mins to Lagos Mainland"
                    ],
                    amenities: [
                        { name: "UNILAG Campus", distance: "0.3km", icon: "university" },
                        { name: "Library", distance: "0.5km", icon: "book" },
                        { name: "Supermarket", distance: "0.8km", icon: "shopping-basket" },
                        { name: "Cafeteria", distance: "0.2km", icon: "coffee" }
                    ]
                },
                
                terms: {
                    leaseDuration: "Academic year (9 months)",
                    paymentTerms: "Per semester payment available",
                    securityDeposit: "1 month rent",
                    maintenance: "Hostel management handles all maintenance"
                },
                
                isVerified: true,
                isFeatured: false,
                isNew: true
            }
        };

        return properties[id] || properties['1'];
    }

    function detectUserType() {
        const referrer = document.referrer;
        if (referrer.includes('for-student')) return 'student';
        if (referrer.includes('for-tenant')) return 'tenant';
        return 'general';
    }

    function updatePropertyContent(property) {
        document.getElementById('propertyTitle').textContent = property.title;
        document.getElementById('propertyPrice').textContent = `₦${property.price.toLocaleString()}/year`;
        document.getElementById('propertyLocation').textContent = property.location;
        document.getElementById('propertyId').textContent = property.id;
        document.getElementById('bedroomsCount').textContent = property.bedrooms;
        document.getElementById('bathroomsCount').textContent = property.bathrooms;
        document.getElementById('propertySize').textContent = property.size;
        document.getElementById('propertyType').textContent = property.propertyType;
        document.getElementById('propertyDescription').textContent = property.description;

        // Update badges
        document.getElementById('verifiedBadge').style.display = property.isVerified ? 'block' : 'none';
        document.getElementById('featuredBadge').style.display = property.isFeatured ? 'block' : 'none';
        document.getElementById('newBadge').style.display = property.isNew ? 'block' : 'none';
        
        // Update type badge
        const typeBadge = document.getElementById('typeBadge');
        typeBadge.textContent = property.type === 'student' ? 'For Students' : 'For Tenants';
        typeBadge.style.background = property.type === 'student' ? '#4a90e2' : '#9f7539';

        // Update highlights
        const highlightsList = document.getElementById('propertyHighlights');
        highlightsList.innerHTML = property.highlights.map(highlight => 
            `<li>${highlight}</li>`
        ).join('');
    }

    function updateImageGallery(property) {
        const carouselContainer = document.querySelector('.carousel-container');
        const dotsContainer = document.querySelector('.carousel-dots');
        const thumbnailsContainer = document.querySelector('.thumbnails-container');

        // Clear existing content
        carouselContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        thumbnailsContainer.innerHTML = '';

        // Create slides and thumbnails
        property.images.forEach((image, index) => {
            // Main slides
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `<img src="${image}" alt="Property image ${index + 1}" class="main-property-image">`;
            carouselContainer.appendChild(slide);

            // Dots
            const dot = document.createElement('span');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(index);
            dotsContainer.appendChild(dot);

            // Thumbnails
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}">`;
            thumbnail.onclick = () => goToSlide(index);
            thumbnailsContainer.appendChild(thumbnail);
        });

        // Set first image as main
        if (property.images.length > 0) {
            document.getElementById('mainImage').src = property.images[0];
        }
    }

    function updateVideos(property) {
        const mainVideo = document.getElementById('mainVideo');
        const videoThumbnails = document.querySelector('.video-thumbnails');
        const additionalVideos = document.getElementById('additionalVideos');

        if (property.videos && property.videos.length > 0) {
            // Main video
            const mainVideoData = property.videos[0];
            mainVideo.src = mainVideoData.src;
            mainVideo.poster = mainVideoData.thumbnail;

            // Video thumbnails
            videoThumbnails.innerHTML = property.videos.map((video, index) => `
                <div class="video-thumbnail ${index === 0 ? 'active' : ''}" onclick="playVideo(${index})">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-play-btn">
                        <i class="fas fa-play"></i>
                    </div>
                    <span class="video-title">${video.title}</span>
                </div>
            `).join('');

            // Additional videos (if any)
            if (property.videos.length > 1) {
                additionalVideos.innerHTML = property.videos.slice(1).map(video => `
                    <div class="additional-video">
                        <video controls poster="${video.thumbnail}">
                            <source src="${video.src}" type="video/mp4">
                        </video>
                        <h4>${video.title}</h4>
                    </div>
                `).join('');
            }
        } else {
            document.querySelector('.video-section').style.display = 'none';
        }
    }

    function updateSpecifications(property) {
        document.getElementById('buildingSpecs').innerHTML = property.features.building.map(spec => 
            `<div class="spec-item">${spec}</div>`
        ).join('');

        document.getElementById('interiorSpecs').innerHTML = property.features.interior.map(spec => 
            `<div class="spec-item">${spec}</div>`
        ).join('');

        document.getElementById('exteriorSpecs').innerHTML = property.features.exterior.map(spec => 
            `<div class="spec-item">${spec}</div>`
        ).join('');

        document.getElementById('utilitiesSpecs').innerHTML = property.features.utilities.map(spec => 
            `<div class="spec-item">${spec}</div>`
        ).join('');
    }

    function updateLocationDetails(property) {
        document.getElementById('addressInfo').innerHTML = `
            <p><strong>Full Address:</strong> ${property.locationDetails.address}</p>
            <div class="landmarks">
                <h4>Key Landmarks:</h4>
                <ul>${property.locationDetails.landmarks.map(landmark => `<li>${landmark}</li>`).join('')}</ul>
            </div>
        `;

        document.getElementById('nearbyAmenities').innerHTML = property.locationDetails.amenities.map(amenity => `
            <div class="amenity-item">
                <i class="fas fa-${amenity.icon}"></i>
                <div class="amenity-info">
                    <strong>${amenity.name}</strong>
                    <span>${amenity.distance} away</span>
                </div>
            </div>
        `).join('');
    }

    function updateTermsAndAmenities(property) {
        document.getElementById('leaseDuration').textContent = property.terms.leaseDuration;
        document.getElementById('paymentTerms').textContent = property.terms.paymentTerms;
        document.getElementById('securityDeposit').textContent = property.terms.securityDeposit;
        document.getElementById('maintenanceTerms').textContent = property.terms.maintenance;

        document.getElementById('fullTerms').innerHTML = `
            <p>This property is managed by DomiHive with the following terms:</p>
            <ul>
                <li><strong>Lease Duration:</strong> ${property.terms.leaseDuration}</li>
                <li><strong>Payment Terms:</strong> ${property.terms.paymentTerms}</li>
                <li><strong>Security Deposit:</strong> ${property.terms.securityDeposit}</li>
                <li><strong>Maintenance:</strong> ${property.terms.maintenance}</li>
                <li>All utilities included in the rent</li>
                <li>Property inspection before move-in</li>
                <li>24/7 customer support available</li>
            </ul>
        `;

        document.getElementById('featuresGrid').innerHTML = [
            ...property.features.building,
            ...property.features.interior,
            ...property.features.exterior,
            ...property.features.utilities
        ].map(feature => `
            <div class="feature-item">
                <i class="fas fa-check"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    }

    function initEventListeners() {
        const likeCheckbox = document.getElementById('likeCheckbox');
        const proceedButtonContainer = document.getElementById('proceedButtonContainer');
        
        // Hide proceed button initially
        proceedButtonContainer.style.display = 'none';
        
        likeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                proceedButtonContainer.style.display = 'block';
                setTimeout(() => {
                    proceedButtonContainer.style.opacity = '1';
                    proceedButtonContainer.style.transform = 'translateY(0)';
                }, 10);
                
                // Track liked property
                const propertyId = new URLSearchParams(window.location.search).get('id');
                let likedProperties = JSON.parse(localStorage.getItem('domihive_liked_properties')) || [];
                if (!likedProperties.includes(propertyId)) {
                    likedProperties.push(propertyId);
                    localStorage.setItem('domihive_liked_properties', JSON.stringify(likedProperties));
                }
                
                showLikeSuccess();
                console.log('💖 Property liked by user');
                
            } else {
                proceedButtonContainer.style.opacity = '0';
                proceedButtonContainer.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    proceedButtonContainer.style.display = 'none';
                }, 300);
                
                console.log('💔 Property unliked');
            }
        });

        // FIXED: Ensure event listeners are properly attached
        const proceedToBookBtn = document.getElementById('proceedToBook');
        if (proceedToBookBtn) {
            proceedToBookBtn.addEventListener('click', openBookingModal);
        }

        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeBookingModal);
        }

        const proceedToRentBtn = document.getElementById('proceedToRent');
        if (proceedToRentBtn) {
            proceedToRentBtn.addEventListener('click', proceedToRenting);
        }

        const bookInspectionBtn = document.getElementById('bookInspection');
        if (bookInspectionBtn) {
            bookInspectionBtn.addEventListener('click', bookInspection);
        }

        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }

        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }

        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            bookingModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeBookingModal();
                }
            });
        }

        console.log('✅ Event listeners initialized');
    }

    function showLikeSuccess() {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease;
        `;
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Property added to your interested list!</span>
        `;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
    
    function openBookingModal() {
        console.log('🎯 Opening booking modal...');
        
        const propertyId = new URLSearchParams(window.location.search).get('id');
    
        // Store current property context
        sessionStorage.setItem('domihive_current_property', propertyId);
    
        // FIXED: Use proper modal display with both methods
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            console.log('✅ Modal opened successfully');
        } else {
            console.error('❌ Modal element not found');
        }
    
        console.log('📅 Booking modal opened for property:', propertyId);
    }

    function closeBookingModal() {
        console.log('🎯 Closing booking modal...');
        
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('✅ Modal closed successfully');
        }
    }

    function proceedToRenting() {
        console.log('🎯 Proceeding to renting...');
        
        const userType = sessionStorage.getItem('domihive_user_type') || 'general';
        const propertyId = sessionStorage.getItem('domihive_current_property') || new URLSearchParams(window.location.search).get('id');
        
        // Set flow type to direct application
        sessionStorage.setItem('domihive_application_flow', 'direct');
        
        console.log('🚀 Proceeding to rental application:', { userType, propertyId });
        
        // FIXED: Use proper redirect with fallback
        const applicationUrl = `/Pages/application.html?propertyId=${propertyId}&userType=${userType}&flow=direct`;
        console.log('🔗 Redirecting to:', applicationUrl);
        
        // Close modal first
        closeBookingModal();
        
        // Then redirect
        setTimeout(() => {
            window.location.href = applicationUrl;
        }, 300);
    }

    function bookInspection() {
        console.log('🎯 Booking inspection...');
        
        const userType = sessionStorage.getItem('domihive_user_type') || 'general';
        const propertyId = sessionStorage.getItem('domihive_current_property') || new URLSearchParams(window.location.search).get('id');
        
        // Set flow type to inspection first
        sessionStorage.setItem('domihive_application_flow', 'inspection');
        
        console.log('📅 Booking inspection for property:', { userType, propertyId });
        
        // FIXED: Use proper redirect with fallback
        const inspectionUrl = `/Pages/book-inspection.html?propertyId=${propertyId}&userType=${userType}&flow=inspection`;
        console.log('🔗 Redirecting to:', inspectionUrl);
        
        // Close modal first
        closeBookingModal();
        
        // Then redirect
        setTimeout(() => {
            window.location.href = inspectionUrl;
        }, 300);
    }

    // Carousel functionality
    let currentSlide = 0;

    function goToSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const thumbnails = document.querySelectorAll('.thumbnail-item');

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        thumbnails[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    function showPropertyNotFound() {
        document.querySelector('.property-details-page').innerHTML = `
            <div class="property-not-found">
                <i class="fas fa-search" style="font-size: 4rem; color: #9f7539; margin-bottom: 1rem;"></i>
                <h2>Property Not Found</h2>
                <p>The property you're looking for doesn't exist or has been removed.</p>
                <a href="/Pages/rent.html" class="btn-primary">Back to Properties</a>
            </div>
        `;
    }

    // Global functions for video player
    window.playVideo = function(index) {
        const videos = document.querySelectorAll('.property-video, .additional-video video');
        const videoThumbs = document.querySelectorAll('.video-thumbnail');
        
        videos.forEach(video => video.pause());
        videoThumbs.forEach(thumb => thumb.classList.remove('active'));
        
        if (videos[index]) {
            videos[index].play();
            videoThumbs[index].classList.add('active');
        }
    };

    // Debug function to check if elements exist
    function debugElements() {
        console.log('🔍 Debugging elements:');
        console.log('proceedToBook:', document.getElementById('proceedToBook'));
        console.log('bookingModal:', document.getElementById('bookingModal'));
        console.log('proceedToRent:', document.getElementById('proceedToRent'));
        console.log('bookInspection:', document.getElementById('bookInspection'));
    }

    // Run debug on load
    setTimeout(debugElements, 1000);
});