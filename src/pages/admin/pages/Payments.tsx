import { CreditCard, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PageCard } from "@/components/admin/PageCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { payouts, revenueSeries } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Payments() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gross Revenue" value={1284500} delta={18.9} icon={DollarSign} currency accent="success" />
        <StatCard label="Net Commission" value={128450} delta={12.3} icon={Wallet} currency accent="secondary" />
        <StatCard label="Pending Payouts" value={84200} delta={-4.1} icon={CreditCard} currency accent="warning" />
        <StatCard label="Avg Order Value" value={4820} delta={6.4} icon={TrendingUp} currency accent="primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PageCard title="Revenue Trend" description="Last 12 months" className="lg:col-span-2">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="url(#bar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        <PageCard title="Commission Breakdown" description="By revenue stream">
          {[
            { label: "Marketplace fees", value: 68, color: "bg-primary" },
            { label: "Logistics", value: 22, color: "bg-secondary" },
            { label: "Promoted listings", value: 7, color: "bg-success" },
            { label: "Other", value: 3, color: "bg-warning" },
          ].map((row) => (
            <div key={row.label} className="mb-4 last:mb-0">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{row.label}</span>
                <span className="font-semibold text-primary">{row.value}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${row.color} transition-all duration-700`} style={{ width: `${row.value}%` }} />
              </div>
            </div>
          ))}
        </PageCard>
      </div>

      <PageCard title="Payout Requests" description="Sellers awaiting settlement" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Payout ID</th>
                <th className="px-5 py-3 font-medium">Seller</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b border-border/40 hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-primary">{p.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{p.seller}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">₦{p.amount.toLocaleString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{p.date}</td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">Process</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>
    </div>
  );
}
