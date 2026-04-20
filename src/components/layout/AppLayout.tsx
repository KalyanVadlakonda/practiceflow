import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { ToastContainer } from "@/components/ui/toast";
import { useUIStore } from "@/store";

export function AppLayout() {
  const { sidebarOpen, darkMode } = useUIStore();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Sidebar — desktop only */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <motion.main
          animate={{ marginLeft: sidebarOpen ? 240 : 64 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden md:block min-h-screen"
        >
          <TopBar />
          <div className="p-6">
            <Outlet />
          </div>
        </motion.main>

        {/* Mobile layout */}
        <div className="md:hidden min-h-screen">
          <TopBar />
          <div className="p-4 pb-20">
            <Outlet />
          </div>
          <MobileNav />
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}
