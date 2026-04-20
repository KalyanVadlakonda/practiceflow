import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Save,
  Download,
  RefreshCw,
  Clock,
  Users,
  Target,
  AlertTriangle,
  ChevronLeft,
  Lightbulb,
  CheckCircle2,
  GripVertical,
  Lock,
  Unlock,
  Wand2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePracticeStore, useUIStore } from "@/store";
import { formatMinutes, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils";
import { DrillDiagramPreview } from "@/features/diagram-studio/DrillDiagramPreview";
import type { PracticeBlock } from "@/types";
import { cn } from "@/lib/utils";

function TimelineDot({ start, end, total }: { start: number; end: number; total: number }) {
  const left = (start / total) * 100;
  const width = ((end - start) / total) * 100;
  return (
    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="absolute top-0 h-full bg-primary rounded-full"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
    </div>
  );
}

function BlockCard({
  block,
  index,
  totalMinutes,
  onToggleLock,
}: {
  block: PracticeBlock;
  index: number;
  totalMinutes: number;
  onToggleLock: (id: string) => void;
}) {
  const drill = block.drill;
  const categoryColor = drill ? (CATEGORY_COLORS[drill.category] ?? "") : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn("overflow-hidden", block.isLocked && "border-primary/40 bg-primary/5")}>
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start gap-3">
            {/* Drag handle */}
            <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 cursor-grab" />

            {/* Order badge */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base leading-snug">{block.name}</h3>
                {drill && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      categoryColor
                    )}
                  >
                    {CATEGORY_LABELS[drill.category]}
                  </span>
                )}
                {block.isLocked && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 px-2 py-0.5 text-xs text-primary">
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {block.durationMinutes} min
                </span>
                <span className="text-xs">
                  {block.startMinute}:{String(0).padStart(2, "0")} –{" "}
                  {block.endMinute}:{String(0).padStart(2, "0")}
                </span>
                {block.groupCount > 1 && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {block.groupCount} groups
                  </span>
                )}
              </div>
              {/* Timeline bar */}
              <div className="mt-2">
                <TimelineDot
                  start={block.startMinute}
                  end={block.endMinute}
                  total={totalMinutes}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onToggleLock(block.id)}
                title={block.isLocked ? "Unlock block" : "Lock block"}
              >
                {block.isLocked ? (
                  <Lock className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Unlock className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon-sm" title="Regenerate this drill">
                <Wand2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 space-y-4">
          {/* Diagram preview */}
          {drill?.diagram && (
            <div className="rounded-lg overflow-hidden border bg-muted/30">
              <DrillDiagramPreview diagram={drill.diagram} />
            </div>
          )}

          {/* Coach assignments */}
          {block.coachAssignments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {block.coachAssignments.map((ca, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-medium"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Coach {i + 1} — {ca.role}
                </div>
              ))}
            </div>
          )}

          {/* Equipment */}
          {block.equipment && block.equipment.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {block.equipment.map((e) => (
                <span
                  key={e}
                  className="rounded-full border bg-muted px-2.5 py-0.5 text-xs"
                >
                  {e}
                </span>
              ))}
            </div>
          )}

          {/* Drill details */}
          {drill && (
            <div className="grid sm:grid-cols-2 gap-4">
              {drill.stepByStep.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Steps
                  </p>
                  <ol className="space-y-1">
                    {drill.stepByStep.map((step, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="shrink-0 font-semibold text-primary text-xs mt-0.5">
                          {i + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {drill.teachingPoints.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Teaching Points
                  </p>
                  <ul className="space-y-1">
                    {drill.teachingPoints.map((tp, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{tp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Common errors */}
          {drill && drill.commonErrors.length > 0 && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-3">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1.5 uppercase tracking-wide">
                Watch For
              </p>
              <ul className="space-y-1">
                {drill.commonErrors.map((err, i) => (
                  <li key={i} className="text-xs text-yellow-700 dark:text-yellow-300 flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI note */}
          {block.aiNote && (
            <div className="flex gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3">
              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-primary">{block.aiNote}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PracticePlanView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getPracticeById = usePracticeStore((s) => s.getPracticeById);
  const updatePractice = usePracticeStore((s) => s.updatePractice);
  const addNotification = useUIStore((s) => s.addNotification);

  const plan = id ? getPracticeById(id) : undefined;

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Practice not found</h2>
        <p className="text-muted-foreground text-sm">
          This plan may have been deleted or never existed.
        </p>
        <Link to="/app/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    updatePractice(plan.id, { status: "saved" });
    addNotification({ type: "success", title: "Practice saved!" });
  };

  const handleToggleLock = (blockId: string) => {
    const updatedBlocks = plan.blocks.map((b) =>
      b.id === blockId ? { ...b, isLocked: !b.isLocked } : b
    );
    updatePractice(plan.id, { blocks: updatedBlocks });
  };

  const totalAssignedMinutes = plan.blocks.reduce(
    (sum, b) => sum + b.durationMinutes,
    0
  );
  const isOverBudget = totalAssignedMinutes > plan.totalMinutes + 5;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{plan.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatMinutes(plan.totalMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5" />
              {plan.blocks.length} drills
            </span>
            <span className="capitalize">{plan.sport}</span>
            <Badge variant={plan.status === "saved" ? "success" : "secondary"}>
              {plan.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Link to={`/app/run/${plan.id}`}>
            <Button variant="brand" size="sm">
              <Play className="h-4 w-4 mr-1" />
              Run Practice
            </Button>
          </Link>
        </div>
      </div>

      {/* Goals */}
      <div className="flex flex-wrap gap-2">
        {plan.goals.map((g) => (
          <span
            key={g}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              CATEGORY_COLORS[g] ?? "bg-muted text-muted-foreground"
            )}
          >
            {CATEGORY_LABELS[g] ?? g}
          </span>
        ))}
      </div>

      {/* Warnings */}
      {(plan.warnings?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950 p-4 space-y-1">
          {plan.warnings!.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Rationale */}
      {plan.aiRationale && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary mb-1">AI Rationale</p>
            <p className="text-sm text-muted-foreground">{plan.aiRationale}</p>
          </div>
        </div>
      )}

      {/* Timeline overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Practice Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-12">
            {plan.blocks.map((block, i) => {
              const left = (block.startMinute / plan.totalMinutes) * 100;
              const width = (block.durationMinutes / plan.totalMinutes) * 100;
              const colors = [
                "bg-green-500",
                "bg-blue-500",
                "bg-orange-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-teal-500",
                "bg-yellow-500",
              ];
              return (
                <div
                  key={block.id}
                  className={cn(
                    "absolute top-0 h-full rounded flex items-center justify-center text-white text-xs font-medium overflow-hidden",
                    colors[i % colors.length],
                    i > 0 && "border-l-2 border-white/20"
                  )}
                  style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                  title={`${block.name} (${block.durationMinutes} min)`}
                >
                  {width > 8 && (
                    <span className="truncate px-1">{block.name.split(" ")[0]}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0:00</span>
            <span>
              {isOverBudget && (
                <span className="text-yellow-500 mr-2">
                  ({totalAssignedMinutes - plan.totalMinutes} min over)
                </span>
              )}
              {formatMinutes(plan.totalMinutes)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-1" />
          Regenerate Plan
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm">
          Mark as Template
        </Button>
      </div>

      <Separator />

      {/* Drill blocks */}
      <div className="space-y-4">
        {plan.blocks.map((block, i) => (
          <BlockCard
            key={block.id}
            block={block}
            index={i}
            totalMinutes={plan.totalMinutes}
            onToggleLock={handleToggleLock}
          />
        ))}
      </div>
    </div>
  );
}
