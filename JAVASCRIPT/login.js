// login.js - Professional Login with User Memory & Welcome Back

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
});

function initializeLoginPage() {
    console.log('🚀 DomiHive Login Page Initialized');
    
    // Check for returning user and show welcome message
    checkReturningUser();
    
    // Initialize event listeners
    initSocialLoginButtons();
    initPhoneLoginForm();
    
    // Add smooth animations
    addPageAnimations();
    
    console.log('✅ Login page ready - user memory enabled');
}

// ===== RETURNING USER DETECTION =====
function checkReturningUser() {
    const userData = localStorage.getItem('domihive_current_user');
    const userAvatar = localStorage.getItem('domihive_user_avatar');
    const rememberedPhone = localStorage.getItem('domihive_remembered_phone');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            showWelcomeBackMessage(user, userAvatar);
            console.log('👋 Returning user detected:', user.name);
            
            // Pre-fill phone number if "Remember me" was checked
            if (rememberedPhone) {
                document.getElementById('loginPhoneNumber').value = rememberedPhone.replace('+234', '');
                console.log('📱 Pre-filled remembered phone number');
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            clearUserData();
        }
    } else {
        console.log('🆕 New user or first-time visitor');
    }
}

function showWelcomeBackMessage(user, avatarUrl) {
    const welcomeMessage = document.getElementById('welcomeBackMessage');
    const welcomeAvatar = document.getElementById('welcomeAvatar');
    const welcomeName = document.getElementById('welcomeName');
    
    if (welcomeMessage && welcomeAvatar && welcomeName) {
        // Set user data
        welcomeAvatar.src = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=9f7539&color=fff`;
        welcomeAvatar.alt = `${user.name}'s Avatar`;
        welcomeName.textContent = `Welcome back, ${user.name}!`;
        
        // Show welcome message
        welcomeMessage.style.display = 'flex';
        
        // Add celebration effect for returning users
        addCelebrationEffects();
        
        console.log('🎉 Welcome back message shown for:', user.name);
    }
}

function addCelebrationEffects() {
    // Add subtle celebration styles
    const style = document.createElement('style');
    style.textContent = `
        .welcome-back-message {
            position: relative;
            overflow: hidden;
        }
        
        .welcome-back-message::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(159, 117, 57, 0.1), transparent);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
    `;
    document.head.appendChild(style);
}

// ===== SOCIAL LOGIN FUNCTIONALITY =====
function initSocialLoginButtons() {
    const googleBtn = document.getElementById('googleLoginBtn');
    const appleBtn = document.getElementById('appleLoginBtn');

    // Google Login
    googleBtn.addEventListener('click', handleGoogleLogin);

    // Apple Login
    appleBtn.addEventListener('click', handleAppleLogin);
}

function handleGoogleLogin() {
    console.log('🔐 Google login initiated');
    
    const btn = document.getElementById('googleLoginBtn');
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
        // Check if user exists from previous signup
        const existingUser = getExistingUser('google');
        
        if (existingUser) {
            console.log('✅ Google login successful (existing user):', existingUser.name);
            completeSocialLogin(existingUser, 'google');
        } else {
            // Create new user (shouldn't happen often with proper auth)
            const newUser = generateGoogleUser();
            console.log('✅ Google login successful (new session):', newUser.name);
            completeSocialLogin(newUser, 'google');
        }
        
        // Restore button after a delay
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 1000);
        
    }, 2000);
}

function handleAppleLogin() {
    console.log('🔐 Apple login initiated');
    
    const btn = document.getElementById('appleLoginBtn');
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
        // Check if user exists from previous signup
        const existingUser = getExistingUser('apple');
        
        if (existingUser) {
            console.log('✅ Apple login successful (existing user):', existingUser.name);
            completeSocialLogin(existingUser, 'apple');
        } else {
            // Create new user (shouldn't happen often with proper auth)
            const newUser = generateAppleUser();
            console.log('✅ Apple login successful (new session):', newUser.name);
            completeSocialLogin(newUser, 'apple');
        }
        
        // Restore button after a delay
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 1000);
        
    }, 2000);
}

function getExistingUser(provider) {
    const userData = localStorage.getItem('domihive_current_user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.provider === provider) {
                return user;
            }
        } catch (error) {
            console.error('Error parsing existing user:', error);
        }
    }
    return null;
}

