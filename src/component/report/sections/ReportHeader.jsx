// components/bgv/sections/ReportHeader.jsx
import React, { useState } from "react";
import { Building2, CheckCircle2, Lock, Shield } from "lucide-react";

// ─────────────────────────────────────────────────────────
// Candidate Avatar
// ─────────────────────────────────────────────────────────
const CandidateAvatar = ({ photo, fullName, size = "lg" }) => {
    const [imageError, setImageError] = useState(false);

    const initials = fullName
        ? fullName
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?";

    const hue = fullName
        ? [...fullName].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
        : 220;

    const sizeClasses = {
        sm: "w-12 h-12 text-sm rounded-2xl",
        md: "w-16 h-16 text-base rounded-[1.25rem]",
        lg: "w-24 h-24 text-2xl rounded-[1.75rem]",
        xl: "w-28 h-28 text-3xl rounded-[2rem]",
    };

    if (photo && !imageError) {
        return (
            <img
                src={photo}
                alt={fullName || "Candidate"}
                className={`
                    ${sizeClasses[size]}
                    object-cover shrink-0
                    border border-white/12
                    bg-white/5
                    shadow-[0_18px_48px_rgba(0,0,0,0.28)]
                `}
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <div
            className={`
                ${sizeClasses[size]}
                flex items-center justify-center shrink-0
                font-semibold text-white
                border border-white/12
                shadow-[0_18px_48px_rgba(0,0,0,0.28)]
            `}
            style={{
                background: `linear-gradient(135deg,
                    hsl(${hue}, 56%, 44%),
                    hsl(${(hue + 34) % 360}, 52%, 33%)
                )`,
            }}
        >
            {initials}
        </div>
    );
};

// ─────────────────────────────────────────────────────────
// Client Organisation Logo
// ─────────────────────────────────────────────────────────
const ClientOrgLogo = ({ org }) => {
    const [imageError, setImageError] = useState(false);

    if (!org) return null;

    const descriptor = [org.industry, org.location].filter(Boolean).join(" · ");

    return (
        <div className="w-full max-w-sm rounded-[28px] border border-white/8 bg-white/[0.035] px-5 py-4 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.30em] text-slate-400">
                Requested organisation
            </p>

            <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.05]">
                    {org.logo && !imageError ? (
                        <img
                            src={org.logo}
                            alt={org.name}
                            className="h-8 w-auto object-contain"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Building2 className="h-5 w-5 text-slate-300" />
                    )}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                        {org.name}
                    </p>
                    {descriptor && (
                        <p className="mt-1 text-sm text-slate-400">
                            {descriptor}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────
// Meta Item
// ─────────────────────────────────────────────────────────
const MetaItem = ({ label, value }) => {
    if (!value) return null;

    return (
        <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.30em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-sm font-semibold text-white/95">{value}</p>
        </div>
    );
};

// ─────────────────────────────────────────────────────────
// Identity line
// ─────────────────────────────────────────────────────────
const IdentityLine = ({ candidate }) => {
    const items = [
        candidate?.city,
        candidate?.email,
        candidate?.dateOfBirth ? `DOB ${candidate.dateOfBirth}` : null,
    ].filter(Boolean);

    if (!items.length) return null;

    return (
        <div className="mt-7 flex flex-wrap items-center gap-y-2 text-sm text-slate-300/90">
            {items.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center">
                    {index > 0 && <span className="mx-3 text-white/18">•</span>}
                    <span>{item}</span>
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────
// Main Report Header
// ─────────────────────────────────────────────────────────
export const ReportHeader = ({ report }) => {
    const candidate = report?.candidate ?? {};
    const trustScore = report?.trustScore;
    const complianceTags = report?.complianceTags ?? [];

    const numericScore = Number(trustScore?.score ?? 0);
    const numericMaxScore = Number(trustScore?.maxScore ?? 100);
    const scorePercent =
        numericMaxScore > 0
            ? Math.max(0, Math.min(100, (numericScore / numericMaxScore) * 100))
            : 0;

    return (
        /*
           CHANGE 1: Added 'min-h-[297mm]' to ensure it fills exactly one A4 page.
           CHANGE 2: Added 'break-after-page' (via style) to force the next section to Page 2.
        */
        <header
            className="relative isolate overflow-hidden bg-[#0a1020] text-white min-h-[297mm] flex flex-col"
            style={{ breakAfter: 'page', pageBreakAfter: 'always' }}
        >
            {/* Base gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.08),transparent_20%),linear-gradient(135deg,#0a1020_0%,#10172f_48%,#0a1020_100%)]" />

            {/* Signature texture */}
            <div
                className="absolute inset-0 opacity-[0.055]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: "120px 120px",
                    maskImage:
                        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 100%)",
                }}
            />

            {/* Soft glows */}
            <div className="absolute left-10 top-14 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute right-16 top-10 h-36 w-36 rounded-full bg-sky-400/8 blur-3xl" />

            {/* Frame lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/8" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/8" />

            {/*
               CHANGE 3: Added 'flex-1 flex flex-col justify-between' to the wrapper
               to push the bottom strip to the very bottom of the page.
            */}
            <div className="relative flex-1 flex flex-col px-8 py-10 md:px-14 md:py-14 print:px-10 print:py-12">
                {/* Top bar */}
                <div className="flex flex-col gap-8 border-b border-white/8 pb-8 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-300/15 bg-white text-indigo-100 shadow-[0_10px_30px_rgba(99,102,241,0.18)]">
                                <img src="/favicon.png" alt={"V"} className="w-6 h-6" />
                            </div>

                            <div>
                                <p className="text-[22px] font-semibold tracking-[0.01em] text-white">
                                    VANTIRA
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.30em] text-slate-400">
                                    Enterprise background verification platform
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-slate-400">
                            <span className="text-indigo-100/90">Confidential report</span>
                            {report?.reportId && (
                                <>
                                    <span className="text-white/16">/</span>
                                    <span>{report.reportId}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <ClientOrgLogo org={report?.clientOrganisation} />
                </div>

                {/* Main hero - Added 'flex-1 flex flex-col justify-center' to vertically center the name */}
                <div className="flex-1 flex flex-col justify-center py-12">
                    <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px] md:items-end">
                        {/* Left side */}
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-px bg-gradient-to-b from-indigo-300/0 via-indigo-200/80 to-indigo-300/0" />
                                <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-indigo-100/75">
                                    Verification report
                                </p>
                            </div>

                            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white md:text-6xl lg:text-[76px]">
                                {candidate.fullName || "Candidate Name"}
                            </h1>

                            {(candidate.role || candidate.company) && (
                                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300/85 md:text-xl">
                                    {[candidate.role, candidate.company ? `at ${candidate.company}` : null]
                                        .filter(Boolean)
                                        .join(" ")}
                                </p>
                            )}

                            <IdentityLine candidate={candidate} />

                            <div className="mt-10 grid gap-8 border-t border-white/8 pt-7 sm:grid-cols-2 xl:grid-cols-4">
                                <MetaItem label="Generated" value={report?.generatedAt} />
                                <MetaItem label="Requested by" value={report?.requestedBy} />
                                <MetaItem label="Report ID" value={report?.reportId} />
                                <MetaItem label="Turnaround" value={report?.turnaroundTime} />
                            </div>
                        </div>

                        {/* Right summary card */}
                        <div className="rounded-[30px] border border-white/8 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
                            <div className="flex items-start gap-4">
                                <CandidateAvatar
                                    photo={candidate.photo}
                                    fullName={candidate.fullName}
                                    size="lg"
                                />
                                <div className="min-w-0 flex-1 pt-1">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.30em] text-slate-400">Verified subject</p>
                                    <p className="mt-2 truncate text-[18px] font-semibold tracking-tight text-white">
                                        {candidate.fullName || "Candidate"}
                                    </p>
                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/16 bg-emerald-400/8 px-3 py-1.5 text-[11px] font-medium text-emerald-100/90">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Enterprise package active
                                    </div>
                                </div>
                            </div>

                            {trustScore && (
                                <div className="mt-8 border-t border-white/8 pt-7">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.30em] text-slate-400">Trust score</p>
                                    <div className="mt-4 flex items-end justify-between gap-4">
                                        <div className="flex items-end gap-2">
                                            <span className="text-5xl font-semibold leading-none tracking-[-0.05em] text-white">{trustScore.score}</span>
                                            <span className="pb-1 text-sm text-slate-400">/ {trustScore.maxScore}</span>
                                        </div>
                                        {trustScore.riskLevel && (
                                            <span className="rounded-full border border-emerald-400/16 bg-emerald-400/8 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-emerald-100/90">
                                                {trustScore.riskLevel}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/8">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-300"
                                            style={{ width: `${scorePercent}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom trust strip - Now uses 'mt-auto' to stay at the bottom of the page */}
                <div className="mt-auto border-t border-white/8 pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.30em] text-slate-400">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.04]">
                                <Lock className="h-4 w-4 text-slate-300" />
                            </div>
                            <span>Secure report issuance</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-2 text-sm text-slate-300/90">
                            <span>256-bit AES encrypted</span>
                            <span className="mx-4 text-white/16">•</span>
                            <span>Tamper-evident</span>
                            <span className="mx-4 text-white/16">•</span>
                            <span>Verified enterprise servers</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};