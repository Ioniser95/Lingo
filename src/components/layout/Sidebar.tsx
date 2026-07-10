import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, User, ShoppingBag, Settings, Moon, Sun, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "../../hooks/use-theme";

const NAV: Array<{ to: string; label: string; icon: LucideIcon }> = [
  { to: "/", label: "Learn", icon: Home },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "More", icon: Settings },
];

export function Sidebar(): ReactNode {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 border-r-2 border-wolf flex-col p-4 sticky top-0 h-screen bg-snow">
      <Link to="/" className="flex items-center gap-2 px-3 py-4">
        <span className="text-3xl">🦉</span>
        <span className="text-2xl font-black text-owl tracking-tight">lingo</span>
      </Link>
      <nav className="mt-4 flex flex-col gap-2 flex-1">
        {NAV.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex items-center gap-4 px-4 py-3 rounded-xl border-2 uppercase text-sm font-black tracking-wide transition " +
                (active
                  ? "border-macaw/40 bg-macaw bg-opacity-10 text-macaw-shadow"
                  : "border-transparent text-eel hover:bg-swan")
              }
            >
              <Icon className="w-7 h-7" strokeWidth={2.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={toggleTheme}
        className="mt-auto flex items-center justify-between gap-4 px-4 py-3 rounded-xl border-2 border-wolf uppercase text-sm font-black tracking-wide text-eel hover:bg-swan transition"
      >
        <span>Dark Mode</span>
        {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </aside>
  );
}

export function MobileNav(): ReactNode {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-snow border-t-2 border-wolf">
      <ul className="grid grid-cols-5">
        {NAV.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={
                  "flex flex-col items-center gap-1 py-2 text-[10px] font-black uppercase " +
                  (active ? "text-macaw" : "text-hare")
                }
              >
                <Icon className="w-6 h-6" strokeWidth={2.5} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
