// Polyfill TextEncoder/TextDecoder for Jest Node environment
// Use Node's util.TextEncoder/TextDecoder when available
try {
  const { TextEncoder, TextDecoder } = require('util');
  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
  }
  if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
  }
} catch (e) {
  // If util doesn't expose them (older Node), no-op; tests that need it should polyfill explicitly
  // Alternatively, we could install 'text-encoding' as a devDependency if needed
}

// Polyfill MessageChannel for environments where it's not available (Jest/node)
try {
  if (typeof global.MessageChannel === 'undefined') {
    const { MessageChannel } = require('worker_threads');
    if (MessageChannel) {
      global.MessageChannel = MessageChannel;
    }
  }
} catch (e) {
  // If worker_threads isn't available, provide a very small shim used by some libs
  if (typeof global.MessageChannel === 'undefined') {
    class ShimChannel {
      constructor() {
        this.port1 = { onmessage: null, postMessage: (msg) => { setTimeout(() => { if (this.port2 && this.port2.onmessage) this.port2.onmessage({ data: msg }); }, 0); } };
        this.port2 = { onmessage: null, postMessage: (msg) => { setTimeout(() => { if (this.port1 && this.port1.onmessage) this.port1.onmessage({ data: msg }); }, 0); } };
      }
    }
    global.MessageChannel = ShimChannel;
  }
}
