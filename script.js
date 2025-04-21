// Debug for script load
console.log('Script loaded at:', new Date().toISOString(), 'Script URL:', document.currentScript ? document.currentScript.src : 'inline');

// Track number of script instances
window._scriptInstanceCount = (window._scriptInstanceCount || 0) + 1;
console.log('Script instance count:', window._scriptInstanceCount);

/**
 * Main JavaScript file for website
 * Deployment-ready version
 */

// Page Load ID for tracking
const pageLoadId = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
console.log('Page initialized with ID:', pageLoadId);

// Use global flags for initialization
window.siteInitialized = window.siteInitialized || false;
window.formValidationInitialized = window.formValidationInitialized || false;

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Prevent multiple initializations using global flag
    if (window.siteInitialized) {
        console.warn('DOMContentLoaded handler called multiple times! Preventing re-initialization.', new Date().toISOString());
        return;
    }
    window.siteInitialized = true;
    console.log('DOMContentLoaded handler executed at:', new Date().toISOString());
    // Initialize all components
    initStickyHeader();
    initScrollHeaderVisibility();
    initMobileNav();
    initPortfolioSlider();
    initCountdownTimer();
    initFormValidation();
    initFloatingCTA();
    initSmoothScroll();
    initScrollAnimations();
    initNotifications();
    initTestimonialSlider();
    initFAQAccordion();
    initParallaxEffects();
    initFeatureAnimations();
    initAnalyticsTracking();
    initImageLoader(); // Add call to the new image loader function
});

/**
 * Makes the header sticky on scroll
 */
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}

/**
 * Hides header on scroll down, shows on scroll up
 * Fixed implementation
 */
function initScrollHeaderVisibility() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollTop = 0;
    const scrollThreshold = 100; // Increased threshold for better user experience
    const scrollDistance = 10; // Minimum scroll distance to trigger header visibility change

    // Use throttled scroll event for better performance
    window.addEventListener('scroll', throttle(function() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Only trigger if we've scrolled significantly
        if (Math.abs(lastScrollTop - currentScrollTop) <= scrollDistance) return;

        // Scrolling down and past the threshold
        if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
            header.classList.add('header-hidden');
        } else {
            // Scrolling up or at the top
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, 150));
}

/**
 * Handles mobile navigation toggle
 */
function initMobileNav() {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const nav = document.getElementById('nav');
    
    if (!mobileNavToggle || !nav) return;
    
    const navLinks = nav.querySelectorAll('.nav-link');

    // Toggle navigation on button click
    mobileNavToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const expanded = nav.classList.contains('active');
        mobileNavToggle.setAttribute('aria-expanded', expanded);
    });

    // Close navigation when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !mobileNavToggle.contains(event.target)) {
            nav.classList.remove('active');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Portfolio slider functionality
 */
