# 🤖 AI Prompt Guide for Ingesting Custom Problems

This guide contains a highly optimized, copy-pasteable prompt template that you can give to any AI assistant (including me!) whenever you want to add a new problem to this environment. 

By using this prompt, the AI will automatically create:
1. The **Master Solution** file inside `problems/` with a clean optimal solution and a complete set of LeetCode-style test cases (using `ListNode`, `TreeNode`, `GraphNode`, or 2D Matrices where appropriate).
2. The **Category Linking Stubs** under the chosen `topics/` and `companies/` folders.
3. The **Practice Revision Stubs** under the corresponding `revision/` folders (importing the master test suite so you can practice coding it from scratch).

---

## 📋 AI Prompt Template

Copy and paste the box below into your chat interface, fill in the placeholder values at the bottom, and the AI will take care of the rest!

````text
Act as a premium agentic software engineer. I want you to integrate a new DSA problem into my local JavaScript DSA environment. 

Please read the problem description provided below and generate all files necessary following the exact structural guidelines of my environment.

### 📐 Directory & Stub Guidelines:
1. Create a Master file in "problems/<problem-name>.js" containing:
   - Functional signature.
   - The optimal, fully-commented JavaScript solution.
   - Time and space complexity annotations.
   - An array of at least 3 high-quality test cases including standard examples and tricky edge cases (e.g. empty arrays, extreme bounds, negative numbers).
   - Export both the solution function and tests: module.exports = { solution, tests }.

2. If a Topic category is provided, create:
   - A folder "topics/<topic-name>/" and "topics/<topic-name>/revision/" (if they do not exist).
   - A linking file in "topics/<topic-name>/<problem-name>.js" that simply imports and re-exports the master:
     module.exports = require("../../problems/<problem-name>.js");
   - A revision practice file in "topics/<topic-name>/revision/<problem-name>.js" containing a blank practice stub of the function, which imports the tests array from the linking file:
     const { ListNode, TreeNode, GraphNode } = require("../../../dsa-helpers");
     const { tests } = require("../<problem-name>.js");
     function <camelCaseFunctionName>() {
       // PRACTICE SOLUTION HERE
     }
     module.exports = { solution: <camelCaseFunctionName>, tests };

3. If a Company category is provided, create:
   - A folder "companies/<company-name>/" and "companies/<company-name>/revision/" (if they do not exist).
   - A linking file in "companies/<company-name>/<problem-name>.js" that simply imports and re-exports the master:
     module.exports = require("../../problems/<problem-name>.js");
   - A revision practice file in "companies/<company-name>/revision/<problem-name>.js" containing a blank practice stub of the function, which imports the tests array from the linking file:
     const { ListNode, TreeNode, GraphNode } = require("../../../dsa-helpers");
     const { tests } = require("../<problem-name>.js");
     function <camelCaseFunctionName>() {
       // PRACTICE SOLUTION HERE
     }
     module.exports = { solution: <camelCaseFunctionName>, tests };

### 📦 Data Structures Guidelines:
- If the problem involves standard arrays, objects, or primitive inputs, specify inputs normally.
- If it involves a Singly Linked List, use ListNode helper conversions:
  - Input: ListNode.arrayToList([1, 2, 3])
  - Expected: ListNode.arrayToList([3, 2, 1])
- If it involves a Binary Tree, use TreeNode helper conversions (using LeetCode level-order BFS array serialization with null placeholders):
  - Input: TreeNode.arrayToTree([4, 2, 7, 1, 3, null, 9])
- If it involves a Graph, use GraphNode helper conversions (representing undirected graphs using standard 1-indexed adjacency lists):
  - Input: GraphNode.adjListToGraph([[2,4],[1,3],[2,4],[1,3]])
- If it is a Dynamic Programming grid or Graph 2D matrix problem, design the solution to calculate and return the full 2D array matrix grid, allowing my visual matrix table formatter to print the aligned table directly in the console!

---

### 📝 Problem Specifications:

- **Problem File Name (kebab-case):** <insert-kebab-case-name, e.g. clone-graph>
- **Target Topic (optional):** <insert-topic, e.g. graphs, dp, arrays, trees>
- **Target Company (optional):** <insert-company, e.g. google, meta, amazon>
- **Problem Statement & Details:** 
<insert-leetcode-link-or-paste-text-here>
````
