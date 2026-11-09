"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CODEX_SUITS, CODEX_ERAS, CODEX_AFFILS } from "../data/suits";

type SortKey = "name" | "cost" | "ap" | "ev";

export default function CodexPage() {
  const [q, setQ] = useState("");
  const [era, setEra] = useState("all");
  const [affil, setAffil] = useState("all");
  const [sort, setSort] = useState<SortKey>("name");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = CODEX_SUITS.filter((u) => {
      if (era !== "all" && u.era !== era) return false;
      if (affil !== "all" && !u.affil.includes(affil)) return false;
      if (!needle) return true;
      const hay = (u.n + " " + u.era + " " + u.affil.join(" ") + " " + (u.tags || []).join(" ") + " " + (u.fixed || []).join(" ")).toLowerCase();
      return hay.includes(needle);
    });
    const by: Record<SortKey, (a: (typeof out)[number], b: (typeof out)[number]) => number> = {
      name: (a, b) => a.n.localeCompare(b.n),
      cost: (a, b) => a.cost - b.cost,
      ap: (a, b) => b.ap - a.ap,
      ev: (a, b) => b.ev - a.ev,
    };
    return [...out].sort(by[sort]);
  }, [q, era, affil, sort]);

  const shown = results.slice(0, 60);

  return (
    <main className="min-h-screen bg-[#090b14] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <nav className="mb-8 flex items-center justify-between">
          <Link href="/systems/gundam" className="text-sm font-semibold text-slate-300 hover:text-violet-300">
            ← Gundam 5E
          </Link>
          <span className="text-xs text-slate-400">Mobile Suit Codex · {CODEX_SUITS.length} units</span>
        </nav>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Mobile Suit Codex</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Every machine in the Nexus Gundam 5E builder — Universal Century, Post Disaster, and the
          expanded-universe canon sets — with armor, evasion, cost, and fixed loadouts. Stats are the
          builder&apos;s working numbers, tuned to sit inside UC bands.
        </p>

        <div className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, faction, weapon…"
            className="rounded-lg border border-white/10 bg-[#0b0e1a] px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-violet-400/60"
          />
          <select value={era} onChange={(e) => setEra(e.target.value)} className="rounded-lg border border-white/10 bg-[#0b0e1a] px-3 py-2 text-sm">
            <option value="all">All eras</option>
            {CODEX_ERAS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <select value={affil} onChange={(e) => setAffil(e.target.value)} className="rounded-lg border border-white/10 bg-[#0b0e1a] px-3 py-2 text-sm">
            <option value="all">All factions</option>
            {CODEX_AFFILS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-lg border border-white/10 bg-[#0b0e1a] px-3 py-2 text-sm">
            <option value="name">Sort: name</option>
            <option value="cost">Sort: cost ↑</option>
            <option value="ap">Sort: armor ↓</option>
            <option value="ev">Sort: evasion ↓</option>
          </select>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Showing {shown.length} of {results.length} matches.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {shown.map((u) => (
            <article key={u.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-bold">{u.n}</h2>
              <p className="mt-1 text-xs text-slate-400">{u.era} · {u.affil.join(" / ") || "Unaffiliated"} · {u.size}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-white/10 px-3 py-1">AP {u.ap}</span>
                <span className="rounded-full border border-white/10 px-3 py-1">EV {u.ev}</span>
                <span className="rounded-full border border-white/10 px-3 py-1">{u.cost.toLocaleString()}g</span>
                <span className="rounded-full border border-violet-400/30 px-3 py-1 text-violet-200">{u.rar}</span>
                <span className="rounded-full border border-white/10 px-3 py-1">{u.slots} slots</span>
              </div>
              {!!(u.tags || []).length && (
                <p className="mt-2 text-xs text-slate-400">Tags: {u.tags.join(", ")}</p>
              )}
              {!!(u.fixed || []).length && (
                <p className="mt-1 text-xs text-slate-400">Fixed: {u.fixed.join(", ")}</p>
              )}
              {!!u.sp && <p className="mt-2 text-xs leading-5 text-slate-400">{u.sp}</p>}
              {!!u.variants && <p className="mt-1 text-xs text-slate-500">Variants: {u.variants}</p>}
            </article>
          ))}
        </div>
        {results.length > shown.length && (
          <p className="mt-6 text-sm text-slate-500">Refine the filters to see the rest — the list caps at 60 cards for readability.</p>
        )}
      </div>
    </main>
  );
}