function initPortfolioSlider() {
    const track = document.getElementById('portfolio-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    
    if (!track || !prevBtn || !nextBtn || !progressBar) return;

    const portfolioItems = track.querySelectorAll('.portfolio-item');
    const itemCount = portfolioItems.length;
    let visibleItems = getVisibleItemCount();
    let currentIndex = 0;
    
    // Set initial width
    updateSliderPosition();
    updateProgressBar();
    
    // Event listeners for next and previous buttons
    nextBtn.addEventListener('click', function() {
        if (currentIndex < itemCount - visibleItems) {
            currentIndex++;
            updateSliderPosition();
            updateProgressBar();
        }
    });
    
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
            updateProgressBar();
        }
    });
    
    // Support for touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // Swipe left - next slide
            if (currentIndex < itemCount - visibleItems) {
                currentIndex++;
                updateSliderPosition();
                updateProgressBar();
            }
        } else if (touchEndX > touchStartX + threshold) {
            // Swipe right - previous slide
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
                updateProgressBar();
            }
        }
    }
    
    // Update slider on window resize
    window.addEventListener('resize', debounce(function() {
        // Get new visible item count
        const newVisibleItems = getVisibleItemCount();
        
        // If visible items count changed, reset position
        if (newVisibleItems !== visibleItems) {
            visibleItems = newVisibleItems;
            // Make sure we don't exceed the max index
            currentIndex = Math.min(currentIndex, itemCount - visibleItems);
            if (currentIndex < 0) currentIndex = 0;
        }
        
        updateSliderPosition();
        updateProgressBar();
    }, 200));
    
    // Helper function to get the number of visible items based on screen width
    function getVisibleItemCount() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1200) {
            return 3;
        } else if (screenWidth >= 768) {
            return 2;
        } else {
            return 1;
        }
    }
    
    // Update the slider position
    function updateSliderPosition() {
        if (portfolioItems.length === 0) return;
        
        const itemWidth = portfolioItems[0].offsetWidth;
        const gapWidth = 30; // From CSS .portfolio-track gap
        const offset = currentIndex * (itemWidth + gapWidth);
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= itemCount - visibleItems;
        
        // Update visual states
        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }
    
    // Update the progress bar
    function updateProgressBar() {
        const maxIndex = itemCount - visibleItems;
        const progress = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Countdown timer functionality
 */
function initCountdownTimer() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    // Set the end date to 7 days from now
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
    
    // Update the countdown every second
    function updateCountdown() {
        const currentTime = new Date();
        const difference = endDate - currentTime;
        
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update DOM elements with leading zeros if needed
        daysEl.innerText = days < 10 ? `0${days}` : days;
        hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
        minutesEl.innerText = minutes < 10 ? `0${minutes}` : minutes;
        secondsEl.innerText = seconds < 10 ? `0${seconds}` : seconds;
        
        // If countdown is over
        if (difference < 0) {
            clearInterval(timerInterval);
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            
            // Optionally add a message or trigger an action when countdown ends
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                const expiredMessage = document.createElement('div');
                expiredMessage.className = 'countdown-expired';
                expiredMessage.innerText = 'Offer has expired';
                countdownContainer.appendChild(expiredMessage);
            }
        }
    }
    
    // Initial call
    updateCountdown();
    
    // Update every second
    const timerInterval = setInterval(updateCountdown, 1000);
}
/**
 * Form validation and submission handling
 * Enhanced debugging for duplicate submissions
 */
