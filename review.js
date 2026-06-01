/**
 * DSA Spaced Repetition Review Tracker
 * Tracks your problem review history and calculates next review dates using SM2-inspired intervals.
 *
 * Usage:
 *   npm run review                              → Show today's review dashboard
 *   npm run review <problem-name> -- --rating <easy|medium|hard>  → Log a review
 *   npm run review <problem-name> -- --info     → Show a specific problem's history
 */

const fs = require("fs");
const path = require("path");
const { styles } = require("./dsa-helpers");

const REVIEWS_FILE = path.join(process.cwd(), "reviews.json");

// Interval in days per rating level
const INTERVALS = {
  hard:   1,
  medium: 3,
  easy:   7
};

const RATING_MULTIPLIERS = {
  hard:   1,    // Resets to day 1
  medium: 1.5,  // 1.5x the previous interval
  easy:   2.5   // 2.5x the previous interval
};

function loadReviews() {
  if (!fs.existsSync(REVIEWS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveReviews(data) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function daysDiff(dateStr) {
  const today = new Date(getToday());
  const target = new Date(dateStr);
  return Math.round((today - target) / (1000 * 60 * 60 * 24));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(function main() {
  const args = process.argv.slice(2);
  let problemName = "";
  let rating = null;
  let showInfo = false;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--rating" || args[i] === "-r") && args[i + 1]) {
      rating = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === "--info") {
      showInfo = true;
    } else if (!problemName && !args[i].startsWith("-")) {
      problemName = args[i];
    }
  }

  if (!problemName) {
    showDashboard();
    return;
  }

  if (showInfo) {
    showProblemInfo(problemName);
    return;
  }

  if (rating) {
    logReview(problemName, rating);
    return;
  }

  // Default: show problem info if just a name given
  showProblemInfo(problemName);
})();

// ─── Log a Review ─────────────────────────────────────────────────────────────
function logReview(problemName, rating) {
  const validRatings = ["easy", "medium", "hard"];
  if (!validRatings.includes(rating)) {
    console.log(`${styles.red}❌ Invalid rating "${rating}". Use: easy, medium, or hard${styles.reset}`);
    process.exit(1);
  }

  const reviews = loadReviews();
  const today = getToday();
  const key = problemName.toLowerCase().replace(/\.js$/, "");

  const existing = reviews[key] || {
    problem: key,
    created: today,
    sessions: [],
    interval: 1,
    nextReview: today
  };

  // Compute new interval
  let newInterval;
  if (rating === "hard") {
    newInterval = INTERVALS.hard;
  } else {
    newInterval = Math.ceil((existing.interval || 1) * RATING_MULTIPLIERS[rating]);
  }

  const nextReview = addDays(today, newInterval);

  existing.sessions.push({
    date: today,
    rating,
    interval: newInterval
  });

  existing.interval = newInterval;
  existing.nextReview = nextReview;
  existing.lastReview = today;

  reviews[key] = existing;
  saveReviews(reviews);

  const ratingColor = rating === "easy" ? styles.green : rating === "medium" ? styles.yellow : styles.red;
  const ratingEmoji = rating === "easy" ? "✅" : rating === "medium" ? "🟡" : "🔴";

  console.log(`\n${styles.cyan}${styles.bright}╔══════════════════════════════════════╗${styles.reset}`);
  console.log(`${styles.cyan}${styles.bright}║         Review Logged!               ║${styles.reset}`);
  console.log(`${styles.cyan}${styles.bright}╚══════════════════════════════════════╝${styles.reset}`);
  console.log(`  ${styles.bright}Problem:${styles.reset}     ${styles.white}${key}${styles.reset}`);
  console.log(`  ${styles.bright}Rating:${styles.reset}      ${ratingColor}${ratingEmoji} ${rating.toUpperCase()}${styles.reset}`);
  console.log(`  ${styles.bright}Sessions:${styles.reset}    ${existing.sessions.length}`);
  console.log(`  ${styles.bright}Next Review:${styles.reset} ${styles.yellow}${nextReview}${styles.reset} ${styles.gray}(in ${newInterval} day${newInterval !== 1 ? "s" : ""})${styles.reset}`);
  console.log();
}

// ─── Show Today's Dashboard ────────────────────────────────────────────────────
function showDashboard() {
  const reviews = loadReviews();
  const today = getToday();
  const all = Object.values(reviews);

  if (all.length === 0) {
    console.log(`\n${styles.cyan}${styles.bright}⚡ DSA Spaced Repetition Dashboard${styles.reset}`);
    console.log(`${styles.yellow}No reviews logged yet.${styles.reset}`);
    console.log(`${styles.gray}Start by rating a problem:${styles.reset}`);
    console.log(`  ${styles.cyan}npm run review two-sum -- --rating easy${styles.reset}\n`);
    return;
  }

  const due    = all.filter(p => p.nextReview <= today).sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  const upcoming = all.filter(p => p.nextReview > today).sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  const total  = all.length;
  const totalSessions = all.reduce((s, p) => s + (p.sessions || []).length, 0);
  const masteredCount = all.filter(p => (p.interval || 1) >= 14).length;

  // Header
  console.log(`\n${styles.cyan}${styles.bright}╔═════════════════════════════════════════════════════════╗${styles.reset}`);
  console.log(`${styles.cyan}${styles.bright}║          ⚡ DSA Spaced Repetition Dashboard              ║${styles.reset}`);
  console.log(`${styles.cyan}${styles.bright}╚═════════════════════════════════════════════════════════╝${styles.reset}`);
  console.log(`${styles.dim}  Today: ${today}${styles.reset}\n`);

  // Stats row
  console.log(`  ${styles.bright}📊 Stats:${styles.reset}  ${styles.cyan}${total}${styles.reset} problems tracked  │  ${styles.green}${totalSessions}${styles.reset} total sessions  │  ${styles.yellow}${masteredCount}${styles.reset} mastered (≥14d interval)`);
  console.log(`  ${"─".repeat(58)}`);

  // Due problems
  if (due.length === 0) {
    console.log(`\n  ${styles.green}${styles.bright}🎉 Nothing due today! You're all caught up.${styles.reset}`);
  } else {
    console.log(`\n  ${styles.red}${styles.bright}🔥 Due for Review Today (${due.length})${styles.reset}`);
    console.log(`  ${"─".repeat(58)}`);

    for (const p of due) {
      const overdue = daysDiff(p.nextReview);
      const lastRating = p.sessions.length > 0 ? p.sessions[p.sessions.length - 1].rating : "new";
      const ratingColor = lastRating === "easy" ? styles.green : lastRating === "medium" ? styles.yellow : styles.red;
      const overdueTag = overdue > 0 ? `${styles.red}(${overdue}d overdue)${styles.reset}` : `${styles.green}(due today)${styles.reset}`;

      console.log(`  ${styles.bright}➤ ${styles.white}${p.problem.padEnd(30)}${styles.reset} ${overdueTag}  Last: ${ratingColor}${lastRating}${styles.reset}  Sessions: ${styles.cyan}${p.sessions.length}${styles.reset}`);
    }
  }

  // Upcoming
  if (upcoming.length > 0) {
    const nextFew = upcoming.slice(0, 5);
    console.log(`\n  ${styles.yellow}${styles.bright}📅 Up Next (${upcoming.length} problems scheduled)${styles.reset}`);
    console.log(`  ${"─".repeat(58)}`);
    for (const p of nextFew) {
      const daysAway = -daysDiff(p.nextReview);
      console.log(`  ${styles.dim}  ${p.problem.padEnd(30)} in ${styles.yellow}${daysAway}d${styles.reset}${styles.dim} (${p.nextReview})${styles.reset}`);
    }
    if (upcoming.length > 5) {
      console.log(`  ${styles.dim}  ... and ${upcoming.length - 5} more${styles.reset}`);
    }
  }

  // Footer
  console.log(`\n  ${styles.gray}To log a review: npm run review <name> -- --rating <easy|medium|hard>${styles.reset}`);
  console.log(`  ${styles.gray}To see a problem's history: npm run review <name> -- --info${styles.reset}\n`);
}

// ─── Show Single Problem Info ──────────────────────────────────────────────────
function showProblemInfo(problemName) {
  const reviews = loadReviews();
  const key = problemName.toLowerCase().replace(/\.js$/, "");
  const p = reviews[key];

  if (!p) {
    console.log(`\n${styles.yellow}⚠️  No review history found for "${key}".${styles.reset}`);
    console.log(`${styles.gray}Log your first review:${styles.reset}`);
    console.log(`  ${styles.cyan}npm run review ${key} -- --rating <easy|medium|hard>${styles.reset}\n`);
    return;
  }

  const today = getToday();
  const isDue = p.nextReview <= today;
  const daysAway = -daysDiff(p.nextReview);

  console.log(`\n${styles.cyan}${styles.bright}╔═══════════════════════════════════════════════╗${styles.reset}`);
  console.log(`${styles.cyan}${styles.bright}║  Problem Review History                       ║${styles.reset}`);
  console.log(`${styles.cyan}${styles.bright}╚═══════════════════════════════════════════════╝${styles.reset}`);
  console.log(`  ${styles.bright}Problem:${styles.reset}       ${styles.white}${p.problem}${styles.reset}`);
  console.log(`  ${styles.bright}First Added:${styles.reset}   ${styles.gray}${p.created}${styles.reset}`);
  console.log(`  ${styles.bright}Total Sessions:${styles.reset} ${styles.cyan}${p.sessions.length}${styles.reset}`);
  console.log(`  ${styles.bright}Current Interval:${styles.reset} ${styles.yellow}${p.interval}d${styles.reset}`);
  console.log(`  ${styles.bright}Next Review:${styles.reset}   ${isDue ? styles.red : styles.green}${p.nextReview}${styles.reset} ${isDue ? "(DUE!)" : `(in ${daysAway}d)`}`);

  if (p.sessions.length > 0) {
    console.log(`\n  ${styles.bright}Session History:${styles.reset}`);
    console.log(`  ${"─".repeat(44)}`);
    p.sessions.slice(-10).forEach((s, i) => {
      const ratingColor = s.rating === "easy" ? styles.green : s.rating === "medium" ? styles.yellow : styles.red;
      const emoji = s.rating === "easy" ? "✅" : s.rating === "medium" ? "🟡" : "🔴";
      console.log(`  ${styles.dim}${String(i + 1).padStart(2)}.${styles.reset} ${s.date}  ${emoji} ${ratingColor}${s.rating.padEnd(7)}${styles.reset}  Next: +${s.interval}d`);
    });
  }
  console.log();
}
