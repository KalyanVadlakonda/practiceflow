import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Users,
  User,
  Triangle,
  ArrowRight,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { DiagramElement, DiagramFrame, DrillDiagram } from "@/types";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";

type ToolType = "player" | "coach" | "cone" | "select";

const FIELD_TYPES: { id: DrillDiagram["fieldType"]; label: string }[] = [
  { id: "baseball", label: "Full Field" },
  { id: "infield", label: "Infield" },
  { id: "softball", label: "Softball" },
  { id: "batting", label: "Batting Box" },
];

function ToolButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted/80 text-muted-foreground"
      )}
      title={label}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:block">{label}</span>
    </button>
  );
}

function FieldSVG({
  fieldType,
  elements,
  onAddElement,
  selectedId,
  onSelect,
}: {
  fieldType: DrillDiagram["fieldType"];
  elements: DiagramElement[];
  onAddElement: (x: number, y: number) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onAddElement(x, y);
  };

  const getFieldBg = () => {
    if (fieldType === "batting") {
      return (
        <g>
          <rect width="100%" height="100%" fill="#2d5a27" rx="8" />
          <rect x="35%" y="30%" width="30%" height="40%" fill="none" stroke="#f5f0e8" strokeWidth="1.5" strokeDasharray="4 2" />
          <polygon points="50%,75% 44%,68% 44%,60% 56%,60% 56%,68%" fill="#f5f0e8" />
        </g>
      );
    }
    return (
      <g>
        <rect width="400" height="350" fill="#2d5a27" rx="8" />
        <polygon
          points="200,290 320,190 200,90 80,190"
          fill="#8b6914"
          opacity="0.8"
        />
        <polygon
          points="200,290 320,190 200,90 80,190"
          fill="none"
          stroke="#a07820"
          strokeWidth="1.5"
        />
        {[
          [200, 290],
          [320, 190],
          [200, 90],
          [80, 190],
        ].map(([bx, by], i) => (
          <rect
            key={i}
            x={bx - 6}
            y={by - 6}
            width={12}
            height={12}
            fill="#f5f0e8"
            rx="1"
          />
        ))}
        <circle cx="200" cy="190" r="10" fill="#8b6914" />
      </g>
    );
  };

  const getMarker = (el: DiagramElement) => {
    const x = (el.x / 100) * 400;
    const y = (el.y / 100) * 350;
    const isSelected = el.id === selectedId;

    if (el.type === "player") {
      return (
        <g
          key={el.id}
          transform={`translate(${x}, ${y})`}
          onClick={(e) => { e.stopPropagation(); onSelect(el.id); }}
          className="cursor-pointer"
        >
          {isSelected && <circle r={14} fill="white" opacity={0.3} />}
          <circle r={10} fill="#22c55e" stroke={isSelected ? "white" : "transparent"} strokeWidth={2} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="white" fontWeight="bold">
            {el.label?.split(" ")[0]?.[0] ?? "P"}
          </text>
          {el.label && (
            <text y={18} textAnchor="middle" fontSize="8" fill="white">{el.label}</text>
          )}
        </g>
      );
    }
    if (el.type === "coach") {
      return (
        <g key={el.id} transform={`translate(${x}, ${y})`} onClick={(e) => { e.stopPropagation(); onSelect(el.id); }} className="cursor-pointer">
          {isSelected && <circle r={14} fill="white" opacity={0.3} />}
          <circle r={10} fill="#f59e0b" stroke={isSelected ? "white" : "transparent"} strokeWidth={2} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="white" fontWeight="bold">C</text>
          {el.label && <text y={18} textAnchor="middle" fontSize="8" fill="white">{el.label}</text>}
        </g>
      );
    }
    if (el.type === "cone") {
      return (
        <g key={el.id} transform={`translate(${x}, ${y})`} onClick={(e) => { e.stopPropagation(); onSelect(el.id); }} className="cursor-pointer">
          <polygon points="-7,5 7,5 0,-10" fill="#f97316" stroke={isSelected ? "white" : "transparent"} strokeWidth={2} />
        </g>
      );
    }
    return null;
  };

  return (
    <svg
      viewBox="0 0 400 350"
      className="w-full rounded-lg cursor-crosshair"
      onClick={handleSvgClick}
    >
      <defs>
        <marker id="studio-arrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
        </marker>
      </defs>
      {getFieldBg()}
      {elements.map(getMarker)}
    </svg>
  );
}

