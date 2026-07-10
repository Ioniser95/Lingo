import type { ReactNode } from "react";
import { Sidebar, MobileNav } from "./Sidebar";
import { TopBar } from "./TopBar";
import { DailyGoalCard } from "./RightRail";

/**
 * Standard three-column shell used on Learn / Leaderboard / Profile / Shop.
 * The lesson player uses its own full-bleed layout.
 */
export function AppShell({ children, rightRail = true }: { children: ReactNode; rightRail?: boolean }) {
  return (
    <div className="min-h-screen flex bg-snow">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar />
        <div className="max-w-6xl mx-auto flex gap-8 px-4 pt-6 pb-24 md:pb-8">
          <main className="flex-1 min-w-0">{children}</main>
          {rightRail && (
            <aside className="hidden lg:block w-80 shrink-0 space-y-4">
              <DailyGoalCard />
            </aside>
          )}
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
