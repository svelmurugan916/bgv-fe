import {
    AlertTriangle,
    Archive,
    Building2,
    Calendar, Download,
    ExternalLink, FileSearch, FileText, Fingerprint,
    Gavel,
    Hash,
    Link,
    Scale,
    User,
    X
} from "lucide-react";
import React, {useState} from "react";
import PartyCard from "./PartyCard.jsx";

const CaseDetailModal = ({ caseData, onClose }) => {

    const hasFirData = caseData.firNumber
        || caseData.firLink
        || caseData.gfcFirNumberCourt
        || caseData.gfcFirYearCourt
        || caseData.gfcFirPoliceStationCourt;

    const hasGfcOrdersData =
        (caseData.gfcOrdersData?.petitioners?.length > 0) ||
        (caseData.gfcOrdersData?.respondents?.length  > 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">

                {/* ── Modal Header ── */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#FBFBFF] shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                            <Scale size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{caseData.caseNo}</h2>
                                {caseData.caseType && (
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                        caseData.caseType === 'Criminal'
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-slate-900 text-white'
                                    }`}>
                                        {caseData.caseType} Record
                                    </span>
                                )}
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                    caseData.caseStatus === 'Pending'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {caseData.caseStatus}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {caseData.cnrNumber || 'CNR NOT AVAILABLE'}
                                </p>
                                {/* ⭐ External Court Link */}
                                {caseData.caseLink && (
                                    <a
                                        href={caseData.caseLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest"
                                    >
                                        <ExternalLink size={12} />
                                        View on eCourts
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* ── Modal Body ── */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10">

                    {/* ── SECTION 1: Case Identity ── */}
                    <section className="space-y-4">
                        <SectionTitle icon={<Hash size={16}/>} title="Case Identity" />
                        <div className="bg-slate-50 rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                            <DetailItem label="Case Name"        value={caseData.caseName}       fullWidth />
                            <DetailItem label="Case No."         value={caseData.caseNo} />
                            <DetailItem label="CNR Number"       value={caseData.cnrNumber} />
                            <DetailItem label="Case Year"        value={caseData.caseYear} />
                            <DetailItem label="Case Type"        value={caseData.caseType} />
                            <DetailItem label="Case Type Name"   value={caseData.caseTypeName} />
                            <DetailItem label="Case Type No."    value={caseData.caseTypeNumber} />
                            <DetailItem label="Case Status"      value={caseData.caseStatus} />
                            <DetailItem label="Case Reg. Date"   value={caseData.caseRegDate} />
                        </div>
                    </section>

                    {/* ── SECTION 2: Jurisdiction + Legal Provisions ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {/* Jurisdiction */}
                        <section className="space-y-4">
                            <SectionTitle icon={<Building2 size={16}/>} title="Jurisdiction Details" />
                            <div className="bg-slate-50 rounded-[2rem] p-8 grid grid-cols-2 gap-y-6 gap-x-4">
                                <DetailItem label="Court Name"          value={caseData.courtName}          fullWidth />
                                <DetailItem label="Court Type"          value={caseData.courtType} />
                                <DetailItem label="Court Number"        value={caseData.courtNumber} />
                                <DetailItem label="Bench / Judge"       value={caseData.courtNumberAndJudge} fullWidth />
                                <DetailItem label="District"            value={caseData.district} />
                                <DetailItem label="State"               value={caseData.state} />
                            </div>
                        </section>

                        {/* Legal Provisions */}
                        <section className="space-y-4">
                            <SectionTitle icon={<Gavel size={16}/>} title="Legal Provisions" />
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Scale size={120} />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <DetailItem label="Under Act"            value={caseData.underAct}       isDark />
                                    <DetailItem label="Under Section"        value={caseData.underSection}   isDark />
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Nature of Disposal</p>
                                        <p className="text-sm font-bold text-emerald-400">
                                            {caseData.natureOfDisposal || 'Case Active / Pending'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── SECTION 3: Filing & Hearing Timeline ── */}
                    <section className="space-y-4">
                        <SectionTitle icon={<Calendar size={16}/>} title="Filing & Hearing Timeline" />
                        <div className="bg-slate-50 rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                            <DetailItem label="Registration No."    value={caseData.registrationNumber} />
                            <DetailItem label="Filing Number"       value={caseData.filingNumber} />
                            <DetailItem label="Filing Date"         value={caseData.filingDate} />
                            <DetailItem label="Hearing Date"        value={caseData.hearingDate} />
                            <DetailItem label="Crawling Date"       value={caseData.crawlingDate
                                ? new Date(caseData.crawlingDate).toLocaleDateString('en-IN', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                })
                                : null}
                            />
                            <DetailItem label="Judgement Date"      value={caseData.judgementDate} />
                            <DetailItem label="Suit Filed Amount"   value={caseData.suitFiledAmount} />
                            <DetailItem label="GFC Updated At"      value={caseData.gfcUpdatedAt} />
                            <DetailItem label="Created At (GFC)"    value={caseData.createdAtGfc} />
                            {caseData.judgementDescription && (
                                <DetailItem label="Judgement Description" value={caseData.judgementDescription} fullWidth />
                            )}
                        </div>
                    </section>

                    {/* ── SECTION 4: FIR Details (only if any FIR data exists) ── */}
                    {hasFirData && (
                        <section className="space-y-4">
                            <SectionTitle icon={<AlertTriangle size={16}/>} title="FIR Details" />
                            <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                <DetailItem label="FIR Number"              value={caseData.firNumber} />
                                <DetailItem label="FIR No. (Court)"         value={caseData.gfcFirNumberCourt} />
                                <DetailItem label="FIR Year (Court)"        value={caseData.gfcFirYearCourt} />
                                <DetailItem label="Police Station (Court)"  value={caseData.gfcFirPoliceStationCourt} />
                                {caseData.firLink && (
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">FIR Link</p>
                                        <a
                                            href={caseData.firLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                                        >
                                            <Link size={12} /> View FIR
                                        </a>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── SECTION 5: Involved Parties ── */}
                    <section className="space-y-4">
                        <SectionTitle icon={<User size={16}/>} title="Involved Parties" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PartyCard
                                title="Petitioner / Complainant"
                                rawPartyText={caseData.petitioner}
                                rawAddressText={caseData.petitionerAddress}
                                structuredParties={caseData.gfcPetitioners}
                                type="P"
                            />
                            <PartyCard
                                title="Respondent / Accused"
                                rawPartyText={caseData.respondent}
                                rawAddressText={caseData.respondentAddress}
                                structuredParties={caseData.gfcRespondents}
                                type="R"
                            />
                        </div>
                    </section>

                    {/* ── SECTION 6: GFC Orders Data (structured court order parties) ── */}
                    {hasGfcOrdersData && (
                        <section className="space-y-4">
                            <SectionTitle icon={<Archive size={16}/>} title="Court Order Party Details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {caseData.gfcOrdersData?.petitioners?.length > 0 && (
                                    <GfcOrderPartyCard
                                        title="Order Petitioners"
                                        parties={caseData.gfcOrdersData.petitioners}
                                    />
                                )}
                                {caseData.gfcOrdersData?.respondents?.length > 0 && (
                                    <GfcOrderPartyCard
                                        title="Order Respondents"
                                        parties={caseData.gfcOrdersData.respondents}
                                    />
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── SECTION 7: Match Intelligence ── */}
                    <section className="space-y-4">
                        <SectionTitle icon={<Fingerprint size={16}/>} title="Match Intelligence" />
                        <div className="bg-slate-50 rounded-[2rem] p-8 flex items-center gap-8">
                            {/* Score Gauge */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
                                    caseData.fuzzyNameScore >= 0.85 ? 'border-rose-400 bg-rose-50 text-rose-600' :
                                        caseData.fuzzyNameScore >= 0.60 ? 'border-amber-400 bg-amber-50 text-amber-600' :
                                            'border-slate-200 bg-white text-slate-500'
                                }`}>
                                    {(caseData.fuzzyNameScore * 100).toFixed(0)}%
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Name Match</p>
                            </div>
                            {/* Score Interpretation */}
                            <div className="space-y-2">
                                <p className={`text-sm font-black ${
                                    caseData.fuzzyNameScore >= 0.85 ? 'text-rose-600' :
                                        caseData.fuzzyNameScore >= 0.60 ? 'text-amber-600' : 'text-slate-500'
                                }`}>
                                    {caseData.fuzzyNameScore >= 0.85 ? '⚠️ High Confidence Match — Manual Review Required' :
                                        caseData.fuzzyNameScore >= 0.60 ? '⚡ Moderate Match — Review Recommended' :
                                            '✓ Low Match Score — Likely False Positive'}
                                </p>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                                    Fuzzy similarity score comparing candidate name against party names in this case.
                                    Threshold for flagging: 85%. Scores below 60% are typically unrelated records.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ── SECTION 8: Evidence & Legal Documents ── */}
                    <section className="space-y-4">
                        <SectionTitle icon={<FileText size={16}/>} title="Evidence & Legal Documents" />
                        {(caseData.caseDetailsPdfUrl || caseData.caseFlow?.some(f => f.orderLinkUrl)) ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {caseData.caseDetailsPdfUrl && (
                                    <DocumentButton
                                        label="Full Case History"
                                        subLabel="Complete case details PDF"
                                        url={caseData.caseDetailsPdfUrl}
                                        type="PDF"
                                    />
                                )}
                                {caseData.caseFlow?.map((order, idx) =>
                                        order.orderLinkUrl && (
                                            <DocumentButton
                                                key={idx}
                                                label={`${order.order || order.gfcOrderType}`}
                                                subLabel={`Date: ${order.orderDate || 'N/A'} • ${order.gfcOrderType}`}
                                                url={order.orderLinkUrl}
                                                type="ORDER"
                                            />
                                        )
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-3xl p-8 flex items-center gap-4 text-slate-400">
                                <FileSearch size={24} />
                                <p className="text-sm font-bold">No documents available for this case.</p>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
};



/* ─────────────────────────────────────────────────────────
   GFC ORDERS DATA PARTY CARD
   Shows structured court order party details with
   full audit info: pincode, state, district etc.
───────────────────────────────────────────────────────── */
const GfcOrderPartyCard = ({ title, parties }) => (
    <div className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 space-y-4">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-indigo-100 pb-3">
            {title}
        </p>
        <div className="space-y-5">
            {parties.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 space-y-3 border border-indigo-50">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-[9px] font-black text-indigo-600">
                            {i + 1}
                        </div>
                        <p className="text-xs font-black text-slate-700">{p.name}</p>
                    </div>
                    {p.address && (
                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed pl-7">{p.address}</p>
                    )}
                    {/* Extra fields from gfc_orders_data */}
                    <div className="grid grid-cols-3 gap-3 pl-7">
                        {p.age         && <MiniDetailItem label="Age"       value={p.age} />}
                        {p.statename   && <MiniDetailItem label="State"     value={p.statename} />}
                        {p.districtname && <MiniDetailItem label="District" value={p.districtname} />}
                        {p.pincode     && <MiniDetailItem label="Pincode"   value={p.pincode} />}
                        {p.localityname && <MiniDetailItem label="Locality" value={p.localityname} />}
                        {p.subdistname && <MiniDetailItem label="Sub-Dist"  value={p.subdistname} />}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center gap-2 px-2">
        <span className="text-indigo-500">{icon}</span>
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h5>
    </div>
);

const DetailItem = ({ label, value, fullWidth, isDark }) => (
    <div className={fullWidth ? "col-span-2 md:col-span-4" : ""}>
        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {label}
        </p>
        <p className={`text-xs font-bold leading-tight ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
            {value || '—'}
        </p>
    </div>
);

const MiniDetailItem = ({ label, value }) => (
    <div>
        <p className="text-[8px] font-black text-slate-400 uppercase">{label}</p>
        <p className="text-[10px] font-bold text-slate-600">{value || '—'}</p>
    </div>
);

const DocumentButton = ({ label, subLabel, url, type }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-indigo-500 hover:bg-indigo-50/30 transition-all"
    >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                type === 'PDF' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
                <FileText size={18} />
            </div>
            <div>
                <p className="text-[11px] font-black text-slate-700 group-hover:text-indigo-700 truncate max-w-[150px]">
                    {label}
                </p>
                {subLabel && (
                    <p className="text-[9px] font-medium text-slate-400 truncate max-w-[150px]">{subLabel}</p>
                )}
            </div>
        </div>
        <Download size={16} className="text-slate-300 group-hover:text-indigo-500 shrink-0" />
    </a>
);

export default CaseDetailModal;
