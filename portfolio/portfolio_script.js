// Particle.js config
particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        color: { value: ["#7f5af0", "#2cb67d", "#ff7edb"] },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    },
    retina_detect: true
});

// GSAP Animations
gsap.from(".navbar", {
    y: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
});

gsap.from(".project-card", {
    scrollTrigger: {
        trigger: ".project-card",
        start: "top center"
    },
    x: -100,
    opacity: 0,
    stagger: 0.2,
    duration: 1
});

// Dynamic Gradient Background
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    document.documentElement.style.setProperty('--primary',
        `hsl(${x * 360}, 70%, 60%)`);
    document.documentElement.style.setProperty('--secondary',
        `hsl(${y * 360}, 70%, 60%)`);
});

// Form Validation with Anime.js
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
        if (input.checkValidity()) {
            anime({
                targets: input,
                borderColor: '#2cb67d',
                boxShadow: '0 0 20px rgba(44, 182, 125, 0.3)',
                duration: 500
            });
        } else {
            anime({
                targets: input,
                borderColor: '#ff7edb',
                boxShadow: '0 0 20px rgba(255, 126, 219, 0.3)',
                duration: 500
            });
        }
    });
});