/**
 * JBP Malerservice AS - Main JavaScript
 * Professional painting services in Hamar, Norway
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const contactForm = document.getElementById('contact-form');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // ============================================
    // Header Scroll Effect
    // ============================================
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Contact Form Handling
    // ============================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Check honeypot field (spam protection)
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value !== '') {
                console.log('Bot detected');
                return false;
            }

            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Basic validation
            if (!data.name || !data.email || !data.phone || !data.message) {
                showFormMessage('Vennligst fyll ut alle obligatoriske felt.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormMessage('Vennligst oppgi en gyldig e-postadresse.', 'error');
                return;
            }

            // Phone validation (Norwegian format)
            const phoneRegex = /^(\+47)?[\s]?[0-9]{8}$/;
            const cleanPhone = data.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormMessage('Vennligst oppgi et gyldig telefonnummer (8 siffer).', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sender...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showFormMessage('Takk for din henvendelse! Vi tar kontakt med deg innen 24 timer.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    function showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success'
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                }
            </svg>
            <span>${message}</span>
        `;

        // Insert message before submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.parentNode.insertBefore(messageEl, submitBtn);

        // Auto remove after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageEl.remove();
            }, 5000);
        }
    }

    // ============================================
    // Project Filter (Projects page)
    // ============================================
    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll('.service-card, .value-card, .project-card, .testimonial-card, .price-table, .package-card, .faq-item');

    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Back to Top Button
    // ============================================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18,15 12,9 6,15"></polyline>
        </svg>
    `;
    backToTopBtn.setAttribute('aria-label', 'Tilbake til toppen');
    document.body.appendChild(backToTopBtn);

    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // Counter Animation (Stats)
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(stat => {
            counterObserver.observe(stat);
        });
    }

    function animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const target = parseInt(text.replace(/[^0-9]/g, ''));

        if (isNaN(target)) return;

        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeProgress);

            let display = current.toString();
            if (hasPlus) display += '+';
            if (hasPercent) display += '%';

            element.textContent = display;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // Phone Number Click Tracking
    // ============================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone click tracked');
            // Here you could add analytics tracking
        });
    });

    // ============================================
    // Accessibility: Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // ============================================
    // Current Year in Footer
    // ============================================
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });

    // ============================================
    // Service Worker Registration (PWA)
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Service worker can be registered here if needed
            // navigator.serviceWorker.register('/sw.js');
        });
    }

    // ============================================
    // Handle Page Visibility
    // ============================================
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // Page is visible again
        }
    });

    // Log initialization
    console.log('JBP Malerservice AS - Website initialized');

})();
