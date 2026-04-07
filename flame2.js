let particles = [];

const FONT_SIZE = 12;
const LINE_HEIGHT = 20;
const CHAR_WIDTH = 12;

// ---------------- FLAME ----------------
let flameScaleDynamic = 1;

let FLAME_HEIGHT;
let FLAME_WIDTH;
let FLAME_FLICKER_X;
let FLAME_FLICKER_Y;

const FLAME_PULL = 0.045;
const DAMPING = 0.86;

// ---------------- COLORS ----------------
const BASE_COLOR = [0, 0, 0];
const WARM_COLOR = [255, 184, 120];
const HOT_COLOR = [255, 241, 210];
let COLOR_RADIUS;
const GLOBAL_COLOR_BASE = 0.04;
const BASE_ALPHA = 0.16 * 255;
const SPOTLIGHT_ALPHA = 0.9 * 255;

// ---------------- LOOP ----------------
const LOOP_DURATION = 12;
const FPS = 30;
const TOTAL_FRAMES = LOOP_DURATION * FPS;

let virtualMouseX = 0;
let virtualMouseY = 0;

// ---------------- CODE BLOCK ----------------
const CODE_LINES = [
  "<!DOCTYPE html>",
  "<html lang=\"en\" data-theme=\"light\" data-app=\"hero-morph-engine\" data-version=\"2.4.1\">",
  "<head>",
  "<meta charset=\"UTF-8\">",
  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, viewport-fit=cover\">",
  "<meta name=\"description\" content=\"Interactive hero system using particle-based SVG morphing, code-driven layouts, and GPU-accelerated motion pipelines.\">",
  "<meta name=\"author\" content=\"Wix Engineering Platform\">",
  "<meta name=\"robots\" content=\"index, follow\">",
  "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">",
  "<title>Hero Morph Engine — Interactive Motion System</title>",
  "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
  "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
  "<link rel=\"stylesheet\" href=\"/styles/reset.css\">",
  "<link rel=\"stylesheet\" href=\"/styles/tokens.css\">",
  "<link rel=\"stylesheet\" href=\"/styles/layout.css\">",
  "<link rel=\"stylesheet\" href=\"/styles/typography.css\">",
  "<link rel=\"stylesheet\" href=\"/styles/hero.css\">",
  "<link rel=\"stylesheet\" href=\"/styles/components/button.css\">",
  "<link rel=\"stylesheet\" href=\"/styles/components/navigation.css\">",
  "</head>",
  "<body class=\"page page--home page--motion-enabled page--theme-light\" data-scroll=\"locked\">",
  "<header class=\"site-header site-header--transparent site-header--sticky\" data-state=\"idle\">",
  "<div class=\"site-header__inner site-header__inner--wide\">",
  "<a href=\"/\" class=\"brand brand--logo brand--animated\" aria-label=\"Wix Home\">WIX</a>",
  "<nav class=\"navigation navigation--primary navigation--horizontal\" role=\"navigation\">",
  "<ul class=\"navigation__list\">",
  "<li class=\"navigation__item\"><a href=\"#platform\">Platform</a></li>",
  "<li class=\"navigation__item\"><a href=\"#solutions\">Solutions</a></li>",
  "<li class=\"navigation__item\"><a href=\"#developers\">Developers</a></li>",
  "<li class=\"navigation__item\"><a href=\"#pricing\">Pricing</a></li>",
  "<li class=\"navigation__item\"><a href=\"#enterprise\">Enterprise</a></li>",
  "</ul>",
  "</nav>",
  "</div>",
  "</header>",
  "<main class=\"main-content main-content--fluid main-content--scroll-locked\">",
  "<section class=\"hero hero--fullscreen hero--interactive hero--particle-driven\" data-state=\"idle\" data-morph-target=\"shapeA\">",
  "<canvas id=\"hero-canvas\" width=\"1920\" height=\"1080\" data-density=\"5\" data-hover-radius=\"90\"></canvas>",
  "<div class=\"hero-overlay hero-overlay--centered hero-overlay--wide\">",
  "<h1 class=\"hero-title hero-title--xl hero-title--bold\">Create without limits using interactive motion systems</h1>",
  "<p class=\"hero-subtitle hero-subtitle--lg\">Design, build, and scale immersive digital experiences with modular tooling and performance-first architecture.</p>",
  "<div class=\"hero-actions hero-actions--inline\">",
  "<button class=\"button button--primary button--lg button--rounded\" data-action=\"start\">Get Started</button>",
  "<button class=\"button button--secondary button--lg button--ghost\" data-action=\"docs\">View Documentation</button>",
  "</div>",
  "</div>",
  "</section>",
  "<section class=\"features features--grid features--three-up features--spacious\">",
  "<article class=\"feature-card feature-card--interactive\" data-index=\"0\">",
  "<h2 class=\"feature-card__title\">Design Freedom</h2>",
  "<p class=\"feature-card__description\">Composable layouts, responsive typography, motion primitives, and scalable design tokens.</p>",
  "</article>",
  "<article class=\"feature-card feature-card--interactive\" data-index=\"1\">",
  "<h2 class=\"feature-card__title\">Developer Control</h2>",
  "<p class=\"feature-card__description\">APIs, webhooks, CLI tooling, headless CMS integration, and custom render pipelines.</p>",
  "</article>",
  "<article class=\"feature-card feature-card--interactive\" data-index=\"2\">",
  "<h2 class=\"feature-card__title\">Performance at Scale</h2>",
  "<p class=\"feature-card__description\">GPU-accelerated animation, adaptive rendering strategies, and edge-first delivery.</p>",
  "</article>",
  "</section>",
  "<section class=\"developer-section developer-section--dark\">",
  "<pre class=\"code-sample\"><code>npm install @wix/hero-morph-engine --save</code></pre>",
  "<pre class=\"code-sample\"><code>import { createHeroEngine } from \"@wix/hero-morph-engine\";</code></pre>",
  "</section>",
  "</main>",
  "<footer class=\"site-footer site-footer--dark site-footer--wide\">",
  "<div class=\"site-footer__inner\">",
  "<span class=\"site-footer__copy\">© 2026 Wix.com. All rights reserved.</span>",
  "<nav class=\"site-footer__nav\">",
  "<a href=\"/privacy\">Privacy</a>",
  "<a href=\"/terms\">Terms</a>",
  "<a href=\"/accessibility\">Accessibility</a>",
  "<a href=\"/status\">System Status</a>",
  "</nav>",
  "</div>",
  "</footer>",
  "</body>",
  "</html>"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(FPS);
  textSize(FONT_SIZE);
  textAlign(LEFT, TOP);
  noStroke();

  updateFlameScale();
  buildParticles();
}

