import type { CSSProperties } from "react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type SyntaxTheme = Record<string, CSSProperties>;

const BASE_THEME: SyntaxTheme = atomOneDark as SyntaxTheme;

function withBase(overrides: SyntaxTheme): SyntaxTheme {
  return { ...BASE_THEME, ...overrides };
}

function normalizeLanguage(language: string) {
  const l = (language || "").toLowerCase();
  if (l === "js" || l === "jsx") return "javascript";
  if (l === "ts" || l === "tsx") return "typescript";
  if (l === "py") return "python";
  if (l === "sh" || l === "shell" || l === "zsh") return "bash";
  if (l === "htm" || l === "xhtml") return "html";
  return l || "text";
}

const HTML_THEME = withBase({
  "hljs-keyword": { color: "#ff7b72", fontWeight: "700" },
  "hljs-tag": { color: "#7ee787" },
  "hljs-name": { color: "#79c0ff", fontWeight: "700" },
  "hljs-attr": { color: "#d2a8ff" },
  "hljs-string": { color: "#a5d6ff" },
});

const CSS_THEME = withBase({
  "hljs-selector-tag": { color: "#79c0ff", fontWeight: "700" },
  "hljs-selector-class": { color: "#d2a8ff", fontWeight: "700" },
  "hljs-selector-id": { color: "#ff7b72", fontWeight: "700" },
  "hljs-attribute": { color: "#ffa657" },
  "hljs-number": { color: "#a5d6ff" },
});

const JAVASCRIPT_THEME = withBase({
  "hljs-keyword": { color: "#ff7b72", fontWeight: "700" },
  "hljs-title.function_": { color: "#79c0ff", fontWeight: "700" },
  "hljs-params": { color: "#a5d6ff" },
  "hljs-string": { color: "#a5d6ff" },
  "hljs-number": { color: "#79c0ff" },
});

const TYPESCRIPT_THEME = withBase({
  "hljs-keyword": { color: "#ff7b72", fontWeight: "700" },
  "hljs-built_in": { color: "#d2a8ff" },
  "hljs-type": { color: "#79c0ff", fontWeight: "700" },
  "hljs-title.function_": { color: "#79c0ff", fontWeight: "700" },
  "hljs-string": { color: "#a5d6ff" },
});

const BASH_THEME = withBase({
  "hljs-meta": { color: "#79c0ff", fontWeight: "700" },
  "hljs-built_in": { color: "#ffa657", fontWeight: "700" },
  "hljs-variable": { color: "#d2a8ff" },
  "hljs-string": { color: "#a5d6ff" },
  "hljs-keyword": { color: "#ff7b72", fontWeight: "700" },
});

const PYTHON_THEME = withBase({
  "hljs-keyword": { color: "#ff7b72", fontWeight: "700" },
  "hljs-title.function_": { color: "#79c0ff", fontWeight: "700" },
  "hljs-built_in": { color: "#d2a8ff" },
  "hljs-string": { color: "#a5d6ff" },
  "hljs-number": { color: "#79c0ff" },
  "hljs-comment": { color: "#8b949e", fontStyle: "italic" },
});

const THEMES: Record<string, SyntaxTheme> = {
  html: HTML_THEME,
  css: CSS_THEME,
  javascript: JAVASCRIPT_THEME,
  typescript: TYPESCRIPT_THEME,
  bash: BASH_THEME,
  python: PYTHON_THEME,
};

export function getCodeTheme(language: string): SyntaxTheme {
  const normalized = normalizeLanguage(language);
  return THEMES[normalized] ?? BASE_THEME;
}

export function getHighlighterLanguage(language: string) {
  const normalized = normalizeLanguage(language);
  if (normalized === "html") return "xml";
  return normalized;
}

