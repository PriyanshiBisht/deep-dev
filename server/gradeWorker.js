const { parentPort, workerData } = require("worker_threads");
const { gradeSubmission } = require("./grader");

try {
  const result = gradeSubmission(workerData.challengeId, workerData.code);
  parentPort.postMessage({ ok: true, result });
} catch (err) {
  parentPort.postMessage({ ok: false, message: err.message });
}