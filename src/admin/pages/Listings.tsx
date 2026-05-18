import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, LayoutGrid, List, Eye, MoreHorizontal, Check, Flag, Pencil } from "lucide-react";
import { PageCard } from "@/admin/components/PageCard";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Listing } from "@/lib/mock-data";
import { COVER_IMAGES } from "@/lib/covers";
import { useAdminStore } from "@/admin/store/adminStore";
import { TimeRangeFilter, defaultRange, type RangeValue } from "@/admin/components/TimeRangeFilter";
import { Paginator } from "@/admin/components/Paginator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const FILTERS = ["All", "Pending", "Approved", "Rejected", "Flagged", "Needs Correction", "Suspended"] as const;
const PAGE_SIZE = 8;

function Cover({ listing }: { listing: Listing }) {
  const src = COVER_IMAGES[listing.title];
  if (src) return <img src={src} alt={listing.title} loading="lazy" className="h-full w-full object-cover" />;
  return <div className={`h-full w-full bg-gradient-to-br ${listing.cover}`} />;
}

export default function Listings() {
  const navigate = useNavigate();
  const allListings = useAdminStore((s) => s.listings);
  const approve = useAdminStore((s) => s.approveListing);
  const flag = useAdminStore((s) => s.flagListing);

  // Default to LIST view
  const [view, setView] = useState<"grid" | "table">("table");

  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("status") as typeof FILTERS[number] | null;

  // Default tab = Pending (unless URL specifies otherwise)
  const [filter, setFilter] = useState<typeof FILTERS[number]>(
    initial && (FILTERS as readonly string[]).includes(initial) ? initial : "Pending"
  );
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<RangeValue>(defaultRange());
  const [page, setPage] = useState(1);

  useEffect(() => {
    const s = searchParams.get("status");
    if (s && (FILTERS as readonly string[]).includes(s)) setFilter(s as typeof FILTERS[number]);
  }, [searchParams]);

  useEffect(() => { setPage(1); }, [filter, query, range.key]);

  const updateFilter = (f: typeof FILTERS[number]) => {
    setFilter(f);
    if (f === "All") searchParams.delete("status");
    else searchParams.set("status", f);
    setSearchParams(searchParams, { replace: true });
  };

  const data = useMemo(() => allListings.filter((l) => {
    if (filter !== "All" && l.status !== filter) return false;
    if (query && !`${l.title} ${l.seller} ${l.id}`.toLowerCase().includes(query.toLowerCase())) return false;
    const t = new Date(l.date).getTime();
    if (t < range.from.getTime() || t > range.to.getTime()) return false;
    return true;
  }), [allListings, query, filter, range]);

  const paged = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, seller or ID…" className="h-10 rounded-xl pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => updateFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === f ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-secondary/40 hover:text-primary"
            }`}>{f}</button>
          ))}
          <TimeRangeFilter value={range} onChange={setRange} className="ml-1" />
          <div className="ml-1 inline-flex items-center gap-1 rounded-xl border border-border bg-muted p-1">
            <button onClick={() => setView("table")} className={`rounded-lg px-2 py-1 ${view === "table" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"}`} aria-label="List view"><List className="h-4 w-4" /></button>
            <button onClick={() => setView("grid")} className={`rounded-lg px-2 py-1 ${view === "grid" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"}`} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <Search className="h-6 w-6 text-primary" />
          <p className="mt-4 font-display text-lg font-semibold">No listings found</p>
          <p className="text-sm text-muted-foreground">Try clearing filters or changing the date range.</p>
        </div>
      )}

      {view === "grid" ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((l) => (
              <article key={l.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
                <button onClick={() => navigate(`/admin/listings/${l.id}`)} className="relative block aspect-[3/4] w-full overflow-hidden">
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-110"><Cover listing={l} /></div>
                  <div className="absolute left-3 top-3"><StatusBadge status={l.status} /></div>
                  <div className="absolute right-3 top-3" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-white/90 hover:bg-white"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/listings/${l.id}`)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { approve(l.id); toast({ title: "Approved", description: l.title }); }}><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { flag(l.id, "Manual flag"); toast({ title: "Flagged" }); }}><Flag className="mr-2 h-4 w-4" /> Flag</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/listings/${l.id}`)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{l.condition}</p>
                    <p className="font-display text-sm font-bold text-white line-clamp-1">{l.title}</p>
                  </div>
                </button>
                <div className="space-y-1 p-4">
                  <p className="truncate text-xs text-muted-foreground">by {l.seller}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-base font-bold text-primary">₦{l.price.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">{l.location}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Submitted {l.date}</p>
                </div>
              </article>
            ))}
          </div>
          <Paginator page={page} pageSize={PAGE_SIZE} total={data.length} onPageChange={setPage} />
        </>
      ) : (
        <PageCard title="Listings" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-card">
                <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Seller</th>
                  <th className="px-5 py-3">Format</th>
                  <th className="px-5 py-3">Qty</th>
                  <th className="px-5 py-3">Condition</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((l) => {
                  const cover = COVER_IMAGES[l.title];
                  return (
                    <tr key={l.id} onClick={() => navigate(`/admin/listings/${l.id}`)} className="cursor-pointer border-b border-border/40 transition-colors hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {cover ? <img src={cover} alt={l.title} className="h-10 w-7 rounded object-cover" /> : <div className="h-10 w-7 rounded bg-muted" />}
                          <span className="font-medium text-foreground">{l.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{l.seller}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{l.format ?? "Paperback"}</td>
                      <td className="px-5 py-3 font-semibold text-foreground">{l.quantity ?? 1}</td>
                      <td className="px-5 py-3 text-muted-foreground">{l.condition}</td>
                      <td className="px-5 py-3 font-semibold">₦{l.price.toLocaleString()}</td>
                      <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                      <td className="px-5 py-3 text-muted-foreground">{l.date}</td>
                      <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => navigate(`/admin/listings/${l.id}`)}><Eye className="h-3.5 w-3.5" /> View</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border/60 px-4">
            <Paginator page={page} pageSize={PAGE_SIZE} total={data.length} onPageChange={setPage} />
          </div>
        </PageCard>
      )}
    </div>
  );
}
