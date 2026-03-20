import React, { useState, useEffect, useRef } from "react";
import {
  Folder,
  PauseCircle,
  PlayCircle,
  Plus,
  MoreVertical,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  MessageCircle,
  ExternalLink,
  Trash2,
  X,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Edit2,
  File as FileIcon,
  Calendar,
  Settings,
  PanelLeft,
  Infinity as InfinityIcon,
  LogOut,
  Loader2,
  AlertCircle,
  CheckSquare,
  RotateCcw,
  List,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
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

// --- UI Components ---

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md border border-transparent",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm",
    tertiary: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent border border-transparent",
    soft: "bg-indigo-50 text-indigo-900 hover:bg-indigo-100 shadow-none border border-transparent",
    amber: "bg-amber-50 text-amber-900 hover:bg-amber-100 shadow-none border border-transparent",
    destructive: "text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent border border-transparent",
    icon: "p-2 text-slate-400 hover:text-indigo-900 hover:bg-indigo-50 rounded-full border border-transparent",
    google: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm relative",
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

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[24px] shadow-sm border border-slate-200 ${className}`}>{children}</div>
);

const Input = ({ className = "", ...props }) => (
  <input className={`w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-300 transition-all duration-200 ease-apple placeholder:text-slate-400 ${className}`} {...props} />
);

const TextArea = ({ className = "", ...props }) => (
  <textarea className={`w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-300 transition-all duration-200 ease-apple placeholder:text-slate-400 resize-none ${className}`} {...props} />
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

  const toggleTag = (tag) => setSelectedTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    onSubmit({ id: resource?.id || null, type: resourceType, title: fd.get("title"), url: fd.get("url"), description: fd.get("description"), tags: selectedTags });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 ease-apple flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-xl text-slate-900">{resource ? "Edit Resource" : "Add New Resource"}</h3>
          <Button variant="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-8 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Resource Type</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-full border border-slate-200">
                  {["link", "image", "document"].map(type => (
                    <button key={type} type="button" onClick={() => setResourceType(type)}
                      className={`flex-1 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ease-apple ${resourceType === type ? "bg-white shadow-sm text-indigo-900 ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700"}`}>
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
                  <Button type="button" variant="secondary" onClick={handleAddCustomTag} className="px-4">Add</Button>
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
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ease-apple bg-white border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95">
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
  if (!isOpen) return null;
  const isEditing = !!project;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 ease-apple" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-900">{isEditing ? "Edit Project" : "Create New Project"}</h3>
          <Button variant="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-8">
          <form onSubmit={e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            onSubmit({ title: fd.get("title"), client: fd.get("client"), startDate: fd.get("startDate"), description: fd.get("description") });
            onClose();
          }}>
            <div className="space-y-6">
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

// --- Login Screen ---
const LoginScreen = ({ onLogin, loading, error }) => (
  <div className="flex h-screen w-full items-center justify-center bg-[#F2F4F6] p-4">
    <div className="text-center space-y-6 max-w-md w-full px-6 animate-in fade-in zoom-in-95 duration-500 ease-apple">
      <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-200 mb-8 hover:scale-105 transition-transform duration-300 ease-apple">
        <InfinityIcon className="w-12 h-12 text-white" />
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Continuum</h1>
        <p className="text-slate-500 text-lg font-medium">Your digital second brain for creative work.</p>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm flex items-center gap-3 text-left">
          <AlertCircle className="w-5 h-5 shrink-0" /><p>{error}</p>
        </div>
      )}
      <div className="pt-8">
        <Button onClick={onLogin} variant="google" className="w-full py-4 text-lg gap-3 hover:shadow-lg" disabled={loading}>
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Connecting...</> : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-slate-400 mt-8 font-medium">Securely synced with Firebase</p>
    </div>
  </div>
);

// --- Where I Am Card ---
const WhereIAmCard = ({ project, onUpdate }) => {
  const [local, setLocal] = useState(project?.whereIAm || "");
  const textareaRef = useRef(null);

  useEffect(() => { setLocal(project?.whereIAm || ""); }, [project?.id]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [local]);

  useEffect(() => {
    if (!project) return;
    const t = setTimeout(() => { if (local !== (project.whereIAm || "")) onUpdate({ whereIAm: local }); }, 1000);
    return () => clearTimeout(t);
  }, [local]);

  return (
    <Card className="p-6 shadow-md shadow-slate-200/50">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Where I am</span>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full bg-transparent focus:outline-none text-slate-700 leading-relaxed resize-none placeholder:text-slate-300 text-sm font-light min-h-[80px]"
        placeholder="Current phase, what just happened, where things stand..."
        value={local}
        onChange={e => setLocal(e.target.value)}
      />
    </Card>
  );
};

// --- Don't Forget Card ---
const DontForgetCard = ({ project, onUpdate }) => {
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
    if (mode === "text" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [localText, mode]);

  useEffect(() => {
    if (!project) return;
    const t = setTimeout(() => { if (localText !== (project.dontForget || "")) onUpdate({ dontForget: localText }); }, 1000);
    return () => clearTimeout(t);
  }, [localText]);

  const switchMode = () => {
    const next = mode === "text" ? "checklist" : "text";
    setMode(next);
    onUpdate({ dontForgetMode: next });
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const updated = [...items, { id: generateId(), text: newItem.trim(), checked: false }];
    setItems(updated);
    setNewItem("");
    onUpdate({ dontForgetItems: updated });
  };

  const toggleItem = (id) => {
    const updated = items.map(it => it.id === id ? { ...it, checked: !it.checked } : it);
    setItems(updated);
    onUpdate({ dontForgetItems: updated });
  };

  const deleteItem = (id) => {
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    onUpdate({ dontForgetItems: updated });
  };

  return (
    <Card className="p-6 shadow-md shadow-slate-200/50">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Don't forget</span>
        <button onClick={switchMode}
          className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-full transition-all ease-apple active:scale-95">
          {mode === "text"
            ? <><CheckSquare className="w-3 h-3" /> Checklist</>
            : <><List className="w-3 h-3" /> Text</>}
        </button>
      </div>

      {mode === "text" ? (
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent focus:outline-none text-slate-700 leading-relaxed resize-none placeholder:text-slate-300 text-sm font-light min-h-[80px]"
          placeholder="Key constraints, decisions, things you'd forget after switching clients for a few days..."
          value={localText}
          onChange={e => setLocalText(e.target.value)}
        />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 group">
              <button onClick={() => toggleItem(item.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ease-apple active:scale-95 ${item.checked ? "bg-indigo-500 border-indigo-500" : "border-slate-300 hover:border-indigo-400"}`}>
                {item.checked && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className={`text-sm flex-1 leading-relaxed ${item.checked ? "line-through text-slate-300" : "text-slate-700"}`}>{item.text}</span>
              <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-400 transition-all ease-apple">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100">
            <div className="w-5 h-5 rounded-md border-2 border-dashed border-slate-200 shrink-0" />
            <input
              className="text-sm text-slate-500 bg-transparent focus:outline-none placeholder:text-slate-300 flex-1"
              placeholder="Add item..."
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addItem(); }}
            />
            {newItem && (
              <button onClick={addItem} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
                Add
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

// --- Overview Tab ---
const OverviewTab = ({ project, onUpdate, onUpdateCtx }) => {
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
    if (!content.trim()) return;
    const newNote = { id: generateId(), type: "question", content, timestamp: new Date().toLocaleDateString(), isResolved: false };
    onUpdateCtx("notes", [newNote, ...(project.notes || [])]);
  };

  const deleteNote = (id) => onUpdateCtx("notes", (project.notes || []).filter(n => n.id !== id));

  const toggleNoteRes = (id) => onUpdateCtx("notes", (project.notes || []).map(n => n.id === id ? { ...n, isResolved: !n.isResolved } : n));

  const startEditing = (note, e) => {
    e.stopPropagation();
    setEditingId(note.id);
    setEditContent(note.content);
    setActiveMenuId(null);
  };

  const saveEdit = () => {
    if (editContent.trim()) {
      onUpdateCtx("notes", (project.notes || []).map(n => n.id === editingId ? { ...n, content: editContent } : n));
    }
    setEditingId(null);
  };

  const activeQuestions = (project.notes || []).filter(n => !n.isResolved && n.type === "question");
  const resolvedQuestions = (project.notes || []).filter(n => n.isResolved && n.type === "question");

  return (
    <div className="space-y-4">
      {/* Briefing cards — side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WhereIAmCard project={project} onUpdate={onUpdate} />
        <DontForgetCard project={project} onUpdate={onUpdate} />
      </div>

      {/* Questions card — full width */}
      <Card className="p-6 shadow-md shadow-slate-200/50">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions</span>
        </div>

        {/* Input row */}
        <div className="flex gap-3 mb-6">
          <Input
            id="new-question"
            placeholder="What do you need to ask?"
            className="focus:ring-amber-200 focus:border-amber-300"
            onKeyDown={e => {
              if (e.key === "Enter") { addQuestion(e.target.value); e.target.value = ""; }
            }}
          />
          <Button variant="amber" className="shrink-0 px-5"
            onClick={() => { const el = document.getElementById("new-question"); addQuestion(el.value); el.value = ""; }}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        {/* Active questions */}
        {activeQuestions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <MessageCircle className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 font-medium text-sm">No open questions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeQuestions.map(note => (
              <div key={note.id} className="group flex items-start gap-4 p-4 bg-amber-50/60 border border-amber-100 rounded-2xl hover:border-amber-200 transition-all ease-apple">
                <button onClick={() => toggleNoteRes(note.id)}
                  className="mt-0.5 w-8 h-8 rounded-full border-2 border-amber-200 text-amber-500 bg-white flex items-center justify-center hover:bg-amber-100 hover:scale-110 transition-all ease-apple shrink-0">
                  <Circle className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <TextArea className="bg-white text-sm" value={editContent} onChange={e => setEditContent(e.target.value)} rows={2} autoFocus />
                      <div className="flex gap-2 justify-end">
                        <Button variant="tertiary" onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs">Cancel</Button>
                        <Button variant="primary" onClick={saveEdit} className="px-3 py-1.5 text-xs">Save</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-800 text-sm leading-relaxed">{note.content}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">{note.timestamp}</p>
                    </>
                  )}
                </div>
                <div className="relative shrink-0">
                  <Button variant="icon" className="opacity-0 group-hover:opacity-100 w-8 h-8"
                    onClick={e => { e.stopPropagation(); setActiveMenuId(activeMenuId === note.id ? null : note.id); }}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  {activeMenuId === note.id && (
                    <div className="absolute right-0 top-9 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={e => startEditing(note, e)} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 font-medium">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={e => { e.stopPropagation(); deleteNote(note.id); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolved history — collapsed by default */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <button onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-indigo-600 transition-colors mb-4 ease-apple">
            {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            History {resolvedQuestions.length > 0 && `(${resolvedQuestions.length})`}
          </button>
          {showHistory && (
            <div className="space-y-3 pl-4 border-l-2 border-slate-100">
              {resolvedQuestions.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No resolved questions yet.</p>
              ) : resolvedQuestions.map(note => (
                <div key={note.id} className="opacity-60 hover:opacity-100 transition-opacity flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-sm text-slate-600 line-through decoration-slate-300 flex-1">{note.content}</p>
                  <Button variant="tertiary" onClick={() => toggleNoteRes(note.id)} className="text-xs px-2 py-1 shrink-0">Undo</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [authError, setAuthError] = useState(null);
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
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (currentUser && currentUser.isAnonymous) { signOut(auth); return; }
      setUser(currentUser);
      setLoading(false);
      if (currentUser) setAuthError(null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) { setProjects([]); return; }
    const ref = collection(db, "artifacts", appId, "users", user.uid, "projects");
    const unsub = onSnapshot(query(ref), snapshot => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(loaded);
      if (loaded.length > 0) setSelectedId(prev => loaded.find(p => p.id === prev) ? prev : loaded[0].id);
    }, err => console.error(err));
    return () => unsub();
  }, [user]);

  const handleLogin = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      if (err.code === "auth/unauthorized-domain") setAuthError("Domain not authorized in Firebase.");
      else if (err.code === "auth/popup-closed-by-user") setAuthError("Sign-in cancelled.");
      else setAuthError("Failed to sign in.");
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const updateProject = async (projectId, data) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", projectId), { ...data, lastUpdated: new Date().toISOString() });
    } catch (e) { console.error(e); }
  };

  const createProject = async (data) => {
    if (!user) return;
    try {
      const ref = await addDoc(collection(db, "artifacts", appId, "users", user.uid, "projects"), {
        status: "active", lastUpdated: new Date().toISOString(),
        whereIAm: "", dontForget: "", dontForgetMode: "text", dontForgetItems: [],
        notes: [], resources: [], ...data,
      });
      setSelectedId(ref.id);
    } catch (e) { console.error(e); }
  };

  const deleteProject = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) { console.error(e); }
  };

  const selectedProject = projects.find(p => p.id === selectedId);
  const activeProjects = projects.filter(p => p.status === "active");
  const pausedProjects = projects.filter(p => p.status === "paused");
  const completedProjects = projects.filter(p => p.status === "completed");

  const updateCtx = (field, value) => { if (selectedId) updateProject(selectedId, { [field]: value }); };
  const handleBriefingUpdate = (fields) => { if (selectedId) updateProject(selectedId, fields); };
  const toggleStatus = (id) => { const p = projects.find(x => x.id === id); if (p) updateProject(id, { status: p.status === "active" ? "paused" : "active" }); };
  const markCompleted = (id) => updateProject(id, { status: "completed" });
  const reopenProject = (id) => updateProject(id, { status: "active" });

  const handleSaveResource = (data) => {
    if (!selectedProject) return;
    if (data.id) {
      updateCtx("resources", selectedProject.resources.map(r => r.id === data.id ? { ...r, ...data } : r));
    } else {
      const { id: _, ...rest } = data;
      updateCtx("resources", [{ id: generateId(), ...rest }, ...(selectedProject.resources || [])]);
    }
  };

  const deleteRes = (id) => { if (selectedProject) updateCtx("resources", selectedProject.resources.filter(r => r.id !== id)); };
  const uniqueTags = selectedProject ? [...new Set(selectedProject.resources.flatMap(r => r.tags || []))] : [];
  const filteredResources = selectedProject ? selectedProject.resources.filter(r => !resourceFilter || (r.tags && r.tags.includes(resourceFilter))) : [];
  const handleScroll = e => setIsScrolled(e.target.scrollTop > 60);

  if (loading || !user) return <LoginScreen onLogin={handleLogin} loading={loading} error={authError} />;

  const SidebarItem = ({ project }) => (
    <div onClick={() => setSelectedId(project.id)}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ease-apple mb-1 mr-4 ${selectedId === project.id ? "bg-indigo-50 text-indigo-900 font-semibold" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}>
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-110 ${selectedId === project.id ? "bg-indigo-500" : project.status === "active" ? "bg-slate-300" : project.status === "completed" ? "bg-emerald-300" : "bg-amber-200"}`} />
      <p className="text-sm font-medium truncate">{project.title}</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .ease-apple { transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>
      <div className="flex h-screen text-slate-900 overflow-hidden bg-[#F2F4F6]">

        {/* Sidebar */}
        <div className={`${isSidebarOpen ? "w-80" : "w-0"} bg-white flex-shrink-0 transition-all duration-500 ease-apple flex flex-col h-full shadow-2xl z-20 overflow-hidden`}>
          <div className="p-6 pb-4 min-w-[320px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-slate-800 font-extrabold text-xl tracking-tight">
                <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200/50">
                  <InfinityIcon className="w-5 h-5" />
                </div>
                <span>Continuum</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors active:scale-95">
                <PanelLeft className="w-5 h-5" />
              </button>
            </div>
            <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-200 ease-apple active:scale-95">
              <Plus className="w-5 h-5" /> New Project
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-w-[320px] px-2">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Active</h3>
              {activeProjects.map(p => <SidebarItem key={p.id} project={p} />)}
            </div>
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">On Hold</h3>
              {pausedProjects.map(p => <SidebarItem key={p.id} project={p} />)}
            </div>
            <div className="mb-8">
              <button onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
                className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4 hover:text-indigo-600 transition-colors">
                Completed {isCompletedExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {isCompletedExpanded && completedProjects.map(p => <SidebarItem key={p.id} project={p} />)}
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 min-w-[320px]">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all ease-apple active:scale-95">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {!isSidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              className="absolute left-6 top-8 z-10 p-2.5 bg-white/80 backdrop-blur-md hover:bg-white hover:shadow-md rounded-full text-slate-500 hover:text-indigo-600 transition-all duration-300 ease-apple border border-slate-200/50">
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          {selectedProject ? (
            <>
              {/* Sticky header */}
              <div className={`absolute top-0 left-0 right-0 bg-white/85 backdrop-blur-xl z-20 border-b border-slate-200/50 transition-all duration-500 ease-apple transform ${isScrolled ? "translate-y-0 opacity-100 shadow-sm" : "-translate-y-full opacity-0"}`}>
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 truncate mr-4 tracking-tight">{selectedProject.title}</h2>
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
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12 scroll-smooth" onScroll={handleScroll}>
                <header className="py-12 md:py-16">
                  <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <Badge color={selectedProject.status === "active" ? "green" : selectedProject.status === "completed" ? "blue" : "amber"}>
                        {selectedProject.status === "active" ? "Active" : selectedProject.status === "completed" ? "Completed" : "Paused"}
                      </Badge>
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
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-8 break-words leading-[1.1]">
                      {selectedProject.title}
                    </h1>

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
                </header>

                <div className="max-w-5xl mx-auto">
                  {/* Tabs */}
                  <div className="relative flex items-center bg-white p-1 rounded-full w-full max-w-xs shadow-sm border border-slate-200 mb-8">
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-100 rounded-full transition-all duration-300 ease-apple ${activeTab === "overview" ? "left-1" : "left-[50%]"}`} />
                    <button onClick={() => setActiveTab("overview")}
                      className={`relative z-10 flex-1 h-9 px-6 text-sm font-bold rounded-full text-center transition-colors duration-300 ease-apple ${activeTab === "overview" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"}`}>
                      Overview
                    </button>
                    <button onClick={() => setActiveTab("resources")}
                      className={`relative z-10 flex-1 h-9 px-6 text-sm font-bold rounded-full text-center transition-colors duration-300 ease-apple ${activeTab === "resources" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"}`}>
                      Resources
                    </button>
                  </div>

                  {/* Tab content */}
                  <div className="min-h-[400px]">
                    <div key={activeTab} className="animate-in fade-in duration-500 ease-apple">
                      {activeTab === "overview" ? (
                        <OverviewTab project={selectedProject} onUpdate={handleBriefingUpdate} onUpdateCtx={updateCtx} />
                      ) : (
                        <div>
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-slate-500 text-sm font-semibold mr-2">Filter by:</p>
                              <button onClick={() => setResourceFilter(null)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ease-apple active:scale-95 ${resourceFilter === null ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
                                All
                              </button>
                              {uniqueTags.map(tag => (
                                <button key={tag} onClick={() => setResourceFilter(tag === resourceFilter ? null : tag)}
                                  className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ease-apple active:scale-95 ${resourceFilter === tag ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
                                  {tag}
                                </button>
                              ))}
                            </div>
                            <Button variant="primary" onClick={() => { setEditingResource(null); setIsResourceModalOpen(true); }} className="pl-6 pr-8 w-full md:w-auto">
                              <Plus className="w-5 h-5" /> Add Resource
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredResources.map(resource => (
                              <div key={resource.id} className="group bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-apple flex flex-col border border-slate-100">
                                {resource.type === "image" && (
                                  <div className="h-40 bg-slate-100 w-full relative cursor-pointer overflow-hidden" onClick={() => window.open(resource.url, "_blank")}>
                                    <img src={resource.url} alt={resource.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                      onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Preview"; }} />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                      <div className="bg-white/90 p-3 rounded-full backdrop-blur-md shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <ExternalLink className="w-6 h-6 text-slate-900" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {resource.type === "document" && (
                                  <div className="h-40 bg-indigo-50 w-full cursor-pointer flex flex-col items-center justify-center border-b border-indigo-100" onClick={() => window.open(resource.url, "_blank")}>
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg shadow-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                      <FileIcon className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Document</span>
                                  </div>
                                )}
                                {resource.type === "link" && (
                                  <div className="h-40 bg-blue-50 w-full cursor-pointer flex flex-col items-center justify-center border-b border-blue-100" onClick={() => window.open(resource.url, "_blank")}>
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg shadow-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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
                                    <div className="flex gap-1 -mr-2">
                                      <Button variant="icon" onClick={() => { setEditingResource(resource); setIsResourceModalOpen(true); }} className="opacity-0 group-hover:opacity-100 hover:bg-slate-50 hover:text-indigo-600">
                                        <Edit2 className="w-4 h-4" />
                                      </Button>
                                      <Button variant="icon" onClick={() => deleteRes(resource.id)} className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <h3 className="font-bold text-xl text-slate-900 truncate mb-3 tracking-tight">{resource.title}</h3>
                                  {resource.description && <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed flex-1 font-medium">{resource.description}</p>}
                                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                      {resource.tags?.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">{tag}</span>
                                      ))}
                                      {resource.tags?.length > 2 && <span className="text-[10px] text-slate-400 self-center pl-1 font-bold">+{resource.tags.length - 2}</span>}
                                    </div>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 transition-colors">
                                      <ExternalLink className="w-5 h-5" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button onClick={() => { setEditingResource(null); setIsResourceModalOpen(true); }}
                              className="rounded-[28px] border-2 border-dashed border-slate-300/80 flex flex-col items-center justify-center min-h-[260px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300 p-8 group ease-apple">
                              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 group-hover:bg-indigo-100 transition-colors mb-6 flex items-center justify-center duration-300">
                                <Plus className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                              </div>
                              <span className="font-bold text-xl tracking-tight">Add Resource</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isResourceModalOpen && <ResourceModal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} onSubmit={handleSaveResource} resource={editingResource} />}
              {isProjectModalOpen && (
                <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={editingProject}
                  onSubmit={data => { editingProject ? updateProject(editingProject.id, data) : createProject(data); setIsProjectModalOpen(false); }}
                  onDelete={id => { deleteProject(id); setIsProjectModalOpen(false); }} />
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in-95 duration-500 ease-apple">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Folder className="w-16 h-16 text-slate-300" />
              </div>
              <p className="text-xl font-bold text-slate-900 mb-2">Ready to work?</p>
              <p className="text-slate-500 mb-8">Select a project from the sidebar to begin</p>
              <Button className="pl-6 pr-8 py-3.5 text-base shadow-lg shadow-indigo-200" onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}>
                <Plus className="w-5 h-5" /> Create First Project
              </Button>
              {isProjectModalOpen && (
                <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={null}
                  onSubmit={data => { createProject(data); setIsProjectModalOpen(false); }} onDelete={() => {}} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
