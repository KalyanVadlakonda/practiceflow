import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Loader2, Users } from "lucide-react";
import { useGeneratorStore, usePracticeStore, useUIStore, useTeamStore } from "@/store";
import { generatePracticePlanAI } from "@/services/aiService";
import { AGE_GROUP_LABELS, SKILL_LABELS, cn } from "@/lib/utils";
import type { GeneratorInput, DrillCategory } from "@/types";

// ─── Reference-site exact field options ───────────────────────────────────────

const FIELD_OPTIONS = [
  { value: "full-diamond", label: "Full Diamond" },
  { value: "infield",      label: "Infield Only" },
  { value: "cages",        label: "Batting Cages" },
  { value: "gym",          label: "Gymnasium" },
];

const FORMAT_OPTIONS = [
  { value: "high-energy", label: "Full Team" },
  { value: "balanced",    label: "Split Squad" },
  { value: "indoor",      label: "Indoor / Station" },
  { value: "technical",   label: "Stations Rotation" },
];

const FOCUS_AREAS: { id: DrillCategory; label: string }[] = [
  { id: "hitting",      label: "Hitting" },
  { id: "pitching",     label: "Pitching" },
  { id: "fielding",     label: "Fielding" },
  { id: "baserunning",  label: "Baserunning" },
  { id: "conditioning", label: "Conditioning" },
];

const EQUIPMENT_OPTIONS = [
  "Batting Tees", "L-Screens", "Cones", "Helmets",
  "Agility Ladders", "Resistance Bands", "Radar Gun", "Pitching Machine",
];

// Reference-site exact inline styles for form elements on the dark panel
const INPUT_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,.07)",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: "6px",
  padding: "7px 10px",
  color: "#fff",
  fontSize: "12.5px",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  width: "100%",
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,.4)",
  display: "block",
  marginBottom: "5px",
};

// ─── Inline-styled input components (pixel-perfect match) ─────────────────────

function GLabel({ children }: { children: React.ReactNode }) {
  return <label style={LABEL_STYLE}>{children}</label>;
}

function GInput({
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
}: {
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      min={min}
      max={max}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={INPUT_STYLE}
      onFocus={(e) => (e.target.style.borderColor = "#18a163")}
      onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,.12)")}
    />
  );
}

function GSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...INPUT_STYLE, cursor: "pointer", appearance: "auto" as any }}
      onFocus={(e) => (e.target.style.borderColor = "#18a163")}
      onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,.12)")}
    >
      {children}
    </select>
  );
}

// ─── Multi-select pill (Focus Areas / Equipment) ───────────────────────────────

