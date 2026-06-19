gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // ============================================================
    // 1. HERO INTRO ANIMATION TIMELINE
    // ============================================================
    gsap.set("#nav", { opacity: 0, y: -20 });
    gsap.set(".main-title .word > span", { y: "105%" });
    gsap.set("#subline", { opacity: 0, y: 20 });

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    intro
      .to("#nav", { opacity: 1, y: 0, duration: 0.8 }, 0.2)
      .to(".main-title .word > span", { y: "0%", duration: 0.9, stagger: 0.1 }, 0.4)
      .to("#subline", { opacity: 1, y: 0, duration: 0.8 }, 1.0);

    // ============================================================
    // 2. SCROLL REVEAL ANIMATIONS FOR ALL SECTIONS
    // ============================================================
    const revealElements = document.querySelectorAll(".gs-reveal");
    
    revealElements.forEach((elem) => {
        gsap.fromTo(elem, 
            { opacity: 0, y: 50 }, 
            {
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }
        );
    });

    // ============================================================
    // 3. 3D HOVER TILT EFFECT FOR INHERITANCE CARDS
    // ============================================================
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            
            gsap.to(card, {
                rotateX: -py * 20, 
                rotateY: px * 20,
                scale: 1.05,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 1000,
                overwrite: "auto"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.6)",
                overwrite: "auto"
            });
        });
    });

    // ============================================================
    // 4. STAGGERED FADE-IN ANIMATION FOR INHERITANCE CARDS
    // ============================================================
    const cards = document.querySelectorAll('.type-card');
    cards.forEach(card => card.classList.add('fade-in-hidden'));

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cardArray = Array.from(document.querySelectorAll('.type-card'));
                const index = cardArray.indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('fade-in-visible');
                }, index * 200);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => cardObserver.observe(card));

    // ============================================================
    // 5. CHART.JS GRAPH ANIMATION WITH 30-YEAR DATASET
    // ============================================================
    const chartCanvas = document.getElementById('ageChart');
    let chartRendered = false;

    ScrollTrigger.create({
        trigger: ".stats-inner",
        start: "top 75%",
        onEnter: () => {
            if (!chartRendered) {
                drawChart();
                chartRendered = true;
            }
        }
    });

    function drawChart() {
        const ctx = chartCanvas.getContext('2d');
        Chart.defaults.color = 'rgba(255, 255, 255, 0.8)'; 
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

        const maternalAges = [
            '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
            '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
            '40', '41', '42', '43', '44', '45', '46', '47', '48', '49'
        ];
        
        const birthOdds = [
            2000, 1700, 1500, 1400, 1300, 1200, 1100, 1050, 1000, 950,
            900, 800, 720, 600, 450, 350, 300, 250, 200, 150,
            100, 80, 70, 50, 40, 30, 25, 20, 15, 10
        ];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: maternalAges.map(age => age + ' yrs'),
                datasets: [{
                    label: 'Live births per ONE incidence',
                    data: birthOdds,
                    backgroundColor: '#3498DB', 
                    hoverBackgroundColor: '#85C1E9',
                    borderRadius: 4,
                    barPercentage: 0.85
                }]
            },
            options: {
                indexAxis: 'y', 
                responsive: true,
                maintainAspectRatio: false, 
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart',
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 40; 
                        }
                        return delay;
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Incidence of Down Syndrome by Maternal Age',
                        color: '#3498DB',
                        font: { size: 20, family: "'DM Sans', sans-serif", weight: 'bold' },
                        padding: { bottom: 20 }
                    },
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff', font: { size: 14 } }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Live Births (1 in X)', color: '#fff' }
                    },
                    y: {
                        title: { display: true, text: "Mother's Age", color: '#fff' },
                        ticks: { 
                            autoSkip: false,
                            font: { size: 11 } 
                        } 
                    }
                }
            }
        });
    }
});