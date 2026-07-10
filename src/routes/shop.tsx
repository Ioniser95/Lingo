import { AppShell } from "@/components/layout/AppShell";
import { useLearner, MAX_HEARTS, useTimeToNextHeart } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Heart, Gem, Zap } from "lucide-react";
import { toast } from "sonner";

export default function ShopPage() {
  const hydrated = useHydrated();
  const hearts = useLearner((s) => s.hearts);
  const gems = useLearner((s) => s.gems);
  const refill = useLearner((s) => s.refillHeartsWithGems);
  const timeLeft = useTimeToNextHeart();

  const heartsFull = hydrated && hearts >= MAX_HEARTS;

  function onRefill() {
    const ok = refill();
    if (ok) toast.success("Hearts refilled!", { description: "You're ready to learn." });
    else if (heartsFull) toast.info("Your hearts are already full!");
    else toast.error("Not enough gems", { description: "Come back tomorrow — or keep practicing!" });
  }

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl">Shop</h1>
        <p className="text-hare font-semibold mt-1">Spend gems on power-ups to keep learning.</p>
      </header>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wide font-black text-hare mb-3">Hearts</h2>
        <div className="duo-card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cardinal/15 flex items-center justify-center">
            <Heart className="w-9 h-9 text-cardinal" fill="currentColor" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <div className="font-black text-lg">Refill Hearts</div>
            <div className="text-sm text-hare font-semibold">
              {heartsFull
                ? "You're at max — no refill needed."
                : hydrated
                  ? `You have ${hearts}/${MAX_HEARTS} hearts. Next in ${formatMs(timeLeft)}.`
                  : "Loading…"}
            </div>
          </div>
          <button
            type="button"
            onClick={onRefill}
            disabled={heartsFull}
            className={"duo-btn " + (heartsFull ? "" : "bg-macaw text-snow")}
            style={heartsFull ? undefined : { ["--btn-shadow" as string]: "var(--color-macaw-shadow)" }}
          >
            <Gem className="w-4 h-4" fill="currentColor" strokeWidth={0} /> 350
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wide font-black text-hare mb-3">Power-ups</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <SoonCard icon="❄️" title="Streak Freeze" desc="Protect your streak for one day off." />
          <SoonCard icon="⏱" title="Timed Practice" desc="Race against the clock for bonus XP." />
          <SoonCard icon="💎" title="Double or Nothing" desc="Wager gems on a 7-day streak." />
          <SoonCard icon="👑" title="Super Lingo" desc="Unlimited hearts and more, coming soon." />
        </div>
      </section>

      <div className="text-center text-xs text-hare font-semibold mt-8 flex items-center justify-center gap-1">
        <Zap className="w-4 h-4" /> Your balance: <Gem className="w-4 h-4 text-macaw" fill="currentColor" strokeWidth={0} />
        <span className="font-black text-macaw">{hydrated ? gems : 500}</span> gems
      </div>
    </AppShell>
  );
}

function SoonCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="duo-card p-4 flex items-center gap-3 opacity-70">
      <div className="text-3xl w-12 h-12 rounded-xl bg-swan flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <div className="font-black">{title}</div>
        <div className="text-sm text-hare font-semibold">{desc}</div>
      </div>
      <span className="text-[10px] uppercase font-black text-hare bg-swan px-2 py-1 rounded-full">Soon</span>
    </div>
  );
}

function formatMs(ms: number): string {
  if (ms <= 0) return "0m";
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
