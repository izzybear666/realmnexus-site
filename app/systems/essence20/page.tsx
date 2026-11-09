import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Power Rangers — Essence20 | Realm Nexus",
  description:
	"A lightweight, developer-written landing page for the Power Rangers Essence20 system on Realm Nexus.",
};

export default function Essence20Landing() {
  return (
	<main className="min-h-screen bg-[#090b14] text-white">
	  <div className="mx-auto max-w-4xl px-6 py-20">
		<nav className="mb-8 flex items-center justify-between">
		  <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-violet-300">
			← Back to Realm Nexus
		  </Link>
		  <span className="text-xs text-slate-400">Power Rangers • Essence20</span>
		</nav>

		<section className="rounded-2xl border border-violet-400/10 bg-gradient-to-b from-[#0f0b1a]/40 via-[#0b0e1a] to-[#07060b] p-10 shadow-lg">
		  <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
			✦ System Preview
		  </div>

		  <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
			Power Rangers — Essence20
		  </h1>

		  <p className="mb-6 max-w-3xl text-lg text-slate-300">
			Realm Nexus provides tools to create characters inspired by the feel of Power Rangers
			adventures using a flexible, extensible framework. This page is a developer-written
			starting point for Essence20 support — a system-focused experience built to grow.
		  </p>

		  <div className="mb-8 flex flex-col gap-4 sm:flex-row">
			<Link
			  href="/systems/essence20/create"
			  className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-6 py-3 font-bold text-black transition hover:bg-violet-400"
			>
			  Create a Character
			</Link>

			<Link
			  href="/systems/essence20/characters"
			  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/5"
			>
			  Character Library
			</Link>

			<Link
			  href="/"
			  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/5"
			>
			  Return Home
			</Link>
		  </div>

		  <div className="mt-6 rounded-lg border border-white/5 bg-white/2 p-4 text-sm text-slate-400">
			<strong className="text-slate-200">Developer note:</strong> This landing page is a
			friendly overview and entry point for system tools. No official rules or copyrighted
			rulebook text are included here.
		  </div>
		</section>
	  </div>
	</main>
  );
}
