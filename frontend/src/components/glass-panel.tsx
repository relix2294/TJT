import { forwardRef, type ComponentType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps = {
  eyebrow?: string;
  title: string;
  icon?: ComponentType<{ className?: string }>;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
};

export const GlassPanel = forwardRef<HTMLElement, GlassPanelProps>(function GlassPanel(
  { eyebrow, title, icon: Icon, action, children, className, id },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn("glass overflow-hidden rounded-xl p-4 sm:p-5", className)}
    >
      <header className="mb-4 flex items-start justify-between gap-3 border-b border-border/60 pb-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          ) : null}
          <div className="mt-0.5 flex items-center gap-1.5">
            {Icon ? <Icon className="size-3.5 shrink-0 text-muted-foreground" /> : null}
            <h2 className="font-heading text-sm font-bold tracking-tight text-foreground sm:text-base">
              {title}
            </h2>
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
});