function generateGoogleUser() {
    // Try to get existing user first
    const existingUser = getExistingUser('google');
    if (existingUser) return existingUser;
    
    // Fallback: generate new user data
    const firstNames = ['John', 'Jane', 'David', 'Sarah', 'Michael', 'Emily', 'Chris', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
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
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
}

function generateAppleUser() {
    // Try to get existing user first
    const existingUser = getExistingUser('apple');
    if (existingUser) return existingUser;
    
    // Fallback: generate new user data
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
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
}

function completeSocialLogin(user, provider) {
    console.log(`✅ ${provider} login completed:`, user.name);
    
    // Update last login timestamp
    user.lastLogin = new Date().toISOString();
    
    // Save user data
    localStorage.setItem('domihive_current_user', JSON.stringify(user));
    localStorage.setItem('domihive_user_avatar', user.avatar);
    
    // Show success notification
    showNotification(`Welcome back, ${user.name}!`, 'success');
    
    // Handle "Remember me" functionality
    handleRememberMe(user.phone);
    
    // Track login activity
    trackUserLogin(user.id, provider);
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
        window.location.href = './dashboard-rent.html';
    }, 1500);
}

// ===== PHONE LOGIN FUNCTIONALITY =====
function initPhoneLoginForm() {
    const loginForm = document.getElementById('phoneLoginForm');
    const loginBtn = document.getElementById('loginSubmitBtn');

    loginForm.addEventListener('submit', handlePhoneLogin);
    
    // Real-time validation
    const inputs = loginForm.querySelectorAll('input[type="tel"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateLoginField);
        input.addEventListener('input', clearLoginFieldError);
    });
    
    // Check if we should auto-check "Remember me"
    const rememberedPhone = localStorage.getItem('domihive_remembered_phone');
    if (rememberedPhone) {
        document.getElementById('rememberMe').checked = true;
    }
}

function handlePhoneLogin(e) {
    e.preventDefault();
    console.log('📱 Phone login submitted');
    
    const submitBtn = document.getElementById('loginSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    // Validate form
    if (!validateLoginForm()) {
        // Hide loading state if validation fails
        btnText.style.display = 'flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const phoneNumber = formData.get('loginPhoneNumber');
    const password = formData.get('loginPassword');
    const rememberMe = formData.get('rememberMe') === 'on';
    
    // Simulate API call with user verification
    setTimeout(() => {
        // Check if user exists and credentials are valid
        const user = verifyPhoneCredentials(phoneNumber, password);
        
        if (user) {
            completePhoneLogin(user, rememberMe);
        } else {
            showNotification('Invalid phone number or password', 'error');
        }
        
        // Restore button
        btnText.style.display = 'flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        
    }, 1500);
}

function verifyPhoneCredentials(phoneNumber, password) {
    // Get stored user data
    const userData = localStorage.getItem('domihive_current_user');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const fullPhone = '+234' + phoneNumber;
            
            // Simple verification (in real app, this would be server-side)
            if (user.phone === fullPhone && password.length >= 6) {
                console.log('✅ Phone credentials verified for:', user.name);
                return user;
            }
        } catch (error) {
            console.error('Error verifying credentials:', error);
        }
    }
    
    // If no stored user or verification fails, check simulated users
    return simulatePhoneLogin(phoneNumber, password);
}

function simulatePhoneLogin(phoneNumber, password) {
    // This simulates finding a user in the database
    // In a real app, this would be a server API call
    
    const simulatedUsers = [
        {
            id: 'user_phone_1',
            name: 'John Doe',
            phone: '+2348012345678',
            type: 'tenant',
            provider: 'phone',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=9f7539&color=fff',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        },
        {
            id: 'user_phone_2', 
            name: 'Jane Smith',
            phone: '+2348098765432',
            type: 'tenant',
            provider: 'phone',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=0e1f42&color=fff',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        }
    ];
    
    const fullPhone = '+234' + phoneNumber;
    const user = simulatedUsers.find(u => u.phone === fullPhone && password.length >= 6);
    
    if (user) {
        console.log('✅ Simulated phone login successful for:', user.name);
        return user;
    }
    
    return null;
}

function completePhoneLogin(user, rememberMe) {
    console.log('✅ Phone login completed:', user.name);
    
    // Update last login timestamp
    user.lastLogin = new Date().toISOString();
    
    // Save user data
    localStorage.setItem('domihive_current_user', JSON.stringify(user));
    localStorage.setItem('domihive_user_avatar', user.avatar);
    
    // Handle "Remember me" functionality
    handleRememberMe(rememberMe ? user.phone : null);
    
    // Show success notification
    showNotification(`Welcome back, ${user.name}!`, 'success');
    
    // Track login activity
    trackUserLogin(user.id, 'phone');
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
        window.location.href = '/dashboard.html';
    }, 1500);
}

