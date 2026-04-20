import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGeneratorStore } from "@/store";
import { cn } from "@/lib/utils";
import type { GeneratorInput } from "@/types";

function OptionButton<T extends string>({
  value,
  selected,
  onClick,
  label,
  description,
}: {
  value: T;
  selected: boolean;
  onClick: () => void;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-input hover:border-primary/40"
      )}
    >
      <span className="font-medium text-sm">{label}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
      <div>
        <Label className="text-sm">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function StepPreferences() {
  const { input, setInput } = useGeneratorStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Practice Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fine-tune how the practice is structured.
        </p>
      </div>

      {/* Practice style */}
      <div className="space-y-2">
        <Label>Practice Style</Label>
        <div className="grid sm:grid-cols-3 gap-3">
          <OptionButton<GeneratorInput["practiceStyle"]>
            value="high-energy"
            selected={input.practiceStyle === "high-energy"}
            onClick={() => setInput({ practiceStyle: "high-energy" })}
            label="High Energy"
            description="Fast reps, competition, intensity"
          />
          <OptionButton<GeneratorInput["practiceStyle"]>
            value="balanced"
            selected={input.practiceStyle === "balanced"}
            onClick={() => setInput({ practiceStyle: "balanced" })}
            label="Balanced"
            description="Mix of technique and reps"
          />
          <OptionButton<GeneratorInput["practiceStyle"]>
            value="technical"
            selected={input.practiceStyle === "technical"}
            onClick={() => setInput({ practiceStyle: "technical" })}
            label="Technical"
            description="Deep instruction, slow it down"
          />
        </div>
      </div>

      {/* Station preference */}
      <div className="space-y-2">
        <Label>Station Structure</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          <OptionButton<GeneratorInput["stationPreference"]>
            value="many-stations"
            selected={input.stationPreference === "many-stations"}
            onClick={() => setInput({ stationPreference: "many-stations" })}
            label="More Stations"
            description="Players rotate, more variety"
          />
          <OptionButton<GeneratorInput["stationPreference"]>
            value="few-stations"
            selected={input.stationPreference === "few-stations"}
            onClick={() => setInput({ stationPreference: "few-stations" })}
            label="Fewer Stations"
            description="Deeper focus, less switching"
          />
        </div>
      </div>

      {/* Block duration */}
      <div className="space-y-2">
        <Label>Drill Block Length</Label>
        <div className="grid sm:grid-cols-3 gap-3">
          <OptionButton<GeneratorInput["blockDuration"]>
            value="short"
            selected={input.blockDuration === "short"}
            onClick={() => setInput({ blockDuration: "short" })}
            label="Short Blocks"
            description="8–12 min per drill"
          />
          <OptionButton<GeneratorInput["blockDuration"]>
            value="mixed"
            selected={input.blockDuration === "mixed"}
            onClick={() => setInput({ blockDuration: "mixed" })}
            label="Mixed"
            description="Flexible, AI decides"
          />
          <OptionButton<GeneratorInput["blockDuration"]>
            value="long"
            selected={input.blockDuration === "long"}
            onClick={() => setInput({ blockDuration: "long" })}
            label="Long Blocks"
            description="15–25 min per drill"
          />
        </div>
      </div>

      {/* Emphasis */}
      <div className="space-y-2">
        <Label>Practice Emphasis</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          <OptionButton<GeneratorInput["emphasisMode"]>
            value="repetition"
            selected={input.emphasisMode === "repetition"}
            onClick={() => setInput({ emphasisMode: "repetition" })}
            label="Reps First"
            description="Volume of quality reps"
          />
          <OptionButton<GeneratorInput["emphasisMode"]>
            value="instruction"
            selected={input.emphasisMode === "instruction"}
            onClick={() => setInput({ emphasisMode: "instruction" })}
            label="Instruction First"
            description="Teach, then execute"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-xl border p-4">
        <ToggleRow
          label="Include Warmup"
          description="Dynamic warmup + throwing progression"
          checked={input.includeWarmup ?? true}
          onCheckedChange={(v) => setInput({ includeWarmup: v })}
        />
        <ToggleRow
          label="Include Cooldown"
          description="Team stretch and debrief at end"
          checked={input.includeCooldown ?? true}
          onCheckedChange={(v) => setInput({ includeCooldown: v })}
        />
        <ToggleRow
          label="Include Mental Coaching"
          description="Add a brief mental skills segment"
          checked={input.includeMentalCoaching ?? false}
          onCheckedChange={(v) => setInput({ includeMentalCoaching: v })}
        />
      </div>
    </div>
  );
}
