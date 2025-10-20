// payment.js - Integrated with DomiHive Application Flow

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
        } else {
            console.error('❌ No screening or application data found');
            // Redirect back to screening if data missing
            setTimeout(() => {
                window.location.href = '/Pages/screening-rent.html';
            }, 3000);
        }
        
        // Generate payment reference
        generatePaymentReference();
        
        console.log('✅ Payment page initialized');
    }

    function getScreeningData(screeningId) {
        // Get from session storage first
        const currentScreening = sessionStorage.getItem('domihive_current_screening');
        if (currentScreening) {
            return JSON.parse(currentScreening);
        }
        
        // Fallback: get from localStorage screenings
        const screenings = JSON.parse(localStorage.getItem('domihive_screenings')) || [];
        const screening = screenings.find(s => s.screeningId === screeningId) || screenings[0];
        
        if (screening) {
            // Store in session for consistency
            sessionStorage.setItem('domihive_current_screening', JSON.stringify(screening));
        }
        
        return screening;
    }

    function getApplicationData(applicationId) {
        // Get from session storage first
        const currentApplication = sessionStorage.getItem('domihive_current_application');
        if (currentApplication) {
            return JSON.parse(currentApplication);
        }
        
        // Fallback: get from localStorage applications
        const applications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
        const application = applications.find(app => app.applicationId === applicationId) || applications[0];
        
        if (application) {
            // Store in session for consistency
            sessionStorage.setItem('domihive_current_application', JSON.stringify(application));
        }
        
        return application;
    }

    function updatePageWithData(screeningData, applicationData) {
        if (!applicationData) return;
        
        // Update applicant information
        document.getElementById('applicantName').textContent = 
            applicationData.backgroundInfo?.fullName || 'Applicant Name';
        document.getElementById('applicationId').textContent = applicationData.applicationId || 'APP-123456';
        
        // Update property information
        document.getElementById('propertyTitle').textContent = applicationData.propertyTitle || 'Property Title';
        document.getElementById('propertyLocation').textContent = applicationData.propertyLocation || 'Location';
        
        // Store data in hidden fields
        document.getElementById('screeningData').value = JSON.stringify(screeningData);
        document.getElementById('applicationData').value = JSON.stringify(applicationData);
        
        // Update property image if available
        if (applicationData.propertyImage) {
            const propertyImage = document.getElementById('screeningPropertyImage');
            if (propertyImage) {
                propertyImage.src = applicationData.propertyImage;
            }
        }
    }

    function calculatePaymentAmounts(applicationData) {
        // Calculate payment amounts based on property price and type
        const propertyPrice = applicationData.propertyPrice || 0;
        const propertyType = applicationData.propertyType || 'standard';
        
        // Calculate amounts as percentages of property price
        // Security deposit: 10% of annual rent (refundable)
        // Processing fee: 1% of annual rent (non-refundable)
        // Background check: Fixed fee
        
        const securityDeposit = Math.round(propertyPrice * 0.10); // 10%
        const processingFee = Math.round(propertyPrice * 0.01); // 1%
        const backgroundCheckFee = 5000; // Fixed ₦5,000
        
        paymentAmounts = {
            securityDeposit: securityDeposit,
            processingFee: processingFee,
            backgroundCheckFee: backgroundCheckFee,
            totalAmount: securityDeposit + processingFee + backgroundCheckFee
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
        
        // Terms agreement validation
        const consentCheckboxes = document.querySelectorAll('#paymentForm input[type="checkbox"]');
        consentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateFormConsents);
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
        
        // Validate form
        validateFormConsents();
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
        
        validateField(e);
    }

    function formatExpiryDate(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
        validateField(e);
    }

    function formatCVV(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        e.target.value = value.substring(0, 4);
        validateField(e);
    }

    function handleReceiptUpload(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            const validTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!validTypes.includes(fileExtension)) {
                showNotification('Please upload only PDF, JPG, or PNG files', 'error');
                e.target.value = '';
                return;
            }
            
            if (file.size > maxSize) {
                showNotification('File size must be less than 5MB', 'error');
                e.target.value = '';
                return;
            }
            
            console.log('📄 Receipt uploaded:', file.name);
            showNotification('Receipt uploaded successfully', 'success');
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

    function validateFormConsents() {
        const submitBtn = document.getElementById('submitPaymentBtn');
        const allConsentsChecked = areAllConsentsChecked();
        const hasPaymentMethod = selectedPaymentMethod !== '';
        
        if (allConsentsChecked && hasPaymentMethod) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    function areAllConsentsChecked() {
        const consent1 = document.getElementById('agreeEscrowTerms').checked;
        const consent2 = document.getElementById('agreeRefundPolicy').checked;
        const consent3 = document.getElementById('agreePrivacyPolicy').checked;
        
        return consent1 && consent2 && consent3;
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = collectFormData();
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
            showNotification('Please select a payment method', 'error');
            isValid = false;
        }

        // Check required fields based on payment method
        if (selectedPaymentMethod === 'card') {
            const cardFields = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv'];
            cardFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                }
            });
            
            // Validate card details
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');
            
            if (cardNumber.value && !isValidCardNumber(cardNumber.value)) {
                showFieldError(cardNumber, 'Please enter a valid card number');
                isValid = false;
            }
            
            if (expiryDate.value && !isValidExpiryDate(expiryDate.value)) {
                showFieldError(expiryDate, 'Please enter a valid expiry date');
                isValid = false;
            }
            
            if (cvv.value && !isValidCVV(cvv.value)) {
                showFieldError(cvv, 'Please enter a valid CVV');
                isValid = false;
            }
        }

        if (selectedPaymentMethod === 'bank') {
            const receipt = document.getElementById('bankReceipt');
            if (!receipt.files.length) {
                showNotification('Please upload your bank transfer receipt', 'error');
                isValid = false;
            }
        }

        // Check consents
        if (!areAllConsentsChecked()) {
            showNotification('Please accept all terms and conditions', 'error');
            isValid = false;
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

    function collectFormData() {
        const screeningData = JSON.parse(document.getElementById('screeningData').value);
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        
        const formData = {
            // Payment metadata
            paymentId: 'PAY-' + Date.now(),
            transactionId: 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            screeningId: screeningData.screeningId,
            applicationId: applicationData.applicationId,
            paymentDate: new Date().toISOString(),
            status: 'completed',
            
            // Payment details
            paymentMethod: selectedPaymentMethod,
            amount: paymentAmounts.totalAmount,
            currency: 'NGN',
            reference: document.getElementById('paymentReference').textContent,
            
            // Payment breakdown
            paymentBreakdown: paymentAmounts,
            
            // Application information
            applicantName: applicationData.backgroundInfo?.fullName,
            propertyTitle: applicationData.propertyTitle,
            propertyLocation: applicationData.propertyLocation,
            
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
            
            // Trigger tenant notification
            triggerTenantNotification(formData);
            
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
                steps[currentStep - 1].classList.add('completed');
            }
            
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 1000);
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
        
        console.log('💾 Payment saved:', paymentData.paymentId);
    }

    function updateApplicationStatus(applicationId, status) {
        let applications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
        const applicationIndex = applications.findIndex(app => app.applicationId === applicationId);
        
        if (applicationIndex !== -1) {
            applications[applicationIndex].status = status;
            applications[applicationIndex].paymentCompleted = new Date().toISOString();
            applications[applicationIndex].paymentId = 'PAY-' + Date.now();
            applications[applicationIndex].paymentReference = document.getElementById('paymentReference').textContent;
            localStorage.setItem('domihive_applications', JSON.stringify(applications));
        }
    }

    function triggerTenantNotification(paymentData) {
        // Get the pending notification we prepared earlier
        let pendingNotifications = JSON.parse(localStorage.getItem('domihive_pending_notifications')) || [];
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        
        if (pendingNotifications.length > 0) {
            // Move pending notification to active notifications
            let notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
            const tenantNotification = pendingNotifications.find(n => n.type === 'tenant_approval');
            
            if (tenantNotification) {
                // Update notification with payment info
                tenantNotification.paymentId = paymentData.paymentId;
                tenantNotification.timestamp = new Date().toISOString();
                tenantNotification.status = 'unread';
                
                notifications.push(tenantNotification);
                localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
                
                // Remove from pending
                pendingNotifications = pendingNotifications.filter(n => n.type !== 'tenant_approval');
                localStorage.setItem('domihive_pending_notifications', JSON.stringify(pendingNotifications));
                
                console.log('📧 Tenant notification activated');
            }
        }
        
        // Also create a payment confirmation notification
        const paymentNotification = {
            id: 'notif_' + Date.now(),
            type: 'payment_confirmation',
            title: 'Payment Received Successfully!',
            message: `Your payment of ₦${paymentData.amount.toLocaleString()} for ${applicationData.propertyTitle} has been received.`,
            applicationId: paymentData.applicationId,
            paymentId: paymentData.paymentId,
            timestamp: new Date().toISOString(),
            read: false,
            actions: [
                {
                    text: 'View Payment Details',
                    action: 'view_payment',
                    paymentId: paymentData.paymentId
                }
            ]
        };
        
        let notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
        notifications.push(paymentNotification);
        localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
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
            
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy text. Please select and copy manually.', 'error');
        });
    };

    window.goBackToScreening = function() {
        const screeningData = JSON.parse(document.getElementById('screeningData').value);
        if (screeningData && screeningData.screeningId) {
            window.location.href = `/Pages/screening-rent.html?screeningId=${screeningData.screeningId}`;
        } else {
            window.history.back();
        }
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
        window.location.href = `/Pages/dashboard-rent.html?paymentId=${paymentData.paymentId}`;
    };

    function generateReceipt() {
        const paymentData = JSON.parse(sessionStorage.getItem('domihive_current_payment'));
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        
        const receipt = {
            receiptId: 'RCP-' + Date.now(),
            transactionId: paymentData.transactionId,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            applicant: applicationData.backgroundInfo?.fullName,
            property: applicationData.propertyTitle,
            amount: `₦${paymentData.amount.toLocaleString()}`,
            paymentMethod: paymentData.paymentMethod,
            reference: paymentData.reference
        };
        
        console.log('🧾 Receipt generated:', receipt);
        showNotification('Receipt downloaded successfully!', 'success');
        
        // In a real app, this would generate a PDF receipt
        // For now, we'll just log it and show a notification
    }
});

console.log('🎉 Payment JavaScript Loaded!');