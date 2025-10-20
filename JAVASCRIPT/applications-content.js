// applications-content.js - DomiHive Applications Management (Updated Logic)

// ===== GLOBAL VARIABLES =====
let allBookings = [];
let allApplications = [];
let currentUser = null;
let currentPropertyForDecision = null;

// ===== INITIALIZATION =====
function initializeApplications() {
    console.log('📋 Initializing Applications Module...');
    
    // Load data
    loadUserData();
    loadApplicationsData();
    
    // Initialize components
    updateApplicationStats();
    renderAllSections();
    initializeEventListeners();
    
    console.log('✅ Applications module loaded');
}

function loadUserData() {
    const userData = localStorage.getItem('domihive_current_user');
    if (userData) {
        currentUser = JSON.parse(userData);
    } else {
        // Default user for demo
        currentUser = {
            id: 'user_1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+2348012345678'
        };
    }
}

function loadApplicationsData() {
    // Load bookings from localStorage
    allBookings = JSON.parse(localStorage.getItem('domihive_inspection_bookings')) || [];
    
    // Load applications from localStorage
    allApplications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
    
    console.log('📊 Loaded data:', {
        bookings: allBookings.length,
        applications: allApplications.length
    });
}

// ===== STATISTICS MANAGEMENT =====
function updateApplicationStats() {
    const pendingCount = allBookings.filter(booking => 
        !allApplications.find(app => app.bookingId === booking.bookingId && app.status !== 'rejected')
    ).length;
    
    const activeCount = allApplications.filter(app => 
        app.status === 'active' || app.status === 'under_review'
    ).length;
    
    const approvedCount = allApplications.filter(app => 
        app.status === 'approved'
    ).length;
    
    // Update DOM
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('approvedCount').textContent = approvedCount;
    
    console.log('📈 Stats updated:', { pendingCount, activeCount, approvedCount });
}

// ===== SECTION RENDERING =====
function renderAllSections() {
    renderPostInspectionProperties();
    renderActiveApplications();
}

