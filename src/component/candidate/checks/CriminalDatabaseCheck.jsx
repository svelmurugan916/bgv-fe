import React, { useState } from 'react';
import {
    ShieldAlert, Scale, User, MapPin, Gavel, Clock,
    AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
    Search, Fingerprint, Info, Globe, Building2
} from 'lucide-react';
import BaseCheckLayout from "./base-check-layout/BaseCheckLayout.jsx";

const data = {
    "summary": {
        "totalMatchesFound": 2,
        "highestRiskLevel": "CRITICAL",
        "overallIdentityConfidence": 94,
        "adjudicationStatus": "MANUAL_REVIEW_REQUIRED",
        "lastScannedAt": "2024-03-22T14:30:00Z"
    },
    "records": [
        {
            "recordId": "CASE-992831",
            "riskLevel": "CRITICAL",
            "source": "e-Courts India (District & Sessions Court)",
            "identityAnchor": {
                "nameMatchScore": 98,
                "recordName": "ADITYA VIKRAM SINGH",
                "fatherNameMatch": {
                    "status": "MISMATCH",
                    "recordValue": "RAJESH SINGH",
                    "candidateValue": "VIKRAM SINGH",
                    "isFlagged": true
                },
                "dobMatch": {
                    "status": "MATCH",
                    "recordValue": "15-05-1992",
                    "candidateValue": "15-05-1992"
                },
                "addressMatch": {
                    "status": "PARTIAL",
                    "recordValue": "Plot 42, Andheri West, Mumbai",
                    "candidateValue": "Andheri East, Mumbai"
                }
            },
            "caseMetadata": {
                "cnrNumber": "MHBT010023452018",
                "caseNumber": "CRA/204/2018",
                "courtName": "Chief Metropolitan Magistrate, Esplanade",
                "location": "Mumbai, Maharashtra",
                "category": "Criminal - Non-Bailable",
                "filingDate": "2018-06-12",
                "lastHearingDate": "2023-11-10"
            },
            "offenseDetails": {
                "description": "Cheating and dishonestly inducing delivery of property",
                "actsAndSections": "IPC Section 420, 406",
                "severity": "FELONY",
                "policeStation": "Azad Maidan PS",
                "firNumber": "102/2018"
            },
            "judicialOutcome": {
                "status": "PENDING",
                "disposition": "UNDER_TRIAL",
                "sentence": "N/A",
                "judgeName": "Hon'ble Justice S.K. Kulkarni"
            }
        },
        {
            "recordId": "CASE-112044",
            "riskLevel": "LOW",
            "source": "Global Sanctions & Watchlist",
            "identityAnchor": {
                "nameMatchScore": 72,
                "recordName": "ADIT SINGH",
                "fatherNameMatch": { "status": "NOT_AVAILABLE", "recordValue": null, "candidateValue": "VIKRAM SINGH" },
                "dobMatch": { "status": "MISMATCH", "recordValue": "01-01-1985", "candidateValue": "15-05-1992" }
            },
            "caseMetadata": {
                "cnrNumber": "N/A",
                "caseNumber": "WLIST-INT-092",
                "courtName": "Interpol Red Notice Database",
                "location": "Global",
                "category": "Financial Watchlist",
                "filingDate": "2020-01-05",
                "lastHearingDate": "2020-01-05"
            },
            "offenseDetails": {
                "description": "Suspicion of money laundering activity",
                "actsAndSections": "AML Regulation 4",
                "severity": "INFRACTION",
                "policeStation": "International",
                "firNumber": "N/A"
            },
            "judicialOutcome": {
                "status": "DISPOSED",
                "disposition": "QUASHED",
                "sentence": "None",
                "judgeName": "Administrative Panel"
            }
        }
    ]
}


