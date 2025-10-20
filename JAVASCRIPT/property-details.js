// Property Details JavaScript - Simple & Working
document.addEventListener('DOMContentLoaded', function() {
    console.log('Property details page loaded');

    // 1. BACK TO DASHBOARD - SIMPLE
    const backButton = document.getElementById('backToDashboard');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Get which dashboard to return to from URL
            const urlParams = new URLSearchParams(window.location.search);
            const source = urlParams.get('source') || 'rent';
            
            // Redirect to correct dashboard
            if (source === 'student') {
                window.location.href = 'dashboard-student.html';
            } else if (source === 'commercial') {
                window.location.href = 'dashboard-commercial.html';
            } else if (source === 'shortlet') {
                window.location.href = 'dashboard-shortlet.html';
            } else if (source === 'buy') {
                window.location.href = 'dashboard-buy.html';
            } else {
                window.location.href = 'dashboard-rent.html'; // Default
            }
        });
    }

    // 2. MAP DIRECTIONS BUTTON - SIMPLE
    const mapDirectionBtn = document.querySelector('.map-direction-btn');
    if (mapDirectionBtn) {
        mapDirectionBtn.addEventListener('click', function() {
            const address = "24 Bourdillon Road, Ikoyi, Lagos";
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
    }

    // 3. LIKE CHECKBOX - SHOW BOOK INSPECTION BUTTON
    const likeCheckbox = document.getElementById('likeCheckbox');
    const proceedButtonContainer = document.getElementById('proceedButtonContainer');
    
    if (likeCheckbox && proceedButtonContainer) {
        likeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Show the book inspection button
                proceedButtonContainer.style.display = 'block';
                setTimeout(() => {
                    proceedButtonContainer.classList.add('show');
                }, 10);
            } else {
                // Hide the book inspection button
                proceedButtonContainer.classList.remove('show');
                setTimeout(() => {
                    proceedButtonContainer.style.display = 'none';
                }, 300);
            }
        });
    }

    // 4. BOOK INSPECTION BUTTON REDIRECT
    const bookInspectionBtn = document.getElementById('bookInspectionBtn');
    if (bookInspectionBtn) {
        bookInspectionBtn.addEventListener('click', function() {
            // Get property ID from the page
            const propertyId = document.getElementById('propertyId').textContent;
            const source = new URLSearchParams(window.location.search).get('source') || 'rent';
            
            // Redirect to booking page
            window.location.href = `book-inspection.html?property=${propertyId}&source=${source}`;
        });
    }

    // 5. IMAGE CAROUSEL - SIMPLE WORKING VERSION
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Function to show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        if (thumbnails[index]) thumbnails[index].classList.add('active');
        
        currentSlide = index;
    }

    // Next slide function
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        showSlide(nextIndex);
    }

    // Previous slide function
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        showSlide(prevIndex);
    }

    // Add event listeners if elements exist
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Add click events to thumbnails
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => showSlide(index));
    });

    // 6. VIDEO THUMBNAIL SWITCHING
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const mainVideo = document.getElementById('mainVideo');
    
    if (videoThumbnails.length > 0 && mainVideo) {
        videoThumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                videoThumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Change video source based on which thumbnail was clicked
                if (index === 0) {
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-a-residential-building-facade-44517-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=450&fit=crop";
                } else if (index === 1) {
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-countryside-aerial-view-44578-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=450&fit=crop";
                }
                
                // Load and play the new video
                mainVideo.load();
            });
        });
    }

    // 7. UPDATE PROPERTY CONTEXT (which dashboard user came from)
    const propertyContext = document.getElementById('propertyContext');
    if (propertyContext) {
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source') || 'rent';
        
        const sourceNames = {
            'rent': 'Rental Properties',
            'student': 'Student Housing', 
            'commercial': 'Commercial Properties',
            'shortlet': 'Short Lets',
            'buy': 'Properties for Sale'
        };
        
        propertyContext.textContent = `Viewing from ${sourceNames[source] || 'Dashboard'}`;
    }

    // 8. SIMPLE IMAGE ERROR HANDLING
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.log('Image failed to load:', e.target.src);
            // Replace broken images with a placeholder
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop';
            e.target.alt = 'Image not available';
        }
    }, true);

    console.log('All JavaScript functionality loaded successfully');
});

// Global function for video play (for onclick in HTML)
function playVideo(index) {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const mainVideo = document.getElementById('mainVideo');
    
    if (videoThumbnails.length > index && mainVideo) {
        // Remove active class from all
        videoThumbnails.forEach(thumb => thumb.classList.remove('active'));
        // Add active to clicked
        videoThumbnails[index].classList.add('active');
        
        // Change video source
        if (index === 0) {
            mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-a-residential-building-facade-44517-large.mp4";
        } else if (index === 1) {
            mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-countryside-aerial-view-44578-large.mp4";
        }
        
        mainVideo.load();
        mainVideo.play();
    }
}

// Global function for map directions (for onclick in HTML)
function openGoogleMapsDirections() {
    const address = "24 Bourdillon Road, Ikoyi, Lagos";
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
}