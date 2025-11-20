/* ============================================================
   GSAP + SCROLLTRIGGER REGISTRATION
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);


/* ============================================================
   PRELOADER REMOVAL
   ============================================================ */

window.addEventListener("load", () => {
    gsap.to("#preloader", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
            document.querySelector("#preloader").style.display = "none";
        }
    });
});


/* ============================================================
   NAVBAR FADE-IN ON LOAD
   ============================================================ */

gsap.from(".navbar", {
    opacity: 0,
    y: -20,
    duration: 1.2,
    ease: "power2.out",
    delay: 0.3
});


/* ============================================================
   HERO — PARALLAX LAYERS
   ============================================================ */

gsap.to(".hero-bg", {
    scale: 1.05,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom center",
        scrub: true
    }
});

gsap.to(".hero-energy", {
    y: -60,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom center",
        scrub: true
    }
});

gsap.to(".hero-coin", {
    y: -80,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom center",
        scrub: true
    }
});


/* ============================================================
   SECTION 2 — SOLAR CYCLE (DAY → MONEY → NIGHT)
   ============================================================ */

let scTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#solarCycle",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// Layer fades
scTimeline
    // DAY fade-in
    .to(".layer-day", { opacity: 1, duration: 1 })
    .to(".layer-day", { opacity: 0, duration: 1.2 })

    // MONEY fade-in
    .to(".layer-money", { opacity: 1, duration: 1 })
    .to(".layer-money", { opacity: 0, duration: 1.2 })

    // NIGHT fade-in
    .to(".layer-night", { opacity: 1, duration: 1 });


/* ============================================================
   MONEY PARTICLE EMITTER
   ============================================================ */

function spawnMoneyParticles() {
    const container = document.getElementById("moneyParticles");

    for (let i = 0; i < 12; i++) {
        let coin = document.createElement("img");
        coin.src = "assets/coin_light.jpg";
        coin.classList.add("coinParticle");
        container.appendChild(coin);

        // Random motion
        gsap.fromTo(coin,
            {
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0.4
            },
            {
                opacity: 1,
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 500,
                rotation: Math.random() * 360,
                scale: 0.6 + Math.random() * 0.4,
                duration: 2.4,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".layer-money",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1
                }
            }
        );
    }
}

// Trigger particle generation only once
ScrollTrigger.create({
    trigger: ".layer-money",
    start: "top 70%",
    once: true,
    onEnter: spawnMoneyParticles
});

/* ============================================================
   SECTION 3 — MISSION (Fade-ups + Chart Growth)
   ============================================================ */

/* Reveal each mission block on scroll */
gsap.utils.toArray(".mission-block").forEach((block, i) => {
    gsap.to(block, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.1 * i,
        scrollTrigger: {
            trigger: block,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
});

/* Animate chart bars */
gsap.to(".bar1", {
    scaleY: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".block-problem",
        start: "top 75%"
    }
});
gsap.to(".bar2", {
    scaleY: 1,
    duration: 1.2,
    delay: 0.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".block-problem",
        start: "top 75%"
    }
});
gsap.to(".bar3", {
    scaleY: 1,
    duration: 1.2,
    delay: 0.4,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".block-problem",
        start: "top 75%"
    }
});


/* ============================================================
   SECTION 4 — DASHBOARD REVEALS
   ============================================================ */

/* Device card slides up */
gsap.to(".dashboard-device", {
    opacity: 1,
    y: 0,
    duration: 1.4,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".dashboard-section",
        start: "top 70%"
    }
});

/* ============================================================
   REAL-TIME COUNTERS (kWh, Savings, CO₂)
   ============================================================ */

function animateCounter(id, start, end, suffix, duration = 2) {
    let obj = { value: start };
    gsap.to(obj, {
        value: end,
        duration: duration,
        ease: "power2.out",
        onUpdate: () => {
            document.getElementById(id).textContent =
                obj.value.toFixed(1) + suffix;
        }
    });
}

ScrollTrigger.create({
    trigger: ".dashboard-device",
    start: "top 80%",
    once: true,
    onEnter: () => {
        animateCounter("kwhCounter", 0, 18.4, " kWh", 2.2);
        animateCounter("savingsCounter", 0, 4820, "৳", 2.4);
        animateCounter("co2Counter", 0, 126, " kg", 2.6);
    }
});


