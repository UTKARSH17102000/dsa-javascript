/**
 * DSA Local Test Runner
 * Finds and executes Javascript DSA snippets against multiple test cases with beautiful terminal visualization.
 */

const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");
const { styles, deepEqual, formatValue } = require("./dsa-helpers");

// Main execution block
(async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  // Parse arguments
  let searchName = "";
  let customInputStr = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") {
      customInputStr = args[i + 1];
      i++; // Skip next arg
    } else if (args[i] === "--help" || args[i] === "-h") {
      printHelp();
      process.exit(0);
    } else if (!searchName) {
      searchName = args[i];
    }
  }

  if (!searchName) {
    console.log(`${styles.red}❌ Error: No problem name specified.${styles.reset}`);
    printHelp();
    process.exit(1);
  }

  // 1. Locate matching files in the workspace (supporting path searches)
  console.log(`${styles.gray}Searching for "${searchName}" in workspace...${styles.reset}`);
  const matches = findProblemFiles(process.cwd(), searchName);

  if (matches.length === 0) {
    console.log(`${styles.red}${styles.bright}❌ Error: Could not find any JS file matching "${searchName}"${styles.reset}`);
    console.log(`${styles.yellow}Tip: Make sure the file exists and has a .js extension.${styles.reset}`);
    process.exit(1);
  }

  let selectedFile = matches[0];

  // If there are multiple matches, print a clean summary to the user
  if (matches.length > 1) {
    console.log(`\n${styles.cyan}🔍 Found multiple files matching "${searchName}":${styles.reset}`);
    matches.forEach((f, idx) => {
      const relPath = path.relative(process.cwd(), f);
      const label = f.includes("revision") ? " [Practice Revision]" :
                    f.includes("problems") ? " [Master Solution]" : " [Topic/Company Stub]";
      
      const dot = idx === 0 ? `${styles.green}➔ ${idx + 1}.${styles.reset}` : `   ${idx + 1}.`;
      const color = idx === 0 ? styles.bright : styles.dim;
      console.log(`${dot} ${color}${relPath}${styles.reset}${styles.yellow}${label}${styles.reset}`);
    });
    
    console.log(`\n${styles.gray}⚡ Running priority match: ${styles.bright}${path.relative(process.cwd(), selectedFile)}${styles.reset}`);
    console.log(`${styles.gray}💡 Tip: To target a different one, pass a more specific path (e.g., solve revision/${searchName})${styles.reset}\n`);
  }

  const relativePath = path.relative(process.cwd(), selectedFile);

  // 2. Import the problem file
  let problemModule;
  try {
    // Clear node cache to allow running freshly updated files in the same process environment
    delete require.cache[require.resolve(path.resolve(selectedFile))];
    problemModule = require(path.resolve(selectedFile));
  } catch (error) {
    printErrorBox("Error Loading File", error);
    process.exit(1);
  }

  // 3. Extract solution and tests
  let solution = problemModule.solution || problemModule.solve || problemModule.default;
  let tests = problemModule.tests;

  // Fallback: If module exports a function directly, treat it as the solution
  if (typeof problemModule === "function") {
    solution = problemModule;
  }

  // Fallback: If no explicit solution, search exported properties for any function
  if (!solution) {
    for (const key in problemModule) {
      if (typeof problemModule[key] === "function") {
        solution = problemModule[key];
        break;
      }
    }
  }

  // 4. Handle plain scripts (no exports)
  if (!solution) {
    console.log(`${styles.yellow}⚠️  No exported solution function found in ${relativePath}.`);
    console.log(`Executed the file directly as a plain script.${styles.reset}\n`);
    process.exit(0);
  }

  // 5. Handle custom input override
  if (customInputStr !== null) {
    runCustomInput(solution, customInputStr);
    process.exit(0);
  }

  // 6. Run test suite
  if (!tests || !Array.isArray(tests)) {
    console.log(`${styles.yellow}⚠️  No "tests" array exported. Running solution with empty arguments...${styles.reset}`);
    try {
      const start = performance.now();
      const result = solution();
      const end = performance.now();
      console.log(`\n${styles.bright}Result:${styles.reset} ${formatValue(result)}`);
      console.log(`${styles.gray}Execution time: ${(end - start).toFixed(4)}ms${styles.reset}`);
    } catch (error) {
      printErrorBox("Execution Error", error);
    }
    process.exit(0);
  }

  runTestSuite(solution, tests, relativePath);
})();

