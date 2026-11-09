import type { Metadata } from "next";
import Link from "next/link";

type Guide = {
  slug: string;
  title: string;
  tagline: string;
  about: string[];
  session: string[];
  tools: { name: string; what: string }[];
};

const GUIDES: Record<string, Guide> = {
  essence20: {
    slug: "essence20",
    title: "Power Rangers — Essence20",
    tagline: "Team-based heroics against monsters of the week.",
    about: [
      "You play a team of Rangers defending a city that keeps getting attacked on schedule. Each Ranger has a role (their color and combat style), an origin, influences, perks, powers, and a Zord for the fights that go big.",
      "Play is scene-based: civilian life, investigation, the monster reveal, the fight, and — when the monster grows — the Zord battle.",
    ],
    session: [
      "Open the Table Kit and generate an adventure hook, or roll a civilian name and monster gimmick to improvise.",
      "Play the scenes; award split XP from the kit and hand out story points for heroics.",
      "Log milestones per character and print a summary when the arc closes.",
    ],
    tools: [
      { name: "Character builder", what: "Role, origin, skills, perks, powers, gear, Zords — saved to your library." },
      { name: "Table Kit", what: "Progression, adventure generator, threat roster, XP splitter, print/export." },
    ],
  },
  gundam: {
    slug: "gundam",
    title: "Gundam 5E",
    tagline: "Grounded military sci-fi: pilots, machines, contracts, and consequences.",
    about: [
      "You play mobile suit pilots in a war with many fronts — One Year War trenches, Post Disaster turf wars, and beyond. Pilots have classes, allegiances, and proficiencies; suits are gated by starting issue, allegiance grants, or gilla purchase.",
      "Campaigns run on contracts: pickup work with a client, terrain, complications, and opposition — then downtime, repairs, and renown with the factions you impressed (or angered).",
    ],
    session: [
      "Build or load your pilot, then generate a contract in Missions (codex table or your GM's NPC pool).",
      "Send the contract to the Sortie tracker and fight it round by round; end the sortie to write milestones, suit XP, and remaining armor back to the sheets.",
      "Repair in the Suit Bay, log downtime and renown in Progression, and submit to a GM campaign for validation.",
    ],
    tools: [
      { name: "Pilot builder + Hangar", what: "Full creator with server-mirrored validation rules." },
      { name: "Suit Bay", what: "Commission, load out, damage-track, and repair every machine." },
      { name: "Missions + Sortie + GM Tools", what: "Contracts, live combat, encounter math, NPC aces, mass combat." },
      { name: "Campaigns", what: "GM-run tables with server-validated pilots, mission board, and table talk." },
      { name: "This codex", what: "All 292 suits with armor, evasion, cost, and loadouts — start here when shopping." },
    ],
  },
  marvel: {
    slug: "marvel",
    title: "Marvel Multiverse (616)",
    tagline: "Rank-based heroics where karma is the real currency.",
    about: [
      "You play original heroes ranked from street-level to cosmic. Ranks set budgets — ability points, power count, karma — and every hero juggles collateral, secret identities, and a public that watches everything.",
      "Stories run as events: a crisis somewhere public, a turn nobody saw coming, and something at stake beyond the fight.",
    ],
    session: [
      "Generate an event in the Table Kit, pick the villain rank, and add the villain to the roster.",
      "Play it out; split karma after, and log spends when heroes push beyond their limits.",
      "Print a hero summary between arcs to keep the table honest.",
    ],
    tools: [
      { name: "Hero builder + Library", what: "Rank-true heroes saved to your library." },
      { name: "Table Kit", what: "Karma logs, event generator, rank-budget villain roster, karma splitter." },
    ],
  },
  pta: {
    slug: "pta",
    title: "Pokémon Tabletop Adventures",
    tagline: "Trainer journeys across routes full of wilds.",
    about: [
      "You play trainers raising teams across regions stitched from routes, biomes, and trouble. Trainers have classes, talents, honors, and credits; Pokémon have natures, moves, and loyalty that has to be earned.",
      "Travel runs as expeditions: pick a biome, meet its wilds, survive the hazard, and find something worth the trip.",
    ],
    session: [
      "Generate an expedition route in the Table Kit — wilds scale to the selected trainer's level.",
      "Play the route; log sessions, honors, and credit finds per trainer.",
      "Keep recurring wilds in the roster so rivals and guardians return.",
    ],
    tools: [
      { name: "Trainer builder + Library", what: "Classes, talents, teams of up to six with full stat blocks." },
      { name: "Table Kit", what: "Sessions, credits/honors, biome expedition seeds from the species codex, wild roster." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(GUIDES).map((system) => ({ system }));
}

export async function generateMetadata({ params }: { params: Promise<{ system: string }> }): Promise<Metadata> {
  const { system } = await params;
  const g = GUIDES[system];
  return { title: g ? `${g.title} guide | Realm Nexus` : "Guide | Realm Nexus" };
}

export default async function WikiGuide({ params }: { params: Promise<{ system: string }> }) {
  const { system } = await params;
  const g = GUIDES[system];
  if (!g) {
    return (
      <main className="min-h-screen bg-[#090b14] text-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p>Unknown guide.</p>
          <Link href="/wiki" className="text-violet-300">← All guides</Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#090b14] text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <nav className="mb-8 flex items-center justify-between">
          <Link href="/wiki" className="text-sm font-semibold text-slate-300 hover:text-violet-300">
            ← All guides
          </Link>
          <span className="text-xs text-slate-400">Table Wiki</span>
        </nav>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">Guide</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{g.title}</h1>
        <p className="mt-3 text-lg text-slate-300">{g.tagline}</p>

        <h2 className="mt-10 text-2xl font-bold">What it is</h2>
        {g.about.map((p, i) => (
          <p key={i} className="mt-3 leading-7 text-slate-300">{p}</p>
        ))}

        <h2 className="mt-10 text-2xl font-bold">A typical session</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-slate-300">
          {g.session.map((s, i) => (
            <li key={i} className="leading-7">{s}</li>
          ))}
        </ol>

        <h2 className="mt-10 text-2xl font-bold">Which tools to open</h2>
        <ul className="mt-3 space-y-3">
          {g.tools.map((t) => (
            <li key={t.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <strong className="text-violet-200">{t.name}.</strong>{" "}
              <span className="text-slate-300">{t.what}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl border border-violet-400/20 bg-violet-500/10 p-5 text-sm text-slate-300">
          The builders, table kits, and campaigns live in the Nexus app (key-locked):{" "}
          <a href="https://perchance.org/nexusrealm-com" className="font-semibold text-violet-200 hover:text-violet-100">
            perchance.org/nexusrealm-com ↗
          </a>
        </div>
      </div>
    </main>
  );
}
