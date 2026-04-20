import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wand2,
  Layout,
  Plus,
  Clock,
  Users,
  Target,
  TrendingUp,
  ChevronRight,
  Play,
  FileText,
  Star,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePracticeStore, useTeamStore } from "@/store";
import { formatMinutes, AGE_GROUP_LABELS, CATEGORY_LABELS } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35 },
  }),
};

function QuickAction({
  icon: Icon,
  title,
  description,
  to,
  variant = "default",
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  to: string;
  variant?: "primary" | "default";
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Link to={to}>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] ${
            variant === "primary"
              ? "border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10"
              : ""
          }`}
        >
          <CardContent className="flex items-start gap-4 p-5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                variant === "primary"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div custom={index} initial="hidden" animate="visible" variants={fadeInUp}>
      <Card>
        <CardContent className="flex items-start gap-4 p-5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold leading-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Dashboard() {
  const practices = usePracticeStore((s) => s.practices);
  const teams = useTeamStore((s) => s.teams);
  const activeTeamId = useTeamStore((s) => s.activeTeamId);
  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? teams[0];
  const recentPractices = practices.slice(0, 3);
  const savedPlans = practices.filter((p) => p.status === "saved").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero welcome */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Good morning, Coach 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeTeam
              ? `${activeTeam.name} · ${AGE_GROUP_LABELS[activeTeam.ageGroup]} ${activeTeam.sport}`
              : "Ready to build your next great practice?"}
          </p>
        </div>
        <Link to="/app/generate">
          <Button variant="brand" size="lg" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Generate Practice
          </Button>
        </Link>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          icon={FileText}
          label="Saved Plans"
          value={savedPlans}
          sub="this season"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
        />
        <StatCard
          index={1}
          icon={Users}
          label="Teams"
          value={teams.length}
          sub="active rosters"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
        />
        <StatCard
          index={2}
          icon={Clock}
          label="Avg Practice"
          value={practices.length > 0 ? formatMinutes(Math.round(practices.reduce((a, p) => a + p.totalMinutes, 0) / practices.length)) : "–"}
          sub="per session"
          color="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
        />
        <StatCard
          index={3}
          icon={TrendingUp}
          label="Drills Used"
          value={practices.reduce((a, p) => a + p.blocks.length, 0)}
          sub="total blocks"
          color="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
        />
      </div>

      {/* Quick actions */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base font-semibold mb-3"
        >
          Quick Start
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <QuickAction
            index={0}
            icon={Wand2}
            title="Generate a Practice"
            description="AI-powered plan from your inputs in seconds"
            to="/app/generate"
            variant="primary"
          />
          <QuickAction
            index={1}
            icon={Layout}
            title="Use a Template"
            description="Start from a proven practice structure"
            to="/app/templates"
          />
          <QuickAction
            index={2}
            icon={Plus}
            title="Browse Drill Library"
            description="Find and add individual drills to any plan"
            to="/app/library"
          />
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent practices */}
        <motion.section custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Practices</CardTitle>
                <Link to="/app/dashboard" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {recentPractices.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No practices yet</p>
                  <Link to="/app/generate">
                    <Button size="sm" className="mt-3">Generate First Practice</Button>
                  </Link>
                </div>
              ) : (
                recentPractices.map((p) => (
                  <Link key={p.id} to={`/app/practices/${p.id}`}>
                    <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatMinutes(p.totalMinutes)} · {p.blocks.length} drills ·{" "}
                          {p.goals.map((g) => CATEGORY_LABELS[g] ?? g).join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={p.status === "saved" ? "success" : "secondary"} className="text-xs">
                          {p.status}
                        </Badge>
                        <Link to={`/app/run/${p.id}`} onClick={(e) => e.stopPropagation()}>
                          <Button size="icon-sm" variant="ghost">
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Active team */}
        <motion.section custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Active Team</CardTitle>
                <Link to="/app/teams" className="text-xs text-primary hover:underline">
                  Manage
                </Link>
              </div>
              {activeTeam && (
                <CardDescription>
                  {activeTeam.name} · {activeTeam.sport}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {activeTeam ? (
                <div className="space-y-4">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Players</p>
                      <p className="font-bold text-lg">{activeTeam.players.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Coaches</p>
                      <p className="font-bold text-lg">{activeTeam.coaches.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Age Group</p>
                      <p className="font-bold text-lg">{AGE_GROUP_LABELS[activeTeam.ageGroup]}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Level</p>
                      <p className="font-bold text-lg capitalize">{activeTeam.skillLevel}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Roster readiness</span>
                      <span>{activeTeam.players.length} / 18 players</span>
                    </div>
                    <Progress value={(activeTeam.players.length / 18) * 100} className="h-1.5" />
                  </div>
                  <div className="flex gap-2">
                    {activeTeam.coaches.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {c.name}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {activeTeam.players.slice(0, 8).map((p) => (
                      <div
                        key={p.id}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
                        title={p.name}
                      >
                        {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                    ))}
                    {activeTeam.players.length > 8 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        +{activeTeam.players.length - 8}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No team yet</p>
                  <Link to="/app/teams">
                    <Button size="sm" className="mt-3">Create Team</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>

      {/* Recommended actions */}
      <motion.section custom={4} initial="hidden" animate="visible" variants={fadeInUp}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Recommended Next Steps</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 grid sm:grid-cols-3 gap-3">
            {[
              { text: "Generate a defensive practice for this week", to: "/app/generate" },
              { text: "Update your roster before next session", to: "/app/teams" },
              { text: "Explore the 90-min fundamentals template", to: "/app/templates" },
            ].map((r, i) => (
              <Link key={i} to={r.to}>
                <div className="flex items-start gap-2 rounded-lg p-3 bg-background border hover:border-primary/40 transition-colors cursor-pointer">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm">{r.text}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
