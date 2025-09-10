/**
 * Scroll Animation System
 * Gerencia animações triggeradas por scroll usando Intersection Observer
 */

class ScrollAnimations {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupRevealAnimations();
    this.setupParallaxEffects();
    this.setupStaggerAnimations();
  }

  /**
   * Configura animações de revelação (fade in)
   */
  setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    this.observers.set('reveal', observer);
  }

  /**
   * Configura efeitos de parallax
   */
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-slow');

    if (parallaxElements.length === 0) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      parallaxElements.forEach((element) => {
        element.style.transform = `translateY(${rate}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Configura animações escalonadas (stagger)
   */
  setupStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('[data-stagger]');

    staggerContainers.forEach((container) => {
      const children = container.querySelectorAll('.reveal-stagger');
      const delay = parseInt(container.dataset.staggerDelay) || 100;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              children.forEach((child, index) => {
                setTimeout(() => {
                  child.classList.add('revealed');
                }, index * delay);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      observer.observe(container);
      this.observers.set(`stagger-${container}`, observer);
    });
  }

  /**
   * Anima elementos específicos manualmente
   */
  animateElement(selector, animationClass = 'animate-fade-in-up') {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add(animationClass);
    }
  }

  /**
   * Remove todas as animações e observers
   */
  destroy() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

/**
 * Sistema de Micro-interações
 */
class MicroInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupMagneticEffects();
    this.setupHoverEffects();
    this.setupFocusEffects();
  }

  /**
   * Configura efeitos magnéticos em botões
   */
  setupMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach((element) => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;

        element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  /**
   * Configura efeitos de hover aprimorados
   */
  setupHoverEffects() {
    // Efeitos em cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Efeitos em botões
    const buttons = document.querySelectorAll('.btn-hover-lift');
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  }

  /**
   * Configura efeitos de foco aprimorados
   */
  setupFocusEffects() {
    const focusElements = document.querySelectorAll('.focus-visible-enhanced');

    focusElements.forEach((element) => {
      element.addEventListener('focus', () => {
        element.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.3)';
      });

      element.addEventListener('blur', () => {
        element.style.boxShadow = '';
      });
    });
  }
}

/**
 * Sistema de Performance para Animações
 */
class AnimationPerformance {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    if (this.prefersReducedMotion) {
      this.disableAnimations();
    }

    this.optimizeForPerformance();
  }

  /**
   * Desabilita animações para usuários que preferem movimento reduzido
   */
  disableAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Otimizações de performance para animações
   */
  optimizeForPerformance() {
    // Força aceleração por hardware em elementos animados
    const animatedElements = document.querySelectorAll('.card-hover, .btn-hover-lift, .magnetic');
    animatedElements.forEach((element) => {
      element.style.willChange = 'transform';
    });

    // Remove will-change após animações
    setTimeout(() => {
      animatedElements.forEach((element) => {
        element.style.willChange = 'auto';
      });
    }, 1000);
  }
}

// Inicialização global
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se estamos no lado cliente
  if (typeof window !== 'undefined') {
    window.scrollAnimations = new ScrollAnimations();
    window.microInteractions = new MicroInteractions();
    window.animationPerformance = new AnimationPerformance();
  }
});

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScrollAnimations, MicroInteractions, AnimationPerformance };
}
