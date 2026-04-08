// ---------------- FULL HERO PARTICLE LOOP ----------------
let particles = [];
let font;
let shapeImg;

const BASE_DENSITY = 6;
const HERO_SCALE = 1;

const LOOP_FRAMES = 360;
const FPS = 60;

const BREATH_AMPLITUDE = 6;
const BASE_FONT_SIZE = 14;
const BASE_LINE_HEIGHT = 24;
const BASE_CHAR_WIDTH = 12;

const MIN_FONT_SIZE = 2.5;
const MIN_PARTICLES = 1000;

const BASE_COLOR = [255, 255, 255];
const ACCENT_COLOR = [206, 255, 126];
const COLOR_RADIUS = 220;
const BASE_ALPHA = 0.8 * 255;
const SPOTLIGHT_ALPHA = 255;

let canvasRef;
let currentFrame = 0;
let currentShapeScale = 1;


// ---------------- CODE BLOCK ----------------
const CODE_LINES = [
`<!DOCTYPE html>`,
`<html lang="en" data-theme="light" data-app="hero-morph-engine" data-version="2.4.1">`,
`<head>`,
`  <meta charset="UTF-8">`,
`  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`,
`  <meta name="description" content="Interactive hero system using particle-based SVG morphing, code-driven layouts, and GPU-accelerated motion pipelines.">`,
`  <meta name="author" content="Wix Engineering Platform">`,
`  <meta name="robots" content="index, follow">`,
`  <meta http-equiv="X-UA-Compatible" content="IE=edge">`,
`  <title>Hero Morph Engine — Interactive Motion System</title>`,
`  <link rel="preconnect" href="https://fonts.googleapis.com">`,
`  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
`  <link rel="stylesheet" href="/styles/reset.css">`,
`  <link rel="stylesheet" href="/styles/tokens.css">`,
`  <link rel="stylesheet" href="/styles/layout.css">`,
`  <link rel="stylesheet" href="/styles/typography.css">`,
`  <link rel="stylesheet" href="/styles/hero.css">`,
`  <link rel="stylesheet" href="/styles/components/button.css">`,
`  <link rel="stylesheet" href="/styles/components/navigation.css">`,
`</head>`,
`<body class="page page--home page--motion-enabled page--theme-light" data-scroll="locked">`,
`  <header class="site-header site-header--transparent site-header--sticky" data-state="idle">`,
`    <div class="site-header__inner site-header__inner--wide">`,
`      <a href="/" class="brand brand--logo brand--animated" aria-label="Wix Home">WIX</a>`,
`      <nav class="navigation navigation--primary navigation--horizontal" role="navigation">`,
`        <ul class="navigation__list">`,
`          <li class="navigation__item"><a href="#platform">Platform</a></li>`,
`          <li class="navigation__item"><a href="#solutions">Solutions</a></li>`,
`          <li class="navigation__item"><a href="#developers">Developers</a></li>`,
`          <li class="navigation__item"><a href="#pricing">Pricing</a></li>`,
`          <li class="navigation__item"><a href="#enterprise">Enterprise</a></li>`,
`        </ul>`,
`      </nav>`,
`    </div>`,
`  </header>`,
`  <main class="main-content main-content--fluid main-content--scroll-locked">`,
`    <section class="hero hero--fullscreen hero--interactive hero--particle-driven" data-state="idle" data-morph-target="shapeA">`,
`      <canvas id="hero-canvas" width="1920" height="1080" data-density="5" data-hover-radius="90"></canvas>`,
`      <div class="hero-overlay hero-overlay--centered hero-overlay--wide">`,
`        <h1 class="hero-title hero-title--xl hero-title--bold">Create without limits using interactive motion systems</h1>`,
`        <p class="hero-subtitle hero-subtitle--lg">Design, build, and scale immersive digital experiences with modular tooling and performance-first architecture.</p>`,
`        <div class="hero-actions hero-actions--inline">`,
`          <button class="button button--primary button--lg button--rounded" data-action="start">Get Started</button>`,
`          <button class="button button--secondary button--lg button--ghost" data-action="docs">View Documentation</button>`,
`        </div>`,
`      </div>`,
`    </section>`,
`    <section class="features features--grid features--three-up features--spacious">`,
`      <article class="feature-card feature-card--interactive" data-index="0">`,
`        <h2 class="feature-card__title">Design Freedom</h2>`,
`        <p class="feature-card__description">Composable layouts, responsive typography, motion primitives, and scalable design tokens.</p>`,
`      </article>`,
`      <article class="feature-card feature-card--interactive" data-index="1">`,
`        <h2 class="feature-card__title">Developer Control</h2>`,
`        <p class="feature-card__description">APIs, webhooks, CLI tooling, headless CMS integration, and custom render pipelines.</p>`,
`      </article>`,
`      <article class="feature-card feature-card--interactive" data-index="2">`,
`        <h2 class="feature-card__title">Performance at Scale</h2>`,
`        <p class="feature-card__description">GPU-accelerated animation, adaptive rendering strategies, and edge-first delivery.</p>`,
`      </article>`,
`    </section>`,
`    <section class="developer-section developer-section--dark">`,
`      <pre class="code-sample"><code>npm install @wix/hero-morph-engine --save</code></pre>`,
`      <pre class="code-sample"><code>import { createHeroEngine } from "@wix/hero-morph-engine";</code></pre>`,
`    </section>`,
`  </main>`,
`  <footer class="site-footer site-footer--dark site-footer--wide">`,
`    <div class="site-footer__inner">`,
`      <span class="site-footer__copy">© 2026 Wix.com. All rights reserved.</span>`,
`      <nav class="site-footer__nav">`,
`        <a href="/privacy">Privacy</a>`,
`        <a href="/terms">Terms</a>`,
`        <a href="/accessibility">Accessibility</a>`,
`        <a href="/status">System Status</a>`,
`      </nav>`,
`    </div>`,
`  </footer>`,
`</body>`,
`</html>`
];


// ---------------- PRELOAD ----------------
function preload() {
  font = loadFont("Wix Madefor Text VF-normal-400-100.ttf");
  shapeImg = loadImage("Enter9.svg");
}


// ---------------- HELPERS ----------------
function getShapeTargetWidth() {
  const cardWidth = width;

  // smooth interpolation:
  // 260 card -> 130 shape
  // 340 card -> 220 shape
  // 380 card -> 270 shape

  if (cardWidth <= 260) return 110;
  if (cardWidth >= 380) return 270;

  if (cardWidth < 340) {
    return map(cardWidth, 260, 340, 110, 220);
  }

  return map(cardWidth, 340, 380, 220, 270);
}

function getShapeBounds() {
  const targetW = getShapeTargetWidth();
  const scale = targetW / shapeImg.width;
  const targetH = shapeImg.height * scale;

  return {
    w: targetW,
    h: targetH,
    x: (width - targetW) * 0.5,
    y: (height - targetH) * 0.5,
    cx: width * 0.5,
    cy: height * 0.5,
    scale
  };
}


// ---------------- SETUP ----------------
function setup() {
  canvasRef = createCanvas(windowWidth, windowHeight);
  frameRate(FPS);
  pixelDensity(2);
  textFont(font);
  textAlign(LEFT, TOP);
  noStroke();

  buildParticles();
}


// ---------------- BUILD PARTICLES ----------------
function buildParticles() {
  particles = [];

  const shapePoints = extractPoints(shapeImg);
  if (!shapePoints.length) return;

  let scaledFont = BASE_FONT_SIZE * currentShapeScale;
  scaledFont = max(scaledFont, MIN_FONT_SIZE);
  textSize(scaledFont);

  const codePoints = generateCodePoints();
  shuffle(shapePoints, true);

  const bounds = getShapeBounds();
  const cx = bounds.cx;
  const cy = bounds.cy;

  const total = max(codePoints.length, MIN_PARTICLES);

  for (let i = 0; i < total; i++) {
    const sp = shapePoints[i % shapePoints.length];
    const d = dist(sp.x, sp.y, cx, cy);

    particles.push({
      baseX: sp.x,
      baseY: sp.y,
      char: codePoints[i % codePoints.length].char,
      edgeFactor: d,
      phase: random(TWO_PI),
      strength: random(0.6, 1.3)
    });
  }

  const maxEdge = max(particles.map(p => p.edgeFactor)) || 1;
  particles.forEach(p => {
    p.edgeFactor /= maxEdge;
  });
}


// ---------------- DRAW LOOP ----------------
function draw() {
  clear();

  const bounds = getShapeBounds();
  const angle = TWO_PI * currentFrame / LOOP_FRAMES;
  const orbitRadius = min(bounds.w, bounds.h) * 0.32;
  const spotX = bounds.cx + cos(angle) * orbitRadius;
  const spotY = bounds.cy + sin(angle) * orbitRadius;
  const scaledRadius = COLOR_RADIUS * currentShapeScale;

  for (const p of particles) {
    const breath =
      sin(angle + p.phase) *
      BREATH_AMPLITUDE *
      p.edgeFactor *
      p.strength;

    const a = atan2(p.baseY - bounds.cy, p.baseX - bounds.cx);

    const x = p.baseX + cos(a) * breath;
    const y = p.baseY + sin(a) * breath;

    const d = dist(spotX, spotY, x, y);
    let c = constrain(1 - d / scaledRadius, 0, 1);
    c = pow(c, 1.8);

    fill(
      lerp(BASE_COLOR[0], ACCENT_COLOR[0], c),
      lerp(BASE_COLOR[1], ACCENT_COLOR[1], c),
      lerp(BASE_COLOR[2], ACCENT_COLOR[2], c),
      lerp(BASE_ALPHA, SPOTLIGHT_ALPHA, c)
    );

    text(p.char, x, y);
  }

  currentFrame = (currentFrame + 1) % LOOP_FRAMES;
}


// ---------------- SHAPE POINTS ----------------
function extractPoints(img) {
  const pts = [];

  img.loadPixels();

  const bounds = getShapeBounds();
  currentShapeScale = bounds.scale * HERO_SCALE;

  const scale = currentShapeScale;
  const ox = bounds.x;
  const oy = bounds.y;

  let adaptiveDensity = BASE_DENSITY;
  adaptiveDensity = constrain(adaptiveDensity, 1.2, BASE_DENSITY);

  for (let y = 0; y < img.height; y += adaptiveDensity) {
    for (let x = 0; x < img.width; x += adaptiveDensity) {
      const i = (floor(x) + floor(y) * img.width) * 4;

      if (img.pixels[i + 3] > 40) {
        pts.push({
          x: ox + x * scale,
          y: oy + y * scale
        });
      }
    }
  }

  return pts;
}


// ---------------- CODE POINTS ----------------
function generateCodePoints() {
  const pts = [];
  const fullCode = CODE_LINES.join("\n");
  const bounds = getShapeBounds();

  const scaledCharWidth = max(BASE_CHAR_WIDTH * currentShapeScale, 4);
  const scaledLineHeight = max(BASE_LINE_HEIGHT * currentShapeScale, 6);

  const cols = max(floor(bounds.w / scaledCharWidth), 1);
  const rows = max(floor(bounds.h / scaledLineHeight), 1);

  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pts.push({ char: fullCode[index % fullCode.length] });
      index++;
    }
  }

  return pts;
}


// ---------------- WINDOW RESIZE ----------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildParticles();
}