export function DiagramStudio() {
  const [fieldType, setFieldType] = useState<DrillDiagram["fieldType"]>("baseball");
  const [activeTool, setActiveTool] = useState<ToolType>("player");
  const [elements, setElements] = useState<DiagramElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playerCounter, setPlayerCounter] = useState(1);
  const [coachCounter, setCoachCounter] = useState(1);

  const handleAddElement = useCallback(
    (x: number, y: number) => {
      if (activeTool === "select") return;

      let newEl: DiagramElement;
      if (activeTool === "player") {
        newEl = {
          id: generateId(),
          type: "player",
          x,
          y,
          label: `P${playerCounter}`,
          color: "#22c55e",
        };
        setPlayerCounter((c) => c + 1);
      } else if (activeTool === "coach") {
        newEl = {
          id: generateId(),
          type: "coach",
          x,
          y,
          label: `C${coachCounter}`,
          color: "#f59e0b",
        };
        setCoachCounter((c) => c + 1);
      } else {
        newEl = {
          id: generateId(),
          type: "cone",
          x,
          y,
          color: "#f97316",
        };
      }
      setElements((prev) => [...prev, newEl]);
      setSelectedId(newEl.id);
    },
    [activeTool, playerCounter, coachCounter]
  );

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((e) => e.id !== selectedId));
    setSelectedId(null);
  };

  const handleClear = () => {
    setElements([]);
    setSelectedId(null);
    setPlayerCounter(1);
    setCoachCounter(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Diagram Studio</h1>
        <p className="text-muted-foreground mt-1">
          Build animated drill diagrams for any baseball or softball setup.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Toolbar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Field type */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Field</p>
              <div className="grid grid-cols-2 gap-1">
                {FIELD_TYPES.map((ft) => (
                  <button
                    key={ft.id}
                    onClick={() => setFieldType(ft.id)}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-xs font-medium transition-all",
                      fieldType === ft.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool selector */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Place</p>
              <div className="grid grid-cols-2 gap-2">
                <ToolButton
                  icon={Users}
                  label="Player"
                  active={activeTool === "player"}
                  onClick={() => setActiveTool("player")}
                />
                <ToolButton
                  icon={User}
                  label="Coach"
                  active={activeTool === "coach"}
                  onClick={() => setActiveTool("coach")}
                />
                <ToolButton
                  icon={Triangle}
                  label="Cone"
                  active={activeTool === "cone"}
                  onClick={() => setActiveTool("cone")}
                />
                <ToolButton
                  icon={ArrowRight}
                  label="Select"
                  active={activeTool === "select"}
                  onClick={() => setActiveTool("select")}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Actions</p>
              {selectedId && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={handleDeleteSelected}
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full" onClick={handleClear}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear All
              </Button>
              <Button variant="default" size="sm" className="w-full">
                <Save className="h-4 w-4 mr-1" />
                Save Diagram
              </Button>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground">Legend</p>
              {[
                { color: "#22c55e", label: "Player" },
                { color: "#f59e0b", label: "Coach" },
                { color: "#f97316", label: "Cone" },
                { color: "#22c55e", label: "Movement" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-xs">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: l.color }}
                  />
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">
              {FIELD_TYPES.find((f) => f.id === fieldType)?.label} Field
            </CardTitle>
            <div className="flex gap-1 text-xs text-muted-foreground">
              <span>{elements.length} elements</span>
            </div>
          </CardHeader>
          <CardContent>
            <FieldSVG
              fieldType={fieldType}
              elements={elements}
              onAddElement={handleAddElement}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click the field to place a{" "}
              <span className="font-medium capitalize">{activeTool}</span> marker.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { step: "1", text: "Select a tool from the left panel" },
          { step: "2", text: "Click anywhere on the field to place markers" },
          { step: "3", text: "Save and attach the diagram to any drill" },
        ].map((s) => (
          <div
            key={s.step}
            className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {s.step}
            </div>
            <p className="text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
