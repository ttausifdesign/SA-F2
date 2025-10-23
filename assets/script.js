// Global Variables
let currentSlide = 0;
const totalSlides = 3;
let slideInterval;
let isHeaderSolid = false;

// DOM Elements
const header = document.getElementById('header');
const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderPagination = document.getElementById('sliderPagination');
const scrollContent = document.getElementById('scrollContent');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeNavigation();
    initializeClientCarousel();
});

// Client Carousel with improved functionality
function initializeClientCarousel() {
    const clientCarousel = document.querySelector('.client-carousel');
    const clientTrack = document.querySelector('.client-track');

    if (clientCarousel && clientTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Prevent text and image selection
        clientCarousel.style.userSelect = 'none';
        clientCarousel.style.webkitUserSelect = 'none';
        clientCarousel.style.mozUserSelect = 'none';
        clientCarousel.style.msUserSelect = 'none';
        clientCarousel.style.cursor = 'grab';

        // Prevent image dragging and text selection
        const images = clientCarousel.querySelectorAll('img');
        const texts = clientCarousel.querySelectorAll('p');
        const cards = clientCarousel.querySelectorAll('.client-card');
        
        images.forEach(img => {
            img.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
        });

        texts.forEach(text => {
            text.style.userSelect = 'none';
            text.style.webkitUserSelect = 'none';
        });

        // Pause animation on hover over carousel or any card
        clientCarousel.addEventListener('mouseenter', () => {
            clientTrack.classList.add('paused');
        });

        clientCarousel.addEventListener('mouseleave', () => {
            clientTrack.classList.remove('paused');
        });

        // Also handle individual cards
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                clientTrack.classList.add('paused');
            });

            card.addEventListener('mouseleave', () => {
                // Only remove paused if mouse is not over carousel
                if (!clientCarousel.matches(':hover')) {
                    clientTrack.classList.remove('paused');
                }
            });
        });

        // Drag functionality
        clientCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - clientCarousel.offsetLeft;
            scrollLeft = clientCarousel.scrollLeft;
            clientCarousel.style.cursor = 'grabbing';
            e.preventDefault();
        });

        clientCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            clientCarousel.style.cursor = 'grab';
        });

        clientCarousel.addEventListener('mouseup', () => {
            isDown = false;
            clientCarousel.style.cursor = 'grab';
        });

        clientCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - clientCarousel.offsetLeft;
            const walk = (x - startX) * 0.3;
            clientCarousel.scrollLeft = scrollLeft - walk;
        });

        // Prevent context menu
        clientCarousel.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Touch support for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;

        clientCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchScrollLeft = clientCarousel.scrollLeft;
            clientTrack.classList.add('paused');
        });

        clientCarousel.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            e.preventDefault();
            const x = e.touches[0].clientX;
            const walk = (touchStartX - x) * 0.5;
            clientCarousel.scrollLeft = touchScrollLeft + walk;
        });

        clientCarousel.addEventListener('touchend', () => {
            touchStartX = 0;
            clientTrack.classList.remove('paused');
        });
    }
}

// Fade-in on scroll
window.addEventListener("scroll", function () {
  const section = document.querySelector(".company-info");
  const sectionTop = section.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight * 0.85;

  if (sectionTop < triggerPoint) {
    section.classList.add("visible");
  }
});
// Slider Functions
function initializeSlider() {
    // Auto-play slider
    startSlideInterval();
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        goToPrevSlide();
        resetSlideInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        goToNextSlide();
        resetSlideInterval();
    });
    
    // Pagination dots
    const dots = sliderPagination.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSlideInterval();
        });
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    sliderTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    sliderTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToNextSlide();
            } else {
                goToPrevSlide();
            }
            resetSlideInterval();
        }
    }
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
    updatePagination();
}

function goToNextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    updatePagination();
}

function goToPrevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    updatePagination();
}

function updateSlider() {
    const translateX = -currentSlide * 100;
    sliderTrack.style.transform = `translateX(${translateX}%)`;
}

function updatePagination() {
    const dots = sliderPagination.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startSlideInterval() {
    slideInterval = setInterval(goToNextSlide, 4000);
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for scroll section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3
    });
    
    if (scrollContent) {
        observer.observe(scrollContent);
    }
}

function handleScroll() {
    const scrollPosition = window.scrollY;
    const sliderHeight = window.innerHeight * 0.6;
    
    // Header background change
    if (scrollPosition > sliderHeight && !isHeaderSolid) {
        header.classList.remove('header-transparent');
        header.classList.add('header-solid');
        isHeaderSolid = true;
    } else if (scrollPosition <= sliderHeight && isHeaderSolid) {
        header.classList.remove('header-solid');
        header.classList.add('header-transparent');
        isHeaderSolid = false;
    }
}

// Mobile Menu
function initializeMobileMenu() {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
}

// Navigation
function initializeNavigation() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Pause animations when page is not visible
document.addEventListener('visibilitychange', () => {
    const clientTrack = document.querySelector('.client-track');
    
    if (document.hidden) {
        clearInterval(slideInterval);
        if (clientTrack) {
            clientTrack.style.animationPlayState = 'paused';
        }
    } else {
        startSlideInterval();
        if (clientTrack && !clientTrack.classList.contains('paused')) {
            clientTrack.style.animationPlayState = 'running';
        }
    }
});

// Resize handler for responsive behavior
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});