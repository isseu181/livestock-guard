import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Bug, Thermometer, CloudRain, AlertTriangle, ArrowLeft, Lightbulb } from "lucide-react";

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

function AlertsPage() {
  const { t } = useI18n();

  const alerts: {
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

        {isCritical && (
          <Card className="mt-8 border-destructive/40 bg-destructive/5 p-5">
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

        <div className="mt-8 grid gap-5 md:grid-cols-2">
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