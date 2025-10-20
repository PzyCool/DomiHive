// overview-content.js - DomiHive Premium Overview Dashboard

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let liveDataInterval = null;
let financialChart = null;
let activities = [];
let isSupportWidgetExpanded = false;

// ===== INITIALIZATION =====
function initializeOverview() {
    console.log('🚀 Initializing Premium Overview Dashboard...');
    
    // Load user data first
    loadCurrentUser();
    
    // Initialize all components
    initializeUserInterface();
    initializeMetrics();
    initializeActivityFeed();
    initializeFinancialChart();
    initializeRealTimeUpdates();
    initializeEventListeners();
    
    // Start live data simulation
    startLiveDataUpdates();
    
    console.log('✅ Premium Overview Dashboard initialized');
}

// ===== USER MANAGEMENT =====
function loadCurrentUser() {
    const userData = localStorage.getItem('domihive_current_user');
    const userAvatar = localStorage.getItem('domihive_user_avatar');
    
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            console.log('👤 User loaded:', currentUser.name);
            
            // Update user-specific data
            updateUserSpecificData();
        } catch (error) {
            console.error('Error loading user data:', error);
            currentUser = getDefaultUser();
        }
    } else {
        console.log('⚠️ No user found, using demo data');
        currentUser = getDefaultUser();
    }
}

function getDefaultUser() {
    return {
        id: 'user_' + Date.now(),
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+2348012345678',
        joinDate: new Date().toISOString(),
        tier: 'premium',
        properties: ['prop_1', 'prop_2']
    };
}

function updateUserSpecificData() {
    // Update welcome message with user's name
    const welcomeTitle = document.getElementById('welcomeTitle');
    const userName = document.getElementById('userName');
    
    if (welcomeTitle && userName) {
        userName.textContent = currentUser.name;
        
        // Update greeting based on time of day
        const hour = new Date().getHours();
        let greeting = 'Good Morning';
        
        if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon';
        } else if (hour >= 17) {
            greeting = 'Good Evening';
        }
        
        welcomeTitle.innerHTML = `${greeting}, <span id="userName">${currentUser.name}</span>! 👋`;
    }
}

// ===== USER INTERFACE INITIALIZATION =====
function initializeUserInterface() {
    updateLastUpdateTime();
    initializeGreetingAnimation();
    initializeMetricAnimations();
}

function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdateTime');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = 'Just now';
    }
}

function initializeGreetingAnimation() {
    // Add subtle animation to welcome section
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        welcomeSection.style.animation = 'slideInUp 0.8s ease';
    }
}

