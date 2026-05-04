import { PageCard } from "@/components/admin/PageCard";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const reports = [
  { name: "Monthly Revenue Report", desc: "Comprehensive revenue breakdown", date: "Dec 2024" },
  { name: "Seller Performance", desc: "Top sellers, ratings, payouts", date: "Dec 2024" },
  { name: "User Acquisition", desc: "New users, retention, churn", date: "Dec 2024" },
  { name: "Inventory Audit", desc: "Books listed, sold, returned", date: "Nov 2024" },
  { name: "Logistics Summary", desc: "Pickups, drop-offs, deliveries", date: "Nov 2024" },
  { name: "Compliance Report", desc: "Flagged accounts, suspensions", date: "Nov 2024" },
];

export default function Reports() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((r) => (
        <article key={r.name} className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/30 text-primary transition-transform group-hover:scale-110">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold text-foreground">{r.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{r.date}</span>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-lg text-xs">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