function MCPill({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        border: checked ? "1px solid rgba(24,161,99,.7)" : "1px solid rgba(255,255,255,.14)",
        background: checked ? "rgba(24,161,99,.2)" : "rgba(255,255,255,.05)",
        borderRadius: "6px",
        padding: "5px 11px",
        fontSize: "11.5px",
        color: checked ? "#4ade80" : "rgba(255,255,255,.5)",
        cursor: "pointer",
        transition: "all .15s",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: checked ? 600 : 400,
      }}
    >
      {checked && "✓ "}{label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PracticeGenerator() {
  const navigate   = useNavigate();
  const { input, setInput }         = useGeneratorStore();
  const addPractice                 = usePracticeStore((s) => s.addPractice);
  const addNotification             = useUIStore((s) => s.addNotification);
  const teams                       = useTeamStore((s) => s.teams);
  const [generating, setGenerating] = useState(false);

  // Local fields that don't map to GeneratorInput but are shown in the form
  const [practiceDate, setPracticeDate] = useState("");
  const [startTime,    setStartTime]    = useState("15:30");
  const [fieldType,    setFieldType]    = useState("full-diamond");
  const [format,       setFormat]       = useState("balanced");
  const [skillAge,     setSkillAge]     = useState("14u-hs");

  const goals = input.primaryGoals ?? [];
  const equip = input.equipment ?? [];

  const toggleGoal  = (id: DrillCategory) =>
    setInput({ primaryGoals: goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id] });
  const toggleEquip = (item: string) =>
    setInput({ equipment: equip.includes(item) ? equip.filter((e) => e !== item) : [...equip, item] });

  const loadExample = (type: "indoor" | "split") => {
    if (type === "indoor") {
      setInput({ sport: "baseball", durationMinutes: 60, primaryGoals: ["conditioning", "fielding"], skillLevel: "intermediate" });
      setFormat("indoor");
      setFieldType("gym");
    } else {
      setInput({ sport: "baseball", durationMinutes: 90, primaryGoals: ["hitting", "fielding"], skillLevel: "intermediate" });
      setFormat("balanced");
    }
  };

  const handleGenerate = async () => {
    if (!input.sport || !input.durationMinutes) {
      addNotification({ type: "error", title: "Missing fields", message: "Sport and duration are required." });
      return;
    }
    setGenerating(true);
    try {
      const envMap: Record<string, "indoor" | "outdoor"> = {
        gym: "indoor", cages: "indoor", infield: "outdoor", "full-diamond": "outdoor",
      };
      const fmtMap: Record<string, GeneratorInput["practiceStyle"]> = {
        "high-energy": "high-energy", balanced: "balanced", indoor: "balanced", technical: "technical",
      };
      const mergedInput: GeneratorInput = {
        sport: input.sport ?? "baseball",
        ageGroup: input.ageGroup ?? "14u",
        skillLevel: input.skillLevel ?? "intermediate",
        competitiveLevel: input.competitiveLevel ?? "travel",
        environment: envMap[fieldType] ?? "outdoor",
        rosterSize: input.rosterSize ?? 14,
        coachCount: input.coachCount ?? 2,
        durationMinutes: input.durationMinutes ?? 90,
        primaryGoals: goals,
        secondaryGoals: input.secondaryGoals ?? [],
        equipment: equip,
        notes: input.notes,
        practiceStyle: fmtMap[format] ?? "balanced",
        stationPreference: format === "technical" || format === "indoor" ? "many-stations" : "few-stations",
        blockDuration: "mixed",
        includeWarmup: true,
        includeCooldown: true,
        includeMentalCoaching: false,
        emphasisMode: "instruction",
        teamId: input.teamId,
      };
      const plan = await generatePracticePlanAI(mergedInput);
      addPractice(plan);
      addNotification({ type: "success", title: "Practice generated!", message: `${plan.blocks.length} drills · ${plan.totalMinutes} min` });
      navigate(`/app/practices/${plan.id}`);
    } catch {
      addNotification({ type: "error", title: "Generation failed", message: "Something went wrong. Please try again." });
    } finally {
      setGenerating(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Page heading */}
      <div style={{ marginBottom: 14 }}>
        <h2 className="font-heading" style={{ fontSize: 19, color: "#0c1a2e", margin: 0 }}>Generate Practice</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
          Fill in session details and DiamondOS will build a complete structured plan instantly.
        </p>
      </div>

      {/* ── Dark navy form panel — matches reference site ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        style={{
          background: "#0c1a2e",
          borderRadius: 10,
          padding: "20px 22px",
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,.3)",
        }}
      >
        {/* Radial green glow — top-right (matches reference) */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 180, height: 180,
          background: "radial-gradient(circle, rgba(24,161,99,.2) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Auto-fill from saved team */}
          {teams.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)",
              borderRadius: 7, padding: "8px 12px",
            }}>
              <Users style={{ width: 14, height: 14, color: "rgba(255,255,255,.4)", flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)", flexShrink: 0 }}>Load team:</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {teams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setInput({
                      teamId: t.id, sport: t.sport, ageGroup: t.ageGroup,
                      skillLevel: t.skillLevel, competitiveLevel: t.competitiveLevel,
                      rosterSize: t.players.length || 14, coachCount: t.coaches.length || 2,
                    })}
                    style={{
                      border: "1px solid rgba(24,161,99,.4)", background: "rgba(24,161,99,.12)",
                      borderRadius: 20, padding: "3px 10px", fontSize: 11.5,
                      color: "#4ade80", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 3-column grid: 7 fields ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>

            {/* 1. Players Attending */}
            <div>
              <GLabel>Players Attending</GLabel>
              <GInput
                type="number"
                value={input.rosterSize ?? 14}
                onChange={(v) => setInput({ rosterSize: Math.max(1, Math.min(40, Number(v))) })}
                min={1}
                max={40}
              />
            </div>

            {/* 2. Coaches Available */}
            <div>
              <GLabel>Coaches Available</GLabel>
              <GInput
                type="number"
                value={input.coachCount ?? 2}
                onChange={(v) => setInput({ coachCount: Math.max(1, Math.min(10, Number(v))) })}
                min={1}
                max={10}
              />
            </div>

            {/* 3. Duration (min) */}
            <div>
              <GLabel>Duration (min)</GLabel>
              <GInput
                type="number"
                value={input.durationMinutes ?? 90}
                onChange={(v) => setInput({ durationMinutes: Math.max(30, Math.min(180, Number(v))) })}
                min={30}
                max={180}
              />
            </div>

            {/* 4. Skill Level / Age Group */}
            <div>
              <GLabel>Skill Level / Age Group</GLabel>
              <GSelect value={skillAge} onChange={(v) => {
                setSkillAge(v);
                const map: Record<string, { skill: GeneratorInput["skillLevel"]; age: GeneratorInput["ageGroup"] }> = {
                  "8u-10u":  { skill: "beginner",     age: "8u" },
                  "12u-ms":  { skill: "beginner",     age: "12u" },
                  "14u-hs":  { skill: "intermediate", age: "14u" },
                  "18u-col": { skill: "advanced",     age: "18u" },
                  "travel":  { skill: "advanced",     age: "16u" },
                };
                if (map[v]) setInput({ skillLevel: map[v].skill, ageGroup: map[v].age });
              }}>
                <option value="8u-10u">Youth (8U–10U)</option>
                <option value="12u-ms">Middle School (12U)</option>
                <option value="14u-hs">High School (14U–18U)</option>
                <option value="18u-col">College</option>
                <option value="travel">Travel</option>
              </GSelect>
            </div>

            {/* 5. Field Availability */}
            <div>
              <GLabel>Field Availability</GLabel>
              <GSelect value={fieldType} onChange={setFieldType}>
                {FIELD_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </GSelect>
            </div>

            {/* 6. Practice Format */}
            <div>
              <GLabel>Practice Format (L1 schema)</GLabel>
              <GSelect value={format} onChange={setFormat}>
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </GSelect>
            </div>

            {/* 7. Sport */}
            <div>
              <GLabel>Sport</GLabel>
              <GSelect
                value={input.sport ?? "baseball"}
                onChange={(v) => setInput({ sport: v as "baseball" | "softball" })}
              >
                <option value="baseball">Baseball</option>
                <option value="softball">Softball</option>
              </GSelect>
            </div>

          </div>

          {/* ── Date & Time row ── */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <GLabel>📅 Practice Date</GLabel>
              <GInput
                type="date"
                value={practiceDate}
                onChange={setPracticeDate}
              />
            </div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 12, paddingBottom: 8 }}>at</div>
            <div style={{ flex: 1 }}>
              <GLabel>🕐 Start Time</GLabel>
              <GInput
                type="time"
                value={startTime}
                onChange={setStartTime}
              />
            </div>
          </div>

          {/* ── Focus Areas ── */}
          <div style={{ marginBottom: 12 }}>
            <GLabel>Focus Area</GLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {FOCUS_AREAS.map((f) => (
                <MCPill
                  key={f.id}
                  label={f.label}
                  checked={goals.includes(f.id)}
                  onToggle={() => toggleGoal(f.id)}
                />
              ))}
            </div>
          </div>

          {/* ── Equipment Available ── */}
          <div style={{ marginBottom: 12 }}>
            <GLabel>Equipment Available</GLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {EQUIPMENT_OPTIONS.map((item) => (
                <MCPill
                  key={item}
                  label={item}
                  checked={equip.includes(item)}
                  onToggle={() => toggleEquip(item)}
                />
              ))}
            </div>
          </div>

          {/* ── Session Goal / Notes ── */}
          <div style={{ marginBottom: 14 }}>
            <GLabel>Session Goal / Notes</GLabel>
            <GInput
              type="text"
              value={input.notes ?? ""}
              onChange={(v) => setInput({ notes: v })}
              placeholder="e.g. Pre-game contact hitting focus, avoid heavy pitching…"
            />
          </div>

          {/* ── Generate button — matches reference ── */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            style={{
              background: generating ? "#18a163" : "#18a163",
              border: "none",
              borderRadius: 7,
              padding: "11px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: generating ? "not-allowed" : "pointer",
              fontFamily: "'Syne', sans-serif",
              width: "100%",
              marginTop: 4,
              letterSpacing: ".3px",
              transition: "background .15s",
              opacity: generating ? 0.55 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => { if (!generating) e.currentTarget.style.background = "#0d6640"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#18a163"; }}
          >
            {generating
              ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Generating your plan…</>
              : <>⚡ Generate 3D Practice Plan</>
            }
          </button>

          {/* ── Quick-load example buttons ── */}
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => loadExample("indoor")}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 6, padding: "6px 12px", fontSize: 11.5,
                color: "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}
            >
              📋 Load: Indoor Team Workout
            </button>
            <button
              type="button"
              onClick={() => loadExample("split")}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 6, padding: "6px 12px", fontSize: 11.5,
                color: "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}
            >
              📋 Load: Split Squad Workout
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
