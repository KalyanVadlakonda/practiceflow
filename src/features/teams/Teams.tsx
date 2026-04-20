import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Users,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { useTeamStore, useUIStore } from "@/store";
import { AGE_GROUP_LABELS, SKILL_LABELS, cn } from "@/lib/utils";
import type { Team, Player } from "@/types";
import { generateId } from "@/lib/utils";

function PositionBadge({ pos }: { pos: string }) {
  const colors: Record<string, string> = {
    P: "bg-red-100 text-red-700",
    C: "bg-purple-100 text-purple-700",
    "1B": "bg-blue-100 text-blue-700",
    "2B": "bg-blue-100 text-blue-700",
    "3B": "bg-blue-100 text-blue-700",
    SS: "bg-blue-100 text-blue-700",
    LF: "bg-green-100 text-green-700",
    CF: "bg-green-100 text-green-700",
    RF: "bg-green-100 text-green-700",
    DH: "bg-orange-100 text-orange-700",
    UTIL: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded px-1.5 py-0.5 text-xs font-bold",
        colors[pos] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {pos}
    </span>
  );
}

function PlayerRow({ player }: { player: Player }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
        {player.number ?? "#"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{player.name}</span>
          {player.tags?.map((t) => (
            <span key={t} className="flex items-center gap-0.5 rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-medium">
              <Star className="h-2.5 w-2.5" />
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {player.positions.map((p) => (
            <PositionBadge key={p} pos={p} />
          ))}
        </div>
      </div>
      <div className="text-xs text-muted-foreground shrink-0 text-right">
        <div>
          {player.throwingSide === "left" ? "L" : player.throwingSide === "switch" ? "S" : "R"}T /{" "}
          {player.battingSide === "left" ? "L" : player.battingSide === "switch" ? "S" : "R"}H
        </div>
        {player.skillLevel && (
          <div className="capitalize">{SKILL_LABELS[player.skillLevel]}</div>
        )}
      </div>
    </div>
  );
}

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

  const handleDelete = () => {
    deleteTeam(team.id);
    addNotification({ type: "success", title: "Team deleted" });
  };

  return (
    <Card className={cn("overflow-hidden", isActive && "border-primary/40 ring-1 ring-primary/30")}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
            {team.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{team.name}</CardTitle>
              {isActive && (
                <span className="rounded-full bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 text-xs font-semibold">
                  Active
                </span>
              )}
            </div>
            <CardDescription className="flex flex-wrap gap-2 mt-0.5">
              <Badge variant="outline" className="capitalize text-xs">{team.sport}</Badge>
              <Badge variant="secondary" className="text-xs">{AGE_GROUP_LABELS[team.ageGroup]}</Badge>
              <Badge variant="outline" className="capitalize text-xs">{team.competitiveLevel}</Badge>
            </CardDescription>
          </div>
          <div className="flex gap-1 shrink-0">
            {!isActive && (
              <Button size="sm" variant="outline" onClick={onSetActive}>
                Set Active
              </Button>
            )}
            <Button size="icon-sm" variant="ghost" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 text-sm mt-2">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {team.players.length} players
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <UserCheck className="h-3.5 w-3.5" />
            {team.coaches.length} coaches
          </span>
          <span className="text-muted-foreground capitalize">
            {SKILL_LABELS[team.skillLevel]}
          </span>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Coaches */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Coaching Staff
            </p>
            <div className="flex flex-wrap gap-2">
              {team.coaches.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1.5 text-sm font-medium"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  {c.name} ({c.role})
                </div>
              ))}
            </div>
          </div>

          {/* Players */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Roster ({team.players.length} players)
            </p>
            <div>
              {team.players.map((p) => (
                <PlayerRow key={p.id} player={p} />
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-1" />
              Edit Team
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teams & Roster</h1>
          <p className="text-muted-foreground mt-1">
            Manage your teams, rosters, and coaching staff.
          </p>
        </div>
        <Button variant="brand" onClick={() => setShowNewTeam(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Team
        </Button>
      </div>

      {/* Teams list */}
      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Users className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No teams yet</h2>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            Create your first team to get personalized practice recommendations.
          </p>
          <Button variant="brand" onClick={() => setShowNewTeam(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Create First Team
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
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
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input hover:border-primary/50"
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
              variant="brand"
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim()}
            >
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
