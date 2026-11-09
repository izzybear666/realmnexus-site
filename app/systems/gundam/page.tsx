import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gundam 5E | Realm Nexus",
  description: "The Nexus Gundam 5E toolkit: full pilot builder, 292-unit mobile suit codex, sortie tracker, missions, and GM campaigns.",
};

export default function GundamLanding() {
  return (
    <main className="min-h-screen bg-[#090b14] text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <nav className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-violet-300">
            ← Back to Realm Nexus
          </Link>
          <span className="text-xs text-slate-400">Gundam • 5E</span>
        </nav>

        <section className="rounded-2xl border border-violet-400/10 bg-gradient-to-b from-[#0f0b1a]/40 via-[#0b0e1a] to-[#07060b] p-10 shadow-lg">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
            ✦ Full Rulebook Build
          </div>

          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Gundam Roleplaying 5E
          </h1>

          <p className="mb-6 max-w-3xl text-lg text-slate-300">
            A full pilot creator with classes, archetypes, backgrounds, and feats; a 292-unit mobile
            suit codex across every era; warships; plus a live table layer — Suit Bay, progression,
            mission generator, sortie tracker, GM tools, and server-validated campaigns.
          </p>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/systems/gundam/codex"
              className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-6 py-3 font-bold text-black transition hover:bg-violet-400"
            >
              Browse the Codex
            </Link>
            <a
              href="https://perchance.org/nexusrealm-com"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/5"
            >
              Open the live builder ↗
            </a>
          </div>

          <div className="mt-6 rounded-lg border border-white/5 bg-white/2 p-4 text-sm text-slate-400">
            <strong className="text-slate-200">At the table:</strong> build a pilot, commission a suit
            in the Bay, generate a contract, run it in the Sortie tracker, and log progression — or join
            a GM campaign with the 6-letter code. The live app is key-locked; keys are handed out on the
            community Discord.
          </div>
        </section>
      </div>
    </main>
  );
}