/* ============================================================
   SOLAR GRAPH — SVG LINE ANIMATION
   ============================================================ */

const solarPath = document.querySelector("#solarCurve");
if (solarPath) {
    const length = solarPath.getTotalLength();

    solarPath.style.strokeDasharray = length;
    solarPath.style.strokeDashoffset = length;

    gsap.to(solarPath, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".dashboard-device",
            start: "top 75%",
            once: true
        }
    });
}

/* ============================================================
   SECTION 5 — EMI CALCULATOR LOGIC + ANIMATIONS
   ============================================================ */

/* DOM References */
const kwSlider = document.getElementById("kwSlider");
const monthsSlider = document.getElementById("monthsSlider");
const emiValue = document.getElementById("emiValue");

function calculateEMI() {
    const kw = Number(kwSlider.value);
    const months = Number(monthsSlider.value);

    // Approx system cost by kW (Bangladesh realistic rates)
    const costPerKw = 85000; // ৳85,000 per kW
    const totalCost = kw * costPerKw;

    // Monthly EMI formula (flat simple approximation)
    const monthlyInterest = 0.009; // ~10.8% yearly
    const emi = (totalCost * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));

    // Animate EMI number
    gsap.to({ val: 0 }, {
        val: emi,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: function () {
            emiValue.textContent = "৳ " + Math.floor(this.targets()[0].val).toLocaleString();
        }
    });

    animateEmiCurve();
}

/* Update EMI whenever sliders move */
kwSlider.addEventListener("input", calculateEMI);
monthsSlider.addEventListener("input", calculateEMI);


/* ============================================================
   EMI CURVE — Smooth SVG Wave Animation
   ============================================================ */

function animateEmiCurve() {
    const emiCurve = document.querySelector("#emiCurve");
    if (!emiCurve) return;

    const len = emiCurve.getTotalLength();
    emiCurve.style.strokeDasharray = len;
    emiCurve.style.strokeDashoffset = len;

    gsap.to(emiCurve, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out"
    });
}


/* Fire EMI calculation when section becomes visible */
ScrollTrigger.create({
    trigger: ".financing-section",
    start: "top 80%",
    once: true,
    onEnter: calculateEMI
});


/* ============================================================
   SECTION 6 — INSTALLATION TIMELINE REVEAL
   ============================================================ */

gsap.utils.toArray(".install-step").forEach((card, i) => {
    gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: card,
            start: "top 85%"
        }
    });
});

/* Progress line slight glowing pulse */
gsap.to(".install-progress-line", {
    opacity: 0.8,
    duration: 1.6,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

/* ============================================================
   SECTION 7 — FINAL CTA (Fade-up + Parallax)
   ============================================================ */

/* Fade up the final CTA container */
gsap.to(".finalcta-content", {
    opacity: 1,
    y: 0,
    duration: 1.4,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".finalcta-section",
        start: "top 80%",
        toggleActions: "play none none none"
    }
});

/* Parallax background (slow upward drift) */
gsap.to(".finalcta-bg", {
    y: -80,
    scale: 1.0,
    duration: 2,
    ease: "power1.out",
    scrollTrigger: {
        trigger: ".finalcta-section",
        start: "top 90%",
        end: "bottom 80%",
        scrub: 1
    }
});

/* Parallax on floating energy flare */
gsap.to(".finalcta-energy", {
    y: -40,
    duration: 2,
    ease: "power1.out",
    scrollTrigger: {
        trigger: ".finalcta-section",
        start: "top 90%",
        end: "bottom 80%",
        scrub: 1
    }
});


/* ============================================================
   OPTIONAL FOOTER REVEAL (if footer exists)
   ============================================================ */

if (document.querySelector(".footer")) {
    gsap.from(".footer", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%"
        }
    });
}


/* ============================================================
   GENERAL SMOOTHING + PERFORMANCE TWEAKS
   ============================================================ */

/* Smooth fade-ins for any element tagged with .fade-up */
gsap.utils.toArray(".fade-up").forEach((el, i) => {
    gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.1 * i,
        ease: "power2.out",
        scrollTrigger: {
            trigger: el,
            start: "top 85%"
        }
    });
});

/* Lean cleanup — kill ScrollTrigger on page unload */
window.addEventListener("beforeunload", () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
});