function initializeMetricAnimations() {
    // Animate metric cards on load
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.6s ease ${index * 0.1}s both`;
    });
}

// ===== METRICS MANAGEMENT =====
function initializeMetrics() {
    updateFinancialMetrics();
    updatePropertyMetrics();
    updateApplicationMetrics();
    updateMaintenanceMetrics();
    updateSidebarStatus();
}

function updateFinancialMetrics() {
    const financialData = getFinancialData();
    
    // Update financial metric card
    const nextPaymentElement = document.getElementById('nextPaymentDate');
    const progressFill = document.querySelector('.progress-fill');
    
    if (nextPaymentElement) {
        nextPaymentElement.textContent = `${financialData.daysUntilDue} days`;
    }
    
    if (progressFill) {
        const progressPercentage = ((30 - financialData.daysUntilDue) / 30) * 100;
        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
    }
}

function updatePropertyMetrics() {
    const properties = getUserProperties();
    
    // Update properties list in real-time
    const propertiesList = document.querySelector('.properties-list');
    if (propertiesList) {
        propertiesList.innerHTML = properties.map(property => `
            <div class="property-item">
                <div class="property-avatar">
                    <i class="fas fa-${property.type === 'apartment' ? 'building' : 'home'}"></i>
                </div>
                <div class="property-info">
                    <strong>${property.name}</strong>
                    <span>₦${property.rent.toLocaleString()}/month</span>
                </div>
                <div class="property-status ${property.status}"></div>
            </div>
        `).join('');
    }
}

function updateApplicationMetrics() {
    const applications = getUserApplications();
    
    // Update applications progress
    const activeApps = applications.filter(app => app.status === 'active' || app.status === 'under_review');
    document.querySelector('.metric-badge.urgent').textContent = `${activeApps.length} Active`;
    
    // Simulate progress updates
    updateApplicationProgress(applications);
}

function updateMaintenanceMetrics() {
    const maintenanceRequests = getMaintenanceRequests();
    const pendingRequests = maintenanceRequests.filter(req => req.status === 'pending');
    
    // Update maintenance alert
    if (pendingRequests.length > 0) {
        const latestRequest = pendingRequests[0];
        const maintenanceAlert = document.querySelector('.maintenance-alert');
        
        if (maintenanceAlert) {
            maintenanceAlert.innerHTML = `
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-content">
                    <strong>${latestRequest.title}</strong>
                    <span>${latestRequest.status}</span>
                </div>
                <div class="alert-time">${formatRelativeTime(latestRequest.date)}</div>
            `;
        }
    }
}

function updateApplicationProgress(applications) {
    // Simulate progress through application steps
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((step, index) => {
        step.classList.remove('completed', 'active');
        
        if (index < 2) {
            step.classList.add('completed');
        } else if (index === 2) {
            step.classList.add('active');
        }
    });
}

// ===== ACTIVITY FEED =====
function initializeActivityFeed() {
    activities = generateRecentActivities();
    renderActivityFeed();
    initializeActivityFilters();
}

function generateRecentActivities() {
    return [
        {
            id: 1,
            type: 'maintenance',
            title: 'Maintenance request approved',
            description: 'Your kitchen sink repair request has been approved',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            icon: 'fas fa-tools',
            status: 'completed'
        },
        {
            id: 2,
            type: 'financial',
            title: 'Rent payment confirmed',
            description: 'Payment of ₦150,000 for Lekki Apartment has been processed',
            time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            icon: 'fas fa-credit-card',
            amount: '₦150,000'
        },
        {
            id: 3,
            type: 'messages',
            title: 'New message from Property Manager',
            description: 'Regarding your upcoming inspection schedule',
            time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            icon: 'fas fa-comments',
            unread: true
        },
        {
            id: 4,
            type: 'applications',
            title: 'Application status updated',
            description: 'Your application for Ikeja Duplex is now under review',
            time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            icon: 'fas fa-file-alt',
            status: 'under_review'
        }
    ];
}

function renderActivityFeed(filter = 'all') {
    const activityTimeline = document.getElementById('activityTimeline');
    if (!activityTimeline) return;
    
    const filteredActivities = filter === 'all' 
        ? activities 
        : activities.filter(activity => activity.type === filter);
    
    activityTimeline.innerHTML = filteredActivities.map(activity => `
        <div class="activity-item ${activity.type}" onclick="handleActivityClick(${activity.id})">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-meta">
                    <span class="activity-time">${formatRelativeTime(activity.time)}</span>
                    ${activity.amount ? `<span class="activity-amount">${activity.amount}</span>` : ''}
                    ${activity.status ? `<span class="activity-status">${activity.status}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add entrance animations
    setTimeout(() => {
        const activityItems = activityTimeline.querySelectorAll('.activity-item');
        activityItems.forEach((item, index) => {
            item.style.animation = `slideInUp 0.5s ease ${index * 0.1}s both`;
        });
    }, 100);
}

function initializeActivityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter activities
            const filter = this.getAttribute('data-filter');
            renderActivityFeed(filter);
        });
    });
}

function handleActivityClick(activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    console.log('📋 Activity clicked:', activity);
    
    // Show notification
    showNotification(`Opening ${activity.type} details...`, 'info');
    
    // Navigate to relevant section based on activity type
    switch(activity.type) {
        case 'financial':
            dashboard.navigateToSection('payments');
            break;
        case 'maintenance':
            dashboard.navigateToSection('maintenance');
            break;
        case 'messages':
            dashboard.navigateToSection('messages');
            break;
        case 'applications':
            dashboard.navigateToSection('applications');
            break;
    }
}

// ===== FINANCIAL CHART =====
function initializeFinancialChart() {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;
    
    const financialData = getFinancialChartData();
    
    financialChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: financialData.labels,
            datasets: [{
                label: 'Rent Payments',
                data: financialData.values,
                borderColor: '#9f7539',
                backgroundColor: 'rgba(159, 117, 57, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#9f7539',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(14, 31, 66, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#9f7539',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `₦${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₦' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                }
            }
        }
    });
}

function updateFinancialChart() {
    const timeRange = document.getElementById('timeRangeSelect').value;
    const newData = getFinancialChartData(timeRange);
    
    if (financialChart) {
        financialChart.data.labels = newData.labels;
        financialChart.data.datasets[0].data = newData.values;
        financialChart.update('none');
        
        // Smooth transition animation
        setTimeout(() => {
            financialChart.update();
        }, 300);
    }
}

function getFinancialChartData(range = '3m') {
    const ranges = {
        '1m': { months: 1, points: 4 },
        '3m': { months: 3, points: 12 },
        '6m': { months: 6, points: 24 },
        '1y': { months: 12, points: 12 }
    };
    
    const config = ranges[range] || ranges['3m'];
    const labels = [];
    const values = [];
    
    const baseRent = 150000;
    const now = new Date();
    
    for (let i = config.points; i > 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        
        // Simulate realistic rent data with slight variations
        const variation = (Math.random() - 0.5) * 20000;
        values.push(baseRent + variation);
    }
    
    return { labels, values };
}

