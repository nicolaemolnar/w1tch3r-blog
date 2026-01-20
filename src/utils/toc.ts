import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";

export type HeadingInfo = {
  id: string;
  text: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export function extractHeadings(markdown: string): HeadingInfo[] {
  const slugger = new GithubSlugger();
  const tree = unified().use(remarkParse).parse(markdown);

  const headings: HeadingInfo[] = [];
  visit(tree, "heading", (node: any) => {
    const depth = node.depth as number;
    if (depth < 1 || depth > 6) return;

    const text = toString(node).trim();
    if (!text) return;

    const id = slugger.slug(text);
    headings.push({
      id,
      text,
      depth: depth as HeadingInfo["depth"],
    });
  });

  return headings;
}

export function buildTocFromHeadings(headings: HeadingInfo[]): TocItem[] {
  // Puedes ajustar rango; típico: H2–H4
  return headings
    .filter((h) => h.depth >= 2 && h.depth <= 4)
    .map((h) => ({
      id: h.id,
      text: h.text,
      level: h.depth as 2 | 3 | 4,
    }));
}