/**
 * Print CLI Help message
 */
function printHelp() {
  console.log(`
${styles.cyan}${styles.bright}⚡ local-dsa-runner ⚡${styles.reset}
A premium terminal environment for running and testing JavaScript DSA snippets.

${styles.bright}Usage:${styles.reset}
  npm run solve <problem-name-or-path> [options]
  node run.js <problem-name-or-path> [options]

${styles.bright}Options:${styles.reset}
  -i, --input "<json_arg_or_args>"   Run the solution with custom input (as a JSON array).
  -h, --help                         Show this help menu.

${styles.bright}Examples:${styles.reset}
  npm run solve two-sum
  npm run solve arrays/revision/two-sum
  npm run solve unique-paths -- --input "[3, 7]"
`);
}

/**
 * Fuzzy finder to locate JS files matching search term
 */
function findProblemFiles(dir, searchName) {
  const files = [];

  function walk(currentDir) {
    const ignoreDirs = ["node_modules", ".git", ".gemini", ".system_generated", "scratch"];
    if (ignoreDirs.some(d => currentDir.includes(d))) return;

    try {
      const list = fs.readdirSync(currentDir);
      for (const file of list) {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (file.endsWith(".js") && file !== "run.js" && file !== "create.js" && file !== "dsa-helpers.js") {
          files.push(fullPath);
        }
      }
    } catch (err) {
      // Ignore reading errors
    }
  }

  walk(dir);

  const target = searchName.toLowerCase().replace(/\.js$/, "").replace(/\\/g, "/");
  const matches = [];

  for (const f of files) {
    const relativePath = path.relative(dir, f).toLowerCase().replace(/\\/g, "/");
    const baseName = path.basename(f, ".js").toLowerCase();

    // Match 1: Exact matches (priority 1)
    if (baseName === target || relativePath === target) {
      matches.push({ file: f, priority: 1 });
    }
    // Match 2: Partial matches inside the path string (priority 2 or 3)
    else if (relativePath.includes(target)) {
      let priority = 3;
      if (relativePath.startsWith("problems/")) {
        priority = 2; // Master folder prioritized first
      }
      matches.push({ file: f, priority });
    }
  }

  // Sort matches: Priority first, then by shortest file path length (more direct)
  matches.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.file.length - b.file.length;
  });

  return matches.map(m => m.file);
}

/**
 * Standard LeetCode-style argument resolver
 */
function getArgs(solution, input) {
  if (solution.length > 1 && Array.isArray(input)) {
    return input;
  }
  return [input];
}

/**
 * Run the solution with custom CLI input
 */
function runCustomInput(solution, inputStr) {
  console.log(`┌────────────────────────────────────────────────────────┐`);
  console.log(`│               ${styles.yellow}${styles.bright}Running Custom Terminal Input${styles.reset}             │`);
  console.log(`└────────────────────────────────────────────────────────┘`);

  let parsedInput;
  try {
    parsedInput = JSON.parse(inputStr);
  } catch (e) {
    parsedInput = inputStr;
  }

  const args = getArgs(solution, parsedInput);
  console.log(`${styles.bright}Input Args:${styles.reset}`);
  args.forEach((arg, index) => {
    console.log(`  Argument ${index + 1}: ${formatValue(arg)}`);
  });
  console.log(`─`.repeat(58));

  try {
    const start = performance.now();
    const actual = solution(...args);
    const end = performance.now();

    console.log(`${styles.green}${styles.bright}Result:${styles.reset}`);
    console.log(formatValue(actual));
    console.log(`\n${styles.gray}Speed: ${(end - start).toFixed(4)}ms${styles.reset}`);
  } catch (error) {
    printErrorBox("Custom Execution Error", error);
  }
}

