// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Hero Section Animations
    animateHero();

    // Floating water drops
    createFloatingDrops();

    // Water ripple effect
    initWaterRipple();

    // Progress Bar
    initProgressBar();

    // Navigation Dots
    initNavDots();

    // Summary Section
    animateSummaryCards();
    animateCounters();

    // Water Accumulation
    initWaterAccumulation();

    // Regional Map
    initRegionalMap();

    // Data Flow
    animateDataFlow();

    // Comparative Filling
    initComparativeFilling();

    // Myth Buster
    initMythBuster();

    // Usage Calculator
    initUsageCalculator();

    // Solutions Timeline
    initSolutionsTimeline();

    // Form Submission
    initFormSubmission();

    // Social sharing
    initSocialSharing();

    initSolutions();
});

// Hero Section Animations
function animateHero() {
    const heroTimeline = gsap.timeline();

    heroTimeline
        .to('.hero__title', { opacity: 1, duration: 1, ease: "power2.out" })
        .to('.hero__subtitle', { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5")
        .to('.hero__statistic', { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5");
}

// Floating Water Drops
function createFloatingDrops() {
    const container = document.getElementById('floatingDrops');
    const dropCount = 15;

    if (!container) return;

    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';

        // Random size
        const size = Math.random() * 30 + 10;
        drop.style.setProperty('--size', `${size}px`);

        // Random opacity
        const opacity = Math.random() * 0.5 + 0.2;
        drop.style.setProperty('--opacity', opacity);

        // Initial position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        drop.style.setProperty('--x', `${x}%`);
        drop.style.setProperty('--y', `${y}%`);

        container.appendChild(drop);

        // Animation
        animateDrop(drop);
    }
}

function animateDrop(drop) {
    const newX = Math.random() * 100;
    const newY = Math.random() * 100;

    drop.style.setProperty('--x', `${newX}%`);
    drop.style.setProperty('--y', `${newY}%`);

    setTimeout(() => {
        animateDrop(drop);
    }, 3000 + Math.random() * 2000);
}

// Water Ripple Effect
function initWaterRipple() {
    const ripple = document.getElementById('waterRipple');

    if (!ripple) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY / window.innerHeight * 100;

        ripple.style.setProperty('--x', `${x}%`);
        ripple.style.setProperty('--y', `${y}%`);
    });
}

// Progress Bar
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');

    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        progressBar.style.width = scrollPercentage + '%';

        // Update active section in nav dots
        updateActiveSection(scrollTop + clientHeight / 2);
    });
}