function initFormValidation() {
    // Log call stack for debugging duplicate calls
    console.log('initFormValidation called', new Error().stack);

    // Global check to prevent multiple form validation initializations
    if (window.formValidationInitialized) {
        console.error('Form validation already initialized globally.', new Date().toISOString());
        return;
    }
    window.formValidationInitialized = true;

    const form = document.getElementById('website-form');
    if (!form) {
        console.error('Form not found');
        return;
    }

    // 1. Enhanced Event Listener Tracking
    // Add a property to the form to track if the listener is already attached
    if (form._hasSubmitListener) {
        console.error('Form already has a submit listener attached! Possible duplicate initialization.', new Date().toISOString());
        return; // Prevent attaching multiple listeners
    }
    form._hasSubmitListener = true;
    console.log('Attaching form submit listener at:', new Date().toISOString());

    // 3. Network Request Monitoring (Duplicate Check Setup)
    // Maintain a log of recent submissions
    const recentSubmissions = [];
    const MAX_STORED_SUBMISSIONS = 10;

    // Enhanced submission tracking (existing)
    let isSubmitting = false;
    let lastSubmissionTime = 0;
    const minimumTimeBetweenSubmissions = 2000; // 2 seconds in milliseconds
    
    // Create a debug log in the page (for visible debugging)
    const createDebugLog = () => {
        if (!document.getElementById('form-debug-log')) {
            const debugLog = document.createElement('div');
            debugLog.id = 'form-debug-log';
            debugLog.style.display = 'none'; // Hidden by default
            debugLog.innerHTML = '<h3>Form Submission Log</h3><div id="debug-entries"></div>';
            document.body.appendChild(debugLog);
            
            // Add control to show/hide debug log
            const debugToggle = document.createElement('button');
            debugToggle.textContent = 'Toggle Debug Log';
            debugToggle.style.position = 'fixed';
            debugToggle.style.bottom = '10px';
            debugToggle.style.right = '10px';
            debugToggle.style.zIndex = '9999';
            debugToggle.onclick = () => {
                const log = document.getElementById('form-debug-log');
                log.style.display = log.style.display === 'none' ? 'block' : 'none';
            };
            document.body.appendChild(debugToggle);
        }
        return document.getElementById('debug-entries');
    };
    
    const logDebug = (message) => {
        console.log(`[${new Date().toISOString()}] ${message}`);
        const debugEntries = createDebugLog();
        const entry = document.createElement('div');
        entry.innerHTML = `<p><strong>${new Date().toISOString()}</strong>: ${message}</p>`;
        debugEntries.appendChild(entry);
    };
    
    logDebug('Form validation initialized');
    
    // Define form fields based on your actual HTML
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        business: document.getElementById('business'),
        message: document.getElementById('message')
    };
    
    // Check if required fields exist
    if (!formFields.name || !formFields.email || !formFields.phone || !formFields.business) {
        logDebug('Required form fields not found');
        return;
    }
    
    // 3. Network Request Monitoring (Duplicate Check Function)
    function checkDuplicateRequest(formData) {
        const submissionKey = `${formData.name}|${formData.email}|${formData.phone}`;
        const timestamp = Date.now();

        // Check for duplicates within the last 5 seconds
        const duplicateSubmission = recentSubmissions.find(entry => {
            return entry.key === submissionKey &&
                   (timestamp - entry.timestamp) < 5000; // 5 seconds
        });

        if (duplicateSubmission) {
            console.error('POTENTIAL DUPLICATE REQUEST DETECTED (data similarity)', {
                original: duplicateSubmission,
                current: {key: submissionKey, timestamp, requestId: formData.requestId}
            });
            logDebug('POTENTIAL DUPLICATE REQUEST DETECTED (data similarity)'); // Also log to debug panel
            return true;
        }

        // Add this submission to the log
        recentSubmissions.push({
            key: submissionKey,
            timestamp,
            requestId: formData.requestId // Store the request ID with the submission
        });

        // Keep the log size reasonable
        if (recentSubmissions.length > MAX_STORED_SUBMISSIONS) {
            recentSubmissions.shift();
        }

        return false;
    }
    
    // Add real-time validation as in your original code
    if (formFields.email) {
        formFields.email.addEventListener('blur', function() {
            validateField(this, isValidEmail(this.value.trim()), 'Please enter a valid email address');
        });
    }
    
    if (formFields.phone) {
        formFields.phone.addEventListener('blur', function() {
            const phonePattern = /^[\d\s\(\)\-\+]{7,20}$/;
            validateField(this, phonePattern.test(this.value.trim()), 'Please enter a valid phone number');
        });
    }
    
    // Helper function to validate and show errors
    function validateField(field, isValid, errorMessage) {
        const errorEl = field.nextElementSibling?.classList.contains('error-message') 
                      ? field.nextElementSibling 
                      : null;
        
        if (!isValid) {
            field.classList.add('error');
            
            if (!errorEl) {
                const newErrorEl = document.createElement('div');
                newErrorEl.className = 'error-message';
                newErrorEl.textContent = errorMessage;
                field.parentNode.insertBefore(newErrorEl, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            if (errorEl) errorEl.remove();
        }
        
        return isValid;
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    
    // Enhanced submit handler with multiple safeguards
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // 4. Browser Performance Monitoring (Start)
        const handlerStartTime = performance.now();

        const now = Date.now();
        logDebug(`Submit event triggered at ${new Date(now).toISOString()}`);

        // Prevent multiple rapid submissions (existing check)
        if (isSubmitting) {
            logDebug('Submission already in progress, preventing duplicate');
            return;
        }
        
        // Prevent submissions too close together
        if (now - lastSubmissionTime < minimumTimeBetweenSubmissions) {
            logDebug(`Submission too soon after last one (${now - lastSubmissionTime}ms), preventing possible duplicate`);
            return;
        }
        
        // Mark as submitting to prevent duplicates
        isSubmitting = true;
        lastSubmissionTime = now;
        
        // Get form values
        const formData = {
            name: formFields.name.value.trim(),
            email: formFields.email.value.trim(),
            phone: formFields.phone.value.trim(),
            business: formFields.business.value.trim(),
            message: formFields.message ? formFields.message.value.trim() : '',
            // Add timestamps for debugging
            clientTimestamp: new Date().toISOString(),
            clientTime: Date.now(),
            // 2. In-Depth Request Tracking (Add IDs to data)
            pageLoadId: pageLoadId, // Add page load ID
            requestId: Date.now() + '-' + Math.random().toString(36).substring(2, 15) // Generate and add request ID
        };

        // 2. In-Depth Request Tracking (Log IDs)
        console.log(`Form submission attempt: ${formData.requestId} from page ${formData.pageLoadId}`);
        logDebug(`Form submission attempt: ${formData.requestId} from page ${formData.pageLoadId}`); // Also log to debug panel

        logDebug(`Form data collected: ${JSON.stringify(formData)}`);

        // 3. Network Request Monitoring (Call the check)
        if (checkDuplicateRequest(formData)) {
            logDebug('Preventing duplicate submission based on data similarity');
            isSubmitting = false; // Ensure lock is released
            return;
        }
        
        // Validate required fields
        let isValid = true;
        
        if (!formData.name) {
            isValid = validateField(formFields.name, false, 'Name is required') && isValid;
        }
        
        if (!formData.email) {
            isValid = validateField(formFields.email, false, 'Email is required') && isValid;
        } else if (!isValidEmail(formData.email)) {
            isValid = validateField(formFields.email, false, 'Please enter a valid email address') && isValid;
        }
        
        if (!formData.phone) {
            isValid = validateField(formFields.phone, false, 'Phone number is required') && isValid;
        } else {
            const phonePattern = /^[\d\s\(\)\-\+]{7,20}$/;
            isValid = validateField(formFields.phone, phonePattern.test(formData.phone), 'Please enter a valid phone number') && isValid;
        }
        
        if (!formData.business) {
            isValid = validateField(formFields.business, false, 'Business name is required') && isValid;
        }
        
        if (!isValid) {
            logDebug('Form validation failed');
            isSubmitting = false;
            return;
        }
        
        logDebug('Form validation passed, preparing to send data');
        
        // Get submit button and original text
        const submitButton = form.querySelector('button[type="submit"]');
        let buttonOriginalText = 'Submit';
        
        if (submitButton) {
            buttonOriginalText = submitButton.textContent || submitButton.value;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            logDebug('Submit button disabled, showing loading state');
        }
        
        // Store button reference and original text for use in the promise chain
        const buttonReference = submitButton;
        const originalText = buttonOriginalText;
        
        // The webhook URL
        const webhookUrl = 'https://hook.eu2.make.com/ru1mnhhsxy2dzbavygmhr5th4j3harhx';
        logDebug(`Sending data to webhook: ${webhookUrl}`);

        // 4. Browser Performance Monitoring (End Handler Timing)
        const handlerEndTime = performance.now();
        console.log(`Form submission handler took ${handlerEndTime - handlerStartTime}ms to execute`);
        logDebug(`Form submission handler took ${handlerEndTime - handlerStartTime}ms to execute`);

        // Send data to webhook
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 2. In-Depth Request Tracking (Add Headers)
                'X-Submission-Time': Date.now().toString(), // Keep existing header
                'X-Request-ID': formData.requestId,
                'X-Page-Load-ID': formData.pageLoadId
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            logDebug(`Response received, status: ${response.status}`);
            
            // Consider any 2xx status as success
            if (response.status >= 200 && response.status < 300) {
                return { success: true };
            } else {
                throw new Error('Server returned error status: ' + response.status);
            }
        })
        .then(data => {
            logDebug('Success: form submitted successfully');
            
            // Reset form
            form.reset();
            
            // Reset validation styles
            Object.values(formFields).forEach(field => {
                if (field) field.classList.remove('error');
            });
            
            // Remove error messages
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Restore button state
            if (buttonReference) {
                buttonReference.disabled = false;
                buttonReference.textContent = originalText;
            }
            
            // Show success notification
            showNotification('Thank you! Your form has been submitted successfully.');
        })
        .catch((error) => {
            logDebug(`Error: ${error.message}`);
            
            // Restore button state
            if (buttonReference) {
                buttonReference.disabled = false;
                buttonReference.textContent = originalText;
            }
            
            // Show error notification
            showNotification('Sorry, there was an error submitting your form. Please try again later.');
        })
        .finally(() => {
            // 4. Browser Performance Monitoring (Total Time)
            const totalTime = performance.now() - handlerStartTime;
            console.log(`Total form submission process took ${totalTime}ms`);
            logDebug(`Total form submission process took ${totalTime}ms`);

            // Log if this took unusually long
            if (totalTime > 1000) {
                console.warn(`Form submission took over 1 second (${totalTime}ms), which might indicate performance issues`);
                logDebug(`WARN: Form submission took over 1 second (${totalTime}ms)`);
            }

            // Reset submission status after a small delay (existing logic)
            setTimeout(() => {
                isSubmitting = false;
                logDebug('Submission lock released');
            }, 1000); // Keep existing delay
        });
    });
    
    // Notification function
    function showNotification(message) {
        logDebug(`Notification: ${message}`);
        
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.form-notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'form-notification';
        notification.textContent = message;
        
        // Insert after form
        form.parentNode.insertBefore(notification, form.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Make sure the notification function exists
function showNotification(message = 'Operation completed successfully') {
    let notification = document.getElementById('notification');
    
    // Create notification if it doesn't exist
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(function() {
        notification.classList.remove('show');
    }, 5000);
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Make sure the notification function exists
function showNotification(message = 'Operation completed successfully') {
    let notification = document.getElementById('notification');
    
    // Create notification if it doesn't exist
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(function() {
        notification.classList.remove('show');
    }, 5000);
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Show notification with custom message
 */
function showNotification(message = 'Operation completed successfully') {
    let notification = document.getElementById('notification');
    
    // Create notification if it doesn't exist
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(function() {
        notification.classList.remove('show');
    }, 5000);
}

/**
 * Floating CTA button functionality
 */
function initFloatingCTA() {
    const floatingCta = document.getElementById('floating-cta');
    const heroSection = document.getElementById('hero');
    
    if (!floatingCta || !heroSection) return;
    
    window.addEventListener('scroll', throttle(function() {
        // Show floating CTA when user scrolls past hero section
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        if (window.scrollY > heroBottom) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
    }, 200));
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScroll() {
    // Get all links that have a hash
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            // Only prevent default if not a default hash
            if (this.getAttribute('href') !== '#') {
                event.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculate scroll position (accounting for fixed header)
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20; // Add some extra padding
                    
                    // Scroll smoothly
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    window.history.pushState(null, null, targetId);
                }
            }
        });
    });
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    if (animatedElements.length === 0) return;
    
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove class when element is out of view for repeat animations
                // entry.target.classList.remove('animate-in');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust based on your design
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize notification system
 */
function initNotifications() {
    // Create a notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    const slides = track.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    const indicators = document.getElementById('testimonialIndicators');
    
    if (!slides.length || !prevButton || !nextButton || !indicators) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoSlideInterval;
    
    // Clear any existing indicators
    indicators.innerHTML = '';
    
    // Create indicator dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        indicators.appendChild(dot);
    }
    
    // Update dots when slide changes
    function updateDots() {
        const dots = indicators.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Move to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= slideCount) return;
        
        currentSlide = slideIndex;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
        
        // Update button states
        prevButton.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentSlide === slideCount - 1 ? '0.5' : '1';
    }
    
    // Previous slide button
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
        resetAutoSlide();
    });
    
    // Next slide button
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
        resetAutoSlide();
    });
    
    // Auto slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        }, 7000); // Change slide every 7 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Start auto sliding
    startAutoSlide();
    
    // Pause auto slide on hover
    const slider = track.closest('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Handle swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });
    
    function handleSwipe() {
        // Swipe threshold
        const threshold = 50;
        
        if (touchEndX < touchStartX - threshold) {
            // Swipe left - next slide
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        } else if (touchEndX > touchStartX + threshold) {
            // Swipe right - previous slide
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            goToSlide(currentSlide);
        }
    }
    
    // Set initial positions and states
    goToSlide(0);
}

