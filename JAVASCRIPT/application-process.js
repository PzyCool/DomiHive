// application.js - Complete Rental Application Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeRentalApplication();
});

// Global variables
let currentUser = null;
let currentProperty = null;
let uploadedFiles = {
    governmentId: null,
    proofOfIncome: null,
    additionalDocuments: []
};

function initializeRentalApplication() {
    console.log('🏠 Initializing Rental Application...');
    
    // Load user data and property information
    loadUserData();
    loadPropertyData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Prefill user information
    prefillUserData();
    
    console.log('✅ Rental application initialized');
}

function loadUserData() {
    // Get current user from localStorage or session
    const userData = localStorage.getItem('domihive_current_user') || 
                    sessionStorage.getItem('domihive_current_user');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        console.log('👤 User data loaded:', currentUser);
    } else {
        // Demo user data for testing
        currentUser = {
            id: 'user_' + Date.now(),
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+2348012345678',
            userType: 'tenant',
            dashboardSource: 'dashboard-rent'
        };
        console.log('⚠️ Using demo user data');
    }
    
    // Update hidden fields
    document.getElementById('userId').value = currentUser.id;
    document.getElementById('dashboardSource').value = currentUser.dashboardSource || 'dashboard-rent';
}

function loadPropertyData() {
    // Get property data from URL parameters or session
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('propertyId') || 
                      sessionStorage.getItem('current_property_id');
    
    if (propertyId) {
        currentProperty = getPropertyById(propertyId);
        document.getElementById('propertyId').value = propertyId;
    } else {
        // Demo property data
        currentProperty = {
            id: 'prop_1',
            title: "Luxury 3-Bedroom Apartment in Ikoyi",
            price: 4500000,
            location: "Ikoyi, Lagos Island",
            bedrooms: 3,
            bathrooms: 3,
            size: "180 sqm",
            image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
        };
    }
    
    updatePropertyDisplay();
}

function getPropertyById(propertyId) {
    // Mock property data - In real app, fetch from API
    const properties = {
        'prop_1': {
            id: 'prop_1',
            title: "Luxury 3-Bedroom Apartment in Ikoyi",
            price: 4500000,
            location: "Ikoyi, Lagos Island",
            bedrooms: 3,
            bathrooms: 3,
            size: "180 sqm",
            image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
        },
        'prop_2': {
            id: 'prop_2',
            title: "Modern 2-Bedroom Flat in Lekki",
            price: 2800000,
            location: "Lekki Phase 1, Lagos",
            bedrooms: 2,
            bathrooms: 2,
            size: "120 sqm",
            image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg"
        }
    };
    
    return properties[propertyId] || properties['prop_1'];
}

function updatePropertyDisplay() {
    if (!currentProperty) return;
    
    document.getElementById('applicationPropertyTitle').textContent = currentProperty.title;
    document.getElementById('applicationPropertyPrice').textContent = `₦${currentProperty.price.toLocaleString()}/year`;
    document.getElementById('applicationPropertyLocation').textContent = currentProperty.location;
    document.getElementById('applicationBedrooms').textContent = currentProperty.bedrooms;
    document.getElementById('applicationBathrooms').textContent = currentProperty.bathrooms;
    document.getElementById('applicationSize').textContent = currentProperty.size;
    
    if (currentProperty.image) {
        document.getElementById('applicationPropertyImage').src = currentProperty.image;
    }
}

function prefillUserData() {
    if (!currentUser) return;
    
    // Prefill user information
    document.getElementById('prefilledFullName').textContent = currentUser.fullName || 'Not provided';
    document.getElementById('prefilledEmail').textContent = currentUser.email || 'Not provided';
    document.getElementById('prefilledPhone').textContent = currentUser.phone || 'Not provided';
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('rentalApplicationForm').addEventListener('submit', handleFormSubmission);
    
    // File upload handlers
    document.getElementById('governmentId').addEventListener('change', handleFileUpload);
    document.getElementById('proofOfIncome').addEventListener('change', handleFileUpload);
    document.getElementById('additionalDocuments').addEventListener('change', handleAdditionalDocuments);
    
    // Real-time validation
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Employment section toggle
    document.getElementById('employmentDetails').style.display = 'none';
}