// Navigation Dots
function initNavDots() {
    const navDots = document.querySelectorAll('.nav-dot');

    if (navDots.length === 0) return;

    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionId = dot.getAttribute('data-section');
            const section = document.getElementById(sectionId);

            if (section) {
                window.scrollTo({
                    top: section.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveSection(scrollPosition) {
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot');

    if (sections.length === 0 || navDots.length === 0) return;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            navDots.forEach(dot => {
                dot.classList.remove('active');
            });

            const activeDot = document.querySelector(`.nav-dot[data-section="${section.id}"]`);
            if (activeDot) {
                activeDot.classList.add('active');
            }
        }
    });
}

// Summary Cards Animation
function animateSummaryCards() {
    const summaryCards = gsap.utils.toArray('.summary-card');

    if (summaryCards.length === 0) return;

    summaryCards.forEach(card => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// Animate Counters
function animateCounters() {
    // Check if CountUp is available
    if (typeof CountUp === 'undefined') {
        fallbackCounters();
        return;
    }

    try {
        // Daily Consumption Counter
        const dailyConsumptionEl = document.getElementById('dailyConsumptionValue');
        if (dailyConsumptionEl) {
            const dailyConsumption = new CountUp('dailyConsumptionValue', 0, 500000, 0, 2.5, {
                separator: ',',
                useEasing: true
            });

            ScrollTrigger.create({
                trigger: '#dailyConsumptionValue',
                start: "top 80%",
                onEnter: () => dailyConsumption.start()
            });
        }

        // Per Query Counter
        const perQueryEl = document.getElementById('perQueryValue');
        if (perQueryEl) {
            const perQuery = new CountUp('perQueryValue', 0, 20, 0, 2, {
                useEasing: true
            });

            ScrollTrigger.create({
                trigger: '#perQueryValue',
                start: "top 80%",
                onEnter: () => perQuery.start()
            });
        }
    } catch (e) {
        console.warn("CountUp initialization error:", e);
        fallbackCounters();
    }
}

// Fallback animation if CountUp is not available
function fallbackCounters() {
    // Daily Consumption Counter
    const dailyConsumptionEl = document.getElementById('dailyConsumptionValue');
    if (dailyConsumptionEl) {
        const finalDailyValue = 500000;

        gsap.to({ value: 0 }, {
            value: finalDailyValue,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: dailyConsumptionEl,
                start: "top 80%"
            },
            onUpdate: function () {
                const formattedValue = Math.round(this.targets()[0].value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                dailyConsumptionEl.textContent = formattedValue;
            }
        });
    }

    // Per Query Counter
    const perQueryEl = document.getElementById('perQueryValue');
    if (perQueryEl) {
        const finalQueryValue = 20;

        gsap.to({ value: 0 }, {
            value: finalQueryValue,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: perQueryEl,
                start: "top 80%"
            },
            onUpdate: function () {
                perQueryEl.textContent = Math.round(this.targets()[0].value);
            }
        });
    }
}

// Water Accumulation Visualization
function initWaterAccumulation() {
    const waterBody = document.querySelector('.water-body');
    const mlCounter = document.querySelector('.ml-counter');
    const promptInput = document.getElementById('promptInput');
    const submitButton = document.getElementById('submitPrompt');

    if (!waterBody || !mlCounter || !promptInput || !submitButton) return;

    submitButton.addEventListener('click', () => {
        const prompt = promptInput.value.trim();

        if (prompt.length === 0) return;

        // Calculate water usage based on prompt length
        const promptLength = prompt.length;
        let waterUsage = 0;

        if (promptLength < 20) {
            waterUsage = 15;
        } else if (promptLength < 100) {
            waterUsage = 20;
        } else {
            waterUsage = 30;
        }

        // Update water level (maximum 100%)
        const waterHeight = Math.min((waterUsage / 100) * 100, 100);
        waterBody.style.height = `${waterHeight}%`;

        // Update counter
        mlCounter.textContent = `${waterUsage} ml`;

        // Clear input
        promptInput.value = '';
    });

    // FIXED: Replace scrub animation with a one-time animation that stays visible
    ScrollTrigger.create({
        trigger: '.water-accumulation',
        start: "top 70%",
        once: true,
        onEnter: function () {
            // Animate to 50% water level (initial state)
            gsap.to(waterBody, {
                height: '20%',
                duration: 1.5,
                ease: "power2.out"
            });

            // Update counter
            mlCounter.textContent = '10 ml';
        }
    });
}

// Regional Map
function initRegionalMap() {
    const regions = document.querySelectorAll('.region');
    const regionData = document.querySelectorAll('.region-data');

    if (regions.length === 0) return;

    regions.forEach(region => {
        region.addEventListener('click', () => {
            const regionName = region.getAttribute('data-region');

            // Highlight active region
            regions.forEach(r => r.classList.remove('active'));
            region.classList.add('active');

            // Show corresponding data
            regionData.forEach(data => data.classList.remove('active'));
            const targetData = document.getElementById(`region${regionName.charAt(0).toUpperCase() + regionName.slice(1)}`);
            if (targetData) {
                targetData.classList.add('active');
            }
        });
    });

    // Add water drops animation
    animateWaterDrops();
}

function animateWaterDrops() {
    const mapContainer = document.getElementById('worldMap');

    if (!mapContainer) return;

    const dropCount = 20;

    // Remove existing drops
    const existingDrops = document.querySelectorAll('.water-drop');
    existingDrops.forEach(drop => drop.remove());

    // Create new drops
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'water-drop';

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        drop.style.left = `${x}%`;
        drop.style.top = `${y}%`;

        mapContainer.appendChild(drop);

        // Animation
        gsap.from(drop, {
            scale: 0,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "elastic.out(1, 0.5)"
        });
    }
}

// Data Flow Animation
function animateDataFlow() {
    // Animate SVG paths
    const flowPaths = gsap.utils.toArray('.flow-path');

    if (flowPaths.length === 0) return;

    flowPaths.forEach(path => {
        const length = path.getTotalLength();

        // Set up initial state
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        // Animate path drawing
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.5, // Faster animation
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: '.flow-diagram',
                start: "top 70%",
                end: "center 30%",
                scrub: 0.3 // More responsive scrubbing
            }
        });
    });

    // Add water particles animation
    animateWaterParticles();
}

