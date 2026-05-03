import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n, SYMPTOMS, evaluateSeverity } from "@/lib/i18n";
import { AlertTriangle, ShieldCheck, Activity, MapPin, Phone, ArrowLeft, Stethoscope, CheckCircle2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/report")({
  component: ReportPage,
});

function ReportPage() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const [animal, setAnimal] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<null | { severity: "critical" | "moderate" | "low" }>(null);

  const toggle = (key: string) => {
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.length) return;
    setResult({ severity: evaluateSeverity(selected) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setResult(null);
    setAnimal("");
    setAge("");
    setLocation("");
    setNotes("");
    setSelected([]);
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-md px-4 py-16">
          <Card className="p-8 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
              <Lock className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-foreground">{t("loginRequired")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("loginRequiredDesc")}</p>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link to="/auth">{t("signInToContinue")}</Link>
            </Button>
            <Link to="/" className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground">
              {t("backHome")}
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-3xl px-4 py-12">
          <ResultView severity={result.severity} location={location} animal={animal} onReset={reset} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t("backHome")}
        </Link>

        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            <Stethoscope className="mr-1 h-3 w-3" /> {t("appName")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("formTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("formDesc")}</p>
        </div>

        <Card className="overflow-hidden border-border/60 shadow-[var(--shadow-soft)]">
          <form onSubmit={submit} className="space-y-8 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="animal">{t("animalType")}</Label>
                <Select value={animal} onValueChange={setAnimal} required>
                  <SelectTrigger id="animal">
                    <SelectValue placeholder={t("selectAnimal")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cattle">{t("cattle")}</SelectItem>
                    <SelectItem value="sheep">{t("sheep")}</SelectItem>
                    <SelectItem value="goat">{t("goat")}</SelectItem>
                    <SelectItem value="poultry">{t("poultry")}</SelectItem>
                    <SelectItem value="horse">{t("horse")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">{t("age")}</Label>
                <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="2 ans" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc">{t("location")}</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="loc" className="pl-9" value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("locationPh")} required />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-base">{t("symptoms")}</Label>
                <p className="text-xs text-muted-foreground">{t("selectSymptoms")}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SYMPTOMS.map((s) => {
                  const active = selected.includes(s.key);
                  return (
                    <label
                      key={s.key}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-[var(--transition-smooth)] ${
                        active ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]" : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <Checkbox checked={active} onCheckedChange={() => toggle(s.key)} />
                      <span className="flex-1 text-sm font-medium text-foreground">{t(s.key)}</span>
                      {s.critical && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("notesPh")} />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={!selected.length || !animal || !location}>
              <Activity className="mr-2 h-4 w-4" /> {t("analyze")}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}

function ResultView({ severity, location, animal, onReset }: { severity: "critical" | "moderate" | "low"; location: string; animal: string; onReset: () => void }) {
  const { t } = useI18n();
  const config = {
    critical: { color: "destructive", label: t("critical"), rec: t("recCritical"), Icon: AlertTriangle, time: 15 },
    moderate: { color: "warning", label: t("moderate"), rec: t("recModerate"), Icon: Activity, time: 60 },
    low: { color: "success", label: t("low"), rec: t("recLow"), Icon: ShieldCheck, time: 240 },
  }[severity];

  const bgClass = severity === "critical" ? "bg-destructive" : severity === "moderate" ? "bg-warning" : "bg-success";
  const fgClass = severity === "critical" ? "text-destructive-foreground" : severity === "moderate" ? "text-warning-foreground" : "text-success-foreground";
  const ringClass = severity === "critical" ? "ring-destructive/30" : severity === "moderate" ? "ring-warning/30" : "ring-success/30";

  return (
    <div className="space-y-6">
      <Card className={`overflow-hidden border-0 ring-2 ${ringClass} shadow-[var(--shadow-elevated)]`}>
        <div className={`${bgClass} ${fgClass} p-6 sm:p-8`}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <config.Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">{t("severity")}</p>
              <h2 className="text-3xl font-bold sm:text-4xl">{config.label}</h2>
              <p className="mt-2 text-sm opacity-90">{config.rec}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-success" />
          {t("notifying")}
        </div>
        <h3 className="mt-2 text-xl font-bold text-foreground">{t("nearestVet")}</h3>
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-lg font-bold text-primary-foreground">
            DV
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Dr. Vétérinaire</p>
            <p className="text-sm text-muted-foreground">
              {location || "—"} · ~{config.time} {t("minutes")}
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Phone className="mr-2 h-4 w-4" /> {t("callVet")}
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Animal : <span className="font-medium text-foreground">{animal}</span>
        </p>
      </Card>

      <Button variant="outline" size="lg" className="w-full" onClick={onReset}>
        {t("newReport")}
      </Button>
    </div>
  );
}