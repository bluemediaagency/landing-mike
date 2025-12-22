// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel de resultados
    initResultsCarousel();
});

// Carrusel de Resultados - Minimalista y suave
function initResultsCarousel() {
    const carousel = document.getElementById('resultsCarousel');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!carousel || dots.length === 0) return;
    
    const slides = carousel.querySelectorAll('.results-slide');
    let currentSlide = 0;
    let autoSlideInterval;
    const slideDuration = 5000; // 5 segundos
    
    // Función para mostrar un slide específico
    function showSlide(index) {
        // Remover clase active de todos los slides y dots
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (dots[i]) {
                dots[i].classList.remove('active');
            }
        });
        
        // Agregar clase active al slide y dot seleccionado
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Función para avanzar al siguiente slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Configurar auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Agregar event listeners a los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });
    
    // Pausar auto-slide al hacer hover sobre el carrusel
    const carouselWrapper = carousel.closest('.results-carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
        carouselWrapper.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Iniciar auto-slide
    startAutoSlide();
    
    // Limpiar interval al salir de la página
    window.addEventListener('beforeunload', stopAutoSlide);
}

// Función de testimonios removida

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
                
                // Scroll suave manual sin scrollIntoView
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - 80,
                    behavior: 'smooth'
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
    
    // Efecto ripple eliminado para permitir navegación directa a Tally
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

// Función eliminada - CTAs ahora van directamente a Tally

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

// Formulario de Leads con integración n8n
function initLeadForm() {
    const form = document.getElementById('leadForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const leadData = {
            fullName: formData.get('fullName'),
            whatsapp: formData.get('whatsapp'),
            businessType: formData.get('businessType'),
            timestamp: new Date().toISOString(),
            source: 'landing_bluemedia'
        };
        
        // Validar datos
        if (!leadData.fullName || !leadData.whatsapp || !leadData.businessType) {
            showErrorMessage('Por favor, completa todos los campos requeridos.');
            return;
        }
        
        // Mostrar estado de carga
        const submitBtn = form.querySelector('.form-submit-btn');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        const originalIcon = submitBtn.querySelector('i').className;
        
        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Enviando...';
        submitBtn.querySelector('i').className = 'fas fa-spinner';
        submitBtn.disabled = true;
        
        try {
            // Enviar a webhook de n8n
            const response = await fetch('https://rubendrz4542.app.n8n.cloud/webhook-test/lead-landing-bluemedia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData)
            });
            
            if (response.ok) {
                // Éxito
                form.style.display = 'none';
                showSuccessMessage();
                
                // Tracking de conversión
                trackConversion('Lead Form Submitted');
                
                // Resetear formulario después de un tiempo
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    hideMessages();
                }, 10000);
                
            } else {
                throw new Error('Error en el servidor');
            }
            
        } catch (error) {
            console.error('Error enviando lead:', error);
            showErrorMessage('Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo.');
        } finally {
            // Restaurar botón
            submitBtn.classList.remove('loading');
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.querySelector('i').className = originalIcon;
            submitBtn.disabled = false;
        }
    });
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remover errores previos
    field.classList.remove('error');
    
    // Validar según el tipo de campo
    switch(field.name) {
        case 'fullName':
            if (!value || value.length < 2) {
                showFieldError(field, 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            break;
            
        case 'whatsapp':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!value || !phoneRegex.test(value) || value.length < 8) {
                showFieldError(field, 'Ingresa un número de WhatsApp válido');
                return false;
            }
            break;
            
        case 'businessType':
            if (!value) {
                showFieldError(field, 'Selecciona tu tipo de negocio');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remover mensaje de error previo
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMsg = field.parentNode.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll suave al mensaje
    // Removido scrollIntoView para evitar saltos
}

function showErrorMessage(customMessage = null) {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (customMessage) {
        errorMessage.querySelector('.error-content p').textContent = customMessage;
    }
    
    successMessage.style.display = 'none';
    errorMessage.style.display = 'block';
    
    // Scroll suave al mensaje
    // Removido scrollIntoView para evitar saltos
}

function hideMessages() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

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