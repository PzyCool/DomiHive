// book-inspection.js - Book Inspection Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    const userType = urlParams.get('userType') || 'general';
    const flowType = urlParams.get('flow') || 'inspection';

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
        
        // Pre-fill user type if available
        prefillUserType();
        
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

    function setMinInspectionDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('inspectionDate').min = today;
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('inspectionDate').value = tomorrow.toISOString().split('T')[0];
    }

    function prefillUserType() {
        const savedUserType = sessionStorage.getItem('domihive_user_type');
        if (savedUserType) {
            document.getElementById('userType').value = savedUserType;
        }
    }

    function initEventListeners() {
        // Form submission
        document.getElementById('inspectionBookingForm').addEventListener('submit', handleFormSubmission);
        
        // Date change validation
        document.getElementById('inspectionDate').addEventListener('change', validateInspectionDate);
        
        // Success modal buttons
        document.querySelector('.modal-actions .btn-primary').addEventListener('click', proceedToApplication);
        document.querySelector('.modal-actions .btn-secondary').addEventListener('click', closeSuccessModal);
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = getFormData();
            submitInspectionBooking(formData);
        }
    }

    function validateForm() {
        const form = document.getElementById('inspectionBookingForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous errors
        clearValidationErrors();

        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate email
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate date is not in past
        const dateField = document.getElementById('inspectionDate');
        if (dateField.value && new Date(dateField.value) < new Date().setHours(0,0,0,0)) {
            showFieldError(dateField, 'Inspection date cannot be in the past');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
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
        
        return {
            propertyId: propertyId,
            propertyTitle: propertyData.title,
            propertyLocation: propertyData.location,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            userType: document.getElementById('userType').value,
            inspectionDate: document.getElementById('inspectionDate').value,
            inspectionTime: document.getElementById('inspectionTime').value,
            inspectionNotes: document.getElementById('inspectionNotes').value,
            numberOfPeople: document.getElementById('numberOfPeople').value,
            agreeTerms: document.getElementById('agreeTerms').checked,
            bookingDate: new Date().toISOString(),
            bookingId: 'DOMI-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
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
            // Save booking to localStorage
            saveBookingToStorage(formData);
            
            // Show success modal
            showSuccessModal(formData);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function saveBookingToStorage(bookingData) {
        let bookings = JSON.parse(localStorage.getItem('domihive_inspection_bookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('domihive_inspection_bookings', JSON.stringify(bookings));
        
        // Also store current booking for application flow
        sessionStorage.setItem('domihive_current_booking', JSON.stringify(bookingData));
        sessionStorage.setItem('domihive_user_type', bookingData.userType);
    }

    function showSuccessModal(bookingData) {
        // Update modal content
        document.getElementById('summaryPropertyTitle').textContent = bookingData.propertyTitle;
        document.getElementById('summaryDateTime').textContent = formatDateTime(bookingData.inspectionDate, bookingData.inspectionTime);
        document.getElementById('summaryLocation').textContent = bookingData.propertyLocation;
        
        // Show modal
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
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
        
        // Reset form
        document.getElementById('inspectionBookingForm').reset();
        setMinInspectionDate();
    }

    function proceedToApplication() {
        const bookingData = JSON.parse(sessionStorage.getItem('domihive_current_booking'));
        const userType = bookingData?.userType || 'general';
        
        console.log('🚀 Proceeding to application after inspection:', { userType, propertyId });
        
        // Set flow type to inspection
        sessionStorage.setItem('domihive_application_flow', 'inspection');
        
        // Redirect to application page
        window.location.href = `/Pages/application.html?propertyId=${propertyId}&userType=${userType}&flow=inspection`;
    }

    // Global functions
    window.goBackToProperty = function() {
        window.history.back();
    };

    window.closeSuccessModal = closeSuccessModal;
    window.proceedToApplication = proceedToApplication;
});