function animateWaterParticles() {
    const flowDiagram = document.getElementById('flowDiagram');

    if (!flowDiagram) return;

    const particleCount = 50; // Increased particle count

    // Remove any existing particles first
    const existingParticles = flowDiagram.querySelectorAll('.water-particle');
    existingParticles.forEach(particle => particle.remove());

    // Define paths for particles to follow
    const paths = document.querySelectorAll('.flow-path');

    if (paths.length === 0) return;

    // Create particles for each path
    paths.forEach(path => {
        // Create multiple particles for each path
        for (let i = 0; i < particleCount / paths.length; i++) {
            const particle = document.createElement('div');
            particle.className = 'water-particle';

            // Randomize particle size for more natural look
            const size = 4 + Math.random() * 6;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Randomize opacity
            particle.style.opacity = 0.4 + Math.random() * 0.4;

            flowDiagram.appendChild(particle);

            // Get random position along the path
            const startPosition = Math.random();

            // Animation speed based on path (user to datacenter faster than datacenter to power)
            let duration = 1 + Math.random();
            if (path.id === 'path3' || path.id === 'path4') {
                duration = 2 + Math.random();
            }

            // Create animation
            gsap.fromTo(
                particle,
                {
                    motionPath: {
                        path: path,
                        align: path,
                        alignOrigin: [0.5, 0.5],
                        autoRotate: false,
                        start: startPosition,
                        end: startPosition
                    }
                },
                {
                    motionPath: {
                        path: path,
                        align: path,
                        alignOrigin: [0.5, 0.5],
                        autoRotate: false,
                        start: startPosition,
                        end: 1
                    },
                    duration: duration,
                    delay: Math.random() * 2,
                    repeat: -1,
                    ease: "none",
                    onRepeat: function () {
                        // Reset to random start position on repeat
                        const newStartPos = Math.random();
                        gsap.set(particle, {
                            motionPath: {
                                path: path,
                                align: path,
                                alignOrigin: [0.5, 0.5],
                                autoRotate: false,
                                start: newStartPos,
                                end: newStartPos
                            }
                        });
                    }
                }
            );
        }
    });
}

// Comparative Filling
function initComparativeFilling() {
    const container1 = document.getElementById('water1');
    const container2 = document.getElementById('water2');
    const container3 = document.getElementById('water3');

    if (!container1 || !container2 || !container3) return;

    // FIXED: Replace scrub animation with a one-time animation that stays visible
    ScrollTrigger.create({
        trigger: '.comparative-filling',
        start: "top 70%",
        once: true,
        onEnter: function () {
            // Animate containers to their initial values
            gsap.to(container1, { height: '90%', duration: 1.5, ease: "power2.out" });
            gsap.to(container2, { height: '30%', duration: 1.5, ease: "power2.out" });
            gsap.to(container3, { height: '5%', duration: 1.5, ease: "power2.out" });
        }
    });

    // Technology selection
    const techButtons = document.querySelectorAll('.technology-btn');

    if (techButtons.length === 0) return;

    techButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tech = button.getAttribute('data-tech');

            // Update active button
            techButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update water levels based on selected technology
            // Faster transition - reduced from 1s to 0.3s
            if (tech === 'hot') {
                gsap.to(container1, { height: '95%', duration: 0.3 });
                gsap.to(container2, { height: '50%', duration: 0.3 });
                gsap.to(container3, { height: '15%', duration: 0.3 });
            } else if (tech === 'cool') {
                gsap.to(container1, { height: '50%', duration: 0.3 });
                gsap.to(container2, { height: '15%', duration: 0.3 });
                gsap.to(container3, { height: '2%', duration: 0.3 });
            } else {
                gsap.to(container1, { height: '90%', duration: 0.3 });
                gsap.to(container2, { height: '30%', duration: 0.3 });
                gsap.to(container3, { height: '5%', duration: 0.3 });
            }
        });
    });
}

