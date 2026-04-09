import React, { useState, useEffect, useRef } from "react";
import {
  Folder, PauseCircle, PlayCircle, Plus, MoreVertical,
  Link as LinkIcon, Image as ImageIcon, ExternalLink, Trash2,
  X, CheckCircle2, Circle, ChevronDown, ChevronUp, Edit2,
  File as FileIcon, Calendar, Settings, PanelLeft, PanelRight,
  Infinity as InfinityIcon, LogOut, Loader2, AlertCircle,
  CheckSquare, RotateCcw, List, MessageCircle, Mail, ArrowLeft,
  Send, Menu, Smile, Upload, Clock, AlertTriangle,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged,
  signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
  fetchSignInMethodsForEmail, sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1cwBv2_XxyFKdbp4iqZadOnljT2oZ3NM",
  authDomain: "continuum-6e7dc.firebaseapp.com",
  projectId: "continuum-6e7dc",
  storageBucket: "continuum-6e7dc.firebasestorage.app",
  messagingSenderId: "867995488048",
  appId: "1:867995488048:web:50a557cca5982c3b7d42f5",
  measurementId: "G-LJXK4WV2QH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "continuum-v1";

const DEFAULT_TAGS = [
  "UI Inspiration", "Interaction", "Article", "Project Doc",
  "UX", "Frontend", "Backend", "Design System",
];
const generateId = () => Math.random().toString(36).substr(2, 9);
const EMOJI_SUGGESTIONS = ["🎨", "📐", "🗺️", "📊", "💡", "🏗️", "🌿", "⚡", "🔬", "📱", "🛒", "🏥", "✈️", "🎯", "🌊", "🔧"];
const SLIDE_DURATION = 4600;

// --- Demo Data ---
const DEMO_PROJECTS = [
  {
    id: "demo-1", title: "Harlow & Co. Redesign", client: "Harlow & Co.",
    startDate: "2026-03-01", icon: "🎨",
    description: "Full website redesign focusing on improved IA and content strategy.",
    status: "active", lastUpdated: new Date().toISOString(),
    whereIAm: "Sitemap v2 delivered and approved last week. Now moving into content audit phase.",
    dontForget: "", dontForgetMode: "checklist",
    dontForgetItems: [
      { id: "d1", text: "Max 6 top-level nav items — client was firm on this", checked: false },
      { id: "d2", text: "Blog is being retired, don't include it in sitemap", checked: false },
      { id: "d3", text: "Legal pages go under utility nav, not main nav", checked: true },
    ],
    notes: [
      { id: "n1", type: "question", content: "Has the client signed off on the proposed taxonomy for the product section?", timestamp: "3/18/2026", isResolved: false },
      { id: "n2", type: "question", content: "Are we handling the CMS migration or just providing the IA deliverables?", timestamp: "3/19/2026", isResolved: false },
      { id: "n3", type: "question", content: "Who is the main stakeholder for content decisions?", timestamp: "3/10/2026", isResolved: true },
    ],
    resources: [
      { id: "r1", type: "link", title: "Sitemap v2 — Figma", url: "https://figma.com", description: "Approved sitemap, version 2.", tags: ["Project Doc"] },
      { id: "r2", type: "document", title: "Content Audit Template", url: "https://docs.google.com", description: "Working spreadsheet for the full content inventory.", tags: ["Project Doc", "UX"] },
    ],
  },
  {
    id: "demo-2", title: "Meridian Health Platform", client: "Meridian Health",
    startDate: "2026-02-10", icon: "🏥",
    description: "Patient-facing portal redesign. Heavy focus on information architecture.",
    status: "active", lastUpdated: new Date().toISOString(),
    whereIAm: "Discovery phase complete. Just finished stakeholder interviews and card sorting sessions with 12 patients.",
    dontForget: "Accessibility is non-negotiable — WCAG AA minimum. Legal team must review any content changes.",
    dontForgetMode: "text", dontForgetItems: [],
    notes: [{ id: "n4", type: "question", content: "Do we have access to the current site analytics to understand drop-off points?", timestamp: "3/15/2026", isResolved: false }],
    resources: [{ id: "r4", type: "document", title: "Card Sort Results", url: "https://docs.google.com", description: "Raw results from Optimal Workshop sessions.", tags: ["UX", "Project Doc"] }],
  },
  {
    id: "demo-3", title: "Volta E-commerce IA", client: "Volta",
    startDate: "2026-01-15", icon: "⚡",
    description: "IA overhaul for a fast-growing electric vehicle accessories brand.",
    status: "paused", lastUpdated: new Date().toISOString(),
    whereIAm: "Paused — client is going through internal restructure. Resume expected late April.",
    dontForget: "", dontForgetMode: "text", dontForgetItems: [], notes: [],
    resources: [{ id: "r5", type: "link", title: "Sitemap v1 Draft", url: "https://figma.com", description: "First draft — not yet reviewed by client.", tags: ["Project Doc"] }],
  },
];

// --- UI Components ---
const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const styles = {
    primary: "bg-indigo-600 text-slate-50 hover:bg-indigo-700 shadow-sm hover:shadow-md border border-transparent",
    secondary: "bg-slate-50 text-slate-700 border border-slate-300 hover:bg-slate-100 shadow-sm",
    tertiary: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent border border-transparent",
    soft: "bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-transparent",
    amber: "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-transparent",
    destructive: "text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent border border-transparent",
    icon: "p-2.5 text-slate-400 hover:text-indigo-900 hover:bg-indigo-50 rounded-full border border-transparent",
    google: "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-sm",
  };
  const base = variant === "icon"
    ? styles.icon
    : "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-apple active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  return (
    <button className={`${base} ${variant !== "icon" ? styles[variant] : ""} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input className={`w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-200 transition-all duration-200 ease-apple placeholder:text-slate-400 ${className}`} {...props} />
);

const TextArea = ({ className = "", ...props }) => (
  <textarea className={`w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-200 transition-all duration-200 ease-apple placeholder:text-slate-400 resize-none ${className}`} {...props} />
);

const Badge = ({ children, color = "slate", className = "" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${colors[color]} ${className}`}>{children}</span>;
};

const ProjectIcon = ({ icon, size = "sm", className = "" }) => {
  const sizes = { sm: "w-7 h-7 text-base", md: "w-10 h-10 text-xl", lg: "w-14 h-14 text-3xl" };
  if (!icon) return null;
  const isEmoji = !icon.startsWith("data:");
  return (
    <div className={`${sizes[size]} rounded-xl flex items-center justify-center shrink-0 bg-slate-100 ${className}`}>
      {isEmoji
        ? <span style={{ fontSize: size === "lg" ? 28 : size === "md" ? 20 : 14 }}>{icon}</span>
        : <img src={icon} alt="project icon" className="w-full h-full object-cover rounded-xl" />}
    </div>
  );
};

