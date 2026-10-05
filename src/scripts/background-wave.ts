type WaveVariant = 'wave' | 'fabric' | 'tide';

let initialized = false;
let cleanup: (() => void) | undefined;

export function initializeBackgroundWave(): void {
  if (initialized) return;
  initialized = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');

  const bind = () => {
    cleanup?.();
    cleanup = undefined;

    const canvas = document.querySelector<HTMLCanvasElement>(
      '.background-wave-canvas',
    );
    const variant = canvas?.dataset.waveVariant as WaveVariant | undefined;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !variant || reducedMotion.matches) return;

    const body = document.body;
    const controller = new AbortController();
    const { signal } = controller;
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let width = 0;
    let height = 0;
    let scale = 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      draw(elapsed);
    };

    const displacement = (
      x: number,
      y: number,
      time: number,
    ): [number, number] => {
      if (variant === 'wave') {
        return [0, 13 * Math.sin(x / 145 - time * 0.9 + y / 260)];
      }
      if (variant === 'fabric') {
        return [
          6 * Math.sin(y / 145 + time * 0.58),
          9 * Math.sin(x / 155 - time * 0.72 + y / 320),
        ];
      }
      const distanceFromMiddle = (y - height * 0.52) / 240;
      const envelope = Math.exp(-distanceFromMiddle * distanceFromMiddle);
      return [0, 16 * envelope * Math.sin(x / 125 - time * 0.85)];
    };

    const drawLine = (horizontal: boolean, position: number, time: number) => {
      context.beginPath();
      const length = horizontal ? width : height;
      for (let step = -24; step <= length + 24; step += 8) {
        const x = horizontal ? step : position;
        const y = horizontal ? position : step;
        const [dx, dy] = displacement(x, y, time);
        if (step === -24) context.moveTo(x + dx, y + dy);
        else context.lineTo(x + dx, y + dy);
      }
      context.stroke();
    };

    const draw = (time: number) => {
      const dark =
        document.documentElement.dataset.theme === 'dark' ||
        (!document.documentElement.dataset.theme && darkTheme.matches);
      context.clearRect(0, 0, width, height);
      context.strokeStyle = dark
        ? 'rgb(241 240 233 / 0.105)'
        : 'rgb(27 27 24 / 0.092)';
      context.lineWidth = 1;
      for (let y = 0; y <= height + 40; y += 40) drawLine(true, y, time);
      for (let x = 0; x <= width + 40; x += 40) drawLine(false, x, time);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden || now - lastFrame < 40) return;
      elapsed += Math.min(now - (lastFrame || now), 80) / 1000;
      lastFrame = now;
      draw(elapsed);
    };

    const updateVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = 0;
      } else if (!frame) {
        frame = requestAnimationFrame(tick);
      }
    };

    body.dataset.waveActive = '';
    resize();
    updateVisibility();
    window.addEventListener('resize', resize, { signal });
    document.addEventListener('visibilitychange', updateVisibility, { signal });
    darkTheme.addEventListener('change', () => draw(elapsed), { signal });
    const themeObserver = new MutationObserver(() => draw(elapsed));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    cleanup = () => {
      controller.abort();
      themeObserver.disconnect();
      cancelAnimationFrame(frame);
      delete body.dataset.waveActive;
    };
  };

  document.addEventListener('astro:page-load', bind);
  document.addEventListener('astro:before-swap', () => cleanup?.());
  window.addEventListener('pagehide', () => cleanup?.());
  window.addEventListener('pageshow', bind);
  reducedMotion.addEventListener('change', bind);
  bind();
}
