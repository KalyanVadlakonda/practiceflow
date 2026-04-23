import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertTriangle,
  Star,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTeamStore, useUIStore } from "@/store";
import { AGE_GROUP_LABELS, SKILL_LABELS, cn } from "@/lib/utils";
import type { Team, Player } from "@/types";
import { generateId } from "@/lib/utils";

// ─── Fake skill data for demo ──────────────────────────────────────────────────

function fakeSkill(seed: string, offset = 0) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Math.min(99, ((h % 45) + 50 + offset));
}

function playerSkills(p: Player) {
  const base = p.name + p.id;
  return {
    fielding:  fakeSkill(base + "f"),
    hitting:   fakeSkill(base + "h", -5),
    throwing:  fakeSkill(base + "t", 2),
    attendance: fakeSkill(base + "a", 10) > 99 ? 97 : fakeSkill(base + "a", 10),
    armSore:   (fakeSkill(base + "s") % 10) === 0,
    pitches:   p.positions.includes("P") ? (fakeSkill(base + "p") % 60) + 40 : null,
  };
}

// ─── Skill bar ─────────────────────────────────────────────────────────────────

function SkillBar({ value, color = "bg-emerald-500", label }: { value: number; color?: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/40">{label}</span>
        <span className="text-[10px] text-white/50 font-medium">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Position badge ────────────────────────────────────────────────────────────

const POS_COLORS: Record<string, string> = {
  P:    "bg-red-500/20 text-red-400",
  C:    "bg-violet-500/20 text-violet-400",
  "1B": "bg-blue-500/20 text-blue-400",
  "2B": "bg-blue-500/20 text-blue-400",
  "3B": "bg-blue-500/20 text-blue-400",
  SS:   "bg-blue-500/20 text-blue-400",
  LF:   "bg-emerald-500/20 text-emerald-400",
  CF:   "bg-emerald-500/20 text-emerald-400",
  RF:   "bg-emerald-500/20 text-emerald-400",
  DH:   "bg-amber-500/20 text-amber-400",
};

function PositionBadge({ pos }: { pos: string }) {
  return (
    <span className={cn(
      "inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold",
      POS_COLORS[pos] ?? "bg-white/10 text-white/50"
    )}>
      {pos}
    </span>
  );
}

// ─── Player row ────────────────────────────────────────────────────────────────

function PlayerRow({ player }: { player: Player }) {
  const [expanded, setExpanded] = useState(false);
  const skills = playerSkills(player);

  return (
    <div className="border-b border-white/6 last:border-0">
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/4 cursor-pointer transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/70">
          {player.number ?? player.name.charAt(0)}
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-white">{player.name}</span>
            {skills.armSore && (
              <span className="pill-safety">
                <AlertTriangle className="h-2.5 w-2.5" />
                Arm soreness
              </span>
            )}
            {skills.pitches !== null && skills.pitches > 70 && (
              <span className="pill-warning">
                {skills.pitches} pitches
              </span>
            )}
            {player.tags?.map((t) => (
              <span key={t} className="flex items-center gap-0.5 rounded-full bg-amber-500/15 text-amber-400 px-2 py-0.5 text-[10px] font-medium">
                <Star className="h-2 w-2" />
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {player.positions.map((p) => (
              <PositionBadge key={p} pos={p} />
            ))}
          </div>
        </div>

        {/* Attendance + side info */}
        <div className="text-right shrink-0">
          <div className="text-xs text-white/40">
            {player.throwingSide === "left" ? "L" : player.throwingSide === "switch" ? "S" : "R"}T /
            {" "}{player.battingSide === "left" ? "L" : player.battingSide === "switch" ? "S" : "R"}H
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">{skills.attendance}% att.</div>
        </div>

        <div className={cn(
          "text-white/30 transition-transform duration-150",
          expanded && "rotate-180"
        )}>
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Expanded skill panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-4 px-4 pb-4 pt-1 bg-white/3">
              <SkillBar value={skills.fielding} color="bg-emerald-500" label="Fielding" />
              <SkillBar value={skills.hitting}  color="bg-blue-400"    label="Hitting" />
              <SkillBar value={skills.throwing} color="bg-amber-400"   label="Throwing" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Team card ────────────────────────────────────────────────────────────────

function TeamCard({
  team,
  isActive,
  onSetActive,
}: {
  team: Team;
  isActive: boolean;
  onSetActive: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const deleteTeam = useTeamStore((s) => s.deleteTeam);
  const addNotification = useUIStore((s) => s.addNotification);

  const flaggedPlayers = team.players.filter((p) => playerSkills(p).armSore);

  return (
    <div className={cn(
      "dos-card overflow-hidden",
      isActive && "border-emerald-500/40"
    )}>
      {/* Card header */}
      <div className="flex items-start gap-4 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm font-heading">
          {team.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-base text-white">{team.name}</span>
            {isActive && (
              <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold">
                Active
              </span>
            )}
            {flaggedPlayers.length > 0 && (
              <span className="pill-safety">
                <AlertTriangle className="h-2.5 w-2.5" />
                {flaggedPlayers.length} flagged
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
            <span className="capitalize">{team.sport}</span>
            <span>·</span>
            <span>{AGE_GROUP_LABELS[team.ageGroup]}</span>
            <span>·</span>
            <span className="capitalize">{team.competitiveLevel}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {team.players.length}
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              {team.coaches.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isActive && (
            <button
              onClick={onSetActive}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:bg-white/8 hover:text-white/90 transition-colors"
            >
              Set Active
            </button>
          )}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/8 hover:text-white/70 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/8"
          >
            {/* Coaches */}
            <div className="px-5 py-3 border-b border-white/6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">
                Coaching Staff
              </p>
              <div className="flex flex-wrap gap-2">
                {team.coaches.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 px-3 py-1 text-xs font-medium"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    {c.name} · {c.role}
                  </div>
                ))}
              </div>
            </div>

            {/* Players */}
            <div>
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Roster — {team.players.length} players
                </p>
                <p className="text-[10px] text-white/20">Click player to see skills</p>
              </div>
              {team.players.map((p) => (
                <PlayerRow key={p.id} player={p} />
              ))}
              {team.players.length === 0 && (
                <p className="px-5 py-4 text-xs text-white/30">No players added yet.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 px-5 py-3 border-t border-white/6">
              <button className="flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-1.5 text-xs text-white/50 hover:bg-white/6 hover:text-white/80 transition-colors">
                <Activity className="h-3 w-3" />
                Edit Roster
              </button>
              <button
                onClick={() => {
                  deleteTeam(team.id);
                  addNotification({ type: "success", title: "Team deleted" });
                }}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function Teams() {
  const { teams, activeTeamId, setActiveTeam, addTeam } = useTeamStore();
  const addNotification = useUIStore((s) => s.addNotification);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamSport, setNewTeamSport] = useState<"baseball" | "softball">("baseball");
  const [newTeamAge, setNewTeamAge] = useState("14u");
  const [newTeamLevel, setNewTeamLevel] = useState("travel");

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    const team: Team = {
      id: generateId(),
      name: newTeamName.trim(),
      sport: newTeamSport,
      ageGroup: newTeamAge as Team["ageGroup"],
      skillLevel: "intermediate",
      competitiveLevel: newTeamLevel as Team["competitiveLevel"],
      players: [],
      coaches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTeam(team);
    setActiveTeam(team.id);
    setShowNewTeam(false);
    setNewTeamName("");
    addNotification({ type: "success", title: "Team created!", message: team.name });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-white">Teams & Roster</h2>
          <p className="text-sm text-white/40 mt-0.5">
            Manage rosters, view player skills, and track safety flags.
          </p>
        </div>
        <button
          onClick={() => setShowNewTeam(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Team
        </button>
      </div>

      {/* Teams list */}
      {teams.length === 0 ? (
        <div className="dos-card flex flex-col items-center py-20 gap-4">
          <Users className="h-12 w-12 text-white/15" />
          <h3 className="font-heading text-lg text-white">No teams yet</h3>
          <p className="text-sm text-white/40 text-center max-w-xs">
            Create your first team to get personalized practice recommendations and track player progress.
          </p>
          <button
            onClick={() => setShowNewTeam(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create First Team
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <TeamCard
                team={team}
                isActive={team.id === activeTeamId}
                onSetActive={() => setActiveTeam(team.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Team Dialog */}
      <Dialog open={showNewTeam} onOpenChange={setShowNewTeam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Team Name</Label>
              <Input
                placeholder="e.g., River City Thunder"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Sport</Label>
                <div className="flex gap-2">
                  {(["baseball", "softball"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewTeamSport(s)}
                      className={cn(
                        "flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-all",
                        newTeamSport === s
                          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                          : "border-white/15 text-white/50 hover:border-white/30"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Age Group</Label>
                <Select value={newTeamAge} onValueChange={setNewTeamAge}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Competitive Level</Label>
              <Select value={newTeamLevel} onValueChange={setNewTeamLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recreational">Recreational</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTeam(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
            >
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
