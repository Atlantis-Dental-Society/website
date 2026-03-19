interface ArticleRendererProps {
  body: string;
}

export function ArticleRenderer({ body }: ArticleRendererProps) {
  return (
    <div className="mt-10 text-muted-foreground">
      {body.split("\n\n").map((paragraph, i) => {
        if (paragraph.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-10 mb-4 text-xl font-extrabold text-foreground">
              {paragraph.replace("## ", "")}
            </h2>
          );
        }
        if (paragraph.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-8 mb-3 text-lg font-bold text-foreground">
              {paragraph.replace("### ", "")}
            </h3>
          );
        }
        if (paragraph.startsWith("- ")) {
          const items = paragraph.split("\n").filter(Boolean);
          return (
            <ul key={i} className="my-5 space-y-2.5 pl-2">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-sm leading-relaxed">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/40" />
                  <span>{item.replace(/^- \*\*(.+?)\*\*/, "$1").replace(/^- /, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="my-5 text-sm leading-relaxed">
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}
