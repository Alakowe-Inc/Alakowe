import { useState } from "react";
import { Building2, BookOpen, User, Check, X } from "lucide-react";
import { PageCard } from "@/components/admin/PageCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { dropOffs } from "@/lib/mock-data";

export default function DropOffs() {
  const [active, setActive] = useState(dropOffs[0]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <PageCard title="Drop-off Records" className="lg:col-span-2" bodyClassName="p-0">
        <ul className="divide-y divide-border/60">
          {dropOffs.map((d) => (
            <li
              key={d.id}
              onClick={() => setActive(d)}
              className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors ${active.id === d.id ? "bg-secondary/20" : "hover:bg-muted/40"}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/30 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-foreground">{d.center}</p>
                <p className="text-xs text-muted-foreground">{d.user} · {d.books} books · {d.date}</p>
              </div>
              <StatusBadge status={d.status} />
            </li>
          ))}
        </ul>
      </PageCard>

      <PageCard title="Verification Panel" description={active.id}>
        <div className="space-y-4">
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Drop-off Center</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">{active.center}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2.5"><User className="h-4 w-4 text-secondary" /><span className="text-muted-foreground">Submitted by</span><span className="ml-auto font-semibold text-foreground">{active.user}</span></div>
            <div className="flex items-center gap-2.5"><BookOpen className="h-4 w-4 text-secondary" /><span className="text-muted-foreground">Books dropped</span><span className="ml-auto font-semibold text-foreground">{active.books}</span></div>
            <div className="flex items-center gap-2.5"><Building2 className="h-4 w-4 text-secondary" /><span className="text-muted-foreground">Date</span><span className="ml-auto font-semibold text-foreground">{active.date}</span></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-secondary/40 to-secondary/10 ring-1 ring-border" />
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="h-10 flex-1 gap-1.5 bg-success hover:bg-success/90"><Check className="h-4 w-4" /> Verify</Button>
            <Button size="sm" variant="outline" className="h-10 flex-1 gap-1.5 text-destructive"><X className="h-4 w-4" /> Reject</Button>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
