const { Worker } = require("worker_threads");
const path = require("path");


function gradeInWorker(
  challengeId,
  code,
  { startupMs = 30000, gradingMs = 8000 } = {}
) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "gradeWorker.js"), {
      env: {},                                          // worker gets no secrets
      resourceLimits: { maxOldGenerationSizeMb: 128 },  // memory cap
    });

    const startedAt = Date.now();
    let readyAt = null;
    let finished = false;
    let timer = setTimeout(
      () => fail("The grader took too long to start. Please try again."),
      startupMs
    );

    function finish(settle, value) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      settle(value);
    }
    const fail = (message) => finish(reject, new Error(message));

    worker.on("message", (msg) => {
      if (msg.type === "ready") {
        readyAt = Date.now();
        console.log(`grader worker ready after ${readyAt - startedAt} ms`);
        clearTimeout(timer);
        // The infinite-loop clock only starts now, when the real work begins
        timer = setTimeout(
          () => fail("Grading timed out. Does your code have an infinite loop?"),
          gradingMs
        );
        worker.postMessage({ challengeId, code });
      } else if (msg.type === "result") {
        console.log(`grading took ${Date.now() - readyAt} ms`);
        msg.ok ? finish(resolve, msg.result) : fail(msg.message);
      }
    });

    worker.on("error", (err) => fail("Grading failed: " + err.message));
    worker.on("exit", () => fail("The grader stopped unexpectedly."));
  });
}

module.exports = { gradeInWorker };