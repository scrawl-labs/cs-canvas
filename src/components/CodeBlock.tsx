"use client";

const JAVA_KEYWORDS = new Set([
  "class", "interface", "enum", "extends", "implements", "package", "import",
  "public", "private", "protected", "static", "final", "abstract", "synchronized",
  "void", "int", "long", "short", "byte", "double", "float", "char", "boolean",
  "return", "if", "else", "for", "while", "do", "break", "continue", "switch", "case", "default",
  "new", "this", "super", "null", "true", "false",
  "try", "catch", "finally", "throw", "throws", "instanceof",
]);

// SQL keywords (treated case-insensitively at lookup)
const SQL_KEYWORDS = new Set([
  "select", "from", "where", "join", "left", "right", "inner", "outer", "full", "cross",
  "on", "as", "and", "or", "not", "is", "null", "in", "between", "like",
  "group", "by", "order", "limit", "offset", "having", "distinct", "asc", "desc",
  "insert", "into", "values", "update", "set", "delete", "create", "table", "drop", "alter",
  "primary", "key", "foreign", "references", "index", "view", "with", "case", "when", "then", "else", "end",
  "union", "all", "exists", "explain", "analyze",
]);

const SQL_FUNCS = new Set(["count", "sum", "avg", "min", "max", "coalesce", "nullif", "cast"]);

// Python keywords (for any leftover python-style snippets)
const PY_KEYWORDS = new Set([
  "def", "class", "from", "import", "as", "if", "elif", "else", "for", "while", "in", "not",
  "and", "or", "return", "yield", "pass", "break", "continue", "True", "False", "None",
  "try", "except", "finally", "raise", "with", "lambda", "global", "nonlocal", "is", "self",
]);

const JAVA_TYPES = new Set([
  // primitives wrappers
  "String", "Integer", "Long", "Double", "Float", "Character", "Boolean", "Object",
  // collections
  "List", "ArrayList", "LinkedList", "Map", "HashMap", "TreeMap", "Set", "HashSet", "TreeSet",
  "Queue", "Deque", "ArrayDeque", "PriorityQueue", "Stack", "Collection",
  // util
  "Comparator", "Comparable", "Iterator", "Iterable", "Optional",
  "Math", "System", "Arrays", "Collections", "Objects",
  "IllegalStateException", "IllegalArgumentException", "RuntimeException", "Exception",
  // project-local types
  "Node", "TrieNode", "ListNode", "TreeNode", "AVLNode", "RBNode", "MinHeap", "MaxHeap",
  "BST", "AVLTree", "RBTree", "Trie", "Result", "Problem", "State", "Choice", "Row", "Task",
  "Color", "Heap",
]);

interface Token {
  text: string;
  className: string;
}

function tokenize(code: string, language: string): Token[] {
  const lang = language.toLowerCase();
  const isSQL = lang === "sql";
  const isPy = lang === "python" || lang === "py";

  const tokens: Token[] = [];
  const n = code.length;
  let i = 0;

  while (i < n) {
    const c = code[i];

    // Line comment // or #
    if ((c === "/" && code[i + 1] === "/") || c === "#") {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      tokens.push({ text: code.slice(i, stop), className: "text-zinc-500 italic" });
      i = stop;
      continue;
    }

    // Block comment /* */
    if (c === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      tokens.push({ text: code.slice(i, stop), className: "text-zinc-500 italic" });
      i = stop;
      continue;
    }

    // Double-quoted string
    if (c === '"') {
      let j = i + 1;
      while (j < n && code[j] !== '"') {
        if (code[j] === "\\" && j + 1 < n) j += 2;
        else j++;
      }
      const stop = j < n ? j + 1 : j;
      tokens.push({ text: code.slice(i, stop), className: "text-emerald-300" });
      i = stop;
      continue;
    }

    // Single-quoted (char literal)
    if (c === "'") {
      let j = i + 1;
      while (j < n && code[j] !== "'") {
        if (code[j] === "\\" && j + 1 < n) j += 2;
        else j++;
      }
      const stop = j < n ? j + 1 : j;
      tokens.push({ text: code.slice(i, stop), className: "text-emerald-300" });
      i = stop;
      continue;
    }

    // Number (int / float / hex)
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9.xXa-fA-F_LlFfDd]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), className: "text-amber-300" });
      i = j;
      continue;
    }

    // Identifier / keyword / type
    if (/[a-zA-Z_$]/.test(c)) {
      let j = i;
      while (j < n && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      const lower = word.toLowerCase();

      let className = "text-zinc-200";
      if (isSQL) {
        if (SQL_KEYWORDS.has(lower)) className = "text-violet-400";
        else if (SQL_FUNCS.has(lower)) className = "text-yellow-300";
        else if (/^[A-Z][A-Za-z0-9_]*$/.test(word)) className = "text-cyan-300";
      } else if (isPy) {
        if (PY_KEYWORDS.has(word)) className = "text-violet-400";
        else if (JAVA_TYPES.has(word) || /^[A-Z][A-Za-z0-9]*$/.test(word)) className = "text-cyan-300";
        else {
          let k = j;
          while (k < n && /\s/.test(code[k])) k++;
          if (k < n && code[k] === "(") className = "text-yellow-300";
        }
      } else {
        if (JAVA_KEYWORDS.has(word)) {
          className = "text-violet-400";
        } else if (JAVA_TYPES.has(word) || /^[A-Z][A-Za-z0-9]*$/.test(word)) {
          className = "text-cyan-300";
        } else {
          let k = j;
          while (k < n && /\s/.test(code[k])) k++;
          if (k < n && code[k] === "(") className = "text-yellow-300";
        }
      }

      tokens.push({ text: word, className });
      i = j;
      continue;
    }

    // Punctuation / whitespace — group consecutive non-token chars
    let j = i;
    while (j < n && !/[a-zA-Z0-9_$"'\/#]/.test(code[j])) j++;
    if (j === i) j = i + 1;
    tokens.push({ text: code.slice(i, j), className: "text-zinc-500" });
    i = j;
  }

  return tokens;
}

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showHeader?: boolean;
}

export default function CodeBlock({
  code,
  language = "java",
  className = "",
  showHeader = true,
}: CodeBlockProps) {
  const tokens = tokenize(code, language);

  return (
    <div
      className={`relative rounded-lg overflow-hidden border border-zinc-800 bg-[#0d1117] ${className}`}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            {language}
          </span>
          <span className="text-[9px] font-mono text-zinc-600 invisible">.</span>
        </div>
      )}
      <pre className="text-[11px] font-mono leading-relaxed p-4 overflow-x-auto">
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={t.className}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
