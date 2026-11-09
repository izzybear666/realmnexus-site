"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ORIGINS } from "../data/origins";
import { ROLES, SPECTRA } from "../data/roles";
import { INFLUENCES } from "../data/influences";
import { PERKS, HANGUPS } from "../data/perks";
import { SKILLS } from "../data/skills";
import { EQUIPMENT } from "../data/equipment";
import { GRID_POWERS } from "../data/grid-powers";
import { ZORDS } from "../data/zords";

const LOCAL_KEY = "realm-nexus:essence20:character";

export default function Essence20CharacterSheet() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [noSaved, setNoSaved] = useState<boolean>(false);
  const [draft, setDraft] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importCandidate, setImportCandidate] = useState<any>(null);
  const [importRaw, setImportRaw] = useState<string | null>(null);

	useEffect(() => {
	// Robustly read saved payload. Accept either:
	// - legacy simple SavedCharacter { name, concept, notes }
	// - full payload { name, concept, notes, draft }
	try {
	  // If a ?charId=... query param is present, prefer loading from the library key
	  try {
		const params = new URLSearchParams(window.location.search);
		const charId = params.get('charId');
		if (charId) {
		  const libRaw = localStorage.getItem('realm-nexus:essence20:characters');
		  if (libRaw) {
			try {
			  const lib = JSON.parse(libRaw);
			  if (Array.isArray(lib)) {
				const found = lib.find((c) => c && String(c.id) === charId);
				if (found) {
				  // Library entries may store the payload under .payload or be the object itself.
				  const payload = found.payload ?? found;
				  const loadedDraft =
					payload && typeof payload === 'object'
					  ? (payload.draft && typeof payload.draft === 'object' ? payload.draft : payload)
					  : null;
				  if (loadedDraft) {
					setDraft(loadedDraft);
					setNoSaved(false);
					setLoaded(true);
					return;
				  }
				}
			  }
			} catch (err) {
			  // If library parsing fails, fall back to legacy single-key load
			}
		  }
		}
	  } catch (err) {
		// Ignore URL parsing/window errors and proceed to legacy behavior
	  }

	  const raw = localStorage.getItem(LOCAL_KEY);
	  if (!raw) {
		setNoSaved(true);
		setLoaded(true);
		return;
	  }

	  let parsed: any = null;
	  try {
		parsed = JSON.parse(raw);
	  } catch (e) {
		// If parsing fails, try to recover by trimming whitespace
		const trimmed = raw.trim();
		try {
		  parsed = JSON.parse(trimmed);
		} catch (e2) {
		  parsed = null;
		}
	  }

	  if (!parsed || typeof parsed !== 'object') {
		setNoSaved(true);
		setLoaded(true);
		return;
	  }

	  // If the saved payload is the full wrapper, prefer parsed.draft
	  let loadedDraft = parsed.draft;

	  // If draft is missing or not an object, try legacy top-level fields
	  if (!loadedDraft || typeof loadedDraft !== 'object') {
		const hasAnyTopLevel = parsed.name || parsed.concept || parsed.notes || parsed.savedAt;
		if (hasAnyTopLevel) {
		  loadedDraft = {
			name: parsed.name,
			concept: parsed.concept,
			notes: parsed.notes,
			// keep any extra top-level fields if present
			...(parsed.draft && typeof parsed.draft === 'object' ? parsed.draft : {}),
		  };
		} else {
		  // No recognizable fields — treat as no saved character
		  setNoSaved(true);
		  setLoaded(true);
		  return;
		}
	  }

	  setDraft(loadedDraft);
	  setNoSaved(false);
	  setLoaded(true);
	  return;
	} catch (e) {
	  // Any unexpected error should not crash the page — show helpful empty state
	  // but keep the error silent to the user here.
	  setNoSaved(true);
	  setLoaded(true);
	  return;
	}
  }, []);

  function getOriginDisplay(val?: any) {
	if (!val) return null;
	const byId = ORIGINS.find((o) => o.id === val);
	if (byId) return byId.name;
	const byName = ORIGINS.find((o) => o.name === val);
	if (byName) return byName.name;
	return String(val);
  }

  function getSelectedRole(val?: any) {
	if (!val) return null;
	return ROLES.find((r) => r.id === val) ?? ROLES.find((r) => r.name === val) ?? null;
  }

  function getRoleFeatureName(role: any, featureId?: string) {
	if (!role || !featureId) return featureId ?? "";
	const found = (role.roleRules?.features ?? []).find((f: any) => f.id === featureId);
	return found?.name ?? featureId;
  }

  function getInfluenceDisplayList(arr?: any[]) {
	if (!arr || arr.length === 0) return [] as string[];
	return arr.map((v) => {
	  const id = typeof v === "string" ? v : String(v);
	  const found = INFLUENCES.find((i) => i.id === id) ?? INFLUENCES.find((i) => i.name === id);
	  return found ? found.name : id;
	});
  }

  function getSpectrumDisplay(val?: any) {
	if (!val) return null;
	const byId = SPECTRA.find((s) => s.id === val);
	if (byId) return byId.name;
	const byName = SPECTRA.find((s) => s.name === val);
	if (byName) return byName.name;
	return String(val);
  }

  function getRoleDisplay(val?: any) {
	if (!val) return null;
	const byId = ROLES.find((r) => r.id === val);
	if (byId) return byId.name;
	const byName = ROLES.find((r) => r.name === val);
	if (byName) return byName.name;
	return String(val);
  }

  function getPerkDisplayList(arr?: any[]) {
	if (!arr || arr.length === 0) return [] as string[];
	if (PERKS.length === 0) return arr.map(String);
	return arr.map((v) => {
	  const id = typeof v === "string" ? v : String(v);
	  const found = PERKS.find((p) => p.id === id) ?? PERKS.find((p) => p.name === id);
	  return found ? found.name : id;
	});
  }

  function getHangupDisplayList(arr?: any[]) {
	if (!arr || arr.length === 0) return [] as string[];
	if (HANGUPS.length === 0) return arr.map(String);
	return arr.map((v) => {
	  const id = typeof v === "string" ? v : String(v);
	  const found = HANGUPS.find((h) => h.id === id) ?? HANGUPS.find((h) => h.name === id);
	  return found ? found.name : id;
	});
  }

  function parseScoreToNumber(val?: string) {
	if (!val) return null;
	const s = String(val).trim();
	if (/^-?\d+$/.test(s)) return parseInt(s, 10);
	return null;
  }

  function getBaseDefenses(essence?: Record<string,string>) {
	const out: Record<string, number | null> = {
	  Toughness: null,
	  Evasion: null,
	  Willpower: null,
	  Cleverness: null,
	};
	if (!essence) return out;
	const str = parseScoreToNumber(essence['Strength']);
	const spd = parseScoreToNumber(essence['Speed']);
	const smt = parseScoreToNumber(essence['Smarts']);
	const soc = parseScoreToNumber(essence['Social']);
	out.Toughness = str !== null ? 10 + str : null;
	out.Evasion = spd !== null ? 10 + spd : null;
	out.Willpower = smt !== null ? 10 + smt : null;
	out.Cleverness = soc !== null ? 10 + soc : null;
	return out;
  }

  function getSkillName(id?: string) {
	if (!id) return id ?? "";
	const found = SKILLS.find((s) => s.id === id) ?? SKILLS.find((s) => s.name === id);
	return found ? found.name : String(id);
  }

  function formatSkillRanks(ranks?: Record<string,string>) {
	if (!ranks) return [] as string[];
	return Object.entries(ranks).map(([id, rank]) => {
	  const name = getSkillName(id) || id;
	  return `${name}: ${rank}`;
	});
  }

  function formatSkillSpecializations(specs?: Record<string, string[]>) {
	if (!specs) return [] as string[];
	const out: string[] = [];
	Object.entries(specs).forEach(([id, raw]) => {
	  const list = Array.isArray(raw)
		? raw.map((v) => String(v).trim()).filter(Boolean)
		: (typeof raw === 'string' ? [raw] : []);
	  if (list.length === 0) return;
	  const name = getSkillName(id) || id;
	  out.push(`${name}: ${list.join(', ')}`);
	});
	return out;
  }

  function getEquipmentName(id?: string) {
	if (!id) return id ?? "";
	const found = EQUIPMENT.find((e) => e.id === id) ?? EQUIPMENT.find((e) => e.name === id);
	return found ? found.name : String(id);
  }

  function formatEquipmentList(arr?: string[]) {
	if (!arr || arr.length === 0) return [] as string[];
	return arr.map((v) => getEquipmentName(v));
  }

  function getGridPowerName(id?: string) {
	if (!id) return id ?? "";
	const found = GRID_POWERS.find((p) => p.id === id) ?? GRID_POWERS.find((p) => p.name === id);
	return found ? found.name : String(id);
  }

  function formatGridPowerList(arr?: string[]) {
	if (!arr || arr.length === 0) return [] as string[];
	return arr.map((v) => getGridPowerName(v));
  }

  function getZordName(id?: string) {
	if (!id) return id ?? "";
	const found = ZORDS.find((z) => z.id === id) ?? ZORDS.find((z) => z.name === id);
	return found ? found.name : String(id);
  }

  function formatZordList(arr?: string[]) {
	if (!arr || arr.length === 0) return [] as string[];
	return arr.map((v) => getZordName(v));
  }

  function getSavedRaw() {
	try {
	  return localStorage.getItem(LOCAL_KEY);
	} catch (e) {
	  return null;
	}
  }

  function validateSavedPayload(obj: any) {
	if (!obj || typeof obj !== 'object') return false;
	// Accept either wrapper { draft: {...}, name?, concept?, notes? }
	if (obj.draft && typeof obj.draft === 'object') return true;
	// Or legacy shape with at least a name or concept
	if (typeof obj.name === 'string' || typeof obj.concept === 'string') return true;
	return false;
  }

  function handleExport() {
	const raw = getSavedRaw();
	if (!raw) {
	  setError('No saved character to export.');
	  setMessage(null);
	  return;
	}
	// Create a downloadable blob
	const blob = new Blob([raw], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	const filename = 'realm-nexus-essence20-character.json';
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
	setMessage('Export started. Save dialog should appear.');
	setError(null);
	window.setTimeout(() => setMessage(null), 3000);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
	setError(null);
	setMessage(null);
	const file = e.target.files?.[0];
	if (!file) {
	  setError('No file selected.');
	  return;
	}
	if (!file.name.toLowerCase().endsWith('.json')) {
	  setError('Please select a JSON (.json) file.');
	  return;
	}
	const reader = new FileReader();
	reader.onload = () => {
	  const txt = String(reader.result ?? '');
	  try {
		const parsed = JSON.parse(txt);
		if (!validateSavedPayload(parsed)) {
		  setError('JSON does not appear to be a valid saved character payload.');
		  return;
		}
		// Show candidate for confirmation
		setImportCandidate(parsed);
		setImportRaw(txt);
	  } catch (err) {
		setError('Invalid JSON file.');
	  }
	};
	reader.onerror = () => setError('Failed to read file.');
	reader.readAsText(file);
	// clear the input value so same file can be reselected if needed
	e.currentTarget.value = '';
  }

  function confirmImport() {
	if (!importCandidate || !importRaw) return;
	try {
		// Instead of overwriting the legacy single key, import to the library as a new entry
	  const LIB_KEY = 'realm-nexus:essence20:characters';
	  let lib: any[] = [];
	  try {
		const raw = localStorage.getItem(LIB_KEY);
		if (raw) {
		  const parsedLib = JSON.parse(raw);
		  if (Array.isArray(parsedLib)) lib = parsedLib;
		}
	  } catch (e) {
		lib = [];
	  }

	  const makeId = () => {
		try {
		  // @ts-ignore
		  return (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) || (`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`);
		} catch (e) {
		  return `id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
		}
	  };

	  const id = makeId();
	  const entry = { id, name: (importCandidate.draft && importCandidate.draft.name) || importCandidate.name || 'Imported', payload: importCandidate };
	  lib.push(entry);
	  localStorage.setItem(LIB_KEY, JSON.stringify(lib));

	  // Update UI to show imported draft
	  const parsed = importCandidate.draft && typeof importCandidate.draft === 'object' ? importCandidate.draft : {
		name: importCandidate.name,
		concept: importCandidate.concept,
		notes: importCandidate.notes,
		...(importCandidate.draft && typeof importCandidate.draft === 'object' ? importCandidate.draft : {}),
	  };
	  setDraft(parsed);
	  setImportCandidate(null);
	  setImportRaw(null);
	  setMessage('Character imported into library successfully.');
	  setError(null);
	  window.setTimeout(() => setMessage(null), 3000);
	} catch (e) {
	  setError('Failed to write imported character to localStorage.');
	}
  }

  function cancelImport() {
	setImportCandidate(null);
	setImportRaw(null);
	setMessage(null);
	setError(null);
  }

  if (!loaded) return null;

  if (noSaved || !draft) {
	return (
	  <main className="min-h-screen bg-[#090b14] text-white">
		<div className="mx-auto max-w-4xl px-6 py-12">
		  <div className="rounded-2xl border border-violet-400/10 bg-gradient-to-b from-[#0c0716] via-[#080a12] to-[#05040a] p-6">
			<h1 className="text-2xl font-bold">No saved Essence20 character found</h1>
			<p className="mt-2 text-slate-300">There is no saved draft in your browser under the expected key. You can return to the character creator to make or save a character.</p>
			<div className="mt-4 flex gap-3">
			  <Link href="/systems/essence20/create" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-bold text-black">Open Creator</Link>
			  <Link href="/systems/essence20" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Back</Link>
			</div>
		  </div>
		</div>
	  </main>
	);
  }

  const base = getBaseDefenses(draft.essence as Record<string,string>);
  const selectedRole = getSelectedRole(draft.role);

  return (
	<main className="min-h-screen bg-[#090b14] text-white">
	  <div className="mx-auto max-w-4xl px-6 py-12">
		<div className="mb-6 flex items-center justify-between">
		  <div>
			<h1 className="text-3xl font-extrabold">Character Sheet</h1>
			<div className="mt-2 text-sm text-slate-400">Essence20 • Draft loaded from localStorage</div>
		  </div>
			<div className="flex gap-2">
			<button onClick={() => window.print()} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 no-print">Print / Save as PDF</button>
			<button onClick={() => handleExport()} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 no-print">Export Character</button>
			<label className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 cursor-pointer no-print">
			  Import Character
			  <input onChange={(e) => handleFileInput(e)} accept=".json,application/json" type="file" className="hidden" />
			</label>
			<Link href="/systems/essence20/create" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 no-print">Back to Creator</Link>
			<Link href="/systems/essence20" className="rounded-xl bg-white/3 px-4 py-2 text-sm font-semibold text-white no-print">Essence20 Home</Link>
		  </div>
		</div>

		<div className="grid gap-6 md:grid-cols-3">
		  <div className="col-span-2">
			<div className="rounded-xl border border-white/6 bg-transparent p-6 space-y-6">
				{message && <div className="rounded-md bg-violet-500/10 p-3 text-sm text-violet-200">{message}</div>}
			  {error && <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
			  {/* Identity */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Identity</h2>
				<div className="mt-2 text-sm text-slate-300">
				  <div><strong>Name:</strong> {draft.name ?? '(unnamed)'}</div>
				  <div><strong>Concept:</strong> {draft.concept ?? '(none)'}</div>
				  <div className="mt-2"><strong>Notes:</strong> {draft.notes ?? '(none)'}</div>
				</div>
			  </section>

			  {/* Choices */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Character Choices</h2>
				<div className="mt-2 text-sm text-slate-300 space-y-1">
				  <div><strong>Origin:</strong> {getOriginDisplay(draft.origin) ?? '(not selected)'}</div>
				  <div><strong>Spectrum:</strong> {getSpectrumDisplay(draft.spectrum) ?? '(not selected)'}</div>
				  <div><strong>Role:</strong> {getRoleDisplay(draft.role) ?? '(not selected)'}</div>
				  <div><strong>Influences:</strong> {(draft.influences ?? []).length > 0 ? getInfluenceDisplayList(draft.influences as string[]).join(', ') : '(none)'}</div>
				  <div><strong>Perks:</strong> {(draft.perks ?? []).length > 0 ? getPerkDisplayList(draft.perks).join(', ') : '(none)'}</div>
				  <div><strong>Hang-ups:</strong> {(draft.hangups ?? []).length > 0 ? getHangupDisplayList(draft.hangups).join(', ') : '(none)'}</div>
				  <div><strong>Zords:</strong> {(draft.zords ?? []).length > 0 ? formatZordList(draft.zords as string[]).join(', ') : '(none)'}</div>
				</div>
			  </section>

			  {selectedRole?.roleRules && (
				<section className="character-section">
				  <h2 className="text-lg font-semibold">Role Progression & Benefits</h2>
				  <div className="mt-2 text-sm text-slate-300 space-y-3">
					{Array.isArray(selectedRole.roleRules.startingBenefits) && selectedRole.roleRules.startingBenefits.length > 0 && (
					  <div>
						<div className="text-xs text-slate-400">Starting Benefits</div>
						{selectedRole.roleRules.startingBenefits.map((b: any) => (
						  <div key={b.id}>• {b.name}{b.description ? `: ${b.description}` : ''}</div>
						))}
					  </div>
					)}
					{Array.isArray(selectedRole.roleRules.startingEquipment) && selectedRole.roleRules.startingEquipment.length > 0 && (
					  <div>
						<div className="text-xs text-slate-400">Starting Equipment</div>
						{selectedRole.roleRules.startingEquipment.map((e: any) => (
						  <div key={e.id}>• {e.itemName ?? e.id}{e.quantity ? ` x${e.quantity}` : ''}{e.notes ? ` (${e.notes})` : ''}</div>
						))}
					  </div>
					)}
					{Array.isArray(selectedRole.roleRules.progression) && selectedRole.roleRules.progression.length > 0 && (
					  <div>
						<div className="text-xs text-slate-400">Level Features</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
						  {selectedRole.roleRules.progression.map((p: any) => {
							const labels = Array.isArray(p.featureIds) && p.featureIds.length > 0
							  ? p.featureIds.map((id: string) => getRoleFeatureName(selectedRole, id)).join(', ')
							  : '(no listed feature)';
							return <div key={p.level}><strong>Lv {p.level}:</strong> {labels}</div>;
						  })}
						</div>
					  </div>
					)}
				  </div>
				</section>
			  )}

			  {/* Essence Scores */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Essence Scores</h2>
				<div className="mt-2 text-sm text-slate-300 grid grid-cols-2 gap-2">
				  {['Strength','Speed','Smarts','Social'].map(k => (
					<div key={k}><strong>{k}:</strong> {(draft.essence && (draft.essence as Record<string,string>)[k]) ?? '(unset)'}</div>
				  ))}
				</div>
			  </section>

			  {/* Skills */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Skills</h2>
				<div className="mt-2 text-sm text-slate-300">
				  {draft.skillRanks && Object.keys(draft.skillRanks).length > 0
					? formatSkillRanks(draft.skillRanks as Record<string,string>).map((s, i) => <div key={i}>{s}</div>)
					: (draft.skills && (draft.skills as string[]).length > 0)
					  ? (draft.skills as string[]).map((s, i) => <div key={i}>{s}</div>)
					  : <div>(no skills saved)</div>}
				</div>
			  </section>

			  {/* Skill Specializations */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Skill Specializations</h2>
				<div className="mt-2 text-sm text-slate-300">
				  {draft.skillSpecializations && Object.keys(draft.skillSpecializations).length > 0
					? formatSkillSpecializations(draft.skillSpecializations as Record<string, string[]>).map((s, i) => <div key={i}>{s}</div>)
					: <div>(no skill specializations saved)</div>}
				</div>
			  </section>

			  {/* Base Defenses */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Base Defenses</h2>
				<div className="mt-2 text-sm text-slate-300 grid grid-cols-2 gap-2">
				  <div><strong>Toughness:</strong> {base.Toughness !== null ? base.Toughness : '(missing)'}</div>
				  <div><strong>Evasion:</strong> {base.Evasion !== null ? base.Evasion : '(missing)'}</div>
				  <div><strong>Willpower:</strong> {base.Willpower !== null ? base.Willpower : '(missing)'}</div>
				  <div><strong>Cleverness:</strong> {base.Cleverness !== null ? base.Cleverness : '(missing)'}</div>
				</div>
				<div className="mt-2 text-xs text-slate-400">These are base defenses (Armor, Perks, and other modifiers are not applied).</div>
			  </section>

			  {/* Equipment & Powers */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Equipment & Powers</h2>
				<div className="mt-2 text-sm text-slate-300">
				  <div className="mb-2"><strong>Equipment:</strong></div>
				  {draft.equipment && (draft.equipment as string[]).length > 0
					? formatEquipmentList(draft.equipment as string[]).map((e, i) => <div key={i}>{e}</div>)
					: <div>(no equipment saved)</div>}
				  <div className="mt-3 mb-2"><strong>Powers:</strong></div>
				  {draft.powers && (draft.powers as string[]).length > 0
					? formatGridPowerList(draft.powers as string[]).map((p, i) => <div key={i}>{p}</div>)
					: <div>(no powers saved)</div>}
				  <div className="mt-3 mb-2"><strong>Zords:</strong></div>
				  {draft.zords && (draft.zords as string[]).length > 0
					? formatZordList(draft.zords as string[]).map((z, i) => <div key={i}>{z}</div>)
					: <div>(no zords saved)</div>}
				</div>
			  </section>

			  {/* Import confirmation modal area */}
			  {importCandidate && (
				<div className="rounded-md border border-yellow-400/20 bg-yellow-900/5 p-4">
				  <div className="text-sm text-yellow-200 font-semibold">Import Preview</div>
				  <div className="mt-2 text-sm text-slate-300">Name: {(importCandidate.draft && importCandidate.draft.name) || importCandidate.name || '(unnamed)'}</div>
				  <div className="mt-2 text-sm text-slate-300">This will replace the currently saved character. Proceed?</div>
				  <div className="mt-3 flex gap-2">
					<button onClick={() => confirmImport()} className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-bold text-black">Confirm Import</button>
					<button onClick={() => cancelImport()} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Cancel</button>
				  </div>
				</div>
			  )}

			  {/* Notes */}
				<section className="character-section">
				<h2 className="text-lg font-semibold">Notes</h2>
				<div className="mt-2 text-sm text-slate-300">{draft.notes ?? '(none)'}</div>
			  </section>
			</div>
		  </div>

		  <aside className="col-span-1">
			<div className="rounded-2xl border border-violet-400/10 bg-gradient-to-b from-[#0f0716]/40 to-[#07060b] p-4">
			  <h3 className="text-sm font-semibold text-white">Quick Info</h3>
			  <div className="mt-3 text-sm text-slate-300 space-y-2">
				<div><strong>Name:</strong> {draft.name ?? '(unnamed)'}</div>
				<div><strong>Base Defenses:</strong></div>
				<div className="text-sm text-slate-300">{Object.entries(base).map(([k,v]) => <div key={k}>{k}: {v !== null ? v : '(missing)'}</div>)}</div>
				<div className="mt-2 text-xs text-slate-400">Return to creator to edit this draft.</div>
				<div className="mt-3 flex gap-2">
				  <Link href="/systems/essence20/create" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Edit</Link>
				  <Link href="/systems/essence20" className="rounded-xl bg-white/3 px-4 py-2 text-sm font-semibold text-white">Essence20 Home</Link>
				</div>
			  </div>
			</div>
		  </aside>
		</div>
	  </div>
	</main>
  );
}
