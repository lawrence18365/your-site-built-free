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
    initPrivacyPopup(); // Initialize the privacy policy modal functionality
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
 */
function initScrollHeaderVisibility() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollTop = 0;
    const scrollThreshold = 100;
    const scrollDistance = 10;

    window.addEventListener('scroll', throttle(function() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (Math.abs(lastScrollTop - currentScrollTop) <= scrollDistance) return;

        if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
            header.classList.add('header-hidden');
        } else {
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

    mobileNavToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('active');
        const expanded = nav.classList.contains('active');
        mobileNavToggle.setAttribute('aria-expanded', expanded);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        });
    });

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
    
    updateSliderPosition();
    updateProgressBar();
    
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
            if (currentIndex < itemCount - visibleItems) {
                currentIndex++;
                updateSliderPosition();
                updateProgressBar();
            }
        } else if (touchEndX > touchStartX + threshold) {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
                updateProgressBar();
            }
        }
    }
    
    window.addEventListener('resize', debounce(function() {
        const newVisibleItems = getVisibleItemCount();
        if (newVisibleItems !== visibleItems) {
            visibleItems = newVisibleItems;
            currentIndex = Math.min(currentIndex, itemCount - visibleItems);
            if (currentIndex < 0) currentIndex = 0;
        }
        updateSliderPosition();
        updateProgressBar();
    }, 200));
    
    function getVisibleItemCount() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1200) return 3;
        if (screenWidth >= 768) return 2;
        return 1;
    }
    
    function updateSliderPosition() {
        if (portfolioItems.length === 0) return;
        const itemWidth = portfolioItems[0].offsetWidth;
        const gapWidth = 30;
        const offset = currentIndex * (itemWidth + gapWidth);
        track.style.transform = `translateX(-${offset}px)`;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= itemCount - visibleItems;
        
        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }
    
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
    
    const endDate = new Date();
    endDate.setDate(new Date().getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const difference = endDate - new Date();
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        daysEl.innerText = days < 10 ? `0${days}` : days;
        hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
        minutesEl.innerText = minutes < 10 ? `0${minutes}` : minutes;
        secondsEl.innerText = seconds < 10 ? `0${seconds}` : seconds;
        
        if (difference < 0) {
            clearInterval(timerInterval);
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                const expiredMessage = document.createElement('div');
                expiredMessage.className = 'countdown-expired';
                expiredMessage.innerText = 'Offer has expired';
                countdownContainer.appendChild(expiredMessage);
            }
        }
    }
    
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}
/**
 * CORRECTED EmailJS Form Handler - Using Your Actual Template ID and Variables
 * Replace your initFormValidation function with this corrected version
 */

function initFormValidation() {
    const form = document.getElementById('website-form');
    if (!form) {
        console.error('Form not found');
        return;
    }

    let isSubmitting = false;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (isSubmitting) {
            console.warn('Submission already in progress.');
            return;
        }

        // Enhanced validation
        let isValid = true;
        const requiredFields = ['name', 'email', 'phone', 'business'];
        
        // Clear previous error styling
        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.style.border = '';
                field.classList.remove('error');
            }
        });

        // Validate required fields
        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            if (!field || !field.value.trim()) {
                isValid = false;
                console.error(`${id} is required.`);
                if (field) {
                    field.style.border = '2px solid #ef4444';
                    field.classList.add('error');
                }
            }
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
            isValid = false;
            emailField.style.border = '2px solid #ef4444';
            console.error('Invalid email format');
        }

        if (!isValid) {
            showNotification('Please fill out all required fields correctly.', 'error');
            return;
        }

        // Prepare form data - CORRECTED to match your template variables
        const formData = new FormData(form);
        const templateParams = {
            // These variable names match your EmailJS template exactly
            name: formData.get('name'),           // {{name}} in template
            email: formData.get('email'),         // {{email}} in template  
            phone: formData.get('phone'),         // {{phone}} in template
            business: formData.get('business'),   // {{business}} in template
            message: formData.get('message') || 'No additional information provided.', // {{message}} in template
        };

        isSubmitting = true;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        console.log('Sending email with corrected params:', templateParams);

        // Using your ACTUAL template ID: template_jpss305
        emailjs.send(
            'service_stvkqx9',           // ✅ Your service ID (correct)
            'template_jpss305',          // ✅ CORRECTED template ID  
            templateParams,              // ✅ CORRECTED variable names
            'HjdXi5aEYt4K0Vluu'         // ✅ Your public key (correct)
        )
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showNotification('Thank you! Your application has been submitted successfully. We\'ll be in touch within 24-48 hours.', 'success');
            form.reset();
            
            // Optional: Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', { 
                    'event_category': 'engagement',
                    'event_label': 'website_application'
                });
            }
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            let errorMessage = 'Sorry, there was an error submitting your form. ';
            
            if (error.status === 400) {
                errorMessage += 'Please check your information and try again.';
            } else if (error.status === 401) {
                errorMessage += 'Service temporarily unavailable.';
            } else {
                errorMessage += 'Please try again later or contact us directly at lawrencebrennan@gmail.com';
            }
            
            showNotification(errorMessage, 'error');
            
            // Detailed error logging
            console.error('Detailed error:', {
                status: error.status,
                text: error.text,
                templateParams: templateParams,
                serviceId: 'service_stvkqx9',
                templateId: 'template_jpss305'
            });
        })
        .finally(function() {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    });
}

