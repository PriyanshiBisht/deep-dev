const { parentPort } = require("worker_threads");
const { gradeSubmission } = require("./grader"); 


parentPort.postMessage({ type: "ready" });

parentPort.once("message", ({ challengeId, code }) => {
  try {
    const result = gradeSubmission(challengeId, code);
    parentPort.postMessage({ type: "result", ok: true, result });
  } catch (err) {
    parentPort.postMessage({ type: "result", ok: false, message: err.message });
  }
});