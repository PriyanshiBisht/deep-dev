const { Worker } = require("worker_threads");
const path = require("path");

function gradeInWorker(challengeId, code, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "gradeWorker.js"), {
      workerData: { challengeId, code },
      env: {},
      resourceLimits: { maxOldGenerationSizeMb: 128 },
    });

    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error("Grading timed out. Does your code have an infinite loop?"));
    }, timeoutMs);

    worker.once("message", (msg) => {
      clearTimeout(timer);
      worker.terminate();
      msg.ok ? resolve(msg.result) : reject(new Error(msg.message));
    });

    worker.once("error", (err) => {
      clearTimeout(timer);
      reject(new Error("Grading failed: " + err.message));
    });
  });
}

module.exports = { gradeInWorker };