import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { Bug, Thermometer, CloudRain, AlertTriangle, ArrowLeft, Lightbulb, MapPin, Locate, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alertes sanitaires & climatiques — VetAlert" },
      { name: "description", content: "Suivez les alertes virus, chaleur et pluie pour protéger votre bétail." },
      { property: "og:title", content: "Alertes sanitaires & climatiques — VetAlert" },
      { property: "og:description", content: "Suivez les alertes virus, chaleur et pluie pour protéger votre bétail." },
    ],
  }),
  component: AlertsPage,
});

type Severity = "urgent" | "info";
type AlertId = "virus" | "heat" | "rain";

type Zone = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alerts: AlertId[];
};

const ZONES: Zone[] = [
  { id: "kayes", name: "Kayes", lat: 14.45, lng: -11.44, alerts: ["heat", "virus"] },
  { id: "sikasso", name: "Sikasso", lat: 11.32, lng: -5.68, alerts: ["rain"] },
  { id: "mopti", name: "Mopti", lat: 14.49, lng: -4.20, alerts: ["heat", "rain", "virus"] },
  { id: "segou", name: "Ségou", lat: 13.45, lng: -6.27, alerts: [] },
  { id: "tombouctou", name: "Tombouctou", lat: 16.77, lng: -3.00, alerts: ["heat"] },
];

function alertsForCoords(lat: number, lng: number): AlertId[] {
  // Closest known zone wins (simulation)
  let best = ZONES[0];
  let bestDist = Infinity;
  for (const z of ZONES) {
    const d = (z.lat - lat) ** 2 + (z.lng - lng) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = z;
    }
  }
  return best.alerts;
}

function AlertsPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"village" | "coords">("village");
  const [villageId, setVillageId] = useState<string>("mopti");
  const [lat, setLat] = useState<string>("14.49");
  const [lng, setLng] = useState<string>("-4.20");
  const [appliedCoords, setAppliedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const activeZone = useMemo(() => {
    if (mode === "village") {
      return ZONES.find((z) => z.id === villageId) ?? ZONES[0];
    }
    const c = appliedCoords ?? { lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0 };
    const ids = alertsForCoords(c.lat, c.lng);
    return { id: "custom", name: `${c.lat.toFixed(2)}, ${c.lng.toFixed(2)}`, lat: c.lat, lng: c.lng, alerts: ids };
  }, [mode, villageId, lat, lng, appliedCoords]);

  const simulateGps = () => {
    // Deterministic: use the currently entered coordinates as the "GPS" reading.
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const safeLat = Number.isFinite(parsedLat) ? +parsedLat.toFixed(2) : 0;
    const safeLng = Number.isFinite(parsedLng) ? +parsedLng.toFixed(2) : 0;
    setLat(String(safeLat));
    setLng(String(safeLng));
    setAppliedCoords({ lat: safeLat, lng: safeLng });
    setMode("coords");
  };

  const allAlerts: {
    id: string;
    Icon: typeof Bug;
    title: string;
    message: string;
    advice: string;
    severity: Severity;
    tone: "destructive" | "warning" | "info";
  }[] = [
    {
      id: "virus",
      Icon: Bug,
      title: t("alertVirusTitle"),
      message: t("alertVirusMsg"),
      advice: t("adviceVirus"),
      severity: "urgent",
      tone: "destructive",
    },
    {
      id: "heat",
      Icon: Thermometer,
      title: t("alertHeatTitle"),
      message: t("alertHeatMsg"),
      advice: t("adviceHeat"),
      severity: "urgent",
      tone: "warning",
    },
    {
      id: "rain",
      Icon: CloudRain,
      title: t("alertRainTitle"),
      message: t("alertRainMsg"),
      advice: t("adviceRain"),
      severity: "info",
      tone: "info",
    },
  ];

  const alerts = allAlerts.filter((a) => activeZone.alerts.includes(a.id as AlertId));
  const urgentCount = alerts.filter((a) => a.severity === "urgent").length;
  const isCritical = urgentCount >= 2;

  const toneClass = (tone: "destructive" | "warning" | "info") => {
    if (tone === "destructive") return "bg-destructive/10 text-destructive";
    if (tone === "warning") return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    return "bg-primary/10 text-primary";
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-4 py-10 sm:py-14">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-1 h-4 w-4" /> {t("backHome")}
          </Link>
        </Button>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            🌍 {t("tagline")}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("alertsTitle")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">{t("alertsLead")}</p>
        </div>

        {/* Zone selector */}
        <Card className="mt-8 border-border/60 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">{t("selectZone")}</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("zoneHelp")}</p>

          <div className="mt-4 inline-flex rounded-full border border-border bg-secondary p-0.5 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode("village")}
              className={`rounded-full px-4 py-1.5 transition-colors ${mode === "village" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t("village")}
            </button>
            <button
              type="button"
              onClick={() => setMode("coords")}
              className={`rounded-full px-4 py-1.5 transition-colors ${mode === "coords" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t("coordinates")}
            </button>
          </div>

          {mode === "village" ? (
            <div className="mt-4 max-w-sm">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("village")}</Label>
              <Select value={villageId} onValueChange={setVillageId}>
                <SelectTrigger className="mt-1 h-12 text-base">
                  <SelectValue placeholder={t("selectVillage")} />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("latitude")}</Label>
                <Input className="mt-1 h-12 text-base" type="number" step="0.01" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("longitude")}</Label>
                <Input className="mt-1 h-12 text-base" type="number" step="0.01" value={lng} onChange={(e) => setLng(e.target.value)} />
              </div>
              <Button
                size="lg"
                onClick={() => setAppliedCoords({ lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0 })}
              >
                {t("apply")}
              </Button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="outline" size="lg" onClick={simulateGps}>
              <Locate className="mr-2 h-4 w-4" /> {t("useGps")}
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("activeZone")} :</span>
              <Badge variant="secondary" className="text-sm">📍 {activeZone.name}</Badge>
              <Badge variant="outline">{alerts.length} {t("alertsCount")}</Badge>
            </div>
          </div>
        </Card>

        {isCritical && (
          <Card className="mt-6 border-destructive/40 bg-destructive/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground shadow-[var(--shadow-soft)]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <Badge variant="destructive" className="mb-2">{t("urgent")}</Badge>
                <p className="text-base font-semibold text-foreground">{t("criticalAlert")}</p>
              </div>
            </div>
          </Card>
        )}

        {alerts.length === 0 ? (
          <Card className="mt-6 border-border/60 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-base text-foreground">{t("noAlerts")}</p>
            </div>
          </Card>
        ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {alerts.map(({ id, Icon, title, message, advice, severity, tone }) => (
            <Card
              key={id}
              className="relative overflow-hidden border-border/60 p-6 shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${toneClass(tone)}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    {severity === "urgent" && (
                      <Badge variant="destructive" className="uppercase">{t("urgent")}</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p>
                  <div className="mt-4 rounded-lg border border-border/60 bg-secondary/40 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                      <Lightbulb className="h-3.5 w-3.5 text-primary" /> {t("advice")}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{advice}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/report">{t("cta")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/">{t("backHome")}</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t("appName")} — {t("footer")}
        </div>
      </footer>
    </div>
  );
}