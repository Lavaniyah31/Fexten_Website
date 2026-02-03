// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.2)';
    } else {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        
        // Show success message (you can customize this)
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Add active class to nav links
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Counter Animation for Client Numbers
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Trigger counter animation when visible
const counterElement = document.querySelector('.display-6.fw-bold.text-blue');
if (counterElement) {
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target, 50, 2000);
            }
        });
    });
    counterObserver.observe(counterElement);
}

// Close mobile menu when clicking on a link
const navbarCollapse = document.querySelector('.navbar-collapse');
const navbarToggler = document.querySelector('.navbar-toggler');

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const scrolled = window.pageYOffset;
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Testimonial Carousel Functionality
let currentTestimonialIndex = 0;
const testimonialCarousel = document.getElementById('testimonialCarousel');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDotsContainer = document.getElementById('testimonialDots');
let autoScrollInterval;

// Create dots for testimonials
if (testimonialSlides.length > 0) {
    testimonialSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => goToTestimonial(index);
        testimonialDotsContainer.appendChild(dot);
    });
}

function scrollTestimonials(direction) {
    const slideWidth = testimonialSlides[0].offsetWidth;
    const gap = 30;
    const scrollAmount = (slideWidth + gap) * direction;
    
    testimonialCarousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
    
    // Update active dot
    updateActiveDot();
    resetAutoScroll();
}

function goToTestimonial(index) {
    const slideWidth = testimonialSlides[0].offsetWidth;
    const gap = 30;
    const scrollPosition = (slideWidth + gap) * index;
    
    testimonialCarousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    
    currentTestimonialIndex = index;
    updateActiveDot();
    resetAutoScroll();
}

function updateActiveDot() {
    const dots = document.querySelectorAll('.testimonial-dot');
    const slideWidth = testimonialSlides[0].offsetWidth;
    const scrollLeft = testimonialCarousel.scrollLeft;
    const gap = 30;
    const newIndex = Math.round(scrollLeft / (slideWidth + gap));
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === newIndex);
    });
    
    currentTestimonialIndex = newIndex;
}

// Auto scroll testimonials
function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialSlides.length;
        goToTestimonial(currentTestimonialIndex);
    }, 5000); // Change testimonial every 5 seconds
}

function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
}

// Listen to scroll events to update dots
if (testimonialCarousel) {
    testimonialCarousel.addEventListener('scroll', updateActiveDot);
    
    // Start auto scroll
    startAutoScroll();
    
    // Pause auto scroll on hover
    testimonialCarousel.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    testimonialCarousel.addEventListener('mouseleave', () => {
        startAutoScroll();
    });
}

// Intersection Observer for scroll animations
const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollAnimationObserver.observe(el);
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (testimonialCarousel) {
    testimonialCarousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    testimonialCarousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left
        scrollTestimonials(1);
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right
        scrollTestimonials(-1);
    }
}

console.log('Fexten Website Loaded Successfully!');
