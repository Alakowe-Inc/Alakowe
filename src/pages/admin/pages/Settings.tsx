import { PageCard } from "@/components/admin/PageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <PageCard title="Platform" description="Marketplace-wide configuration" className="lg:col-span-2">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform name</Label>
              <Input defaultValue="ALÁKÒWÉ" className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support email</Label>
              <Input defaultValue="support@alakowe.app" className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commission %</Label>
              <Input defaultValue="10" className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default currency</Label>
              <Input defaultValue="NGN" className="h-10 rounded-xl" />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            {[
              { label: "Auto-approve verified sellers", desc: "Skip manual review for trusted accounts" },
              { label: "Email notifications", desc: "Receive a digest of platform events" },
              { label: "Flag suspicious activity", desc: "Auto-flag accounts with risky patterns" },
              { label: "Maintenance mode", desc: "Temporarily disable public access" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <Switch defaultChecked={s.label !== "Maintenance mode"} />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90">Save changes</Button>
          </div>
        </div>
      </PageCard>

      <PageCard title="Admin Profile" description="Your account details">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-lg font-bold text-primary-foreground shadow-elegant">AK</div>
            <div>
              <p className="font-display text-base font-semibold text-foreground">Akin O.</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display name</Label>
            <Input defaultValue="Akin O." className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input defaultValue="akin@alakowe.app" className="h-10 rounded-xl" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90">Update profile</Button>
        </div>
      </PageCard>
    </div>
  );
}
