// script.js - Final Polish & 3D Effects

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Expand cursor on hoverables
    const hoverables = document.querySelectorAll('a, .tilt-card, .dock-item, .btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 3, opacity: 0.15 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, opacity: 1 });
        });
    });

    // 4. 3D Tilt & Magnetic Glow Logic
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Magnetic Glow Variables
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20; // More subtle tilt
            const rotateY = (centerX - x) / 20; // More subtle tilt

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    // 5. Liquid Background Canvas Logic
    const canvas = document.getElementById('liquid-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let blobs = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Blob {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 500 + 400;
                this.color = this.getRandomColor();
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
            }

            getRandomColor() {
                const colors = ['#3b82f6', '#a855f7', '#1e1b4b', '#0f172a'];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < -this.size) this.x = width + this.size;
                if (this.x > width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = height + this.size;
                if (this.y > height + this.size) this.y = -this.size;
            }

            draw() {
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initBlobs() {
            resize();
            blobs = [];
            for (let i = 0; i < 6; i++) blobs.push(new Blob());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            blobs.forEach(b => { b.update(); b.draw(); });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        initBlobs();
        animate();
    }

    // 6. GSAP Reveal & Scroll Interactions
    gsap.registerPlugin(ScrollTrigger);

    // Initial Reveal - Delayed for Skeleton
    const mainReveal = () => {
        document.body.classList.remove('loading-state');

        gsap.from(".reveal-text", {
            y: 40, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.15
        });

        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const staggerItems = section.querySelectorAll('.stagger-item');
            if (staggerItems.length > 0) {
                gsap.from(staggerItems, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    y: 30, opacity: 0, duration: 1, ease: "power2.out", stagger: 0.1
                });
            }
        });
    };

    // Simulate loading for skeleton
    setTimeout(mainReveal, 1500);

    // Scroll Progress & Active Section Highlighting
    lenis.on('scroll', (e) => {
        // 1. Progress Bar
        const scrolled = (e.scroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.getElementById("scroll-progress").style.height = scrolled + "%";

        // 2. Active Section Highlighting (Scroll Spy)
        const sections = document.querySelectorAll('.section');
        const scrollPos = e.scroll + window.innerHeight / 3;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.dock-item').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // 7. Click to Copy Functionality
    const copyBtn = document.querySelector('.click-to-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const email = copyBtn.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                const badge = copyBtn.querySelector('.copy-success');
                badge.classList.add('active');
                setTimeout(() => badge.classList.remove('active'), 2000);
            });
        });
    }

    // 8. Dock Interaction
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            lenis.scrollTo(targetId, { duration: 1.5 });
        });
    });

    // 9. Terminal Typing Effect
    const terminalLines = [
        "Initializing secure sequence...",
        "Scanning for vulnerabilities...",
        "Bypassing firewall [OK]",
        "System check: MERN Stack active",
        "Cybersecurity protocols: ENABLED",
        "Saraswathidevi's log: v2.0.25 Ready."
    ];
    let lineIndex = 0;
    let charIndex = 0;
    const terminalContent = document.getElementById("terminal-content");

    function typeTerminal() {
        if (lineIndex < terminalLines.length) {
            const currentLine = terminalLines[lineIndex];
            if (charIndex < currentLine.length) {
                terminalContent.innerHTML += currentLine[charIndex];
                charIndex++;
                setTimeout(typeTerminal, 40);
            } else {
                terminalContent.innerHTML += "<br>";
                charIndex = 0;
                lineIndex++;
                setTimeout(typeTerminal, 1000);
            }
        } else {
            // Optional: Restart terminal after a delay
            setTimeout(() => {
                terminalContent.innerHTML = "";
                lineIndex = 0;
                charIndex = 0;
                typeTerminal();
            }, 5000);
        }
    }
    if (terminalContent) typeTerminal();

    // 10. Project Modal Logic
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-description");
    const modalTags = document.getElementById("modal-tags");
    const modalLink = document.getElementById("modal-link");
    const modalClose = document.querySelector(".modal-close");

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            const title = card.getAttribute("data-title");
            const desc = card.getAttribute("data-description");
            const tags = card.getAttribute("data-tags") ? card.getAttribute("data-tags").split(",") : [];
            const link = card.getAttribute("data-link");

            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.textContent = desc;
            if (modalLink) modalLink.setAttribute("href", link);

            if (modalTags) {
                modalTags.innerHTML = "";
                tags.forEach(tag => {
                    const span = document.createElement("span");
                    span.className = "exp-tag";
                    span.textContent = tag.trim();
                    modalTags.appendChild(span);
                });
            }

            if (modal) modal.classList.add("active");
            if (typeof lenis !== 'undefined') lenis.stop();
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", () => {
            modal.classList.remove("active");
            if (typeof lenis !== 'undefined') lenis.start();
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
                if (typeof lenis !== 'undefined') lenis.start();
            }
        });
    }

});
