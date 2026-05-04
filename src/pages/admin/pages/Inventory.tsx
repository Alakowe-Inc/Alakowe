import { PageCard } from "@/components/admin/PageCard";
import { Button } from "@/components/ui/button";
import { Boxes, BookOpen, Package, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { listings } from "@/lib/mock-data";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Books" value={18203} delta={4.6} icon={Boxes} accent="primary" />
        <StatCard label="Available Now" value={14820} delta={2.1} icon={BookOpen} accent="success" />
        <StatCard label="In Transit" value={642} delta={11.3} icon={Package} accent="secondary" />
        <StatCard label="Low Stock Alerts" value={28} delta={-5.4} icon={AlertTriangle} accent="warning" />
      </div>

      <PageCard title="Inventory Snapshot" description="Aggregate view across sellers" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Seller</th>
                <th className="px-5 py-3 font-medium">Condition</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-border/40 hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-7 rounded bg-gradient-to-br ${l.cover} ring-1 ring-border`} />
                      <span className="font-semibold text-foreground">{l.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{l.seller}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.condition}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">₦{l.price.toLocaleString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>
    </div>
  );
}
