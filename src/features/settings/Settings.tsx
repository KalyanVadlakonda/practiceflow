import { motion } from "framer-motion";
import { Moon, Sun, Bell, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUIStore, usePracticeStore, useTeamStore } from "@/store";
import { useUIStore as useUI } from "@/store";

export function Settings() {
  const { darkMode, toggleDarkMode } = useUIStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your PracticeFlow preferences.
        </p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About PracticeFlow</CardTitle>
            <CardDescription>
              Coach-first practice orchestration for baseball and softball
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Version 1.0.0 MVP · Built for coaches who run efficient practices</span>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              PracticeFlow helps coaches generate, customize, and run complete practice plans in seconds.
              Enter your team constraints and get a fully structured plan with drill assignments,
              coach roles, timing, and AI coaching notes.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All data is stored locally in your browser. Clearing it will remove all teams and saved practices.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Local Data
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
