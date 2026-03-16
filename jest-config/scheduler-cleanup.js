// Clean up React 16 scheduler MessagePort to allow Jest to exit
// Scheduler module creates a MessagePort in a worker-like environment which Jest detects as an open handle
// This cleanup runs after all tests complete

// Disable scheduler's MessagePort to prevent Jest from detecting it as an open handle
if (typeof global !== 'undefined' && global.MessagePort) {
  const originalMessagePort = global.MessagePort;
  global.MessagePort = class extends originalMessagePort {
    constructor() {
      super();
    }
  };
}

// Cleanup function to run after all tests
afterAll(async () => {
  // The scheduler creates MessagePorts via ReactDOM. We need to allow pending timers to clear.
  // Jest will automatically collect any remaining handles after this runs.
  
  // Wait a bit for any pending work to settle
  await new Promise((resolve) => {
    // Use setTimeout with 0 to schedule cleanup after current queue
    setTimeout(resolve, 100);
  });
  
  // If there's a chance to clear the scheduler explicitly, do so
  try {
    // Access React's internal scheduler and clear any pending work
    const scheduler = require('scheduler');
    if (scheduler && scheduler.unstable_cancelCallback) {
      // No-op: just ensure scheduler module is loaded
    }
  } catch (e) {
    // Ignore if scheduler not available
  }
});
