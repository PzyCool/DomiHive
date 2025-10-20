// signup.js - Professional Signup with Real Social Login Feel

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSignupPage();
});

function initializeSignupPage() {
    console.log('🚀 DomiHive Signup Page Initialized');
    
    // Initialize event listeners
    initSocialSignupButtons();
    initPhoneSignupForm();
    
    // Add smooth animations
    addPageAnimations();
}

// ===== SOCIAL SIGNUP FUNCTIONALITY =====
function initSocialSignupButtons() {
    const googleBtn = document.getElementById('googleSignupBtn');
    const appleBtn = document.getElementById('appleSignupBtn');

    // Google Signup
    googleBtn.addEventListener('click', handleGoogleSignup);

    // Apple Signup
    appleBtn.addEventListener('click', handleAppleSignup);
}

function handleGoogleSignup() {
    console.log('🔐 Google signup initiated');
    
    const btn = document.getElementById('googleSignupBtn');
    const originalHTML = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = `
        <div class="social-icon">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <span class="social-text">Connecting to Google...</span>
    `;
    btn.disabled = true;

    // Simulate API call with realistic timing
    setTimeout(() => {
        // Generate realistic user data
        const user = generateGoogleUser();
        
        // Complete signup process
        completeSocialSignup(user, 'google');
        
        // Restore button after a delay
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 1000);
        
    }, 2000); // 2 second delay to feel real
}

function handleAppleSignup() {
    console.log('🔐 Apple signup initiated');
    
    const btn = document.getElementById('appleSignupBtn');
    const originalHTML = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = `
        <div class="social-icon">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <span class="social-text">Connecting to Apple...</span>
    `;
    btn.disabled = true;

    // Simulate API call with realistic timing
    setTimeout(() => {
        // Generate realistic user data
        const user = generateAppleUser();
        
        // Complete signup process
        completeSocialSignup(user, 'apple');
        
        // Restore button after a delay
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 1000);
        
    }, 2000); // 2 second delay to feel real
}

function generateGoogleUser() {
    const firstNames = ['PzyCool', 'Prosper Matarh', 'Olamide', 'Brian', 'Michael', 'Emily', 'Chris', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Malik', 'Brown', 'Faith', 'Garcia', 'Miller', 'FifiCool'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
        id: 'user_' + Date.now(),
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
        phone: '+23480' + Math.floor(1000000 + Math.random() * 9000000),
        type: 'tenant',
        provider: 'google',
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0e1f42&color=fff`,
        createdAt: new Date().toISOString()
    };
}

function generateAppleUser() {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
    const lastNames = ['Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
        id: 'user_' + Date.now(),
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@icloud.com`,
        phone: '+23480' + Math.floor(1000000 + Math.random() * 9000000),
        type: 'tenant',
        provider: 'apple',
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=000000&color=fff`,
        createdAt: new Date().toISOString()
    };
}

function completeSocialSignup(user, provider) {
    console.log(`✅ ${provider.charAt(0).toUpperCase() + provider.slice(1)} signup completed:`, user);
    
    // Show success notification
    showNotification(`Welcome to DomiHive, ${user.name}!`, 'success');
    
    // Save user to localStorage (simulating backend)
    localStorage.setItem('domihive_current_user', JSON.stringify(user));
    localStorage.setItem('domihive_user_avatar', user.avatar);
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
        window.location.href = './dashboard-rent.html';
    }, 1500);
}

// ===== PHONE SIGNUP FUNCTIONALITY =====
function initPhoneSignupForm() {
    const signupForm = document.getElementById('phoneSignupForm');
    const signupBtn = document.getElementById('signupSubmitBtn');

    signupForm.addEventListener('submit', handlePhoneSignup);
    
    // Real-time validation
    const inputs = signupForm.querySelectorAll('input[type="text"], input[type="tel"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handlePhoneSignup(e) {
    e.preventDefault();
    console.log('📱 Phone signup submitted');
    
    const submitBtn = document.getElementById('signupSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    // Validate form
    if (!validateSignupForm()) {
        // Hide loading state if validation fails
        btnText.style.display = 'flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const fullName = formData.get('fullName');
    const phoneNumber = formData.get('phoneNumber');
    const password = formData.get('password');
    
    // Simulate API call
    setTimeout(() => {
        // Create user object
        const user = {
            id: 'user_' + Date.now(),
            name: fullName,
            phone: '+234' + phoneNumber,
            type: 'tenant',
            provider: 'phone',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=9f7539&color=fff`,
            createdAt: new Date().toISOString()
        };
        
        // Complete signup
        completePhoneSignup(user);
        
        // Restore button
        btnText.style.display = 'flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        
    }, 1500); // 1.5 second delay
}

