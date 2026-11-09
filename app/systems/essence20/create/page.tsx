"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ORIGINS } from "../data/origins";
import { ROLES, SPECTRA } from "../data/roles";
import { INFLUENCES } from "../data/influences";
import { toChosenInfluences, ChosenInfluence } from "../data/influences";
import { PERKS, HANGUPS } from "../data/perks";
import { SKILLS } from "../data/skills";
import { EQUIPMENT } from "../data/equipment";
import { GRID_POWERS } from "../data/grid-powers";
import { ZORDS } from "../data/zords";

const LOCAL_KEY = "realm-nexus:essence20:character";
const LIB_KEY = "realm-nexus:essence20:characters";

interface SavedCharacter {
  name: string;
  concept?: string;
  notes?: string;
  savedAt?: string;
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

  function getEquipmentModifiers(selected?: string[]) {
    if (!selected || selected.length === 0) return [] as { name: string; modifiers?: Record<string, number> | undefined; mechanicsComplete?: boolean }[];
    return selected.map(id => {
      const it = EQUIPMENT.find(e => e.id === id) ?? EQUIPMENT.find(e => e.name === id);
      if (!it) return { name: id, modifiers: undefined, mechanicsComplete: false };
      return { name: it.name, modifiers: it.modifiers, mechanicsComplete: !!it.mechanicsComplete };
    }).filter(Boolean);
  }

  function formatEquipmentModifiersDisplay(list: { name: string; modifiers?: Record<string, number> | undefined; mechanicsComplete?: boolean }[]) {
    if (!list || list.length === 0) return [] as string[];
    return list.map(entry => {
      if (!entry.modifiers || Object.keys(entry.modifiers).length === 0) {
        return `${entry.name}${entry.mechanicsComplete ? '' : ' (unverified)'}: no verified modifiers`;
      }
      const parts = Object.entries(entry.modifiers).map(([k,v]) => `${k} ${v >= 0 ? '+' : ''}${v}`);
      return `${entry.name}${entry.mechanicsComplete ? '' : ' (unverified)'}: ${parts.join(', ')}`;
    });
  }

  function getInfluenceDisplayList(arr?: any[]) {
    if (!arr || arr.length === 0) return [] as string[];
    return arr.map((v) => {
      const id = typeof v === "string" ? v : String(v);
      const found = INFLUENCES.find((i) => i.id === id) ?? INFLUENCES.find((i) => i.name === id);
      return found ? found.name : id;
    });
  }

  function aggregateEquipmentModifiers(selected?: string[]) {
    const entries = getEquipmentModifiers(selected);
    const agg: Record<string, number> = { Toughness: 0, Evasion: 0, Willpower: 0, Cleverness: 0 };
    let foundAny = false;
    entries.forEach(e => {
      if (e.modifiers) {
        Object.entries(e.modifiers).forEach(([k, v]) => {
          if (typeof v === 'number' && k in agg) {
            agg[k] += v as number;
            foundAny = true;
          }
        });
      }
    });
    return { agg, foundAny, entries } as { agg: Record<string, number>; foundAny: boolean; entries: { name: string; modifiers?: Record<string, number> | undefined; mechanicsComplete?: boolean }[] };
  }

  function computeFinalDefensesFromEquipment(essence?: Record<string,string>, selectedEquipment?: string[]) {
    const base = getBaseDefenses(essence);
    const { agg, foundAny } = aggregateEquipmentModifiers(selectedEquipment);
    if (!foundAny) return { final: null as Record<string, number | null> | null, agg };
    const final: Record<string, number | null> = {
      Toughness: base.Toughness !== null ? base.Toughness + (agg.Toughness ?? 0) : null,
      Evasion: base.Evasion !== null ? base.Evasion + (agg.Evasion ?? 0) : null,
      Willpower: base.Willpower !== null ? base.Willpower + (agg.Willpower ?? 0) : null,
      Cleverness: base.Cleverness !== null ? base.Cleverness + (agg.Cleverness ?? 0) : null,
    };
    return { final, agg };
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
        : (typeof raw === "string" ? [raw] : []);
      if (list.length === 0) return;
      const name = getSkillName(id) || id;
      out.push(`${name}: ${list.join(", ")}`);
    });
    return out;
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

  function formatBaseDefensesList(defs: Record<string, number | null>) {
    return Object.entries(defs).map(([k, v]) => `${k}: ${v !== null ? v : '(missing)'}`);
  }

  function normalizePerkValue(val?: any) {
    if (!val) return val;
    if (typeof val === "string") {
      // try id first
      if (PERKS.find((p) => p.id === val)) return val;
      const byName = PERKS.find((p) => p.name === val);
      if (byName) return byName.id;
      return val;
    }
    return val;
  }

  function normalizeHangupValue(val?: any) {
    if (!val) return val;
    if (typeof val === "string") {
      if (HANGUPS.find((h) => h.id === val)) return val;
      const byName = HANGUPS.find((h) => h.name === val);
      if (byName) return byName.id;
      return val;
    }
    return val;
  }

  function getPerkDisplayList(arr?: any[]) {
    if (!arr || arr.length === 0) return [];
    if (PERKS.length === 0) return arr.map(String);
    return arr.map((v) => {
      const id = typeof v === "string" ? v : String(v);
      const found = PERKS.find((p) => p.id === id) ?? PERKS.find((p) => p.name === id);
      return found ? found.name : id;
    });
  }

  function getHangupDisplayList(arr?: any[]) {
    if (!arr || arr.length === 0) return [];
    if (HANGUPS.length === 0) return arr.map(String);
    return arr.map((v) => {
      const id = typeof v === "string" ? v : String(v);
      const found = HANGUPS.find((h) => h.id === id) ?? HANGUPS.find((h) => h.name === id);
      return found ? found.name : id;
    });
  }

  function normalizeRoleValue(val?: any) {
    if (!val || typeof val !== "string") return val;
    if (ROLES.find((r) => r.id === val)) return val;
    const byName = ROLES.find((r) => r.name === val);
    if (byName) return byName.id;
    return val;
  }

  function getRoleDisplay(val?: any) {
    if (!val) return null;
    const byId = ROLES.find((r) => r.id === val);
    if (byId) return byId.name;
    const byName = ROLES.find((r) => r.name === val);
    if (byName) return byName.name;
    return String(val);
  }

  function normalizeSpectrumValue(val?: any) {
    if (!val || typeof val !== "string") return val;
    if (SPECTRA.find((s) => s.id === val)) return val;
    const byName = SPECTRA.find((s) => s.name === val);
    if (byName) return byName.id;
    return val;
  }

  function getSpectrumDisplay(val?: any) {
    if (!val) return null;
    const byId = SPECTRA.find((s) => s.id === val);
    if (byId) return byId.name;
    const byName = SPECTRA.find((s) => s.name === val);
    if (byName) return byName.name;
    return String(val);
  }

