import { isValidElement, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkUnderlineDirective from "../plugins/remarkUnderlineDirective";
import { getCodeTheme, getHighlighterLanguage } from "../lib/codeHighlightThemes";

type Props = {
  content: string;
  resolveImageSrc: (src: string) => string;
};

const LINE_NUMBERS_FROM = 12;

function normalizeCodeText(value: unknown) {
  const text = String(value ?? "");
  return text.replace(/\n$/, "");
}

function getLanguage(className?: string) {
  const match = /language-([\w-]+)/.exec(className ?? "");
  return (match?.[1] ?? "text").toLowerCase();
}

function getLanguageLabel(language: string) {
  if (language === "js") return "JavaScript";
  if (language === "ts") return "TypeScript";
  if (language === "py") return "Python";
  if (language === "sh") return "Shell";
  if (language === "bash") return "Bash";
  if (language === "md") return "Markdown";
  return language.toUpperCase();
}

function extractCodeFromPre(children: ReactNode) {
  const first = Array.isArray(children) ? children[0] : children;
  if (!isValidElement(first)) return null;

  const props = first.props as { className?: string; children?: unknown };
  return {
    className: props.className,
    text: normalizeCodeText(props.children),
  };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="mdCodeCopy" onClick={onCopy} aria-label="Copiar bloque de codigo">
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export default function MarkdownRenderer({ content, resolveImageSrc }: Props) {
  const markdownComponents = useMemo(
    () => ({
      img: ({ src = "", alt = "", ...props }: { src?: string; alt?: string }) => (
        <img src={resolveImageSrc(src)} alt={alt} loading="lazy" {...props} />
      ),
      pre: ({ children }: { children: ReactNode }) => {
        const extracted = extractCodeFromPre(children);
        if (!extracted) return <pre>{children}</pre>;

        const language = getLanguage(extracted.className);
        const highlighterLanguage = getHighlighterLanguage(language);
        const codeText = extracted.text;
        const lines = codeText ? codeText.split("\n").length : 0;
        const showLineNumbers = lines >= LINE_NUMBERS_FROM;
        const codeStyle = getCodeTheme(language);

        return (
          <div className="mdCodeBlock">
            <div className="mdCodeTop">
              <span className="mdCodeLang">{getLanguageLabel(language)}</span>
              <CopyButton text={codeText} />
            </div>

            <SyntaxHighlighter
              language={highlighterLanguage}
              style={codeStyle}
              showLineNumbers={showLineNumbers}
              wrapLongLines
              customStyle={{ margin: 0, borderRadius: 0, background: "transparent" }}
              codeTagProps={{ style: { fontSize: "0.92rem" } }}
            >
              {codeText}
            </SyntaxHighlighter>
          </div>
        );
      },
      code: ({ className, children, ...props }: any) => (
        <code className={className} {...props}>
          {children}
        </code>
      ),
    }),
    [resolveImageSrc]
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkUnderlineDirective]}
      rehypePlugins={[rehypeSlug]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
