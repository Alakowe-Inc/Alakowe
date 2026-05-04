import { Users, Store, BookOpen, ShoppingBag, TrendingUp, DollarSign, Zap, Target } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PageCard } from "../../../components/admin/PageCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { categoryBreakdown, revenueSeries, topSellers, userGrowth } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--info))", "hsl(var(--success))", "hsl(var(--warning))"];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New Users Today" value={284} delta={14.2} icon={Users} accent="secondary" />
        <StatCard label="Active Sellers" value={1842} delta={6.8} icon={Store} accent="primary" />
        <StatCard label="Books Listed Today" value={642} delta={9.1} icon={BookOpen} accent="success" />
        <StatCard label="Conversion Rate" value={4} delta={0.8} icon={Target} accent="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PageCard title="Growth Trends" description="Users vs sellers" className="lg:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="u" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#u)" />
                <Area type="monotone" dataKey="sellers" stroke="hsl(var(--secondary))" strokeWidth={2.5} fill="url(#s)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        <PageCard title="Category Mix" description="Active listings by genre">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {categoryBreakdown.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PageCard title="Top Sellers" bodyClassName="p-0">
          <ul className="divide-y divide-border/60">
            {topSellers.map((s, i) => (
              <li key={s.name} className="flex items-center gap-3 px-5 py-3">
                <span className="font-display text-sm font-bold text-muted-foreground">#{i + 1}</span>
                <Avatar className="h-9 w-9"><AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">{s.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.trust} · ⭐ {s.rating}</p>
                </div>
                <span className="text-sm font-semibold text-primary">₦{(s.revenue / 1000).toFixed(0)}k</span>
              </li>
            ))}
          </ul>
        </PageCard>

        <PageCard title="Revenue Forecast" description="Projected next 3 months">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries.slice(-6)} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2.5} fill="url(#f)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
