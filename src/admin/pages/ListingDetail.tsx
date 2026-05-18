import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, X, Wrench, Ban, Edit, Bell, MapPin, User, Calendar, Tag, Heart, FileText, BookOpen, Hash, TrendingUp, Wallet, Receipt } from "lucide-react";
import { PageCard } from "@/admin/components/PageCard";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/admin/store/adminStore";
import { COVER_IMAGES } from "@/lib/covers";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AdminNote } from "@/admin/components/AdminNote";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = useAdminStore((s) => s.listings.find((l) => l.id === id));
  const approve = useAdminStore((s) => s.approveListing);
  const reject = useAdminStore((s) => s.rejectListing);
  const correct = useAdminStore((s) => s.requestCorrection);
  const suspend = useAdminStore((s) => s.suspendListing);

  const [rejecting, setRejecting] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [reason, setReason] = useState("");

  if (!listing) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="outline" onClick={() => navigate("/admin/listings")} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back</Button>
        <PageCard title="Listing not found" />
      </div>
    );
  }

  const cover = COVER_IMAGES[listing.title];
  const locked = listing.status !== "Pending" && listing.status !== "Needs Correction";

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/admin/listings")} className="gap-1.5 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast({ title: "Notification sent", description: `Seller ${listing.seller} notified.` })}>
            <Bell className="h-3.5 w-3.5" /> Notify seller
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast({ title: "Edit mode", description: "Editor opened." })}>
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { suspend(listing.id); toast({ title: "Listing suspended" }); }}>
            <Ban className="h-3.5 w-3.5" /> Suspend
          </Button>
          {!locked && (
            <>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setCorrecting(true)}>
                <Wrench className="h-3.5 w-3.5" /> Correct
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setRejecting(true)}>
                <X className="h-3.5 w-3.5" /> Reject
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => { approve(listing.id); toast({ title: "Approved", description: listing.title }); }}>
                <Check className="h-3.5 w-3.5" /> Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <PageCard
        title={listing.title}
        description={`Submitted by ${listing.seller} · ${listing.id}`}
        action={<StatusBadge status={listing.status} />}
      >
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            {cover ? <img src={cover} alt={listing.title} className="aspect-[3/4] w-full rounded-xl object-cover shadow-elegant" />
              : <div className="aspect-[3/4] rounded-xl bg-muted" />}
          </div>

          <div className="space-y-5">
            {/* Price Breakdown */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-5 shadow-soft">
              <p className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Receipt className="h-3 w-3" /> Price breakdown
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 shadow-glow">
                  <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <Wallet className="h-3 w-3" /> Seller Price
                  </p>
                  <p className="mt-1.5 font-display text-3xl font-extrabold text-primary">₦{listing.price.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground">Original price seller entered</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <TrendingUp className="h-3 w-3" /> Listing Price
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-bold text-foreground">₦{Math.round(listing.price * 1.15).toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground">Buyer pays (Seller +15%)</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-success">
                    <Wallet className="h-3 w-3" /> Seller Payout
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-bold text-success">₦{Math.round(listing.price * 0.85).toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground">Seller receives (−15% fee)</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={User} label="Author">{listing.author}</Field>
              <Field icon={Tag} label="Category">{listing.category}</Field>
              <Field icon={BookOpen} label="Format">{listing.format ?? "Paperback"}</Field>
              <Field icon={Hash} label="Quantity">{listing.quantity ?? 1}</Field>
              <Field icon={Tag} label="Condition">{listing.condition}</Field>
              <Field icon={MapPin} label="Location">{listing.location}</Field>
              <Field icon={MapPin} label="Pickup / Drop-off">{listing.pickupChoice}</Field>
              <Field icon={Calendar} label="Submitted">{listing.date}</Field>
            </div>

            <Field icon={FileText} label="Condition note" full>{listing.conditionNote}</Field>
            <Field icon={Heart} label="Love note" full>{listing.loveNote}</Field>

            <div className="rounded-xl border border-border/60 bg-card p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Seller</p>
              <Link to="/admin/users" className="block font-semibold text-foreground hover:text-primary">{listing.seller}</Link>
              <p className="text-xs text-muted-foreground">Trusted seller · Lagos hub</p>
            </div>

            {(listing.reviewedBy || listing.rejectionReason || listing.correctionNote || listing.flagReason) && (
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Review history</p>
                {listing.reviewedBy && <p className="text-sm">Reviewed by <strong>{listing.reviewedBy}</strong> on {listing.reviewedAt?.slice(0, 10)}</p>}
                {listing.rejectionReason && <p className="mt-1 text-sm text-destructive">Reason: {listing.rejectionReason}</p>}
                {listing.correctionNote && <p className="mt-1 text-sm text-warning">Correction: {listing.correctionNote}</p>}
                {listing.flagReason && <p className="mt-1 text-sm text-warning">Flag: {listing.flagReason}</p>}
              </div>
            )}
          </div>
        </div>
      </PageCard>

      <AdminNote entityId={`listing:${listing.id}`} />

      <Dialog open={rejecting} onOpenChange={setRejecting}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject listing</DialogTitle></DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain to the seller why…" rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { reject(listing.id, reason || "Did not meet quality standards"); toast({ title: "Rejected" }); setRejecting(false); setReason(""); }}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={correcting} onOpenChange={setCorrecting}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request correction</DialogTitle></DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What should the seller fix?" rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCorrecting(false)}>Cancel</Button>
            <Button onClick={() => { correct(listing.id, reason || "Please update listing details."); toast({ title: "Correction requested" }); setCorrecting(false); setReason(""); }}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ icon: Icon, label, children, full }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`rounded-xl border border-border/60 bg-card p-3 ${full ? "sm:col-span-2" : ""}`}>
      <p className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="text-sm text-foreground">{children}</p>
    </div>
  );
}
