let initialized = false;
let cleanup: (() => void) | undefined;

export function initializeBackgroundHalo(): void {
  if (initialized) return;
  initialized = true;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const bind = () => {
    cleanup?.();
    cleanup = undefined;

    const body = document.body;
    if (
      !body.matches(
        '.background-preview-grid, .background-preview-drift, .background-preview-motion',
      ) ||
      !finePointer.matches ||
      reducedMotion.matches
    ) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    let frame = 0;
    let x = 0;
    let y = 0;

    const hide = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      delete body.dataset.backgroundHalo;
    };

    const paint = () => {
      frame = 0;
      body.style.setProperty('--site-halo-x', `${x}px`);
      body.style.setProperty('--site-halo-y', `${y}px`);
      body.dataset.backgroundHalo = '';
    };

    window.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return;
        x = event.clientX;
        y = event.clientY;
        if (!frame) frame = requestAnimationFrame(paint);
      },
      { signal },
    );
    document.addEventListener(
      'pointerout',
      (event) => {
        if (!event.relatedTarget) hide();
      },
      { signal },
    );
    window.addEventListener('blur', hide, { signal });
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.visibilityState !== 'visible') hide();
      },
      { signal },
    );

    cleanup = () => {
      controller.abort();
      hide();
      body.style.removeProperty('--site-halo-x');
      body.style.removeProperty('--site-halo-y');
    };
  };

  document.addEventListener('astro:page-load', bind);
  document.addEventListener('astro:before-swap', () => cleanup?.());
  window.addEventListener('pagehide', () => cleanup?.());
  window.addEventListener('pageshow', bind);
  finePointer.addEventListener('change', bind);
  reducedMotion.addEventListener('change', bind);
  bind();
}
