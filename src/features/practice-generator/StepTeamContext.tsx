import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGeneratorStore, useTeamStore } from "@/store";
import type { GeneratorInput } from "@/types";
import { AGE_GROUP_LABELS, SKILL_LABELS, formatMinutes } from "@/lib/utils";
import { Users } from "lucide-react";

const EQUIPMENT_OPTIONS = [
  "baseballs",
  "softballs",
  "gloves",
  "bases",
  "fungo-bat",
  "batting-tee",
  "batting-cage",
  "pitching-machine",
  "catcher-gear",
  "agility-ladder",
  "cones",
  "net",
  "batting-screen",
  "bullpen-mound",
];

export function StepTeamContext() {
  const { input, setInput } = useGeneratorStore();
  const teams = useTeamStore((s) => s.teams);

  const handleTeamSelect = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    setInput({
      teamId,
      sport: team.sport,
      ageGroup: team.ageGroup,
      skillLevel: team.skillLevel,
      competitiveLevel: team.competitiveLevel,
      rosterSize: team.players.length,
      coachCount: team.coaches.length,
    });
  };

  const toggleEquipment = (item: string) => {
    const current = input.equipment ?? [];
    setInput({
      equipment: current.includes(item)
        ? current.filter((e) => e !== item)
        : [...current, item],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Team Context</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about your team so we can tailor the practice plan.
        </p>
      </div>

      {/* Quick-fill from saved team */}
      {teams.length > 0 && (
        <div className="rounded-lg border border-dashed p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Auto-fill from saved team</span>
          </div>
          <Select onValueChange={handleTeamSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a team..." />
            </SelectTrigger>
            <SelectContent>
              {teams.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} ({AGE_GROUP_LABELS[t.ageGroup]} {t.sport})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Sport */}
        <div className="space-y-1.5">
          <Label>Sport *</Label>
          <div className="flex gap-2">
            {(["baseball", "softball"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setInput({ sport: s })}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium capitalize transition-all ${
                  input.sport === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:border-primary/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Age group */}
        <div className="space-y-1.5">
          <Label>Age Group *</Label>
          <Select
            value={input.ageGroup}
            onValueChange={(v) => setInput({ ageGroup: v as GeneratorInput["ageGroup"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skill level */}
        <div className="space-y-1.5">
          <Label>Skill Level *</Label>
          <Select
            value={input.skillLevel}
            onValueChange={(v) => setInput({ skillLevel: v as GeneratorInput["skillLevel"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SKILL_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Competitive level */}
        <div className="space-y-1.5">
          <Label>Competitive Level</Label>
          <Select
            value={input.competitiveLevel}
            onValueChange={(v) => setInput({ competitiveLevel: v as GeneratorInput["competitiveLevel"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recreational">Recreational</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="college">College</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Environment */}
        <div className="space-y-1.5">
          <Label>Practice Environment</Label>
          <div className="flex gap-2">
            {(["outdoor", "indoor"] as const).map((e) => (
              <button
                key={e}
                onClick={() => setInput({ environment: e })}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium capitalize transition-all ${
                  input.environment === e
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:border-primary/50"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label>
            Practice Duration:{" "}
            <span className="text-primary font-semibold">
              {formatMinutes(input.durationMinutes ?? 75)}
            </span>
          </Label>
          <Slider
            min={30}
            max={180}
            step={5}
            value={[input.durationMinutes ?? 75]}
            onValueChange={([v]) => setInput({ durationMinutes: v })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30 min</span>
            <span>3 hours</span>
          </div>
        </div>

        {/* Roster size */}
        <div className="space-y-2">
          <Label>
            Roster Size:{" "}
            <span className="text-primary font-semibold">{input.rosterSize ?? 12} players</span>
          </Label>
          <Slider
            min={4}
            max={25}
            step={1}
            value={[input.rosterSize ?? 12]}
            onValueChange={([v]) => setInput({ rosterSize: v })}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>4</span>
            <span>25</span>
          </div>
        </div>

        {/* Coach count */}
        <div className="space-y-2">
          <Label>
            Coaches Available:{" "}
            <span className="text-primary font-semibold">{input.coachCount ?? 2}</span>
          </Label>
          <Slider
            min={1}
            max={5}
            step={1}
            value={[input.coachCount ?? 2]}
            onValueChange={([v]) => setInput({ coachCount: v })}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div className="space-y-2">
        <Label>Equipment Available</Label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => {
            const selected = (input.equipment ?? []).includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleEquipment(item)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:border-primary/50"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label>Special Notes (optional)</Label>
        <Input
          placeholder="e.g., limited space, injured pitcher on restrictions..."
          value={input.notes ?? ""}
          onChange={(e) => setInput({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}
