import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  StopCircle,
  Plus,
  Clock,
  ChevronRight,
  CheckCircle2,
  Users,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { usePracticeStore, useSessionStore, useUIStore } from "@/store";
import { formatTime, formatMinutes, CATEGORY_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RunPractice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getPractice = usePracticeStore((s) => s.getPracticeById);
  const {
    session,
    startSession,
    pauseSession,
    resumeSession,
    nextBlock,
    skipBlock,
    addExtraTime,
    endSession,
    tick,
  } = useSessionStore();
  const addNotification = useUIStore((s) => s.addNotification);

  const plan = id ? getPractice(id) : undefined;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [localElapsed, setLocalElapsed] = useState(0);

  // Start session on mount
  useEffect(() => {
    if (id && (!session || session.planId !== id)) {
      startSession(id);
    }
  }, [id]);

  // Timer tick
  useEffect(() => {
    if (session?.isRunning && !session.isPaused) {
      timerRef.current = setInterval(() => {
        tick();
        setLocalElapsed((e) => e + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.isRunning, session?.isPaused, tick]);

  // Reset elapsed when block changes
  useEffect(() => {
    setLocalElapsed(0);
  }, [session?.currentBlockIndex]);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Target className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl font-semibold">Practice not found</p>
        <Link to="/app/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Target className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl font-semibold">Loading practice...</p>
      </div>
    );
  }

  const currentIndex = session.currentBlockIndex;
  const currentBlock = plan.blocks[currentIndex];
  const nextBlock2 = plan.blocks[currentIndex + 1];
  const isLastBlock = currentIndex >= plan.blocks.length - 1;

  const blockDurationSec =
    currentBlock ? (currentBlock.durationMinutes + session.extraTimeSeconds / 60) * 60 : 0;
  const blockProgress = Math.min(
    (localElapsed / (currentBlock?.durationMinutes * 60 || 1)) * 100,
    100
  );
  const timeLeft = Math.max((currentBlock?.durationMinutes ?? 0) * 60 - localElapsed, 0);
  const isOvertime = localElapsed > (currentBlock?.durationMinutes ?? 0) * 60;

  const totalElapsed = plan.blocks
    .slice(0, currentIndex)
    .reduce((sum, b) => sum + b.durationMinutes * 60, 0) + localElapsed;
  const totalProgress = Math.min((totalElapsed / (plan.totalMinutes * 60)) * 100, 100);

  const handleEnd = () => {
    endSession();
    addNotification({ type: "success", title: "Practice complete! Great work." });
    navigate(`/app/practices/${plan.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="font-bold text-lg leading-tight truncate max-w-[200px] sm:max-w-none">
            {plan.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            Block {currentIndex + 1} of {plan.blocks.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEnd}>
            <StopCircle className="h-4 w-4 mr-1" />
            End
          </Button>
        </div>
      </div>

      {/* Overall progress */}
      <div className="px-4 pt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Overall practice progress</span>
          <span>{formatTime(totalElapsed)} / {formatMinutes(plan.totalMinutes)}</span>
        </div>
        <Progress value={totalProgress} className="h-1.5" />
      </div>

      {/* Current block — main hero */}
      <div className="flex-1 p-4 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Timer */}
            <div
              className={cn(
                "rounded-2xl p-6 text-center border",
                isOvertime
                  ? "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700"
                  : "bg-card"
              )}
            >
              {isOvertime && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Over time — {formatTime(localElapsed - (currentBlock?.durationMinutes ?? 0) * 60)} extra</span>
                </div>
              )}

              <div
                className={cn(
                  "text-7xl sm:text-8xl font-mono font-bold tabular-nums leading-none",
                  isOvertime ? "text-red-500" : "text-foreground"
                )}
              >
                {isOvertime
                  ? `+${formatTime(localElapsed - (currentBlock?.durationMinutes ?? 0) * 60)}`
                  : formatTime(timeLeft)}
              </div>

              <div className="text-sm text-muted-foreground mt-2">
                {isOvertime ? "Time elapsed over block" : "Remaining"}
              </div>

              <Progress
                value={blockProgress}
                className={cn(
                  "h-2 mt-4",
                  isOvertime && "[&>div]:bg-red-500"
                )}
              />
            </div>

            {/* Current block info */}
            {currentBlock && (
              <Card>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        Now Up
                      </div>
                      <h2 className="text-xl font-bold">{currentBlock.name}</h2>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{currentBlock.durationMinutes} min</span>
                    </div>
                  </div>

                  {/* Coach assignments */}
                  {currentBlock.coachAssignments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentBlock.coachAssignments.map((ca, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-medium"
                        >
                          <Users className="h-3 w-3" />
                          Coach {i + 1} — {ca.role}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drill steps */}
                  {currentBlock.drill?.stepByStep && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Steps
                      </p>
                      <ol className="space-y-1.5">
                        {currentBlock.drill.stepByStep.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Teaching points */}
                  {currentBlock.drill?.teachingPoints && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1">
                      {currentBlock.drill.teachingPoints.map((tp, i) => (
                        <div key={i} className="flex gap-2 text-sm text-primary">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{tp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Next block preview */}
            {nextBlock2 && (
              <div className="flex items-center gap-3 rounded-xl border bg-muted/50 p-4">
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Up Next</p>
                  <p className="font-semibold text-sm truncate">{nextBlock2.name}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {nextBlock2.durationMinutes} min
                </span>
              </div>
            )}

            {isLastBlock && (
              <div className="text-center rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950 p-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-700 dark:text-green-300">
                  Last drill! Practice is almost done.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur p-4 space-y-3 pb-safe">
        {/* Main controls */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => session.isPaused ? resumeSession() : pauseSession()}
          >
            {session.isPaused ? (
              <>
                <Play className="h-5 w-5 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            )}
          </Button>

          {!isLastBlock ? (
            <Button
              variant="brand"
              size="lg"
              className="flex-1"
              onClick={() => nextBlock()}
            >
              Next Drill
              <SkipForward className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button
              variant="brand"
              size="lg"
              className="flex-1"
              onClick={handleEnd}
            >
              Finish Practice
              <CheckCircle2 className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>

        {/* Extra time */}
        <div className="flex gap-2">
          {[2, 5, 10].map((minutes) => (
            <button
              key={minutes}
              onClick={() => addExtraTime(minutes * 60)}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg border bg-muted hover:bg-muted/80 py-2 text-xs font-medium transition-all"
            >
              <Plus className="h-3 w-3" />
              {minutes}m
            </button>
          ))}
          <button
            onClick={() => skipBlock()}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg border bg-muted hover:bg-muted/80 py-2 text-xs font-medium transition-all text-muted-foreground"
          >
            <SkipForward className="h-3 w-3" />
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