function buildParticles() {
  particles = [];

  const cols = ceil(width / CHAR_WIDTH);
  const rows = ceil(height / LINE_HEIGHT);

  const longCode = CODE_LINES.join("").repeat(100);
  let index = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      particles.push({
        x: c * CHAR_WIDTH,
        y: r * LINE_HEIGHT,
        baseX: c * CHAR_WIDTH,
        baseY: r * LINE_HEIGHT,
        targetX: c * CHAR_WIDTH,
        targetY: r * LINE_HEIGHT,
        vx: 0,
        vy: 0,
        char: longCode[index % longCode.length]
      });
      index++;
    }
  }
}

function updateCursor(frameNum) {
  const t = frameNum / TOTAL_FRAMES;

  const drift = 0.5 - 0.5 * cos(TWO_PI * t);

  let minX, maxX;

  if (width <= 820) {
    minX = 0;
    maxX = width;
  } else {
    minX = width * 0.08;
    maxX = width * 0.4;
  }

  virtualMouseX = lerp(minX, maxX, drift);
  virtualMouseY = height * 0.5 + sin(TWO_PI * t * 0.5) * 12;
}

function flameField(x, y, cx, cy) {
  const dx = x - cx;
  const dy = y - cy;

  const bottom = 28;
  const top = -FLAME_HEIGHT;

  if (dy > bottom || dy < top) return 0;

  const t = constrain(map(dy, bottom, top, 0, 1), 0, 1);

  const mainWidth =
    FLAME_WIDTH *
    (0.24 + 0.92 * sin(t * PI) * (1 - t * 0.14));

  const nx = dx / max(mainWidth, 1);

  let mainShape = 1 - pow(abs(nx), 1.55);
  mainShape = constrain(mainShape, 0, 1);

  const verticalEnvelope =
    pow(sin(t * PI), 0.82) *
    lerp(1.0, 0.82, t);

  let body = mainShape * verticalEnvelope;

  const carveCenterX = mainWidth * lerp(0.18, 0.55, t);
  const carveCenterY = lerp(-8, -FLAME_HEIGHT * 0.28, t);

  const carveDx = dx - carveCenterX;
  const carveDy = dy - carveCenterY;

  const carveW = mainWidth * lerp(0.22, 0.34, t);
  const carveH = FLAME_HEIGHT * lerp(0.10, 0.18, t);

  let sideCarve =
    exp(
      -pow(carveDx / max(carveW, 1), 2) -
      pow(carveDy / max(carveH, 1), 2)
    );

  sideCarve *= pow(constrain((t - 0.25) / 0.75, 0, 1), 1.2);

  const tipDx = dx * 0.75;
  const tipDy = dy + FLAME_HEIGHT * 0.92;

  let tipStretch =
    exp(
      -pow(tipDx / (FLAME_WIDTH * 0.16), 2) -
      pow(tipDy / (FLAME_HEIGHT * 0.22), 2)
    ) * 0.22;

  let shape = body - sideCarve * 0.95 + tipStretch;

  const leftBias =
    exp(-pow((dx + mainWidth * 0.18) / (mainWidth * 0.9), 2)) * 0.08;

  shape += leftBias * verticalEnvelope;

  shape = constrain(shape, 0, 1);
  return shape;
}

