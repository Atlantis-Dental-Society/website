import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string | null;
  badgeIcon?: React.ReactNode;
  badgeClassName?: string;
  headline?: string | null;
  headlineClassName?: string;
  subheadline?: string | null;
  subheadlineClassName?: string;
  centered?: boolean;
  children?: React.ReactNode;
  className?: string;
  blobs?: React.ReactNode;
}

export function PageHero({
  badge,
  badgeIcon,
  badgeClassName = "bg-primary/10 text-primary",
  headline,
  headlineClassName,
  subheadline,
  subheadlineClassName,
  centered = false,
  children,
  className,
  blobs,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden py-24 sm:py-28", className)}>
      {blobs}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
          {badge && (
            <Badge
              variant="secondary"
              className={cn(
                "mb-4 h-auto gap-2 rounded-full px-4 py-2 text-sm font-medium",
                badgeClassName,
              )}
            >
              {badgeIcon}
              {badge}
            </Badge>
          )}
          <h1 className={cn("text-4xl font-extrabold sm:text-5xl", headlineClassName)}>
            {headline}
          </h1>
          {subheadline && (
            <p
              className={cn(
                "mt-5 text-lg text-muted-foreground leading-relaxed",
                centered && "max-w-2xl mx-auto",
                subheadlineClassName,
              )}
            >
              {subheadline}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