/**
 * Run the formal test suite
 */
function runTestSuite(solution, tests, fileName) {
  const total = tests.length;
  let passed = 0;

  // Header Box
  const border = `═`.repeat(Math.min(65, fileName.length + 18));
  console.log(`${styles.cyan}╔${border}╗`);
  console.log(`║ Running Problem: ${styles.bright}${fileName}${styles.reset}${styles.cyan} ║`);
  console.log(`╚${border}╝${styles.reset}\n`);

  tests.forEach((test, index) => {
    const caseNum = index + 1;
    const args = getArgs(solution, test.input);

    console.log(`${styles.bright}Case ${caseNum}:${styles.reset}`);
    
    // Display inputs
    if (args.length === 1) {
      console.log(`  ${styles.dim}Input:${styles.reset}    ${formatValue(args[0])}`);
    } else {
      console.log(`  ${styles.dim}Inputs:${styles.reset}`);
      args.forEach((arg, i) => {
        console.log(`    arg${i + 1}:  ${formatValue(arg)}`);
      });
    }

    let actual;
    let duration = 0;
    let isSuccess = false;
    let executionError = null;

    try {
      const start = performance.now();
      actual = solution(...args);
      const end = performance.now();
      duration = end - start;
      isSuccess = deepEqual(actual, test.expected);
    } catch (error) {
      executionError = error;
    }

    if (executionError) {
      console.log(`  ${styles.red}❌ Error occurred during execution:${styles.reset}`);
      console.log(`    ${styles.red}${executionError.message}${styles.reset}`);
      console.log(`  ${styles.dim}Expected:${styles.reset} ${formatValue(test.expected)}`);
    } else if (isSuccess) {
      passed++;
      console.log(`  ${styles.green}✓ PASS${styles.reset} ${styles.gray}(${duration.toFixed(4)}ms)${styles.reset}`);
      console.log(`  ${styles.dim}Output:${styles.reset}   ${formatValue(actual)}`);
    } else {
      console.log(`  ${styles.red}✗ FAIL${styles.reset} ${styles.gray}(${duration.toFixed(4)}ms)${styles.reset}`);
      console.log(`  ${styles.dim}Expected:${styles.reset} ${formatValue(test.expected)}`);
      console.log(`  ${styles.red}Actual:${styles.reset}   ${formatValue(actual)}`);
    }
    
    console.log(styles.dim + "─".repeat(50) + styles.reset);
  });

  // Footer Summary
  const allPassed = passed === total;
  const summaryColor = allPassed ? styles.green : styles.yellow;
  const emoji = allPassed ? "🎉" : "⚠️";
  
  console.log(`\n${styles.bright}Test Results Summary:${styles.reset}`);
  console.log(`${summaryColor}${styles.bright}${emoji}  ${passed} / ${total} Test Cases Passed${styles.reset}`);
  if (allPassed) {
    console.log(`${styles.green}All tests executed successfully! Excellent work.${styles.reset}\n`);
  } else {
    console.log(`${styles.red}Some test cases failed. Review your logic and try again!${styles.reset}\n`);
  }
}

/**
 * Pretty print an error bounding box
 */
function printErrorBox(title, error) {
  const message = error.stack || error.message || String(error);
  const lines = message.split("\n");
  const maxLen = Math.min(80, Math.max(...lines.map(l => l.length)));
  
  console.log(`\n${styles.red}┌─ ${styles.bright}${title}${styles.reset}${styles.red} ${"─".repeat(Math.max(0, maxLen - title.length - 2))}┐`);
  lines.forEach(line => {
    const displayLine = line.length > 76 ? line.substring(0, 73) + "..." : line;
    console.log(`│ ${styles.reset}${displayLine.padEnd(76)}${styles.red} │`);
  });
  console.log(`└${"─".repeat(78)}┘${styles.reset}\n`);
}
