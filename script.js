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
 * Form validation and submission handling
 */
function initFormValidation() {
    console.log('initFormValidation called');
    if (window.formValidationInitialized) {
        console.error('Form validation already initialized.');
        return;
    }
    window.formValidationInitialized = true;

    const form = document.getElementById('website-form');
    if (!form) {
        console.error('Form not found');
        return;
    }

    if (form._hasSubmitListener) {
        console.error('Form already has a submit listener attached!');
        return;
    }
    form._hasSubmitListener = true;

    let isSubmitting = false;

    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        business: document.getElementById('business'),
        message: document.getElementById('message')
    };

    if (!formFields.name || !formFields.email || !formFields.phone || !formFields.business) {
        console.log('Required form fields not found');
        return;
    }

    function validateField(field, isValid, errorMessage) {
        const errorEl = field.nextElementSibling?.classList.contains('error-message') ? field.nextElementSibling : null;
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

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (isSubmitting) {
            console.log('Submission already in progress, preventing duplicate');
            return;
        }
        
        isSubmitting = true;
        
        const formData = {
            name: formFields.name.value.trim(),
            email: formFields.email.value.trim(),
            phone: formFields.phone.value.trim(),
            business: formFields.business.value.trim(),
            message: formFields.message ? formFields.message.value.trim() : ''
        };

        let isValid = true;
        if (!formData.name) isValid = validateField(formFields.name, false, 'Name is required') && isValid;
        if (!formData.email || !isValidEmail(formData.email)) isValid = validateField(formFields.email, false, 'Please enter a valid email address') && isValid;
        if (!formData.phone) isValid = validateField(formFields.phone, false, 'Phone number is required') && isValid;
        if (!formData.business) isValid = validateField(formFields.business, false, 'Business name is required') && isValid;
        
        if (!isValid) {
            isSubmitting = false;
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonOriginalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // --- THIS IS THE CORRECTED SECTION ---
        // Send email using EmailJS
        emailjs.send('service_stvkor9', 'template_kwz2kfx', formData, 'HjdXi5aEYt4K0Vluu')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                form.reset();
                form.querySelectorAll('.error-message').forEach(el => el.remove());
                Object.values(formFields).forEach(field => field.classList.remove('error'));
                showNotification('Thank you! Your form has been submitted successfully.');
            }, function(error) {
                console.log('FAILED...', error);
                showNotification('Sorry, there was an error submitting your form. Please try again later.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = buttonOriginalText;
                isSubmitting = false;
            });
    });
}


/**
 * Show notification with custom message
 */
function showNotification(message = 'Operation completed successfully') {
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(function() {
        notification.classList.remove('show');
    }, 5000);
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


/**
 * Floating CTA button functionality
 */
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