// Myth Buster
function initMythBuster() {
    const mythCards = document.querySelectorAll('.myth-card');

    if (mythCards.length === 0) return;

    mythCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });

        // Scroll animation
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// Usage Calculator
function initUsageCalculator() {
    const promptSlider = document.getElementById('promptSlider');
    const promptValue = document.getElementById('promptValue');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');

    const dailyUsageValue = document.getElementById('dailyUsageValue');
    const bottleValue = document.getElementById('bottleValue');
    const annualValue = document.getElementById('annualValue');

    const calculatorWater = document.getElementById('calculatorWater');

    if (!promptSlider || !promptValue || !lengthSlider || !lengthValue ||
        !dailyUsageValue || !bottleValue || !annualValue || !calculatorWater) return;

    // Initialize values
    updateCalculator();

    // Event listeners
    promptSlider.addEventListener('input', updateCalculator);
    lengthSlider.addEventListener('input', updateCalculator);

    function updateCalculator() {
        const prompts = parseInt(promptSlider.value);
        promptValue.textContent = prompts;

        let lengthText = 'Medium';
        let lengthMultiplier = 1;

        switch (parseInt(lengthSlider.value)) {
            case 1:
                lengthText = 'Short';
                lengthMultiplier = 0.7;
                break;
            case 2:
                lengthText = 'Medium';
                lengthMultiplier = 1;
                break;
            case 3:
                lengthText = 'Long';
                lengthMultiplier = 1.5;
                break;
        }

        lengthValue.textContent = lengthText;

        // Calculate water usage
        const mlPerPrompt = 20 * lengthMultiplier;
        const dailyUsage = prompts * mlPerPrompt;
        const annualUsage = dailyUsage * 365 / 1000; // In liters

        // Update display
        dailyUsageValue.textContent = `${dailyUsage.toFixed(0)} ml`;
        bottleValue.textContent = `${(dailyUsage / 500).toFixed(1)} water bottles`;
        annualValue.textContent = `${annualUsage.toFixed(1)} liters`;

        // Update water level (max 100%)
        const percentage = Math.min((dailyUsage / 1000) * 100, 100);
        calculatorWater.style.height = `${percentage}%`;
    }
}

