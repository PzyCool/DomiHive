// application.js - Complete Application Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('propertyId');
    const userType = urlParams.get('userType') || 'general';
    const flowType = urlParams.get('flow') || 'direct';
    const sourcePage = urlParams.get('source') || 'general';

    // Initialize the page
    initApplicationPage();
    initEventListeners();

    // Functions
    function initApplicationPage() {
        console.log('📝 Initializing Application Page...');
        console.log('📊 Page Context:', { propertyId, userType, flowType, sourcePage });
        
        // Load property data
        const propertyData = getPropertyData(propertyId);
        if (propertyData) {
            updatePropertySummary(propertyData);
        }
        
        // Set up user type tracking
        setupUserTypeTracking(userType, sourcePage);
        
        // Set up application flow
        setupApplicationFlow(flowType);
        
        // Set minimum date for date of birth (18 years ago)
        setMinDateOfBirth();
        
        console.log('✅ Application page initialized');
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
                image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                type: "apartment"
            },
            '2': {
                id: 2,
                title: "Modern Student Hostel near UNILAG",
                price: 180000,
                location: "Akoka, Yaba, Lagos Mainland", 
                bedrooms: "shared",
                bathrooms: "shared",
                size: "12 sqm (per room)",
                image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                type: "hostel"
            },
            '3': {
                id: 3,
                title: "Cozy 2-Bedroom Flat in Lekki Phase 1",
                price: 2800000,
                location: "Lekki Phase 1, Lagos",
                bedrooms: 2,
                bathrooms: 2,
                size: "120 sqm",
                image: "/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg",
                type: "apartment"
            }
        };
        
        return properties[id] || properties['1'];
    }

    function updatePropertySummary(property) {
        document.getElementById('applicationPropertyTitle').textContent = property.title;
        document.getElementById('applicationPropertyPrice').textContent = `₦${property.price.toLocaleString()}/year`;
        document.getElementById('applicationPropertyLocation').textContent = property.location;
        document.getElementById('applicationBedrooms').textContent = property.bedrooms;
        document.getElementById('applicationBathrooms').textContent = property.bathrooms;
        document.getElementById('applicationSize').textContent = property.size;
        document.getElementById('applicationPropertyImage').src = property.image;
    }

    function setupUserTypeTracking(userType, sourcePage) {
        console.log('🎯 Setting up user type tracking:', { userType, sourcePage });
        
        // Store tracking information
        const trackedUserType = determineUserType(userType, sourcePage);
        document.getElementById('trackedUserType').value = trackedUserType;
        
        // Update form based on user type
        updateFormForUserType(trackedUserType);
        
        // Update progress step label if coming from inspection
        if (flowType === 'inspection') {
            document.getElementById('step2Label').textContent = 'Inspection Booked';
        }
    }

    function determineUserType(userType, sourcePage) {
        // Smart logic to determine user type based on source page
        if (userType && userType !== 'general') {
            return userType;
        }
        
        switch (sourcePage) {
            case 'student':
                return 'student';
            case 'tenant':
                return 'tenant';
            case 'for-student.html':
                return 'student';
            case 'for-tenant.html':
                return 'tenant';
            default:
                // Try to determine from property type or other factors
                const propertyData = getPropertyData(propertyId);
                if (propertyData && propertyData.type === 'hostel') {
                    return 'student';
                }
                return 'tenant'; // Default to tenant
        }
    }

    function updateFormForUserType(userType) {
        console.log('🔄 Updating form for user type:', userType);
        
        const studentSection = document.getElementById('studentSection');
        const tenantSection = document.getElementById('tenantSection');
        const applicationSubtitle = document.getElementById('applicationSubtitle');
        
        // Hide all specific sections first
        studentSection.style.display = 'none';
        tenantSection.style.display = 'none';
        
        // Show relevant section and update UI
        switch (userType) {
            case 'student':
                studentSection.style.display = 'block';
                applicationSubtitle.textContent = 'Please fill in your student details to apply for this property';
                markRequiredFields(studentSection, true);
                markRequiredFields(tenantSection, false);
                break;
            case 'tenant':
                tenantSection.style.display = 'block';
                applicationSubtitle.textContent = 'Please fill in your employment details to apply for this property';
                markRequiredFields(studentSection, false);
                markRequiredFields(tenantSection, true);
                break;
            default:
                applicationSubtitle.textContent = 'Please fill in your details to apply for this property';
                markRequiredFields(studentSection, false);
                markRequiredFields(tenantSection, false);
        }
        
        // Store in session for later use
        sessionStorage.setItem('domihive_applicant_type', userType);
    }

    function markRequiredFields(section, isRequired) {
        const inputs = section.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (isRequired) {
                input.setAttribute('required', 'true');
                // Add required indicator to label
                const label = input.parentElement.querySelector('label');
                if (label && !label.querySelector('.required-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'required-indicator';
                    indicator.textContent = ' *';
                    indicator.style.color = '#e53e3e';
                    label.appendChild(indicator);
                }
            } else {
                input.removeAttribute('required');
                // Remove required indicator
                const label = input.parentElement.querySelector('label');
                if (label) {
                    const indicator = label.querySelector('.required-indicator');
                    if (indicator) {
                        indicator.remove();
                    }
                }
            }
        });
    }

    function setupApplicationFlow(flowType) {
        console.log('🔄 Setting up application flow:', flowType);
        
        document.getElementById('applicationFlow').value = flowType;
        
        const flowOptionsSection = document.getElementById('flowOptions');
        const applicationFormSection = document.querySelector('.application-form-section');
        
        if (flowType === 'direct') {
            // Show flow options for direct applicants
            flowOptionsSection.style.display = 'block';
            applicationFormSection.style.display = 'none';
            
            // Update subtitle
            document.querySelector('.summary-header p').textContent = 
                'Choose how you would like to proceed with your rental application';
        } else {
            // Hide flow options, show form directly
            flowOptionsSection.style.display = 'none';
            applicationFormSection.style.display = 'block';
            
            // Update subtitle based on flow
            const subtitle = document.querySelector('.summary-header p');
            if (flowType === 'inspection') {
                subtitle.textContent = 'Complete your application after your property inspection';
            }
        }
    }

    function setMinDateOfBirth() {
        // Calculate date 18 years ago
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        document.getElementById('dateOfBirth').max = minDate.toISOString().split('T')[0];
        
        // Calculate date 100 years ago
        const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        document.getElementById('dateOfBirth').min = maxDate.toISOString().split('T')[0];
    }

    function initEventListeners() {
        // Form submission
        document.getElementById('applicationForm').addEventListener('submit', handleFormSubmission);
        
        // Password strength checking
        document.getElementById('password').addEventListener('input', checkPasswordStrength);
        
        // Password confirmation
        document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);
        
        // Real-time validation for required fields
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
        });
        
        // Date of birth validation
        document.getElementById('dateOfBirth').addEventListener('change', validateDateOfBirth);
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = getFormData();
            submitApplication(formData);
        }
    }

    function validateForm() {
        const form = document.getElementById('applicationForm');
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

        // Validate password strength
        const passwordField = document.getElementById('password');
        if (passwordField.value && !isStrongPassword(passwordField.value)) {
            showFieldError(passwordField, 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            isValid = false;
        }

        // Validate password match
        const confirmPasswordField = document.getElementById('confirmPassword');
        if (passwordField.value !== confirmPasswordField.value) {
            showFieldError(confirmPasswordField, 'Passwords do not match');
            isValid = false;
        }

        // Validate date of birth (must be at least 18 years)
        const dobField = document.getElementById('dateOfBirth');
        if (dobField.value && !isValidAge(dobField.value)) {
            showFieldError(dobField, 'You must be at least 18 years old to apply');
            isValid = false;
        }

        // Validate user type specific fields
        const userType = document.getElementById('trackedUserType').value;
        if (userType === 'student') {
            isValid = validateStudentFields() && isValid;
        } else if (userType === 'tenant') {
            isValid = validateTenantFields() && isValid;
        }

        return isValid;
    }

    function validateStudentFields() {
        let isValid = true;
        const institution = document.getElementById('institution');
        const courseOfStudy = document.getElementById('courseOfStudy');
        const yearOfStudy = document.getElementById('yearOfStudy');
        const expectedGraduation = document.getElementById('expectedGraduation');

        if (!institution.value.trim()) {
            showFieldError(institution, 'Educational institution is required');
            isValid = false;
        }

        if (!courseOfStudy.value.trim()) {
            showFieldError(courseOfStudy, 'Course of study is required');
            isValid = false;
        }

        if (!yearOfStudy.value) {
            showFieldError(yearOfStudy, 'Year of study is required');
            isValid = false;
        }

        if (!expectedGraduation.value || expectedGraduation.value < new Date().getFullYear()) {
            showFieldError(expectedGraduation, 'Please enter a valid graduation year');
            isValid = false;
        }

        return isValid;
    }

    function validateTenantFields() {
        let isValid = true;
        const occupation = document.getElementById('occupation');
        const employer = document.getElementById('employer');
        const employmentType = document.getElementById('employmentType');
        const monthlyIncome = document.getElementById('monthlyIncome');
        const workDuration = document.getElementById('workDuration');

        if (!occupation.value.trim()) {
            showFieldError(occupation, 'Occupation is required');
            isValid = false;
        }

        if (!employer.value.trim()) {
            showFieldError(employer, 'Employer is required');
            isValid = false;
        }

        if (!employmentType.value) {
            showFieldError(employmentType, 'Employment type is required');
            isValid = false;
        }

        if (!monthlyIncome.value || monthlyIncome.value < 0) {
            showFieldError(monthlyIncome, 'Please enter a valid monthly income');
            isValid = false;
        }

        if (!workDuration.value || workDuration.value < 0) {
            showFieldError(workDuration, 'Please enter valid work duration');
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

    function isStrongPassword(password) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongRegex.test(password);
    }

    function isValidAge(dobString) {
        const dob = new Date(dobString);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    }

    function checkPasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthIndicator = document.getElementById('passwordStrength');
        
        if (!password) {
            strengthIndicator.className = 'password-strength';
            return;
        }
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;
        
        strengthIndicator.className = 'password-strength ' + 
            (strength < 3 ? 'weak' : strength < 5 ? 'medium' : 'strong');
    }

    function validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmField = document.getElementById('confirmPassword');
        
        if (confirmPassword && password !== confirmPassword) {
            showFieldError(confirmField, 'Passwords do not match');
        } else {
            clearFieldError(confirmField);
        }
    }

    function validateField(e) {
        const field = e.target;
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'This field is required');
            return;
        }
        
        // Specific field validations
        switch (field.id) {
            case 'email':
                if (field.value && !isValidEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                } else {
                    clearFieldError(field);
                }
                break;
            case 'phone':
                if (field.value && !isValidPhone(field.value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                } else {
                    clearFieldError(field);
                }
                break;
            case 'dateOfBirth':
                if (field.value && !isValidAge(field.value)) {
                    showFieldError(field, 'You must be at least 18 years old');
                } else {
                    clearFieldError(field);
                }
                break;
            default:
                clearFieldError(field);
        }
    }

    function validateDateOfBirth() {
        const dobField = document.getElementById('dateOfBirth');
        if (dobField.value && !isValidAge(dobField.value)) {
            showFieldError(dobField, 'You must be at least 18 years old to apply');
        } else {
            clearFieldError(dobField);
        }
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

    function clearFieldError(field) {
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

    function getFormData() {
        const propertyData = getPropertyData(propertyId);
        const userType = document.getElementById('trackedUserType').value;
        
        const formData = {
            // Application metadata
            applicationId: 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            propertyId: propertyId,
            propertyTitle: propertyData.title,
            propertyLocation: propertyData.location,
            applicationFlow: document.getElementById('applicationFlow').value,
            userType: userType,
            applicationDate: new Date().toISOString(),
            
            // Personal information
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            gender: document.getElementById('gender').value,
            
            // Emergency contact
            emergencyName: document.getElementById('emergencyName').value,
            emergencyPhone: document.getElementById('emergencyPhone').value,
            emergencyRelationship: document.getElementById('emergencyRelationship').value,
            
            // Terms agreement
            agreeTerms: document.getElementById('agreeTerms').checked,
            agreeScreening: document.getElementById('agreeScreening').checked,
            agreeCommunication: document.getElementById('agreeCommunication').checked
        };
        
        // Add user type specific data
        if (userType === 'student') {
            formData.studentInfo = {
                institution: document.getElementById('institution').value,
                studentId: document.getElementById('studentId').value,
                courseOfStudy: document.getElementById('courseOfStudy').value,
                yearOfStudy: document.getElementById('yearOfStudy').value,
                expectedGraduation: document.getElementById('expectedGraduation').value,
                guardianName: document.getElementById('guardianName').value,
                guardianPhone: document.getElementById('guardianPhone').value
            };
        } else if (userType === 'tenant') {
            formData.employmentInfo = {
                occupation: document.getElementById('occupation').value,
                employer: document.getElementById('employer').value,
                employmentType: document.getElementById('employmentType').value,
                monthlyIncome: document.getElementById('monthlyIncome').value,
                workDuration: document.getElementById('workDuration').value
            };
        }
        
        return formData;
    }

    function submitApplication(formData) {
        console.log('📝 Submitting application:', formData);
        
        // Show loading state
        const submitBtn = document.querySelector('#applicationForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // Save application to localStorage
            saveApplicationToStorage(formData);
            
            // Create user account
            createUserAccount(formData);
            
            // Show success modal
            showSuccessModal(formData);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 3000);
    }

    function saveApplicationToStorage(applicationData) {
        let applications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
        applications.push(applicationData);
        localStorage.setItem('domihive_applications', JSON.stringify(applications));
        
        // Store current application for the flow
        sessionStorage.setItem('domihive_current_application', JSON.stringify(applicationData));
    }

    function createUserAccount(applicationData) {
        const userAccount = {
            id: 'USER-' + Date.now(),
            email: applicationData.email,
            firstName: applicationData.firstName,
            lastName: applicationData.lastName,
            userType: applicationData.userType,
            phone: applicationData.phone,
            dateCreated: new Date().toISOString(),
            status: 'pending_verification',
            applications: [applicationData.applicationId]
        };
        
        let users = JSON.parse(localStorage.getItem('domihive_users')) || [];
        users.push(userAccount);
        localStorage.setItem('domihive_users', JSON.stringify(users));
        
        // Store current user session
        sessionStorage.setItem('domihive_current_user', JSON.stringify(userAccount));
        
        console.log('👤 User account created:', userAccount);
    }

    function showSuccessModal(applicationData) {
        // Update modal content
        document.getElementById('summaryApplicationId').textContent = applicationData.applicationId;
        document.getElementById('summaryPropertyTitle').textContent = applicationData.propertyTitle;
        document.getElementById('summaryApplicantName').textContent = 
            `${applicationData.firstName} ${applicationData.lastName}`;
        document.getElementById('summaryNextStep').textContent = 'Background Screening';
        
        // Show modal
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
    }

    // Global functions
    window.selectFlow = function(flowType) {
        console.log('🔄 Selected flow:', flowType);
        
        const applicationFormSection = document.querySelector('.application-form-section');
        const flowOptionsSection = document.getElementById('flowOptions');
        
        if (flowType === 'direct') {
            // Proceed directly to application form
            applicationFormSection.style.display = 'block';
            flowOptionsSection.style.display = 'none';
            document.getElementById('applicationFlow').value = 'direct';
        } else if (flowType === 'inspection') {
            // Redirect to book inspection
            window.location.href = `/Pages/book-inspection.html?propertyId=${propertyId}&userType=${userType}&flow=direct`;
        }
    };

    window.goBackToPrevious = function() {
        const flowType = document.getElementById('applicationFlow').value;
        
        if (flowType === 'direct') {
            // Show flow options again
            const applicationFormSection = document.querySelector('.application-form-section');
            const flowOptionsSection = document.getElementById('flowOptions');
            
            applicationFormSection.style.display = 'none';
            flowOptionsSection.style.display = 'block';
        } else {
            // Go back to previous page
            window.history.back();
        }
    };

    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
        modal.classList.remove('active');
        
        // Redirect to dashboard or home
        window.location.href = '/index.html';
    };

    window.proceedToScreening = function() {
        const applicationData = JSON.parse(sessionStorage.getItem('domihive_current_application'));
        console.log('🔍 Proceeding to screening for application:', applicationData.applicationId);
        
        // Redirect to screening page
        window.location.href = `/Pages/screening.html?applicationId=${applicationData.applicationId}&userType=${applicationData.userType}`;
    };

    // Utility function to check if user is coming from specific page
    window.getApplicationContext = function() {
        return {
            propertyId: propertyId,
            userType: document.getElementById('trackedUserType').value,
            flowType: document.getElementById('applicationFlow').value,
            sourcePage: sourcePage
        };
    };
});