function handleRememberMe(phoneNumber) {
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (rememberMe && phoneNumber) {
        localStorage.setItem('domihive_remembered_phone', phoneNumber);
        console.log('💾 Phone number remembered for future logins');
    } else {
        localStorage.removeItem('domihive_remembered_phone');
        console.log('🗑️ Phone number remembering disabled');
    }
}

// ===== FORM VALIDATION =====
function validateLoginForm() {
    let isValid = true;
    
    // Reset previous errors
    clearAllLoginErrors();
    
    // Validate phone number
    const phoneNumber = document.getElementById('loginPhoneNumber').value.trim();
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber) {
        showLoginError('phoneError', 'Phone number is required');
        document.querySelector('.phone-input-container').classList.add('error');
        isValid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
        showLoginError('phoneError', 'Please enter a valid 10-digit phone number');
        document.querySelector('.phone-input-container').classList.add('error');
        isValid = false;
    }
    
    // Validate password
    const password = document.getElementById('loginPassword').value;
    if (!password) {
        showLoginError('passwordError', 'Password is required');
        document.getElementById('loginPassword').classList.add('error');
        isValid = false;
    } else if (password.length < 6) {
        showLoginError('passwordError', 'Password must be at least 6 characters');
        document.getElementById('loginPassword').classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

function validateLoginField(e) {
    const field = e.target;
    const fieldId = field.id;
    const value = field.value.trim();
    
    switch (fieldId) {
        case 'loginPhoneNumber':
            const phoneRegex = /^[0-9]{10}$/;
            if (!value) {
                showLoginError('phoneError', 'Phone number is required');
                document.querySelector('.phone-input-container').classList.add('error');
            } else if (!phoneRegex.test(value)) {
                showLoginError('phoneError', 'Please enter a valid 10-digit phone number');
                document.querySelector('.phone-input-container').classList.add('error');
            } else {
                clearLoginError('phoneError');
                document.querySelector('.phone-input-container').classList.remove('error');
            }
            break;
            
        case 'loginPassword':
            if (!value) {
                showLoginError('passwordError', 'Password is required');
                field.classList.add('error');
            } else if (value.length < 6) {
                showLoginError('passwordError', 'Password must be at least 6 characters');
                field.classList.add('error');
            } else {
                clearLoginError('passwordError');
                field.classList.remove('error');
            }
            break;
    }
}

function clearLoginFieldError(e) {
    const field = e.target;
    const fieldId = field.id;
    
    // Clear error when user starts typing
    clearLoginError(fieldId + 'Error');
    field.classList.remove('error');
    
    if (fieldId === 'loginPhoneNumber') {
        document.querySelector('.phone-input-container').classList.remove('error');
    }
}

// ===== ERROR HANDLING =====
function showLoginError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearLoginError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearAllLoginErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => error.classList.remove('show'));
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
    
    document.querySelector('.phone-input-container').classList.remove('error');
}

// ===== FORGOT PASSWORD =====
function handleForgotPassword() {
    const phoneNumber = document.getElementById('loginPhoneNumber').value.trim();
    
    if (!phoneNumber || phoneNumber.length !== 10) {
        showNotification('Please enter your phone number first to reset password', 'warning');
        document.getElementById('loginPhoneNumber').focus();
        return;
    }
    
    showNotification(`Password reset link sent to +234${phoneNumber}`, 'success');
    console.log('📧 Password reset initiated for:', '+234' + phoneNumber);
    
    // Simulate sending reset link
    setTimeout(() => {
        showNotification('Check your phone for password reset instructions', 'success');
    }, 2000);
}

// ===== USER ACTIVITY TRACKING =====
function trackUserLogin(userId, method) {
    const loginActivity = {
        userId: userId,
        method: method,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
    };
    
    // Save login activity
    const activities = JSON.parse(localStorage.getItem('domihive_login_activities') || '[]');
    activities.push(loginActivity);
    
    // Keep only last 10 activities
    if (activities.length > 10) {
        activities.shift();
    }
    
    localStorage.setItem('domihive_login_activities', JSON.stringify(activities));
    console.log('📊 Login activity tracked:', loginActivity);
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
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

// ===== DATA MANAGEMENT =====
function clearUserData() {
    localStorage.removeItem('domihive_current_user');
    localStorage.removeItem('domihive_user_avatar');
    localStorage.removeItem('domihive_remembered_phone');
    console.log('🧹 User data cleared');
}

// ===== ANIMATIONS =====
function addPageAnimations() {
    // CSS animations are already in the CSS file
    console.log('🎬 Page animations initialized');
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
window.handleForgotPassword = handleForgotPassword;
window.showNotification = showNotification;
window.clearUserData = clearUserData;

console.log('🎉 DomiHive Login JavaScript Loaded - User Memory Enabled!');