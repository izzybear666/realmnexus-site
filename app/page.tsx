
const games: {
  title: string;
  category: string;
  description: string;
  status: string;
  symbol: string;
  href?: string;
}[] = [
  {
    title: "Power Rangers Essence20",
    category: "SUPERHERO · SCI-FI",
    description:
      "Create your Ranger, choose your abilities, and prepare to defend the universe.",
    status: "FIRST SYSTEM",
    symbol: "✦",
    href: "/systems/essence20",
  },
  {
    title: "Gundam 5E",
    category: "MECHA · MILITARY SCI-FI",
    description:
      "Full pilot builder, 292-unit mobile suit codex, sorties, missions, and GM campaigns.",
    status: "CODEX + GUIDES LIVE",
    symbol: "◈",
    href: "/systems/gundam",
  },
  {
    title: "Fantasy Adventures",
    category: "FANTASY",
    description:
      "A future home for heroes, magic, monsters, and epic quests.",
    status: "COMING LATER",
    symbol: "⚔",
  },
  {
    title: "Science Fiction",
    category: "SCI-FI",
    description:
      "Build characters ready to explore distant worlds and unknown galaxies.",
    status: "COMING LATER",
    symbol: "⌘",
  },
];

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090b14] text-white">
      <header className="border-b border-white/10 bg-[#090b14]/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/40 bg-violet-500/15 text-2xl text-violet-200">
              ✧
            </span>
            <span className="text-xl font-bold tracking-wide">
              REALM <span className="text-violet-300">NEXUS</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#games" className="transition hover:text-violet-300">
              Game Library
            </a>
            <a href="#about" className="transition hover:text-violet-300">
              About
            </a>
            <Link href="/wiki" className="transition hover:text-violet-300">
              Wiki
            </Link>
          </div>

          <a
            href="#games"
            className="rounded-lg border border-violet-400/40 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500/15"
          >
            Explore Games
          </a>
        </nav>
      </header>

      <section className="relative isolate border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_20%,rgba(124,58,237,0.22),transparent_55%)]" />

        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
            <span className="h-2 w-2 rounded-full bg-violet-300" />
            Your next adventure begins here
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl md:text-8xl">
            Every world.
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
              Every character.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            One home for your tabletop adventures. Create characters,
            explore game systems, and bring your favorite worlds to life
            through a growing collection of RPG tools.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#games"
              className="rounded-xl bg-violet-500 px-7 py-4 font-bold transition hover:bg-violet-400"
            >
              Explore the Game Library ↗
            </a>
            <a
              href="#about"
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold transition hover:bg-white/10"
            >
              Discover Realm Nexus
            </a>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-400">
            <span>✦ Multiple RPG systems</span>
            <span>✦ Character creation</span>
            <span>✦ Built to expand</span>
          </div>
        </div>
      </section>

      <section id="games" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
              Find your next adventure
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              The Game Library
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-400">
              Explore supported systems and discover the worlds you can
              build characters for as Realm Nexus grows.
            </p>
          </div>
          <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400">
            First system in development
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {games.map((game, index) => (
            <article
              key={game.title}
              className={`group rounded-2xl border p-6 transition duration-300 ${
                index === 0
                  ? "border-violet-400/40 bg-gradient-to-b from-violet-500/10 to-[#10121e] hover:border-violet-300/70"
                  : "border-white/10 bg-white/[0.025] hover:border-white/25"
              }`}
            >
              
{index === 0 ? (
  <div className="mb-5">
    <div className="overflow-hidden rounded-xl border border-violet-400/20">
      <img
        src="/images/PowerRangersRPGNexusLogo.png"
        alt="Power Rangers Essence20"
        className="h-40 w-full object-contain"
      />
    </div>
    <p className="mt-2 text-xs text-slate-500">
      Logo artwork by Keyes
    </p>
  </div>
) : (
  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-3xl text-violet-200">
    {game.symbol}
  </div>
)}


              <p className="mt-7 text-xs font-bold tracking-[0.16em] text-violet-300">
                {game.category}
              </p>

              <h3 className="mt-3 text-xl font-bold">{game.title}</h3>

              <p className="mt-3 min-h-20 leading-7 text-slate-400">
                {game.description}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold tracking-wider text-slate-400">
                  {game.status}
                </p>
                {game.href ? (
                  <Link
                    href={game.href}
                    className="mt-4 inline-flex items-center gap-2 font-semibold text-violet-300 transition group-hover:text-violet-200"
                  >
                    {index === 0 ? "View first system" : "Open section"} <span>→</span>
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Planned for a future update
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-r from-violet-500/10 via-[#111321] to-sky-500/10 p-8 sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
            Built for every kind of player
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
            One nexus. Countless adventures.
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            Realm Nexus is being designed as a flexible home for tabletop
            RPG character creation. Each game will have its own rules and
            character options, while the platform grows around a shared,
            consistent experience.
          </p>
          <p className="mt-6 text-sm text-slate-400">
            Our journey starts with Power Rangers Essence20.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 Realm Nexus</p>
          <p>A growing home for tabletop roleplaying adventures.</p>
        </div>
      </footer>
    </main>
  );
}
