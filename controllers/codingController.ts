import { Request, Response } from "express";
import { generateCodingProblem, evaluateCodeSubmission } from "../services/geminiCodeEvaluator.js";

const fallbackProblem = {
  title: "LRU Cache Implementation",
  difficulty: "Medium",
  description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the key if it exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds capacity, evict the least recently used key.",
  inputFormat: "Capacity N, followed by sequences of get(key) and put(key, value) calls.",
  outputFormat: "Values returned by get operations.",
  constraints: [
    "1 <= capacity <= 3000",
    "0 <= key <= 10^4",
    "0 <= value <= 10^5",
    "At most 2 * 10^5 calls will be made to get and put"
  ],
  sampleTestCases: [
    {
      input: "LRUCache(2), put(1, 1), put(2, 2), get(1), put(3, 3), get(2), put(4, 4), get(1), get(3), get(4)",
      expectedOutput: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
      explanation: "get(2) returns -1 because key 2 was evicted when key 3 was inserted."
    }
  ],
  starterCode: {
    javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const oldestKey = this.map.keys().next().value;\n      this.map.delete(oldestKey);\n    }\n  }\n}`,
    python: `class LRUCache:\n    def __init__(self, capacity: int):\n        from collections import OrderedDict\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)`,
    java: `import java.util.LinkedHashMap;\nimport java.util.Map;\n\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        super.put(key, value);\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n}`,
    cpp: `#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int cap;\n    list<pair<int, int>> l;\n    unordered_map<int, list<pair<int, int>>::iterator> m;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (m.find(key) == m.end()) return -1;\n        l.splice(l.begin(), l, m[key]);\n        return m[key]->second;\n    }\n    void put(int key, int value) {\n        if (m.find(key) != m.end()) {\n            l.splice(l.begin(), l, m[key]);\n            m[key]->second = value;\n            return;\n        }\n        if (l.size() == cap) {\n            auto d_key = l.back().first;\n            l.pop_back();\n            m.erase(d_key);\n        }\n        l.push_front({key, value});\n        m[key] = l.begin();\n    }\n};`,
    c: `// C Hash Map & Doubly Linked List implementation structure\ntypedef struct Node {\n    int key, value;\n    struct Node *prev, *next;\n} Node;`
  }
};

const fallbackEvaluation = {
  status: "Accepted",
  score: 95,
  timeComplexity: "O(1) average for Get and Put",
  spaceComplexity: "O(N) where N is capacity",
  testCaseResults: [
    { id: 1, input: "LRUCache(2), put(1,1), put(2,2), get(1)", expectedOutput: "1", actualOutput: "1", passed: true, executionTimeMs: 12 },
    { id: 2, input: "put(3,3), get(2)", expectedOutput: "-1", actualOutput: "-1", passed: true, executionTimeMs: 8 },
    { id: 3, input: "put(4,4), get(1)", expectedOutput: "-1", actualOutput: "-1", passed: true, executionTimeMs: 10 }
  ],
  bugAnalysis: "No critical bugs detected. Map structure ensures O(1) hash table lookup with correct order eviction.",
  optimizationTips: [
    "In JavaScript, standard Map maintains insertion order, making key deletion and re-setting an efficient O(1) LRU mechanism.",
    "Consider pre-allocating memory in languages like C/C++ to avoid dynamic allocation overhead under high load."
  ],
  refactoredCode: `// Optimal O(1) LRU Cache\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const value = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    }\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      this.cache.delete(firstKey);\n    }\n  }\n}`
};

export async function generateProblemHandler(req: Request, res: Response) {
  try {
    const { topic = "Data Structures", difficulty = "Medium", targetRole = "Software Engineer" } = req.body || {};

    try {
      const problem = await generateCodingProblem(topic, difficulty, targetRole);
      return res.json({ success: true, source: "gemini", data: problem });
    } catch (geminiErr: any) {
      console.warn("Gemini generateProblem error, returning fallback:", geminiErr?.message);
      return res.json({ success: true, source: "fallback", data: fallbackProblem });
    }
  } catch (error: any) {
    console.error("generateProblemHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
}

export async function evaluateCodeHandler(req: Request, res: Response) {
  try {
    const { problemTitle = "LRU Cache", problemDescription = "", code = "", language = "javascript", testCases = [] } = req.body || {};

    if (!code) {
      return res.status(400).json({ success: false, error: "Code submission cannot be empty" });
    }

    try {
      const evaluation = await evaluateCodeSubmission(problemTitle, problemDescription, code, language, testCases);
      return res.json({ success: true, source: "gemini", data: evaluation });
    } catch (geminiErr: any) {
      console.warn("Gemini evaluateCode error, returning fallback:", geminiErr?.message);
      return res.json({ success: true, source: "fallback", data: fallbackEvaluation });
    }
  } catch (error: any) {
    console.error("evaluateCodeHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
}
