interface Particle {
  baseX: number;
  baseY: number;
  phaseX: number;
  phaseY: number;
  frequencyX: number;
  frequencyY: number;
  amplitudeX: number;
  amplitudeY: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  offsetX: number;
  offsetY: number;
}

const spacing = 40;
const wanderRadius = 15;
const mouseRadius = 120;
const pushDistance = 30;
let initialized = false;
let cleanup: (() => void) | undefined;

export function initializeOrganicBackground(): void {
  if (initialized) return;
  initialized = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const bind = () => {
    cleanup?.();
    cleanup = undefined;

    const canvas = document.querySelector<HTMLCanvasElement>(
      '.background-organic-canvas',
    );
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const body = document.body;
    const controller = new AbortController();
    const { signal } = controller;
    const particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 0;

    const makeParticle = (baseX: number, baseY: number): Particle => {
      const baseAlpha = Math.random() * 0.2 + 0.05;
      return {
        baseX,
        baseY,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        frequencyX: (Math.random() * 0.5 + 0.5) * 0.001,
        frequencyY: (Math.random() * 0.5 + 0.5) * 0.001,
        amplitudeX: Math.random() * wanderRadius,
        amplitudeY: Math.random() * wanderRadius,
        radius: Math.random() * 0.8 + 0.8,
        baseAlpha,
        alpha: baseAlpha,
        offsetX: 0,
        offsetY: 0,
      };
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--heading')
          .trim() || '#1b1b18';

      for (const particle of particles) {
        const x =
          particle.baseX +
          (reducedMotion.matches
            ? 0
            : Math.sin(elapsed * particle.frequencyX + particle.phaseX) *
              particle.amplitudeX);
        const y =
          particle.baseY +
          (reducedMotion.matches
            ? 0
            : Math.cos(elapsed * particle.frequencyY + particle.phaseY) *
              particle.amplitudeY);
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const distance = Math.hypot(dx, dy);
        const force =
          !reducedMotion.matches && distance < mouseRadius
            ? (mouseRadius - distance) / mouseRadius
            : 0;
        const offset = distance > 0 ? (force * pushDistance) / distance : 0;
        particle.offsetX += (dx * offset - particle.offsetX) * 0.1;
        particle.offsetY += (dy * offset - particle.offsetY) * 0.1;
        particle.alpha +=
          (Math.min(1, particle.baseAlpha + force * 0.6) - particle.alpha) *
          0.1;
        context.globalAlpha = reducedMotion.matches
          ? particle.baseAlpha
          : particle.alpha;
        context.beginPath();
        context.arc(
          x + particle.offsetX,
          y + particle.offsetY,
          particle.radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      particles.length = 0;
      for (let x = -spacing; x < width + spacing; x += spacing) {
        for (let y = -spacing; y < height + spacing; y += spacing) {
          particles.push(
            makeParticle(
              x + (Math.random() - 0.5) * 10,
              y + (Math.random() - 0.5) * 10,
            ),
          );
        }
      }
      draw();
      body.dataset.organicActive = '';
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      elapsed += Math.min(now - (lastFrame || now), 64);
      lastFrame = now;
      draw();
    };

    const updateVisibility = () => {
      if (document.hidden || reducedMotion.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = 0;
        if (reducedMotion.matches) draw();
      } else if (!frame) {
        frame = requestAnimationFrame(tick);
      }
    };

    resize();
    updateVisibility();
    window.addEventListener('resize', resize, { signal });
    document.addEventListener('visibilitychange', updateVisibility, { signal });
    window.addEventListener(
      'blur',
      () => {
        mouse.x = -1000;
        mouse.y = -1000;
      },
      { signal },
    );
    if (finePointer.matches) {
      window.addEventListener(
        'pointermove',
        (event) => {
          if (event.pointerType !== 'mouse') return;
          mouse.x = event.clientX;
          mouse.y = event.clientY;
        },
        { signal },
      );
      document.addEventListener(
        'pointerout',
        (event) => {
          if (!event.relatedTarget) {
            mouse.x = -1000;
            mouse.y = -1000;
          }
        },
        { signal },
      );
    }
    const themeObserver = new MutationObserver(() => draw());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    systemDark.addEventListener('change', draw, { signal });

    cleanup = () => {
      controller.abort();
      themeObserver.disconnect();
      cancelAnimationFrame(frame);
      delete body.dataset.organicActive;
    };
  };

  document.addEventListener('astro:page-load', bind);
  document.addEventListener('astro:before-swap', () => cleanup?.());
  window.addEventListener('pagehide', () => cleanup?.());
  window.addEventListener('pageshow', bind);
  reducedMotion.addEventListener('change', bind);
  finePointer.addEventListener('change', bind);
  bind();
}
