document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. PRELOADER SUAVE
       ========================================================================= */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
        }, 300);
    });

    /* =========================================================================
       2. CURSOR ELÁSTICO ESTILO AGENCIA (LERP)
       ========================================================================= */
    const dot = document.getElementById('cursorDot');
    const circle = document.getElementById('cursorCircle');

    if (dot && circle && window.matchMedia('(pointer: fine)').matches) {
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

        const hoverables = document.querySelectorAll('a, button, input, textarea, .service-card-item, .project-editorial-card');
        hoverables.forEach((el) => {
            el.addEventListener('mouseenter', () => circle.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => circle.classList.remove('cursor-hover'));
        });
    }

    /* =========================================================================
       3. MENÚ LATERAL RESPONSIVE (OFF-CANVAS)
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
       4. ANIMACIONES CON SCROLL (INTERSECTION OBSERVER)
       ========================================================================= */
    const revealTargets = document.querySelectorAll('.reveal-fade');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach((target) => revealObserver.observe(target));

    /* =========================================================================
       5. SLIDER ANTES / DESPUÉS (TOUCH & MOUSE)
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

        const updatePosition = (clientX) => {
            const rect = sliderBox.getBoundingClientRect();
            let offsetX = clientX - rect.left;

            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;

            const percent = (offsetX / rect.width) * 100;
            clipArea.style.width = `${percent}%`;
            dividerHandle.style.left = `${percent}%`;
        };

        // Mouse Events
        dividerHandle.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        });

        // Touch Events
        dividerHandle.addEventListener('touchstart', () => isDragging = true, { passive: true });
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (!isDragging || !e.touches.length) return;
            updatePosition(e.touches[0].clientX);
        }, { passive: true });
    }

    /* =========================================================================
       6. FORMULARIO ASÍNCRONO
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
            }, 800);
        });
    }

});