// Yes/No Button Handlers
function setRentalHistory(hasHistory) {
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    const detailsSection = document.getElementById('rentalHistoryDetails');
    const hiddenInput = document.getElementById('hasRentalHistory');
    
    // Update button states
    yesBtn.classList.toggle('active', hasHistory);
    noBtn.classList.toggle('active', !hasHistory);
    
    // Update hidden input
    hiddenInput.value = hasHistory;
    
    // Show/hide details section
    detailsSection.style.display = hasHistory ? 'block' : 'none';
    
    // Toggle required fields
    const detailInputs = detailsSection.querySelectorAll('input, textarea');
    detailInputs.forEach(input => {
        input.required = hasHistory;
        if (!hasHistory) {
            input.value = '';
            clearFieldError({ target: input });
        }
    });
}

function setEmploymentStatus(isEmployed) {
    const yesBtn = document.querySelectorAll('.yes-btn')[1];
    const noBtn = document.querySelectorAll('.no-btn')[1];
    const detailsSection = document.getElementById('employmentDetails');
    const hiddenInput = document.getElementById('isEmployed');
    
    // Update button states
    yesBtn.classList.toggle('active', isEmployed);
    noBtn.classList.toggle('active', !isEmployed);
    
    // Update hidden input
    hiddenInput.value = isEmployed;
    
    // Show/hide details section
    detailsSection.style.display = isEmployed ? 'block' : 'none';
    
    // Toggle required fields
    const detailInputs = detailsSection.querySelectorAll('input, select');
    detailInputs.forEach(input => {
        input.required = isEmployed;
        if (!isEmployed) {
            input.value = '';
            clearFieldError({ target: input });
        }
    });
}

// File Upload Handlers
function handleFileUpload(event) {
    const file = event.target.files[0];
    const inputId = event.target.id;
    const previewContainer = document.getElementById(inputId + 'Preview');
    
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
        showFieldError(event.target, 'Please upload PDF, JPG, PNG, or DOC files only');
        event.target.value = '';
        return;
    }
    
    // Store file reference
    if (inputId === 'governmentId') {
        uploadedFiles.governmentId = file;
    } else if (inputId === 'proofOfIncome') {
        uploadedFiles.proofOfIncome = file;
    }
    
    // Create preview
    createFilePreview(file, previewContainer, inputId);
    clearFieldError({ target: event.target });
}

function handleAdditionalDocuments(event) {
    const files = Array.from(event.target.files);
    const previewContainer = document.getElementById('additionalDocumentsPreview');
    
    // Clear existing additional documents
    uploadedFiles.additionalDocuments = [];
    previewContainer.innerHTML = '';
    
    files.forEach(file => {
        // Validate file type
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            showNotification('Skipped invalid file type: ' + file.name, 'error');
            return;
        }
        
        // Store file reference
        uploadedFiles.additionalDocuments.push(file);
        
        // Create preview
        createFilePreview(file, previewContainer, 'additional');
    });
}

