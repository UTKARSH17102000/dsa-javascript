/**
 * DSA Template Boilerplate Generator
 * Creates standard structured files for writing and testing new JavaScript DSA solutions.
 * Supports categorizing by Topic and Company, and automatically generates revision practice stubs.
 */

const fs = require("fs");
const path = require("path");
const { styles } = require("./dsa-helpers");

(function main() {
  const args = process.argv.slice(2);
  let problemArg = "";
  let topic = null;
  let company = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--topic" || args[i] === "-t") {
      topic = args[i + 1];
      i++;
    } else if (args[i] === "--company" || args[i] === "-c") {
      company = args[i + 1];
      i++;
    } else if (args[i] === "--help" || args[i] === "-h") {
      printHelp();
      process.exit(0);
    } else if (!problemArg) {
      problemArg = args[i];
    }
  }

  if (!problemArg) {
    console.log(`${styles.red}❌ Error: No problem name specified.${styles.reset}`);
    printHelp();
    process.exit(1);
  }

  // Sanitize problem name
  const problemName = problemArg
    .trim()
    .toLowerCase()
    .replace(/\.js$/, "")
    .replace(/[^a-z0-9-_]/g, "");

  if (!problemName) {
    console.log(`${styles.red}❌ Error: Invalid problem name provided.${styles.reset}`);
    process.exit(1);
  }

  const camelFunctionName = toCamelCase(problemName);
  
  // 1. Create the Master Problem in problems/
  const problemsDir = path.join(process.cwd(), "problems");
  if (!fs.existsSync(problemsDir)) {
    fs.mkdirSync(problemsDir, { recursive: true });
  }

  const masterPath = path.join(problemsDir, `${problemName}.js`);
  const relativeMaster = path.relative(process.cwd(), masterPath);

  // If Master already exists, we will reuse it rather than overwriting it,
  // allowing them to add existing problems to new topics/companies!
  if (!fs.existsSync(masterPath)) {
    const masterTemplate = `const { ListNode, TreeNode, GraphNode } = require("../dsa-helpers");

/**
 * Problem Name: ${problemName.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
 * 
 * Description:
 * Provide a description of the problem here.
 * 
 * Time Complexity:  O( )
 * Space Complexity: O( )
 */
function ${camelFunctionName}() {
  // Write your solution here
  
}

// Test cases list
const tests = [
  {
    input: [],
    expected: null
  }
];

module.exports = {
  solution: ${camelFunctionName},
  tests
};
`;
    fs.writeFileSync(masterPath, masterTemplate, "utf8");
    console.log(`\n${styles.green}✓ Created Master solution file:${styles.reset} ${styles.bright}${relativeMaster}${styles.reset}`);
  } else {
    console.log(`\n${styles.yellow}ℹ️  Master solution already exists:${styles.reset} ${styles.bright}${relativeMaster}${styles.reset} (reusing it)`);
  }

  // 2. Create Topic categorization and stubs
  if (topic) {
    const topicSanitized = topic.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    createClassification("topics", topicSanitized, problemName, camelFunctionName);
  }

  // 3. Create Company categorization and stubs
  if (company) {
    const companySanitized = company.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    createClassification("companies", companySanitized, problemName, camelFunctionName);
  }

  console.log(`\n${styles.green}${styles.bright}✓ Success! Problem bootstrapping completed.${styles.reset}`);
  console.log(`${styles.gray}To execute tests, simply run:${styles.reset}`);
  console.log(`  ${styles.cyan}npm run solve ${problemName}${styles.reset}\n`);
})();

function printHelp() {
  console.log(`
${styles.cyan}${styles.bright}⚡ local-dsa-creator ⚡${styles.reset}
Instantly bootstraps standard files for writing and testing DSA problems.
Automatically configures multi-tier directories and revision practice files.

${styles.bright}Usage:${styles.reset}
  npm run new <problem-name> [options]
  node create.js <problem-name> [options]

${styles.bright}Options:${styles.reset}
  -t, --topic <topic-name>       Categorize problem under a specific DSA topic directory (e.g. graphs, dp).
  -c, --company <company-name>   Categorize problem under a specific company directory (e.g. google, amazon).

${styles.bright}Examples:${styles.reset}
  npm run new two-sum -- -t arrays -c google
  node create.js unique-paths --topic dp --company amazon
`);
}

/**
 * Creates Topic or Company folder structures and linking stubs
 */
function createClassification(type, category, problemName, camelFunctionName) {
  const categoryDir = path.join(process.cwd(), type, category);
  const revisionDir = path.join(categoryDir, "revision");
  
  if (!fs.existsSync(revisionDir)) {
    fs.mkdirSync(revisionDir, { recursive: true });
    console.log(`${styles.gray}Created directory: ${type}/${category}/revision/${styles.reset}`);
  }

  // Classification Stub file (links and re-exports the master)
  const stubPath = path.join(categoryDir, `${problemName}.js`);
  const relativeStub = path.relative(process.cwd(), stubPath);
  
  if (!fs.existsSync(stubPath)) {
    const stubTemplate = `// Classification file for topic/company linking
// Simply imports and re-exports the master problem implementation
module.exports = require("../../problems/${problemName}.js");
`;
    fs.writeFileSync(stubPath, stubTemplate, "utf8");
    console.log(`${styles.green}✓ Created ${type} linking stub:${styles.reset} ${styles.bright}${relativeStub}${styles.reset}`);
  }

  // Revision Practice Stub file (blank practice workbook linking master tests)
  const revisionPath = path.join(revisionDir, `${problemName}.js`);
  const relativeRevision = path.relative(process.cwd(), revisionPath);

  if (!fs.existsSync(revisionPath)) {
    const revisionTemplate = `const { ListNode, TreeNode, GraphNode } = require("../../../dsa-helpers");
// Import the test cases directly from the master problem definition!
const { tests } = require("../${problemName}.js");

/**
 * Practice Session: ${problemName.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase())} (${type}/${category})
 * 
 * Re-code your solution from scratch below and run the tests to verify correctness!
 */
function ${camelFunctionName}() {
  // PRACTICE SOLUTION HERE
  
}

module.exports = {
  solution: ${camelFunctionName},
  tests
};
`;
    fs.writeFileSync(revisionPath, revisionTemplate, "utf8");
    console.log(`${styles.green}✓ Created practice revision stub:${styles.reset} ${styles.bright}${relativeRevision}${styles.reset}`);
  }
}

/**
 * Converts a kebab-case or snake_case string to camelCase
 */
function toCamelCase(str) {
  return str
    .replace(/[-_]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+(.)/g, (match, group) => group.toUpperCase())
    .replace(/\s+/g, "")
    .replace(/^(.)/, (match, group) => group.toLowerCase());
}
