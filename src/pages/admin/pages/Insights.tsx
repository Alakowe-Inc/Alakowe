import { Sparkles, TrendingUp, Users, Flag, BookOpen, AlertTriangle, ArrowUpRight } from "lucide-react";
import { PageCard } from "@/components/admin/PageCard";
import { revenueSeries, userGrowth, topSellers, listings } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const insights = [
  { icon: TrendingUp, tone: "success", title: "Revenue up 18.9% YoY", body: "December is on track to be the strongest month — driven by literary fiction sales." },
  { icon: Users, tone: "primary", title: "User signups accelerating", body: "Weekly signups grew 12% — Lagos and Abuja remain your top two cities." },
  { icon: BookOpen, tone: "secondary", title: "Half of a Yellow Sun trending", body: "Up 240% in views this week. Consider featuring it on the homepage." },
  { icon: Flag, tone: "warning", title: "3 sellers need review", body: "Unusual listing volume from new accounts — recommend manual verification." },
  { icon: AlertTriangle, tone: "destructive", title: "Refund rate ticked up", body: "Pickup orders saw 4.2% refunds this week vs. 1.1% baseline. Investigate logistics." },
  { icon: Sparkles, tone: "primary", title: "Top performer", body: "Adaeze Okonkwo grew revenue 32% MoM and earned the Elite trust badge." },
];

const TONE: Record<string, string> = {
  success: "bg-success/15 text-success",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/40 text-primary",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

export default function Insights() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground shadow-elegant sm:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/30 backdrop-blur">
            <Sparkles className="h-6 w-6 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">AI Insights</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Your marketplace at a glance</h2>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
              Auto-generated insights from the last 30 days of activity across users, sellers, listings and orders.
            </p>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((it, i) => {
          const Icon = it.icon;
          return (
            <article
              key={i}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE[it.tone]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-4 font-display text-base font-bold text-foreground">{it.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
            </article>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PageCard title="Revenue trend" description="Last 12 months" className="lg:col-span-2">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="ai-rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#ai-rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        <PageCard title="User vs Seller growth" description="Last 8 weeks">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sellers" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PageCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PageCard title="Top sellers" description="Ranked by revenue this month" bodyClassName="p-0">
          <ul className="divide-y divide-border/60">
            {topSellers.map((s, i) => (
              <li key={s.name} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
                <span className="font-display text-sm font-bold text-muted-foreground">#{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.books} books · ⭐ {s.rating} · {s.trust}</p>
                </div>
                <span className="text-sm font-semibold text-primary">₦{(s.revenue / 1000).toFixed(0)}k</span>
              </li>
            ))}
          </ul>
        </PageCard>

        <PageCard title="Most listed titles" description="Books with the highest active inventory">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={listings.slice(0, 6).map((l) => ({ name: l.title.split(" ").slice(0, 2).join(" "), value: Math.floor(Math.random() * 60) + 12 }))} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