function initSolutions() {
    const droplets = document.querySelectorAll('.droplet');
    const solutionContents = document.querySelectorAll('.solution-content');

    if (droplets.length === 0 || solutionContents.length === 0) return;

    // Add click event to droplets
    droplets.forEach(droplet => {
        droplet.addEventListener('click', () => {
            const solutionId = droplet.getAttribute('data-solution');

            // Update active droplet
            droplets.forEach(d => d.classList.remove('active'));
            droplet.classList.add('active');

            // Show corresponding content with animation
            solutionContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = 0;
                content.style.transform = 'translateY(20px)';
            });

            const activeContent = document.getElementById(`solution-${solutionId}`);
            if (activeContent) {
                activeContent.classList.add('active');
                // Short delay to ensure CSS transition works
                setTimeout(() => {
                    activeContent.style.opacity = 1;
                    activeContent.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });

    // Initialize with animation when scrolled into view
    ScrollTrigger.create({
        trigger: '.solutions',
        start: "top 60%",
        once: true,
        onEnter: () => {
            // Animate droplets one by one
            droplets.forEach((droplet, index) => {
                gsap.from(droplet, {
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: "back.out(1.7)"
                });
            });

            // Show first solution content
            const firstContent = document.getElementById('solution-geo-location');
            if (firstContent) {
                firstContent.classList.add('active');
                gsap.to(firstContent, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.5
                });
            }
        }
    });
}

// Solutions Timeline
function initSolutionsTimeline() {
    const timelineProgress = document.getElementById('timelineProgress');
    const timelinePoints = document.querySelectorAll('.timeline-point');
    const solutionCards = document.querySelectorAll('.solution-card');
    const prevButton = document.getElementById('prevSolution');
    const nextButton = document.getElementById('nextSolution');

    if (!timelineProgress || timelinePoints.length === 0 ||
        solutionCards.length === 0 || !prevButton || !nextButton) return;

    let currentIndex = 0;
    const totalSolutions = timelinePoints.length;

    // Function to show a specific solution
    function showSolution(index) {
        // Constrain the index
        if (index < 0) index = 0;
        if (index >= totalSolutions) index = totalSolutions - 1;

        currentIndex = index;

        // Update active point
        timelinePoints.forEach((point, i) => {
            point.classList.toggle('active', i === index);
        });

        // Update progress bar (percentage based on index)
        const progress = (index / (totalSolutions - 1)) * 100;
        gsap.to(timelineProgress, {
            width: `${progress}%`,
            duration: 0.3,
            ease: "power1.inOut"
        });

        // Show corresponding solution card with animation
        solutionCards.forEach((card, i) => {
            const isActive = i === index;

            // If this card should be active
            if (isActive && !card.classList.contains('active')) {
                // Hide all cards first
                solutionCards.forEach(c => c.classList.remove('active'));

                // Make this one active with fade animation
                card.style.opacity = 0;
                card.classList.add('active');
                gsap.to(card, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power1.inOut"
                });
            }
        });

        // Update button states
        prevButton.disabled = index === 0;
        nextButton.disabled = index === totalSolutions - 1;

        // Add visual indication for disabled buttons
        prevButton.style.opacity = index === 0 ? 0.5 : 1;
        nextButton.style.opacity = index === totalSolutions - 1 ? 0.5 : 1;
    }

    // Force display of first solution when scrolled into view
    ScrollTrigger.create({
        trigger: '.solutions',
        start: "top 60%",
        once: true,
        onEnter: () => {
            // Explicitly set the first solution card to visible
            const firstCard = document.getElementById('solution-geo-location');
            if (firstCard) {
                solutionCards.forEach(card => {
                    card.classList.remove('active');
                    card.style.opacity = 0;
                });

                firstCard.classList.add('active');
                gsap.to(firstCard, {
                    opacity: 1,
                    duration: 0.5
                });
            }

            // Set progress bar to first point
            gsap.to(timelineProgress, {
                width: '0%',
                duration: 0.3
            });

            // Update active point
            timelinePoints.forEach((point, i) => {
                point.classList.toggle('active', i === 0);
            });
        }
    });

    // Timeline point click handlers
    timelinePoints.forEach((point) => {
        point.addEventListener('click', () => {
            const index = parseInt(point.getAttribute('data-index'));
            showSolution(index);
        });
    });

    // Previous/Next button handlers
    prevButton.addEventListener('click', () => {
        showSolution(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        showSolution(currentIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle keys when solutions section is in viewport
        const solutionsSection = document.querySelector('.solutions');
        if (!solutionsSection) return;

        const rect = solutionsSection.getBoundingClientRect();
        const isInViewport = (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );

        if (isInViewport) {
            if (e.key === 'ArrowLeft') {
                showSolution(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showSolution(currentIndex + 1);
            }
        }
    });

    // Initial animations for points
    gsap.from(timelinePoints, {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.solutions-timeline',
            start: "top 70%"
        }
    });

    // Initial animation for arrow buttons
    gsap.from([prevButton, nextButton], {
        opacity: 0,
        x: function (i) { return i === 0 ? -20 : 20; },
        duration: 0.5,
        delay: 0.3,
        scrollTrigger: {
            trigger: '.solutions-timeline',
            start: "top 70%"
        }
    });
}

// Social sharing
function initSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-button');

    if (shareButtons.length === 0) return;

    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            let shareUrl = encodeURIComponent(window.location.href);
            let shareTitle = encodeURIComponent("ChatGPT's Global Water Footprint - Interactive Whitepaper");
            let shareText = encodeURIComponent("Every ChatGPT query uses ~20ml of water. Learn about AI's impact on water resources.");
            let url = '';

            if (button.classList.contains('share-linkedin')) {
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
            } else if (button.classList.contains('share-twitter')) {
                url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
            } else if (button.classList.contains('share-facebook')) {
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
            }

            if (url) {
                window.open(url, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Form submission handling
function initFormSubmission() {
    const newsletterForm = document.getElementById('newsletterForm');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        const submitButton = newsletterForm.querySelector('.form-submit');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        setTimeout(() => {
            alert('Thank you for subscribing to our newsletter!');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            newsletterForm.reset();
        }, 1500);
    });
}

// Animate references section
document.addEventListener('DOMContentLoaded', function () {
    animateReferences();
});

function animateReferences() {
    const referenceItems = document.querySelectorAll('.reference-item');

    if (referenceItems.length === 0) return;

    referenceItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: item,
                start: "top 90%"
            }
        });
    });
}

// Animate methodology section
document.addEventListener('DOMContentLoaded', function () {
    animateMethodology();
});

function animateMethodology() {
    const methodologyCards = document.querySelectorAll('.methodology-card');

    if (methodologyCards.length === 0) return;

    methodologyCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.15,
            scrollTrigger: {
                trigger: card,
                start: "top 85%"
            }
        });
    });

    // Animate the formula
    const formula = document.querySelector('.formula');
    if (formula) {
        gsap.from(formula, {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: 0.5,
            scrollTrigger: {
                trigger: formula,
                start: "top 85%"
            }
        });
    }
}