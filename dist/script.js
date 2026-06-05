const header = document.querySelector("[data-elevate]");
const menuButton = document.querySelector(".menu-button");
const contactForm = document.querySelector(".contact-form");
const hero = document.querySelector(".hero");
const heroFigure = document.querySelector(".hero-figure");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const richMotionEnabled = Boolean(document.querySelector(".live-animation-lab, .showcase-board, [data-runtime-canvas]"));

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-elevated", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

function getHeaderOffset() {
  return (header?.offsetHeight || 72) + 18;
}

function scrollToHash(hash, shouldReplace) {
  if (!hash || hash === "#") return false;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });

  if (shouldReplace) {
    history.replaceState(null, "", hash);
  }

  return true;
}

if (menuButton && header) {
  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const navLinks = [...document.querySelectorAll(".nav a")];
const currentPage = location.pathname.split("/").pop() || "index.html";

navLinks.forEach((link) => {
  const linkPage = new URL(link.href, location.href).pathname.split("/").pop() || "index.html";
  if (linkPage === currentPage) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }

  link.addEventListener("click", (event) => {
    header?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");

    const targetUrl = new URL(link.href, location.href);
    const isSamePage = targetUrl.pathname === location.pathname;
    if (isSamePage && targetUrl.hash && scrollToHash(targetUrl.hash, true)) {
      event.preventDefault();
    }
  });
});

