/**
 * Alphabridge Website - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initAnimations();
    initStats();
    initContactForm();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger
            if (navMenu.classList.contains('active')) {
                hamburger.style.backgroundColor = 'transparent';
                hamburger.style.transform = 'rotate(45deg)';
            } else {
                hamburger.style.backgroundColor = '';
                hamburger.style.transform = '';
            }
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.style.backgroundColor = '';
                hamburger.style.transform = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.style.backgroundColor = '';
                hamburger.style.transform = '';
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '';
            }
        });
    }
}

/**
 * Scroll Animations using Intersection Observer
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(function(el) {
            el.classList.add('animated');
        });
    }
}

/**
 * Animated Statistics Counter
 */
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length === 0) return;

    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const isDecimal = end % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOut;

            if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.getAttribute('data-target'));
                    animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(function(stat) {
            observer.observe(stat);
        });
    } else {
        // Fallback
        statNumbers.forEach(function(stat) {
            const target = parseFloat(stat.getAttribute('data-target'));
            stat.textContent = target % 1 !== 0 ? target.toFixed(1) : target;
        });
    }
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const firstName = form.querySelector('#firstName').value.trim();
        const lastName = form.querySelector('#lastName').value.trim();
        const email = form.querySelector('#email').value.trim();

        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach(function(value, key) {
            data[key] = value;
        });

        // In production, you would send this to your backend
        // For now, we'll simulate a successful submission
        console.log('Form submitted:', data);

        // Show success message
        form.style.display = 'none';
        formSuccess.classList.add('show');

        // Optionally, you could integrate with:
        // - Formspree
        // - Netlify Forms
        // - Your own backend API
        // - Email service like SendGrid
    });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
