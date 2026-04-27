// VantiraBGVReport.jsx
import React from "react";
import { ReportHeader }          from "./sections/ReportHeader";
import { TrustScore }            from "./sections/TrustScore";
import { VerificationDashboard } from "./sections/VerificationDashboard";
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
import PageSection from "./sections/PageSection.jsx";

const SectionDivider = ({ label }) => (
    <div className="flex items-center gap-4 px-1 py-4">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] shrink-0">{label}</p>
        <div className="h-px flex-1 bg-slate-200" />
    </div>
);

const VantiraBGVReport = ({ reportData = {} }) => {
    const { checks = {}, documents, authenticity } = reportData;

    return (
        <div className="min-h-screen bg-[#F8F8FF] font-sans">

            {/* ── PAGE 1: COVER HEADER ── */}
            {/* This component has the height: 297mm and break-after-page logic */}
            <ReportHeader report={reportData} />

            <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

                {/* ── PAGE 2: SUMMARY ── */}
                <PageSection>
                    <CandidateProfile candidate={reportData.candidate} />
                </PageSection>

                <PageSection>
                    <SectionDivider label="Trust Score & Verdict" />
                    <TrustScore trustScore={reportData.trustScore} />
                </PageSection>

                <PageSection>
                    <SectionDivider label="Verification Dashboard" />
                    <VerificationDashboard dashboard={reportData.dashboard} />
                </PageSection>

                <PageSection>
                    <SectionDivider label="Summary — All 7 Pillars" />
                    <SummaryTable summaryTable={reportData.summaryTable} />
                </PageSection>

                {/* ── PAGE 3+: DETAILED CHECKS ── */}

                {/*
                   IMPORTANT: We wrap each check individually.
                   If IdentityCheck fits on Page 2, it stays there.
                   If CriminalCheck is too long, the whole Criminal block moves to Page 3.
                */}
                <PageSection forceNewPage={true}>
                    <SectionDivider label="Detailed Verification Checks" />

                    <IdentityCheck data={checks.identity} />
                </PageSection>
                <PageSection><CriminalCheck data={checks.criminal} /></PageSection>
                <PageSection><AddressCheck data={checks.address} /></PageSection>
                <PageSection><EducationCheck data={checks.education} /></PageSection>
                <PageSection><EmploymentCheck data={checks.employment} /></PageSection>
                <PageSection><GlobalCheck data={checks.global} /></PageSection>
                <PageSection><ReferenceCheck data={checks.reference} /></PageSection>

                {/* ── FINAL SECTIONS ── */}
                <PageSection>
                    <SectionDivider label="Documents Reviewed" />
                    <DocumentsReviewed documents={documents} />
                </PageSection>

                <PageSection>
                    <SectionDivider label="Report Authenticity" />
                    <ReportAuthenticity auth={authenticity} verifyUrl={reportData.verifyUrl} />
                </PageSection>

                <PageSection>
                    <SectionDivider label="Final Recommendation" />
                    <FinalRecommendation
                        trustScore={reportData.trustScore}
                        reportId={reportData.reportId}
                        companyName={reportData.companyName}
                        aiEngine={reportData.aiEngine}
                    />
                </PageSection>

            </div>
        </div>
    );
};

export default VantiraBGVReport;