function validateSignupForm() {
    let isValid = true;
    
    // Reset previous errors
    clearAllErrors();
    
    // Validate full name
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) {
        showError('nameError', 'Full name is required');
        document.getElementById('fullName').classList.add('error');
        isValid = false;
    } else if (fullName.length < 2) {
        showError('nameError', 'Full name must be at least 2 characters');
        document.getElementById('fullName').classList.add('error');
        isValid = false;
    }
    
    // Validate phone number
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber) {
        showError('phoneError', 'Phone number is required');
        document.querySelector('.phone-input-container').classList.add('error');
        isValid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
        showError('phoneError', 'Please enter a valid 10-digit phone number');
        document.querySelector('.phone-input-container').classList.add('error');
        isValid = false;
    }
    
    // Validate password
    const password = document.getElementById('password').value;
    if (!password) {
        showError('passwordError', 'Password is required');
        document.getElementById('password').classList.add('error');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        document.getElementById('password').classList.add('error');
        isValid = false;
    }
    
    // Validate confirm password
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (!confirmPassword) {
        showError('confirmPasswordError', 'Please confirm your password');
        document.getElementById('confirmPassword').classList.add('error');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        document.getElementById('confirmPassword').classList.add('error');
        isValid = false;
    }
    
    // Validate checkboxes
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const screeningConsent = document.getElementById('screeningConsent').checked;
    
    if (!agreeTerms) {
        showNotification('You must agree to the Terms of Service and Privacy Policy', 'error');
        isValid = false;
    }
    
    if (!screeningConsent) {
        showNotification('You must consent to background screening and verification checks', 'error');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const fieldId = field.id;
    const value = field.value.trim();
    
    switch (fieldId) {
        case 'fullName':
            if (!value) {
                showError('nameError', 'Full name is required');
                field.classList.add('error');
            } else if (value.length < 2) {
                showError('nameError', 'Full name must be at least 2 characters');
                field.classList.add('error');
            } else {
                clearError('nameError');
                field.classList.remove('error');
            }
            break;
            
        case 'phoneNumber':
            const phoneRegex = /^[0-9]{10}$/;
            if (!value) {
                showError('phoneError', 'Phone number is required');
                document.querySelector('.phone-input-container').classList.add('error');
            } else if (!phoneRegex.test(value)) {
                showError('phoneError', 'Please enter a valid 10-digit phone number');
                document.querySelector('.phone-input-container').classList.add('error');
            } else {
                clearError('phoneError');
                document.querySelector('.phone-input-container').classList.remove('error');
            }
            break;
            
        case 'password':
            if (!value) {
                showError('passwordError', 'Password is required');
                field.classList.add('error');
            } else if (value.length < 6) {
                showError('passwordError', 'Password must be at least 6 characters');
                field.classList.add('error');
            } else {
                clearError('passwordError');
                field.classList.remove('error');
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!value) {
                showError('confirmPasswordError', 'Please confirm your password');
                field.classList.add('error');
            } else if (value !== password) {
                showError('confirmPasswordError', 'Passwords do not match');
                field.classList.add('error');
            } else {
                clearError('confirmPasswordError');
                field.classList.remove('error');
            }
            break;
    }
}

function clearFieldError(e) {
    const field = e.target;
    const fieldId = field.id;
    
    // Clear error when user starts typing
    clearError(fieldId + 'Error');
    field.classList.remove('error');
    
    if (fieldId === 'phoneNumber') {
        document.querySelector('.phone-input-container').classList.remove('error');
    }
}

function completePhoneSignup(user) {
    console.log('✅ Phone signup completed:', user);
    
    // Show success notification
    showNotification(`Welcome to DomiHive, ${user.name}!`, 'success');
    
    // Save user to localStorage (simulating backend)
    localStorage.setItem('domihive_current_user', JSON.stringify(user));
    localStorage.setItem('domihive_user_avatar', user.avatar);
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
        window.location.href = './dashboard-rent.html';
    }, 1500);
}

// ===== NOTIFICATION SYSTEM =====
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
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
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
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
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

// ===== ERROR HANDLING =====
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => error.classList.remove('show'));
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
    
    document.querySelector('.phone-input-container').classList.remove('error');
}

// ===== ANIMATIONS =====
function addPageAnimations() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .social-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .form-group input:valid {
            border-color: #10b981;
        }
    `;
    document.head.appendChild(style);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== GLOBAL FUNCTIONS =====
window.validateSignupForm = validateSignupForm;
window.showNotification = showNotification;

console.log('🎉 DomiHive Signup JavaScript Loaded - Ready for Authentication!');