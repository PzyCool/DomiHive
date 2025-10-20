// screening.js - Updated for Automated Screening Process

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('applicationId');

    // Media recording variables
    let mediaRecorder;
    let recordedChunks = [];
    let recordingTimer;
    let seconds = 0;

    // Screening progress variables
    let screeningProgress = {
        backgroundCheck: 0,
        creditCheck: 0,
        referenceCheck: 0,
        documentCheck: 0,
        employmentCheck: 0,
        rentalHistoryCheck: 0,
        identityCheck: 100 // Starts completed
    };

    let screeningIntervals = {};

    // Initialize the page
    initScreeningPage();
    initEventListeners();

    // Functions
    function initScreeningPage() {
        console.log('🔍 Initializing Screening Page...');
        console.log('📊 Screening Context:', { applicationId });
        
        // Load application data
        const applicationData = getApplicationData(applicationId);
        if (applicationData) {
            updatePageWithApplicationData(applicationData);
            updateApplicationSummary(applicationData);
        }
        
        // Start automated screening simulation
        startAutomatedScreening();
        
        console.log('✅ Screening page initialized');
    }

    function getApplicationData(applicationId) {
        // Get from session storage or localStorage
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

    function updatePageWithApplicationData(applicationData) {
        if (!applicationData) return;
        
        // Update property information
        document.getElementById('screeningPropertyTitle').textContent = applicationData.propertyTitle || 'Property Title';
        document.getElementById('screeningPropertyPrice').textContent = `₦${(applicationData.propertyPrice || '0').toLocaleString()}/year`;
        document.getElementById('screeningPropertyLocation').textContent = applicationData.propertyLocation || 'Location';
        
        // Update applicant information
        document.getElementById('applicantName').textContent = 
            applicationData.backgroundInfo?.fullName || 'Applicant Name';
        document.getElementById('applicationId').textContent = applicationData.applicationId || 'APP-123456';
        
        // Store application data in hidden field
        document.getElementById('applicationData').value = JSON.stringify(applicationData);
        document.getElementById('userType').value = applicationData.userType || 'tenant';
        
        // Update property image if available
        if (applicationData.propertyImage) {
            document.getElementById('screeningPropertyImage').src = applicationData.propertyImage;
        }
    }

    function updateApplicationSummary(applicationData) {
        if (!applicationData) return;
        
        // Personal Information
        document.getElementById('summaryFullName').textContent = applicationData.backgroundInfo?.fullName || 'Not provided';
        document.getElementById('summaryEmail').textContent = applicationData.backgroundInfo?.email || 'Not provided';
        document.getElementById('summaryPhone').textContent = applicationData.backgroundInfo?.phone || 'Not provided';
        document.getElementById('summaryCurrentAddress').textContent = applicationData.backgroundInfo?.currentAddress || 'Not provided';
        
        // Employment Information
        document.getElementById('summaryOccupation').textContent = applicationData.employmentInfo?.occupation || 'Not provided';
        document.getElementById('summaryEmployer').textContent = applicationData.employmentInfo?.employer || 'Not provided';
        document.getElementById('summaryEmploymentType').textContent = applicationData.employmentInfo?.employmentType || 'Not provided';
        document.getElementById('summaryMonthlyIncome').textContent = applicationData.employmentInfo?.monthlyIncome ? 
            `₦${applicationData.employmentInfo.monthlyIncome.toLocaleString()}` : 'Not provided';
        
        // Rental History
        const hasRentalHistory = applicationData.rentalHistory?.hasRentalHistory === 'true';
        document.getElementById('summaryPreviousRenter').textContent = hasRentalHistory ? 'Yes' : 'No';
        document.getElementById('summaryPreviousLandlord').textContent = applicationData.rentalHistory?.previousLandlordName || 'Not applicable';
        document.getElementById('summaryPreviousRent').textContent = applicationData.rentalHistory?.previousRentAmount ? 
            `₦${applicationData.rentalHistory.previousRentAmount.toLocaleString()}` : 'Not applicable';
        document.getElementById('summaryReasonLeaving').textContent = applicationData.rentalHistory?.reasonForLeaving || 'Not applicable';
        
        // References
        if (applicationData.references && applicationData.references.length >= 2) {
            document.getElementById('summaryRef1Name').textContent = applicationData.references[0]?.name || 'Not provided';
            document.getElementById('summaryRef1Phone').textContent = applicationData.references[0]?.phone || 'Not provided';
            document.getElementById('summaryRef1Relationship').textContent = applicationData.references[0]?.relationship || 'Not provided';
            
            document.getElementById('summaryRef2Name').textContent = applicationData.references[1]?.name || 'Not provided';
            document.getElementById('summaryRef2Phone').textContent = applicationData.references[1]?.phone || 'Not provided';
            document.getElementById('summaryRef2Relationship').textContent = applicationData.references[1]?.relationship || 'Not provided';
        }
    }

    function startAutomatedScreening() {
        console.log('🔄 Starting automated screening process...');
        
        // Start background check (starts immediately)
        startCheckProgress('backgroundCheck', 30, 85);
        
        // Start document check after 2 seconds
        setTimeout(() => {
            startCheckProgress('documentCheck', 45, 90);
        }, 2000);
        
        // Start credit check after 5 seconds
        setTimeout(() => {
            startCheckProgress('creditCheck', 0, 95);
        }, 5000);
        
        // Start reference check after 8 seconds
        setTimeout(() => {
            startCheckProgress('referenceCheck', 0, 88);
        }, 8000);
        
        // Start employment check after 10 seconds
        setTimeout(() => {
            startCheckProgress('employmentCheck', 0, 92);
        }, 10000);
        
        // Start rental history check after 12 seconds
        setTimeout(() => {
            startCheckProgress('rentalHistoryCheck', 0, 85);
        }, 12000);
        
        // Update overall progress every second
        setInterval(updateOverallProgress, 1000);
    }

    function startCheckProgress(checkName, startProgress, targetProgress) {
        const checkElement = document.getElementById(checkName);
        const statusText = checkElement.querySelector('.status-text');
        const progressFill = checkElement.querySelector('.progress-fill');
        
        // Update status to "In Progress"
        statusText.textContent = 'In Progress';
        checkElement.classList.add('in-progress');
        checkElement.classList.remove('pending', 'completed');
        
        let currentProgress = startProgress;
        screeningProgress[checkName] = currentProgress;
        
        screeningIntervals[checkName] = setInterval(() => {
            // Increment progress randomly between 1-5%
            const increment = Math.floor(Math.random() * 5) + 1;
            currentProgress = Math.min(currentProgress + increment, targetProgress);
            screeningProgress[checkName] = currentProgress;
            
            // Update progress bar
            progressFill.style.width = currentProgress + '%';
            
            // Add pulse animation for progress updates
            checkElement.classList.add('updating');
            setTimeout(() => {
                checkElement.classList.remove('updating');
            }, 500);
            
            // If reached target, complete the check
            if (currentProgress >= targetProgress) {
                completeCheck(checkName);
            }
        }, 800 + Math.random() * 1200); // Random interval between 0.8-2 seconds
    }

    function completeCheck(checkName) {
        clearInterval(screeningIntervals[checkName]);
        
        const checkElement = document.getElementById(checkName);
        const statusText = checkElement.querySelector('.status-text');
        const progressFill = checkElement.querySelector('.progress-fill');
        
        // Set to 100% and mark as completed
        screeningProgress[checkName] = 100;
        progressFill.style.width = '100%';
        statusText.textContent = 'Completed';
        
        checkElement.classList.remove('in-progress', 'pending');
        checkElement.classList.add('completed');
        
        console.log(`✅ ${checkName} completed`);
        
        // Check if all screening is complete
        checkAllScreeningComplete();
    }

    function updateOverallProgress() {
        const totalChecks = Object.keys(screeningProgress).length;
        const totalProgress = Object.values(screeningProgress).reduce((sum, progress) => sum + progress, 0);
        const overallProgress = Math.round(totalProgress / totalChecks);
        
        // Update overall progress bar
        const overallProgressBar = document.getElementById('overallProgressBar');
        const overallProgressText = document.getElementById('overallProgress');
        
        overallProgressBar.style.width = overallProgress + '%';
        overallProgressText.textContent = overallProgress + '%';
        
        // Update estimated time based on progress
        updateEstimatedTime(overallProgress);
    }

    function updateEstimatedTime(progress) {
        const estimatedTimeElement = document.getElementById('estimatedTime');
        let estimatedTime = '';
        
        if (progress < 25) {
            estimatedTime = '15-20 minutes';
        } else if (progress < 50) {
            estimatedTime = '10-15 minutes';
        } else if (progress < 75) {
            estimatedTime = '5-10 minutes';
        } else if (progress < 95) {
            estimatedTime = '2-5 minutes';
        } else {
            estimatedTime = 'Almost complete';
        }
        
        estimatedTimeElement.textContent = estimatedTime;
    }

    function checkAllScreeningComplete() {
        const allComplete = Object.values(screeningProgress).every(progress => progress === 100);
        
        if (allComplete) {
            console.log('🎉 All screening checks completed!');
            
            // Enable the submit button if video is uploaded and consents are checked
            checkFormReady();
            
            // Show completion notification
            showNotification('All automated screening checks completed!', 'success');
        }
    }

    function initEventListeners() {
        // Form submission
        document.getElementById('screeningForm').addEventListener('submit', handleFormSubmission);
        
        // Video upload handlers
        document.getElementById('videoUpload').addEventListener('change', handleVideoUpload);
        document.getElementById('recordVideoBtn').addEventListener('click', openRecordingModal);
        
        // Recording modal handlers
        document.getElementById('startRecording').addEventListener('click', startRecording);
        document.getElementById('stopRecording').addEventListener('click', stopRecording);
        
        // Consent checkboxes - enable submit button when all conditions met
        const consentCheckboxes = document.querySelectorAll('#screeningForm input[type="checkbox"]');
        consentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', checkFormReady);
        });
    }

    function handleVideoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            previewVideo(file);
            checkFormReady();
        }
    }

    function previewVideo(file) {
        // Validate file type and size
        const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        const maxSize = 100 * 1024 * 1024; // 100MB
        
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid video file (MP4, MOV, AVI)');
            return;
        }
        
        if (file.size > maxSize) {
            alert('Video file must be less than 100MB');
            return;
        }
        
        const videoPreview = document.querySelector('#videoPreview video');
        const videoURL = URL.createObjectURL(file);
        
        videoPreview.src = videoURL;
        document.getElementById('videoPreview').style.display = 'block';
        
        // Store file reference
        videoPreview.file = file;
    }

    function openRecordingModal() {
        document.getElementById('videoRecordingModal').classList.add('active');
        initializeCamera();
    }

    function closeRecordingModal() {
        document.getElementById('videoRecordingModal').classList.remove('active');
        stopCamera();
        resetRecording();
    }

    async function initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            
            const preview = document.getElementById('recordingPreview');
            preview.srcObject = stream;
            
            // Initialize media recorder
            mediaRecorder = new MediaRecorder(stream);
            recordedChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
                previewRecordedVideo(recordedBlob);
            };
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions and try again.');
        }
    }

    function stopCamera() {
        const preview = document.getElementById('recordingPreview');
        if (preview.srcObject) {
            preview.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    function startRecording() {
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            recordedChunks = [];
            mediaRecorder.start();
            
            // Update UI
            document.getElementById('startRecording').style.display = 'none';
            document.getElementById('stopRecording').style.display = 'block';
            
            // Start timer
            startRecordingTimer();
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            
            // Update UI
            document.getElementById('stopRecording').style.display = 'none';
            document.getElementById('startRecording').style.display = 'block';
            
            // Stop timer
            stopRecordingTimer();
            
            // Close modal after a brief delay
            setTimeout(() => {
                closeRecordingModal();
            }, 1000);
        }
    }

    function startRecordingTimer() {
        seconds = 0;
        updateTimerDisplay();
        recordingTimer = setInterval(() => {
            seconds++;
            updateTimerDisplay();
            
            // Auto-stop after 2 minutes (120 seconds)
            if (seconds >= 120) {
                stopRecording();
            }
        }, 1000);
    }

    function stopRecordingTimer() {
        if (recordingTimer) {
            clearInterval(recordingTimer);
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById('recordingTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function resetRecording() {
        stopRecordingTimer();
        seconds = 0;
        document.getElementById('recordingTimer').textContent = '00:00';
    }

    function previewRecordedVideo(blob) {
        const videoURL = URL.createObjectURL(blob);
        const videoPreview = document.querySelector('#videoPreview video');
        
        videoPreview.src = videoURL;
        videoPreview.file = new File([blob], 'recorded-introduction.webm', { type: 'video/webm' });
        document.getElementById('videoPreview').style.display = 'block';
        
        checkFormReady();
    }

    function removeVideo() {
        const videoPreview = document.querySelector('#videoPreview video');
        videoPreview.src = '';
        videoPreview.file = null;
        document.getElementById('videoPreview').style.display = 'none';
        
        // Reset file input
        document.getElementById('videoUpload').value = '';
        
        checkFormReady();
    }

    function checkFormReady() {
        const submitBtn = document.getElementById('submitScreeningBtn');
        const videoPreview = document.querySelector('#videoPreview video');
        const hasVideo = videoPreview && videoPreview.file;
        const allConsentsChecked = areAllConsentsChecked();
        const allScreeningComplete = Object.values(screeningProgress).every(progress => progress === 100);
        
        if (hasVideo && allConsentsChecked && allScreeningComplete) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Complete Screening & Proceed to Payment';
        } else {
            submitBtn.disabled = true;
            let reason = '';
            
            if (!allScreeningComplete) {
                reason = 'Waiting for screening checks to complete';
            } else if (!hasVideo) {
                reason = 'Video introduction required';
            } else if (!allConsentsChecked) {
                reason = 'All consents must be accepted';
            }
            
            submitBtn.innerHTML = `<i class="fas fa-clock"></i> ${reason}`;
        }
    }

    function areAllConsentsChecked() {
        const consent1 = document.getElementById('consentBackgroundCheck').checked;
        const consent2 = document.getElementById('consentInformationVerification').checked;
        const consent3 = document.getElementById('agreeScreeningTerms').checked;
        
        return consent1 && consent2 && consent3;
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = collectScreeningData();
            submitScreening(formData);
        }
    }

    function validateForm() {
        const videoPreview = document.querySelector('#videoPreview video');
        
        if (!videoPreview || !videoPreview.file) {
            alert('Please upload or record a video introduction');
            return false;
        }
        
        if (!areAllConsentsChecked()) {
            alert('Please accept all screening consents');
            return false;
        }
        
        // Check if all screening is complete
        const allScreeningComplete = Object.values(screeningProgress).every(progress => progress === 100);
        if (!allScreeningComplete) {
            alert('Please wait for all screening checks to complete');
            return false;
        }
        
        return true;
    }

    function collectScreeningData() {
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        const videoFile = document.querySelector('#videoPreview video').file;
        
        const screeningData = {
            // Screening metadata
            screeningId: 'SCR-' + Date.now(),
            applicationId: applicationData.applicationId,
            screeningDate: new Date().toISOString(),
            status: 'completed',
            
            // Screening results
            screeningResults: {
                backgroundCheck: { status: 'passed', score: 95 },
                creditCheck: { status: 'passed', score: 88 },
                referenceCheck: { status: 'passed', score: 92 },
                documentCheck: { status: 'passed', score: 96 },
                employmentCheck: { status: 'passed', score: 90 },
                rentalHistoryCheck: { status: 'passed', score: 87 },
                identityCheck: { status: 'passed', score: 100 }
            },
            
            // Video file reference
            videoFile: videoFile?.name || 'recorded-introduction.webm',
            
            // Consents
            consents: {
                backgroundCheck: document.getElementById('consentBackgroundCheck').checked,
                informationVerification: document.getElementById('consentInformationVerification').checked,
                screeningTerms: document.getElementById('agreeScreeningTerms').checked
            },
            
            // Overall screening result
            overallResult: 'approved',
            recommendation: 'Proceed to payment'
        };
        
        return screeningData;
    }

    function submitScreening(screeningData) {
        console.log('🔍 Submitting screening data:', screeningData);
        
        // Show loading state
        const submitBtn = document.getElementById('submitScreeningBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finalizing Screening...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Save screening data to localStorage
            saveScreeningToStorage(screeningData);
            
            // Update application status
            updateApplicationStatus(screeningData.applicationId, 'screening_completed');
            
            // Prepare notification for future use
            prepareScreeningNotification(screeningData);
            
            // Show success modal
            showSuccessModal(screeningData);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function saveScreeningToStorage(screeningData) {
        let screenings = JSON.parse(localStorage.getItem('domihive_screenings')) || [];
        screenings.push(screeningData);
        localStorage.setItem('domihive_screenings', JSON.stringify(screenings));
        
        // Store current screening for the flow
        sessionStorage.setItem('domihive_current_screening', JSON.stringify(screeningData));
    }

    function updateApplicationStatus(applicationId, status) {
        let applications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
        const applicationIndex = applications.findIndex(app => app.applicationId === applicationId);
        
        if (applicationIndex !== -1) {
            applications[applicationIndex].status = status;
            applications[applicationIndex].screeningCompleted = new Date().toISOString();
            applications[applicationIndex].screeningId = 'SCR-' + Date.now();
            localStorage.setItem('domihive_applications', JSON.stringify(applications));
        }
    }

    function prepareScreeningNotification(screeningData) {
        const notificationData = {
            id: 'notif_' + Date.now(),
            type: 'screening_completed',
            title: 'Screening Completed Successfully!',
            message: `Your tenant screening for ${screeningData.applicationId} has been completed and approved.`,
            applicationId: screeningData.applicationId,
            screeningId: screeningData.screeningId,
            timestamp: new Date().toISOString(),
            read: false,
            actions: [
                {
                    text: 'Proceed to Payment',
                    action: 'proceed_to_payment',
                    screeningId: screeningData.screeningId
                }
            ]
        };
        
        // Store notification
        let notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
        notifications.push(notificationData);
        localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    }

    function showSuccessModal(screeningData) {
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
    window.goBackToApplication = function() {
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        if (applicationData && applicationData.applicationId) {
            window.location.href = `/Pages/application-process.html?applicationId=${applicationData.applicationId}`;
        } else {
            window.history.back();
        }
    };

    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
        modal.classList.remove('active');
    };

    window.proceedToPayment = function() {
        const screeningData = JSON.parse(sessionStorage.getItem('domihive_current_screening'));
        if (screeningData) {
            console.log('💳 Proceeding to payment for screening:', screeningData.screeningId);
            
            // Redirect to payment page
            window.location.href = `/Pages/payment-rent.html?screeningId=${screeningData.screeningId}&applicationId=${screeningData.applicationId}`;
        } else {
            console.error('No screening data found');
            showNotification('Error: Screening data not found', 'error');
        }
    };

    window.removeVideo = removeVideo;
    window.closeRecordingModal = closeRecordingModal;
});

console.log('🎉 Screening JavaScript Loaded!');