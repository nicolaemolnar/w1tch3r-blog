import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";

type DirectiveNode = {
  type: "textDirective" | "leafDirective" | "containerDirective";
  name?: string;
  data?: Record<string, unknown>;
};

const remarkUnderlineDirective: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node: unknown) => {
      const n = node as DirectiveNode;

      // :u[text]
      if (n?.type === "textDirective" && n.name === "u") {
        n.data = n.data ?? {};
        (n.data as any).hName = "u";
      }
    });
  };
};

export default remarkUnderlineDirective;