function createFilePreview(file, container, type) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    
    previewItem.innerHTML = `
        <i class="fas ${fileIcon} file-icon"></i>
        <span class="file-name">${file.name}</span>
        <span class="file-size">(${fileSize})</span>
        <button type="button" class="remove-file" onclick="removeFile('${type}', '${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(previewItem);
}

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf':
            return 'fa-file-pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return 'fa-file-image';
        case 'doc':
        case 'docx':
            return 'fa-file-word';
        default:
            return 'fa-file';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(type, filename) {
    if (type === 'governmentId') {
        uploadedFiles.governmentId = null;
        document.getElementById('governmentId').value = '';
        document.getElementById('governmentIdPreview').innerHTML = '';
    } else if (type === 'proofOfIncome') {
        uploadedFiles.proofOfIncome = null;
        document.getElementById('proofOfIncome').value = '';
        document.getElementById('proofOfIncomePreview').innerHTML = '';
    } else if (type === 'additional') {
        uploadedFiles.additionalDocuments = uploadedFiles.additionalDocuments.filter(
            file => file.name !== filename
        );
        // Re-render additional documents preview
        const previewContainer = document.getElementById('additionalDocumentsPreview');
        previewContainer.innerHTML = '';
        uploadedFiles.additionalDocuments.forEach(file => {
            createFilePreview(file, previewContainer, 'additional');
        });
    }
}

// Form Validation and Submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = collectFormData();
        submitRentalApplication(formData);
    }
}

function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validate required fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim() && field.offsetParent !== null) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate file uploads
    if (!uploadedFiles.governmentId) {
        showFieldError(document.getElementById('governmentId'), 'Government ID is required');
        isValid = false;
    }
    
    if (!uploadedFiles.proofOfIncome) {
        showFieldError(document.getElementById('proofOfIncome'), 'Proof of income is required');
        isValid = false;
    }
    
    // Validate rental history details if applicable
    const hasRentalHistory = document.getElementById('hasRentalHistory').value === 'true';
    if (hasRentalHistory) {
        const rentalFields = document.querySelectorAll('#rentalHistoryDetails [required]');
        rentalFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
    }
    
    // Validate employment details if applicable
    const isEmployed = document.getElementById('isEmployed').value === 'true';
    if (isEmployed) {
        const employmentFields = document.querySelectorAll('#employmentDetails [required]');
        employmentFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
    }
    
    // Validate references
    const reference1Phone = document.getElementById('reference1Phone').value;
    const reference2Phone = document.getElementById('reference2Phone').value;
    
    if (reference1Phone && !isValidPhone(reference1Phone)) {
        showFieldError(document.getElementById('reference1Phone'), 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (reference2Phone && !isValidPhone(reference2Phone)) {
        showFieldError(document.getElementById('reference2Phone'), 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateField(event) {
    const field = event.target;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
        return;
    }
    
    // Specific validations
    switch (field.type) {
        case 'tel':
            if (field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
            } else {
                clearFieldError(field);
            }
            break;
        case 'number':
            if (field.value && field.value < 0) {
                showFieldError(field, 'Please enter a valid number');
            } else {
                clearFieldError(field);
            }
            break;
        default:
            clearFieldError(field);
    }
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
}

function clearFieldError(event) {
    const field = event.target;
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidationErrors() {
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
    
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
}

function collectFormData() {
    const applicationData = {
        // Application metadata
        applicationId: 'RENT-APP-' + Date.now(),
        propertyId: currentProperty.id,
        propertyTitle: currentProperty.title,
        propertyLocation: currentProperty.location,
        userId: currentUser.id,
        dashboardSource: document.getElementById('dashboardSource').value,
        applicationDate: new Date().toISOString(),
        status: 'submitted',
        
        // Background Information
        backgroundInfo: {
            fullName: currentUser.fullName,
            email: currentUser.email,
            phone: currentUser.phone,
            currentAddress: document.getElementById('currentAddress').value,
            yearsAtCurrentAddress: document.getElementById('yearsAtCurrentAddress').value
        },
        
        // Rental History
        rentalHistory: {
            hasRentalHistory: document.getElementById('hasRentalHistory').value === 'true',
            previousLandlordName: document.getElementById('previousLandlordName').value,
            previousLandlordPhone: document.getElementById('previousLandlordPhone').value,
            previousRentAmount: document.getElementById('previousRentAmount').value,
            reasonForLeaving: document.getElementById('reasonForLeaving').value
        },
        
        // Employment & Income
        employmentInfo: {
            isEmployed: document.getElementById('isEmployed').value === 'true',
            occupation: document.getElementById('occupation').value,
            employer: document.getElementById('employer').value,
            employmentType: document.getElementById('employmentType').value,
            monthlyIncome: document.getElementById('monthlyIncome').value,
            workDuration: document.getElementById('workDuration').value
        },
        
        // Personal References
        references: [
            {
                name: document.getElementById('reference1Name').value,
                phone: document.getElementById('reference1Phone').value,
                relationship: document.getElementById('reference1Relationship').value,
                yearsKnown: document.getElementById('reference1YearsKnown').value
            },
            {
                name: document.getElementById('reference2Name').value,
                phone: document.getElementById('reference2Phone').value,
                relationship: document.getElementById('reference2Relationship').value,
                yearsKnown: document.getElementById('reference2YearsKnown').value
            }
        ],
        
        // Document Information
        documents: {
            governmentId: uploadedFiles.governmentId ? uploadedFiles.governmentId.name : null,
            proofOfIncome: uploadedFiles.proofOfIncome ? uploadedFiles.proofOfIncome.name : null,
            additionalDocuments: uploadedFiles.additionalDocuments.map(file => file.name)
        },
        
        // Terms Agreement
        agreements: {
            agreeTerms: document.getElementById('agreeTerms').checked,
            agreeScreening: document.getElementById('agreeScreening').checked,
            agreeCommunication: document.getElementById('agreeCommunication').checked
        }
    };
    
    return applicationData;
}

function submitRentalApplication(applicationData) {
    console.log('📝 Submitting rental application:', applicationData);
    
    // Show loading state
    const submitBtn = document.querySelector('#rentalApplicationForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Save application to localStorage
        saveApplication(applicationData);
        
        // Prepare future notification
        prepareTenantNotification(applicationData);
        
        // Show success modal
        showSuccessModal(applicationData);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }, 2000);
}

function saveApplication(applicationData) {
    // Save to localStorage
    let applications = JSON.parse(localStorage.getItem('domihive_rental_applications')) || [];
    applications.push(applicationData);
    localStorage.setItem('domihive_rental_applications', JSON.stringify(applications));
    
    // Store current application in session
    sessionStorage.setItem('current_rental_application', JSON.stringify(applicationData));
    
    console.log('💾 Application saved:', applicationData.applicationId);
}

function prepareTenantNotification(applicationData) {
    // Prepare notification data for when payment is completed
    const notificationData = {
        id: 'notif_' + Date.now(),
        type: 'tenant_approval',
        title: 'Congratulations! You are now a tenant with DomiHive',
        message: `Your application for ${applicationData.propertyTitle} has been approved. Welcome to DomiHive!`,
        applicationId: applicationData.applicationId,
        propertyId: applicationData.propertyId,
        timestamp: new Date().toISOString(),
        read: false,
        actions: [
            {
                text: 'Activate Tenant Mode',
                action: 'activate_tenant_mode',
                propertyId: applicationData.propertyId
            }
        ],
        moveInInstructions: {
            keyCollection: 'Visit our Ikoyi support center with your ID to collect keys',
            utilities: 'Utilities will be activated within 24 hours of key collection',
            supportContact: 'Contact support@domihive.com for any questions'
        }
    };
    
    // Store notification for future use (after payment)
    let pendingNotifications = JSON.parse(localStorage.getItem('domihive_pending_notifications')) || [];
    pendingNotifications.push(notificationData);
    localStorage.setItem('domihive_pending_notifications', JSON.stringify(pendingNotifications));
    
    console.log('📧 Tenant notification prepared for after payment');
}

function showSuccessModal(applicationData) {
    // Update modal content
    document.getElementById('summaryApplicationId').textContent = applicationData.applicationId;
    document.getElementById('summaryPropertyTitle').textContent = applicationData.propertyTitle;
    document.getElementById('summaryApplicantName').textContent = applicationData.backgroundInfo.fullName;
    
    // Show modal
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    modal.classList.add('active');
}

// Global Functions
window.goBackToPrevious = function() {
    window.history.back();
};

window.closeSuccessModal = function() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
};

window.proceedToScreening = function() {
    const applicationData = JSON.parse(sessionStorage.getItem('current_rental_application'));
    
    if (applicationData) {
        console.log('🔍 Proceeding to screening for application:', applicationData.applicationId);
        
        // Redirect to screening page
        window.location.href = `/Pages/screening-rent.html?applicationId=${applicationData.applicationId}`;
    } else {
        console.error('No application data found');
        showNotification('Error: Application data not found', 'error');
    }
};

// Utility function for notifications
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
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

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

console.log('🎉 Rental Application JavaScript Loaded!');