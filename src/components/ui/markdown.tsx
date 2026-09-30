import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders post bodies. Plain-text posts written before markdown support
 * still render correctly: single newlines are kept as line breaks.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  const source = children.replace(/([^\n])\n(?!\n)/g, "$1  \n");
  return (
    <div
      className={cn(
        "prose prose-zinc max-w-none dark:prose-invert prose-headings:font-serif prose-headings:tracking-tight",
        "prose-a:text-brand-700 dark:prose-a:text-brand-300 prose-img:rounded-xl prose-pre:rounded-xl",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
