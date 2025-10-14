// payment.js - Secure Payment Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const screeningId = urlParams.get('screeningId');
    const applicationId = urlParams.get('applicationId');

    // Payment variables
    let selectedPaymentMethod = '';
    let paymentAmounts = {
        securityDeposit: 0,
        processingFee: 0,
        backgroundCheckFee: 0,
        totalAmount: 0
    };

    // Initialize the page
    initPaymentPage();
    initEventListeners();

    // Functions
    function initPaymentPage() {
        console.log('💳 Initializing Payment Page...');
        console.log('📊 Payment Context:', { screeningId, applicationId });
        
        // Load screening and application data
        const screeningData = getScreeningData(screeningId);
        const applicationData = getApplicationData(applicationId);
        
        if (screeningData && applicationData) {
            updatePageWithData(screeningData, applicationData);
            calculatePaymentAmounts(applicationData);
        }
        
        // Generate payment reference
        generatePaymentReference();
        
        console.log('✅ Payment page initialized');
    }

    function getScreeningData(screeningId) {
        // Get from session storage or localStorage
        const currentScreening = sessionStorage.getItem('domihive_current_screening');
        if (currentScreening) {
            return JSON.parse(currentScreening);
        }
        
        // Fallback: get from localStorage screenings
        const screenings = JSON.parse(localStorage.getItem('domihive_screenings')) || [];
        return screenings.find(screening => screening.screeningId === screeningId) || screenings[0];
    }

    function getApplicationData(applicationId) {
        // Get from session storage or localStorage
        const currentApplication = sessionStorage.getItem('domihive_current_application');
        if (currentApplication) {
            return JSON.parse(currentApplication);
        }
        
        // Fallback: get from localStorage applications
        const applications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
        return applications.find(app => app.applicationId === applicationId) || applications[0];
    }

    function updatePageWithData(screeningData, applicationData) {
        // Update applicant information
        document.getElementById('applicantName').textContent = 
            `${applicationData.firstName} ${applicationData.lastName}`;
        document.getElementById('applicationId').textContent = applicationData.applicationId;
        
        // Update property information
        document.getElementById('propertyTitle').textContent = applicationData.propertyTitle;
        document.getElementById('propertyLocation').textContent = applicationData.propertyLocation;
        
        // Store data in hidden fields
        document.getElementById('screeningData').value = JSON.stringify(screeningData);
        document.getElementById('applicationData').value = JSON.stringify(applicationData);
        
        // Update progress step label based on flow
        const step2Label = document.getElementById('step2Label');
        if (applicationData.applicationFlow === 'inspection') {
            step2Label.textContent = 'Inspection Booked';
        }
    }

    function calculatePaymentAmounts(applicationData) {
        // Calculate payment amounts based on property type and user type
        const isStudent = applicationData.userType === 'student';
        const propertyType = applicationData.propertyType || 'apartment';
        
        // Base amounts (in Naira)
        const baseAmounts = {
            student: {
                securityDeposit: 50000,    // ₦50,000
                processingFee: 5000,       // ₦5,000
                backgroundCheckFee: 3000   // ₦3,000
            },
            tenant: {
                securityDeposit: 100000,   // ₦100,000
                processingFee: 7500,       // ₦7,500
                backgroundCheckFee: 5000   // ₦5,000
            }
        };
        
        const amounts = isStudent ? baseAmounts.student : baseAmounts.tenant;
        
        // Adjust for property type
        if (propertyType === 'luxury') {
            amounts.securityDeposit *= 2;
        } else if (propertyType === 'hostel') {
            amounts.securityDeposit *= 0.5;
        }
        
        paymentAmounts = {
            securityDeposit: amounts.securityDeposit,
            processingFee: amounts.processingFee,
            backgroundCheckFee: amounts.backgroundCheckFee,
            totalAmount: amounts.securityDeposit + amounts.processingFee + amounts.backgroundCheckFee
        };
        
        // Update UI with amounts
        updatePaymentAmountsUI();
        
        // Store total amount in hidden field
        document.getElementById('totalPaymentAmount').value = paymentAmounts.totalAmount;
    }

    function updatePaymentAmountsUI() {
        document.getElementById('securityDeposit').textContent = 
            `₦${paymentAmounts.securityDeposit.toLocaleString()}`;
        document.getElementById('processingFee').textContent = 
            `₦${paymentAmounts.processingFee.toLocaleString()}`;
        document.getElementById('backgroundCheckFee').textContent = 
            `₦${paymentAmounts.backgroundCheckFee.toLocaleString()}`;
        document.getElementById('totalAmount').textContent = 
            `₦${paymentAmounts.totalAmount.toLocaleString()}`;
        document.getElementById('bankAmount').textContent = 
            `₦${paymentAmounts.totalAmount.toLocaleString()}`;
    }

    function generatePaymentReference() {
        const reference = `DOMI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        document.getElementById('paymentReference').textContent = reference;
        return reference;
    }

    function initEventListeners() {
        // Form submission
        document.getElementById('paymentForm').addEventListener('submit', handleFormSubmission);
        
        // Payment method selection
        const paymentMethodCards = document.querySelectorAll('.payment-method-card');
        paymentMethodCards.forEach(card => {
            card.addEventListener('click', handlePaymentMethodSelection);
        });
        
        // Card input formatting
        document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
        document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
        document.getElementById('cvv').addEventListener('input', formatCVV);
        
        // File input handling
        document.getElementById('bankReceipt').addEventListener('change', handleReceiptUpload);
        
        // Real-time validation
        const requiredFields = document.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
        });
    }

    function handlePaymentMethodSelection(e) {
        const card = e.currentTarget;
        const method = card.getAttribute('data-method');
        
        // Update selected method
        selectedPaymentMethod = method;
        
        // Update UI
        const allCards = document.querySelectorAll('.payment-method-card');
        allCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        // Show relevant payment details
        showPaymentDetails(method);
    }

    function showPaymentDetails(method) {
        // Hide all payment details
        const allDetails = document.querySelectorAll('.payment-details');
        allDetails.forEach(detail => detail.style.display = 'none');
        
        // Show relevant details
        switch (method) {
            case 'card':
                document.getElementById('cardDetails').style.display = 'block';
                break;
            case 'bank':
                document.getElementById('bankDetails').style.display = 'block';
                break;
            case 'flutterwave':
            case 'paystack':
                document.getElementById('gatewayDetails').style.display = 'block';
                break;
        }
    }

    function formatCardNumber(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = value.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            e.target.value = parts.join(' ');
        } else {
            e.target.value = value;
        }
    }

    function formatExpiryDate(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    }

    function formatCVV(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        e.target.value = value.substring(0, 4);
    }

    function handleReceiptUpload(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            const validTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!validTypes.includes(fileExtension)) {
                alert('Please upload only PDF, JPG, or PNG files');
                e.target.value = '';
                return;
            }
            
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                return;
            }
            
            console.log('📄 Receipt uploaded:', file.name);
        }
    }

    function validateField(e) {
        const field = e.target;
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'This field is required');
            return;
        }
        
        // Specific validations based on field type
        switch (field.id) {
            case 'cardNumber':
                if (field.value && !isValidCardNumber(field.value)) {
                    showFieldError(field, 'Please enter a valid card number');
                } else {
                    clearFieldError(field);
                }
                break;
            case 'expiryDate':
                if (field.value && !isValidExpiryDate(field.value)) {
                    showFieldError(field, 'Please enter a valid expiry date (MM/YY)');
                } else {
                    clearFieldError(field);
                }
                break;
            case 'cvv':
                if (field.value && !isValidCVV(field.value)) {
                    showFieldError(field, 'Please enter a valid CVV');
                } else {
                    clearFieldError(field);
                }
                break;
            default:
                clearFieldError(field);
        }
    }

    function isValidCardNumber(cardNumber) {
        // Remove spaces and check if it's a number
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleanNumber);
    }

    function isValidExpiryDate(expiryDate) {
        const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!pattern.test(expiryDate)) return false;
        
        const [month, year] = expiryDate.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        if (parseInt(year) < currentYear) return false;
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
        
        return true;
    }

    function isValidCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
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

    function clearFieldError(field) {
        field.style.borderColor = '';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = getFormData();
            processPayment(formData);
        }
    }

    function validateForm() {
        const form = document.getElementById('paymentForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous errors
        clearValidationErrors();

        // Check if payment method is selected
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            isValid = false;
        }

        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate card details if card method selected
        if (selectedPaymentMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');
            
            if (!isValidCardNumber(cardNumber.value)) {
                showFieldError(cardNumber, 'Please enter a valid card number');
                isValid = false;
            }
            
            if (!isValidExpiryDate(expiryDate.value)) {
                showFieldError(expiryDate, 'Please enter a valid expiry date');
                isValid = false;
            }
            
            if (!isValidCVV(cvv.value)) {
                showFieldError(cvv, 'Please enter a valid CVV');
                isValid = false;
            }
        }

        // Validate bank receipt if bank transfer selected
        if (selectedPaymentMethod === 'bank') {
            const receipt = document.getElementById('bankReceipt');
            if (!receipt.files.length) {
                alert('Please upload your bank transfer receipt');
                isValid = false;
            }
        }

        return isValid;
    }

    function clearValidationErrors() {
        const fields = document.querySelectorAll('input, select');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
        
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
    }

    function getFormData() {
        const screeningData = JSON.parse(document.getElementById('screeningData').value);
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        
        const formData = {
            // Payment metadata
            paymentId: 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            transactionId: 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            screeningId: screeningData.screeningId,
            applicationId: applicationData.applicationId,
            paymentDate: new Date().toISOString(),
            
            // Payment details
            paymentMethod: selectedPaymentMethod,
            amount: paymentAmounts.totalAmount,
            currency: 'NGN',
            reference: document.getElementById('paymentReference').textContent,
            
            // Payment method specific data
            paymentDetails: {}
        };
        
        // Add payment method specific details
        if (selectedPaymentMethod === 'card') {
            formData.paymentDetails = {
                cardLast4: document.getElementById('cardNumber').value.slice(-4),
                cardHolder: document.getElementById('cardHolder').value
            };
        } else if (selectedPaymentMethod === 'bank') {
            formData.paymentDetails = {
                bankAccount: document.getElementById('bankAccountNumber').textContent,
                receiptFile: document.getElementById('bankReceipt').files[0]?.name || ''
            };
        }
        
        return formData;
    }

    function processPayment(formData) {
        console.log('💳 Processing payment:', formData);
        
        // Show processing modal
        showProcessingModal();
        
        // Simulate payment processing
        setTimeout(() => {
            // Save payment to localStorage
            savePaymentToStorage(formData);
            
            // Update application status
            updateApplicationStatus(formData.applicationId, 'payment_completed');
            
            // Hide processing modal and show success
            hideProcessingModal();
            showSuccessModal(formData);
        }, 4000); // Simulate 4-second payment processing
    }

    function showProcessingModal() {
        const modal = document.getElementById('processingModal');
        modal.classList.add('active');
        
        // Animate processing steps
        const steps = document.querySelectorAll('.processing-step');
        let currentStep = 0;
        
        const stepInterval = setInterval(() => {
            if (currentStep > 0) {
                steps[currentStep - 1].classList.remove('active');
            }
            
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 800);
    }

    function hideProcessingModal() {
        const modal = document.getElementById('processingModal');
        modal.classList.remove('active');
    }

    function savePaymentToStorage(paymentData) {
        let payments = JSON.parse(localStorage.getItem('domihive_payments')) || [];
        payments.push(paymentData);
        localStorage.setItem('domihive_payments', JSON.stringify(payments));
        
        // Store current payment for the flow
        sessionStorage.setItem('domihive_current_payment', JSON.stringify(paymentData));
    }

    function updateApplicationStatus(applicationId, status) {
        let applications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
        const applicationIndex = applications.findIndex(app => app.applicationId === applicationId);
        
        if (applicationIndex !== -1) {
            applications[applicationIndex].status = status;
            applications[applicationIndex].paymentCompleted = new Date().toISOString();
            applications[applicationIndex].paymentReference = document.getElementById('paymentReference').textContent;
            localStorage.setItem('domihive_applications', JSON.stringify(applications));
        }
    }

    function showSuccessModal(formData) {
        // Update modal content
        document.getElementById('transactionId').textContent = formData.transactionId;
        document.getElementById('paidAmount').textContent = `₦${formData.amount.toLocaleString()}`;
        document.getElementById('paymentMethod').textContent = 
            formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1);
        
        // Show modal
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
    }

    // Global functions
    window.copyToClipboard = function(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Show copied feedback
            const button = event.currentTarget;
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = 'var(--success)';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please select and copy manually.');
        });
    };

    window.goBackToScreening = function() {
        const screeningData = JSON.parse(document.getElementById('screeningData').value);
        window.location.href = `/Pages/screening.html?screeningId=${screeningData.screeningId}`;
    };

    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
        modal.classList.remove('active');
        
        // Generate and download receipt
        generateReceipt();
    };

    window.proceedToDashboard = function() {
        const paymentData = JSON.parse(sessionStorage.getItem('domihive_current_payment'));
        console.log('🚀 Proceeding to dashboard after payment:', paymentData.paymentId);
        
        // Redirect to dashboard
        window.location.href = `/Pages/dashboard.html?paymentId=${paymentData.paymentId}`;
    };

    function generateReceipt() {
        const paymentData = JSON.parse(sessionStorage.getItem('domihive_current_payment'));
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        
        const receipt = {
            receiptId: 'RCP-' + Date.now(),
            transactionId: paymentData.transactionId,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            applicant: `${applicationData.firstName} ${applicationData.lastName}`,
            property: applicationData.propertyTitle,
            amount: `₦${paymentData.amount.toLocaleString()}`,
            paymentMethod: paymentData.paymentMethod,
            reference: paymentData.reference
        };
        
        console.log('🧾 Receipt generated:', receipt);
        // In a real app, this would generate a PDF receipt
        alert('Receipt downloaded successfully!');
    }
});