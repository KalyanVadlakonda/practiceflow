import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store";
import type { AppNotification } from "@/types";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-green-500 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200",
  error: "border-red-500 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200",
  warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200",
  info: "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200",
};

function Toast({ notification }: { notification: AppNotification }) {
  const removeNotification = useUIStore((s) => s.removeNotification);
  const Icon = icons[notification.type];

  React.useEffect(() => {
    const timer = setTimeout(
      () => removeNotification(notification.id),
      notification.duration ?? 4000
    );
    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, removeNotification]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className={cn(
        "relative flex items-start gap-3 rounded-xl border p-4 shadow-lg",
        colors[notification.type]
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{notification.title}</p>
        {notification.message && (
          <p className="text-sm opacity-80 mt-0.5">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const notifications = useUIStore((s) => s.notifications);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <Toast key={n.id} notification={n} />
        ))}
      </AnimatePresence>
    </div>
  );
}
