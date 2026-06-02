const header = document.querySelector("[data-elevate]");
const menuButton = document.querySelector(".menu-button");
const contactForm = document.querySelector(".contact-form");
const hero = document.querySelector(".hero");
const heroFigure = document.querySelector(".hero-figure");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-elevated", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuButton && header) {
  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    button.textContent = "已收到";
    setTimeout(() => {
      button.textContent = "提交咨询";
      contactForm.reset();
    }, 1400);
  });
}

const revealTargets = [
  ".hero-content",
  ".hero-figure",
  ".page-hero > div",
  ".credential-strip div",
  ".project-intro-panel > div",
  ".narrative-block > div",
  ".section-heading",
  ".product-copy article",
  ".product-image",
  ".advantage-card",
  ".portal-card",
  ".detail-grid article",
  ".solution-list article",
  ".workflow-track",
  ".workflow-track article",
  ".experience-card",
  ".scenario-card",
  ".quality-panel > div",
  ".quality-list article",
  ".research-grid article",
  ".mission-panel > div",
  ".verification-card",
  ".verification-aside",
  ".contact > div",
  ".contact-form",
].flatMap((selector) => [...document.querySelectorAll(selector)]);

if (reduceMotion) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}

if (!reduceMotion && hero && heroFigure) {
  let ticking = false;

  function updateHeroMotion() {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    hero.style.setProperty("--field-y", `${progress * 28}px`);
    heroFigure.style.setProperty("--hero-float", `${progress * -18}px`);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateHeroMotion);
        ticking = true;
      }
    },
    { passive: true }
  );

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty("--field-x", `${x * 18}px`);
    heroFigure.style.setProperty("--hero-tilt-x", `${x * 3.4}deg`);
    heroFigure.style.setProperty("--hero-tilt-y", `${y * -2.8}deg`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--field-x", "0px");
    heroFigure.style.setProperty("--hero-tilt-x", "0deg");
    heroFigure.style.setProperty("--hero-tilt-y", "0deg");
  });

  updateHeroMotion();
}
