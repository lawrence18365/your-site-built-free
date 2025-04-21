// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initStickyHeader();
    initMobileNav();
    initPortfolioSlider();
    initCountdownTimer();
    initFormValidation();
    initFloatingCTA();
    initSmoothScroll();
    initScrollAnimations();
    initNotifications();
});

/**
 * Makes the header sticky on scroll
 */
function initStickyHeader() {
    const header = document.getElementById('header');
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
 * Handles mobile navigation toggle
 */
function initMobileNav() {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const nav = document.getElementById('nav');
    const navLinks = nav.querySelectorAll('.nav-link');

    // Toggle navigation on button click
    mobileNavToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Close navigation when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
        });
    });

    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !mobileNavToggle.contains(event.target)) {
            nav.classList.remove('active');
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
    const visibleItems = getVisibleItemCount();
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
    
    // Update slider on window resize
    window.addEventListener('resize', function() {
        // Reset position if we've resized to show different number of items
        const newVisibleItems = getVisibleItemCount();
        if (newVisibleItems !== visibleItems) {
            currentIndex = 0;
        }
        updateSliderPosition();
        updateProgressBar();
    });
    
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
        
        // Update DOM elements
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
        }
    }
    
    // Initial call
    updateCountdown();
    
    // Update every second
    const timerInterval = setInterval(updateCountdown, 1000);
}

/**
 * Form validation and submission handling
 */
function initFormValidation() {
    const form = document.getElementById('website-form');
    const notification = document.getElementById('notification');
    
    if (!form || !notification) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const business = document.getElementById('business').value.trim();
        const websiteType = document.getElementById('website-type').value;
        
        // Validate required fields
        if (!name || !email || !phone || !business || !websiteType) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Validate phone number (basic validation)
        const phonePattern = /^[\d\s\(\)\-\+]{7,20}$/;
        if (!phonePattern.test(phone)) {
            alert('Please enter a valid phone number.');
            return;
        }
        
        // If validation passes, simulate form submission
        const formData = {
            name,
            email,
            phone,
            business,
            websiteType,
            message: document.getElementById('message').value.trim()
        };
        
        // Normally you would send this data to your server
        console.log('Form submitted:', formData);
        
        // Reset form
        form.reset();
        
        // Show success notification
        showNotification();
    });
}

/**
 * Show success notification
 */
function showNotification() {
    const notification = document.getElementById('notification');
    
    if (!notification) return;
    
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
    
    window.addEventListener('scroll', function() {
        // Show floating CTA when user scrolls past hero section
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        if (window.scrollY > heroBottom) {
            floatingCta.style.display = 'block';
        } else {
            floatingCta.style.display = 'none';
        }
    });
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
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Scroll smoothly
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
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
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll events
    function handleScroll() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.style.opacity = '1';
            }
        });
    }
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
}

/**
 * Initialize notification system
 */
function initNotifications() {
    // This function could be expanded to handle different types of notifications
    // Currently used by the form submission success
}

/**
 * Helper function to debounce function calls
 */
function debounce(func, wait = 20, immediate = true) {
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
 */
function isElementInViewport(el) {
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
 */
function toggleClassOnScroll(element, className) {
    if (isElementInViewport(element)) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 * Helper function to format numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/**
 * Helper function to validate email address
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Get browser details for analytics or special handling
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
    } else if (ua.indexOf("Edge") > -1) {
        browser = "Edge";
    } else if (ua.indexOf("Chrome") > -1) {
        browser = "Chrome";
    } else if (ua.indexOf("Safari") > -1) {
        browser = "Safari";
    }
    
    return {
        browser,
        mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    };
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

// Add custom event tracking for analytics
document.addEventListener('DOMContentLoaded', function() {
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-secondary');
    ctaButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            console.log('CTA button clicked:', index);
            // Here you would typically send this data to your analytics platform
        });
    });
    
    // Track form field focus
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
        
        observer.observe(item);
    });
});
/**
 * Hides header on scroll down, shows on scroll up
 */
function initScrollHeaderVisibility() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollTop = 0;
    const scrollThreshold = 50; // Adjust this value as needed

    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up or at the top
            header.classList.remove('header-hidden');
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
    });
}

// Add the new function to the DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initStickyHeader();
    initMobileNav();
    initPortfolioSlider();
    initCountdownTimer();
    initFormValidation();
    initFloatingCTA();
    initSmoothScroll();
    initScrollAnimations();
    initNotifications();
    initScrollHeaderVisibility(); // Call the new function
});


document.addEventListener('DOMContentLoaded', function() {
    // Add animation effects
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
    document.querySelectorAll('.feature-item, .features-intro, .features-cta').forEach(item => {
        observer.observe(item);
    });
    
    // Add parallax effect to background elements
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelector('.dot-pattern-1').style.transform = `translateY(${scrollPosition * 0.05}px)`;
        document.querySelector('.dot-pattern-2').style.transform = `translateY(-${scrollPosition * 0.03}px)`;
        document.querySelector('.blur-circle-1').style.transform = `translateY(${scrollPosition * 0.07}px)`;
        document.querySelector('.blur-circle-2').style.transform = `translateY(-${scrollPosition * 0.04}px)`;
    });
});




document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('testimonialsTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    const indicators = document.getElementById('testimonialIndicators');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
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
        const dots = document.querySelectorAll('.testimonial-dot');
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
        currentSlide = slideIndex;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }
    
    // Previous slide button
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    });
    
    // Next slide button
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    });
    
    // Auto slide (optional)
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        }, 7000); // Change slide every 7 seconds
    }zs
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto sliding
    startAutoSlide();
    
    // Pause auto slide on hover
    const slider = document.querySelector('.testimonials-slider');
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Handle swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
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
    
    // Add animation when slides enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.testimonial-card').forEach(item => {
        observer.observe(item);
    });
});






document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ elements
    const faqItems = document.querySelectorAll('.faq-item');
    const expandAllButton = document.querySelector('.faq-expand-all');
    
    // Initialize FAQ items with closed state
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
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
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
        
        // Update expand all button state
        updateExpandAllButton();
    }
    
    // Function to toggle all FAQ items
    function toggleAllFaqItems(expand) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.setAttribute('aria-expanded', expand);
            
            if (expand) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0px';
            }
        });
        
        expandAllButton.setAttribute('aria-expanded', expand);
    }
    
    // Function to update the expand all button state
    function updateExpandAllButton() {
        const allExpanded = Array.from(faqItems).every(item => 
            item.querySelector('.faq-question').getAttribute('aria-expanded') === 'true'
        );
        
        expandAllButton.setAttribute('aria-expanded', allExpanded);
    }
    
    // Add click event for expand/collapse all button
    expandAllButton.addEventListener('click', () => {
        const isExpanded = expandAllButton.getAttribute('aria-expanded') === 'true';
        toggleAllFaqItems(!isExpanded);
    });
    
    // Handle window resize to adjust maxHeight
    window.addEventListener('resize', () => {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question.getAttribute('aria-expanded') === 'true') {
                // Temporarily collapse to get proper scrollHeight
                answer.style.maxHeight = 'none';
                const scrollHeight = answer.scrollHeight;
                answer.style.maxHeight = scrollHeight + 'px';
            }
        });
    });
    
    // SEO optimization - open FAQ item if URL hash matches
    if (window.location.hash) {
        const targetItem = document.querySelector(window.location.hash);
        if (targetItem && targetItem.classList.contains('faq-item')) {
            setTimeout(() => {
                toggleFaqItem(targetItem);
                targetItem.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
});