/**
 * Initialize FAQ accordion
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    const expandAllButton = document.querySelector('.faq-expand-all');
    
    if (!faqItems.length) return;
    
    // Initialize FAQ items with closed state
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        // Set initial states
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
        
        // Add click event listener
        question.addEventListener('click', () => {
            toggleFaqItem(item);
        });
        
        // Add keyboard event for accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaqItem(item);
            }
        });
    });
    
    // Function to toggle a FAQ item
    function toggleFaqItem(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Toggle the current item
        question.setAttribute('aria-expanded', !isExpanded);
        
        if (isExpanded) {
            answer.style.maxHeight = '0px';
            item.classList.remove('active');
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            item.classList.add('active');
        }
        
        // Update expand all button state
        if (expandAllButton) {
            updateExpandAllButton();
        }
    }
    
    // Function to toggle all FAQ items
    function toggleAllFaqItems(expand) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!question || !answer) return;
            
            question.setAttribute('aria-expanded', expand);
            
            if (expand) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('active');
            } else {
                answer.style.maxHeight = '0px';
                item.classList.remove('active');
            }
        });
        
        if (expandAllButton) {
            expandAllButton.setAttribute('aria-expanded', expand);
        }
    }
    
    // Function to update the expand all button state
    function updateExpandAllButton() {
        if (!expandAllButton) return;
        
        const allExpanded = Array.from(faqItems).every(item => {
            const question = item.querySelector('.faq-question');
            return question && question.getAttribute('aria-expanded') === 'true';
        });
        
        expandAllButton.setAttribute('aria-expanded', allExpanded);
        expandAllButton.textContent = allExpanded ? 'Collapse All' : 'Expand All';
    }
    
    // Add click event for expand/collapse all button
    if (expandAllButton) {
        expandAllButton.addEventListener('click', () => {
            const isExpanded = expandAllButton.getAttribute('aria-expanded') === 'true';
            toggleAllFaqItems(!isExpanded);
        });
    }
    
    // Handle window resize to adjust maxHeight for open accordions
    window.addEventListener('resize', debounce(() => {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!question || !answer) return;
            
            if (question.getAttribute('aria-expanded') === 'true') {
                // Reset height to auto to calculate new scrollHeight
                answer.style.maxHeight = 'none';
                const scrollHeight = answer.scrollHeight;
                answer.style.maxHeight = scrollHeight + 'px';
            }
        });
    }, 250));
    
    // Open FAQ item if URL hash matches
    if (window.location.hash) {
        const targetItem = document.querySelector(window.location.hash);
        if (targetItem && targetItem.classList.contains('faq-item')) {
            setTimeout(() => {
                toggleFaqItem(targetItem);
                targetItem.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
}

/**
 * Initialize parallax background effects
 */
