"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ORIGINS } from "../data/origins";
import { ROLES, SPECTRA } from "../data/roles";

const LIB_KEY = "realm-nexus:essence20:characters";
const SINGLE_KEY = "realm-nexus:essence20:character";

export default function CharacterLibrary() {
  const [loaded, setLoaded] = useState(false);
  const [library, setLibrary] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
	try {
	  const raw = localStorage.getItem(LIB_KEY);
	  if (!raw) {
		// Try to migrate single-character key safely
		const single = localStorage.getItem(SINGLE_KEY);
		if (single) {
		  try {
			const parsed = JSON.parse(single);
			const candidate = parsed.draft && typeof parsed.draft === 'object' ? parsed : { draft: parsed };
			const id = `imported-${Date.now()}`;
			const entry = { id, name: (candidate.draft && candidate.draft.name) || candidate.name || 'Imported', payload: candidate };
			const newLib = [entry];
			localStorage.setItem(LIB_KEY, JSON.stringify(newLib));
			setLibrary(newLib);
			setLoaded(true);
			return;
		  } catch (e) {
			setError('Found legacy saved character but failed to migrate it automatically.');
			setLoaded(true);
			return;
		  }
		}
		setLoaded(true);
		return;
	  }
	  const parsed = JSON.parse(raw) as any[];
	  if (!Array.isArray(parsed)) {
		setError('Character library is corrupt.');
		setLoaded(true);
		return;
	  }
	  setLibrary(parsed);
	  setLoaded(true);
	} catch (e) {
	  setError('Failed to read character library.');
	  setLoaded(true);
	}
  }, []);

  function removeCharacter(id: string) {
	if (!confirm('Delete this character? This cannot be undone.')) return;
	const next = library.filter(c => c.id !== id);
	try {
	  localStorage.setItem(LIB_KEY, JSON.stringify(next));
	  setLibrary(next);
	} catch (e) {
	  setError('Failed to delete character.');
	}
  }

  if (!loaded) return null;

  return (
	<main className="min-h-screen bg-[#090b14] text-white">
	  <div className="mx-auto max-w-5xl px-6 py-12">
		<div className="mb-6 flex items-center justify-between">
		  <h1 className="text-3xl font-extrabold">Character Library</h1>
		  <div className="flex gap-2">
			<Link href="/systems/essence20/create" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Create New</Link>
			<Link href="/systems/essence20" className="rounded-xl bg-white/3 px-4 py-2 text-sm font-semibold text-white">Essence20 Home</Link>
		  </div>
		</div>

		{error && <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

		<div className="grid gap-4 sm:grid-cols-2">
		  {library.length === 0 && (
			<div className="rounded-xl border border-white/6 p-6 text-sm text-slate-300">No saved characters. Use Create New or import from the Character Sheet.</div>
		  )}

		  {library.map((c) => (
			<div key={c.id} className="rounded-xl border border-white/6 p-4">
			  <div className="flex items-center justify-between">
				<div>
				  <div className="text-lg font-semibold">{c.name || 'Unnamed'}</div>
				  <div className="text-sm text-slate-400">{(c.payload && (c.payload.draft?.origin || c.payload.origin)) ? (c.payload.draft?.origin || c.payload.origin) : '(no origin)'}</div>
				</div>
				<div className="flex gap-2">
				  <Link href={`/systems/essence20/create?charId=${encodeURIComponent(c.id)}`} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200">Open</Link>
				  <Link href={`/systems/essence20/character-sheet?charId=${encodeURIComponent(c.id)}`} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200">View</Link>
				  <button onClick={() => removeCharacter(c.id)} className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300">Delete</button>
				</div>
			  </div>
			</div>
		  ))}
		</div>
	  </div>
	</main>
  );
}