// ===== SIDEBAR STATUS =====
function updateSidebarStatus() {
    // This function updates all the sidebar status indicators
    // with real data from the user's account
    
    const statusData = getSidebarStatusData();
    
    // Update each status item
    Object.keys(statusData).forEach(section => {
        const item = document.querySelector(`[onclick="dashboard.navigateToSection('${section}')"]`);
        if (item) {
            const valueElement = item.querySelector('.status-value');
            const badgeElement = item.querySelector('.status-badge');
            
            if (valueElement) {
                valueElement.textContent = statusData[section].value;
            }
            
            if (badgeElement && statusData[section].badge) {
                badgeElement.textContent = statusData[section].badge.count;
                badgeElement.className = `status-badge ${statusData[section].badge.type}`;
            }
        }
    });
}

function getSidebarStatusData() {
    const userApplications = getUserApplications();
    const userProperties = getUserProperties();
    const maintenanceRequests = getMaintenanceRequests();
    const favorites = JSON.parse(localStorage.getItem('domihive_user_favorites')) || [];
    
    return {
        'browse': { value: '80+ verified properties' },
        'applications': { 
            value: `${userApplications.filter(app => app.status === 'active').length} active applications`,
            badge: { count: userApplications.filter(app => app.status === 'active').length, type: 'urgent' }
        },
        'inspections': { 
            value: '2 upcoming inspections',
            badge: { count: 2, type: '' }
        },
        'my-properties': { value: `${userProperties.length} rented properties` },
        'maintenance': { 
            value: `${maintenanceRequests.filter(req => req.status === 'pending').length} pending request`,
            badge: { count: maintenanceRequests.filter(req => req.status === 'pending').length, type: 'warning' }
        },
        'payments': { value: 'Next: ₦150,000 in 15 days' },
        'favorites': { 
            value: `${favorites.length} saved properties`,
            badge: { count: favorites.length, type: '' }
        },
        'messages': { 
            value: '3 unread messages',
            badge: { count: 3, type: 'urgent' }
        }
    };
}

// ===== REAL-TIME UPDATES =====
function initializeRealTimeUpdates() {
    // Simulate real-time data updates
    liveDataInterval = setInterval(updateLiveData, 30000); // Update every 30 seconds
    
    // Initial update
    updateLiveData();
}

function updateLiveData() {
    console.log('🔄 Updating live data...');
    
    // Update last update time
    updateLastUpdateTime();
    
    // Simulate data changes
    simulateLiveDataChanges();
    
    // Update all metrics
    updateFinancialMetrics();
    updateApplicationMetrics();
    updateMaintenanceMetrics();
    updateSidebarStatus();
    
    // Add new activity occasionally
    if (Math.random() > 0.7) {
        addNewActivity();
    }
}

function simulateLiveDataChanges() {
    // Simulate small changes in financial data
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const currentWidth = parseFloat(progressFill.style.width) || 50;
        const newWidth = Math.min(currentWidth + (Math.random() * 2), 100);
        progressFill.style.width = `${newWidth}%`;
    }
    
    // Update days until due
    const nextPaymentElement = document.getElementById('nextPaymentDate');
    if (nextPaymentElement) {
        const currentDays = parseInt(nextPaymentElement.textContent) || 15;
        const newDays = Math.max(currentDays - 1, 0);
        nextPaymentElement.textContent = `${newDays} days`;
    }
}

function addNewActivity() {
    const newActivity = {
        id: activities.length + 1,
        type: ['financial', 'maintenance', 'messages', 'applications'][Math.floor(Math.random() * 4)],
        title: 'System Update',
        description: 'Your dashboard has been updated with the latest information',
        time: new Date(),
        icon: 'fas fa-sync-alt'
    };
    
    activities.unshift(newActivity);
    renderActivityFeed();
    
    // Show subtle notification
    showNotification('New activity added to your feed', 'info');
}

function startLiveDataUpdates() {
    console.log('🔄 Starting live data updates...');
}

// ===== QUICK ACTIONS =====
function quickAction(action) {
    console.log('⚡ Quick action:', action);
    
    switch(action) {
        case 'payRent':
            handlePaymentAction();
            break;
        case 'scheduleInspection':
            scheduleInspection();
            break;
        case 'reportMaintenance':
            reportMaintenance();
            break;
        case 'browseProperties':
            dashboard.navigateToSection('browse');
            break;
    }
}

function handlePaymentAction() {
    showNotification('Opening payment portal...', 'info');
    
    // Simulate payment process
    setTimeout(() => {
        const paymentModal = createPaymentModal();
        document.body.appendChild(paymentModal);
        
        // Animate in
        setTimeout(() => {
            paymentModal.classList.add('active');
        }, 100);
    }, 500);
}

