import { useState, Fragment } from "react";
import { ChevronDown, Search, Filter, Download } from "lucide-react";
import { PageCard } from "@/components/admin/PageCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/mock-data";

export default function Orders() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders…" className="h-10 rounded-xl pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-xl"><Filter className="h-4 w-4" /> Filters</Button>
          <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-xl"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      <PageCard title="All Orders" description="Click any row to view delivery timeline" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Buyer</th>
                <th className="px-5 py-3 font-medium">Seller</th>
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Delivery</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr
                    onClick={() => setOpen(open === o.id ? null : o.id)}
                    className="cursor-pointer border-b border-border/40 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-primary">{o.id}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{o.buyer}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.seller}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.book}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">₦{o.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.delivery}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                    <td className="px-5 py-3">
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open === o.id ? "rotate-180" : ""}`} />
                    </td>
                  </tr>
                  {open === o.id && (
                    <tr className="bg-muted/30">
                      <td colSpan={9} className="px-5 py-5">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                          {["Order Placed", "Payment Confirmed", "Shipped", "Delivered"].map((s, i) => {
                            const active = i <= ["Paid", "Processing", "Shipped", "Delivered", "Cancelled"].indexOf(o.status);
                            return (
                              <div key={s} className="flex items-start gap-3">
                                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                  {i + 1}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{s}</p>
                                  <p className="text-xs text-muted-foreground">{active ? "Completed" : "Pending"}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>
    </div>
  );
}
