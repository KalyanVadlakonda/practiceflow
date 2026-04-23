import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { PracticeGenerator } from "@/features/practice-generator/PracticeGenerator";
import { PracticePlanView } from "@/features/practice-plan/PracticePlanView";
import { DrillLibrary } from "@/features/drills/DrillLibrary";
import { DiagramStudio } from "@/features/diagram-studio/DiagramStudio";
import { Teams } from "@/features/teams/Teams";
import { RunPractice } from "@/features/run-practice/RunPractice";
import { Templates } from "@/features/templates/Templates";
import { Settings } from "@/features/settings/Settings";
import { SeasonCalendar } from "@/features/calendar/SeasonCalendar";
import { Notifications } from "@/features/notifications/Notifications";
import { Analytics } from "@/features/analytics/Analytics";
import { Platform } from "@/features/platform/Platform";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

          {/* Run practice — full screen, no sidebar */}
          <Route path="/app/run/:id" element={<RunPractice />} />

          {/* Main app layout */}
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard"       element={<Dashboard />} />
            <Route path="generate"        element={<PracticeGenerator />} />
            <Route path="practices/:id"   element={<PracticePlanView />} />
            <Route path="library"         element={<DrillLibrary />} />
            <Route path="diagram-studio"  element={<DiagramStudio />} />
            <Route path="teams"           element={<Teams />} />
            <Route path="templates"       element={<Templates />} />
            <Route path="settings"        element={<Settings />} />

            {/* New DiamondOS routes */}
            <Route path="calendar"        element={<SeasonCalendar />} />
            <Route path="notifications"   element={<Notifications />} />
            <Route path="analytics"       element={<Analytics />} />
            <Route path="practices"       element={<Navigate to="/app/dashboard" replace />} />

            {/* Platform sub-pages */}
            <Route path="platform/entity" element={<Platform page="entity" />} />
            <Route path="platform/org"    element={<Platform page="org" />} />
            <Route path="platform/cms"    element={<Platform page="cms" />} />
            <Route path="platform"        element={<Navigate to="/app/platform/entity" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
