// Minimal canvas mock for jsdom so Truncate can call getContext('2d')
// Provides measureText and a font property used in Truncate.calcTargetWidth

if (typeof window !== 'undefined' && typeof window.HTMLCanvasElement !== 'undefined') {
  // Only set once
  if (!HTMLCanvasElement.prototype.getContext.__patched) {
    HTMLCanvasElement.prototype.getContext = function (type) {
      if (type !== '2d') return null;

      const ctx = {
        // Simple width heuristic: 7px per character (approx) — good enough for tests
        measureText: (text) => ({ width: String(text).length * 7 }),
        fillText: () => {},
      };

      // allow setting font property
      Object.defineProperty(ctx, 'font', {
        get() {
          return this._font || '';
        },
        set(v) {
          this._font = v;
        },
        configurable: true,
      });

      return ctx;
    };

    HTMLCanvasElement.prototype.getContext.__patched = true;
  }
}