const IconPicker = ({ value, onChange }) => {
  const [mode, setMode] = useState("emoji");
  const [emojiInput, setEmojiInput] = useState(value && !value.startsWith("data:") ? value : "");
  const fileRef = useRef(null);
  const handleEmojiInput = (val) => { setEmojiInput(val); if (val.trim()) onChange(val.trim()); };
  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-full border border-slate-200 w-fit">
        {[["emoji", "Emoji"], ["upload", "Upload image"]].map(([m, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ease-apple ${mode === m ? "bg-slate-50 shadow-sm text-indigo-900 ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>
      {mode === "emoji" ? (
        <div className="space-y-3">
          <Input placeholder="Type or paste an emoji, e.g. 🎨" value={emojiInput} onChange={e => handleEmojiInput(e.target.value)} className="text-lg" />
          <div className="flex flex-wrap gap-2">
            {EMOJI_SUGGESTIONS.map(e => (
              <button key={e} type="button" onClick={() => { setEmojiInput(e); onChange(e); }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ease-apple active:scale-95 ${value === e ? "bg-indigo-100 ring-2 ring-indigo-400" : "bg-slate-100 hover:bg-slate-200"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex items-center gap-3 w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium transition-all ease-apple active:scale-95">
            <Upload className="w-4 h-4 text-slate-400" />
            {value?.startsWith("data:") ? "Image selected — click to change" : "Choose image from your device"}
          </button>
          {value?.startsWith("data:") && (
            <div className="mt-3 flex items-center gap-3">
              <img src={value} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
              <button type="button" onClick={() => onChange("")} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Progress-pill slider indicator ──
const SliderDots = ({ total, current, onSelect, duration }) => {
  const [progress, setProgress] = useState(0);
  const animRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const pct = Math.min(((ts - startRef.current) / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [current, duration]);

  return (
    <div className="flex gap-2 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative overflow-hidden rounded-full transition-all duration-300 ease-apple focus:outline-none"
          style={{ width: i === current ? 40 : 8, height: 6, background: "rgba(255,255,255,0.25)" }}
          aria-label={`Go to slide ${i + 1}`}
        >
          {/* Current — animated fill */}
          {i === current && (
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress}%` }}
            />
          )}
          {/* Past — fully filled */}
          {i < current && (
            <div className="absolute inset-0 rounded-full bg-white/70" />
          )}
        </button>
      ))}
    </div>
  );
};

// --- Login Screen ---
const SLIDES = [
  {
    tag: "Context switching",
    title: "Pick up exactly where you left off",
    desc: "Stop wasting time figuring out where you were. Continuum keeps your project context front and centre every time you return.",
    preview: (
      <div className="mt-8 flex justify-start">
        <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm opacity-95">
          {/* desk */}
          <rect x="40" y="200" width="340" height="14" rx="7" fill="#FCD34D" opacity="0.25"/>
          {/* monitor stand */}
          <rect x="195" y="155" width="30" height="48" rx="4" fill="#FCD34D" opacity="0.3"/>
          <rect x="170" y="198" width="80" height="8" rx="4" fill="#FCD34D" opacity="0.3"/>
          {/* monitor */}
          <rect x="90" y="60" width="240" height="150" rx="12" fill="white" opacity="0.12"/>
          <rect x="90" y="60" width="240" height="150" rx="12" stroke="#FCD34D" strokeWidth="2.5" opacity="0.5"/>
          {/* screen glow */}
          <rect x="104" y="74" width="212" height="122" rx="7" fill="#FCD34D" opacity="0.08"/>
          {/* screen content lines */}
          <rect x="118" y="90" width="80" height="8" rx="4" fill="#FCD34D" opacity="0.7"/>
          <rect x="118" y="108" width="140" height="5" rx="2.5" fill="white" opacity="0.35"/>
          <rect x="118" y="120" width="120" height="5" rx="2.5" fill="white" opacity="0.25"/>
          <rect x="118" y="132" width="100" height="5" rx="2.5" fill="white" opacity="0.2"/>
          {/* checkmark badge */}
          <circle cx="272" cy="100" r="22" fill="#FCD34D" opacity="0.2"/>
          <circle cx="272" cy="100" r="22" stroke="#FCD34D" strokeWidth="2" opacity="0.6"/>
          <path d="M262 100 l7 7 l12-14" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
          {/* cursor */}
          <path d="M200 160 l0 16 l4-5 l5 10 l3-1 l-5-10 l7 0 z" fill="#FCD34D" opacity="0.8"/>
          {/* floating note card */}
          <rect x="310" y="30" width="95" height="60" rx="10" fill="white" opacity="0.1"/>
          <rect x="310" y="30" width="95" height="60" rx="10" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4"/>
          <rect x="322" y="44" width="50" height="5" rx="2.5" fill="#FCD34D" opacity="0.6"/>
          <rect x="322" y="56" width="35" height="4" rx="2" fill="white" opacity="0.3"/>
          <rect x="322" y="66" width="42" height="4" rx="2" fill="white" opacity="0.2"/>
          {/* person silhouette */}
          <circle cx="64" cy="148" r="18" fill="#FCD34D" opacity="0.25"/>
          <path d="M40 200 q24-36 48 0" fill="#FCD34D" opacity="0.2"/>
          <circle cx="64" cy="148" r="18" stroke="#FCD34D" strokeWidth="1.5" opacity="0.5"/>
        </svg>
      </div>
    ),
  },
  {
    tag: "Questions",
    title: "Never lose track of a blocker",
    desc: "Log questions the moment they come up. Resolve them when you get answers. Full history always there.",
    preview: (
      <div className="mt-8 flex justify-start">
        <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm opacity-95">
          {/* main chat bubble */}
          <rect x="60" y="30" width="240" height="110" rx="18" fill="white" opacity="0.1"/>
          <rect x="60" y="30" width="240" height="110" rx="18" stroke="#FCD34D" strokeWidth="2.5" opacity="0.55"/>
          <path d="M100 140 l-20 28 l36-18" fill="white" opacity="0.08"/>
          <path d="M100 140 l-20 28 l36-18" stroke="#FCD34D" strokeWidth="2" opacity="0.4"/>
          {/* question mark in bubble */}
          <text x="150" y="108" fontFamily="Georgia, serif" fontSize="72" fill="#FCD34D" opacity="0.8" textAnchor="middle">?</text>
          {/* small reply bubble */}
          <rect x="230" y="140" width="140" height="70" rx="14" fill="white" opacity="0.08"/>
          <rect x="230" y="140" width="140" height="70" rx="14" stroke="#FCD34D" strokeWidth="1.5" opacity="0.35"/>
          <path d="M260 140 l-14-20 l28 8" fill="white" opacity="0.05"/>
          <path d="M260 140 l-14-20 l28 8" stroke="#FCD34D" strokeWidth="1.5" opacity="0.3"/>
          {/* lines in reply */}
          <rect x="248" y="160" width="70" height="5" rx="2.5" fill="#FCD34D" opacity="0.5"/>
          <rect x="248" y="172" width="50" height="4" rx="2" fill="white" opacity="0.25"/>
          <rect x="248" y="183" width="60" height="4" rx="2" fill="white" opacity="0.2"/>
          {/* resolved checkmark */}
          <circle cx="360" cy="55" r="26" fill="#FCD34D" opacity="0.18"/>
          <circle cx="360" cy="55" r="26" stroke="#FCD34D" strokeWidth="2" opacity="0.6"/>
          <path d="M348 55 l8 9 l16-18" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
          {/* dots — unresolved */}
          <circle cx="360" cy="185" r="8" fill="#FCD34D" opacity="0.2"/>
          <circle cx="360" cy="185" r="8" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4"/>
          <circle cx="380" cy="185" r="8" fill="white" opacity="0.08"/>
          <circle cx="380" cy="185" r="8" stroke="white" strokeWidth="1.5" opacity="0.2"/>
          <circle cx="400" cy="185" r="8" fill="white" opacity="0.08"/>
          <circle cx="400" cy="185" r="8" stroke="white" strokeWidth="1.5" opacity="0.2"/>
          {/* person */}
          <circle cx="50" cy="190" r="20" fill="#FCD34D" opacity="0.2"/>
          <circle cx="50" cy="190" r="20" stroke="#FCD34D" strokeWidth="1.5" opacity="0.45"/>
          <path d="M24 230 q26-32 52 0" fill="#FCD34D" opacity="0.15"/>
        </svg>
      </div>
    ),
  },
  {
    tag: "Resources",
    title: "Stop hunting through folders",
    desc: "Links, docs, and images — tagged and filterable, all in one place per project.",
    preview: (
      <div className="mt-8 flex justify-start">
        <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm opacity-95">
          {/* back folder */}
          <rect x="200" y="60" width="170" height="130" rx="12" fill="#FCD34D" opacity="0.12"/>
          <rect x="200" y="60" width="170" height="130" rx="12" stroke="#FCD34D" strokeWidth="2" opacity="0.3"/>
          <path d="M200 80 l170 0" stroke="#FCD34D" strokeWidth="1.5" opacity="0.3"/>
          <path d="M200 73 q0-13 13-13 l40 0 q6 0 8 6 l4 7 l105 0" stroke="#FCD34D" strokeWidth="2" opacity="0.35" fill="none"/>
          {/* middle folder */}
          <rect x="80" y="80" width="170" height="130" rx="12" fill="white" opacity="0.08"/>
          <rect x="80" y="80" width="170" height="130" rx="12" stroke="#FCD34D" strokeWidth="2" opacity="0.45"/>
          <path d="M80 100 l170 0" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4"/>
          <path d="M80 93 q0-13 13-13 l40 0 q6 0 8 6 l4 7 l105 0" stroke="#FCD34D" strokeWidth="2" opacity="0.5" fill="none"/>
          {/* doc lines in middle folder */}
          <rect x="100" y="115" width="90" height="5" rx="2.5" fill="#FCD34D" opacity="0.55"/>
          <rect x="100" y="128" width="70" height="4" rx="2" fill="white" opacity="0.3"/>
          <rect x="100" y="140" width="80" height="4" rx="2" fill="white" opacity="0.22"/>
          <rect x="100" y="152" width="60" height="4" rx="2" fill="white" opacity="0.18"/>
          {/* link icon */}
          <circle cx="210" cy="145" r="18" fill="#FCD34D" opacity="0.15"/>
          <circle cx="210" cy="145" r="18" stroke="#FCD34D" strokeWidth="1.5" opacity="0.5"/>
          <path d="M204 145 q0-6 6-6 l8 0 q6 0 6 6 q0 6-6 6 l-8 0 q-6 0-6-6z" stroke="#FCD34D" strokeWidth="1.5" fill="none" opacity="0.8"/>
          <line x1="207" y1="145" x2="213" y2="145" stroke="#FCD34D" strokeWidth="1.5" opacity="0.8"/>
          {/* tag badges */}
          <rect x="94" y="168" width="40" height="16" rx="8" fill="#FCD34D" opacity="0.25"/>
          <rect x="140" y="168" width="48" height="16" rx="8" fill="white" opacity="0.1"/>
          {/* person */}
          <circle cx="360" cy="185" r="22" fill="#FCD34D" opacity="0.2"/>
          <circle cx="360" cy="185" r="22" stroke="#FCD34D" strokeWidth="1.5" opacity="0.5"/>
          <path d="M330 230 q30-36 60 0" fill="#FCD34D" opacity="0.15"/>
          {/* arm reaching to folder */}
          <path d="M342 185 q-30-20-60-40" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
          <circle cx="282" cy="145" r="5" fill="#FCD34D" opacity="0.6"/>
        </svg>
      </div>
    ),
  },
];

const LoginScreen = ({ onGoogleLogin, onEmailAuth, onMagicLink, onDemo, loading, error }) => {
  const [slide, setSlide] = useState(0);
  const [authMode, setAuthMode] = useState("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("main");
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Auto-advance slide
  useEffect(() => {
    const timer = setTimeout(() => setSlide(s => (s + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [slide]);

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    setLocalLoading(true); setLocalError("");
    try {
      if (authMode === "magic") { await onMagicLink(email); setStep("sent"); }
      else await onEmailAuth(email, password);
    } catch (err) { setLocalError(err.message || "Something went wrong."); }
    setLocalLoading(false);
  };

  const currentSlide = SLIDES[slide];

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* ══ LEFT COLUMN — white ══ */}
      <div className="flex flex-col bg-white overflow-y-auto" style={{ width: "50%", minWidth: 340, paddingTop: 80, paddingLeft: 64, paddingRight: 64, paddingBottom: 48 }}>

        {/* Logo — 80px from top, left-aligned */}
        <div className="flex flex-col items-start gap-2 mb-12 shrink-0">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <InfinityIcon className="w-8 h-8 text-white" />
          </div>
          <span className="text-slate-900 font-extrabold text-xl tracking-tight">Continuum</span>
        </div>

        {/* Form */}
        <div className="w-full" style={{ maxWidth: 440, minWidth: 280 }}>
          {step === "main" ? (
            <>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Your creative second brain</p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Get started</h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">New here? We'll create your account automatically.</p>

              {(error || localError) && (
                <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-xs flex items-center gap-2 mb-5">
                  <AlertCircle className="w-4 h-4 shrink-0" /><p>{error || localError}</p>
                </div>
              )}

              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200 mb-4">
                {[["magic", "Magic link", "No password"], ["password", "Password", "Traditional"]].map(([mode, label, sub]) => (
                  <button key={mode} onClick={() => setAuthMode(mode)}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all duration-200 ease-apple ${authMode === mode ? "bg-white shadow-sm text-indigo-900 ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"}`}>
                    {label}<span className="block text-[10px] font-medium mt-0.5 opacity-60">{sub}</span>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 mb-4 leading-relaxed">
                {authMode === "magic"
                  ? "We'll send a sign-in link to your email. Click it and you're in — no password ever."
                  : "Enter your email and password. New here? We'll create your account automatically."}
              </div>

              <Input type="email" placeholder="Your email address" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleEmailSubmit(); }}
                className="mb-3" />

              {authMode === "password" && (
                <div className="mb-1">
                  <Input type="password" placeholder="Password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleEmailSubmit(); }}
                    className="mb-2" />
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!email.trim()) { setLocalError("Enter your email address first."); return; }
                        try {
                          await sendPasswordResetEmail(auth, email);
                          setStep("resetSent");
                        } catch (err) {
                          setLocalError(err.code === "auth/user-not-found" ? "No account found with that email." : "Failed to send reset email. Try again.");
                        }
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}

              <Button variant="primary" className="w-full py-3.5 mb-4" onClick={handleEmailSubmit} disabled={localLoading || loading}>
                {localLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  : authMode === "magic" ? <><Send className="w-4 h-4" /> Send magic link</> : "Continue"}
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <Button variant="google" className="w-full py-3.5 mb-3" onClick={onGoogleLogin} disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : (
                  <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>Continue with Google</>
                )}
              </Button>

              <button onClick={onDemo}
                className="w-full py-3.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-all ease-apple active:scale-95 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Explore with demo data
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-3">No account needed · Data won't be saved</p>
            </>
          ) : step === "sent" ? (
            <>
              <button onClick={() => setStep("main")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-10 min-h-[44px]">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Check your inbox</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                We sent a sign-in link to <strong className="text-slate-800">{email}</strong>. Click it and you're in.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed">
                Didn't get it? Check your spam, or{" "}
                <button onClick={handleEmailSubmit} className="text-indigo-600 font-semibold hover:underline">resend the link.</button>
              </div>
            </>
          ) : (
            /* resetSent step */
            <>
              <button onClick={() => setStep("main")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-10 min-h-[44px]">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <CheckSquare className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Password reset sent</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                We sent a password reset link to <strong className="text-slate-800">{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed">
                Didn't get it? Check your spam, or{" "}
                <button
                  onClick={async () => { try { await sendPasswordResetEmail(auth, email); } catch(e) {} }}
                  className="text-indigo-600 font-semibold hover:underline">resend the email.</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══ RIGHT COLUMN — full-bleed indigo ══ */}
      <div className="flex-1 flex flex-col bg-indigo-600 overflow-hidden relative" style={{ minWidth: 280 }}>

        {/* Subtle radial glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.07) 0%, transparent 50%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 90%, rgba(99,102,241,0.5) 0%, transparent 50%)" }} />

        {/* Content — left-aligned, starts at same y as "Your creative second brain" label */}
        <div className="relative z-10 flex flex-col" style={{ paddingTop: 222, paddingLeft: 64, paddingRight: 64, paddingBottom: 64, maxWidth: 560 }}>

          {/* Tag */}
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-3">{currentSlide.tag}</p>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight mb-3">{currentSlide.title}</h2>

          {/* Description */}
          <p className="text-sm text-indigo-200 leading-relaxed mb-8">{currentSlide.desc}</p>

          {/* Slider dots */}
          <div className="mb-12">
            <SliderDots total={SLIDES.length} current={slide} onSelect={setSlide} duration={SLIDE_DURATION} />
          </div>

          {/* Illustration — below the text */}
          <div key={slide + "-art"} className="animate-in fade-in duration-700">
            {currentSlide.preview}
          </div>

        </div>
      </div>
    </div>
  )
};

const DemoBanner = ({ onSignIn }) => (
  <div className="bg-indigo-600 text-slate-50 px-6 py-2.5 flex items-center justify-between shrink-0 z-30 gap-3">
    <p className="text-xs font-semibold">Exploring demo data — nothing is saved.</p>
    <button onClick={onSignIn} className="text-xs font-bold bg-slate-50 text-indigo-700 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition-colors active:scale-95 ease-apple shrink-0">
      Sign in to save your work
    </button>
  </div>
);

// --- Resource Modal ---
const ResourceModal = ({ isOpen, onClose, onSubmit, resource = null }) => {
  const [selectedTags, setSelectedTags] = useState(resource?.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [resourceType, setResourceType] = useState(resource?.type || "link");

  useEffect(() => {
    setSelectedTags(resource?.tags || []);
    setResourceType(resource?.type || "link");
    setCustomTag("");
  }, [resource, isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) { setSelectedTags(prev => [...prev, customTag.trim()]); setCustomTag(""); }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    onSubmit({ id: resource?.id || null, type: resourceType, title: fd.get("title"), url: fd.get("url"), description: fd.get("description"), tags: selectedTags });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full sm:max-w-lg sm:rounded-[28px] rounded-t-[28px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 ease-apple flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-xl text-slate-900">{resource ? "Edit Resource" : "Add New Resource"}</h3>
          <Button variant="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-8 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Resource Type</label>
                <div className="flex gap-2 p-1 bg-slate-200/60 rounded-full border border-slate-200">
                  {["link", "image", "document"].map(type => (
                    <button key={type} type="button" onClick={() => setResourceType(type)}
                      className={`flex-1 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ease-apple ${resourceType === type ? "bg-slate-50 shadow-sm text-indigo-900 ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Title</label>
                <Input name="title" defaultValue={resource?.title || ""} autoFocus placeholder="e.g., Competitor Analysis" required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">URL</label>
                <Input name="url" defaultValue={resource?.url || ""} type="url" placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Description</label>
                <TextArea name="description" defaultValue={resource?.description || ""} rows="3" placeholder="Add a brief description..." />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Tags</label>
                <div className="flex gap-2 mb-3">
                  <Input value={customTag} onChange={e => setCustomTag(e.target.value)} placeholder="Add custom tag..."
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomTag(e); } }} className="py-2" />
                  <Button type="button" variant="secondary" onClick={handleAddCustomTag} className="px-4 shrink-0">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {selectedTags.map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ease-apple bg-indigo-50 border-indigo-200 text-indigo-700 active:scale-95">
                      {tag} <X className="w-3 h-3 inline ml-1" />
                    </button>
                  ))}
                  {DEFAULT_TAGS.filter(t => !selectedTags.includes(t)).map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ease-apple bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 active:scale-95">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4">
                <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" className="px-8">{resource ? "Save Changes" : "Add Resource"}</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Project Modal ---
const ProjectModal = ({ isOpen, onClose, project, onSubmit, onDelete }) => {
  const [icon, setIcon] = useState(project?.icon || "");
  useEffect(() => { setIcon(project?.icon || ""); }, [project?.id, isOpen]);
  if (!isOpen) return null;
  const isEditing = !!project;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full sm:max-w-lg sm:rounded-[28px] rounded-t-[28px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 ease-apple max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-900">{isEditing ? "Edit Project" : "Create New Project"}</h3>
          <Button variant="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-8">
          <form onSubmit={e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            onSubmit({ title: fd.get("title"), client: fd.get("client"), startDate: fd.get("startDate"), description: fd.get("description"), icon });
            onClose();
          }}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Project Icon <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="flex items-center gap-4 mb-3">
                  {icon ? <ProjectIcon icon={icon} size="md" /> : (
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                      <Smile className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <span className="text-xs text-slate-400">Pick an emoji or upload an image to identify this project in the sidebar</span>
                </div>
                <IconPicker value={icon} onChange={setIcon} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Project Name</label>
                <Input name="title" defaultValue={project?.title || ""} autoFocus placeholder="e.g., Nebula Brand Identity" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-500 ml-1">Client Name</label>
                  <Input name="client" defaultValue={project?.client || ""} placeholder="e.g., Nebula Tech" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-500 ml-1">Start Date</label>
                  <Input name="startDate" type="date" defaultValue={project?.startDate || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Description</label>
                <TextArea name="description" defaultValue={project?.description || ""} rows="4" placeholder="Brief summary of the project goals..." />
              </div>
              <div className="flex justify-between items-center mt-8 pt-4">
                {isEditing ? (
                  <Button type="button" variant="destructive" onClick={() => { if (confirm("Delete this project?")) { onDelete(project.id); onClose(); } }}>Delete Project</Button>
                ) : <div />}
                <div className="flex gap-3">
                  <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                  <Button type="submit" variant="primary" className="px-8">{isEditing ? "Save Changes" : "Create Project"}</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Where I Am Card ---
const WhereIAmCard = ({ project, onUpdate, isDemo }) => {
  const [local, setLocal] = useState(project?.whereIAm || "");
  const textareaRef = useRef(null);
  useEffect(() => { setLocal(project?.whereIAm || ""); }, [project?.id]);
  useEffect(() => {
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; }
  }, [local]);
  useEffect(() => {
    if (!project || isDemo) return;
    const t = setTimeout(() => { if (local !== (project.whereIAm || "")) onUpdate({ whereIAm: local }); }, 1000);
    return () => clearTimeout(t);
  }, [local]);

  return (
    <div className="bg-slate-50 rounded-[24px] shadow-sm border border-slate-200 p-8 shadow-md shadow-slate-200/50">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Where I am</span>
      </div>
      <textarea ref={textareaRef}
        className="w-full bg-transparent focus:outline-none text-slate-700 leading-relaxed resize-none placeholder:text-slate-300 text-sm font-light min-h-[80px]"
        placeholder="Current phase, what just happened, where things stand..."
        value={local} onChange={e => setLocal(e.target.value)} readOnly={isDemo} />
    </div>
  );
};

// --- Don't Forget Card ---
const DontForgetCard = ({ project, onUpdate, isDemo }) => {
  const [mode, setMode] = useState(project?.dontForgetMode || "text");
  const [localText, setLocalText] = useState(project?.dontForget || "");
  const [items, setItems] = useState(project?.dontForgetItems || []);
  const [newItem, setNewItem] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    setMode(project?.dontForgetMode || "text");
    setLocalText(project?.dontForget || "");
    setItems(project?.dontForgetItems || []);
  }, [project?.id]);

  useEffect(() => {
    if (mode === "text" && textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; }
  }, [localText, mode]);

  useEffect(() => {
    if (!project || isDemo) return;
    const t = setTimeout(() => { if (localText !== (project.dontForget || "")) onUpdate({ dontForget: localText }); }, 1000);
    return () => clearTimeout(t);
  }, [localText]);

  const switchMode = () => {
    if (isDemo) return;
    const next = mode === "text" ? "checklist" : "text";
    setMode(next); onUpdate({ dontForgetMode: next });
  };
  const addItem = () => {
    if (!newItem.trim() || isDemo) return;
    const updated = [...items, { id: generateId(), text: newItem.trim(), checked: false }];
    setItems(updated); setNewItem(""); onUpdate({ dontForgetItems: updated });
  };
  const toggleItem = (id) => {
    if (isDemo) return;
    const updated = items.map(it => it.id === id ? { ...it, checked: !it.checked } : it);
    setItems(updated); onUpdate({ dontForgetItems: updated });
  };
  const deleteItem = (id) => {
    if (isDemo) return;
    const updated = items.filter(it => it.id !== id);
    setItems(updated); onUpdate({ dontForgetItems: updated });
  };

  return (
    <div className="bg-slate-50 rounded-[24px] shadow-sm border border-slate-200 p-8 shadow-md shadow-slate-200/50">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Don't forget</span>
        {!isDemo && (
          <button onClick={switchMode}
            className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-full transition-all ease-apple active:scale-95">
            {mode === "text" ? <><CheckSquare className="w-3 h-3" /> Checklist</> : <><List className="w-3 h-3" /> Text</>}
          </button>
        )}
      </div>
      {mode === "text" ? (
        <textarea ref={textareaRef}
          className="w-full bg-transparent focus:outline-none text-slate-700 leading-relaxed resize-none placeholder:text-slate-300 text-sm font-light min-h-[80px]"
          placeholder="Key constraints, decisions, things you'd forget after switching clients for a few days..."
          value={localText} onChange={e => setLocalText(e.target.value)} readOnly={isDemo} />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 group">
              <button onClick={() => toggleItem(item.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ease-apple active:scale-95 ${item.checked ? "bg-indigo-500 border-indigo-500" : "border-slate-300 hover:border-indigo-400"}`}>
                {item.checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
              <span className={`text-sm flex-1 leading-relaxed ${item.checked ? "line-through text-slate-300" : "text-slate-700"}`}>{item.text}</span>
              {!isDemo && (
                <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-400 transition-all ease-apple">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {!isDemo && (
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200">
              <div className="w-5 h-5 rounded-md border-2 border-dashed border-slate-300 shrink-0" />
              <input className="text-sm text-slate-500 bg-transparent focus:outline-none placeholder:text-slate-300 flex-1"
                placeholder="Add item..." value={newItem} onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addItem(); }} />
              {newItem && <button onClick={addItem} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors px-2 py-1">Add</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Overview Tab ---
const OverviewTab = ({ project, onUpdate, onUpdateCtx, isDemo }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const addQuestion = (content) => {
    if (!content.trim() || isDemo) return;
    const newNote = { id: generateId(), type: "question", content, timestamp: new Date().toLocaleDateString(), isResolved: false };
    onUpdateCtx("notes", [newNote, ...(project.notes || [])]);
  };
  const deleteNote = (id) => { if (!isDemo) onUpdateCtx("notes", (project.notes || []).filter(n => n.id !== id)); };
  const toggleNoteRes = (id) => { if (!isDemo) onUpdateCtx("notes", (project.notes || []).map(n => n.id === id ? { ...n, isResolved: !n.isResolved } : n)); };
  const startEditing = (note, e) => {
    if (isDemo) return;
    e.stopPropagation(); setEditingId(note.id); setEditContent(note.content); setActiveMenuId(null);
  };
  const saveEdit = () => {
    if (editContent.trim()) onUpdateCtx("notes", (project.notes || []).map(n => n.id === editingId ? { ...n, content: editContent } : n));
    setEditingId(null);
  };

  const activeQuestions = (project.notes || []).filter(n => !n.isResolved && n.type === "question");
  const resolvedQuestions = (project.notes || []).filter(n => n.isResolved && n.type === "question");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WhereIAmCard project={project} onUpdate={onUpdate} isDemo={isDemo} />
        <DontForgetCard project={project} onUpdate={onUpdate} isDemo={isDemo} />
      </div>
      <div className="bg-slate-50 rounded-[24px] shadow-sm border border-slate-200 p-8 shadow-md shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Questions</span>
        </div>
        {!isDemo && (
          <div className="flex gap-3 mb-6">
            <Input id="new-question" placeholder="What do you need to ask?"
              className="focus:ring-amber-200 focus:border-amber-300"
              onKeyDown={e => { if (e.key === "Enter") { addQuestion(e.target.value); e.target.value = ""; } }} />
            <Button variant="amber" className="shrink-0 px-5"
              onClick={() => { const el = document.getElementById("new-question"); addQuestion(el.value); el.value = ""; }}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        )}
        {activeQuestions.length === 0 ? (
          <div className="text-center py-16 bg-slate-100/60 rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-amber-300" />
            </div>
            <p className="text-slate-400 font-medium">No open questions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeQuestions.map(note => (
              <div key={note.id} className="group bg-slate-50 rounded-[24px] border border-slate-200 p-6 hover:shadow-md transition-all duration-300 ease-apple">
                <div className="flex items-start gap-5">
                  <div className="mt-1 shrink-0">
                    <button onClick={() => toggleNoteRes(note.id)}
                      className="w-10 h-10 rounded-full border-2 border-amber-100 text-amber-600 bg-amber-50 flex items-center justify-center hover:bg-amber-100 hover:scale-110 transition-all ease-apple">
                      <Circle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <Badge color="amber">question</Badge>
                      <span className="text-xs font-semibold text-slate-400">{note.timestamp}</span>
                    </div>
                    {editingId === note.id ? (
                      <div className="mt-2 bg-slate-100 p-4 rounded-2xl">
                        <TextArea className="bg-slate-50" value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} autoFocus />
                        <div className="flex gap-3 mt-4 justify-end">
                          <Button variant="tertiary" onClick={() => setEditingId(null)} className="px-4 py-2 text-xs">Cancel</Button>
                          <Button variant="primary" onClick={saveEdit} className="px-4 py-2 text-xs">Save</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-normal break-words">{note.content}</p>
                    )}
                  </div>
                  {!isDemo && (
                    <div className="relative shrink-0">
                      <Button variant="icon" className="opacity-0 group-hover:opacity-100"
                        onClick={e => { e.stopPropagation(); setActiveMenuId(activeMenuId === note.id ? null : note.id); }}>
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                      {activeMenuId === note.id && (
                        <div className="absolute right-0 top-10 w-48 bg-slate-50 rounded-2xl shadow-xl border border-slate-200 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                          <button onClick={e => startEditing(note, e)} className="w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-3 font-medium transition-colors">
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={e => { e.stopPropagation(); deleteNote(note.id); }} className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition-colors">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pt-10 mt-10 border-t border-slate-200/60">
          <button onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-indigo-600 transition-colors mb-6">
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Resolved Questions History {resolvedQuestions.length > 0 && `(${resolvedQuestions.length})`}
          </button>
          {showHistory && (
            <div className="space-y-4 pl-6 border-l-2 border-slate-200">
              {resolvedQuestions.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No resolved questions yet.</p>
              ) : resolvedQuestions.map(note => (
                <div key={note.id} className="opacity-60 hover:opacity-100 transition-opacity flex items-center gap-3 bg-slate-100 p-5 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-slate-600 line-through decoration-slate-300 flex-1">{note.content}</p>
                  {!isDemo && <Button variant="tertiary" onClick={() => toggleNoteRes(note.id)} className="text-xs px-2 py-1 shrink-0">Undo</Button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const [resourceFilter, setResourceFilter] = useState(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => { window.localStorage.removeItem("emailForSignIn"); window.history.replaceState({}, document.title, "/"); })
          .catch(err => console.error(err));
      }
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (currentUser && currentUser.isAnonymous) { signOut(auth); return; }
      setUser(currentUser); setLoading(false);
      if (currentUser) { setAuthError(null); setIsDemo(false); }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || isDemo) return;
    const ref = collection(db, "artifacts", appId, "users", user.uid, "projects");
    const unsub = onSnapshot(query(ref), snapshot => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(loaded);
      if (loaded.length > 0) setSelectedId(prev => loaded.find(p => p.id === prev) ? prev : loaded[0].id);
    }, err => console.error(err));
    return () => unsub();
  }, [user, isDemo]);

  const handleGoogleLogin = async () => {
    setLoading(true); setAuthError(null);
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch (err) {
      if (err.code === "auth/unauthorized-domain") setAuthError("Domain not authorized in Firebase.");
      else if (err.code === "auth/popup-closed-by-user") setAuthError("Sign-in cancelled.");
      else setAuthError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (email, password) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw new Error(
        err.code === "auth/wrong-password" ? "Incorrect password." :
        err.code === "auth/weak-password" ? "Password must be at least 6 characters." :
        "Something went wrong. Please try again."
      );
    }
  };

  const handleMagicLink = async (email) => {
    await sendSignInLinkToEmail(auth, email, { url: window.location.href, handleCodeInApp: true });
    window.localStorage.setItem("emailForSignIn", email);
  };

  const handleDemo = () => { setIsDemo(true); setProjects(DEMO_PROJECTS); setSelectedId(DEMO_PROJECTS[0].id); };
  const handleLogout = () => { signOut(auth); setIsDemo(false); setProjects([]); setSelectedId(null); };

  const updateProject = async (projectId, data) => {
    if (!user || isDemo) return;
    try { await updateDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", projectId), { ...data, lastUpdated: new Date().toISOString() }); }
    catch (e) { console.error(e); }
  };

  const createProject = async (data) => {
    if (!user || isDemo) return;
    try {
      const ref = await addDoc(collection(db, "artifacts", appId, "users", user.uid, "projects"), {
        status: "active", lastUpdated: new Date().toISOString(),
        whereIAm: "", dontForget: "", dontForgetMode: "text", dontForgetItems: [],
        icon: "", notes: [], resources: [], ...data,
      });
      setSelectedId(ref.id);
    } catch (e) { console.error(e); }
  };

  const deleteProject = async (id) => {
    if (!user || isDemo) return;
    try { await deleteDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", id)); if (selectedId === id) setSelectedId(null); }
    catch (e) { console.error(e); }
  };

  const selectedProject = projects.find(p => p.id === selectedId);
  const activeProjects = projects.filter(p => p.status === "active");
  const pausedProjects = projects.filter(p => p.status === "paused");
  const completedProjects = projects.filter(p => p.status === "completed");
  const allProjects = [...activeProjects, ...pausedProjects, ...completedProjects];

  const updateCtx = (field, value) => { if (selectedId && !isDemo) updateProject(selectedId, { [field]: value }); };
  const handleBriefingUpdate = (fields) => { if (selectedId && !isDemo) updateProject(selectedId, fields); };
  const toggleStatus = (id) => { const p = projects.find(x => x.id === id); if (p && !isDemo) updateProject(id, { status: p.status === "active" ? "paused" : "active" }); };
  const markCompleted = (id) => { if (!isDemo) updateProject(id, { status: "completed" }); };
  const reopenProject = (id) => { if (!isDemo) updateProject(id, { status: "active" }); };

  const handleSaveResource = (data) => {
    if (!selectedProject || isDemo) return;
    if (data.id) updateCtx("resources", selectedProject.resources.map(r => r.id === data.id ? { ...r, ...data } : r));
    else { const { id: _, ...rest } = data; updateCtx("resources", [{ id: generateId(), ...rest }, ...(selectedProject.resources || [])]); }
  };

  const deleteRes = (id) => { if (selectedProject && !isDemo) updateCtx("resources", selectedProject.resources.filter(r => r.id !== id)); };
  const uniqueTags = selectedProject ? [...new Set(selectedProject.resources.flatMap(r => r.tags || []))] : [];
  const filteredResources = selectedProject ? selectedProject.resources.filter(r => !resourceFilter || (r.tags && r.tags.includes(resourceFilter))) : [];
  const handleScroll = e => setIsScrolled(e.target.scrollTop > 60);

  const selectProject = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F2F4F6]">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  if (!user && !isDemo) return (
    <LoginScreen onGoogleLogin={handleGoogleLogin} onEmailAuth={handleEmailAuth} onMagicLink={handleMagicLink} onDemo={handleDemo} loading={loading} error={authError} />
  );

  const SidebarItemFull = ({ project }) => (
    <div onClick={() => selectProject(project.id)}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ease-apple mb-1 mr-4 min-h-[44px] ${selectedId === project.id ? "bg-indigo-50 text-indigo-900 font-semibold" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}>
      {project.icon ? (
        <ProjectIcon icon={project.icon} size="sm" className="shrink-0" />
      ) : (
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 ease-apple group-hover:scale-110 ${selectedId === project.id ? "bg-indigo-500" : project.status === "active" ? "bg-slate-300" : project.status === "completed" ? "bg-emerald-300" : "bg-amber-200"}`} />
      )}
      <p className="text-sm font-medium truncate">{project.title}</p>
    </div>
  );

  const SidebarItemIcon = ({ project }) => (
    <div onClick={() => selectProject(project.id)} title={project.title}
      className={`flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 ease-apple mb-1 mx-auto ${selectedId === project.id ? "bg-indigo-50 ring-2 ring-indigo-200" : "hover:bg-slate-100"}`}>
      {project.icon ? (
        <ProjectIcon icon={project.icon} size="sm" className="!bg-transparent" />
      ) : (
        <div className={`w-3 h-3 rounded-full transition-transform duration-300 ease-apple hover:scale-125 ${selectedId === project.id ? "bg-indigo-500" : project.status === "active" ? "bg-slate-400" : project.status === "completed" ? "bg-emerald-400" : "bg-amber-300"}`} />
      )}
    </div>
  );

  const SidebarContent = ({ onClose }) => (
    <>
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-slate-800 font-extrabold text-xl tracking-tight">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-slate-50 shadow-lg shadow-indigo-200/50 shrink-0">
              <InfinityIcon className="w-5 h-5" />
            </div>
            <span>Continuum</span>
          </div>
          <button onClick={onClose}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors ease-apple active:scale-95">
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>
        {!isDemo && (
          <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); if (window.innerWidth < 768) setSidebarOpen(false); }}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-200 ease-apple active:scale-95">
            <Plus className="w-5 h-5" /> New Project
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Active</h3>
          {activeProjects.map(p => <SidebarItemFull key={p.id} project={p} />)}
        </div>
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">On Hold</h3>
          {pausedProjects.map(p => <SidebarItemFull key={p.id} project={p} />)}
        </div>
        <div className="mb-8">
          <button onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4 hover:text-indigo-600 transition-colors">
            Completed {isCompletedExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {isCompletedExpanded && completedProjects.map(p => <SidebarItemFull key={p.id} project={p} />)}
        </div>
      </div>
      <div className="p-4 border-t border-slate-200">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all ease-apple active:scale-95">
          <LogOut className="w-4 h-4" /> {isDemo ? "Exit demo" : "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .ease-apple { transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>
      <div className="flex flex-col h-screen text-slate-900 overflow-hidden bg-[#F2F4F6]">
        {isDemo && <DemoBanner onSignIn={() => { setIsDemo(false); setProjects([]); setSelectedId(null); }} />}
        <div className="flex flex-1 overflow-hidden relative">
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-slate-900/40 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={`hidden md:flex flex-col flex-shrink-0 bg-slate-50 border-r border-slate-200/80 shadow-sm transition-all duration-500 ease-apple overflow-hidden ${isSidebarOpen ? "w-80" : "w-16"}`}>
            {isSidebarOpen ? (
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            ) : (
              <div className="flex flex-col items-center py-5 h-full">
                <button onClick={() => setSidebarOpen(true)}
                  className="p-2.5 mb-5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors ease-apple active:scale-95" title="Expand sidebar">
                  <PanelRight className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center mb-5 shrink-0">
                  <InfinityIcon className="w-5 h-5 text-slate-50" />
                </div>
                {!isDemo && (
                  <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                    className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5 transition-all ease-apple active:scale-95" title="New Project">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
                <div className="flex-1 overflow-y-auto w-full px-1">
                  {allProjects.map(p => <SidebarItemIcon key={p.id} project={p} />)}
                </div>
                <div className="pb-4">
                  <button onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ease-apple active:scale-95" title={isDemo ? "Exit demo" : "Sign Out"}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={`fixed md:hidden top-0 left-0 h-full z-20 w-80 bg-slate-50 flex flex-col shadow-2xl transition-transform duration-500 ease-apple ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>

          <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
            <div className={`absolute top-0 left-0 right-0 bg-[#F2F4F6]/90 backdrop-blur-xl z-30 border-b border-slate-200/50 transition-all duration-500 ease-apple transform ${isScrolled ? "translate-y-0 opacity-100 shadow-sm" : "-translate-y-full opacity-0 pointer-events-none"}`}>
              <div className="max-w-6xl mx-auto px-6 md:px-12 py-3 flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0">
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 truncate flex-1 tracking-tight">{selectedProject?.title}</h2>
                {!isDemo && selectedProject && (
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedProject.status !== "completed" ? (
                      <>
                        <Button onClick={() => toggleStatus(selectedProject.id)} variant="secondary" className="h-9 px-4 text-xs font-semibold">
                          {selectedProject.status === "active" ? <><PauseCircle className="w-3.5 h-3.5" /> Pause</> : <><PlayCircle className="w-3.5 h-3.5" /> Resume</>}
                        </Button>
                        <Button variant="secondary" onClick={() => markCompleted(selectedProject.id)} className="h-9 px-4 text-xs font-semibold">
                          <CheckSquare className="w-3.5 h-3.5" /> Done
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" onClick={() => reopenProject(selectedProject.id)} className="h-9 px-4 text-xs font-semibold">
                        <RotateCcw className="w-3.5 h-3.5" /> Reopen
                      </Button>
                    )}
                    <Button variant="icon" onClick={() => { setEditingProject(selectedProject); setIsProjectModalOpen(true); }} className="h-9 w-9">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {selectedProject ? (
              <div className="flex-1 overflow-y-auto pb-12 scroll-smooth" onScroll={handleScroll}>
                <div className="flex items-center gap-3 px-4 pt-5 pb-2 md:hidden">
                  <button onClick={() => setSidebarOpen(true)}
                    className="p-2.5 bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm border border-slate-200">
                    <Menu className="w-5 h-5" />
                  </button>
                  <p className="text-sm font-semibold text-slate-500 truncate">{selectedProject.title}</p>
                </div>
                <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-12">
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <Badge color={selectedProject.status === "active" ? "green" : selectedProject.status === "completed" ? "blue" : "amber"}>
                          {selectedProject.status === "active" ? "Active" : selectedProject.status === "completed" ? "Completed" : "Paused"}
                        </Badge>
                      </div>
                      {!isDemo && (
                        <div className="flex items-center gap-2">
                          {selectedProject.status !== "completed" ? (
                            <>
                              <Button onClick={() => toggleStatus(selectedProject.id)} variant={selectedProject.status === "active" ? "secondary" : "primary"} className="h-10 px-5 text-sm">
                                {selectedProject.status === "active" ? <><PauseCircle className="w-4 h-4" /> Pause</> : <><PlayCircle className="w-4 h-4" /> Resume</>}
                              </Button>
                              <Button variant="secondary" onClick={() => markCompleted(selectedProject.id)} className="h-10 px-5 text-sm">
                                <CheckSquare className="w-4 h-4" /> Done
                              </Button>
                            </>
                          ) : (
                            <Button variant="primary" onClick={() => reopenProject(selectedProject.id)} className="h-10 px-5 text-sm">
                              <RotateCcw className="w-4 h-4" /> Reopen
                            </Button>
                          )}
                          <Button variant="icon" onClick={() => { setEditingProject(selectedProject); setIsProjectModalOpen(true); }} className="h-10 w-10">
                            <Settings className="w-5 h-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-4 mb-8">
                      {selectedProject.icon && <ProjectIcon icon={selectedProject.icon} size="lg" className="mt-1 shrink-0" />}
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 break-words leading-[1.1]">
                        {selectedProject.title}
                      </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 border-t border-slate-200/60 pt-8">
                      <div className="md:col-span-3 space-y-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium text-base">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                      <div className="md:col-span-9 space-y-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</p>
                        <p className="text-base text-slate-600 leading-relaxed">{selectedProject.description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="relative flex items-center bg-slate-50 p-1 rounded-full w-full max-w-md mx-auto md:mx-0 shadow-sm border border-slate-200 mb-10 z-0">
                      <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-100 rounded-full transition-all duration-300 ease-apple ${activeTab === "overview" ? "left-1 translate-x-0" : "translate-x-full left-0"}`} />
                      <button onClick={() => setActiveTab("overview")}
                        className={`relative z-10 flex-1 h-9 px-6 text-sm font-bold rounded-full text-center transition-colors duration-300 ease-apple ${activeTab === "overview" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"}`}>
                        Overview
                      </button>
                      <button onClick={() => setActiveTab("resources")}
                        className={`relative z-10 flex-1 h-9 px-6 text-sm font-bold rounded-full text-center transition-colors duration-300 ease-apple ${activeTab === "resources" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"}`}>
                        Resources
                      </button>
                    </div>
                    <div className="min-h-[400px]">
                      <div key={activeTab} className="animate-in fade-in duration-500 ease-apple">
                        {activeTab === "overview" ? (
                          <OverviewTab project={selectedProject} onUpdate={handleBriefingUpdate} onUpdateCtx={updateCtx} isDemo={isDemo} />
                        ) : (
                          <div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-slate-500 text-sm font-semibold mr-2">Filter by:</p>
                                <button onClick={() => setResourceFilter(null)}
                                  className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ease-apple active:scale-95 ${resourceFilter === null ? "bg-indigo-600 text-slate-50 border-indigo-600 shadow-md shadow-indigo-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
                                  All
                                </button>
                                {uniqueTags.map(tag => (
                                  <button key={tag} onClick={() => setResourceFilter(tag === resourceFilter ? null : tag)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ease-apple active:scale-95 ${resourceFilter === tag ? "bg-indigo-600 text-slate-50 border-indigo-600 shadow-md shadow-indigo-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
                                    {tag}
                                  </button>
                                ))}
                              </div>
                              {!isDemo && (
                                <Button variant="primary" onClick={() => { setEditingResource(null); setIsResourceModalOpen(true); }} className="pl-6 pr-8 w-full md:w-auto">
                                  <Plus className="w-5 h-5" /> Add Resource
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {filteredResources.map(resource => (
                                <div key={resource.id} className="group bg-slate-50 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-apple flex flex-col h-full border border-slate-200">
                                  {resource.type === "image" && (
                                    <div className="h-40 bg-slate-100 w-full relative cursor-pointer overflow-hidden" onClick={() => window.open(resource.url, "_blank")}>
                                      <img src={resource.url} alt={resource.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Preview"; }} />
                                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                        <div className="bg-slate-50/90 p-3 rounded-full backdrop-blur-md shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                          <ExternalLink className="w-6 h-6 text-slate-900" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {resource.type === "document" && (
                                    <div className="h-40 bg-indigo-50 w-full cursor-pointer flex flex-col items-center justify-center border-b border-indigo-100 overflow-hidden" onClick={() => window.open(resource.url, "_blank")}>
                                      <div className="w-20 h-20 bg-slate-50 rounded-3xl shadow-lg shadow-indigo-100 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 ease-apple">
                                        <FileIcon className="w-10 h-10 text-indigo-500" />
                                      </div>
                                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Document</span>
                                    </div>
                                  )}
                                  {resource.type === "link" && (
                                    <div className="h-40 bg-blue-50 w-full cursor-pointer flex flex-col items-center justify-center border-b border-blue-100 overflow-hidden" onClick={() => window.open(resource.url, "_blank")}>
                                      <div className="w-20 h-20 bg-slate-50 rounded-3xl shadow-lg shadow-blue-100 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 ease-apple">
                                        <LinkIcon className="w-10 h-10 text-blue-500" />
                                      </div>
                                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Web Link</span>
                                    </div>
                                  )}
                                  <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className={`p-2.5 rounded-xl ${resource.type === "link" ? "bg-blue-50 text-blue-600" : resource.type === "image" ? "bg-purple-50 text-purple-600" : "bg-indigo-50 text-indigo-600"}`}>
                                        {resource.type === "link" && <LinkIcon className="w-5 h-5" />}
                                        {resource.type === "image" && <ImageIcon className="w-5 h-5" />}
                                        {resource.type === "document" && <FileIcon className="w-5 h-5" />}
                                      </div>
                                      {!isDemo && (
                                        <div className="flex gap-1 -mr-2">
                                          <Button variant="icon" onClick={() => { setEditingResource(resource); setIsResourceModalOpen(true); }} className="opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-indigo-600">
                                            <Edit2 className="w-4 h-4" />
                                          </Button>
                                          <Button variant="icon" onClick={() => deleteRes(resource.id)} className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-900 truncate mb-3 tracking-tight">{resource.title}</h3>
                                    {resource.description && <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed flex-1 font-medium">{resource.description}</p>}
                                    <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                                      <div className="flex flex-wrap gap-2">
                                        {resource.tags?.slice(0, 2).map((tag, i) => (
                                          <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200">{tag}</span>
                                        ))}
                                        {resource.tags?.length > 2 && <span className="text-[10px] text-slate-400 self-center pl-1 font-bold">+{resource.tags.length - 2}</span>}
                                      </div>
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                        className="p-2.5 rounded-full hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <ExternalLink className="w-5 h-5" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {!isDemo && (
                                <button onClick={() => { setEditingResource(null); setIsResourceModalOpen(true); }}
                                  className="rounded-[28px] border-2 border-dashed border-slate-300/80 flex flex-col items-center justify-center h-full min-h-[260px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300 p-8 group ease-apple">
                                  <div className="w-20 h-20 rounded-[2rem] bg-slate-100 group-hover:bg-indigo-100 transition-colors mb-6 flex items-center justify-center duration-300">
                                    <Plus className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                  </div>
                                  <span className="font-bold text-xl tracking-tight">Add Resource</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in-95 duration-500 ease-apple px-6">
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <Folder className="w-16 h-16 text-slate-300" />
                </div>
                <p className="text-xl font-bold text-slate-900 mb-2">Ready to work?</p>
                <p className="text-slate-500 mb-8 text-center">Select a project from the sidebar to begin</p>
                <button onClick={() => setSidebarOpen(true)} className="md:hidden mb-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  <Menu className="w-4 h-4" /> Open projects
                </button>
                {!isDemo && (
                  <Button className="pl-6 pr-8 py-3.5 text-base shadow-lg shadow-indigo-200" onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}>
                    <Plus className="w-5 h-5" /> Create First Project
                  </Button>
                )}
              </div>
            )}

            {!isDemo && isResourceModalOpen && <ResourceModal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} onSubmit={handleSaveResource} resource={editingResource} />}
            {!isDemo && isProjectModalOpen && (
              <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={editingProject}
                onSubmit={data => { editingProject ? updateProject(editingProject.id, data) : createProject(data); setIsProjectModalOpen(false); }}
                onDelete={id => { deleteProject(id); setIsProjectModalOpen(false); }} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