/**
 * Enhanced email validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Enhanced notification system
 */
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' :
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <h4>${type === 'success' ? 'Success!' : 'Error'}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 30px;
                right: 30px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                transform: translateX(200%);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                max-width: 400px;
                border-left: 4px solid;
            }
            .notification-success {
                border-left-color: #10b981;
                color: #0f766e;
            }
            .notification-error {
                border-left-color: #ef4444;
                color: #dc2626;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-icon {
                flex-shrink: 0;
            }
            .notification-content h4 {
                margin: 0 0 5px 0;
                font-size: 16px;
                font-weight: 600;
            }
            .notification-content p {
                margin: 0;
                font-size: 14px;
                line-height: 1.4;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.7;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 8000);
}

function initFloatingCTA() {
    const floatingCta = document.getElementById('floating-cta');
    const heroSection = document.getElementById('hero');
    
    if (!floatingCta || !heroSection) return;
    
    window.addEventListener('scroll', throttle(function() {
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
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            if (this.getAttribute('href') !== '#') {
                event.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize notification system
 */
function initNotifications() {
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
    
    indicators.innerHTML = '';
    
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoSlide();
        });
        indicators.appendChild(dot);
    }
    
    function updateDots() {
        const dots = indicators.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
        prevButton.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentSlide === slideCount - 1 ? '0.5' : '1';
    }
    
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
        resetAutoSlide();
    });
    
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
        resetAutoSlide();
    });
    
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        }, 7000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    startAutoSlide();
    
    const slider = track.closest('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
    
    goToSlide(0);
}

/**
 * Initialize FAQ accordion
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;
        
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
        
        question.addEventListener('click', () => toggleFaqItem(item));
    });

    function toggleFaqItem(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        question.setAttribute('aria-expanded', !isExpanded);
        
        if (isExpanded) {
            answer.style.maxHeight = '0px';
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
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
    
    if (!Object.values(parallaxElements).some(el => el)) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPosition = window.scrollY;
        if (parallaxElements.dotPattern1) parallaxElements.dotPattern1.style.transform = `translateY(${scrollPosition * 0.05}px)`;
        if (parallaxElements.dotPattern2) parallaxElements.dotPattern2.style.transform = `translateY(-${scrollPosition * 0.03}px)`;
        if (parallaxElements.blurCircle1) parallaxElements.blurCircle1.style.transform = `translateY(${scrollPosition * 0.07}px)`;
        if (parallaxElements.blurCircle2) parallaxElements.blurCircle2.style.transform = `translateY(-${scrollPosition * 0.04}px)`;
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
    }, { threshold: 0.1 });
    
    animatedElements.forEach(item => observer.observe(item));
}

/**
 * Initialize analytics tracking
 */
function initAnalyticsTracking() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach((button, index) => {
        button.addEventListener('click', () => console.log('CTA button clicked:', button.textContent.trim(), index));
    });
}

/**
 * Helper function to debounce function calls
 */
function debounce(func, wait = 20) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Helper function to throttle function calls
 */
function throttle(func, limit = 200) {
    let inThrottle;
    return function() {
        const args = arguments, context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
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
        console.warn('Privacy policy pop-up elements not found.');
        return;
    }

    privacyLink.addEventListener('click', function(event) {
        event.preventDefault();
        privacyPopup.classList.add('show');
    });

    closeButton.addEventListener('click', () => privacyPopup.classList.remove('show'));
    acceptButton.addEventListener('click', () => privacyPopup.classList.remove('show'));
    window.addEventListener('click', (event) => {
        if (event.target === privacyPopup) privacyPopup.classList.remove('show');
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && privacyPopup.classList.contains('show')) {
            privacyPopup.classList.remove('show');
        }
    });
}

/**
 * Handles the loading screen logic
 */
function initImageLoader() {
    console.log('Initializing image loader...');
    const body = document.body;
    const heroImage = document.getElementById('hero-image');

    const heroImageLoaded = () => {
        setTimeout(() => body.classList.add('loaded'), 300);
    };

    if (heroImage) {
        if (heroImage.complete) {
            heroImageLoaded();
        } else {
            heroImage.addEventListener('load', heroImageLoaded);
            heroImage.addEventListener('error', heroImageLoaded); // Treat error as loaded to not block UI
        }
    } else {
        // If no hero image, load immediately
        heroImageLoaded();
    }
}
