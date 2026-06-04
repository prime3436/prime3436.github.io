/* ============================================================
   CYBERPUNK PORTFOLIO — INTERACTIVE ENGINE
   ============================================================ */

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.particleCount = window.innerWidth < 768 ? 60 : 120;
        this.connectionDistance = 150;
        this.mouseRadius = 200;

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() > 0.5 ? 185 : 295, // cyan or magenta
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse interaction — attract gently
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.mouseRadius) {
                const force = (this.mouseRadius - dist) / this.mouseRadius * 0.02;
                p.vx += dx * force;
                p.vy += dy * force;
            }

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const cdx = p.x - p2.x;
                const cdy = p.y - p2.y;
                const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

                if (cdist < this.connectionDistance) {
                    const alpha = (1 - cdist / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `hsla(185, 100%, 70%, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== TYPED TEXT EFFECT =====
class TypeWriter {
    constructor(element, texts, speed = 80, pause = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pause = pause;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 400;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== CUSTOM CURSOR =====
function initCursor() {
    const cursor = document.getElementById('cursorGlow');
    if (!cursor || window.innerWidth < 768) return;

    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function updateCursor() {
        currentX += (cursorX - currentX) * 0.15;
        currentY += (cursorY - currentY) * 0.15;
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .stat-card, .cert-card, .skill-hex, .contact-item, .achievement-card, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('.section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-terminal, .about-stats, .project-card, .cert-card, .achievement-card, .contact-info, .contact-form, .timeline-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * eased;

        element.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = isDecimal ? target.toFixed(2) : target;
        }
    }

    requestAnimationFrame(update);
}

// ===== SKILL BAR ANIMATION =====
function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    fills.forEach(fill => observer.observe(fill));
}

// ===== TILT EFFECT =====
function initTilt() {
    if (window.innerWidth < 768) return;

    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.querySelector('.btn-text').textContent;
        
        // Animate
        btn.querySelector('.btn-text').textContent = 'SENDING...';
        btn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = '✓ MESSAGE SENT';
            btn.style.borderColor = '#00ff88';
            btn.style.color = '#00ff88';
            
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.pointerEvents = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                form.reset();
            }, 2500);
        }, 1500);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
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
}

// ===== GLITCH TEXT ON HOVER (hero name) =====
function initGlitchHover() {
    const nameLines = document.querySelectorAll('.name-line');
    nameLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            line.style.animation = 'none';
            // Force rapid glitch
            let count = 0;
            const glitch = setInterval(() => {
                const x = (Math.random() - 0.5) * 6;
                const y = (Math.random() - 0.5) * 6;
                line.style.transform = `translate(${x}px, ${y}px)`;
                line.style.textShadow = `
                    ${x}px ${y}px 0 rgba(0, 240, 255, 0.7),
                    ${-x}px ${-y}px 0 rgba(255, 0, 255, 0.7)
                `;
                count++;
                if (count > 10) {
                    clearInterval(glitch);
                    line.style.transform = 'translate(0)';
                    line.style.textShadow = '';
                    line.style.animation = '';
                }
            }, 50);
        });
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Particle System
    const canvas = document.getElementById('particle-canvas');
    if (canvas) new ParticleSystem(canvas);

    // Typed greeting
    const greetingEl = document.getElementById('typedGreeting');
    if (greetingEl) {
        new TypeWriter(greetingEl, [
            '> Hello, World! I\'m',
            '> Welcome to my portfolio.',
            '> Let\'s build the future.',
            '> AI enthusiast & developer.'
        ], 70, 2200);
    }

    // All initializations
    initCursor();
    initNavbar();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initTilt();
    initContactForm();
    initSmoothScroll();
    initGlitchHover();

    // Page load animation
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    });
});
