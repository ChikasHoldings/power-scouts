import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { summarizeRevenue } from "@/lib/revenue";
import { launchReadiness } from "@/lib/planValidation";
import { MARKET_TOTALS } from "@/seo/market";
import { ElectricityProvider, ElectricityPlan, UtilityTerritory } from "@/api/supabaseEntities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminPage, { AdminSectionHeading } from "@/components/admin/AdminPage";
import { canAccessPath } from "@/lib/adminNav";
import {
  Building2,
  Zap,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Gauge,
  Link2,
  MousePointerClick,
  UserPlus,
  BarChart3,
  Wallet,
  Activity,
} from "lucide-react";

/**
 * One dashboard figure.
 *
 * `loading` shows a placeholder bar instead of the value. Without it every tile
 * rendered its default — 0, or $0.00 — and then snapped to the real number when
 * its query landed, so the dashboard visibly counted up on every visit. A
 * placeholder says "not known yet", which is the truth, and does not move.
 */
function StatCard({ title, value, icon: Icon, color, link, subtitle, loading }) {
  const Wrapper = link ? Link : "div";
  const wrapperProps = link ? { to: link } : {};

  return (
    // h-full down the whole chain: tiles sit in a grid, and a subtitle that
    // wraps to two lines used to make its tile taller than the ones beside it,
    // so a row of four ended at four different heights.
    <Wrapper {...wrapperProps} className="block h-full">
      <Card className={`h-full flex flex-col hover:shadow-md transition-shadow ${link ? "cursor-pointer" : ""} group`}>
        {/* Vertical padding is trimmed relative to the horizontal, and the
            icon and figure are tightened, so the tile is shorter without the
            number or the gutter getting smaller. */}
        <CardContent className="px-6 py-4 flex flex-col flex-1">
          {/* Title and icon share a row; the figure gets a row of its own.
              They used to sit side by side, which left the value competing for
              width with the icon — "$48,213.50" ran straight into it. */}
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-gray-500 min-w-0">{title}</p>
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
          </div>

          {loading ? (
            <div className="h-8 mt-0.5 flex items-center" aria-live="polite" aria-busy="true">
              <span className="sr-only">Loading {title}</span>
              <span className="block h-6 w-16 rounded bg-gray-200 animate-pulse" aria-hidden="true" />
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-0.5 leading-tight tabular-nums break-words">
              {value}
            </p>
          )}

          {subtitle && !loading && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
          {loading && <div className="h-4 mt-1" aria-hidden="true" />}

          {link && (
            // mt-auto pins this to the bottom, so the "View all" rows across a
            // row of tiles line up regardless of how tall each subtitle ran.
            <div className="mt-auto pt-3 flex items-center text-sm text-gray-500 group-hover:text-[#0A5C8C] transition-colors">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </CardContent>
      </Card>
    </Wrapper>
  );
}

/**
 * One line of the Platform Overview card.
 *
 * The three rows were the same twelve lines of markup with a colour swapped,
 * and none of them had a loading state — so on every visit the card asserted
 * "0 / 0 active providers" until its queries landed. A ratio of nothing to
 * nothing is not a fact about the platform; it is the absence of one.
 */
function OverviewRow({ icon: Icon, label, value, tone, loading }) {
  const { bg, iconColor, labelColor, valueColor } = {
    blue: {
      bg: "bg-blue-50", iconColor: "text-blue-600",
      labelColor: "text-blue-900", valueColor: "text-blue-700",
    },
    purple: {
      bg: "bg-purple-50", iconColor: "text-purple-600",
      labelColor: "text-purple-900", valueColor: "text-purple-700",
    },
    orange: {
      bg: "bg-orange-50", iconColor: "text-orange-600",
      labelColor: "text-orange-900", valueColor: "text-orange-700",
    },
  }[tone];

  return (
    <div className={`flex items-center justify-between gap-3 p-3 rounded-lg ${bg}`}>
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
        <span className={`text-sm font-medium truncate ${labelColor}`}>{label}</span>
      </div>
      {loading ? (
        <span className="block h-5 w-12 rounded bg-black/10 animate-pulse flex-shrink-0" aria-hidden="true" />
      ) : (
        <span className={`text-lg font-bold flex-shrink-0 ${valueColor}`}>{value}</span>
      )}
    </div>
  );
}

/**
 * One line of the launch-readiness list.
 *
 * Every row is shown whether it passes or not. Each of these went to zero
 * without anyone noticing, and a check that only appears while it is failing is
 * one nobody can confirm is passing.
 */
function ReadinessRow({ ok, label, okText, badText, fixPath, fixLabel, linkIf }) {
  const href = ok ? null : linkIf(fixPath);
  return (
    <li className="flex items-start gap-2">
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <span className={ok ? "text-emerald-800" : "text-amber-800"}>
        <span className="font-medium">{label}:</span> {ok ? okText : badText}
        {href && (
          <>
            {" "}
            <Link to={href} className="font-medium underline whitespace-nowrap">
              {fixLabel} <ArrowRight className="w-3.5 h-3.5 inline" aria-hidden="true" />
            </Link>
          </>
        )}
      </span>
    </li>
  );
}

export default function AdminDashboard() {
  const { profile } = useAuth();

  /**
   * The dashboard obeys the same permission table as the guard.
   *
   * Every screen here is a summary of some other screen, and the role that may
   * not open the other screen must not be handed its contents through this one.
   * Two holes this closes: a viewer, who cannot open Leads, was being shown the
   * five most recent leads by name and email address; and the affiliate tiles
   * linked to /admin/affiliates for everyone, though that screen is admin-only
   * — so an editor got a "View all" that lands on Restricted Access.
   *
   * Deriving it from canAccessPath rather than re-testing the role means this
   * cannot drift from the sidebar and the guard the way three hand-kept lists
   * already did once.
   */
  const role = profile?.role || "viewer";
  const can = (path) => canAccessPath(role, path);

  const canSeeLeads = can("/admin/leads");
  const canSeeAffiliates = can("/admin/affiliates");
  const canSeeRevenue = can("/admin/revenue");

  // A tile still shows its number to anyone who may see the dashboard; what it
  // does not do is offer a way through to a screen the role cannot open.
  const linkIf = (path) => (can(path) ? path : undefined);


  const { data: providers = [], isLoading: loadingProviders } = useQuery({
    queryKey: ["admin-providers"],
    queryFn: () => ElectricityProvider.list(),
  });

  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: () => ElectricityPlan.list(),
  });

  // Delivery tariffs, because whether the catalog can be priced is a fact about
  // these rather than about the plans. See the readiness banner below.
  const { data: territories = [], isLoading: loadingTerritories } = useQuery({
    queryKey: ["admin-dashboard-territories"],
    queryFn: () => UtilityTerritory.list(),
  });

  // Who the router can hand a lead to. Zero rows means every lead captured is
  // stored and goes nowhere, which no other tile on this page would reveal.
  const { data: buyers = [], isLoading: loadingBuyers } = useQuery({
    queryKey: ["admin-dashboard-buyers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_buyers").select("id, is_active");
      if (error) throw error;
      return data || [];
    },
  });


  /**
   * Lead figures, counted rather than sampled.
   *
   * This previously fetched the 10 most recent leads and reported
   * `leads.length` as the total, with "converted" counted over the same ten
   * rows. Every lead number on the dashboard was therefore capped at 10 and
   * silently wrong the moment the eleventh lead arrived. Counts come from the
   * database now; the recent list stays a sample, because that is all it is.
   */
  const { data: leadStats = { total: 0, new: 0, converted: 0, recent: [] }, isLoading: loadingLeads } = useQuery({
    queryKey: ["admin-dashboard-leads"],
    queryFn: async () => {
      const countOf = (build) =>
        build(supabase.from("leads").select("id", { count: "exact", head: true }));

      const [total, newCount, converted, recent] = await Promise.all([
        countOf((q) => q),
        countOf((q) => q.eq("status", "new")),
        countOf((q) => q.eq("status", "converted")),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      return {
        total: total.count || 0,
        new: newCount.count || 0,
        converted: converted.count || 0,
        recent: recent.data || [],
      };
    },
  });

  // Computed after every query it reads, so none of them is referenced before
  // its declaration.
  const readiness = launchReadiness({
    plans,
    territories,
    buyers,
    leads: leadStats.total,
    snapshotPlans: MARKET_TOTALS.activePlans,
  });

  // Money actually earned, so the dashboard agrees with the revenue screen
  // rather than offering a second, friendlier version of the same question.
  const { data: earnings = { earned: 0, accrued: 0 }, isLoading: loadingEarnings } = useQuery({
    queryKey: ["admin-dashboard-earnings"],
    enabled: canSeeRevenue,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_events")
        .select("amount, status, occurred_at, source, partner_name");
      if (error) throw error;
      return summarizeRevenue(data || []);
    },
  });

  // Affiliate analytics
  const { data: affiliateData = { totalClicks: 0, topSlugs: [], activeLinks: 0 }, isLoading: loadingAffiliates } = useQuery({
    queryKey: ["admin-affiliate-analytics"],
    queryFn: async () => {
      // Get active affiliate links count
      const { data: links } = await supabase
        .from("affiliate_links")
        .select("slug, is_active");

      const activeLinks = (links || []).filter((l) => l.is_active).length;

      // Get click tracking data
      const { data: clicks } = await supabase
        .from("click_tracking")
        .select("slug, created_at");

      const totalClicks = (clicks || []).length;

      // Count clicks per slug
      const slugCounts = {};
      (clicks || []).forEach((c) => {
        slugCounts[c.slug] = (slugCounts[c.slug] || 0) + 1;
      });

      // Top 5 slugs by click count
      const topSlugs = Object.entries(slugCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([slug, count]) => ({ slug, count }));

      // Clicks in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentClicks = (clicks || []).filter(
        (c) => new Date(c.created_at) >= sevenDaysAgo
      ).length;

      // Clicks in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyClicks = (clicks || []).filter(
        (c) => new Date(c.created_at) >= thirtyDaysAgo
      ).length;

      return { totalClicks, topSlugs, activeLinks, recentClicks, monthlyClicks };
    },
  });

  const activeProviders = providers.filter((p) => p.is_active);
  const activePlans = plans.filter((p) => p.is_active);
  const recentLeads = leadStats.recent;
  const loadingCatalog = loadingProviders || loadingPlans;

  const money = (n) =>
    `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  /**
   * The analytics row, built as data rather than markup.
   *
   * Earnings is admin-only, so this row is four tiles for an admin and three
   * for everyone else. It used to be a fixed four-column grid with the earnings
   * tile conditionally rendered inside it, which left a viewer looking at a row
   * with a hole in it where the tile they may not see would have been. Building
   * the list first means the grid can be sized to what is actually in it.
   */
  const analyticsTiles = [
    {
      key: "clicks",
      title: "Affiliate Clicks",
      value: affiliateData.totalClicks,
      subtitle: `${affiliateData.recentClicks || 0} in the last 7 days`,
      icon: MousePointerClick,
      color: "bg-cyan-500",
      link: linkIf("/admin/affiliates"),
      loading: loadingAffiliates,
    },
    {
      key: "links",
      title: "Active Affiliate Links",
      value: affiliateData.activeLinks,
      subtitle: `${affiliateData.monthlyClicks || 0} clicks in the last 30 days`,
      icon: Link2,
      color: "bg-teal-500",
      link: linkIf("/admin/affiliates"),
      loading: loadingAffiliates,
    },
    {
      // Counted by the database alongside the other lead totals. It was being
      // fetched and then never shown, so the one number that says whether any
      // of this turns into customers was missing from the dashboard.
      key: "converted",
      title: "Converted Leads",
      value: leadStats.converted,
      subtitle: `of ${leadStats.total} captured`,
      icon: Activity,
      color: "bg-emerald-500",
      link: linkIf("/admin/leads"),
      loading: loadingLeads,
    },
    canSeeRevenue && {
      key: "earnings",
      title: "Platform Earnings",
      value: money(earnings.earned),
      subtitle: `${money(earnings.accrued)} accrued, not yet confirmed`,
      icon: Wallet,
      color: "bg-indigo-500",
      link: linkIf("/admin/revenue"),
      loading: loadingEarnings,
    },
  ].filter(Boolean);

  const analyticsColumns =
    analyticsTiles.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  // Platform Overview is always present; the other two depend on the role. A
  // fixed three-column grid would leave a viewer's single card floating in the
  // left third of an otherwise empty row.
  const activityCardCount = 1 + (canSeeLeads ? 1 : 0) + (canSeeAffiliates ? 1 : 0);
  const activityColumns =
    activityCardCount === 3 ? "lg:grid-cols-3" : activityCardCount === 2 ? "lg:grid-cols-2" : "";

  return (
    <AdminPage>
      {/* The at-a-glance row: what the catalog holds, and what it is capturing.
          It carries no heading of its own — the top bar's title and one-liner
          already introduce it. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Providers"
          value={providers.length}
          subtitle={`${activeProviders.length} active`}
          icon={Building2}
          color="bg-blue-500"
          link={linkIf("/admin/providers")}
          loading={loadingProviders}
        />
        <StatCard
          title="Plans"
          value={plans.length}
          subtitle={`${activePlans.length} active`}
          icon={Zap}
          color="bg-orange-500"
          link={linkIf("/admin/plans")}
          loading={loadingPlans}
        />
        <StatCard
          title="Leads"
          value={leadStats.total}
          subtitle={`${leadStats.new} new`}
          icon={UserPlus}
          color="bg-purple-500"
          link={linkIf("/admin/leads")}
          loading={loadingLeads}
        />
      </div>

      {/*
        Pricing readiness.

        The plans screen already counts how many plans carry a delivery charge,
        which is what that screen is for. It is not what someone landing here
        needs, because nothing on this page said that the site's headline
        promise was switched off: providers, plans, leads and revenue all read
        as healthy while no plan anywhere could produce a monthly bill or a
        savings comparison, and every match score was capped at 79.

        The banner separates the two shapes of the problem on purpose. With no
        territories configured the whole catalog is waiting on one job, and
        sending an operator to edit plans one at a time is sending them the
        wrong way — delivery belongs to the territory, so configuring the
        territory prices every plan in it at once. With territories in place and
        a few plans still short, the plans screen genuinely is the work queue.

        It stays visible when everything is priced. This is the number that
        quietly went to zero once already; a check you can only see when it is
        failing is one you cannot confirm is passing.
      */}
      {!loadingPlans && !loadingTerritories && !loadingBuyers && !loadingLeads && (
        <div
          className={`rounded-lg border p-4 ${
            readiness.launchReady
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {readiness.launchReady ? (
              <Gauge className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="text-sm w-full">
              <p className={`font-semibold ${readiness.launchReady ? "text-emerald-900" : "text-amber-900"}`}>
                {readiness.launchReady
                  ? "Ready to take customers"
                  : `${readiness.blockers.length} thing${readiness.blockers.length === 1 ? "" : "s"} still stop this site doing its job`}
              </p>

              <ul className="mt-2 space-y-1.5">
                <ReadinessRow
                  ok={readiness.deliveryConfigured}
                  label="Delivery tariffs"
                  okText={`${readiness.complete} of ${readiness.active} active plans can show a full monthly estimate`}
                  badText={`No utility territory is configured, so none of the ${readiness.active} active plans can show a monthly bill or a savings comparison.`}
                  fixPath="/admin/territories"
                  fixLabel="Configure delivery tariffs"
                  linkIf={linkIf}
                />
                <ReadinessRow
                  ok={readiness.buyersConfigured}
                  label="Lead buyers"
                  okText={`${readiness.activeBuyers} active buyer${readiness.activeBuyers === 1 ? "" : "s"} can receive leads`}
                  badText={`No lead buyer is configured, so every lead captured is stored and goes nowhere${readiness.leads ? ` — including the ${readiness.leads} already captured` : ""}.`}
                  fixPath="/admin/lead-buyers"
                  fixLabel="Add a lead buyer"
                  linkIf={linkIf}
                />
                <ReadinessRow
                  ok={readiness.catalogFresh}
                  label="Published catalog"
                  okText={`${readiness.livePlans} live plans, in step with the ${readiness.snapshotPlans} the public pages publish`}
                  badText={`The public pages were built from a snapshot of ${readiness.snapshotPlans} plans and the catalog now holds ${readiness.livePlans}. Visitors are being shown counts the comparison engine cannot deliver; a redeploy republishes the pages from the current catalog.`}
                  fixPath="/admin/plans"
                  fixLabel="Review the catalog"
                  linkIf={linkIf}
                />
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* What the catalog is producing */}
      <section>
        <AdminSectionHeading icon={BarChart3}>Analytics Overview</AdminSectionHeading>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${analyticsColumns} gap-4`}>
          {analyticsTiles.map(({ key, ...tile }) => (
            <StatCard key={key} {...tile} />
          ))}
        </div>
      </section>

      {/* The detail behind the numbers above. Each card is a window onto another
          screen, so each is shown only to a role that may open that screen —
          these carry named people and named links, not just totals. */}
      <section>
        <AdminSectionHeading icon={Activity}>Recent Activity</AdminSectionHeading>
        <div className={`grid grid-cols-1 ${activityColumns} gap-6 items-start`}>
          {/* Recent Leads */}
          {canSeeLeads && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Leads</CardTitle>
                <Link
                  to="/admin/leads"
                  className="text-sm text-[#0A5C8C] hover:underline"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentLeads.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No leads captured yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {lead.name || lead.email || "Unknown"}
                        </p>
                        {/* Truncated like the line above it. Without this a long
                            address widened the row past the viewport and scrolled
                            the whole dashboard sideways on a phone. */}
                        <p className="text-xs text-gray-500 truncate">
                          {lead.email}{lead.state ? ` · ${lead.state}` : ''}
                        </p>
                      </div>
                      <Badge
                        variant={
                          lead.status === "converted"
                            ? "default"
                            : lead.status === "contacted"
                            ? "secondary"
                            : "outline"
                        }
                        className="ml-3 flex-shrink-0"
                      >
                        {lead.status === "converted" && (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        )}
                        {lead.status === "contacted" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {lead.status === "new" && (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {lead.status || "new"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Top Affiliate Slugs */}
          {canSeeAffiliates && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Affiliate Links</CardTitle>
                <Link
                  to="/admin/affiliates"
                  className="text-sm text-[#0A5C8C] hover:underline"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {affiliateData.topSlugs.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No affiliate clicks recorded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {affiliateData.topSlugs.map((item, index) => (
                    <div
                      key={item.slug}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-amber-600"
                            : "bg-gray-300"
                        }`}>
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            /go/{item.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <MousePointerClick className="w-3 h-3 text-cyan-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Platform Overview — totals only, so everyone who may open the
              dashboard may see it. */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Platform Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <OverviewRow
                  icon={Building2}
                  label="Active Providers"
                  value={`${activeProviders.length} / ${providers.length}`}
                  tone="blue"
                  loading={loadingProviders}
                />
                <OverviewRow
                  icon={Zap}
                  label="Active Plans"
                  value={`${activePlans.length} / ${plans.length}`}
                  tone="purple"
                  loading={loadingPlans}
                />
                <OverviewRow
                  icon={TrendingUp}
                  label="Avg Plans per Provider"
                  value={
                    providers.length > 0
                      ? (plans.length / providers.length).toFixed(1)
                      : "—"
                  }
                  tone="orange"
                  loading={loadingCatalog}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AdminPage>
  );
}
