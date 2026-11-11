const path = require("path");
const { pathToFileURL } = require("url");
const { gradeSubmission } = require("./grader");
const challengeTests = require("./challengeTests");

(async () => {
  const mod = await import(
    pathToFileURL(path.join(__dirname, "../client/src/dummyChallenges.js")).href
  );
  const challenges = mod.default;

  console.log("id  title                    starter   solution   verdict");
  console.log("--  -----------------------  --------  ---------  -------");

  let problems = 0;
  for (const c of challenges) {
    if (!challengeTests[c.id]) {
      console.log(String(c.id).padEnd(3), c.title.padEnd(24), "(no tests yet)");
      continue;
    }
    const starter = gradeSubmission(c.id, c.starterCode);
    const solution = gradeSubmission(c.id, c.solutionCode);

    const problemsHere = [];
    if (!solution.allPassed) problemsHere.push("solution does not pass everything");
    if (starter.allPassed) problemsHere.push("starter already passes");
    if (problemsHere.length) problems++;

    console.log(
      String(c.id).padEnd(3),
      c.title.padEnd(24),
      `${starter.passedCount}/${starter.total}`.padEnd(9),
      `${solution.passedCount}/${solution.total}`.padEnd(10),
      problemsHere.length ? "CHECK: " + problemsHere.join(", ") : "ok"
    );
    if (!solution.allPassed) {
      solution.results.filter((r) => !r.passed).forEach((r) => console.log("      solution fails:", r.name));
    }
  }
  console.log(problems ? `\n${problems} challenge(s) need attention.` : "\nAll challenges look good.");
})();