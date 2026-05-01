import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-foreground">{t("appName")}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("tagline")}</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-secondary p-0.5 text-xs font-medium">
            <button
              onClick={() => setLang("fr")}
              className={`rounded-full px-3 py-1 transition-colors ${lang === "fr" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-3 py-1 transition-colors ${lang === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              EN
            </button>
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/report">{t("cta")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}