import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PageCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function PageCard({ title, description, action, children, className, bodyClassName }: PageCardProps) {
  return (
    <Card className={cn("rounded-2xl shadow-soft", className)}>
      {(title || action) && (
        <>
          <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3 px-5 py-4 space-y-0">
            <div className="space-y-0.5">
              {title && <CardTitle className="font-display text-base font-semibold">{title}</CardTitle>}
              {description && <CardDescription className="text-xs">{description}</CardDescription>}
            </div>
            {action}
          </CardHeader>
          <Separator />
        </>
      )}
      <CardContent className={cn("p-5", bodyClassName)}>{children}</CardContent>
    </Card>
  );
}
