// VantiraBGVReport.jsx
import React from "react";

import { ReportHeader }          from "./sections/ReportHeader";
import { TrustScore }            from "./sections/TrustScore";
import { VerificationDashboard } from "./sections/VerificationDashboard";
import { TatPanel }              from "./sections/TatPanel";
import { SummaryTable }          from "./sections/SummaryTable";
import { CandidateProfile }      from "./sections/CandidateProfile";
import { DocumentsReviewed }     from "./sections/DocumentsReviewed";
import { ReportAuthenticity }    from "./sections/ReportAuthenticity";
import { FinalRecommendation }   from "./sections/FinalRecommendation";

import { IdentityCheck }         from "./checks/IdentityCheck";
import { CriminalCheck }         from "./checks/CriminalCheck";
import { AddressCheck }          from "./checks/AddressCheck";
import { EducationCheck }        from "./checks/EducationCheck";
import { EmploymentCheck }       from "./checks/EmploymentCheck";
import { GlobalCheck }           from "./checks/GlobalCheck";
import { ReferenceCheck }        from "./checks/ReferenceCheck";

const SectionDivider = ({ label }) => (
    <div className="flex items-center gap-4 px-1">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] shrink-0">{label}</p>
        <div className="h-px flex-1 bg-slate-200" />
    </div>
);

const VantiraBGVReport = ({ reportData = {} }) => {
    const { checks, documents, authenticity } = reportData;

    return (
        <div className="min-h-screen bg-[#F8F8FF] font-sans" data-pdf-ready="true">

            {/* ── COVER HEADER ── */}
            <ReportHeader report={reportData} />

            <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

                {/* ── CANDIDATE PROFILE ── */}
                <CandidateProfile candidate={reportData.candidate} />

                {/* ── TRUST SCORE ── */}
                <SectionDivider label="Trust Score & Verdict" />
                <TrustScore trustScore={reportData.trustScore} />

                {/* ── DASHBOARD ── */}
                <SectionDivider label="Verification Dashboard" />
                <VerificationDashboard dashboard={reportData.dashboard} />

                {/* ── TAT PANEL ── */}
                {/*<SectionDivider label="Platform Speed" />*/}
                {/*<TatPanel report={reportData} />*/}

                {/* ── SUMMARY TABLE ── */}
                <SectionDivider label="Summary — All 7 Pillars" />
                <SummaryTable summaryTable={reportData.summaryTable} />

                {/* ── DETAILED CHECKS ── */}
                <SectionDivider label="Detailed Verification Checks" />
                <div className="space-y-6">
                    <IdentityCheck   data={checks.identity}   />
                    <CriminalCheck   data={checks.criminal}   />
                    <AddressCheck    data={checks.address}     />
                    <EducationCheck  data={checks.education}   />
                    <EmploymentCheck data={checks.employment}  />
                    <GlobalCheck     data={checks.global}      />
                    <ReferenceCheck  data={checks.reference}   />
                </div>

                {/* ── DOCUMENTS ── */}
                <SectionDivider label="Documents Reviewed" />
                <DocumentsReviewed documents={documents} />

                {/* ── AUTHENTICITY ── */}
                <SectionDivider label="Report Authenticity" />
                <ReportAuthenticity auth={authenticity} verifyUrl={reportData.verifyUrl} />

                {/* ── FINAL RECOMMENDATION ── */}
                <SectionDivider label="Final Recommendation" />
                <FinalRecommendation
                    trustScore={reportData.trustScore}
                    reportId={reportData.reportId}
                    companyName={reportData.companyName}
                    aiEngine={reportData.aiEngine}
                />

            </div>
        </div>
    );
};

export default VantiraBGVReport;