function initParallaxEffects() {
    const parallaxElements = {
        dotPattern1: document.querySelector('.dot-pattern-1'),
        dotPattern2: document.querySelector('.dot-pattern-2'),
        blurCircle1: document.querySelector('.blur-circle-1'),
        blurCircle2: document.querySelector('.blur-circle-2')
    };
    
    // Check if any parallax elements exist
    const hasParallaxElements = Object.values(parallaxElements).some(el => el !== null);
    
    if (!hasParallaxElements) return;
    
    // Use throttled scroll for better performance
    window.addEventListener('scroll', throttle(function() {
        const scrollPosition = window.scrollY;
        
        // Apply parallax effect to each element if it exists
        if (parallaxElements.dotPattern1) {
            parallaxElements.dotPattern1.style.transform = `translateY(${scrollPosition * 0.05}px)`;
        }
        
        if (parallaxElements.dotPattern2) {
            parallaxElements.dotPattern2.style.transform = `translateY(-${scrollPosition * 0.03}px)`;
        }
        
        if (parallaxElements.blurCircle1) {
            parallaxElements.blurCircle1.style.transform = `translateY(${scrollPosition * 0.07}px)`;
        }
        
        if (parallaxElements.blurCircle2) {
            parallaxElements.blurCircle2.style.transform = `translateY(-${scrollPosition * 0.04}px)`;
        }
    }, 50));
}

