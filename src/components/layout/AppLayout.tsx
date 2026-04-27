import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { ToastContainer } from "@/components/ui/toast";
import { useUIStore } from "@/store";

export function AppLayout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar — always dark navy, desktop only */}
      <div className="hidden md:block dark">
        <Sidebar />
      </div>

      {/* Main content — desktop, light theme */}
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 240 : 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col min-h-screen"
      >
        <TopBar />
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </motion.main>

      {/* Mobile layout */}
      <div className="md:hidden min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 p-4 pb-20 overflow-auto">
          <Outlet />
        </div>
        {/* Mobile nav — dark */}
        <div className="dark">
          <MobileNav />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