export default function Essence20CreatePage() {
  const SKILL_RANK_OPTIONS = ["D2", "D4", "D6", "D8", "D10", "D12"] as const;

  // useSearchParams() can only be used in a true Client Component during runtime.
  // Protect calls by guarding against server-side prerender where it's unavailable.
  let searchParams: URLSearchParams | null = null;
  let editingId: string | null = null;
  try {
    // The hook will throw when used during prerender; wrap in try/catch
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // @ts-ignore
    const sp = useSearchParams();
    searchParams = sp;
    editingId = searchParams ? searchParams.get('charId') : null;
  } catch (e) {
    // running in prerender; leave editingId null
    editingId = null;
  }
  const router = typeof window !== 'undefined' ? useRouter() : (null as any);
  const [name, setName] = useState<string>("");
  const [concept, setConcept] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [manualEquipmentInput, setManualEquipmentInput] = useState<string>("");
  const [manualPowerInput, setManualPowerInput] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [influenceWarning, setInfluenceWarning] = useState<string | null>(null);

  // Load saved draft only in the browser
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedCharacter;
        if (parsed && typeof parsed === "object") {
          if (parsed.name) setName(parsed.name);
          if (parsed.concept) setConcept(parsed.concept);
          if (parsed.notes) setNotes(parsed.notes);
        }
      }
    } catch (e) {
      setError("Failed to read saved character (data may be corrupt).");
    }
  }, []);

  // Convert legacy influences (string[]) into structured influenceDetails in-memory
  useEffect(() => {
    try {
      const current = draft && typeof draft === 'object' ? draft as any : {};
      const legacy = current.influences as any;
      if (legacy && !current.influenceDetails) {
        const structured: ChosenInfluence[] = toChosenInfluences(legacy);
        setDraft((d: any) => ({ ...d, influenceDetails: structured }));
      }
    } catch (e) {
      // non-fatal
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When opening with ?charId=, load from library if present
  useEffect(() => {
    try {
      if (!editingId) return;
      const raw = localStorage.getItem(LIB_KEY);
      if (!raw) return;
      const lib = JSON.parse(raw) as any[];
      if (!Array.isArray(lib)) return;
      const found = lib.find((c) => c.id === editingId);
      if (found) {
        const loadedDraft = found.payload && typeof found.payload === 'object' ? found.payload.draft ?? found.payload : found.payload;
        setDraft(loadedDraft);
        setName(loadedDraft.name ?? '');
        setConcept(loadedDraft.concept ?? '');
        setNotes(loadedDraft.notes ?? '');
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  function clearAlertsLater() {
    window.setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 4000);
  }

  const handleSave = () => {
    setError(null);
    try {
      const payload: SavedCharacter = {
        name: name.trim(),
        concept: concept.trim(),
        notes: notes.trim(),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
      setMessage("Draft saved locally on this device.");
    } catch (e) {
      setError("Failed to save character to localStorage.");
    }
    clearAlertsLater();
  };

  const handleLoad = () => {
    setError(null);
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) {
        setError("No saved draft found in your browser.");
        clearAlertsLater();
        return;
      }
      const parsed = JSON.parse(raw) as SavedCharacter | null;
      if (!parsed) {
        setError("Saved data is invalid.");
        clearAlertsLater();
        return;
      }
      setName(parsed.name ?? "");
      setConcept(parsed.concept ?? "");
      setNotes(parsed.notes ?? "");
      setMessage("Draft loaded from this device.");
    } catch (e) {
      setError("Failed to load saved draft (data may be corrupt).");
    }
    clearAlertsLater();
  };

  const handleClear = () => {
    try {
      localStorage.removeItem(LOCAL_KEY);
      setMessage("Saved draft cleared.");
      setName("");
      setConcept("");
      setNotes("");
    } catch (e) {
      setError("Failed to clear saved data.");
    }
    clearAlertsLater();
  };

  // Wizard steps definition
  const steps = [
    "Character Identity",
    "Origin",
    "Ranger Role",
    "Influences",
    "Perks & Hang-Ups",
    "Essence Scores & Skills",
    "Equipment & Powers",
    "Review & Save",
  ];

  const [stepIndex, setStepIndex] = useState<number>(0);

  // Unified draft state for the wizard
  const [draft, setDraft] = useState<Partial<SavedCharacter & {
    origin?: string;
    role?: string;
    spectrum?: string;
    influences?: string[];
    perks?: string[];
    hangups?: string[];
    essence?: Record<string, string>;
    skillRanks?: Record<string, string>;
    skillSpecializations?: Record<string, string[]>;
    skills?: string[];
    equipment?: string[];
    powers?: string[];
    zords?: string[];
    influenceDetails?: ChosenInfluence[];
  }>>({ name, concept, notes });

  // Keep local name/concept/notes in sync with draft (for compatibility)
 useEffect(() => {
   setDraft((d) => ({ ...d, name, concept, notes }));
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 
 // Roll one Background Bond for a selected Influence
 function rollBackgroundBond(influenceIndex: number) {
   const selectedInfluences = draft.influenceDetails ?? [];
   const selectedInfluence = selectedInfluences[influenceIndex];

   if (!selectedInfluence) return;

   const influenceData = INFLUENCES.find(
     (item) => item.id === selectedInfluence.id
   );

   const bonds = influenceData?.bondsTable;

   if (!bonds || bonds.length !== 12) return;

   const rolledBond = bonds[Math.floor(Math.random() * 12)];

   setDraft((current) => {
     const details = [...(current.influenceDetails ?? [])];
     const existing = details[influenceIndex];

     if (!existing) return current;

     const existingBonds = existing.bonds ?? [];

     if (existingBonds.includes(rolledBond)) {
       return current;
     }

     details[influenceIndex] = {
       ...existing,
       bonds: [...existingBonds, rolledBond],
     };

     return {
       ...current,
       influenceDetails: details,
     };
   });
 }


  // Helper to update draft fields
  function updateDraft<K extends string>(key: K, value: any) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (key === "name") setName(value ?? "");
    if (key === "concept") setConcept(value ?? "");
    if (key === "notes") setNotes(value ?? "");
  }

  function hasRequiredHangups(d: any) {
    const chosen: ChosenInfluence[] = Array.isArray(d.influenceDetails) && d.influenceDetails.length > 0 ? d.influenceDetails : toChosenInfluences(d.influences as any[]);
    for (let i = 1; i <= 2; i++) {
      if (i < chosen.length) {
        const hang = chosen[i].hangup;
        if (!hang || String(hang).toString().trim() === "") return false;
      }
    }
    return true;
  }

  // Basic validation: require a name on identity step and review
  function validateCurrentStep(index = stepIndex) {
    if (index === 0) {
      return Boolean((draft.name ?? "").toString().trim());
    }
    // Enforce at least one Influence on the Influences step
    if (index === 3) {
      const list = Array.isArray(draft.influences) ? (draft.influences as string[]) : [];
      if (list.length < 1) return false;
      return true;
    }

    // Enforce required Hang-Ups on the Perks & Hang-Ups step for 2nd and 3rd influences
    if (index === 4) {
      // hasRequiredHangups checks indexes 1 and 2 only
      return hasRequiredHangups(draft);
    }
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      // If the current step is the Influences step, show a specific message
      if (stepIndex === 3) {
        setError("Please choose at least one Influence to continue.");
      } else if (stepIndex === 4) {
        setError("Please enter a Hang-Up for each additional Influence before continuing.");
      } else {
        setError("Please complete required fields for this step.");
      }
      clearAlertsLater();
      return;
    }
    setError(null);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  // Override save/load to store the full draft object while remaining compatible
  const handleSaveFull = () => {
    setError(null);
    try {
      const payload = {
        name: (draft.name ?? "").toString().trim(),
        concept: (draft.concept ?? "").toString().trim(),
        notes: (draft.notes ?? "").toString().trim(),
        draft,
        savedAt: new Date().toISOString(),
      };

      // Write into the library. Read existing library, update or append entry.
      let lib: any[] = [];
      try {
        const raw = localStorage.getItem(LIB_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) lib = parsed;
        }
      } catch (e) {
        // ignore and replace
        lib = [];
      }

      // Generate stable id
      const makeId = () => {
        try {
          // @ts-ignore - window.crypto exists in browser
          return (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) || (`id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`);
        } catch (e) {
          return `id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
        }
      };

      if (editingId) {
        const idx = lib.findIndex((c) => c.id === editingId);
        if (idx >= 0) {
          lib[idx] = { ...lib[idx], name: payload.name || lib[idx].name, payload };
        } else {
          lib.push({ id: editingId, name: payload.name || 'Unnamed', payload });
        }
      } else {
        const id = makeId();
        lib.push({ id, name: payload.name || 'Unnamed', payload });
      }

      // Attempt to write library first
      localStorage.setItem(LIB_KEY, JSON.stringify(lib));

      // Also update legacy single-key for compatibility
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
      } catch (e) {
        // non-fatal
      }

      setMessage("Draft saved locally on this device.");
    } catch (e) {
      setError("Failed to save character to localStorage.");
    }
    clearAlertsLater();
  };

  const handleLoadFull = () => {
    setError(null);
    try {
      // If editingId is present, prefer loading from the library
      if (editingId) {
        try {
          const rawLib = localStorage.getItem(LIB_KEY);
          if (rawLib) {
            const lib = JSON.parse(rawLib) as any[];
            if (Array.isArray(lib)) {
              const found = lib.find((c) => c.id === editingId);
              if (found) {
                const loadedDraft = found.payload && typeof found.payload === 'object' ? (found.payload.draft ?? found.payload) : found.payload;
                setDraft(loadedDraft);
                setName(loadedDraft.name ?? "");
                setConcept(loadedDraft.concept ?? "");
                setNotes(loadedDraft.notes ?? "");
                setMessage('Draft loaded from library.');
                clearAlertsLater();
                return;
              }
            }
          }
        } catch (e) {
          // fall through to legacy load
        }
      }

      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) {
        setError("No saved draft found in your browser.");
        clearAlertsLater();
        return;
      }
      const parsed = JSON.parse(raw) as any;
      if (!parsed) {
        setError("Saved data is invalid.");
        clearAlertsLater();
        return;
      }
      // Merge saved format compatibly
      const loadedDraft = parsed.draft ?? {
        name: parsed.name,
        concept: parsed.concept,
        notes: parsed.notes,
      };
      // Normalize origin/role/spectrum fields if present (convert names to ids when possible)
      if (loadedDraft.origin) {
        loadedDraft.origin = normalizeOriginValue(loadedDraft.origin);
      }
      if (loadedDraft.role) {
        loadedDraft.role = normalizeRoleValue(loadedDraft.role);
      }
      if (loadedDraft.spectrum) {
        loadedDraft.spectrum = normalizeSpectrumValue(loadedDraft.spectrum);
      }
      // Normalize influences: accept array or comma-separated string from older saves
      if (loadedDraft.influences && typeof loadedDraft.influences === "string") {
        loadedDraft.influences = (loadedDraft.influences as string).split(",").map((s) => s.trim()).filter(Boolean);
      }
      setDraft(loadedDraft);
      setName(loadedDraft.name ?? "");
      setConcept(loadedDraft.concept ?? "");
      setNotes(loadedDraft.notes ?? "");
      setMessage("Draft loaded from this device.");
    } catch (e) {
      setError("Failed to load saved draft (data may be corrupt).");
    }
    clearAlertsLater();
  };

  const handleClearFull = () => {
    try {
      localStorage.removeItem(LOCAL_KEY);
      setMessage("Saved draft cleared.");
      setDraft({});
      setName("");
      setConcept("");
      setNotes("");
    } catch (e) {
      setError("Failed to clear saved data.");
    }
    clearAlertsLater();
  };

  // Render step content
  function normalizeOriginValue(val?: any) {
    if (!val || typeof val !== "string") return val;
    // If it's already an id, return it
    if (ORIGINS.find((o) => o.id === val)) return val;
    // If it matches a display name, return the id
    const byName = ORIGINS.find((o) => o.name === val);
    if (byName) return byName.id;
    return val;
  }

  function getOriginDisplay(val?: any) {
    if (!val) return null;
    const byId = ORIGINS.find((o) => o.id === val);
    if (byId) return byId.name;
    const byName = ORIGINS.find((o) => o.name === val);
    if (byName) return byName.name;
    return String(val);
  }

  function getSelectedRole() {
    const val = draft.role;
    if (!val) return null;
    return ROLES.find((r) => r.id === val) ?? ROLES.find((r) => r.name === val) ?? null;
  }

  function getRoleFeatureName(role: any, featureId?: string) {
    if (!role || !featureId) return featureId ?? "";
    const found = (role.roleRules?.features ?? []).find((f: any) => f.id === featureId);
    return found?.name ?? featureId;
  }

  function togglePowerSelection(label: string) {
    const current = Array.isArray(draft.powers) ? [...(draft.powers as string[])] : [];
    const idx = current.indexOf(label);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(label);
    updateDraft("powers", current);
  }

  function renderStepContent() {
    switch (stepIndex) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Identity is required. Enter a name and short concept for your hero.</p>
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">Character Name *</label>
              <input id="name" name="name" value={draft.name ?? ""} onChange={(e) => updateDraft("name", e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none" placeholder="Enter character name" />
            </div>
            <div>
              <label htmlFor="concept" className="mb-2 block text-sm font-medium text-slate-200">Concept</label>
              <input id="concept" name="concept" value={draft.concept ?? ""} onChange={(e) => updateDraft("concept", e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none" placeholder="Short concept like 'Red Ranger / Martial Artist'" />
            </div>
            <div>
              <label htmlFor="notes" className="mb-2 block text-sm font-medium text-slate-200">Notes</label>
              <textarea id="notes" name="notes" value={draft.notes ?? ""} onChange={(e) => updateDraft("notes", e.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none" placeholder="Optional notes" />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Origin describes where your character came from. Options shown are developer-provided entries; mechanics marked "incomplete" are placeholders and not official rules.</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {ORIGINS.map((o) => {
                const selected = draft.origin === o.id || draft.origin === o.name;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      // store origin as stable id (draft.origin). Keep compatibility by
                      // resolving names on load; preview will display the origin name.
                      updateDraft("origin", o.id);
                    }}
                    className={`text-left rounded-2xl border p-4 transition ${selected ? "border-violet-400 bg-violet-500/5" : "border-white/10 bg-white/[0.01]"}`}
                    aria-pressed={selected}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{o.name}</div>
                        {o.description && <div className="mt-1 text-xs text-slate-400">{o.description}</div>}
                      </div>
                      <div className="ml-4 text-xs">
                        {!o.mechanicsComplete ? (
                          <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-300">Incomplete</span>
                        ) : (
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-green-300">Complete</span>
                        )}

                      </div>
                    </div>

                    {/* show known mechanics without inventing missing details */}
                    <div className="mt-3 text-xs text-slate-300">
                      {o.startingHealth !== undefined && <div>Starting Health: {o.startingHealth}</div>}
                      {Array.isArray((o as any).essenceIncreaseOptions) && (o as any).essenceIncreaseOptions.length > 0 && (
                        <div>Essence increase options: {((o as any).essenceIncreaseOptions as string[]).join(", ")}</div>
                      )}
                      {Array.isArray((o as any).bonusSkillOptions) && (o as any).bonusSkillOptions.length > 0 && (
                        <div>Bonus skill options: {((o as any).bonusSkillOptions as string[]).join(", ")}</div>
                      )}
                      {(o as any).groundMovement !== undefined && <div>Ground Movement: {(o as any).groundMovement} ft</div>}
                      {(o as any).languagesRule && <div>Languages: {(o as any).languagesRule}</div>}
                      {(o as any).originBenefitName && <div>Origin Benefit: {(o as any).originBenefitName}</div>}
                      {(o as any).originBenefitSummary && <div>{(o as any).originBenefitSummary}</div>}
                      {o.statMods && Object.keys(o.statMods).length > 0 && (
                        <div>Stat mods: {Object.entries(o.statMods).map(([k,v]) => `${k} ${v>0?`+${v}`:`${v}`}`).join(", ")}</div>
                      )}
                      {o.notes && <div className="mt-1 italic">{o.notes}</div>}
                    </div>
                  </button>
                );
              })}
            </div>

            {(() => {
              const selectedRole = getSelectedRole();
              if (!selectedRole?.roleRules) return null;
              const rr = selectedRole.roleRules;
              return (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                  <div className="text-sm font-semibold text-white">{selectedRole.name} Role Details</div>
                  {Array.isArray(rr.startingBenefits) && rr.startingBenefits.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400">Starting Benefits</div>
                      <ul className="mt-1 list-disc pl-5 text-xs text-slate-300 space-y-1">
                        {rr.startingBenefits.map((b) => (
                          <li key={b.id}>{b.name}{b.description ? `: ${b.description}` : ""}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(rr.skillGrants) && rr.skillGrants.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400">Starting Skill Grants</div>
                      <ul className="mt-1 list-disc pl-5 text-xs text-slate-300 space-y-1">
                        {rr.skillGrants.map((g) => (
                          <li key={g.id}>{g.skillName ?? g.id}{g.notes ? `: ${g.notes}` : ""}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(rr.startingEquipment) && rr.startingEquipment.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400">Starting Equipment</div>
                      <ul className="mt-1 list-disc pl-5 text-xs text-slate-300 space-y-1">
                        {rr.startingEquipment.map((e) => (
                          <li key={e.id}>{e.itemName ?? e.id}{e.quantity ? ` x${e.quantity}` : ""}{e.notes ? ` (${e.notes})` : ""}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(rr.progression) && rr.progression.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400">Role Progression (Level Features)</div>
                      <div className="mt-1 grid gap-1 text-xs text-slate-300 sm:grid-cols-2">
                        {rr.progression.map((p) => {
                          const labels = Array.isArray(p.featureIds) && p.featureIds.length > 0
                            ? p.featureIds.map((id) => getRoleFeatureName(selectedRole, id)).join(", ")
                            : "(no listed feature)";
                          return <div key={p.level}><span className="text-slate-400">Lv {p.level}:</span> {labels}</div>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Pick a role (color) for your Ranger. Roles and spectra are developer-provided; mechanics are incomplete unless marked complete.</p>

            <div className="flex gap-3 mb-3 flex-wrap">
              {SPECTRA.map((s) => {
                const active = draft.spectrum === s.id || draft.spectrum === s.name;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateDraft("spectrum", s.id)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${active ? "bg-violet-500 text-black" : "bg-white/3 text-slate-200"}`}
                  >
                    {s.name}
                    {!s.mechanicsComplete && <span className="ml-2 text-xs text-yellow-300">· incomplete</span>}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {ROLES.filter(r => !draft.spectrum || r.spectrumId === draft.spectrum || r.spectrumId === undefined).map((r) => {
                const selected = draft.role === r.id || draft.role === r.name;
                const hasSpectrumShift = Array.isArray(draft.perks) && (draft.perks as string[]).includes("spectrum-shift");
                const requiresSpectrumShift = r.id === "white";
                const roleBlocked = requiresSpectrumShift && !hasSpectrumShift;
                return (
                  <button key={r.id} type="button" disabled={roleBlocked} onClick={() => updateDraft("role", r.id)} aria-pressed={selected} className={`text-left rounded-2xl border p-4 transition disabled:opacity-50 ${selected ? "border-violet-400 bg-violet-500/5" : "border-white/10 bg-white/[0.01]"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{r.name}</div>
                        {r.description && <div className="mt-1 text-xs text-slate-400">{r.description}</div>}
                        {roleBlocked && <div className="mt-1 text-xs text-yellow-300">Requires Spectrum Shift Perk.</div>}
                      </div>
                      <div className="ml-4 text-xs">
                        {!r.mechanicsComplete ? (
                          <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-300">Incomplete</span>
                        ) : (
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-green-300">Complete</span>
                        )}
                      </div>
                    </div>
                    {r.notes && <div className="mt-3 text-xs text-slate-300 italic">{r.notes}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Influences are people, groups, or ideas that shape your character. Select any that apply. Listed mechanics are unverified unless marked complete.</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {INFLUENCES.map((inf) => {
                const selected = Array.isArray(draft.influences) && (draft.influences as string[]).includes(inf.id);
                return (
                  <button
                    key={inf.id}
                    type="button"
                        onClick={() => {
                          const current = Array.isArray(draft.influences) ? [...(draft.influences as string[])] : [];
                          const idx = current.indexOf(inf.id);
                          if (idx >= 0) {
                            current.splice(idx, 1);
                          } else {
                            // Prevent selecting more than 3 influences
                            if (current.length >= 3) {
                              setInfluenceWarning("You may select up to 3 Influences. Remove one before adding another.");
                              // clear after a short delay
                              window.setTimeout(() => setInfluenceWarning(null), 4000);
                              return;
                            }
                            current.push(inf.id);
                            // clear any previous warning
                            setInfluenceWarning(null);
                            // If we were showing the specific influences-step error, clear it when they select
                        if (error === "Please choose at least one Influence to continue.") {
                          setError(null);
                        }
                      }
                      // Also maintain influenceDetails alignment by id: preserve any existing hangups/options for ids that remain
                      try {
                        const prevDetails: ChosenInfluence[] = Array.isArray(draft.influenceDetails) ? (draft.influenceDetails as ChosenInfluence[]) : toChosenInfluences(draft.influences as any[]);
                        const newDetails: ChosenInfluence[] = current.map((id) => {
                          const found = prevDetails.find((p) => p.id === id);
                          return found ? { ...found } : { id };
                        });
                        updateDraft("influences", current);
                        updateDraft("influenceDetails", newDetails);
                      } catch (e) {
                        // fallback: just update influences
                        updateDraft("influences", current);
                      }
                        }}
                    aria-pressed={selected}
                    className={`text-left rounded-2xl border p-4 transition ${selected ? "border-violet-400 bg-violet-500/5" : "border-white/10 bg-white/[0.01]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{inf.name}</div>
                        {inf.description && <div className="mt-1 text-xs text-slate-400">{inf.description}</div>}
                      </div>
                      <div className="ml-4 text-xs">
                        {!inf.mechanicsComplete ? (
                          <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-300">Incomplete</span>
                        ) : (
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-green-300">Complete</span>
                        )}
                      </div>
                    </div>
                    {inf.notes && <div className="mt-3 text-xs text-slate-300 italic">{inf.notes}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        // Render required per-Influence Hang-Up inputs (2nd and 3rd selected influences)
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Perks & Hang-Ups represent narrative strengths and complications. Select any that apply. Mechanics flagged "Incomplete" are unverified. Additional Hang-Ups are required for the 2nd and 3rd selected Influences; provide an official Hang-Up choice if available, otherwise enter a custom Hang-Up description.</p>

            {/* Build ordered chosen influences from draft.influenceDetails or draft.influences */}
            {(() => {
              const chosen: ChosenInfluence[] = (Array.isArray(draft.influenceDetails) && (draft.influenceDetails as ChosenInfluence[]).length > 0)
                ? (draft.influenceDetails as ChosenInfluence[])
                : toChosenInfluences(draft.influences as any[]);
              return (
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 mb-2">Influence Hang-Ups</h4>
                  <div className="space-y-3">
                    {chosen.map((ci, idx) => {
                  const inf = INFLUENCES.find(i => i.id === ci.id) || { id: ci.id, name: ci.id } as any;
                  const requiresHangup = idx >= 1; // 2nd and 3rd
                  return (
                    <div key={ci.id} className="rounded-2xl border p-4 bg-white/[0.01]">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold text-white">{inf.name}</div>
                              <div className="mt-1 text-xs text-slate-400">{inf.description ?? ''}</div>
                              {inf.perk && (
                                <div className="mt-3 rounded-md border border-white/6 bg-white/2 p-3 text-sm text-slate-300">
                                  <div className="font-medium text-slate-200">Influence Perk</div>
                                  <div className="mt-1 text-sm">{inf.perk}</div>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">{requiresHangup ? <span className="text-yellow-300">Requires Hang-Up</span> : <span className="text-slate-500">No Hang-Up required</span>}</div>
                          </div>
                          


                          {requiresHangup ? (
                            <div className="mt-3">
                              {HANGUPS && HANGUPS.length > 0 ? (
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {HANGUPS.map((h) => {
                                    const selected = (ci.hangup && ci.hangup === h.id) || false;
                                    return (
                                      <button key={h.id} type="button" onClick={() => {
                                        const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                        const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                        target.hangup = h.id;
                                        current[idx] = target;
                                        updateDraft('influenceDetails', current);
                                        if (error && error.includes('Hang-Up')) setError(null);
                                      }} aria-pressed={selected} className={`text-left rounded-2xl border p-3 transition ${selected ? 'border-violet-400 bg-violet-500/5' : 'border-white/10 bg-white/[0.01]'}`}>
                                        <div className="text-sm font-semibold text-white">{h.name}</div>
                                        {h.description && <div className="mt-1 text-xs text-slate-400">{h.description}</div>}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div>
                                  <label className="text-sm text-slate-300">Custom Hang-Up (no official options available)</label>
                                  <input value={ci.hangup ?? ''} onChange={(e) => {
                                    const val = e.target.value;
                                    const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                    const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                    target.hangup = val || undefined;
                                    target.options = { ...(target.options ?? {}), hangupIsCustom: val ? 'true' : undefined };
                                    current[idx] = target;
                                    updateDraft('influenceDetails', current);
                                    if (error && error.includes('Hang-Up')) setError(null);
                                  }} placeholder="Describe the character's hang-up (short)" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-3 py-2 text-white mt-2" />
                                </div>
                              )}
                            </div>
                          ) : null}

                          {/* GM-approved customization (optional) */}
                          <div className="mt-3">
                            <div className="text-sm font-semibold text-slate-200">GM-Approved Customization</div>
                            <div className="mt-2 text-xs text-slate-400">If your GM has approved a replacement Perk or Hang-Up for this Influence, mark it here and record the agreed text. This is player-entered, GM-approved text and does not replace official rules text in the system.</div>
                            <div className="mt-2 flex items-center gap-3">
                              <input id={`gm-custom-${ci.id}`} type="checkbox" checked={((ci.options && (ci.options as any).gmCustomizationApproved) as string) === 'true'} onChange={(e) => {
                                const checked = e.target.checked;
                                const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                target.options = { ...(target.options ?? {}), gmCustomizationApproved: checked ? 'true' : undefined };
                                if (!checked) {
                                  // clear any custom description when unchecked
                                  target.options = { ...(target.options ?? {}), gmCustomizationDescription: undefined, gmCustomizationApproved: undefined };
                                }
                                current[idx] = target;
                                updateDraft('influenceDetails', current);
                              }} className="h-4 w-4" />
                              <label htmlFor={`gm-custom-${ci.id}`} className="text-sm text-slate-300">GM-Approved Customization</label>
                            </div>
                            {(((ci.options && (ci.options as any).gmCustomizationApproved) as string) === 'true') && (
                              <div className="mt-2">
                                <label className="text-sm text-slate-300">Replacement Perk / Hang-Up (GM-approved)</label>
                                <textarea value={((ci.options && (ci.options as any).gmCustomizationDescription) as string) ?? ''} onChange={(e) => {
                                  const val = e.target.value;
                                  const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                  const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                  target.options = { ...(target.options ?? {}), gmCustomizationDescription: val || undefined, gmCustomizationApproved: 'true' };
                                  current[idx] = target;
                                  updateDraft('influenceDetails', current);
                                }} placeholder="Describe the replacement Perk or Hang-Up as approved by the GM" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-3 py-2 text-white mt-2 h-20" />
                              </div>
                            )}
</div>
                          {/* Background Bonds for this Influence */}
                          <div className="mt-3">
                            <div className="text-sm font-semibold text-slate-200">Background Bonds</div>
                            {inf.bondsTable && Array.isArray(inf.bondsTable) && inf.bondsTable.length === 12 && inf.bondsComplete ? (
                              <div className="mt-2 space-y-2">
                                <div className="text-xs text-slate-400">This Influence has a complete d12 Background Bond table. You may choose any number of bonds or roll one at random.</div>
                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                  {inf.bondsTable.map((bTxt: string, bIdx: number) => {
                                    const chosenBonds = Array.isArray(ci.bonds) ? ci.bonds : [];
                                    const selectedBond = chosenBonds.includes(bTxt);
                                    return (
                                      <button key={bIdx} type="button" onClick={() => {
                                        const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                        const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                        target.bonds = Array.isArray(target.bonds) ? [...target.bonds] : [];
                                        if (selectedBond) {
                                          target.bonds = target.bonds.filter(x => x !== bTxt);
                                        } else {
                                          if (!target.bonds.includes(bTxt)) target.bonds.push(bTxt);
                                        }
                                        current[idx] = target;
                                        updateDraft('influenceDetails', current);
                                      }} aria-pressed={selectedBond} className={`text-left rounded-2xl border p-3 transition ${selectedBond ? 'border-violet-400 bg-violet-500/5' : 'border-white/10 bg-white/[0.01]'}`}>
                                        <div className="text-sm">{bIdx + 1}. {bTxt}</div>
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="mt-2">
                                  <button type="button" onClick={() => {
                                    const table = inf.bondsTable as string[];
                                    const roll = Math.floor(Math.random() * 12);
                                    const pick = table[roll];
                                    const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                    const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                    target.bonds = Array.isArray(target.bonds) ? [...target.bonds] : [];
                                    if (!target.bonds.includes(pick)) target.bonds.push(pick);
                                    current[idx] = target;
                                    updateDraft('influenceDetails', current);
                                  }} className="rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold">Roll d12</button>
                                </div>

                                {/* Custom bond entry for this influence (optional) */}
                                <div className="mt-3">
                                  <div className="text-xs text-slate-300">Custom Background Bond (optional)</div>
                                  <div className="mt-2 flex gap-2">
                                    <input value={((ci.options && (ci.options as any).customBondDraft) as string) ?? ''} onChange={(e) => {
                                      const val = e.target.value;
                                      const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                      const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                      target.options = { ...(target.options ?? {}), customBondDraft: val };
                                      current[idx] = target;
                                      updateDraft('influenceDetails', current);
                                    }} placeholder="Enter a custom bond" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-3 py-2 text-white" />
                                    <button type="button" onClick={() => {
                                      const draftVal = String(((ci.options && (ci.options as any).customBondDraft) as string) ?? '').trim();
                                      if (!draftVal) return; // prevent blank or whitespace-only
                                      const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                      const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                      target.bonds = Array.isArray(target.bonds) ? [...target.bonds] : [];
                                      // prevent duplicates (official or custom)
                                      if (!target.bonds.includes(draftVal)) {
                                        target.bonds.push(draftVal);
                                      }
                                      // clear draft input
                                      target.options = { ...(target.options ?? {}), customBondDraft: undefined };
                                      current[idx] = target;
                                      updateDraft('influenceDetails', current);
                                    }} className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold">Add</button>
                                  </div>

                                  {/* Show any custom bonds (not part of official table) with remove controls */}
                                  {Array.isArray(ci.bonds) && ci.bonds.filter(b => !(inf.bondsTable ?? []).includes(b)).length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      <div className="text-xs text-slate-400">Custom Bonds</div>
                                      <div className="grid gap-2 sm:grid-cols-2 mt-2">
                                        {ci.bonds.filter(b => !(inf.bondsTable ?? []).includes(b)).map((cb, cidx) => (
                                          <div key={cidx} className="flex items-center justify-between rounded-2xl border p-3 bg-white/[0.01]">
                                            <div className="text-sm">{cb}</div>
                                            <button type="button" onClick={() => {
                                              const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                              const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                              target.bonds = Array.isArray(target.bonds) ? target.bonds.filter(x => x !== cb) : [];
                                              current[idx] = target;
                                              updateDraft('influenceDetails', current);
                                            }} className="ml-3 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold">Remove</button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                </div>
                              </div>
                            ) : (
                              <div className="mt-2">
                                <div className="text-xs text-yellow-300">Background Bond table incomplete or unavailable for this Influence.</div>
                                <div className="mt-2">
                                  <label className="text-sm text-slate-300">Add a custom Background Bond (optional)</label>
                                  <textarea value={(ci.bonds && ci.bonds.join('\n')) ?? ''} onChange={(e) => {
                                    const val = e.target.value;
                                    const parts = val.split('\n').map(s => s.trim()).filter(Boolean);
                                    const current = Array.isArray(draft.influenceDetails) ? [...(draft.influenceDetails as ChosenInfluence[])] : toChosenInfluences(draft.influences as any[]);
                                    const target = current[idx] || { id: ci.id } as ChosenInfluence;
                                    target.bonds = parts.length > 0 ? parts : undefined;
                                    current[idx] = target;
                                    updateDraft('influenceDetails', current);
                                  }} placeholder="Enter custom bonds, one per line" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-3 py-2 text-white mt-2 h-24" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              );
            })()}

            {/* Keep global Perks/Hang-Ups selector for optional extras (unchanged) */}
            {PERKS && PERKS.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-2">Perks</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PERKS.map((p) => {
                    const selected = Array.isArray(draft.perks) && (draft.perks as string[]).includes(p.id);
                    return (
                      <button key={p.id} type="button" onClick={() => {
                        const current = Array.isArray(draft.perks) ? [...(draft.perks as string[])] : [];
                        const idx = current.indexOf(p.id);
                        if (idx >= 0) current.splice(idx, 1); else current.push(p.id);
                        updateDraft("perks", current);
                      }} aria-pressed={selected} className={`text-left rounded-2xl border p-4 transition ${selected ? "border-violet-400 bg-violet-500/5" : "border-white/10 bg-white/[0.01]"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">{p.name}</div>
                            {p.description && <div className="mt-1 text-xs text-slate-400">{p.description}</div>}
                          </div>
                          <div className="ml-4 text-xs">
                            {!p.mechanicsComplete ? (<span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-300">Incomplete</span>) : (<span className="rounded-full bg-green-500/10 px-2 py-1 text-green-300">Complete</span>)}
                          </div>
                        </div>
                        {p.notes && <div className="mt-3 text-xs text-slate-300 italic">{p.notes}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        );

      case 5:
        // Render four core Essence scores as individually labeled controls.
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Essence scores (Strength, Speed, Smarts, Social). Enter numeric values or short manual labels. Rules for starting scores and advancement are not enforced here.</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {['Strength','Speed','Smarts','Social'].map((statKey) => {
                const current = (draft.essence && (draft.essence as Record<string,string>)[statKey]) ?? "";
                const isNumeric = current !== "" && /^-?\d+$/.test(String(current));
                return (
                  <div key={statKey} className="space-y-1">
                    <label className="text-xs text-slate-400">{statKey}</label>
                    <input
                      value={current}
                      onChange={(e) => {
                        const v = e.target.value ?? "";
                        const clone: Record<string,string> = { ...(draft.essence as Record<string,string> ?? {}) };
                        if (v.trim() === "") {
                          delete clone[statKey];
                        } else {
                          clone[statKey] = v.trim();
                        }
                        updateDraft('essence', clone);
                      }}
                      placeholder="Enter number or label"
                      className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-4 py-3 text-white"
                    />
                    {current !== "" && !isNumeric && (
                      <div className="text-xs text-yellow-300">Manual (non-numeric) value saved as entered.</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              <label className="text-xs text-slate-400">Skills</label>
              {SKILLS && SKILLS.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 mt-2">
                  {['Strength','Speed','Smarts','Social'].map((ess) => {
                    const group = SKILLS.filter(s => s.associated === ess);
                    if (group.length === 0) return null;
                    return (
                      <div key={ess} className="space-y-2">
                        <div className="text-xs font-semibold text-slate-200">{ess}</div>
                        <div className="grid gap-2">
                          {group.map((sk) => {
                            const currentRank = (draft.skillRanks && (draft.skillRanks as Record<string,string>)[sk.id]) ?? "";
                            const isStandardRank = SKILL_RANK_OPTIONS.includes(currentRank as (typeof SKILL_RANK_OPTIONS)[number]);
                            const hasLegacyRank = currentRank !== "" && !isStandardRank;
                            const canShowSpecializations = sk.allowsSpecializations !== false
                              && Array.isArray(sk.specializations)
                              && sk.specializations.length > 0
                              && isStandardRank;
                            const selectedSpecializationsRaw = (draft.skillSpecializations as Record<string, unknown> | undefined)?.[sk.id];
                            const selectedSpecializations = Array.isArray(selectedSpecializationsRaw)
                              ? selectedSpecializationsRaw.map((v) => String(v))
                              : [];
                            return (
                              <div key={sk.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/6 p-3">
                                <div className="flex-1">
                                  <div className="text-sm text-white">{sk.name}</div>
                                  {sk.notes && <div className="text-xs text-slate-400">{sk.notes}</div>}
                                  {hasLegacyRank && (
                                    <div className="mt-1 text-xs text-yellow-300">
                                      Legacy rank value detected: "{currentRank}". It is preserved until you choose a new rank.
                                    </div>
                                  )}
                                  {canShowSpecializations && (
                                    <div className="mt-2">
                                      <div className="text-xs text-slate-300">Specializations</div>
                                      <div className="mt-1 flex flex-wrap gap-2">
                                        {sk.specializations!.map((sp) => {
                                          const checked = selectedSpecializations.includes(sp);
                                          return (
                                            <label key={sp} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-200">
                                              <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) => {
                                                  const mapClone: Record<string, string[]> = { ...(draft.skillSpecializations as Record<string, string[]> ?? {}) };
                                                  const current = Array.isArray(mapClone[sk.id]) ? [...mapClone[sk.id]] : [];
                                                  if (e.target.checked) {
                                                    if (!current.includes(sp)) current.push(sp);
                                                  } else {
                                                    const idx = current.indexOf(sp);
                                                    if (idx >= 0) current.splice(idx, 1);
                                                  }
                                                  if (current.length === 0) delete mapClone[sk.id];
                                                  else mapClone[sk.id] = current;
                                                  updateDraft('skillSpecializations', mapClone);
                                                }}
                                              />
                                              <span>{sp}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="w-28">
                                  <select value={currentRank} onChange={(e) => {
                                    const v = (e.target.value ?? "").trim();
                                    const clone: Record<string,string> = { ...(draft.skillRanks as Record<string,string> ?? {}) };
                                    if (v.trim() === "") delete clone[sk.id]; else clone[sk.id] = v.trim();
                                    updateDraft('skillRanks', clone);
                                  }} className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-2 py-1 text-white text-sm">
                                    <option value="">Unassigned</option>
                                    {SKILL_RANK_OPTIONS.map((rank) => (
                                      <option key={rank} value={rank}>{rank}</option>
                                    ))}
                                    {hasLegacyRank && (
                                      <option value={currentRank}>Legacy: {currentRank}</option>
                                    )}
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <input value={(draft.skills ?? []).join(', ')} onChange={(e) => updateDraft('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Comma-separated example skills" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-4 py-3 text-white mt-2" />
              )}
            </div>
          </div>
        );

      case 6:
        const selectedRole = getSelectedRole();
        const selectedRoleId = selectedRole?.id;
        const selectedPowers = Array.isArray(draft.powers) ? (draft.powers as string[]) : [];
        const selectedZords = Array.isArray(draft.zords) ? (draft.zords as string[]) : [];
        const powerSuggestions = (selectedRole?.roleRules?.features ?? [])
          .filter((f: any) => {
            const t = `${f.name ?? ""} ${f.id ?? ""}`.toLowerCase();
            return t.includes("grid power") || t.includes("zord");
          })
          .map((f: any) => f.name)
          .filter((v: string, idx: number, arr: string[]) => Boolean(v) && arr.indexOf(v) === idx);
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Select equipment from verified entries and save powers. You can also add custom entries for items not yet represented in structured data.</p>
            {EQUIPMENT && EQUIPMENT.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {EQUIPMENT.map((it) => {
                  const selected = Array.isArray(draft.equipment) && (draft.equipment as string[]).includes(it.id);
                  return (
                    <button key={it.id} type="button" onClick={() => {
                      const current = Array.isArray(draft.equipment) ? [...(draft.equipment as string[])] : [];
                      const idx = current.indexOf(it.id);
                      if (idx >= 0) current.splice(idx, 1); else current.push(it.id);
                      updateDraft('equipment', current);
                    }} aria-pressed={selected} className={`text-left rounded-2xl border p-4 transition ${selected ? "border-violet-400 bg-violet-500/5" : "border-white/10 bg-white/[0.01]"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="break-words text-sm font-semibold text-white">{it.name}</div>
                          {it.description && <div className="mt-1 whitespace-normal break-words text-xs leading-relaxed text-slate-400">{it.description}</div>}
                        </div>
                        <div className="shrink-0 text-xs">
                          {!it.mechanicsComplete ? (<span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-300">Incomplete</span>) : (<span className="rounded-full bg-green-500/10 px-2 py-1 text-green-300">Complete</span>)}
                        </div>
                      </div>
                      {it.notes && <div className="mt-3 text-xs text-slate-300 italic">{it.notes}</div>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input value={(draft.equipment ?? []).join(", ")} onChange={(e) => updateDraft("equipment", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Comma-separated example equipment" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-4 py-3 text-white" />
            )}

            <div>
              <div className="text-xs text-slate-400">Add equipment manually</div>
              <div className="mt-2 flex gap-2">
                <input value={manualEquipmentInput} onChange={(e) => setManualEquipmentInput(e.target.value)} placeholder="Type equipment name" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-3 py-2 text-white" />
                <button type="button" onClick={() => {
                  const val = manualEquipmentInput.trim();
                  if (!val) return;
                  const current = Array.isArray(draft.equipment) ? [...(draft.equipment as string[])] : [];
                  if (!current.includes(val)) current.push(val);
                  updateDraft("equipment", current);
                  setManualEquipmentInput("");
                }} className="rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-black">Add</button>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Structured Grid Powers</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {GRID_POWERS.map((gp) => {
                  const selected = selectedPowers.includes(gp.id);
                  const roleRestricted = Array.isArray(gp.associatedRoles) && gp.associatedRoles.length > 0;
                  const roleAllowed = !roleRestricted || (selectedRoleId ? gp.associatedRoles!.includes(selectedRoleId) : false);
                  const disabled = roleRestricted && !roleAllowed;
                  return (
                    <button
                      key={gp.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => togglePowerSelection(gp.id)}
                      className={`text-left rounded-2xl border p-3 transition disabled:opacity-50 ${selected ? "border-violet-400 bg-violet-500/5" : "border-white/10 bg-white/[0.01]"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-white">{gp.name}</div>
                        <div className="text-xs">
                          {gp.mechanicsComplete ? (
                            <span className="rounded-full bg-green-500/10 px-2 py-1 text-green-300">Complete</span>
                          ) : (
                            <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-300">Incomplete</span>
                          )}
                        </div>
                      </div>
                      {gp.description && <div className="mt-1 text-xs text-slate-300">{gp.description}</div>}
                      <div className="mt-1 text-xs text-slate-400">
                        {[gp.cost ? `Cost: ${gp.cost}` : null, gp.actionType ? `Action: ${gp.actionType}` : null, gp.range ? `Range: ${gp.range}` : null, gp.duration ? `Duration: ${gp.duration}` : null, gp.usageLimit ? `Limit: ${gp.usageLimit}` : null].filter(Boolean).join(" • ")}
                      </div>
                      {gp.prerequisites && gp.prerequisites.length > 0 && (
                        <div className="mt-1 text-xs text-slate-400">Prerequisites: {gp.prerequisites.join(", ")}</div>
                      )}
                      {gp.restrictions && gp.restrictions.length > 0 && (
                        <div className="mt-1 text-xs text-slate-400">Restrictions: {gp.restrictions.join(", ")}</div>
                      )}
                      {gp.notes && <div className="mt-1 text-xs italic text-slate-400">{gp.notes}</div>}
                      {disabled && <div className="mt-1 text-xs text-yellow-300">Not currently eligible for selected role.</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Structured Zords</div>
              <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {ZORDS.map((z) => {
                  const selected = selectedZords.includes(z.id);
                  const roleAllowed = !selectedRoleId
                    ? true
                    : !Array.isArray(z.associatedRoleIds) || z.associatedRoleIds.length === 0 || z.associatedRoleIds.includes(selectedRoleId);
                  const disabled = !roleAllowed;
                  const statItems = [
                    z.size ? `Size: ${z.size}` : null,
                    z.health ? `Health: ${z.health}` : null,
                    z.strength ? `Strength: ${z.strength}` : null,
                    z.speed ? `Speed: ${z.speed}` : null,
                    z.smarts ? `Smarts: ${z.smarts}` : null,
                    z.social ? `Social: ${z.social}` : null,
                    z.toughness ? `Toughness: ${z.toughness}` : null,
                    z.evasion ? `Evasion: ${z.evasion}` : null,
                    z.willpower ? `Willpower: ${z.willpower}` : null,
                    z.cleverness ? `Cleverness: ${z.cleverness}` : null,
                  ].filter(Boolean) as string[];

                  return (
                    <button
                      key={z.id}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      onClick={() => {
                        const current = Array.isArray(draft.zords) ? [...(draft.zords as string[])] : [];
                        const idx = current.indexOf(z.id);
                        if (idx >= 0) current.splice(idx, 1); else current.push(z.id);
                        updateDraft("zords", current);
                      }}
                      className={`h-full text-left rounded-2xl border p-4 transition disabled:opacity-50 ${selected ? "border-violet-400 bg-violet-500/10 shadow-[0_0_0_1px_rgba(167,139,250,0.35)]" : "border-white/10 bg-white/[0.01]"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="break-words text-base font-semibold leading-tight text-white">{z.name}</div>
                          {z.description && <div className="mt-1 whitespace-normal break-words text-xs leading-relaxed text-slate-300">{z.description}</div>}
                        </div>
                        <div className="shrink-0 space-y-1 text-right text-[11px]">
                          <div>
                            <span className={`rounded-full px-2 py-1 ${selected ? "bg-violet-500/20 text-violet-100" : "bg-white/5 text-slate-300"}`}>
                              {selected ? "Selected" : "Select"}
                            </span>
                          </div>
                          <div>
                            {z.mechanicsComplete ? (
                              <span className="rounded-full bg-green-500/10 px-2 py-1 text-green-300">Complete</span>
                            ) : (
                              <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-300">Incomplete</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 text-xs text-slate-300">
                        {statItems.length > 0 && (
                          <div>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Statistics</div>
                            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                              {statItems.map((stat) => (
                                <div key={`${z.id}-${stat}`} className="whitespace-normal break-words rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-slate-300">
                                  {stat}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {z.movement && z.movement.length > 0 && (
                          <div>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Movement</div>
                            <div className="whitespace-normal break-words leading-relaxed text-slate-300">{z.movement.join(", ")}</div>
                          </div>
                        )}

                        {z.attacks && z.attacks.length > 0 && (
                          <div>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Attacks</div>
                            <ul className="space-y-1">
                              {z.attacks.map((attack, idx) => (
                                <li key={`${z.id}-attack-${idx}`} className="whitespace-normal break-words rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 leading-relaxed text-slate-300">
                                  <span className="font-medium text-slate-200">{attack.name}</span>
                                  {[attack.attack ? `Hit: ${attack.attack}` : null, attack.range ? `Range: ${attack.range}` : null, attack.effect ? `Effect: ${attack.effect}` : null, attack.usageLimit ? `Limit: ${attack.usageLimit}` : null].filter(Boolean).join(" • ") ? ` — ${[attack.attack ? `Hit: ${attack.attack}` : null, attack.range ? `Range: ${attack.range}` : null, attack.effect ? `Effect: ${attack.effect}` : null, attack.usageLimit ? `Limit: ${attack.usageLimit}` : null].filter(Boolean).join(" • ")}` : ""}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {z.features && z.features.length > 0 && (
                          <div>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Features</div>
                            <div className="whitespace-normal break-words leading-relaxed text-slate-300">{z.features.join(", ")}</div>
                          </div>
                        )}

                        {z.prerequisites && z.prerequisites.length > 0 && (
                          <div>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Prerequisites</div>
                            <div className="whitespace-normal break-words leading-relaxed text-slate-300">{z.prerequisites.join(", ")}</div>
                          </div>
                        )}

                        {z.notes && (
                          <div>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mechanics Notes</div>
                            <div className="whitespace-normal break-words italic leading-relaxed text-slate-400">{z.notes}</div>
                          </div>
                        )}

                        {disabled && <div className="whitespace-normal break-words rounded-md border border-yellow-400/20 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-300">Not currently eligible for selected role.</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {powerSuggestions.length > 0 && (
              <div>
                <div className="text-xs text-slate-400">Role power/Zord suggestions</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {powerSuggestions.map((pName) => {
                    const selected = Array.isArray(draft.powers) && (draft.powers as string[]).includes(pName);
                    return (
                      <button
                        key={pName}
                        type="button"
                        onClick={() => togglePowerSelection(pName)}
                        className={`rounded-full border px-3 py-1 text-xs ${selected ? "border-violet-400 bg-violet-500/20 text-violet-100" : "border-white/15 text-slate-300"}`}
                      >
                        {pName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-slate-400">Add power manually</div>
              <div className="mt-2 flex gap-2">
                <input value={manualPowerInput} onChange={(e) => setManualPowerInput(e.target.value)} placeholder="Type power or feature" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-3 py-2 text-white" />
                <button type="button" onClick={() => {
                  const val = manualPowerInput.trim();
                  if (!val) return;
                  const current = Array.isArray(draft.powers) ? [...(draft.powers as string[])] : [];
                  if (!current.includes(val)) current.push(val);
                  updateDraft("powers", current);
                  setManualPowerInput("");
                }} className="rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-black">Add</button>
              </div>
            </div>

            <input value={(draft.powers ?? []).join(", ")} onChange={(e) => updateDraft("powers", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Comma-separated powers (editable)" className="w-full rounded-lg border border-white/10 bg-[#071027] bg-opacity-20 px-4 py-3 text-white" />
          </div>
        );

      case 7:
        // Review & Save
        const missing = [] as string[];
        if (!((draft.name ?? "").toString().trim())) missing.push("Character Name");
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Review your draft below. Missing required fields are listed.</p>
            {missing.length > 0 && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-300">Missing required: {missing.join(", ")}</div>
            )}
            <div className="rounded-lg border border-white/6 p-4 text-sm text-slate-200">
              <h3 className="font-semibold">Summary</h3>
              <dl className="mt-2 space-y-2 text-slate-300">
                <div>
                  <dt className="font-medium text-slate-200">Name</dt>
                  <dd>{draft.name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Concept</dt>
                  <dd>{draft.concept ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Origin</dt>
                  <dd>{getOriginDisplay(draft.origin) ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Spectrum</dt>
                  <dd>{getSpectrumDisplay(draft.spectrum) ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Role</dt>
                  <dd>{getRoleDisplay(draft.role) ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Influences</dt>
                  <dd>{getInfluenceDisplayList(draft.influences as any[]).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Perks</dt>
                  <dd>{getPerkDisplayList(draft.perks as any[]).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Hang-ups</dt>
                  <dd>{getHangupDisplayList(draft.hangups as any[]).join(", ") || "—"}</dd>
                </div>

                <div>
                  <dt className="font-medium text-slate-200">Base Defenses</dt>
                  <dd>{formatBaseDefensesList(getBaseDefenses(draft.essence)).join(', ')}</dd>
                </div>
                <div>
                      <dt className="font-medium text-slate-200">Skills</dt>
                      <dd>
                        {draft.skillRanks && Object.keys(draft.skillRanks).length > 0
                          ? formatSkillRanks(draft.skillRanks as Record<string,string>).join(', ')
                          : (draft.skills ?? []).join(", ") || "—"}
                      </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Skill Specializations</dt>
                  <dd>
                    {draft.skillSpecializations && Object.keys(draft.skillSpecializations).length > 0
                      ? formatSkillSpecializations(draft.skillSpecializations as Record<string, string[]>).join(', ')
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Equipment</dt>
                  <dd>{(draft.equipment && (draft.equipment as string[]).length > 0) ? formatEquipmentList(draft.equipment as string[]).join(', ') : (draft.equipment ?? []).join(', ') || "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Powers</dt>
                  <dd>{formatGridPowerList(draft.powers as string[]).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Zords</dt>
                  <dd>{formatZordList(draft.zords as string[]).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">Notes</dt>
                  <dd>{draft.notes ?? "—"}</dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[#090b14] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Compact header */}
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-slate-200 hover:text-violet-300">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-200">✧</span>
            <span>Realm Nexus</span>
          </Link>
          <Link href="/systems/essence20" className="text-sm text-slate-400 hover:text-violet-300">Back to Essence20</Link>
        </header>

        <div className="rounded-3xl border border-violet-400/10 bg-gradient-to-b from-[#0c0716] via-[#080a12] to-[#05040a] p-6 shadow-lg">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Your Hero</h1>
              <div className="mt-3 inline-flex items-center gap-3">
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">Power Rangers • Essence20</span>
                <span className="text-sm text-slate-400">Drafts save locally on this device</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {steps.map((s, idx) => (
                  <button key={s} onClick={() => setStepIndex(idx)} className={`min-w-[8rem] rounded-full px-4 py-2 text-sm font-semibold ${idx === stepIndex ? "bg-violet-500 text-black" : "bg-white/3 text-slate-200"}`}>
                    {idx + 1}. {s}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-slate-400">Use Back/Next to navigate. Required fields are validated per step.</div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <aside className="col-span-1">
                <div className="sticky top-6 space-y-4">
                  <div className="rounded-2xl border border-violet-400/10 bg-gradient-to-b from-[#0f0716]/40 to-[#07060b] p-4 text-center shadow-[0_8px_30px_rgba(124,58,237,0.08)]">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-tr from-violet-600/10 to-transparent text-3xl text-violet-200">✦</div>
                    <h2 className="text-lg font-bold text-white">Character Identity</h2>
                    <p className="mt-2 text-sm text-slate-400">Quick reference for the current draft.</p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/2 p-3 text-sm text-slate-300">
                    <strong className="block text-slate-200">Saved status</strong>
                    <p className="mt-1">Drafts are stored only on this device (localStorage).</p>
                  </div>

                  {/* Live Preview Panel */}
                  <div className="rounded-2xl border border-violet-400/8 bg-gradient-to-b from-[#07061a]/30 to-transparent p-4 text-sm text-slate-300">
                    <h3 className="mb-3 text-sm font-semibold text-white">Live Preview</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-xs text-slate-400">Name</div>
                        <div className="text-base font-medium text-white">{(draft.name && draft.name.toString().trim()) || "(no name yet)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Concept</div>
                        <div className="text-sm text-slate-300">{draft.concept || "(no concept yet)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Origin</div>
                        <div className="text-sm text-slate-300">{getOriginDisplay(draft.origin) ?? "(not selected)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Spectrum</div>
                        <div className="text-sm text-slate-300">{getSpectrumDisplay(draft.spectrum) ?? "(not selected)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Ranger Role</div>
                        <div className="text-sm text-slate-300">{getRoleDisplay(draft.role) ?? "(not selected)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Influences</div>
                        <div className="text-sm text-slate-300">{(draft.influences && (draft.influences as string[]).length > 0) ? getInfluenceDisplayList(draft.influences as string[]).join(", ") : "(none)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Perks</div>
                        <div className="text-sm text-slate-300">{(draft.perks && (draft.perks as string[]).length > 0) ? getPerkDisplayList(draft.perks as string[]).join(", ") : "(none)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Hang-ups</div>
                        <div className="text-sm text-slate-300">{(draft.hangups && (draft.hangups as string[]).length > 0) ? getHangupDisplayList(draft.hangups as string[]).join(", ") : "(none)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Essence</div>
                        <div className="text-sm text-slate-300">
                          {draft.essence && Object.keys(draft.essence).length > 0
                            ? Object.entries(draft.essence as Record<string,string>).map(([k,v]) => `${k}: ${v}`).join(", ")
                            : "(none)"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Base Defenses</div>
                        <div className="text-sm text-slate-300">
                          {formatBaseDefensesList(getBaseDefenses(draft.essence)).join(', ')}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">Shown are base defenses (Armor, Perks, and other modifiers not included).</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Skills</div>
                        <div className="text-sm text-slate-300">
                          {draft.skillRanks && Object.keys(draft.skillRanks).length > 0
                            ? formatSkillRanks(draft.skillRanks as Record<string,string>).join(', ')
                            : (draft.skills ?? []).length > 0
                              ? (draft.skills ?? []).join(', ')
                              : "(none)"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Skill Specializations</div>
                        <div className="text-sm text-slate-300">
                          {draft.skillSpecializations && Object.keys(draft.skillSpecializations).length > 0
                            ? formatSkillSpecializations(draft.skillSpecializations as Record<string, string[]>).join(', ')
                            : "(none)"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Equipment</div>
                        <div className="text-sm text-slate-300">
                          {(draft.equipment && (draft.equipment as string[]).length > 0)
                            ? formatEquipmentList(draft.equipment as string[]).join(', ')
                            : "(none)"}
                        </div>
                        {/* Show equipment modifiers if any exist, but do not apply them silently to base defenses */}
                        {draft.equipment && (draft.equipment as string[]).length > 0 && (
                          <div className="mt-2 text-xs text-slate-400">
                            {(() => {
                              const mods = getEquipmentModifiers(draft.equipment as string[]);
                              const formatted = formatEquipmentModifiersDisplay(mods);
                              if (formatted.length === 0) return 'No verified equipment modifiers present.';
                              return formatted.join(' | ');
                            })()}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Powers</div>
                        <div className="text-sm text-slate-300">{(draft.powers && (draft.powers as string[]).length > 0) ? formatGridPowerList(draft.powers as string[]).join(", ") : "(none)"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Zords</div>
                        <div className="text-sm text-slate-300">{(draft.zords && (draft.zords as string[]).length > 0) ? formatZordList(draft.zords as string[]).join(", ") : "(none)"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="col-span-2">
                <div className="rounded-xl border border-white/6 bg-transparent p-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">{steps[stepIndex]}</h3>
                  <div className="mb-4">{renderStepContent()}</div>

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={goBack} disabled={stepIndex === 0} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 disabled:opacity-50">Back</button>
                    <button onClick={goNext} disabled={stepIndex === steps.length - 1} className="rounded-xl bg-white/3 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Next</button>

                    <div className="ml-auto flex gap-2">
                      <button onClick={handleSaveFull} className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-bold text-black">Save Character</button>
                      <button onClick={handleLoadFull} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Load Character</button>
                      <button onClick={handleClearFull} className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300">Clear Saved</button>
                      <Link href="/systems/essence20/character-sheet" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Open Character Sheet</Link>
                    </div>
                  </div>

                  <div className="mt-4 min-h-[2rem]">
                    {message && <div role="status" className="inline-flex items-center gap-3 rounded-md bg-violet-500/10 px-4 py-2 text-sm text-violet-200"><span className="inline-block h-2 w-2 rounded-full bg-violet-300" />{message}</div>}
                    {error && <div role="alert" className="inline-flex items-center gap-3 rounded-md bg-red-500/10 px-4 py-2 text-sm text-red-300"><span className="inline-block h-2 w-2 rounded-full bg-red-400" />{error}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
