document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. PRELOADER CON SALIDA FLUIDA
       ========================================================================= */
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
        }, 250);
    });

    // Fallback de seguridad si una imagen local tarda en responder
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
        }
    }, 2000);

    /* =========================================================================
       2. CURSOR ELÁSTICO (SOLO EN DISPOSITIVOS NO TÁCTILES)
       ========================================================================= */
    const dot = document.getElementById('cursorDot');
    const circle = document.getElementById('cursorCircle');

    if (dot && circle && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let circleX = mouseX;
        let circleY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        const animateCursor = () => {
            circleX += (mouseX - circleX) * 0.15;
            circleY += (mouseY - circleY) * 0.15;
            circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        const hoverTargets = document.querySelectorAll('a, button, input, textarea, .service-card-item, .project-editorial-card, .stage-flow-card');
        hoverTargets.forEach((el) => {
            el.addEventListener('mouseenter', () => circle.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => circle.classList.remove('cursor-hover'));
        });
    }

    /* =========================================================================
       3. BOTONES MAGNÉTICOS (DESKTOP)
       ========================================================================= */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const magneticButtons = document.querySelectorAll('.btn-magnetic');
        magneticButtons.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /* =========================================================================
       4. CABECERA INTELIGENTE (SMART GLASS NAV)
       ========================================================================= */
    const header = document.getElementById('mainHeader');
    let lastScrollY = window.pageYOffset;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;

        if (header) {
            if (currentScrollY > 50) {
                header.classList.add('nav-scrolled');
            } else {
                header.classList.remove('nav-scrolled');
            }

            if (currentScrollY > 250 && currentScrollY > lastScrollY) {
                header.classList.add('nav-hidden');
            } else {
                header.classList.remove('nav-hidden');
            }
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    /* =========================================================================
       5. MENÚ OFF-CANVAS RESPONSIVE
       ========================================================================= */
    const menuBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('drawerCloseBtn');
    const overlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const toggleDrawer = (open) => {
        if (!drawer) return;
        if (open) {
            drawer.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        } else {
            drawer.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', () => toggleDrawer(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));
    if (overlay) overlay.addEventListener('click', () => toggleDrawer(false));

    drawerLinks.forEach((link) => {
        link.addEventListener('click', () => toggleDrawer(false));
    });

    /* =========================================================================
       6. REVEAL AL HACER SCROLL (INTERSECTION OBSERVER)
       ========================================================================= */
    const revealTargets = document.querySelectorAll('.reveal-fade');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealTargets.forEach((target) => revealObserver.observe(target));

    /* =========================================================================
       7. CADENCIA: CONEXIÓN DINÁMICA DE PALABRAS POR SCROLL (STICKY PIN)
       ========================================================================= */
    const cadenceSection = document.getElementById('cadenceSection');
    const threadFill = document.getElementById('cadenceThreadFill');
    const threadHead = document.getElementById('cadenceThreadHead');
    const cadenceSteps = document.querySelectorAll('.cadence-interactive-step');
    const finalReveal = document.getElementById('cadenceFinalReveal');

    function updateCadenceProgress() {
        if (!cadenceSection || !threadFill) return;

        const rect = cadenceSection.getBoundingClientRect();
        const totalScrollable = cadenceSection.offsetHeight - window.innerHeight;

        if (totalScrollable <= 0) return;

        // Progreso normalizado de 0 a 1
        let progress = -rect.top / totalScrollable;
        progress = Math.max(0, Math.min(1, progress));

        const percentage = progress * 100;
        threadFill.style.height = `${percentage}%`;
        if (threadHead) threadHead.style.top = `${percentage}%`;

        // Umbrales para activar secuencialmente cada paso
        const activationThresholds = [0.08, 0.28, 0.50, 0.72];

        cadenceSteps.forEach((step, index) => {
            if (progress >= activationThresholds[index]) {
                step.classList.add('is-connected');
            } else {
                step.classList.remove('is-connected');
            }
        });

        // Activar el clímax final
        if (progress >= 0.88) {
            finalReveal.classList.add('is-active');
        } else {
            finalReveal.classList.remove('is-active');
        }
    }

    window.addEventListener('scroll', updateCadenceProgress, { passive: true });
    window.addEventListener('resize', updateCadenceProgress);
    window.addEventListener('orientationchange', updateCadenceProgress);
    updateCadenceProgress();

    /* =========================================================================
       8. SLIDER ANTES / DESPUÉS (RESPONSIVO Y TÁCTIL)
       ========================================================================= */
    const sliderBox = document.getElementById('touchSliderFrame');
    const clipArea = document.getElementById('sliderClipArea');
    const dividerHandle = document.getElementById('sliderDividerHandle');
    const beforeImg = document.getElementById('sliderBeforeImg');

    if (sliderBox && clipArea && dividerHandle && beforeImg) {
        let isDragging = false;

        const syncDimensions = () => {
            beforeImg.style.width = sliderBox.offsetWidth + 'px';
            beforeImg.style.maxWidth = sliderBox.offsetWidth + 'px';
        };

        syncDimensions();
        window.addEventListener('resize', syncDimensions);
        window.addEventListener('orientationchange', syncDimensions);

        const updatePosition = (clientX) => {
            const rect = sliderBox.getBoundingClientRect();
            let offsetX = clientX - rect.left;

            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;

            const percent = (offsetX / rect.width) * 100;
            clipArea.style.width = `${percent}%`;
            dividerHandle.style.left = `${percent}%`;
        };

        // Eventos Ratón
        dividerHandle.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        });

        // Eventos Táctiles Móviles (arrastre exclusivo en el handle para no bloquear el scroll)
        dividerHandle.addEventListener('touchstart', () => isDragging = true, { passive: true });
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (!isDragging || !e.touches.length) return;
            updatePosition(e.touches[0].clientX);
        }, { passive: true });
    }

    /* =========================================================================
       9. FORMULARIO ASÍNCRONO
       ========================================================================= */
    const contactForm = document.getElementById('agencyContactForm');
    const feedbackBox = document.getElementById('contactStatusMessage');

    if (contactForm && feedbackBox) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Procesando...</span>';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                feedbackBox.className = 'form-status-alert active-ok';
                feedbackBox.textContent = 'Mensaje recibido. Analizaremos tu espacio y nos pondremos en contacto contigo.';

                setTimeout(() => {
                    feedbackBox.style.display = 'none';
                }, 6000);
            }, 750);
        });
    }

});