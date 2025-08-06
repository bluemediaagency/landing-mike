// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Inicializar carruseles
    initResultsCarousel();
    initTestimonialsCarousel();
    
    // Sticky CTA mobile
    initStickyCTA();
    
    // Smooth scrolling para CTAs
    initSmoothScrolling();
    
    // Animaciones de contadores
    initCounterAnimations();
    
    // Efectos de hover mejorados
    initHoverEffects();
    
    // Lazy loading para imágenes
    initLazyLoading();
});

// Carrusel de Resultados Reales (ahora es automático con CSS)
function initResultsCarousel() {
    const carousel = document.getElementById('resultsCarousel');
    if (!carousel) return;
    
    // El carrusel ahora funciona completamente con CSS animation
    // Solo agregamos funcionalidad para pausar en hover si se desea
    const carouselContainer = carousel.parentElement;
    
    carouselContainer.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        carousel.style.animationPlayState = 'running';
    });
}

// Carrusel de Testimonios
function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial-slide');
    let currentTestimonial = 0;
    const totalTestimonials = slides.length;
    
    function showTestimonial(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        
        // Actualizar dots
        const dots = document.querySelectorAll('.carousel-dots .dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
        
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }
    
    // Auto-play cada 5 segundos
    setInterval(nextTestimonial, 5000);
    
    // Mostrar primer testimonial
    showTestimonial(0);
}

// Función global para cambiar testimonial (llamada desde HTML)
function currentTestimonial(index) {
    const carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial-slide');
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index - 1) {
            slide.classList.add('active');
        }
    });
    
    const dots = document.querySelectorAll('.carousel-dots .dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index - 1) {
            dot.classList.add('active');
        }
    });
    
    carousel.style.transform = `translateX(-${(index - 1) * 100}%)`;
}

// Sticky CTA Mobile
function initStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta-mobile');
    const heroSection = document.querySelector('.hero-new');
    const finalCTA = document.querySelector('.cta-final');
    
    if (!stickyCTA || !heroSection || !finalCTA) return;
    
    function toggleStickyCTA() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const finalCTATop = finalCTA.offsetTop;
        const scrollY = window.scrollY;
        
        if (scrollY > heroBottom && scrollY < finalCTATop - window.innerHeight) {
            stickyCTA.style.display = 'block';
            stickyCTA.style.opacity = '1';
        } else {
            stickyCTA.style.opacity = '0';
            setTimeout(() => {
                if (stickyCTA.style.opacity === '0') {
                    stickyCTA.style.display = 'none';
                }
            }, 300);
        }
    }
    
    window.addEventListener('scroll', debounce(toggleStickyCTA, 10));
}

// Smooth Scrolling
function initSmoothScrolling() {
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Agregar efecto de click
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Scroll suave
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Tracking de conversión
                trackConversion(this.textContent.trim());
            }
        });
    });
}

// Animaciones de Contadores
function initCounterAnimations() {
    const counters = document.querySelectorAll('.roi-number, .massive-number, .number-value');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isMillions = target.includes('millones') || target.includes('M');
    
    let numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    
    let current = 0;
    const increment = numericTarget / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= numericTarget) {
            current = numericTarget;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        
        if (isMillions && target.includes('millones')) displayValue = displayValue + ' millones';
        if (isMillions && target.includes('M')) displayValue = displayValue + 'M';
        if (isPercentage) displayValue = displayValue + '%';
        
        element.textContent = displayValue;
    }, stepTime);
}

// Efectos de Hover Mejorados
function initHoverEffects() {
    // Efecto parallax en hero
    const hero = document.querySelector('.hero-new');
    if (hero) {
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxSpeed = scrolled * 0.3;
                hero.style.transform = `translateY(${parallaxSpeed}px)`;
            }
        }, 5));
    }
    
    // Efectos de hover en tarjetas
    const cards = document.querySelectorAll('.client-card, .step-item, .roi-card, .comparison-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 60px rgba(11, 99, 206, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Efecto de ondas en botones CTA
    const ctaButtons = document.querySelectorAll('.cta-button-hero, .cta-button-final, .sticky-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Lazy Loading para Imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Agregar clase de loading
                img.classList.add('loading');
                
                // Simular carga de imagen
                img.onload = function() {
                    this.classList.remove('loading');
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Función para abrir el video de BlueMedia
function openVideo() {
    // URL del video de Dropbox
    const videoUrl = 'https://www.dropbox.com/scl/fi/kfndvhe6xe0rb02hxtdu6/VSL-MIKE.mp4?rlkey=li975nacrpdo4sz97j5dceyfn&st=ezdladw9&dl=0';
    
    // Abrir en nueva ventana/pestaña
    window.open(videoUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    // Tracking de conversión
    trackConversion('Video Demo View');
    
    console.log('Video de BlueMedia abierto');
}

// Función para abrir Calendly (placeholder)
function openCalendly() {
    // Aquí integrarías con Calendly o tu sistema de agendamiento
    console.log('Abriendo sistema de agendamiento...');
    
    // Tracking de conversión
    trackConversion('Calendly CTA');
    
    // Placeholder: abrir en nueva ventana
    alert('¡Excelente! En producción esto abriría tu sistema de agendamiento (Calendly, etc.)');
}

// Sistema de Tracking de Conversiones
function trackConversion(action) {
    // Aquí integrarías con Google Analytics, Facebook Pixel, etc.
    console.log('Conversión tracked:', action);
    
    // Google Analytics 4 ejemplo
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'event_category': 'CTA',
            'event_label': action,
            'value': 1
        });
    }
    
    // Facebook Pixel ejemplo
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: action
        });
    }
}

// Utilidades
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Detección de dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Optimizaciones de rendimiento
function optimizePerformance() {
    // Preload de recursos críticos
    const criticalImages = [
        'images/dr-carlos-guerra.jpg',
        'images/doctor-bata-tablet.jpg',
        'images/bluemedia-logo.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
    });
    
    // Lazy load de scripts no críticos
    setTimeout(() => {
        // Cargar scripts de analytics después de 3 segundos
        loadAnalyticsScripts();
    }, 3000);
}

function loadAnalyticsScripts() {
    // Google Analytics
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(gaScript);
    
    // Facebook Pixel
    const fbScript = document.createElement('script');
    fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
    `;
    document.head.appendChild(fbScript);
}

// Efectos CSS adicionales via JavaScript
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loading {
        opacity: 0.5;
        transition: opacity 0.3s ease;
    }
    
    /* Mejoras de accesibilidad */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// Inicializar optimizaciones cuando la página esté cargada
window.addEventListener('load', () => {
    optimizePerformance();
    
    // Agregar clase loaded al body
    document.body.classList.add('loaded');
});

// PWA Support (Service Worker registration)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}