function updateFlameScale() {
  flameScaleDynamic = map(width, 320, 820, 0.75, 1, true);

  FLAME_HEIGHT = 270 * flameScaleDynamic;
  FLAME_WIDTH = 105 * flameScaleDynamic;
  FLAME_FLICKER_X = 6 * flameScaleDynamic;
  FLAME_FLICKER_Y = 10 * flameScaleDynamic;

  COLOR_RADIUS = 280 * flameScaleDynamic;
}
function draw() {
  background("#262F3B");

  const frameNum = frameCount % TOTAL_FRAMES;
  updateCursor(frameNum);

  const minX = width <= 820 ? 0 : width * 0.08;
  const maxX = width <= 820 ? width : width * 0.4;
  const driftInfluence = map(virtualMouseX, minX, maxX, -1, 1);

  for (let p of particles) {
    const flameInfluence = flameField(
      p.baseX,
      p.baseY,
      virtualMouseX,
      virtualMouseY
    );

    if (flameInfluence > 0.02) {
      const dy = p.baseY - virtualMouseY;
      const t = constrain(map(dy, 28, -FLAME_HEIGHT, 0, 1), 0, 1);

      const flickerX =
        sin(frameNum * 0.05 + p.baseY * 0.018) *
          FLAME_FLICKER_X *
          flameInfluence *
          0.7 +
        sin(frameNum * 0.03 + p.baseX * 0.01) * 1.5;

      const flickerY =
        sin(frameNum * 0.04 + p.baseX * 0.015) *
        FLAME_FLICKER_Y *
        0.12 *
        flameInfluence;

      const lift = t * 10 * flameInfluence;

      p.targetX = p.baseX + flickerX + driftInfluence * flameInfluence * 1.2;
      p.targetY = p.baseY - lift + flickerY;
    } else {
      p.targetX = p.baseX;
      p.targetY = p.baseY;
    }

    p.vx += (p.targetX - p.x) * FLAME_PULL;
    p.vy += (p.targetY - p.y) * FLAME_PULL;

    p.vx *= DAMPING;
    p.vy *= DAMPING;

    p.x += p.vx;
    p.y += p.vy;

    const glow = flameField(p.x, p.y, virtualMouseX, virtualMouseY);
    const d = dist(p.x, p.y, virtualMouseX, virtualMouseY);

    let cT = constrain(1 - d / COLOR_RADIUS, 0, 1);
    cT = max(cT, GLOBAL_COLOR_BASE);
    cT += glow * 0.85;
    cT = constrain(cT, 0, 1);
    cT = pow(cT, 1.35);

    const heat = glow;

    const baseR = lerp(BASE_COLOR[0], WARM_COLOR[0], cT);
    const baseG = lerp(BASE_COLOR[1], WARM_COLOR[1], cT);
    const baseB = lerp(BASE_COLOR[2], WARM_COLOR[2], cT);

    fill(
      lerp(baseR, HOT_COLOR[0], heat * 0.45),
      lerp(baseG, HOT_COLOR[1], heat * 0.45),
      lerp(baseB, HOT_COLOR[2], heat * 0.35),
      lerp(BASE_ALPHA, SPOTLIGHT_ALPHA, cT)
    );

    text(p.char, p.x, p.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateFlameScale();
  buildParticles();
}