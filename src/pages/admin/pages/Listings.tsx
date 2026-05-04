import { useMemo, useState } from "react";
import { Check, X, Flag, MoreHorizontal, Search, Filter, Eye, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { listings, type Listing } from "@/lib/mock-data";
import { COVER_IMAGES, AUTHORS, SYNOPSES } from "@/lib/covers";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const FILTERS = ["All", "Pending", "Approved", "Rejected", "Flagged", "Sold"] as const;

function BookCover({ listing, eager = false }: { listing: Listing; eager?: boolean }) {
  const src = COVER_IMAGES[listing.title];
  if (src) {
    return (
      <img
        src={src}
        alt={`${listing.title} book cover`}
        loading={eager ? "eager" : "lazy"}
        width={576}
        height={768}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className={`relative h-full w-full bg-gradient-to-br ${listing.cover}`}>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center">
        <p className="font-display text-base font-bold text-white drop-shadow-md">{listing.title}</p>
      </div>
    </div>
  );
}

export default function Listings() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [preview, setPreview] = useState<Listing | null>(null);
  const [rejecting, setRejecting] = useState<Listing | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const data = useMemo(
    () =>
      listings.filter((l) => {
        if (filter !== "All" && l.status !== filter) return false;
        if (query && !`${l.title} ${l.seller} ${l.id}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [query, filter]
  );

  const handleApprove = (l: Listing) => {
    toast({ title: "Listing approved", description: `${l.title} is now live.` });
  };
  const handleFlag = (l: Listing) => {
    toast({ title: "Listing flagged", description: `${l.title} has been flagged for review.` });
  };
  const submitReject = () => {
    if (!rejecting) return;
    toast({
      title: "Listing rejected",
      description: rejectReason ? `Reason: ${rejectReason}` : `${rejecting.title} was rejected.`,
    });
    setRejecting(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, seller or ID…"
            className="h-10 rounded-xl pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-secondary/40 hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
          <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl">
            <Filter className="h-4 w-4" /> More
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/40">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-foreground">No listings found</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((l) => (
          <article
            key={l.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant animate-fade-in"
          >
            <button
              onClick={() => setPreview(l)}
              className="relative block aspect-[3/4] w-full overflow-hidden"
              aria-label={`Preview ${l.title}`}
            >
              <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
                <BookCover listing={l} />
              </div>
              <div className="absolute left-3 top-3"><StatusBadge status={l.status} /></div>
              <div className="absolute right-3 top-3" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-white/90 shadow-sm hover:bg-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPreview(l)}><Eye className="mr-2 h-4 w-4" /> Preview</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleApprove(l)}><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRejecting(l)}><X className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFlag(l)}><Flag className="mr-2 h-4 w-4" /> Flag</DropdownMenuItem>
                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{l.condition}</p>
                <p className="font-display text-sm font-bold text-white line-clamp-1">{l.title}</p>
              </div>
            </button>
            <div className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">by {l.seller}</p>
                <p className="font-display text-base font-bold text-primary">₦{l.price.toLocaleString()}</p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-lg text-success transition-transform hover:scale-110 hover:bg-success/10 active:scale-95"
                  onClick={() => handleApprove(l)}
                  aria-label="Approve"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-lg text-destructive transition-transform hover:scale-110 hover:bg-destructive/10 active:scale-95"
                  onClick={() => setRejecting(l)}
                  aria-label="Reject"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{preview.title}</DialogTitle>
                <DialogDescription>
                  by {AUTHORS[preview.title] ?? "Unknown author"} · {preview.id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
                <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-elegant">
                  <BookCover listing={preview} eager />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={preview.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="font-semibold">{preview.seller}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-semibold">{preview.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-display font-bold text-primary">
                      ₦{preview.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Listed on</span>
                    <span>{preview.date}</span>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                    {SYNOPSES[preview.title] ?? "A pre-loved copy from a verified ALÁKÒWÉ seller, inspected for quality and ready for its next reader."}
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => handleFlag(preview)}>
                  <Flag className="mr-2 h-4 w-4" /> Flag
                </Button>
                <Button variant="outline" onClick={() => { setPreview(null); setRejecting(preview); }}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => { handleApprove(preview); setPreview(null); }}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject modal */}
      <Dialog open={!!rejecting} onOpenChange={(o) => { if (!o) { setRejecting(null); setRejectReason(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject listing</DialogTitle>
            <DialogDescription>
              {rejecting && <>Tell {rejecting.seller.split(" ")[0]} why “{rejecting.title}” isn't suitable. This will be sent to the seller.</>}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection (optional)…"
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejecting(null); setRejectReason(""); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReject}>
              Reject listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
