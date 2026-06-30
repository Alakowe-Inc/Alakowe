import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Download, Eye } from "lucide-react";
import { PageCard } from "@/admin/components/PageCard";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TimeRangeFilter, defaultRange, type RangeValue } from "@/admin/components/TimeRangeFilter";
import { Paginator, usePaginated } from "@/admin/components/Paginator";
import { useAdminStore } from "@/admin/store/adminStore";
import { toast } from "react-toastify";

const STATUSES = ["All", "Pending", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"] as const;
const PAGE_SIZE = 8;

export default function Orders() {
  const navigate = useNavigate();
  const orders = useAdminStore((s) => s.orders);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<typeof STATUSES[number]>(
    searchParams.get("filter") === "waiting" ? "Pending" : "All"
  );
  const [range, setRange] = useState<RangeValue>(defaultRange());
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [filter, query, range]);

  useEffect(() => {
    if (searchParams.get("filter") === "waiting") setFilter("Pending");
  }, [searchParams]);

  const updateFilter = (f: typeof STATUSES[number]) => {
    setFilter(f);
    if (f === "Pending") searchParams.set("filter", "waiting");
    else searchParams.delete("filter");
    setSearchParams(searchParams, { replace: true });
  };

  const data = useMemo(() => orders.filter((o) => {
    if (filter !== "All") {
      // Map "Processing" filter to multiple in-progress statuses
      if (filter === "Processing") {
        if (!["Paid", "Processing", "In Transit", "Shipped"].includes(o.status)) return false;
      } else if (o.status !== filter) return false;
    }
    if (query && !`${o.id} ${o.buyer} ${o.seller} ${o.book}`.toLowerCase().includes(query.toLowerCase())) return false;
    const d = new Date(o.date).getTime();
    if (d < range.from.getTime() || d > range.to.getTime()) return false;
    return true;
  }), [orders, filter, query, range]);

  const paged = usePaginated(data, page, PAGE_SIZE);

  const exportCsv = () => {
    const rows = [["Order", "Buyer", "Seller", "Book", "Amount", "Delivery", "Status", "Date"], ...data.map((o) => [o.id, o.buyer, o.seller, o.book, o.amount, o.delivery, o.status, o.date])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `orders-${Date.now()}.csv`; a.click();
    toast("Export ready");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order ID, buyer, seller or book…" className="h-10 rounded-xl pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => updateFilter(s)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === s ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-secondary/40 hover:text-primary"
            }`}>{s}</button>
          ))}
          <TimeRangeFilter value={range} onChange={setRange} />
          <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-xl" onClick={exportCsv}><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      <PageCard title="All Orders" description={`${data.length} order${data.length === 1 ? "" : "s"} match your filters`} bodyClassName="p-0">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Order</TableHead>
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Buyer</TableHead>
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Seller</TableHead>
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Book</TableHead>
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Amount</TableHead>
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Delivery</TableHead>
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-5 py-3 text-[11px] uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-5 py-3" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((o) => (
              <TableRow key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)} className="cursor-pointer">
                <TableCell className="px-5 py-3 font-mono text-xs font-semibold text-primary">{o.id}</TableCell>
                <TableCell className="px-5 py-3 font-medium text-foreground">{o.buyer}</TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{o.seller}</TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{o.book}</TableCell>
                <TableCell className="px-5 py-3 font-semibold text-foreground">₦{o.amount.toLocaleString()}</TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{o.delivery}</TableCell>
                <TableCell className="px-5 py-3"><StatusBadge status={o.status} /></TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{o.date}</TableCell>
                <TableCell className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No orders match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="border-t border-border/50 px-4">
          <Paginator page={page} pageSize={PAGE_SIZE} total={data.length} onPageChange={setPage} />
        </div>
      </PageCard>
    </div>
  );
}
