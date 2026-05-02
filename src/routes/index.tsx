import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Stethoscope, ClipboardList, BellRing, ShieldCheck, TrendingDown, Users, Clock, Globe2 } from "lucide-react";
import heroImg from "@/assets/hero-vet.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-soft)]" aria-hidden />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" aria-hidden />

        <div className="container relative mx-auto grid gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Stethoscope className="h-3.5 w-3.5" /> {t("tagline")}
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t("heroDesc")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-[var(--shadow-soft)]">
                <Link to="/report">
                  {t("cta")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">{t("learn")}</a>
              </Button>
            </div>
            <div className="mt-4">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link to="/alerts">
                  <Globe2 className="mr-2 h-5 w-5" /> 🌍 {t("alertsCta")}
                </Link>
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">{t("alertsCtaDesc")}</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -rotate-3 rounded-3xl bg-[image:var(--gradient-primary)] opacity-20 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-elevated)]">
              <img src={heroImg} alt="Vétérinaire examinant du bétail" width={1536} height={1024} className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("learn")}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { Icon: ClipboardList, title: t("step1Title"), desc: t("step1Desc"), num: "01" },
            { Icon: Stethoscope, title: t("step2Title"), desc: t("step2Desc"), num: "02" },
            { Icon: BellRing, title: t("step3Title"), desc: t("step3Desc"), num: "03" },
          ].map(({ Icon, title, desc, num }) => (
            <Card key={num} className="group relative overflow-hidden border-border/60 p-7 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-elevated)]">
              <span className="absolute right-5 top-4 text-5xl font-black text-primary/5">{num}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("statsTitle")}</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { Icon: TrendingDown, value: "−65%", label: t("stat1") },
              { Icon: Users, value: "120+", label: t("stat2") },
              { Icon: Clock, value: "< 30 min", label: t("stat3") },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="rounded-2xl border border-border/60 bg-card p-7 text-center shadow-[var(--shadow-soft)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-4xl font-bold tracking-tight text-foreground">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-primary)] p-10 text-center shadow-[var(--shadow-elevated)] sm:p-16">
          <ShieldCheck className="absolute -right-8 -top-8 h-48 w-48 text-white/10" />
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">{t("heroTitle")}</h2>
          <Button asChild size="lg" variant="secondary" className="mt-7">
            <Link to="/report">
              {t("cta")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
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
