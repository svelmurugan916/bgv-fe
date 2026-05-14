import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ShieldAlert, Fingerprint, Building2,
    ShieldCheck, Zap, ArrowRight, BrainCircuit,
    Activity, Cpu, X, AlertTriangle,
    ChevronRight, Terminal, CheckCircle2, Clock
} from 'lucide-react';

// ─── DESIGN TOKENS (LIGHT THEME) ─────────────────────────────────────────────
const tokens = {
    bg: {
        base:    '#F8F9FC',
        surface: 'rgba(99,102,241,0.025)',
        card:    '#FFFFFF',
        hover:   'rgba(99,102,241,0.03)',
    },
    border: {
        subtle: 'rgba(15,23,42,0.08)',
        accent: 'rgba(99,102,241,0.22)',
    },
    glow: {
        indigo: '0 4px 24px -4px rgba(99,102,241,0.13)',
        cyan:   '0 4px 24px -4px rgba(34,211,238,0.08)',
        red:    '0 4px 24px -4px rgba(239,68,68,0.1)',
    }
};

// ─── SEVERITY CONFIG ──────────────────────────────────────────────────────────
const severityConfig = {
    MAJOR: {
        dot:    'bg-rose-500',
        bg:     'bg-rose-50',
        text:   'text-rose-600',
        border: 'border-rose-200',
        glow:   '0 0 0px transparent',
    },
    MINOR: {
        dot:    'bg-amber-400',
        bg:     'bg-amber-50',
        text:   'text-amber-700',
        border: 'border-amber-200',
        glow:   '0 0 0px transparent',
    },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockResponse = {
    riskRating: "RED 🔴",
    executiveSummary: [
        "The candidate (Case: BGV-V-9904) presents a high-risk profile with a trust score of 40 and an overall status of Insufficiency. Despite initial engagement, the candidate is currently unreachable after 12 follow-up attempts, indicating a lack of responsiveness and cooperation.",
        "Core identity checks (Aadhaar, PAN, Criminal) are clear, confirming baseline identity authenticity. However, several critical verifications remain incomplete: passport verification is pending due to missing documentation, and education verification is blocked due to lack of authorization.",
        "Education verification shows discrepancies, including a minor mismatch in father's name (resolved) and a difference in department. Combined with major blockers such as unreachability and failed address verification, the overall risk remains significantly elevated.",
    ],
    blockers: [
        "Candidate unreachable despite 12 follow-up attempts",
        "Passport verification incomplete (missing back page)",
        "Education verification blocked (authorization letter not provided)",
        "Reference checks failed (invalid/switched-off contact numbers)",
        "Address unverifiable (door locked across 3 visits; neighbors unaware)",
        "Employment verification pending (no response from previous employer)",
    ],
    heaviestBlocker: "Candidate unreachable despite 12 follow-up attempts",
    discrepancy: [
        { checkType: "EDUCATION", field: "Father Name", claimed: "Candidate provided (slight mismatch)", verified: "University records (resolved)",    severity: "MINOR" },
        { checkType: "EDUCATION", field: "Department",  claimed: "Candidate stated department",          verified: "Different per university records", severity: "MAJOR" },
    ],
    finalRecommendation:
        "Do Not Proceed. Place hiring on hold until all critical insufficiencies are resolved. If the candidate fails to respond within a defined SLA (3–5 business days), it is recommended to reject the candidature.",
};

// ─── TYPEWRITER TEXT ──────────────────────────────────────────────────────────
const TypewriterText = ({ text, speed = 11, delay = 0, onComplete, className = '' }) => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone]           = useState(false);

    useEffect(() => {
        setDisplayed('');
        setDone(false);
        let charIndex = 0;
        let intervalId;

        const timeoutId = setTimeout(() => {
            intervalId = setInterval(() => {
                charIndex++;
                setDisplayed(text.slice(0, charIndex));
                if (charIndex >= text.length) {
                    clearInterval(intervalId);
                    setDone(true);
                    onComplete?.();
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [text]);

    return (
        <span className={className}>
            {displayed}
            {!done && (
                <motion.span
                    className="inline-block w-[2px] h-[0.85em] bg-indigo-500 ml-[1px] align-text-bottom rounded-sm"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.45, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                />
            )}
        </span>
    );
};

// ─── TRIGGER BUTTON ──────────────────────────────────────────────────────────
const TriggerButton = ({ onClick, disabled }) => (
    <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.975 }}
        onClick={onClick}
        disabled={disabled}
        className="relative group outline-none"
    >
        {/* Glow border on hover */}
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
                        opacity-0 group-hover:opacity-30 blur-[2px] transition-all duration-400" />

        <div
            className="relative flex items-center gap-2.5 rounded-xl px-4 py-2"
            style={{
                background: '#FFFFFF',
                border: '1px solid rgba(99,102,241,0.18)',
                boxShadow: '0 1px 4px rgba(15,23,42,0.07), 0 0 0 1px rgba(99,102,241,0.05)',
            }}
        >
            {/* Icon */}
            <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-indigo-500 rounded-md blur-sm opacity-20 group-hover:opacity-35 transition-opacity duration-300" />
                <div className="relative flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600">
                    <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
            </div>

            {/* Label */}
            <span
                className="text-[11px] font-semibold tracking-wide whitespace-nowrap"
                style={{
                    background: 'linear-gradient(90deg, #4338ca, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {disabled ? "Engine Running…" : "AI Summary"}
            </span>

            {/* Trailing icon */}
            {disabled ? (
                <motion.div
                    className="h-2.5 w-2.5 rounded-full border border-indigo-300 border-t-indigo-500 flex-shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            ) : (
                <ChevronRight
                    className="h-3 w-3 text-indigo-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                />
            )}
        </div>
    </motion.button>
);

// ─── NEURAL LOADER (Simple Shimmer Labels) ────────────────────────────────────
const NeuralLoader = ({ step, sequence }) => (
    <motion.div
        key="loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-h-[500px] flex-col items-center justify-center gap-10"
    >
        <style>{`
            @keyframes shimmerSweep {
                0%   { background-position: 160% center; }
                100% { background-position: -60% center; }
            }
            @keyframes gradientRotate {
                0%   { transform: rotate(0deg);   }
                100% { transform: rotate(360deg); }
            }
        `}</style>

        {/* ── SINGLE FOCAL ICON ── */}
        <div className="relative flex items-center justify-center w-16 h-16">

            {/* Spinning gradient ring */}
            <div
                className="absolute inset-0 rounded-2xl"
                style={{
                    padding: '1.5px',
                    background: 'conic-gradient(from 0deg, #e0e7ff, #6366f1, #a5b4fc, #e0e7ff)',
                    borderRadius: '18px',
                    animation: 'gradientRotate 2.4s linear infinite',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            {/* Static white fill behind icon */}
            <div
                className="absolute inset-[2px] rounded-[16px]"
                style={{
                    background: 'linear-gradient(135deg, #F8F9FF 0%, #EEF2FF 100%)',
                }}
            />

            {/* Icon — single slow pulse */}
            <motion.div
                className="relative z-10 flex items-center justify-center"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <BrainCircuit className="h-6 w-6 text-indigo-500" />
            </motion.div>
        </div>

        {/* ── STEP LABEL LIST ── */}
        <div className="flex flex-col items-start gap-4 w-56">
            {sequence.map((item, i) => {
                const isDone    = i < step;
                const isActive  = i === step;
                const isPending = i > step;

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: isPending ? 0.22 : 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="flex items-center gap-3"
                    >
                        <div className="flex-shrink-0 w-4 flex justify-center">
                            {isDone ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                            ) : isActive ? (
                                <motion.div
                                    className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            ) : (
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                            )}
                        </div>

                        {isActive ? (
                            <span
                                className="text-sm font-semibold select-none"
                                style={{
                                    background: 'linear-gradient(90deg, #94a3b8 0%, #6366f1 38%, #a5b4fc 52%, #94a3b8 100%)',
                                    backgroundSize: '280% 100%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    animation: 'shimmerSweep 1.7s linear infinite',
                                }}
                            >
                                {item.label}
                            </span>
                        ) : (
                            <span className={`text-sm font-semibold ${
                                isDone ? 'text-slate-700' : 'text-slate-300'
                            }`}>
                                {item.label}
                            </span>
                        )}
                    </motion.div>
                );
            })}
        </div>

        {/* ── SLIM PROGRESS BAR ── */}
        <div className="w-56">
            <div
                className="h-[2px] w-full overflow-hidden rounded-full"
                style={{ background: 'rgba(99,102,241,0.1)' }}
            >
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6366F1, #a5b4fc)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${((step + 1) / sequence.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Processing</span>
                <span className="text-[9px] font-mono text-indigo-400">
                    {Math.round(((step + 1) / sequence.length) * 100)}%
                </span>
            </div>
        </div>
    </motion.div>
);


// ─── SECTION HEADER ──────────────────────────────────────────────────────────
const SectionHeader = ({ label, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-5">
        {Icon && <Icon className="h-3.5 w-3.5 text-indigo-400" />}
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</span>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent)' }} />
    </div>
);

// ─── SUMMARY CONTENT ─────────────────────────────────────────────────────────
const SummaryContent = ({ data, scrollRef }) => {
    const [phase, setPhase]             = useState(0);
    const [currentPara, setCurrentPara] = useState(0);
    const [tokenCount, setTokenCount]   = useState(0);
    const [isStreaming, setIsStreaming]  = useState(false);

    useEffect(() => {
        if (!data) return;
        const t = setTimeout(() => {
            setPhase(1);
            setIsStreaming(true);
        }, 700);
        return () => clearTimeout(t);
    }, [data]);

    useEffect(() => {
        if (!isStreaming) return;
        const id = setInterval(() => {
            setTokenCount(p => p + Math.floor(Math.random() * 9 + 3));
        }, 55);
        return () => clearInterval(id);
    }, [isStreaming]);

    if (!data) return null;

    const handleParaComplete = () => {
        setCurrentPara(prev => {
            const next = prev + 1;
            if (next >= data.executiveSummary.length) {
                setTimeout(() => setPhase(2), 350);
            }
            setTimeout(() => {
                scrollRef?.current?.scrollBy({ top: 120, behavior: 'smooth' });
            }, 80);
            return next;
        });
    };

    const handleFinalComplete = () => setIsStreaming(false);

    return (
        <motion.div
            key="content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto max-w-5xl space-y-6"
        >

            {/* ── ROW 1: RISK SCORE + PRIMARY BLOCKER ── */}
            <div className="grid grid-cols-12 gap-4">

                {/* Risk Score Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-12 md:col-span-4 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF8F8 100%)',
                        border: '1px solid rgba(239,68,68,0.14)',
                        boxShadow: tokens.glow.red,
                    }}
                >
                    <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-rose-100 blur-2xl" />
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-rose-500">
                            Risk Vector
                        </span>
                        <div className="flex items-end gap-3 mt-3">
                            <span
                                className="text-7xl font-black leading-none"
                                style={{
                                    background: 'linear-gradient(135deg, #F87171, #EF4444)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                RED
                            </span>
                        </div>
                    </div>

                    {/* Trust score bar */}
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <motion.span
                                    className="h-2 w-2 rounded-full bg-rose-500"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span className="text-xs text-rose-600/80 font-medium">
                                    Critical · Trust Score
                                </span>
                            </div>
                            <span className="text-xs font-black text-rose-600">40/100</span>
                        </div>
                        <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(239,68,68,0.08)' }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: 'linear-gradient(90deg, #EF4444, #F87171)' }}
                                initial={{ width: '0%' }}
                                animate={{ width: '40%' }}
                                transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Primary Blocker Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="col-span-12 md:col-span-8 rounded-2xl p-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #EEF2FF 0%, #E8EDFF 100%)',
                        border: `1px solid ${tokens.border.accent}`,
                        boxShadow: tokens.glow.indigo,
                    }}
                >
                    <ShieldAlert
                        className="absolute -right-4 -top-4 text-indigo-300/25"
                        size={120}
                        strokeWidth={1}
                    />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-500">
                        Primary Blocker
                    </span>
                    <p className="mt-3 text-xl font-bold text-slate-900 leading-snug tracking-tight">
                        "{data.heaviestBlocker}"
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {[
                            { label: '12 Follow-ups', icon: Activity },
                            { label: 'No Response',   icon: AlertTriangle },
                            { label: 'SLA Breached',  icon: Clock },
                        ].map(({ label, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex items-center gap-1.5 rounded-full px-3 py-1"
                                style={{
                                    background: 'rgba(255,255,255,0.7)',
                                    border: '1px solid rgba(99,102,241,0.15)',
                                }}
                            >
                                <Icon className="h-3 w-3 text-indigo-500" />
                                <span className="text-[10px] font-bold text-slate-600">{label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── ROW 2: EXECUTIVE NARRATIVE ── */}
            {phase >= 1 && (
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    <SectionHeader label="Executive Narrative" icon={Terminal} />
                    <div className="space-y-3">
                        {data.executiveSummary.map((text, i) => {
                            if (i > currentPara) return null;

                            const isCurrentlyTyping = i === currentPara && currentPara < data.executiveSummary.length;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative rounded-xl p-5 transition-all duration-300"
                                    style={{
                                        background: tokens.bg.card,
                                        border: `1px solid ${tokens.border.subtle}`,
                                        boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.border    = `1px solid ${tokens.border.accent}`;
                                        e.currentTarget.style.background = 'rgba(99,102,241,0.02)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.border    = `1px solid ${tokens.border.subtle}`;
                                        e.currentTarget.style.background = tokens.bg.card;
                                    }}
                                >
                                    <div
                                        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ background: 'linear-gradient(180deg, #6366F1, #22D3EE)' }}
                                    />
                                    <div className="flex gap-4">
                                        <span
                                            className="flex-shrink-0 mt-0.5 text-[10px] font-black font-mono text-indigo-400"
                                            style={{ minWidth: '2ch' }}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-sm leading-relaxed text-slate-600">
                                            {isCurrentlyTyping ? (
                                                <TypewriterText
                                                    text={text}
                                                    speed={11}
                                                    onComplete={handleParaComplete}
                                                />
                                            ) : text}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Generating pill */}
                        {phase === 1 && currentPara < data.executiveSummary.length && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 px-1 pt-1"
                            >
                                <div className="flex gap-[3px]">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            className="h-[3px] w-[3px] rounded-full bg-indigo-400"
                                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] text-indigo-400/80 font-mono">Generating response…</span>
                            </motion.div>
                        )}
                    </div>
                </motion.section>
            )}

            {/* ── ROW 3: BLOCKERS + DISCREPANCY ── */}
            {phase >= 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="grid grid-cols-12 gap-4"
                >
                    {/* Blockers */}
                    <section className="col-span-12 md:col-span-5">
                        <SectionHeader label="Active Blockers" icon={AlertTriangle} />
                        <div className="rounded-2xl overflow-hidden" style={{
                            background: tokens.bg.card,
                            border: `1px solid ${tokens.border.subtle}`,
                            boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
                        }}>
                            {data.blockers.map((blocker, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                                    style={{
                                        borderBottom: i < data.blockers.length - 1
                                            ? `1px solid ${tokens.border.subtle}`
                                            : 'none',
                                    }}
                                >
                                    <div
                                        className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full"
                                        style={{
                                            background: i === 0 ? '#EF4444' : `rgba(239,68,68,${Math.max(0.15, 0.7 - i * 0.1)})`,
                                        }}
                                    />
                                    <span className="text-xs text-slate-600 leading-relaxed">{blocker}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Discrepancy Matrix */}
                    <section className="col-span-12 md:col-span-7">
                        <SectionHeader label="Discrepancy Matrix" icon={Activity} />
                        <div className="rounded-2xl overflow-hidden" style={{
                            background: tokens.bg.card,
                            border: `1px solid ${tokens.border.subtle}`,
                            boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
                        }}>
                            {/* Table Head */}
                            <div
                                className="grid grid-cols-4 px-5 py-3"
                                style={{
                                    background: '#F8FAFC',
                                    borderBottom: `1px solid ${tokens.border.subtle}`,
                                }}
                            >
                                {['Check', 'Field', 'Claimed → Verified', 'Severity'].map((h, i) => (
                                    <span
                                        key={h}
                                        className={`text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ${i === 3 ? 'text-right' : ''}`}
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>

                            {/* Table Rows */}
                            {data.discrepancy.map((item, i) => {
                                const cfg = severityConfig[item.severity];
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.15 + i * 0.1 }}
                                        className="grid grid-cols-4 items-center px-5 py-4 transition-colors hover:bg-slate-50/70"
                                        style={{
                                            borderBottom: i < data.discrepancy.length - 1
                                                ? `1px solid ${tokens.border.subtle}`
                                                : 'none',
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                            <span className="text-xs font-bold text-slate-800">{item.checkType}</span>
                                        </div>

                                        <span className="text-xs font-mono text-slate-500">{item.field}</span>

                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-slate-400 line-through">{item.claimed}</span>
                                            <div className="flex items-center gap-1">
                                                <ArrowRight className="h-2.5 w-2.5 text-indigo-400/50 flex-shrink-0" />
                                                <span className="text-[10px] text-emerald-600 font-semibold">{item.verified}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <span className={`rounded-lg px-2.5 py-1 text-[9px] font-black tracking-wider ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                                {item.severity}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                </motion.div>
            )}

            {/* ── ROW 4: FINAL DETERMINATION ── */}
            {phase >= 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                    className="relative overflow-hidden rounded-2xl p-7"
                    style={{
                        background: 'linear-gradient(135deg, #EEF2FF 0%, #E8EDFF 60%, #EEF2FF 100%)',
                        border: `1px solid ${tokens.border.accent}`,
                        boxShadow: `${tokens.glow.indigo}, inset 0 1px 0 rgba(255,255,255,0.9)`,
                    }}
                >
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.35), rgba(99,102,241,0.15), transparent)' }}
                    />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/60 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-100/40 rounded-full blur-3xl" />

                    <div className="relative flex flex-col md:flex-row gap-6 items-start">
                        <div
                            className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{
                                background: 'rgba(99,102,241,0.08)',
                                border: '1px solid rgba(99,102,241,0.16)',
                            }}
                        >
                            <ShieldCheck className="h-7 w-7 text-indigo-500" />
                        </div>

                        <div className="space-y-2 flex-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500">
                                Final Determination
                            </span>
                            <p className="text-sm font-medium leading-relaxed text-slate-700">
                                <TypewriterText
                                    text={data.finalRecommendation}
                                    speed={13}
                                    delay={350}
                                    onComplete={handleFinalComplete}
                                />
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── FOOTER: live token counter ── */}
            {phase >= 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-between pt-1 pb-2"
                >
                    <span className="text-[9px] font-mono text-slate-400 tracking-wide">
                        Vantira Neural Engine v4.2 · Secure Audit Mode
                    </span>
                    <div className="flex items-center gap-2">
                        {isStreaming && (
                            <motion.div
                                className="h-1 w-1 rounded-full bg-indigo-400"
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                        )}
                        <span className="text-[9px] font-mono text-slate-400">
                            {tokenCount.toLocaleString()} tokens
                        </span>
                    </div>
                </motion.div>
            )}

        </motion.div>
    );
};

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
const AiSummaryManager = ({ caseId }) => {
    const [isOpen, setIsOpen]             = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [summaryData, setSummaryData]   = useState(null);
    const [loadingStep, setLoadingStep]   = useState(0);

    const scrollPaneRef = useRef(null);

    const loadingSequence = [
        { label: "Neural Core",  status: "Initializing Vantira…",       icon: Cpu         },
        { label: "Data Vault",   status: "Accessing Secure Records…",    icon: ShieldAlert },
        { label: "Identity",     status: "Mapping Criminal Databases…",  icon: Fingerprint },
        { label: "Credentials",  status: "Validating Academic History…", icon: Building2   },
        { label: "Synthesis",    status: "Calculating Risk Vectors…",    icon: Activity    },
    ];

    const handleGenerate = async () => {
        setIsOpen(true);
        setIsProcessing(true);
        setLoadingStep(0);

        const interval = setInterval(() => {
            setLoadingStep(prev => (prev < loadingSequence.length - 1 ? prev + 1 : prev));
        }, 1200);

        try {
            await new Promise(resolve => setTimeout(resolve, 6000));
            setSummaryData(mockResponse);
        } catch (err) {
            console.error('AI Generation Failed', err);
        } finally {
            clearInterval(interval);
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setSummaryData(null);
    };

    return (
        <div className="font-sans antialiased">
            <TriggerButton onClick={handleGenerate} disabled={isOpen} />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                        style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(6px)' }}
                    >
                        {/* Ambient grid */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
                                `,
                                backgroundSize: '60px 60px',
                            }}
                        />

                        {/* Ambient glow orbs */}
                        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-100/40 rounded-full blur-[80px] pointer-events-none" />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 8 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                            className="relative w-full max-w-6xl flex flex-col overflow-hidden"
                            style={{
                                height: 'min(880px, calc(100vh - 4rem))',
                                background: 'linear-gradient(160deg, #FAFBFF 0%, #F8F9FC 50%, #FAFBFF 100%)',
                                border: '1px solid rgba(15,23,42,0.07)',
                                borderRadius: '24px',
                                boxShadow: '0 0 0 1px rgba(99,102,241,0.06), 0 30px 80px -15px rgba(15,23,42,0.14), 0 0 60px -20px rgba(99,102,241,0.07)',
                            }}
                        >
                            {/* Top shimmer line */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.35), rgba(147,197,253,0.2), transparent)' }}
                            />

                            {/* ── HEADER ── */}
                            <div
                                className="flex-shrink-0 flex items-center justify-between px-8 py-5"
                                style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}
                            >
                                {/* Left: Brand */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-200/50 rounded-xl blur-md" />
                                        <div
                                            className="relative flex h-9 w-9 items-center justify-center rounded-xl"
                                            style={{
                                                background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                                                border: '1px solid rgba(99,102,241,0.2)',
                                            }}
                                        >
                                            <BrainCircuit className="h-4 w-4 text-indigo-600" />
                                            {/*<img src="/vantira_intelligence_favicon.png" alt={"V"}/>*/}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold tracking-tight text-slate-900">
                                            Vantira Intelligence
                                        </h2>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                                <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                            </span>
                                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                                                Secure Audit · V-9904
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Meta + Close */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5"
                                        style={{
                                            background: 'rgba(15,23,42,0.03)',
                                            border: `1px solid ${tokens.border.subtle}`,
                                        }}
                                    >
                                        <Zap className="h-3 w-3 text-amber-500" />
                                        <span className="text-[10px] font-semibold text-slate-500">
                                            Neural Engine v4.2
                                        </span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.94 }}
                                        onClick={handleClose}
                                        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group"
                                        style={{
                                            background: 'rgba(15,23,42,0.04)',
                                            border: `1px solid ${tokens.border.subtle}`,
                                        }}
                                    >
                                        <X className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* ── CONTENT ── */}
                            <div
                                ref={scrollPaneRef}
                                className="flex-1 overflow-y-auto px-8 py-8"
                                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) rgba(15,23,42,0.04)' }}
                            >
                                <AnimatePresence mode="wait">
                                    {isProcessing
                                        ? <NeuralLoader key="loader" step={loadingStep} sequence={loadingSequence} />
                                        : <SummaryContent key="content" data={summaryData} scrollRef={scrollPaneRef} />
                                    }
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AiSummaryManager;
