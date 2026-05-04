import { MapPin, Calendar, BookOpen, Check } from "lucide-react";
import { PageCard } from "@/components/admin/PageCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { pickupRequests } from "@/lib/mock-data";

export default function Pickups() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pickupRequests.map((p) => (
        <article
          key={p.id}
          className="group overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-2 ring-secondary/40">
                <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {p.user.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{p.user}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{p.id}</p>
              </div>
            </div>
            <StatusBadge status={p.status} />
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-start gap-2.5 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span>{p.address}</span>
            </li>
            <li className="flex items-center gap-2.5 text-muted-foreground">
              <BookOpen className="h-4 w-4 shrink-0 text-secondary" />
              <span>{p.books} book{p.books > 1 && "s"} to collect</span>
            </li>
            <li className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-secondary" />
              <span>{p.date}</span>
            </li>
          </ul>

          <div className="mt-5 flex gap-2">
            <Button size="sm" className="h-9 flex-1 gap-1.5 rounded-lg bg-primary hover:bg-primary/90">
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button size="sm" variant="outline" className="h-9 flex-1 rounded-lg">Schedule</Button>
          </div>
        </article>
      ))}
    </div>
  );
}
