import React from 'react';
import { ShieldCheck, Building2, User, FileText, CheckCircle2, ChevronRight, ArrowUpCircle } from 'lucide-react';

// --- SHARED COMPONENTS ---

const PageWrapper = ({ children, checkName, headerData }) => (
    <div className="w-[210mm] min-h-[297mm] bg-white mx-auto my-10 shadow-2xl p-12 flex flex-col relative print:shadow-none print:my-0">
        {/* Persistent Header for every page */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5D4591] rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#5D4591] tracking-tighter">TraceU</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Security First</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-black text-slate-800">{headerData.candidateName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Case: {headerData.caseNumber} | Init: {headerData.initiationDate}</p>
                {checkName && (
                    <div className="mt-2 flex items-center justify-end gap-2 text-[#00A38D]">
                        <span className="text-xs font-bold uppercase tracking-wider">{checkName}</span>
                        <a href="#summary-page" className="hover:scale-110 transition-transform">
                            <ArrowUpCircle className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-1">{children}</div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <span>www.traceu.ai</span>
            <span>Confidential Report</span>
        </div>
    </div>
);

// --- PAGE 1: COVER PAGE ---
const CoverPage = ({ data }) => (
    <PageWrapper headerData={data}>
        <div className="h-full flex flex-col items-center justify-center relative">
            <ShieldCheck className="absolute w-[500px] h-[500px] text-slate-50 -z-10 opacity-40" />

            <div className="text-center space-y-6">
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter">FINAL<br/><span className="text-[#5D4591]">REPORT</span></h1>
                <div className="h-1 w-24 bg-[#00A38D] mx-auto rounded-full"></div>
            </div>

            <div className="mt-24 grid grid-cols-1 gap-8 w-full max-w-md">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Candidate Details</p>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span className="text-slate-500 text-sm">Name</span><span className="font-bold text-slate-800">{data.candidateName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 text-sm">Case ID</span><span className="font-bold text-slate-800">{data.caseNumber}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 text-sm">Initiated</span><span className="font-bold text-slate-800">{data.initiationDate}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </PageWrapper>
);

// --- PAGE 2: EXECUTIVE SUMMARY ---
const ExecutiveSummary = ({ data }) => (
    <PageWrapper headerData={data}>
        <div id="summary-page">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <FileText className="text-[#5D4591]" /> Executive Summary
            </h2>
            <div className="grid grid-cols-2 gap-6">
                {[
                    { label: "Status", value: data.overallStatus, color: "text-[#00A38D]" },
                    { label: "Color Code", value: data.colorCode, color: "text-emerald-600" },
                    { label: "Report Date", value: data.reportDate },
                    { label: "Due Date", value: data.dueDate },
                ].map((item, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className={`text-lg font-bold ${item.color || 'text-slate-800'}`}>{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    </PageWrapper>
);

// --- PAGE 3: CHECK SUMMARY TABLE ---
const CheckSummary = ({ checks, headerData }) => (
    <PageWrapper headerData={headerData}>
        <h2 className="text-2xl font-black text-slate-800 mb-8">Check Drill-down</h2>
        <table className="w-full">
            <thead>
            <tr className="bg-slate-900 text-white">
                <th className="p-4 text-left text-[10px] uppercase rounded-tl-xl">Check Name</th>
                <th className="p-4 text-left text-[10px] uppercase">Source</th>
                <th className="p-4 text-left text-[10px] uppercase">Status</th>
                <th className="p-4 text-left text-[10px] uppercase">Page</th>
                <th className="p-4 text-left text-[10px] uppercase rounded-tr-xl">Annex</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {checks.map((check, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{check.name}</td>
                    <td className="p-4 text-sm text-slate-500">{check.source}</td>
                    <td className="p-4">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">
                                {check.status}
                            </span>
                    </td>
                    <td className="p-4"><a href={`#detail-${check.id}`} className="text-[#5D4591] font-bold underline">P.{i+4}</a></td>
                    <td className="p-4"><a href={`#annex-${check.id}`} className="text-[#5D4591] font-bold underline">A.{i+1}</a></td>
                </tr>
            ))}
            </tbody>
        </table>
    </PageWrapper>
);

// --- DETAIL TEMPLATE (Used for all checks) ---
const VerificationDetail = ({ check, headerData }) => (
    <>
        {/* Data Page */}
        <PageWrapper checkName={check.name} headerData={headerData}>
            <div id={`detail-${check.id}`} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800">{check.name} Details</h2>
                    <div className={`px-4 py-2 rounded-xl font-bold text-white bg-${check.severity === 'Green' ? '[#00A38D]' : 'red-500'}`}>
                        {check.severity}
                    </div>
                </div>

                <div className="border border-slate-200 rounded-3xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-left text-[10px] font-black uppercase text-slate-400">Parameter</th>
                            {check.hasCandidateInput && <th className="p-4 text-left text-[10px] font-black uppercase text-slate-400">Candidate Input</th>}
                            <th className="p-4 text-left text-[10px] font-black uppercase text-[#5D4591]">Verified Details</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {check.details.map((row, i) => (
                            <tr key={i}>
                                <td className="p-4 text-sm font-bold text-slate-500">{row.label}</td>
                                {check.hasCandidateInput && <td className="p-4 text-sm text-slate-600">{row.provided}</td>}
                                <td className="p-4 text-sm font-bold text-slate-900 bg-emerald-50/30">{row.verified}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageWrapper>

        {/* Documents Page */}
        <PageWrapper checkName={`${check.name} Documents`} headerData={headerData}>
            <div id={`annex-${check.id}`} className="space-y-10">
                {check.candidateDoc && (
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Candidate Uploaded Document</p>
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-4 bg-slate-50 flex items-center justify-center min-h-[300px]">
                            <img src={check.candidateDoc} alt="Input" className="max-h-[350px] rounded-lg shadow-md" />
                        </div>
                    </div>
                )}
                <div>
                    <p className="text-xs font-black text-[#00A38D] uppercase tracking-widest mb-4">Annexure Verified Evidence</p>
                    <div className="border-2 border-[#00A38D]/20 rounded-3xl p-4 bg-emerald-50/20 flex items-center justify-center min-h-[400px]">
                        <img src={check.annexureDoc} alt="Verified" className="max-h-[450px] rounded-lg shadow-xl" />
                    </div>
                </div>
            </div>
        </PageWrapper>
    </>
);

// --- MAIN REPORT COMPONENT ---
const FinalReport = () => {
    const reportData = {
        header: {
            candidateName: "Thota Venkata Deepak",
            caseNumber: "SC250496",
            initiationDate: "18-09-2025",
            reportDate: "09-10-2025",
            overallStatus: "Completed",
            colorCode: "Green",
            dueDate: "07-10-2025"
        },
        checks: [
            {
                id: "edu-1",
                name: "Education Verification",
                source: "Sathyabama Institute of Science",
                status: "Completed",
                severity: "Green",
                hasCandidateInput: true,
                details: [
                    { label: "Degree", provided: "B.E", verified: "B.E" },
                    { label: "Roll No", provided: "3313254", verified: "3313254" },
                    { label: "Passing Year", provided: "2018", verified: "2018" },
                    { label: "Final Grade", provided: "First Class", verified: "First Class" }
                ],
                candidateDoc: "https://example.com/edu-input.jpg",
                annexureDoc: "https://example.com/edu-verified.jpg"
            },
            {
                id: "crm-1",
                name: "Criminal Record Check",
                source: "Law Firm / District Court",
                status: "Completed",
                severity: "Green",
                hasCandidateInput: false,
                details: [
                    { label: "Jurisdiction", verified: "Nellore District Court" },
                    { label: "Search Period", verified: "Last 7 Years" },
                    { label: "Records Found", verified: "No Criminal Records Found" },
                    { label: "Disposition", verified: "Clear" }
                ],
                candidateDoc: null,
                annexureDoc: "https://example.com/criminal-clearance.jpg"
            },
            {
                id: "emp-1",
                name: "Employment Verification",
                source: "Infosys Limited",
                status: "Completed",
                severity: "Green",
                hasCandidateInput: true,
                details: [
                    { label: "Employee ID", provided: "1295745", verified: "1295745" },
                    { label: "Designation", provided: "Technology Analyst", verified: "Technology Analyst" },
                    { label: "Tenure", provided: "08-Aug-22 to 09-Aug-24", verified: "Matches" }
                ],
                candidateDoc: "https://example.com/relieving-letter.jpg",
                annexureDoc: "https://example.com/emp-mail-confirm.jpg"
            }
        ]
    };

    return (
        <div className="bg-slate-100 py-20 font-sans">
            <CoverPage data={reportData.header} />
            <ExecutiveSummary data={reportData.header} />
            <CheckSummary checks={reportData.checks} headerData={reportData.header} />

            {reportData.checks.map(check => (
                <VerificationDetail
                    key={check.id}
                    check={check}
                    headerData={reportData.header}
                />
            ))}
        </div>
    );
};

export default FinalReport;
