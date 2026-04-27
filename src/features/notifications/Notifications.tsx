import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, CreditCard, Bell, Check, X, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type NotifCategory = "safety" | "engagement" | "billing" | "all";

interface Notif {
  id: string;
  category: "safety" | "engagement" | "billing";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  severity?: "high" | "medium" | "low";
  actionLabel?: string;
}

const NOTIFS: Notif[] = [
  { id: "n1", category: "safety",     title: "Pitch count limit approaching — Marcus T.",  body: "Marcus Thompson has thrown 82 pitches this week. NCAA guidelines recommend rest after 85. Consider adjusting Tuesday's plan.", timestamp: "2026-04-27T09:15:00", read: false, severity: "high",   actionLabel: "Review plan" },
  { id: "n2", category: "safety",     title: "Arm soreness reported — Jordan K.",          body: "Jordan Kim self-reported right arm soreness (3/10) before today's session. Flagged for coach review before fielding drills.", timestamp: "2026-04-27T08:02:00", read: false, severity: "high",   actionLabel: "View profile" },
  { id: "n3", category: "engagement", title: "Practice attendance dipped this week",        body: "Average attendance dropped to 14/20 (70%) for the past 3 sessions vs. 88% the prior week. Top reason: school conflicts.", timestamp: "2026-04-26T17:00:00", read: false, severity: "medium", actionLabel: "See analytics" },
  { id: "n4", category: "safety",     title: "Heat index warning — Thursday session",       body: "Weather forecast shows heat index of 101°F for Thursday 4 PM. Recommend shortened warmup and mandatory water breaks.", timestamp: "2026-04-26T14:30:00", read: true,  severity: "high",   actionLabel: "Adjust practice" },
  { id: "n5", category: "engagement", title: "3 players completed skill milestones",        body: "Alex Rivera, Sam Park, and Chloe Washington unlocked 'Consistent Contact' milestone this week. Great progress!", timestamp: "2026-04-25T18:00:00", read: true,  severity: "low" },
  { id: "n6", category: "billing",    title: "Subscription renews in 7 days",               body: "Your DiamondOS Pro plan renews on May 4, 2026 for $49/month. Update payment method if needed.", timestamp: "2026-04-25T09:00:00", read: true,  severity: "low",  actionLabel: "Manage billing" },
  { id: "n7", category: "engagement", title: "AI insights available for last practice",     body: "New coaching notes and drill adjustment recommendations generated for your April 24 fielding session.", timestamp: "2026-04-24T21:00:00", read: true,  severity: "low",  actionLabel: "View insights" },
  { id: "n8", category: "billing",    title: "Invoice #1047 generated",                     body: "Your invoice for April 2026 has been processed successfully. Amount: $49.00.", timestamp: "2026-04-01T09:00:00", read: true, severity: "low", actionLabel: "Download invoice" },
];

const CAT_ICONS = { safety: AlertTriangle, engagement: TrendingUp, billing: CreditCard };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function Notifications() {
  const [filter, setFilter] = useState<NotifCategory>("all");
  const [notifs, setNotifs] = useState(NOTIFS);

  const filtered = filter === "all" ? notifs : notifs.filter((n) => n.category === filter);
  const unread   = notifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-foreground">
            Notifications
            {unread > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white">{unread}</span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Safety alerts, engagement, and system events</p>
        </div>
        {unread > 0 && (
          <button onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))}
            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <Check className="h-3.5 w-3.5" />Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl border bg-muted/40 p-1 w-fit">
        {(["all", "safety", "engagement", "billing"] as NotifCategory[]).map((cat) => {
          const count = cat === "all" ? unread : notifs.filter((n) => n.category === cat && !n.read).length;
          const Icon  = cat !== "all" ? CAT_ICONS[cat as "safety"|"engagement"|"billing"] : null;
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                filter === cat ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              {count > 0 && (
                <span className="ml-0.5 h-4 min-w-4 rounded-full bg-muted px-1 text-[10px]">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="dos-card px-6 py-10 text-center text-muted-foreground text-sm">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />No notifications in this category
          </div>
        )}
        {filtered.map((notif, i) => {
          const Icon = CAT_ICONS[notif.category];
          return (
            <motion.div key={notif.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "dos-card px-4 py-4 flex items-start gap-3 group",
                !notif.read && "border-l-2 border-l-emerald-500"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                notif.category === "safety"     && "bg-red-50 text-red-500",
                notif.category === "engagement" && "bg-emerald-50 text-emerald-600",
                notif.category === "billing"    && "bg-blue-50 text-blue-500",
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("font-medium text-sm", notif.read ? "text-muted-foreground" : "text-foreground")}>
                    {notif.title}
                  </span>
                  {notif.severity === "high" && (
                    <span className="pill-safety"><AlertTriangle className="h-2.5 w-2.5" />Urgent</span>
                  )}
                  {notif.severity === "medium" && (
                    <span className="pill-warning">Medium</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />{timeAgo(notif.timestamp)}
                  </span>
                  {notif.actionLabel && (
                    <button className="flex items-center gap-0.5 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium">
                      {notif.actionLabel}<ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => setNotifs((ns) => ns.filter((n) => n.id !== notif.id))}
                className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