/**
 * Initialize feature section animations
 */
function initFeatureAnimations() {
    const animatedElements = document.querySelectorAll('.feature-item, .features-intro, .features-cta');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all feature items
    animatedElements.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Initialize analytics tracking
 */
function initAnalyticsTracking() {
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            const buttonText = button.textContent.trim();
            console.log('CTA button clicked:', buttonText, index);
            // Here you would typically send this data to your analytics platform
        });
    });
    
    // Track form field interactions
    const formFields = document.querySelectorAll('.form-control');
    formFields.forEach(function(field) {
        field.addEventListener('focus', function() {
            console.log('Field focused:', field.id);
        });
    });
    
    // Track portfolio item views
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(function(item, index) {
        // Using IntersectionObserver to track when portfolio items come into view
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    console.log('Portfolio item viewed:', index);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });
        
        if (item) observer.observe(item);
    });
}

/**
 * Helper function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to call immediately
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 20, immediate = false) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Helper function to throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit = 200) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Helper function to check if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @returns {boolean} - Whether element is in viewport
 */
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Helper function to add/remove class when element is in viewport
 * @param {HTMLElement} element - Element to toggle class on
 * @param {string} className - Class to toggle
 */
function toggleClassOnScroll(element, className) {
    if (!element) return;
    
    if (isElementInViewport(element)) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 * Helper function to format numbers with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/**
 * Helper function to validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Get browser details for analytics or special handling
 * @returns {Object} - Browser information
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    
    // Detect browser
    if (ua.indexOf("Firefox") > -1) {
        browser = "Firefox";
    } else if (ua.indexOf("SamsungBrowser") > -1) {
        browser = "Samsung";
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browser = "Opera";
    } else if (ua.indexOf("Trident") > -1) {
        browser = "Internet Explorer";
    } else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) {
        browser = "Edge";
    } else if (ua.indexOf("Chrome") > -1) {
        browser = "Chrome";
    } else if (ua.indexOf("Safari") > -1) {
        browser = "Safari";
    }
    
    return {
        browser,
        mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        os: getOS()
    };
    
    // Helper function to get OS
    function getOS() {
        if (ua.indexOf("Windows") > -1) return "Windows";
        if (ua.indexOf("Mac") > -1) return "Mac";
        if (ua.indexOf("Linux") > -1) return "Linux";
        if (ua.indexOf("Android") > -1) return "Android";
        if (ua.indexOf("iOS") > -1 || /iPhone|iPad|iPod/.test(ua)) return "iOS";
        return "Unknown";
    }
}

/**
 * Cross-browser full screen toggle
 */
function toggleFullScreen() {
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
/**
 * Privacy Policy Pop-up functionality
 */
function initPrivacyPopup() {
    const privacyPopup = document.getElementById('privacy-popup');
    const privacyLink = document.getElementById('privacy-policy-link');
    const closeButton = privacyPopup ? privacyPopup.querySelector('.close-button') : null;
    const acceptButton = privacyPopup ? document.getElementById('accept-privacy') : null;

    if (!privacyPopup || !privacyLink || !closeButton || !acceptButton) {
        console.warn('Privacy policy pop-up elements or link not found.');
        return;
    }

    // Show pop-up when the privacy policy link is clicked
    privacyLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        privacyPopup.classList.add('show');
    });

    // Hide pop-up when close button is clicked
    closeButton.addEventListener('click', function() {
        privacyPopup.classList.remove('show');
    });

    // Hide pop-up and set localStorage item when accept button is clicked
    acceptButton.addEventListener('click', function() {
        localStorage.setItem('privacyAccepted', 'true'); // Still remember acceptance if needed later
        privacyPopup.classList.remove('show');
    });

    // Hide pop-up if clicked outside of the content
    window.addEventListener('click', function(event) {
        if (event.target === privacyPopup) {
            privacyPopup.classList.remove('show');
        }
    });

    // Optional: Hide pop-up on escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && privacyPopup.classList.contains('show')) {
            privacyPopup.classList.remove('show');
        }
    });
}