function renderPostInspectionProperties() {
    const container = document.getElementById('postInspectionGrid');
    if (!container) return;
    
    // FOR TESTING: Show ALL bookings in "Properties Ready for Application"
    const readyProperties = allBookings.filter(booking => {
        const application = allApplications.find(app => app.bookingId === booking.bookingId);
        // Show property if no application exists OR if it's not rejected
        return !application || application.status !== 'rejected';
    });
    
    if (readyProperties.length === 0) {
        container.innerHTML = `
            <div class="empty-applications">
                <div class="empty-icon">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <h3>No Properties Ready for Application</h3>
                <p>Properties you've booked for inspection will appear here.</p>
                <button class="btn-primary" onclick="dashboard.navigateToSection('browse')">
                    <i class="fas fa-search"></i>
                    Browse Properties
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = readyProperties.map(booking => {
        const application = allApplications.find(app => app.bookingId === booking.bookingId);
        const status = application ? application.status : 'pending_decision';
        
        let statusBadge = '';
        let statusMessage = '';
        
        if (status === 'rejected') {
            statusBadge = '<span class="property-badge-app badge-rejected">Not Interested</span>';
            statusMessage = 'You indicated you\'re not interested in this property';
        } else {
            statusBadge = '<span class="property-badge-app badge-ready">Ready for Application</span>';
            statusMessage = 'Continue your application process';
        }
        
        return `
            <div class="property-card-app" data-booking-id="${booking.bookingId}">
                <div class="property-image-app">
                    <img src="/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg" alt="${booking.propertyTitle}">
                    <div class="property-badges-app">
                        ${statusBadge}
                    </div>
                </div>
                
                <div class="property-details-app">
                    <div class="property-price-app">₦${booking.propertyPrice ? booking.propertyPrice.toLocaleString() : '0'}/year</div>
                    <h3 class="property-title-app">${booking.propertyTitle}</h3>
                    <div class="property-location-app">
                        <i class="fas fa-map-marker-alt"></i>
                        ${booking.propertyLocation}
                    </div>
                    
                    <div class="property-features-app">
                        <span class="property-feature-app">
                            <i class="fas fa-calendar"></i>
                            Inspection: ${formatInspectionDate(booking.inspectionDate)}
                        </span>
                        <span class="property-feature-app">
                            <i class="fas fa-clock"></i>
                            ${formatTime(booking.inspectionTime)}
                        </span>
                        <span class="property-feature-app">
                            <i class="fas fa-user-friends"></i>
                            ${booking.attendeesText}
                        </span>
                    </div>
                    
                    <div class="inspection-date-app">
                        <strong>${status === 'rejected' ? 'Decision Made' : 'Ready to Apply'}</strong>
                        <span>${statusMessage}</span>
                    </div>
                    
                    <div class="property-actions-app">
                        ${status === 'rejected' ? 
                            `<button class="btn-continue-app" onclick="showRejectedMessage()" style="background: #6b7280;">
                                <i class="fas fa-info-circle"></i>
                                View Decision
                            </button>` :
                            `<button class="btn-continue-app" onclick="openDecisionModal('${booking.bookingId}')">
                                <i class="fas fa-play-circle"></i>
                                Continue Application
                            </button>`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderActiveApplications() {
    const container = document.getElementById('activeApplicationsList');
    if (!container) return;
    
    const activeApplications = allApplications.filter(app => 
        app.status === 'active' || app.status === 'under_review' || app.status === 'approved'
    );
    
    if (activeApplications.length === 0) {
        container.innerHTML = `
            <div class="empty-applications">
                <div class="empty-icon">
                    <i class="fas fa-file-contract"></i>
                </div>
                <h3>No Active Applications</h3>
                <p>Your active applications will appear here once you start the process.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeApplications.map(application => {
        const booking = allBookings.find(b => b.bookingId === application.bookingId);
        if (!booking) return '';
        
        const statusConfig = {
            'active': { class: 'status-pending', text: 'In Progress' },
            'under_review': { class: 'status-under-review', text: 'Under Review' },
            'approved': { class: 'status-approved', text: 'Approved' }
        };
        
        const status = statusConfig[application.status] || statusConfig.active;
        
        return `
            <div class="application-item" data-application-id="${application.id}">
                <div class="application-info">
                    <h4>${booking.propertyTitle}</h4>
                    <div class="application-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${booking.propertyLocation}</span>
                        <span><i class="fas fa-calendar"></i> Applied on ${formatDate(application.applicationDate)}</span>
                        <span><i class="fas fa-money-bill-wave"></i> ₦${booking.propertyPrice ? booking.propertyPrice.toLocaleString() : '0'}/year</span>
                    </div>
                </div>
                <div class="application-status ${status.class}">${status.text}</div>
            </div>
        `;
    }).join('');
}

// ===== DECISION MODAL LOGIC =====
function openDecisionModal(bookingId) {
    const booking = allBookings.find(b => b.bookingId === bookingId);
    if (!booking) {
        console.error('Booking not found:', bookingId);
        return;
    }
    
    currentPropertyForDecision = booking;
    
    // Update modal content
    document.getElementById('modalPropertyPreview').innerHTML = `
        <div class="preview-header">
            <div class="preview-image">
                <img src="/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg" alt="${booking.propertyTitle}">
            </div>
            <div class="preview-info">
                <h4>${booking.propertyTitle}</h4>
                <div class="preview-price">₦${booking.propertyPrice ? booking.propertyPrice.toLocaleString() : '0'}/year</div>
                <div class="preview-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${booking.propertyLocation}
                </div>
            </div>
        </div>
    `;
    
    // Update inspection date
    document.getElementById('scheduledInspectionDate').textContent = 
        formatDateTime(booking.inspectionDate, booking.inspectionTime);
    
    // Reset form to initial state
    resetDecisionForm();
    
    // Show modal
    const modal = document.getElementById('decisionModal');
    modal.style.display = 'flex';
    modal.classList.add('active');
}

function closeDecisionModal() {
    const modal = document.getElementById('decisionModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
    currentPropertyForDecision = null;
}

function resetDecisionForm() {
    // Reset all steps
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    
    // Hide all messages and sections
    document.getElementById('inspectionRequiredMessage').style.display = 'none';
    document.getElementById('rejectionSection').style.display = 'none';
    document.getElementById('proceedSection').style.display = 'none';
    
    // Reset rejection form
    document.querySelectorAll('input[name="rejectionReason"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('otherReason').style.display = 'none';
    document.querySelector('#otherReason textarea').value = '';
}

function handleAnswer(questionNumber, answer) {
    console.log(`Question ${questionNumber}:`, answer ? 'Yes' : 'No');
    
    // Hide all messages first
    document.getElementById('inspectionRequiredMessage').style.display = 'none';
    document.getElementById('rejectionSection').style.display = 'none';
    document.getElementById('proceedSection').style.display = 'none';

    if (questionNumber === 1) {
        if (answer === false) {
            // Q1: No - show inspection message
            document.getElementById('inspectionRequiredMessage').style.display = 'block';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
        } else {
            // Q1: Yes - show question 2
            document.getElementById('step2').style.display = 'block';
            document.getElementById('step3').style.display = 'none';
        }
    }
    else if (questionNumber === 2) {
        if (answer === false) {
            // Q2: No - show rejection form immediately
            document.getElementById('rejectionSection').style.display = 'block';
            document.getElementById('step3').style.display = 'none';
        } else {
            // Q2: Yes - show question 3
            document.getElementById('step3').style.display = 'block';
        }
    }
    else if (questionNumber === 3) {
        if (answer === false) {
            // Q3: No - show rejection form
            document.getElementById('rejectionSection').style.display = 'block';
        } else {
            // Q3: Yes - show proceed button
            document.getElementById('proceedSection').style.display = 'block';
        }
    }
}
function redirectToApplication() {
    if (!currentPropertyForDecision) return;
    
    // Create application record
    const application = {
        id: 'app_' + Date.now(),
        bookingId: currentPropertyForDecision.bookingId,
        propertyId: currentPropertyForDecision.propertyId,
        userId: currentUser.id,
        status: 'active',
        applicationDate: new Date().toISOString(),
        decisionDate: new Date().toISOString(),
        answers: {
            inspected: true,
            liked: true,
            readyToRent: true
        },
        inspectionCompleted: true
    };
    
    // Update or add application
    const existingIndex = allApplications.findIndex(app => app.bookingId === application.bookingId);
    if (existingIndex !== -1) {
        allApplications[existingIndex] = application;
    } else {
        allApplications.push(application);
    }
    
    // Save to localStorage
    localStorage.setItem('domihive_applications', JSON.stringify(allApplications));
    
    // Create success notification
    createApplicationNotification('application_started', currentPropertyForDecision);
    
    // Close modal and refresh
    closeDecisionModal();
    updateApplicationStats();
    renderAllSections();
    
    console.log('✅ Application started:', application.id);
    
    // Show success message and redirect
    showNotification('Great! Redirecting to application form...', 'success');
    
    // Redirect to application page after a short delay
    setTimeout(() => {
        window.location.href = './application-process.html';
    }, 1500);
}
function handleApplicationDecision() {
    if (!currentPropertyForDecision) return;
    
    // Create application record
    const application = {
        id: 'app_' + Date.now(),
        bookingId: currentPropertyForDecision.bookingId,
        propertyId: currentPropertyForDecision.propertyId,
        userId: currentUser.id,
        status: 'active',
        applicationDate: new Date().toISOString(),
        decisionDate: new Date().toISOString(),
        answers: {
            inspected: true,
            liked: true,
            willingToRent: true
        },
        inspectionCompleted: true
    };
    
    // Update or add application
    const existingIndex = allApplications.findIndex(app => app.bookingId === application.bookingId);
    if (existingIndex !== -1) {
        allApplications[existingIndex] = application;
    } else {
        allApplications.push(application);
    }
    
    // Save to localStorage
    localStorage.setItem('domihive_applications', JSON.stringify(allApplications));
    
    // Create success notification
    createApplicationNotification('application_started', currentPropertyForDecision);
    
    // Close modal and refresh
    closeDecisionModal();
    updateApplicationStats();
    renderAllSections();
    
    console.log('✅ Application started:', application.id);
    
    // Show success message
    showNotification('Great! You can now proceed with the full application process.', 'success');
    
    // In a real app, this would redirect to the full application form
    // setTimeout(() => {
    //     window.location.href = '/Pages/full-application.html?bookingId=' + currentPropertyForDecision.bookingId;
    // }, 2000);
}

function submitRejection() {
    if (!currentPropertyForDecision) return;
    
    const q2 = document.getElementById('question2').checked;
    const q3 = document.getElementById('question3').checked;
    
    const rejectionReasons = Array.from(document.querySelectorAll('input[name="rejectionReason"]:checked'))
        .map(checkbox => checkbox.value);
    
    const otherReason = document.querySelector('#otherReason textarea').value;
    if (otherReason) {
        rejectionReasons.push(`other: ${otherReason}`);
    }
    
    // If no reasons selected but rejection is triggered, add default reason
    if (rejectionReasons.length === 0) {
        if (!q2) {
            rejectionReasons.push('did_not_like_property');
        } else if (!q3) {
            rejectionReasons.push('not_ready_to_rent');
        }
    }
    
    // Create rejection record
    const application = {
        id: 'app_' + Date.now(),
        bookingId: currentPropertyForDecision.bookingId,
        propertyId: currentPropertyForDecision.propertyId,
        userId: currentUser.id,
        status: 'rejected',
        applicationDate: new Date().toISOString(),
        decisionDate: new Date().toISOString(),
        answers: {
            inspected: document.getElementById('question1').checked,
            liked: document.getElementById('question2').checked,
            willingToRent: document.getElementById('question3').checked
        },
        rejectionReasons: rejectionReasons,
        otherReason: otherReason,
        inspectionCompleted: true
    };
    
    // Update or add application
    const existingIndex = allApplications.findIndex(app => app.bookingId === application.bookingId);
    if (existingIndex !== -1) {
        allApplications[existingIndex] = application;
    } else {
        allApplications.push(application);
    }
    
    // Save to localStorage
    localStorage.setItem('domihive_applications', JSON.stringify(allApplications));
    
    // Create notification
    createApplicationNotification('property_rejected', currentPropertyForDecision);
    
    // Close modal and refresh
    closeDecisionModal();
    updateApplicationStats();
    renderAllSections();
    
    console.log('❌ Property rejected:', application.id, rejectionReasons);
    showNotification('Thank you for your feedback. You can always rent this property later if it\'s still available.', 'success');
}

function showRejectedMessage() {
    showNotification('You\'ve previously indicated you\'re not interested in this property. You can still browse other properties!', 'info');
}

// ===== NOTIFICATION SYSTEM =====
function createApplicationNotification(type, booking) {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    
    const notificationConfig = {
        'application_started': {
            title: 'Application Started',
            message: `You've started an application for ${booking.propertyTitle}`
        },
        'property_rejected': {
            title: 'Property Feedback Submitted',
            message: `Thank you for your feedback on ${booking.propertyTitle}`
        }
    };
    
    const config = notificationConfig[type] || notificationConfig.application_started;
    
    const notification = {
        id: 'notif_' + Date.now(),
        type: type,
        title: config.title,
        message: config.message,
        timestamp: new Date().toISOString(),
        read: false,
        bookingId: booking.bookingId,
        propertyId: booking.propertyId
    };
    
    notifications.unshift(notification);
    localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    
    // Update notification badge
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Update badge in header
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = unreadCount > 0 ? unreadCount : '';
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// ===== SUPPORT FEATURES =====
function downloadChecklist() {
    // In a real app, this would download a PDF
    showNotification('Document checklist downloaded successfully!', 'success');
    console.log('📋 Checklist download triggered');
}

function initiatePayment() {
    // In a real app, this would open a payment modal
    showNotification('Payment process initiated. You will be redirected to secure payment.', 'success');
    console.log('💳 Payment initiation triggered');
}

function contactSupport(channel) {
    const supportInfo = {
        'phone': { number: '+2349003664448', text: 'Support Line' },
        'whatsapp': { number: '+2349012345678', text: 'WhatsApp Support' },
        'email': { address: 'support@domihive.com', text: 'Email Support' }
    };
    
    const info = supportInfo[channel];
    if (info) {
        showNotification(`Opening ${info.text}...`, 'success');
        console.log(`📞 Contacting ${info.text}:`, info.number || info.address);
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatInspectionDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(date, time) {
    const dateObj = new Date(date + 'T' + time);
    return dateObj.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
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
        background: ${type === 'success' ? '#10b981' : type === 'info' ? '#3b82f6' : '#ef4444'};
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
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-triangle'}"></i>
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

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Decision modal checkboxes
    document.querySelectorAll('.decision-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Rejection reason checkboxes
    document.querySelectorAll('input[name="rejectionReason"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleCheckboxChange();
            // Specifically handle "other" reason visibility
            if (this.value === 'other') {
                document.getElementById('otherReason').style.display = this.checked ? 'block' : 'none';
            }
        });
    });
    
    // Support buttons
    const downloadBtn = document.querySelector('.btn-download');
    const paymentBtn = document.querySelector('.btn-payment');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadChecklist);
    }
    
    if (paymentBtn) {
        paymentBtn.addEventListener('click', initiatePayment);
    }
    
    // Contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const channel = this.classList.contains('call') ? 'phone' : 
                           this.classList.contains('whatsapp') ? 'whatsapp' : 'email';
            contactSupport(channel);
        });
    });
}

// ===== GLOBAL FUNCTIONS =====
window.initializeApplications = initializeApplications;
window.openDecisionModal = openDecisionModal;
window.closeDecisionModal = closeDecisionModal;
window.handleApplicationDecision = handleApplicationDecision;
window.submitRejection = submitRejection;
window.showRejectedMessage = showRejectedMessage;
window.downloadChecklist = downloadChecklist;
window.initiatePayment = initiatePayment;

// Auto-initialize when included
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the applications page
    if (document.querySelector('.applications-content')) {
        setTimeout(initializeApplications, 100);
    }
});

console.log('🎉 DomiHive Applications Content Loaded!');