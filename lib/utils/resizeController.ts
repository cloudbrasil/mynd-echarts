type ResizeCallback = () => void;

export class ResizeController {
  private observer: ResizeObserver | null = null;
  private element: HTMLElement | null = null;
  private rafId: number | null = null;
  private timeoutId: number | null = null;
  private readonly debounceMs: number;
  private readonly callback: ResizeCallback;

  constructor(el: HTMLElement, callback: ResizeCallback, debounceMs = 300) {
    this.element = el;
    this.callback = callback;
    this.debounceMs = debounceMs;
  }

  start() {
    if (!this.element) return;

    const fire = () => {
      if (this.rafId != null) cancelAnimationFrame(this.rafId);
      if (this.timeoutId != null) clearTimeout(this.timeoutId);
      // Coalesce: wait 1 frame, then debounce a bit to stabilize
      this.rafId = requestAnimationFrame(() => {
        this.timeoutId = window.setTimeout(() => this.callback(), this.debounceMs);
      });
    };

    try {
      this.observer = new ResizeObserver(() => fire());
      this.observer.observe(this.element);
    } catch {
      window.addEventListener('resize', fire);
    }
  }

  stop() {
    if (this.observer) {
      try { this.observer.disconnect(); } catch {}
      this.observer = null;
    }
    if (this.element) {
      try { /* no-op for unobserve fallback */ } catch {}
    }
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    if (this.timeoutId != null) clearTimeout(this.timeoutId);
    this.rafId = null;
    this.timeoutId = null;
  }
}
