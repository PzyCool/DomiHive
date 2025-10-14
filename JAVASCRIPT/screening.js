// screening.js - Tenant Screening Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('applicationId');
    const userType = urlParams.get('userType') || 'tenant';

    // Media recording variables
    let mediaRecorder;
    let recordedChunks = [];
    let recordingTimer;
    let seconds = 0;

    // Initialize the page
    initScreeningPage();
    initEventListeners();

    // Functions
    function initScreeningPage() {
        console.log('🔍 Initializing Screening Page...');
        console.log('📊 Screening Context:', { applicationId, userType });
        
        // Load application data
        const applicationData = getApplicationData(applicationId);
        if (applicationData) {
            updatePageWithApplicationData(applicationData);
        }
        
        // Set up user type specific content
        setupUserTypeContent(userType);
        
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
        return applications.find(app => app.applicationId === applicationId) || applications[0];
    }

    function updatePageWithApplicationData(applicationData) {
        // Update property information
        document.getElementById('screeningPropertyTitle').textContent = applicationData.propertyTitle;
        document.getElementById('screeningPropertyPrice').textContent = `₦${applicationData.propertyPrice || '0'}/year`;
        document.getElementById('screeningPropertyLocation').textContent = applicationData.propertyLocation;
        
        // Update applicant information
        document.getElementById('applicantName').textContent = 
            `${applicationData.firstName} ${applicationData.lastName}`;
        document.getElementById('applicationId').textContent = applicationData.applicationId;
        
        // Store application data in hidden field
        document.getElementById('applicationData').value = JSON.stringify(applicationData);
        document.getElementById('userType').value = applicationData.userType;
        
        // Update subtitle based on user type
        const subtitle = document.getElementById('screeningSubtitle');
        if (applicationData.userType === 'student') {
            subtitle.textContent = 'Complete your student screening to finalize your application';
        } else {
            subtitle.textContent = 'Tell us more about yourself to complete your tenant screening';
        }
    }

    function setupUserTypeContent(userType) {
        const studentQuestions = document.getElementById('studentQuestions');
        
        if (userType === 'student') {
            studentQuestions.style.display = 'block';
        } else {
            studentQuestions.style.display = 'none';
        }
    }

    function initEventListeners() {
        // Form submission
        document.getElementById('screeningForm').addEventListener('submit', handleFormSubmission);
        
        // Yes/No button handlers
        const yesNoButtons = document.querySelectorAll('.yes-no-btn');
        yesNoButtons.forEach(button => {
            button.addEventListener('click', handleYesNoButtonClick);
        });
        
        // Video upload handlers
        document.getElementById('videoUpload').addEventListener('change', handleVideoUpload);
        document.getElementById('recordVideoBtn').addEventListener('click', openRecordingModal);
        
        // Recording modal handlers
        document.getElementById('startRecording').addEventListener('click', startRecording);
        document.getElementById('stopRecording').addEventListener('click', stopRecording);
        
        // File input handlers
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', handleFileInputChange);
        });
        
        // Real-time validation
        const requiredFields = document.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
        });
    }

    function handleYesNoButtonClick(e) {
        const button = e.currentTarget;
        const questionName = button.getAttribute('data-question');
        const value = button.getAttribute('data-value');
        
        // Update hidden input
        document.getElementById(questionName).value = value;
        
        // Update button states
        const buttons = document.querySelectorAll(`[data-question="${questionName}"]`);
        buttons.forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        
        // Show/hide conditional sections
        toggleConditionalSection(questionName, value);
    }

    function toggleConditionalSection(questionName, value) {
        const sectionId = questionName + 'Details';
        const section = document.getElementById(sectionId);
        
        if (section) {
            if (value === 'yes') {
                section.style.display = 'block';
                // Add required attributes to conditional fields
                const inputs = section.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.setAttribute('required', 'true');
                });
            } else {
                section.style.display = 'none';
                // Remove required attributes from conditional fields
                const inputs = section.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.removeAttribute('required');
                });
            }
        }
        
        // Handle guarantor section specifically
        if (questionName === 'hasGuarantor') {
            const guarantorSection = document.getElementById('guarantorDetails');
            if (guarantorSection) {
                if (value === 'yes') {
                    guarantorSection.style.display = 'block';
                } else {
                    guarantorSection.style.display = 'none';
                }
            }
        }
    }

    function handleVideoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            previewVideo(file);
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
    }

    function removeVideo() {
        const videoPreview = document.querySelector('#videoPreview video');
        videoPreview.src = '';
        videoPreview.file = null;
        document.getElementById('videoPreview').style.display = 'none';
        
        // Reset file input
        document.getElementById('videoUpload').value = '';
    }

    function handleFileInputChange(e) {
        const input = e.target;
        const files = input.files;
        
        if (files.length > 0) {
            // Validate file types
            const validTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            
            for (let file of files) {
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                
                if (!validTypes.includes(fileExtension)) {
                    alert('Please upload only PDF, JPG, or PNG files');
                    input.value = '';
                    return;
                }
                
                if (file.size > maxSize) {
                    alert('File size must be less than 10MB');
                    input.value = '';
                    return;
                }
            }
        }
    }

    function validateField(e) {
        const field = e.target;
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'This field is required');
            return;
        }
        
        // Specific validations
        if (field.type === 'tel' && field.value) {
            if (!isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
            } else {
                clearFieldError(field);
            }
        } else {
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
            submitScreening(formData);
        }
    }

    function validateForm() {
        const form = document.getElementById('screeningForm');
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

        // Validate phone numbers
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            if (field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        });

        // Validate video upload
        const videoPreview = document.querySelector('#videoPreview video');
        if (!videoPreview || !videoPreview.file) {
            alert('Please upload or record a video introduction');
            isValid = false;
        }

        // Validate document uploads
        const idDocument = document.getElementById('idDocument');
        const proofOfIncome = document.getElementById('proofOfIncome');
        
        if (!idDocument.files.length) {
            alert('Please upload a government issued ID');
            isValid = false;
        }
        
        if (!proofOfIncome.files.length) {
            alert('Please upload proof of income or student status');
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

    function getFormData() {
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        const videoFile = document.querySelector('#videoPreview video').file;
        
        const formData = {
            // Screening metadata
            screeningId: 'SCR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            applicationId: applicationData.applicationId,
            screeningDate: new Date().toISOString(),
            
            // Rental history
            previousRental: document.getElementById('previousRental').value,
            previousAddress: document.getElementById('previousAddress')?.value || '',
            previousLandlordName: document.getElementById('previousLandlordName')?.value || '',
            previousLandlordPhone: document.getElementById('previousLandlordPhone')?.value || '',
            previousRentAmount: document.getElementById('previousRentAmount')?.value || '',
            reasonForLeaving: document.getElementById('reasonForLeaving')?.value || '',
            
            // Employment information
            currentlyEmployed: document.getElementById('currentlyEmployed').value,
            employerName: document.getElementById('employerName')?.value || '',
            jobTitle: document.getElementById('jobTitle')?.value || '',
            employmentDuration: document.getElementById('employmentDuration')?.value || '',
            
            // Student specific
            hasGuarantor: document.getElementById('hasGuarantor')?.value || '',
            guarantorName: document.getElementById('guarantorName')?.value || '',
            guarantorPhone: document.getElementById('guarantorPhone')?.value || '',
            guarantorRelationship: document.getElementById('guarantorRelationship')?.value || '',
            
            // References
            references: {
                reference1: {
                    name: document.getElementById('ref1Name').value,
                    phone: document.getElementById('ref1Phone').value,
                    relationship: document.getElementById('ref1Relationship').value,
                    yearsKnown: document.getElementById('ref1YearsKnown').value
                },
                reference2: {
                    name: document.getElementById('ref2Name').value,
                    phone: document.getElementById('ref2Phone').value,
                    relationship: document.getElementById('ref2Relationship').value,
                    yearsKnown: document.getElementById('ref2YearsKnown').value
                }
            },
            
            // Documents (files will be handled separately in real implementation)
            documents: {
                idDocument: document.getElementById('idDocument').files[0]?.name || '',
                proofOfIncome: document.getElementById('proofOfIncome').files[0]?.name || '',
                additionalDocuments: Array.from(document.getElementById('additionalDocuments').files).map(f => f.name)
            },
            
            // Consents
            consents: {
                backgroundCheck: document.getElementById('consentBackgroundCheck').checked,
                informationVerification: document.getElementById('consentInformationVerification').checked,
                screeningTerms: document.getElementById('agreeScreeningTerms').checked
            },
            
            // Video file reference
            videoFile: videoFile?.name || ''
        };
        
        return formData;
    }

    function submitScreening(formData) {
        console.log('🔍 Submitting screening data:', formData);
        
        // Show loading state
        const submitBtn = document.querySelector('#screeningForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // Save screening data to localStorage
            saveScreeningToStorage(formData);
            
            // Update application status
            updateApplicationStatus(formData.applicationId, 'screening_completed');
            
            // Show success modal
            showSuccessModal(formData);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 3000);
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
            localStorage.setItem('domihive_applications', JSON.stringify(applications));
        }
    }

    function showSuccessModal(formData) {
        // Show modal
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
    }

    // Global functions
    window.goBackToApplication = function() {
        const applicationData = JSON.parse(document.getElementById('applicationData').value);
        window.location.href = `/Pages/application.html?applicationId=${applicationData.applicationId}`;
    };

    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
        modal.classList.remove('active');
        
        // Redirect to dashboard
        window.location.href = '/index.html';
    };

    window.proceedToPayment = function() {
        const screeningData = JSON.parse(sessionStorage.getItem('domihive_current_screening'));
        console.log('💳 Proceeding to payment for screening:', screeningData.screeningId);
        
        // Redirect to payment page
        window.location.href = `/Pages/payment.html?screeningId=${screeningData.screeningId}&applicationId=${screeningData.applicationId}`;
    };

    window.removeVideo = removeVideo;
    window.closeRecordingModal = closeRecordingModal;
});