// Redundant DOMContentLoaded listener removed. All initializations are handled by the listener at the top of the file.
/**
 * Handles the loading screen logic based on image loading state.
 */
function initImageLoader() {
    console.log('Initializing image loader...');
    const body = document.body;
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        console.warn('Main content wrapper #main-content not found. Skipping image loading check.');
        body.classList.add('loaded'); // Assume loaded if content wrapper is missing
        return;
    }

    const heroImage = document.getElementById('hero-image');

    if (!heroImage) {
        console.warn('Hero image with ID "hero-image" not found. Marking as loaded.');
        // Use a small timeout to allow the CSS transition to be visible
        setTimeout(() => {
            body.classList.add('loaded');
        }, 100); // Small delay (e.g., 100ms)
        return;
    }

    console.log('Found hero image. Tracking its load state.');

    const heroImageLoaded = () => {
        console.log('Hero image loaded or failed. Adding "loaded" class to body.');
        // Add a slight delay before removing the loader for smoother transition
        setTimeout(() => {
            body.classList.add('loaded');
        }, 300); // Delay can be adjusted (e.g., 300ms)
    };

    // Check if hero image is already loaded (e.g., cached)
    if (heroImage.complete) {
        console.log(`Hero image already complete: ${heroImage.src}`);
        heroImageLoaded();
    } else {
        heroImage.addEventListener('load', heroImageLoaded);
        heroImage.addEventListener('error', () => {
            console.warn(`Hero image failed to load: ${heroImage.src}`);
            heroImageLoaded(); // Count errors as "loaded" to not block the page forever
        });
    }
}