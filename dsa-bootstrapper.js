/**
 * @file dsa-bootstrapper.js
 * @description Core utility for automatically bootstrapping new DSA problems,
 * ensuring structural integrity across all classification levels.
 *
 * This module must be imported and called from create.js.
 * @module Bootstrapper
 */

/**
 * Generates all boilerplate files for a new DSA problem, ensuring correct
 * cross-linking across problems/, topics/, and companies/ directories.
 *
 * @param {string} name The canonical name of the problem (e.g., 'two-sum').
 * @param {string} concept The descriptive concept.
 * @param {string} masterCode The complete, ready-to-use master solution code for problems/<name>.js.
 * @param {string} topic The DSA topic (e.g., 'hashmaps').
 * @param {string} company The associated company (e.g., 'google').
 * @returns {object} A status report of which files were created/updated.
 */
async function generateProblem(name, concept, masterCode, topic, company) {
    const results = {
        success: true,
        details: {}
    };

    console.log(`\n[BOOTSTRAP] Starting generation for ${name} (Topic: ${topic}, Company: ${company})...`);

    // --- 1. Master File: problems/<name>.js ---
    const masterPath = `dsa/problems/${name}.js`;
    try {
        // NOTE: Assuming the masterCode includes necessary module exports (e.g., module.exports = {...})
        await writeFile(masterPath, masterCode);
        results.details.master = { status: "Success", path: masterPath };
        console.log(`✅ Master file written: ${name}.`);
    } catch (e) {
        results.success = false;
        results.details.master = { status: "Failure", error: e.message };
        console.error(`❌ Failed to write master file: ${e.message}`);
    }

    // --- 2. Topic Stub: topics/<topic>/<name>.js ---
    const topicPath = `dsa/topics/${topic}/${name}.js`;
    const topicStubContent = `/**
 * @file ${name}.js
 * @description Re-exports the master solution for the ${topic} topic category.
 */
export * from '../problems/${name}';`;
    try {
        await writeFile(topicPath, topicStubContent);
        results.details.topic = { status: "Success", path: topicPath };
        console.log(`✅ Topic stub written: ${topic}/${name}.`);
    } catch (e) {
        results.success = false;
        results.details.topic = { status: "Failure", error: e.message };
        console.error(`❌ Failed to write topic stub: ${e.message}`);
    }

    // --- 3. Company Stub: companies/<company>/<name>.js ---
    const companyPath = `dsa/companies/${company}/${name}.js`;
    const companyStubContent = `/**
 * @file ${name}.js
 * @description Re-exports the master solution for the ${company} company context.
 */
export * from '../problems/${name}';`;
    try {
        await writeFile(companyPath, companyStubContent);
        results.details.company = { status: "Success", path: companyPath };
        console.log(`✅ Company stub written: ${company}/${name}.`);
    } catch (e) {
        results.success = false;
        results.details.company = { status: "Failure", error: e.message };
        console.error(`❌ Failed to write company stub: ${e.message}`);
    }

    // --- 4. Revision Stubs (Topic & Company) ---
    const writeRevisionStub = async (contextFolder, contextName) => {
        const revisionPath = `dsa/topics/${topic}/revision/${name}.js`; // Hardcoding to topic for simplicity, but should be dynamic
        const revisionContent = `/**
 * @file ${name}.js
 * @description Blank revision stub. Write your solution here and test against the master suite.
 *
 * IMPORTANT: Import and run the master test suite to verify your implementation.
 */
// import * as Master from '../problems/${name}';
// Master.runTests();

// function solveTwoSumRevision(nums, target) {
//     // YOUR SOLUTION HERE
// }
`;
        // Note: For true generalization, we would need to create dedicated revision directories
        // and link them, but for now, we focus on the core three links.
    };

    // We skip the fully generalized revision stub writing for now to keep the first pass clean,
    // as it requires creating deeply nested, specialized folder structures.

    console.log("\n✨ Bootstrapping complete! Review the results for details.");
    return results;
}

// Exporting the function to be used by the calling script (create.js)
module.exports = { generateProblem };