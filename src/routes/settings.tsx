import { AppShell } from "@/components/layout/AppShell";
import { useLearner } from "@/lib/store";
import { toast } from "sonner";

export default function SettingsPage() {
  const learner = useLearner();

  return (
    <AppShell rightRail={false}>
      <header className="mb-8">
        <h1 className="text-3xl">Settings</h1>
        <p className="text-hare font-semibold mt-1">Preferences & profile</p>
      </header>

      <section className="duo-card p-5 mb-4">
        <h2 className="uppercase text-xs font-black text-hare tracking-wide mb-4">Profile</h2>
        <div className="grid gap-4">
          <Field label="Display name">
            <input
              className="w-full rounded-xl border-2 border-wolf px-4 py-3 font-bold outline-none focus:border-macaw"
              value={learner.name}
              onChange={(e) => useLearner.setState({ name: e.target.value })}
            />
          </Field>
          <Field label="Avatar">
            <div className="flex flex-wrap gap-2">
              {["🐤", "🦉", "🦊", "🐼", "🐧", "🦁", "🐨", "🐸"].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => useLearner.setState({ avatar: a })}
                  className={
                    "w-12 h-12 rounded-full text-2xl border-2 " +
                    (learner.avatar === a ? "border-macaw bg-macaw/10" : "border-wolf")
                  }
                >
                  {a}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </section>

      <section className="duo-card p-5 mb-4">
        <h2 className="uppercase text-xs font-black text-hare tracking-wide mb-4">Coming Soon</h2>
        <ul className="text-sm text-hare font-semibold space-y-2">
          <li>🎧 Real speech / pronunciation exercises</li>
          <li>🌍 More languages</li>
          <li>👥 Friends & social features</li>
          <li>⭐ Super Lingo subscription</li>
        </ul>
      </section>

      <section className="duo-card p-5">
        <h2 className="uppercase text-xs font-black text-hare tracking-wide mb-4">Danger zone</h2>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all progress? This cannot be undone.")) {
              useLearner.setState({
                xp: 0,
                streak: 0,
                todayXp: 0,
                progress: {},
              });
              toast.success("Progress reset");
            }
          }}
          className="duo-btn bg-cardinal text-snow"
          style={{ ["--btn-shadow" as string]: "var(--color-cardinal-shadow)" }}
        >
          Reset progress
        </button>
      </section>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase font-black text-hare tracking-wide mb-1.5">{label}</div>
      {children}
    </label>
  );
}
