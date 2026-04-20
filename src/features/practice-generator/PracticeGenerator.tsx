import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Wand2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGeneratorStore, usePracticeStore, useUIStore } from "@/store";
import { generatePracticePlanAI } from "@/services/aiService";
import { StepTeamContext } from "./StepTeamContext";
import { StepGoals } from "./StepGoals";
import { StepPreferences } from "./StepPreferences";
import { StepGenerate } from "./StepGenerate";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "Team" },
  { id: 1, label: "Goals" },
  { id: 2, label: "Preferences" },
  { id: 3, label: "Generate" },
];

export function PracticeGenerator() {
  const navigate = useNavigate();
  const { currentStep, setStep, input, isGenerating, setGenerating, setDraftPlanId } =
    useGeneratorStore();
  const addPractice = usePracticeStore((s) => s.addPractice);
  const addNotification = useUIStore((s) => s.addNotification);

  const canNext = () => {
    if (currentStep === 0) return Boolean(input.sport && input.ageGroup && input.durationMinutes);
    if (currentStep === 1) return (input.primaryGoals?.length ?? 0) > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3) setStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setStep(currentStep - 1);
  };

  const handleGenerate = async () => {
    if (!input.sport || !input.ageGroup) return;
    setGenerating(true);
    try {
      const plan = await generatePracticePlanAI(input as Parameters<typeof generatePracticePlanAI>[0]);
      addPractice(plan);
      setDraftPlanId(plan.id);
      addNotification({
        type: "success",
        title: "Practice generated!",
        message: `${plan.blocks.length} drills, ${plan.totalMinutes} minutes`,
      });
      navigate(`/app/practices/${plan.id}`);
    } catch {
      addNotification({
        type: "error",
        title: "Generation failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const isLastStep = currentStep === 3;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Generate a Practice</h1>
        <p className="text-muted-foreground mt-1">
          Tell us about your team and we'll build a complete practice plan.
        </p>
      </div>

      {/* Step indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => { if (step.id < currentStep) setStep(step.id); }}
                disabled={step.id > currentStep}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all border-2",
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground border-primary cursor-pointer"
                    : step.id === currentStep
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted text-muted-foreground bg-transparent cursor-not-allowed"
                )}
              >
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id + 1}
              </button>
              <span
                className={cn(
                  "ml-2 text-sm font-medium hidden sm:block",
                  step.id === currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn("mx-3 h-0.5 w-8 sm:w-16 lg:w-24 flex-1 rounded", step.id < currentStep ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>
        <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-1" />
      </div>

      {/* Step content */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && <StepTeamContext />}
            {currentStep === 1 && <StepGoals />}
            {currentStep === 2 && <StepPreferences />}
            {currentStep === 3 && <StepGenerate onGenerate={handleGenerate} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {currentStep < 3 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canNext()}
            variant={isLastStep ? "brand" : "default"}
          >
            {isLastStep ? (
              <>
                <Wand2 className="h-4 w-4 mr-1" />
                Generate
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