const CriminalDatabaseCheck = ({ taskId }) => {
    // Fallback to empty structure if data is missing
    const { summary, records } = data || { summary: {}, records: [] };

    return (
        <BaseCheckLayout
            title="Criminal Database Intelligence"
            description="Automated multi-jurisdictional court record matching and risk assessment."
            checkId={taskId}
        >
            <div className="space-y-6 animate-in fade-in duration-500 p-10">

                {/* --- PHASE 1: OPERATIONAL SUMMARY HEADER --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SummaryStat
                        label="Total Matches"
                        value={summary.totalMatchesFound}
                        icon={<Search size={20} />}
                        color="text-indigo-600"
                    />
                    <SummaryStat
                        label="Highest Risk"
                        value={summary.highestRiskLevel}
                        icon={<ShieldAlert size={20} />}
                        color={summary.highestRiskLevel === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}
                    />
                    <SummaryStat
                        label="Identity Confidence"
                        value={`${summary.overallIdentityConfidence}%`}
                        icon={<Fingerprint size={20} />}
                        color="text-emerald-600"
                    />
                    <SummaryStat
                        label="Adjudication"
                        value={summary.adjudicationStatus?.replace(/_/g, ' ')}
                        icon={<Scale size={20} />}
                        color="text-slate-600"
                        isSmall
                    />
                </div>

                {/* --- PHASE 2: RECORDS LIST --- */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                        Detailed Court Records ({records.length})
                    </h3>

                    {records.map((record, index) => (
                        <CriminalRecordCard key={record.recordId} record={record} />
                    ))}
                </div>
            </div>
        </BaseCheckLayout>
    );
};

/* --- SUB-COMPONENT: RECORD CARD --- */
const CriminalRecordCard = ({ record }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { identityAnchor, caseMetadata, offenseDetails, judicialOutcome } = record;

    return (
        <div className={`group border rounded-[2.5rem] overflow-hidden transition-all duration-300 bg-white ${
            record.riskLevel === 'CRITICAL' ? 'border-rose-100 shadow-sm' : 'border-slate-100'
        }`}>
            {/* Card Header */}
            <div className={`p-6 flex items-center justify-between cursor-pointer ${
                record.riskLevel === 'CRITICAL' ? 'bg-rose-50/30' : 'bg-slate-50/30'
            }`} onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        record.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-400'
                    }`}>
                        <Scale size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-800 uppercase tracking-tight">{record.source}</h4>
                            <RiskBadge level={record.riskLevel} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Record ID: {record.recordId} • CNR: {caseMetadata.cnrNumber}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Match Score</p>
                        <p className="text-sm font-black text-slate-700">{identityAnchor.nameMatchScore}%</p>
                    </div>
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-8 space-y-8 animate-in slide-in-from-top-2 duration-300">

                    {/* 1. Identity Anchors (Comparison Zone) */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Fingerprint size={14} className="text-indigo-500" />
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Anchors (Comparison)</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ComparisonField
                                label="Record Name"
                                value={identityAnchor.recordName}
                                matchStatus="INFO"
                            />
                            <ComparisonField
                                label="Father/Spouse Name"
                                value={identityAnchor.fatherNameMatch.recordValue}
                                candidateValue={identityAnchor.fatherNameMatch.candidateValue}
                                matchStatus={identityAnchor.fatherNameMatch.status}
                                isFlagged={identityAnchor.fatherNameMatch.isFlagged}
                            />
                            <ComparisonField
                                label="Date of Birth"
                                value={identityAnchor.dobMatch.recordValue}
                                candidateValue={identityAnchor.dobMatch.candidateValue}
                                matchStatus={identityAnchor.dobMatch.status}
                            />
                        </div>
                    </section>

                    {/* 2. Case & Offense Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                        {/* Case Metadata */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Building2 size={14} className="text-slate-400" />
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Metadata</h5>
                            </div>
                            <div className="bg-slate-50 rounded-3xl p-5 space-y-3">
                                <MetaItem label="Court" value={caseMetadata.courtName} />
                                <MetaItem label="Location" value={caseMetadata.location} />
                                <MetaItem label="Category" value={caseMetadata.category} />
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <MetaItem label="Filing Date" value={caseMetadata.filingDate} />
                                    <MetaItem label="Last Hearing" value={caseMetadata.lastHearingDate} />
                                </div>
                            </div>
                        </div>

                        {/* Offense & Outcome */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Gavel size={14} className="text-slate-400" />
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Offense & Judicial Outcome</h5>
                            </div>
                            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2 py-1 bg-rose-500 text-[9px] font-black rounded uppercase tracking-tighter">
                                        {offenseDetails.severity}
                                    </span>
                                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                        {judicialOutcome.status}
                                    </span>
                                </div>
                                <p className="text-sm font-medium leading-relaxed mb-4 text-slate-300">
                                    {offenseDetails.description}
                                </p>
                                <div className="space-y-2 border-t border-white/10 pt-4">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Acts & Sections</p>
                                    <p className="text-xs font-mono text-indigo-300">{offenseDetails.actsAndSections}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- SHARED UI ATOMS --- */

const SummaryStat = ({ label, value, icon, color, isSmall = false }) => (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={`${isSmall ? 'text-xs' : 'text-lg'} font-black text-slate-800 truncate max-w-[120px]`}>{value}</p>
        </div>
    </div>
);

const ComparisonField = ({ label, value, candidateValue, matchStatus, isFlagged }) => (
    <div className={`p-4 rounded-2xl border transition-all ${
        isFlagged ? 'bg-amber-50 border-amber-200 ring-4 ring-amber-500/5' : 'bg-white border-slate-100'
    }`}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
            {label}
            {isFlagged && <AlertTriangle size={12} className="text-amber-600 animate-pulse" />}
        </p>
        <div className="space-y-1">
            <p className={`text-xs font-black ${isFlagged ? 'text-amber-900' : 'text-slate-800'}`}>
                {value || 'N/A'}
            </p>
            {candidateValue && (
                <p className="text-[10px] font-bold text-slate-400 italic">
                    Claimed: {candidateValue}
                </p>
            )}
        </div>
        {matchStatus && !isFlagged && matchStatus !== 'INFO' && (
            <div className="mt-2 flex items-center gap-1">
                <CheckCircle2 size={10} className="text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Verified Match</span>
            </div>
        )}
    </div>
);

const MetaItem = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-slate-700 leading-tight">{value || '—'}</p>
    </div>
);

const RiskBadge = ({ level }) => {
    const styles = {
        CRITICAL: "bg-rose-100 text-rose-700 border-rose-200",
        LOW: "bg-slate-100 text-slate-600 border-slate-200",
        MEDIUM: "bg-amber-100 text-amber-700 border-amber-200"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-tighter ${styles[level] || styles.LOW}`}>
            {level} Risk
        </span>
    );
};

export default CriminalDatabaseCheck;
