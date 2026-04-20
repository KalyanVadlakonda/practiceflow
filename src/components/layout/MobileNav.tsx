import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Wand2, BookOpen, Users, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/app/generate", icon: Wand2, label: "Generate" },
  { to: "/app/library", icon: BookOpen, label: "Library" },
  { to: "/app/teams", icon: Users, label: "Teams" },
  { to: "/app/templates", icon: Layout, label: "Templates" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur md:hidden">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname.startsWith(to);
        return (
          <NavLink
            key={to}
            to={to}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon
              className={cn("h-5 w-5", isActive && "text-primary")}
            />
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
