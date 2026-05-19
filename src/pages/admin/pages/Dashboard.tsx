import { Users, Store, BookOpen, ShoppingBag, Clock, DollarSign, Flag, Activity, ArrowRight, MoreHorizontal, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PageCard } from "@/components/admin/PageCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { activityFeed, listings, orders, revenueSeries, statCards, topSellers, userGrowth } from "@/lib/mock-data";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar,
} from "recharts";

const iconMap = { Users, Store, BookOpen, ShoppingBag, Clock, DollarSign, Flag, Activity } as const;
const accents: Array<"primary" | "secondary" | "success" | "warning"> = ["secondary", "primary", "success", "secondary", "warning", "success", "warning", "primary"];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={s.value}
            delta={s.delta}
            icon={iconMap[s.icon as keyof typeof iconMap]}
            currency={s.currency}
            accent={accents[i % accents.length]}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PageCard
          title="Revenue Overview"
          description="Monthly revenue across the marketplace"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
              <TrendingUp className="h-3 w-3" /> +18.9% YoY
            </div>
          }
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "var(--shadow-elegant)",
                  }}
                  formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        <PageCard
          title="User & Seller Growth"
          description="Last 8 weeks"
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sellers" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Users</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" /> Sellers</span>
          </div>
        </PageCard>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PageCard
          title="Recent Orders"
          description="Latest transactions across the platform"
          className="lg:col-span-2"
          action={
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-primary">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          }
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Buyer</th>
                  <th className="px-5 py-3 font-medium">Book</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="group border-b border-border/40 transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-primary">{o.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7"><AvatarFallback className="bg-secondary/40 text-[10px] font-semibold text-primary">{o.buyer.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                        <span className="font-medium text-foreground">{o.buyer}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{o.book}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">₦{o.amount.toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>

        <PageCard title="Activity Feed" description="Real-time platform events">
          <ol className="relative space-y-4 border-l border-border/70 pl-5">
            {activityFeed.map((a, i) => (
              <li key={i} className="relative animate-slide-in-left" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="absolute -left-[27px] top-1 flex h-3 w-3 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-secondary ring-4 ring-secondary/20" />
                </span>
                <p className="text-sm leading-snug text-foreground">{a.text}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{a.time}</p>
              </li>
            ))}
          </ol>
        </PageCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PageCard title="Pending Listings" description="Awaiting admin review" bodyClassName="p-0">
          <ul className="divide-y divide-border/60">
            {listings.filter(l => l.status === "Pending").slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
                <div className={`h-12 w-9 shrink-0 rounded-md bg-gradient-to-br ${l.cover} shadow-sm ring-1 ring-border`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{l.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{l.seller} · ₦{l.price.toLocaleString()}</p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        </PageCard>

        <PageCard title="Top Sellers" description="By revenue this month" bodyClassName="p-0">
          <ul className="divide-y divide-border/60">
            {topSellers.map((s, i) => (
              <li key={s.name} className="flex items-center gap-3 px-5 py-3">
                <span className="font-display text-sm font-bold text-muted-foreground">#{i + 1}</span>
                <Avatar className="h-9 w-9 ring-2 ring-secondary/40">
                  <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.books} books · ⭐ {s.rating}</p>
                </div>
                <span className="text-sm font-semibold text-primary">₦{(s.revenue / 1000).toFixed(0)}k</span>
              </li>
            ))}
          </ul>
        </PageCard>

        <PageCard title="Orders by Day" description="Last 12 months">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Approval rate</span>
              <span className="font-semibold text-foreground">82%</span>
            </div>
            <Progress value={82} className="h-1.5" />
          </div>
        </PageCard>
      </div>
    </div>
  );
}
