import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Table Wiki | Realm Nexus",
  description: "How-to-play guides for every Realm Nexus system: what a session looks like and which tools to open.",
};

const GUIDES = [
  {
    slug: "essence20",
    title: "Power Rangers — Essence20",
    blurb: "Team-based heroics: build a Ranger, earn story points, chase the monster of the week.",
  },
  {
    slug: "gundam",
    title: "Gundam 5E",
    blurb: "Military sci-fi campaigns: pilots, mobile suits, contracts, sorties, and GM campaigns.",
  },
  {
    slug: "marvel",
    title: "Marvel Multiverse (616)",
    blurb: "Rank-based heroics: karma, events, villains built from rank budgets.",
  },
  {
    slug: "pta",
    title: "Pokémon Tabletop Adventures",
    blurb: "Trainer journeys: teams, expeditions, biome-typed wilds, credits and honors.",
  },
];

export default function WikiIndex() {
  return (
    <main className="min-h-screen bg-[#090b14] text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <nav className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-violet-300">
            ← Back to Realm Nexus
          </Link>
          <span className="text-xs text-slate-400">Table Wiki</span>
        </nav>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Table Wiki</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Short, practical guides: what each system is about, what a session looks like, and which
          tools to open first. The live builders and table kits live in the Nexus app (key-locked).
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/wiki/${g.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-400/40"
            >
              <h2 className="text-xl font-bold text-violet-200">{g.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{g.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-violet-300">Read the guide →</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
