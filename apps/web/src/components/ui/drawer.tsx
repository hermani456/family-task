import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
// @ts-expect-error ViewTransition is not yet in @types/react
import { ViewTransition } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer = ({ isOpen, onClose, title, children }: DrawerProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <ViewTransition>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            style={
              { viewTransitionName: "drawer-backdrop" } as React.CSSProperties
            }
          />

          <div
            className="w-full max-w-md bg-surface rounded-t-4xl sm:rounded-3xl p-6 shadow-2xl relative z-10 border-t border-white/10"
            style={{ viewTransitionName: "task-drawer" } as React.CSSProperties}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {children}
          </div>
        </div>
      )}
    </ViewTransition>,
    document.body
  );
};