function scheduleInspection() {
    showNotification('Opening inspection scheduler...', 'info');
    dashboard.navigateToSection('browse');
}

function reportMaintenance() {
    showNotification('Opening maintenance reporting...', 'info');
    dashboard.navigateToSection('maintenance');
}

// ===== SUPPORT WIDGET =====
function toggleSupportWidget() {
    const widget = document.querySelector('.support-widget');
    const chevron = document.getElementById('supportChevron');
    
    if (widget && chevron) {
        widget.classList.toggle('expanded');
        isSupportWidgetExpanded = !isSupportWidgetExpanded;
        
        // Rotate chevron
        chevron.style.transform = isSupportWidgetExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

function startLiveChat() {
    showNotification('Connecting you with support agent...', 'info');
    
    // Simulate chat connection
    setTimeout(() => {
        showNotification('Connected with Chioma! How can we help?', 'success');
    }, 2000);
}

function scheduleCallback() {
    showNotification('Opening callback scheduler...', 'info');
    
    // In a real app, this would open a scheduling modal
    setTimeout(() => {
        showNotification('Callback scheduled for tomorrow at 2:00 PM', 'success');
    }, 1000);
}

function openHelpCenter() {
    showNotification('Opening help center...', 'info');
    // This would typically redirect to a help center page
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Support widget
    const supportHeader = document.querySelector('.support-header');
    if (supportHeader) {
        supportHeader.addEventListener('click', toggleSupportWidget);
    }
    
    // Time range selector for financial chart
    const timeRangeSelect = document.getElementById('timeRangeSelect');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', updateFinancialChart);
    }
    
    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Status items click handlers
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click feedback
            this.style.background = 'var(--accent-color)';
            this.style.color = 'var(--white)';
            
            setTimeout(() => {
                this.style.background = '';
                this.style.color = '';
            }, 300);
        });
    });
    
    // Window focus/blur for real-time updates
    window.addEventListener('focus', () => {
        console.log('🔄 Window focused - updating data');
        updateLiveData();
    });
}

// ===== DATA HELPER FUNCTIONS =====
function getFinancialData() {
    return {
        monthlyRent: 150000,
        daysUntilDue: 15,
        totalSpent: 450000,
        averageMonthly: 150000,
        savings: 15000
    };
}

function getUserProperties() {
    return [
        {
            id: 'prop_1',
            name: 'Lekki Apartment',
            type: 'apartment',
            rent: 120000,
            status: 'good',
            nextPayment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'prop_2',
            name: 'Ikeja Duplex',
            type: 'duplex',
            rent: 180000,
            status: 'warning',
            nextPayment: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        }
    ];
}

function getUserApplications() {
    return [
        {
            id: 'app_1',
            propertyId: 'prop_3',
            status: 'under_review',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'app_2',
            propertyId: 'prop_4',
            status: 'active',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'app_3',
            propertyId: 'prop_5',
            status: 'active',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
    ];
}

function getMaintenanceRequests() {
    return [
        {
            id: 'maint_1',
            title: 'Kitchen Sink Repair',
            status: 'pending',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            priority: 'medium'
        }
    ];
}

// ===== UTILITY FUNCTIONS =====
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-weight: 500;
        backdrop-filter: blur(10px);
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function createPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="payment-modal-content" style="
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        ">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Payment Portal</h3>
            <p style="color: var(--gray); margin-bottom: 2rem;">This would open the actual payment processing system.</p>
            <button onclick="this.closest('.payment-modal').remove()" style="
                background: var(--accent-color);
                color: white;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.payment-modal-content').style.transform = 'scale(1)';
    }, 100);
    
    return modal;
}

// ===== CLEANUP =====
function cleanupOverview() {
    if (liveDataInterval) {
        clearInterval(liveDataInterval);
    }
    if (financialChart) {
        financialChart.destroy();
    }
    console.log('🧹 Overview cleanup completed');
}

// ===== GLOBAL FUNCTIONS =====
window.initializeOverview = initializeOverview;
window.quickAction = quickAction;
window.toggleSupportWidget = toggleSupportWidget;
window.startLiveChat = startLiveChat;
window.scheduleCallback = scheduleCallback;
window.openHelpCenter = openHelpCenter;
window.handleActivityClick = handleActivityClick;
window.updateFinancialChart = updateFinancialChart;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the overview page
    if (document.querySelector('.overview-content')) {
        setTimeout(initializeOverview, 500);
    }
});

// Cleanup when leaving the page
window.addEventListener('beforeunload', cleanupOverview);

console.log('🎉 DomiHive Premium Overview Dashboard Loaded!');