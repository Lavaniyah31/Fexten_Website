/**
 * Fexten Solutions - Core Script
 * Includes: Component Loader, Theme Management, and UI Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems directly since components are now hard-coded
    initTheme();
    initNavigation();
    initAnimations();
});

/**
 * Note: loadComponent was removed as components are now hard-coded for offline visibility.
 */

/**
 * Initializes Navigation logic after header is loaded
 */
function initNavigation() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Set Active Link
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
    const activeLink = document.querySelector(`.nav-links a[data-page="${currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                }
            }
        });
    });

    // Navbar Background on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

/**
 * Theme Management
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const body = document.body;
    const modeText = themeToggle.querySelector('.mode-text');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
    });

    function updateThemeUI(theme) {
        if (modeText) {
            modeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }
}

/**
 * animations and Interactivity
 */
function initAnimations() {
    // Intersection Observer for Scroll Reveals
    const revealOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.section, .card, .hero h1, .hero p').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            const welcomeText = preloader.querySelector('.welcome-text');
            const logoAnim = preloader.querySelector('.logo-animation');

            if (welcomeText) welcomeText.style.display = 'none';
            if (logoAnim) {
                logoAnim.classList.add('active');
                setTimeout(() => {
                    preloader.style.animation = 'fadeOutPreloader 0.8s ease forwards';
                }, 1500);
            }
        }, 2000);
    }

    // Scroll Controls
    const scrollUp = document.getElementById('scrollUp');
    const scrollDown = document.getElementById('scrollDown');

    if (scrollUp) {
        scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    if (scrollDown) {
        scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    }
}

/**
 * Testimonial Carousel
 */
let currentTestimonialIndex = 0;

// Initialize testimonial dots
function initTestimonialDots() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    
    if (!cards.length || !dotsContainer) return;
    
    let cardsToShow = 3;
    if (window.innerWidth <= 1024) cardsToShow = 2;
    if (window.innerWidth <= 768) cardsToShow = 1;
    
    const totalDots = cards.length - cardsToShow + 1;
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToTestimonialSlide(i);
        dotsContainer.appendChild(dot);
    }
}

function updateTestimonialDots() {
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonialIndex);
    });
}

function goToTestimonialSlide(index) {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!track || cards.length === 0) return;
    
    currentTestimonialIndex = index;
    
    const cardWidth = cards[0].offsetWidth;
    const gap = 20;
    const offset = -(currentTestimonialIndex * (cardWidth + gap));
    
    track.style.transform = `translateX(${offset}px)`;
    updateTestimonialDots();
}

function moveTestimonialCarousel(direction) {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!track || cards.length === 0) return;
    
    // Calculate how many cards to show based on screen width
    let cardsToShow = 3;
    if (window.innerWidth <= 1024) {
        cardsToShow = 2;
    }
    if (window.innerWidth <= 768) {
        cardsToShow = 1;
    }
    
    const maxIndex = cards.length - cardsToShow;
    
    currentTestimonialIndex += direction;
    
    // Loop around
    if (currentTestimonialIndex < 0) {
        currentTestimonialIndex = maxIndex;
    } else if (currentTestimonialIndex > maxIndex) {
        currentTestimonialIndex = 0;
    }
    
    // Calculate the offset based on card width and gap
    const cardWidth = cards[0].offsetWidth;
    const gap = 20;
    const offset = -(currentTestimonialIndex * (cardWidth + gap));
    
    track.style.transform = `translateX(${offset}px)`;
    updateTestimonialDots();
}

// Auto-play carousel with smooth transition
let testimonialAutoplay = setInterval(() => {
    moveTestimonialCarousel(1);
}, 4500);

// Pause autoplay on hover
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dots
    setTimeout(initTestimonialDots, 100);
    
    const carouselContainer = document.querySelector('.testimonial-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(testimonialAutoplay);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            testimonialAutoplay = setInterval(() => {
                moveTestimonialCarousel(1);
            }, 4500);
        });
    }
});

// Reset carousel on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        currentTestimonialIndex = 0;
        const track = document.querySelector('.testimonial-track');
        if (track) {
            track.style.transform = 'translateX(0)';
        }
        initTestimonialDots();
    }, 250);
});

