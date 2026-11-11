const { JSDOM } = require("jsdom");
const challengeTests = require("./challengeTests");

// A fake clock so tests can "fast-forward" timers (needed for debounce etc.)
function installFakeClock(window) {
  let now = 0;
  let nextId = 1;
  const timers = new Map();

  window.setTimeout = (fn, ms = 0, ...args) => {
    const id = nextId++;
    timers.set(id, { at: now + Number(ms || 0), fn, args });
    return id;
  };
  window.clearTimeout = (id) => {
    timers.delete(id);
  };

  // Move time forward by `ms`, running any timers that come due, in order
  window.__tick = (ms) => {
    const target = now + ms;
    while (true) {
      let nextTimer = null;
      let nextTimerId = null;
      for (const [id, t] of timers) {
        if (t.at <= target && (!nextTimer || t.at < nextTimer.at)) {
          nextTimer = t;
          nextTimerId = id;
        }
      }
      if (!nextTimer) break;
      now = nextTimer.at;
      timers.delete(nextTimerId);
      nextTimer.fn(...nextTimer.args);
    }
    now = target;
  };
}

// Build one fresh page from the user's code
function buildPage({ html, css, js }) {
  const pageSource = `
    <html>
      <head><style>${css}</style></head>
      <body>${html}<script>${js}</script></body>
    </html>
  `;
  return new JSDOM(pageSource, {
    runScripts: "dangerously",
    beforeParse: installFakeClock,
  });
}

function gradeSubmission(challengeId, code) {
  const tests = challengeTests[challengeId];
  if (!tests) {
    throw new Error("No tests found for challenge " + challengeId);
  }

  const results = tests.map((test) => {
    const dom = buildPage(code); // fresh page for EVERY test
    let passed = false;
    try {
      passed =
        test.run({ document: dom.window.document, window: dom.window }) === true;
    } catch (err) {
      passed = false; // a crash counts as a fail
    }
    dom.window.close();
    return { name: test.name, passed };
  });

  const passedCount = results.filter((r) => r.passed).length;
  return {
    results,
    passedCount,
    total: results.length,
    allPassed: passedCount === results.length,
  };
}

module.exports = { gradeSubmission };