window.addEventListener("load", () => {
  if (location.hash) {
    setTimeout(() => scrollToHash(location.hash, false), 80);
  }
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
  ".hero-metric-card",
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
  ".scenario-flow article",
  ".content-rhythm article",
  ".material-journey article",
  ".cooperation-lane article",
  ".insight-panel > div",
  ".response-steps article",
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
  ".motion-window",
  ".showcase-copy",
  ".showcase-board",
  ".feature-story",
  ".product-core-title",
  ".product-core-shell",
  ".core-capability-grid article",
  ".core-scenarios",
  ".workflow-signal-board article",
  ".contact-service-grid article",
  ".solution-blueprint-grid article",
  ".advantage-proof-grid article",
  ".download-pack-grid article",
  ".partner-enablement-grid article",
  ".article-library-head",
  ".article-filter",
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

function observeOnce(targets, onEnter) {
  const elements = [...targets].filter(Boolean);
  if (!elements.length) return;

  if (reduceMotion) {
    elements.forEach(onEnter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

function animateNumber(element) {
  const target = Number(element.dataset.countTo || 0);
  const suffix = element.dataset.countSuffix || "";
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

observeOnce(document.querySelectorAll("[data-count-to]"), animateNumber);

observeOnce(document.querySelectorAll(".live-progress-card"), (card) => {
  card.querySelectorAll("[data-progress]").forEach((bar, index) => {
    setTimeout(() => {
      bar.style.setProperty("--progress", `${bar.dataset.progress}%`);
    }, index * 150);
  });
});

const flowNodes = [...document.querySelectorAll(".live-flow-node")];
if ((!reduceMotion || richMotionEnabled) && flowNodes.length) {
  let activeFlowIndex = 0;
  flowNodes[0].classList.add("is-active");
  setInterval(() => {
    flowNodes[activeFlowIndex]?.classList.remove("is-active");
    activeFlowIndex = (activeFlowIndex + 1) % flowNodes.length;
    flowNodes[activeFlowIndex]?.classList.add("is-active");
  }, 980);
}

function drawRadar(canvas, progress) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2 + 4;
  const radius = Math.min(width, height) * 0.34;
  const values = [0.82, 0.68, 0.92, 0.74, 0.86, 0.78];
  const labels = ["调节", "聚散", "融合", "追随", "扫视", "立体"];

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.font = "12px Microsoft YaHei, Arial, sans-serif";

  for (let ring = 1; ring <= 4; ring += 1) {
    ctx.beginPath();
    const ringRadius = (radius * ring) / 4;
    for (let i = 0; i < values.length; i += 1) {
      const angle = -Math.PI / 2 + (i / values.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * ringRadius;
      const y = centerY + Math.sin(angle) * ringRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(20, 99, 231, 0.16)";
    ctx.stroke();
  }

  values.forEach((_, i) => {
    const angle = -Math.PI / 2 + (i / values.length) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(15, 159, 149, 0.14)";
    ctx.stroke();
    ctx.fillStyle = "#5f6f86";
    ctx.textAlign = x < centerX - 4 ? "right" : x > centerX + 4 ? "left" : "center";
    ctx.fillText(labels[i], centerX + Math.cos(angle) * (radius + 18), centerY + Math.sin(angle) * (radius + 18));
  });

  ctx.beginPath();
  values.forEach((value, i) => {
    const angle = -Math.PI / 2 + (i / values.length) * Math.PI * 2;
    const animatedRadius = radius * value * progress;
    const x = centerX + Math.cos(angle) * animatedRadius;
    const y = centerY + Math.sin(angle) * animatedRadius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(15, 159, 149, 0.18)";
  ctx.strokeStyle = "rgba(20, 99, 231, 0.9)";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

observeOnce(document.querySelectorAll(".live-radar"), (canvas) => {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / 1200, 1);
    drawRadar(canvas, 1 - Math.pow(1 - progress, 3));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeArticleUrl(url) {
  try {
    return new URL(url, location.href).href;
  } catch {
    return "#";
  }
}

function renderArticles(articles) {
  const articleList = document.querySelector("#articleList");
  const count = document.querySelector(".article-current-count");
  if (!articleList) return;

  if (count) count.textContent = String(articles.length);

  if (!articles.length) {
    articleList.innerHTML = '<div class="article-empty">当前分类暂无文章。</div>';
    return;
  }

  articleList.innerHTML = articles
    .map((article, index) => {
      const safeUrl = normalizeArticleUrl(article.url);
      return `
        <article class="article-card" style="--article-delay: ${Math.min(index, 8) * 55}ms">
          <div class="article-number">${String(article.id).padStart(2, "0")}</div>
          <div class="article-tags">
            <span>${escapeHtml(article.category)}</span>
            <em>${escapeHtml(article.date)}</em>
          </div>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.summary)}</p>
          <div class="article-footer">
            <small>${escapeHtml(article.source)}</small>
            <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">阅读原文</a>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadScienceArticles() {
  const articleList = document.querySelector("#articleList");
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  if (!articleList) return;

  try {
    const response = await fetch("./articles_seed_20.json");
    if (!response.ok) throw new Error(`Failed to load articles: ${response.status}`);
    const articles = await response.json();

    renderArticles(articles);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.category || "全部";
        filterButtons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle("active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        renderArticles(category === "全部" ? articles : articles.filter((article) => article.category === category));
      });
    });
  } catch (error) {
    articleList.innerHTML = '<div class="article-empty">文章加载失败，请稍后再试。</div>';
    console.error(error);
  }
}

loadScienceArticles();

function attachRuntimeCanvas(container) {
  if ((!richMotionEnabled && reduceMotion) || container.querySelector(".runtime-canvas")) return;

  function getRuntimeMode() {
    const section = container.closest(".subpage-showcase");
    const pageKey = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
    if (container.dataset.effectMode) return container.dataset.effectMode;
    if (container.matches("[data-runtime-canvas]")) return "live-orbit";
    if (container.classList.contains("page-hero")) return `${pageKey}-hero`;
    if (!section) return "network";
    if (section.classList.contains("science-showcase")) return "editorial";
    if (section.classList.contains("solution-showcase")) return "routes";
    if (section.classList.contains("scenario-showcase")) return "radar";
    if (section.classList.contains("qualification-showcase")) return "audit";
    if (section.classList.contains("workflow-showcase")) return "conveyor";
    if (section.classList.contains("cooperation-showcase")) return "pipeline";
    if (section.classList.contains("download-showcase")) return "documents";
    if (section.classList.contains("about-showcase")) return "orbit";
    if (section.classList.contains("contact-showcase")) return "messages";
    if (section.classList.contains("advantage-showcase")) return "meters";
    return "network";
  }

  const canvas = document.createElement("canvas");
  canvas.className = "runtime-canvas";
  canvas.setAttribute("aria-hidden", "true");
  container.prepend(canvas);
  const ctx = canvas.getContext("2d");
  const mode = getRuntimeMode();
  container.dataset.runtimeEffect = mode;
  const particles = Array.from({ length: container.classList.contains("page-hero") ? 42 : 30 }, (_, index) => ({
    seed: index,
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00055,
    vy: (Math.random() - 0.5) * 0.00055,
    r: 1.3 + Math.random() * 2.4,
  }));
  let width = 1;
  let height = 1;
  let pointerX = 0.5;
  let pointerY = 0.5;

  function resize() {
    const rect = container.getBoundingClientRect();
    width = Math.max(Math.floor(rect.width), 1);
    height = Math.max(Math.floor(rect.height), 1);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawNetwork(time) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      particle.x += particle.vx + (pointerX - 0.5) * 0.00012;
      particle.y += particle.vy + (pointerY - 0.5) * 0.00012;
      if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
      if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
      particle.x = Math.max(0, Math.min(1, particle.x));
      particle.y = Math.max(0, Math.min(1, particle.y));

      const x = particle.x * width;
      const y = particle.y * height;
      ctx.beginPath();
      ctx.arc(x, y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = index % 3 === 0 ? "rgba(155, 230, 223, 0.72)" : "rgba(127, 176, 255, 0.46)";
      ctx.fill();

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const ox = other.x * width;
        const oy = other.y * height;
        const distance = Math.hypot(x - ox, y - oy);
        if (distance < 92) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ox, oy);
          ctx.strokeStyle = `rgba(155, 230, 223, ${0.16 * (1 - distance / 92)})`;
          ctx.stroke();
        }
      }
    });
  }

  function drawEditorial(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i += 1) {
      const y = 34 + i * 28;
      const phase = (time / 900 + i * 0.42) % 1;
      const lineWidth = width * (0.26 + ((i % 5) + 2) * 0.055);
      ctx.fillStyle = i % 3 === 0 ? "rgba(20, 99, 231, 0.1)" : "rgba(15, 159, 149, 0.09)";
      ctx.fillRect(28, y, lineWidth, 5);
      ctx.fillStyle = "rgba(20, 99, 231, 0.18)";
      ctx.fillRect(28 + lineWidth * phase, y - 6, 2, 17);
    }
    for (let i = 0; i < 5; i += 1) {
      const x = width * (0.58 + i * 0.075);
      const y = 42 + Math.sin(time / 850 + i) * 12 + i * 34;
      ctx.strokeStyle = "rgba(20, 99, 231, 0.16)";
      ctx.strokeRect(x, y, 48, 62);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(x + 8, y + 12, 30, 4);
      ctx.fillRect(x + 8, y + 25, 22, 4);
    }
  }

  function drawRoutes(time) {
    ctx.clearRect(0, 0, width, height);
    const lanes = [
      [0.08, 0.28, 0.52, 0.18, 0.9, 0.34],
      [0.08, 0.55, 0.42, 0.72, 0.9, 0.62],
      [0.1, 0.78, 0.54, 0.48, 0.88, 0.82],
    ];
    lanes.forEach((lane, index) => {
      const [sx, sy, cx, cy, ex, ey] = lane;
      const progress = (time / (1800 + index * 220) + index * 0.22) % 1;
      ctx.beginPath();
      ctx.moveTo(sx * width, sy * height);
      ctx.quadraticCurveTo(cx * width, cy * height, ex * width, ey * height);
      ctx.strokeStyle = "rgba(15, 159, 149, 0.24)";
      ctx.lineWidth = 2;
      ctx.stroke();
      const x = (1 - progress) ** 2 * sx * width + 2 * (1 - progress) * progress * cx * width + progress ** 2 * ex * width;
      const y = (1 - progress) ** 2 * sy * height + 2 * (1 - progress) * progress * cy * height + progress ** 2 * ey * height;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = index % 2 ? "rgba(20, 99, 231, 0.78)" : "rgba(15, 159, 149, 0.82)";
      ctx.fill();
    });
  }

  function drawRadarSweep(time) {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;
    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, (radius * i) / 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(240, 123, 34, 0.16)";
      ctx.stroke();
    }
    const angle = time / 760;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + 0.62);
    ctx.closePath();
    ctx.fillStyle = "rgba(240, 123, 34, 0.16)";
    ctx.fill();
    particles.slice(0, 10).forEach((particle, index) => {
      const x = cx + Math.cos(index * 1.7) * radius * (0.22 + (index % 5) * 0.14);
      const y = cy + Math.sin(index * 1.7) * radius * (0.22 + (index % 5) * 0.14);
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.sin(time / 400 + index) * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(155, 230, 223, 0.76)";
      ctx.fill();
    });
  }

  function drawAuditScan(time) {
    ctx.clearRect(0, 0, width, height);
    const scanY = 24 + ((time / 12) % Math.max(height - 48, 1));
    for (let i = 0; i < 7; i += 1) {
      const y = 34 + i * 42;
      ctx.strokeStyle = "rgba(47, 143, 102, 0.18)";
      ctx.strokeRect(28, y, 22, 22);
      ctx.beginPath();
      ctx.moveTo(33, y + 12);
      ctx.lineTo(40, y + 18);
      ctx.lineTo(50, y + 6);
      ctx.strokeStyle = "rgba(47, 143, 102, 0.74)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(47, 143, 102, 0.11)";
      ctx.fillRect(66, y + 5, width * (0.46 + (i % 3) * 0.08), 8);
    }
    ctx.fillStyle = "rgba(15, 159, 149, 0.16)";
    ctx.fillRect(0, scanY, width, 3);
  }

  function drawConveyor(time) {
    ctx.clearRect(0, 0, width, height);
    const y = height * 0.54;
    ctx.fillStyle = "rgba(215, 230, 255, 0.08)";
    ctx.fillRect(22, y - 12, width - 44, 24);
    for (let i = 0; i < 9; i += 1) {
      const x = ((time / 18 + i * 94) % (width + 120)) - 60;
      ctx.beginPath();
      ctx.moveTo(x, y - 24);
      ctx.lineTo(x + 58, y);
      ctx.lineTo(x, y + 24);
      ctx.closePath();
      ctx.fillStyle = i % 2 ? "rgba(20, 99, 231, 0.24)" : "rgba(15, 159, 149, 0.24)";
      ctx.fill();
    }
  }

  function drawPipeline(time) {
    ctx.clearRect(0, 0, width, height);
    const y = height * 0.5;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(155, 230, 223, 0.16)";
    ctx.beginPath();
    ctx.moveTo(34, y);
    ctx.lineTo(width - 34, y);
    ctx.stroke();
    for (let i = 0; i < 6; i += 1) {
      const x = 48 + (i / 5) * (width - 96);
      const pulse = (Math.sin(time / 360 + i) + 1) / 2;
      ctx.beginPath();
      ctx.arc(x, y, 10 + pulse * 7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(15, 159, 149, ${0.28 + pulse * 0.34})`;
      ctx.fill();
    }
  }

  function drawDocuments(time) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < 10; i += 1) {
      const x = 34 + ((i * 73 + time / 24) % Math.max(width - 80, 1));
      const y = 28 + ((i * 47 + time / 16) % Math.max(height - 88, 1));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(time / 800 + i) * 0.06);
      ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
      ctx.strokeStyle = "rgba(20, 99, 231, 0.18)";
      ctx.fillRect(0, 0, 42, 54);
      ctx.strokeRect(0, 0, 42, 54);
      ctx.fillStyle = "rgba(20, 99, 231, 0.18)";
      ctx.fillRect(8, 14, 26, 4);
      ctx.fillRect(8, 26, 20, 4);
      ctx.restore();
    }
  }

  function drawOrbit(time) {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.28;
    ctx.strokeStyle = "rgba(155, 230, 223, 0.18)";
    for (let i = 1; i <= 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * i * 0.9, radius * i * 0.42, i * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 7; i += 1) {
      const angle = time / 950 + i * 0.9;
      const x = cx + Math.cos(angle) * radius * (1 + (i % 3) * 0.32);
      const y = cy + Math.sin(angle) * radius * (0.44 + (i % 2) * 0.2);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(155, 230, 223, 0.78)";
      ctx.fill();
    }
  }

  function drawMessages(time) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < 7; i += 1) {
      const x = 30 + (i % 2) * (width * 0.46);
      const y = 32 + i * 42 + Math.sin(time / 500 + i) * 6;
      const w = width * (0.28 + (i % 3) * 0.035);
      ctx.fillStyle = i % 2 ? "rgba(15, 159, 149, 0.22)" : "rgba(20, 99, 231, 0.22)";
      ctx.beginPath();
      ctx.roundRect(x, y, w, 26, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(x + 12, y + 10, w * 0.62, 4);
    }
  }

  function drawMeters(time) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < 8; i += 1) {
      const y = 28 + i * 34;
      const value = 0.42 + ((Math.sin(time / 520 + i * 0.8) + 1) / 2) * 0.46;
      ctx.fillStyle = "rgba(20, 99, 231, 0.08)";
      ctx.fillRect(34, y, width - 68, 12);
      ctx.fillStyle = i % 2 ? "rgba(15, 159, 149, 0.52)" : "rgba(20, 99, 231, 0.52)";
      ctx.fillRect(34, y, (width - 68) * value, 12);
    }
  }

  function drawHomeClinical(time) {
    ctx.clearRect(0, 0, width, height);
    const scanX = (time / 18) % Math.max(width, 1);
    ctx.fillStyle = "rgba(155, 230, 223, 0.08)";
    ctx.fillRect(scanX, 0, 2, height);

    for (let row = 0; row < 4; row += 1) {
      const baseY = height * (0.22 + row * 0.16);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const wave = Math.sin((x + time * 0.08) / 42 + row) * 12;
        const pulse = Math.sin((x + time * 0.18) / 18) > 0.92 ? -24 : 0;
        const y = baseY + wave + pulse;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = row % 2 ? "rgba(155, 230, 223, 0.22)" : "rgba(127, 176, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    for (let i = 0; i < 18; i += 1) {
      const x = (i * 97 + time / 22) % Math.max(width, 1);
      const y = height * (0.12 + ((i * 37) % 70) / 100);
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(155, 230, 223, 0.62)";
      ctx.fill();
    }
  }

  function drawProductCore(time) {
    ctx.clearRect(0, 0, width, height);
    const sweep = (time / 24) % Math.max(width, 1);
    ctx.fillStyle = "rgba(15, 159, 149, 0.08)";
    ctx.fillRect(sweep, 0, 2, height);

    const lanes = [
      [0.06, 0.2, 0.34, 0.11, 0.58, 0.22, 0.9, 0.2],
      [0.12, 0.72, 0.36, 0.62, 0.62, 0.82, 0.86, 0.66],
      [0.2, 0.42, 0.44, 0.34, 0.62, 0.48, 0.78, 0.38],
    ];

    lanes.forEach((lane, index) => {
      const [sx, sy, c1x, c1y, c2x, c2y, ex, ey] = lane;
      ctx.beginPath();
      ctx.moveTo(sx * width, sy * height);
      ctx.bezierCurveTo(c1x * width, c1y * height, c2x * width, c2y * height, ex * width, ey * height);
      ctx.strokeStyle = index % 2 ? "rgba(20, 99, 231, 0.14)" : "rgba(15, 159, 149, 0.16)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const progress = (time / (1800 + index * 260) + index * 0.24) % 1;
      const x = (1 - progress) ** 3 * sx * width
        + 3 * (1 - progress) ** 2 * progress * c1x * width
        + 3 * (1 - progress) * progress ** 2 * c2x * width
        + progress ** 3 * ex * width;
      const y = (1 - progress) ** 3 * sy * height
        + 3 * (1 - progress) ** 2 * progress * c1y * height
        + 3 * (1 - progress) * progress ** 2 * c2y * height
        + progress ** 3 * ey * height;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = index % 2 ? "rgba(20, 99, 231, 0.68)" : "rgba(15, 159, 149, 0.72)";
      ctx.fill();
    });

    for (let i = 0; i < 18; i += 1) {
      const x = (i * 113 + time / 30) % Math.max(width, 1);
      const y = height * (0.12 + ((i * 29) % 78) / 100);
      ctx.beginPath();
      ctx.arc(x, y, 1.8 + (i % 3) * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? "rgba(20, 99, 231, 0.18)" : "rgba(15, 159, 149, 0.22)";
      ctx.fill();
    }
  }

  function draw(time) {
    const drawers = {
      "home-clinical": drawHomeClinical,
      "product-core": drawProductCore,
      "product-hero": drawNetwork,
      "solutions-hero": drawRoutes,
      "scenarios-hero": drawRadarSweep,
      "advantages-hero": drawMeters,
      "science-hero": drawEditorial,
      "cooperation-hero": drawPipeline,
      "download-hero": drawDocuments,
      "about-hero": drawOrbit,
      "contact-hero": drawMessages,
      "qualification-hero": drawAuditScan,
      "workflow-hero": drawConveyor,
      "live-orbit": drawOrbit,
      network: drawNetwork,
      editorial: drawEditorial,
      routes: drawRoutes,
      radar: drawRadarSweep,
      audit: drawAuditScan,
      conveyor: drawConveyor,
      pipeline: drawPipeline,
      documents: drawDocuments,
      orbit: drawOrbit,
      messages: drawMessages,
      meters: drawMeters,
    };
    (drawers[mode] || drawNetwork)(time || 0);
    requestAnimationFrame(draw);
  }

  container.addEventListener("pointermove", (event) => {
    const rect = container.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / Math.max(rect.width, 1);
    pointerY = (event.clientY - rect.top) / Math.max(rect.height, 1);
  });

  resize();
  new ResizeObserver(resize).observe(container);
  requestAnimationFrame(draw);
}

document.querySelectorAll(".page-hero, .showcase-board, [data-runtime-canvas]").forEach(attachRuntimeCanvas);
