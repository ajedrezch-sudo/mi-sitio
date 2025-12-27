// Main Script for Tournament Website

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or if it's targeting a modal
        if (href === '#' || href.startsWith('#modal')) {
            return;
        }

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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    // Animate sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
});

// Counter animation for prize amounts
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isUSD = element.textContent.includes('U$D');

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (isUSD) {
            element.textContent = `${Math.floor(current).toLocaleString('en-US')} U$D`;
        } else {
            element.textContent = `$${Math.floor(current).toLocaleString('es-AR')}`;
        }
    }, 16);
}

// Trigger counter animations when prize section comes into view
const prizeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');

            const prizeAmounts = entry.target.querySelectorAll('.prize-amount-main, .prize-usd');
            prizeAmounts.forEach(amount => {
                const text = amount.textContent;
                const numMatch = text.match(/[\d.]+/g);
                if (numMatch) {
                    const targetValue = parseInt(numMatch.join(''));
                    animateCounter(amount, targetValue);
                }
            });
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const prizeSection = document.querySelector('#premios');
    if (prizeSection) {
        prizeObserver.observe(prizeSection);
    }
});

// Add pulse animation to CTA buttons
const ctaButtons = document.querySelectorAll('.btn-tournament-primary');
ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.5s';
    });

    button.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
