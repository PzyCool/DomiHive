// book-inspection.js - Updated Simplified Version
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('property') || urlParams.get('id') || '1';
    const sourceDashboard = urlParams.get('source') || 'rent';

    // Initialize the page
    initBookInspectionPage();
    initEventListeners();

    // Functions
    function initBookInspectionPage() {
        console.log('📅 Initializing Book Inspection Page...');
        
        // Load property data
        const propertyData = getPropertyData(propertyId);
        if (propertyData) {
            updatePropertySummary(propertyData);
        }
        
        // Set minimum date for inspection (today)
        setMinInspectionDate();
        
        // Auto-detect and display user context
        displayUserContext();
        
        console.log('✅ Book inspection page loaded for property:', propertyId);
    }

    function getPropertyData(id) {
        // Mock property data - In real app, fetch from API
        const properties = {
            '1': {
                id: 1,
                title: "Luxury 3-Bedroom Apartment in Ikoyi",
                price: 4500000,
                location: "Ikoyi, Lagos Island",
                bedrooms: 3,
                bathrooms: 3,
                size: "180 sqm",
                image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
            },
            '2': {
                id: 2,
                title: "Modern Student Hostel near UNILAG",
                price: 180000,
                location: "Akoka, Yaba, Lagos Mainland", 
                bedrooms: "shared",
                bathrooms: "shared",
                size: "12 sqm (per room)",
                image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
            },
            '3': {
                id: 3,
                title: "Commercial Space in Victoria Island",
                price: 3200000,
                location: "Victoria Island, Lagos",
                bedrooms: "Office",
                bathrooms: 2,
                size: "250 sqm",
                image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
            }
        };
        
        return properties[id] || properties['1'];
    }

    function updatePropertySummary(property) {
        document.getElementById('inspectionPropertyTitle').textContent = property.title;
        document.getElementById('inspectionPropertyPrice').textContent = `₦${property.price.toLocaleString()}/year`;
        document.getElementById('inspectionPropertyLocation').textContent = property.location;
        document.getElementById('inspectionBedrooms').textContent = property.bedrooms;
        document.getElementById('inspectionBathrooms').textContent = property.bathrooms;
        document.getElementById('inspectionSize').textContent = property.size;
        document.getElementById('inspectionPropertyImage').src = property.image;
    }

    function displayUserContext() {
        const currentUser = getCurrentUser();
        const dashboardNames = {
            'rent': 'Rental Properties',
            'student': 'Student Housing',
            'commercial': 'Commercial Properties',
            'shortlet': 'Short Lets',
            'buy': 'Properties for Sale'
        };

        // Update user display name
        document.getElementById('userDisplayName').textContent = currentUser.name;
        
        // Update dashboard type badge
        const dashboardBadge = document.getElementById('dashboardTypeBadge');
        dashboardBadge.textContent = dashboardNames[sourceDashboard] || 'Rent';
        
        // Add specific color based on dashboard type
        const dashboardColors = {
            'rent': '#3498db',
            'student': '#9b59b6',
            'commercial': '#e74c3c',
            'shortlet': '#f39c12',
            'buy': '#27ae60'
        };
        
        dashboardBadge.style.backgroundColor = dashboardColors[sourceDashboard] || '#3498db';
    }

    function getCurrentUser() {
        // Get user from localStorage or session
        const savedUser = localStorage.getItem('domihive_current_user');
        if (savedUser) {
            return JSON.parse(savedUser);
        }
        
        // Default user data (in real app, this would come from login)
        const defaultUser = {
            id: 'user_' + Date.now(),
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+2348012345678',
            type: sourceDashboard // Auto-detect from source
        };
        
        // Save default user for demo
        localStorage.setItem('domihive_current_user', JSON.stringify(defaultUser));
        return defaultUser;
    }

    function setMinInspectionDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateField = document.getElementById('inspectionDate');
        dateField.min = today;
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateField.value = tomorrow.toISOString().split('T')[0];
        
        // Set default time to 10:00 AM
        document.getElementById('inspectionTime').value = '10:00';
        
        // Set default number of people to 1
        document.getElementById('numberOfPeople').value = '1';
    }

    function initEventListeners() {
        // Form submission
        document.getElementById('inspectionBookingForm').addEventListener('submit', handleFormSubmission);
        
        // Date change validation
        document.getElementById('inspectionDate').addEventListener('change', validateInspectionDate);
        
        // Real-time form validation
        document.getElementById('inspectionTime').addEventListener('change', validateForm);
        document.getElementById('numberOfPeople').addEventListener('change', validateForm);
        document.getElementById('agreeTerms').addEventListener('change', validateForm);
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = getFormData();
            submitInspectionBooking(formData);
        }
    }

    function validateForm() {
        const requiredFields = [
            'inspectionDate',
            'inspectionTime', 
            'numberOfPeople',
            'agreeTerms'
        ];
        
        let isValid = true;

        // Clear previous errors
        clearValidationErrors();

        // Check required fields
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim() && fieldId !== 'agreeTerms') {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (fieldId === 'agreeTerms' && !field.checked) {
                showFieldError(field, 'You must agree to the terms and conditions');
                isValid = false;
            }
        });

        // Validate date is not in past
        const dateField = document.getElementById('inspectionDate');
        if (dateField.value && new Date(dateField.value) < new Date().setHours(0,0,0,0)) {
            showFieldError(dateField, 'Inspection date cannot be in the past');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#e53e3e';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e53e3e;
            font-size: 0.8rem;
            margin-top: 0.3rem;
        `;
    }

    function clearValidationErrors() {
        const fields = document.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
        
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
    }

    function validateInspectionDate() {
        const dateField = document.getElementById('inspectionDate');
        const selectedDate = new Date(dateField.value);
        const today = new Date().setHours(0,0,0,0);
        
        if (selectedDate < today) {
            showFieldError(dateField, 'Inspection date cannot be in the past');
            return false;
        }
        
        return true;
    }

    function getFormData() {
        const propertyData = getPropertyData(propertyId);
        const currentUser = getCurrentUser();
        const numberOfPeople = document.getElementById('numberOfPeople').value;
        const peopleText = numberOfPeople === '1' ? '1 person' : `${numberOfPeople} people`;
        
        return {
            // Property Information
            propertyId: propertyId,
            propertyTitle: propertyData.title,
            propertyLocation: propertyData.location,
            propertyType: sourceDashboard,
            
            // User Information (auto-filled)
            userId: currentUser.id,
            userName: currentUser.name,
            userEmail: currentUser.email,
            userPhone: currentUser.phone,
            userType: sourceDashboard,
            
            // Inspection Details
            inspectionDate: document.getElementById('inspectionDate').value,
            inspectionTime: document.getElementById('inspectionTime').value,
            inspectionNotes: document.getElementById('inspectionNotes').value,
            numberOfPeople: numberOfPeople,
            attendeesText: peopleText,
            
            // System Information
            agreeTerms: document.getElementById('agreeTerms').checked,
            bookingDate: new Date().toISOString(),
            bookingId: 'DOMI-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            status: 'pending',
            sourceDashboard: sourceDashboard
        };
    }

    function submitInspectionBooking(formData) {
        console.log('📅 Submitting inspection booking:', formData);
        
        // Show loading state
        const submitBtn = document.querySelector('#inspectionBookingForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Save booking to storage
            saveBookingToStorage(formData);
            
            // Create notification
            createBookingNotification(formData);
            
            // Show success modal
            showSuccessModal(formData);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    function saveBookingToStorage(bookingData) {
        // Save to bookings storage
        let bookings = JSON.parse(localStorage.getItem('domihive_inspection_bookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('domihive_inspection_bookings', JSON.stringify(bookings));
        
        // Save as current booking for application flow
        sessionStorage.setItem('domihive_current_booking', JSON.stringify(bookingData));
        
        // Update user type if needed
        sessionStorage.setItem('domihive_user_type', bookingData.userType);
        
        console.log('💾 Booking saved to storage:', bookingData.bookingId);
    }

    function createBookingNotification(bookingData) {
        const notification = {
            id: 'notif_' + Date.now(),
            type: 'inspection_booked',
            title: 'Inspection Scheduled',
            message: `Your inspection for ${bookingData.propertyTitle} is scheduled for ${formatDateTime(bookingData.inspectionDate, bookingData.inspectionTime)}`,
            timestamp: new Date().toISOString(),
            read: false,
            action: 'view_application',
            propertyId: bookingData.propertyId,
            bookingId: bookingData.bookingId
        };
        
        // Save to notifications
        let notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
        notifications.unshift(notification); // Add to beginning
        localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
        
        // Update notification badge count
        updateNotificationBadge();
        
        console.log('🔔 Notification created:', notification);
    }

    function updateNotificationBadge() {
        const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Update badge in header (if exists)
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount > 0 ? unreadCount : '';
        }
    }

    function showSuccessModal(bookingData) {
        // Update modal content with booking details
        document.getElementById('summaryPropertyTitle').textContent = bookingData.propertyTitle;
        document.getElementById('summaryDateTime').textContent = formatDateTime(bookingData.inspectionDate, bookingData.inspectionTime);
        document.getElementById('summaryLocation').textContent = bookingData.propertyLocation;
        document.getElementById('summaryAttendees').textContent = bookingData.attendeesText;
        
        // Show modal
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
        
        // Auto-redirect after 10 seconds if user doesn't click
        setTimeout(() => {
            if (modal.style.display === 'flex') {
                redirectToDashboard();
            }
        }, 10000);
    }

    function formatDateTime(date, time) {
        const dateObj = new Date(date + 'T' + time);
        return dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) + ' at ' + formatTime(time);
    }

    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    function closeSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
        modal.classList.remove('active');
        
        // Reset form for potential new booking
        document.getElementById('inspectionBookingForm').reset();
        setMinInspectionDate();
    }

    function redirectToDashboard() {
        const dashboardPages = {
            'rent': 'dashboard-rent.html',
            'student': 'dashboard-student.html',
            'commercial': 'dashboard-commercial.html',
            'shortlet': 'dashboard-shortlet.html',
            'buy': 'dashboard-buy.html'
        };
        
        const targetDashboard = dashboardPages[sourceDashboard] || 'dashboard-rent.html';
        console.log('🔄 Redirecting to:', targetDashboard);
        window.location.href = targetDashboard;
    }

    function proceedToApplication() {
        const bookingData = JSON.parse(sessionStorage.getItem('domihive_current_booking'));
        
        if (bookingData) {
            console.log('🚀 Proceeding to application after inspection:', bookingData.bookingId);
            
            // Set flow type to inspection
            sessionStorage.setItem('domihive_application_flow', 'inspection');
            
            // Redirect to application page
            window.location.href = `/Pages/application.html?propertyId=${bookingData.propertyId}&bookingId=${bookingData.bookingId}&source=${sourceDashboard}`;
        } else {
            // Fallback to dashboard
            redirectToDashboard();
        }
    }

    // Global functions
    window.goBackToProperty = function() {
        // Return to the property details page with context
        window.location.href = `/property-details.html?id=${propertyId}&source=${sourceDashboard}`;
    };

    window.closeSuccessModal = closeSuccessModal;
    window.redirectToDashboard = redirectToDashboard;
    window.proceedToApplication = proceedToApplication;

    // Initialize notification badge on page load
    updateNotificationBadge();
});