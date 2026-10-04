/**
 * Alphabridge Website - Main JavaScript
 * Single-scroll design with accordion and smooth navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initSmoothScroll();
    initAnimations();
    initStats();
    initAccordion();
    initContactForm();
    initActiveNavHighlight();
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
                navbar.style.backgroundColor = 'rgba(249, 247, 242, 0.98)';
            } else {
                navbar.style.boxShadow = '';
                navbar.style.backgroundColor = '';
            }
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Active Navigation Highlight on Scroll
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Run on load
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
 * Services Accordion
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.service-accordion-item');

    if (accordionItems.length === 0) return;

    // Open first item by default
    accordionItems[0].classList.add('active');

    accordionItems.forEach(function(item) {
        const header = item.querySelector('.service-accordion-header');

        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all items
            accordionItems.forEach(function(otherItem) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.service-accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) return;

    // Check if returning from successful Formspree submission
    if (window.location.search.includes('submitted=true')) {
        form.style.display = 'none';
        formSuccess.classList.add('show');

        // Clean URL
        if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        return;
    }

    // Add hidden field to redirect back with success parameter
    const redirectInput = document.createElement('input');
    redirectInput.type = 'hidden';
    redirectInput.name = '_next';
    redirectInput.value = window.location.href.split('?')[0] + '?submitted=true';
    form.appendChild(redirectInput);
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
