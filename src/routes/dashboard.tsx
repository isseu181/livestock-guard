import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, FileText, Globe2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Report = {
  id: string;
  animal_type: string;
  severity: "low" | "moderate" | "critical";
  village: string | null;
  created_at: string;
};

function DashboardPage() {
  const { t } = useI18n();
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const isVet = roles.includes("vet") || roles.includes("admin");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("reports")
      .select("id, animal_type, severity, village, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setReports((data ?? []) as Report[]));
  }, [user]);

  if (loading || !user) return null;

  const sevColor = (s: Report["severity"]) =>
    s === "critical" ? "destructive" : s === "moderate" ? "default" : "secondary";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("dashboard")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/alerts"><Globe2 className="mr-2 h-4 w-4" />{t("alertsCta")}</Link>
            </Button>
            <Button asChild>
              <Link to="/report">{t("cta")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        <h2 className="mt-10 text-lg font-bold text-foreground">
          {isVet ? t("allReports") : t("myReports")}
        </h2>

        {reports.length === 0 ? (
          <Card className="mt-4 p-6 text-sm text-muted-foreground">{t("noReports")}</Card>
        ) : (
          <div className="mt-4 grid gap-3">
            {reports.map((r) => (
              <Card key={r.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{r.animal_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.village ?? "—"} · {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={sevColor(r.severity)}>{t(r.severity as "critical" | "moderate" | "low")}</Badge>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}