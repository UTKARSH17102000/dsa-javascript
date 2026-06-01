/**
 * DSA Mock Interview Mode
 * Simulates a real-time coding interview session with a live countdown timer.
 *
 * Usage:
 *   npm run mock <problem-name>              → Start a 30-minute timed session
 *   npm run mock <problem-name> -- --time 45 → Custom time in minutes
 *
 * During the session:
 *   • Your practice file is opened at: problems/mock-<problem-name>.js
 *   • Write your solution in that file
 *   • Press Ctrl+C (or wait for timer) to submit and auto-test
 */

const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");
const { styles } = require("./dsa-helpers");

const REVIEWS_FILE = path.join(process.cwd(), "reviews.json");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadReviews() {
  if (!fs.existsSync(REVIEWS_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf8")); } catch { return {}; }
}

function saveReviews(data) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function formatTime(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function findProblemFiles(dir, searchName) {
  const files = [];
  const ignoreDirs = ["node_modules", ".git", "scratch", "mock-"];
  function walk(currentDir) {
    if (ignoreDirs.some(d => currentDir.includes(d))) return;
    try {
      const list = fs.readdirSync(currentDir);
      for (const file of list) {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) walk(fullPath);
        else if (file.endsWith(".js") && !["run.js","create.js","dsa-helpers.js","review.js","mock.js","gotchas.js"].includes(file)) {
          files.push(fullPath);
        }
      }
    } catch {}
  }
  walk(dir);
  const target = searchName.toLowerCase().replace(/\.js$/, "");
  for (const f of files) {
    const base = path.basename(f, ".js").toLowerCase();
    if (base === target) return f;
  }
  for (const f of files) {
    const base = path.basename(f, ".js").toLowerCase();
    if (base.includes(target) && f.includes("problems")) return f;
  }
  for (const f of files) {
    const base = path.basename(f, ".js").toLowerCase();
    if (base.includes(target)) return f;
  }
  return null;
}

function runTests(mockFilePath, problemName) {
  const { deepEqual, formatValue } = require("./dsa-helpers");
  const { performance } = require("perf_hooks");

  let problemModule;
  try {
    delete require.cache[require.resolve(path.resolve(mockFilePath))];
    problemModule = require(path.resolve(mockFilePath));
  } catch (err) {
    console.log(`${styles.red}❌ Error loading file: ${err.message}${styles.reset}`);
    return { passed: 0, total: 0 };
  }

  const solution = problemModule.solution || problemModule.solve || problemModule.default;
  const tests = problemModule.tests;

  if (!solution || !tests || !Array.isArray(tests)) {
    console.log(`${styles.yellow}⚠️  No solution or tests found in mock file.${styles.reset}`);
    return { passed: 0, total: 0 };
  }

  let passed = 0;
  const total = tests.length;

  tests.forEach((test, i) => {
    const args = solution.length > 1 && Array.isArray(test.input) ? test.input : [test.input];
    let actual, duration = 0, error = null;
    try {
      const t0 = performance.now();
      actual = solution(...args);
      duration = performance.now() - t0;
      if (deepEqual(actual, test.expected)) passed++;
      else {
        console.log(`  ${styles.red}✗ Case ${i + 1} FAIL${styles.reset} ${styles.gray}(${duration.toFixed(4)}ms)${styles.reset}`);
        console.log(`    Expected: ${formatValue(test.expected)}`);
        console.log(`    Actual:   ${formatValue(actual)}`);
        return;
      }
      console.log(`  ${styles.green}✓ Case ${i + 1} PASS${styles.reset} ${styles.gray}(${duration.toFixed(4)}ms)${styles.reset}`);
    } catch (e) {
      console.log(`  ${styles.red}✗ Case ${i + 1} ERROR: ${e.message}${styles.reset}`);
    }
  });

  return { passed, total };
}

function saveMockAttempt(mockFilePath, problemName) {
  // Preserve the mock attempt with timestamp inside the problems folder
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T");
  const dateStr = timestamp[0];
  const timeStr = timestamp[1].substring(0, 8);
  const preservePath = path.join(process.cwd(), "problems", `mock-${problemName}-${dateStr}.js`);
  try {
    fs.copyFileSync(mockFilePath, preservePath);
    return preservePath;
  } catch {
    return null;
  }
}

function logMockToReviews(problemName) {
  const reviews = loadReviews();
  const today = new Date().toISOString().split("T")[0];
  const key = problemName.toLowerCase();

  const existing = reviews[key] || {
    problem: key,
    created: today,
    sessions: [],
    interval: 1,
    nextReview: today
  };

  existing.sessions = existing.sessions || [];
  existing.sessions.push({
    date: today,
    rating: "mock",
    interval: existing.interval || 1,
    type: "mock"
  });

  reviews[key] = existing;
  saveReviews(reviews);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async function main() {
  const args = process.argv.slice(2);
  let problemName = "";
  let durationMinutes = 30;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--time" || args[i] === "-t") && args[i + 1]) {
      durationMinutes = parseInt(args[i + 1], 10) || 30;
      i++;
    } else if (!problemName && !args[i].startsWith("-")) {
      problemName = args[i];
    }
  }

  if (!problemName) {
    console.log(`\n${styles.cyan}${styles.bright}⚡ Mock Interview Mode${styles.reset}`);
    console.log(`${styles.yellow}Usage: npm run mock <problem-name>${styles.reset}`);
    console.log(`${styles.yellow}       npm run mock <problem-name> -- --time <minutes>${styles.reset}\n`);
    process.exit(0);
  }

  // Find master problem file
  const masterPath = findProblemFiles(process.cwd(), problemName);
  if (!masterPath) {
    console.log(`${styles.red}❌ Problem "${problemName}" not found. Run "npm run new ${problemName}" first.${styles.reset}`);
    process.exit(1);
  }

  // Load master to extract tests (the stub needs to import tests)
  let masterModule;
  try {
    masterModule = require(path.resolve(masterPath));
  } catch (err) {
    console.log(`${styles.red}❌ Error loading master file: ${err.message}${styles.reset}`);
    process.exit(1);
  }

  const sanitizedName = problemName.toLowerCase().replace(/\.js$/, "");
  const camelName = sanitizedName.replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

  // Build the mock practice file
  const mockFilePath = path.join(process.cwd(), "problems", `mock-${sanitizedName}.js`);
  const masterRelative = path.relative(path.dirname(mockFilePath), masterPath).replace(/\\/g, "/");

  const mockTemplate = `const { ListNode, TreeNode, GraphNode, MinHeap, MaxHeap, PriorityQueue } = require("../dsa-helpers");
// Tests imported from master — you are only solving the function!
const { tests } = require("./${path.basename(masterPath)}");

/**
 * 🕐 MOCK INTERVIEW SESSION
 * Problem: ${sanitizedName}
 * 
 * ✏️  Write your solution below from scratch.
 * Run tests anytime with: npm run solve mock-${sanitizedName}
 */
function ${camelName}() {
  // Your solution here

}

module.exports = {
  solution: ${camelName},
  tests
};
`;

  fs.writeFileSync(mockFilePath, mockTemplate, "utf8");

  const durationMs = durationMinutes * 60 * 1000;
  const startTime  = Date.now();
  const endTime    = startTime + durationMs;

  // ── Print Start Screen ────────────────────────────────────────────────────
  console.clear();
  console.log(`${styles.cyan}${styles.bright}`);
  console.log(`╔══════════════════════════════════════════════════════════════════╗`);
  console.log(`║                   ⏱  MOCK INTERVIEW SESSION                     ║`);
  console.log(`╚══════════════════════════════════════════════════════════════════╝`);
  console.log(`${styles.reset}`);
  console.log(`  ${styles.bright}Problem:${styles.reset}    ${styles.white}${sanitizedName}${styles.reset}`);
  console.log(`  ${styles.bright}Time:${styles.reset}       ${styles.yellow}${durationMinutes} minutes${styles.reset}`);
  console.log(`  ${styles.bright}Your File:${styles.reset}  ${styles.cyan}problems/mock-${sanitizedName}.js${styles.reset}`);
  console.log();
  console.log(`  ${styles.green}▶  Open the file above and start coding!${styles.reset}`);
  console.log(`  ${styles.gray}   Run tests anytime: npm run solve mock-${sanitizedName}${styles.reset}`);
  console.log(`  ${styles.yellow}   Press Ctrl+C to submit early when done.${styles.reset}`);
  console.log(`\n  ${"─".repeat(64)}`);

  // ── Live Countdown Bar ────────────────────────────────────────────────────
  let submitted = false;

  function printStatus() {
    const elapsed = Date.now() - startTime;
    const remaining = endTime - Date.now();
    const pct = Math.min(1, elapsed / durationMs);
    const barWidth = 40;
    const filled  = Math.floor(pct * barWidth);
    const empty   = barWidth - filled;

    const color = remaining < 5 * 60 * 1000 ? styles.red : remaining < 10 * 60 * 1000 ? styles.yellow : styles.green;

    const bar = `${color}${"█".repeat(filled)}${styles.dim}${"░".repeat(empty)}${styles.reset}`;
    process.stdout.write(`\r  ${bar}  ${color}${styles.bright}${formatTime(remaining)}${styles.reset} remaining  (${formatTime(elapsed)} elapsed)   `);
  }

  const ticker = setInterval(() => {
    if (submitted) { clearInterval(ticker); return; }
    printStatus();

    if (Date.now() >= endTime) {
      clearInterval(ticker);
      console.log(`\n\n  ${styles.red}${styles.bright}⏰ TIME'S UP!${styles.reset}\n`);
      finalize();
    }
  }, 1000);

  printStatus();

  // ── Ctrl+C Handler (early submit) ─────────────────────────────────────────
  process.on("SIGINT", () => {
    if (submitted) process.exit(0);
    clearInterval(ticker);
    console.log(`\n\n  ${styles.yellow}${styles.bright}✋ Submitted early!${styles.reset}\n`);
    finalize();
  });

  // ── Finalize: Run Tests + Save + Log ─────────────────────────────────────
  function finalize() {
    submitted = true;
    const elapsed = Date.now() - startTime;

    console.log(`  ${styles.cyan}${styles.bright}╔══════════════════════════════════════════════╗${styles.reset}`);
    console.log(`  ${styles.cyan}${styles.bright}║            📊 Mock Session Results           ║${styles.reset}`);
    console.log(`  ${styles.cyan}${styles.bright}╚══════════════════════════════════════════════╝${styles.reset}`);
    console.log(`  ${styles.bright}Problem:${styles.reset}       ${sanitizedName}`);
    console.log(`  ${styles.bright}Time Used:${styles.reset}     ${formatTime(elapsed)} / ${durationMinutes}:00`);
    console.log(`  ${styles.dim}${"─".repeat(44)}${styles.reset}`);
    console.log(`  ${styles.bright}Running Test Cases...${styles.reset}\n`);

    const { passed, total } = runTests(mockFilePath, sanitizedName);

    const allPassed = passed === total;
    const emoji = allPassed ? "🎉" : passed > 0 ? "⚠️ " : "❌";
    const color  = allPassed ? styles.green : passed > 0 ? styles.yellow : styles.red;

    console.log(`\n  ${color}${styles.bright}${emoji}  ${passed} / ${total} Test Cases Passed${styles.reset}`);

    // Save attempt
    const savedPath = saveMockAttempt(mockFilePath, sanitizedName);
    if (savedPath) {
      console.log(`  ${styles.gray}Attempt saved: ${path.relative(process.cwd(), savedPath)}${styles.reset}`);
    }

    // Clean up temp mock file
    try { fs.unlinkSync(mockFilePath); } catch {}

    // Log to review tracker
    logMockToReviews(sanitizedName);
    console.log(`  ${styles.gray}Session logged to review tracker.${styles.reset}`);
    console.log(`\n  ${styles.yellow}Rate this session: npm run review ${sanitizedName} -- --rating <easy|medium|hard>${styles.reset}\n`);

    process.exit(allPassed ? 0 : 1);
  }
})();
