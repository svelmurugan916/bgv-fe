// mockBgvReport.js

import VantiraBGVReport from "./VantiraBGVReport.jsx";

 const mockBgvReport = {
    reportId: "VTR-2024-08821",
    generatedAt: "22 Apr 2026 · 09:14 IST",
    turnaroundTime: "43 Hr 12 Min",
    turnaroundIndustryAvg: "5–7 Business Days",
    turnaroundFasterPercent: "83%",
    requestedBy: "Priya Nair, CHRO",
    complianceTags: [
        "DPDP Compliant",
        "MeitY Tier-4 Servers",
        "256-bit AES Encrypted",
        "Tamper-Evident",
    ],
    verifyUrl: "https://verify.vantira.io",
    verifyEmail: "verify@vantira.io",
    legalEmail: "legal@vantira.io",
    companyName: "Corentec Solutions Pvt Ltd",
    aiEngine: "Vantira AI Engine v2.0",

    candidate: {
        fullName: "Rahul Sharma",
        role: "Software Engineer – L3",
        company: "TechBridge Solutions Pvt Ltd",
        dateOfBirth: "14 March 1995",
        pan: "ABCDE1234F",
        aadhaar: "XXXX XXXX 7821",
        mobile: "+91 98765 43210",
        email: "rahul.sharma@email.com",
        city: "Hyderabad, Telangana",
        photo: null,
    },

    clientOrganisation: {
        name: "TechBridge Solutions Pvt Ltd",
        logo: null, // ← null triggers text fallback
                    // Replace with URL string when available
                    // e.g. "https://your-s3.com/logos/techbridge.png"
        industry: "Technology",
        location: "Bengaluru, India",
    },

    trustScore: {
        score: 91,
        maxScore: 100,
        confidence: "HIGH CONFIDENCE",
        riskLevel: "LOW",
        verdict: "CLEARED FOR ONBOARDING",
        verdictDetail:
            "All 7 verification pillars completed successfully. One minor education discrepancy was detected, investigated, and resolved. No criminal record, fraud, or watchlist concerns. Candidate is cleared for immediate onboarding.",
        breakdown: [
            { label: "Base Score",                        points: 100, deduction: false },
            { label: "Identity Verified",                 points: 0,   deduction: false },
            { label: "Criminal: No Records",              points: 0,   deduction: false },
            { label: "Address: GPS Confirmed",            points: 0,   deduction: false },
            { label: "Education: Minor Typo Discrepancy", points: -9,  deduction: true,
                note: "Resolved — no fraud indicator" },
            { label: "Employment: 2 Employers Verified",  points: 0,   deduction: false },
            { label: "Global Screening: All Clear",       points: 0,   deduction: false },
            { label: "References: Positive Feedback",     points: 0,   deduction: false },
            { label: "Final Score",                       points: 91,  deduction: false, isFinal: true },
        ],
    },

    dashboard: {
        checksPassed: 7,
        totalChecks: 7,
        minorFlags: 1,
        criticalFlags: 0,
        pillars: [
            { key: "identity",   label: "Identity",   status: "VERIFIED", icon: "shield" },
            { key: "criminal",   label: "Criminal",   status: "VERIFIED", icon: "gavel"  },
            { key: "address",    label: "Address",    status: "VERIFIED", icon: "mapPin" },
            { key: "education",  label: "Education",  status: "FLAG",     icon: "book"   },
            { key: "employment", label: "Employment", status: "VERIFIED", icon: "briefcase" },
            { key: "global",     label: "Global",     status: "VERIFIED", icon: "globe"  },
            { key: "reference",  label: "Reference",  status: "VERIFIED", icon: "users"  },
        ],
    },

    summaryTable: [
        {
            check: "Identity & Fraud",
            finding: "PAN + Aadhaar + Passport matched",
            source: "NSDL / DigiLocker / Surepass",
            tat: "T + 1 min",
            status: "VERIFIED",
        },
        {
            check: "Criminal Record",
            finding: "No records found — 15K+ courts",
            source: "E-Courts Judicial API",
            tat: "T + 12 min",
            status: "VERIFIED",
        },
        {
            check: "Address Audit",
            finding: "GPS + EXIF confirmed — present",
            source: "Live in-app capture",
            tat: "T + 11 hrs",
            status: "VERIFIED",
        },
        {
            check: "Education",
            finding: "B.Tech JNTU 2017 — note below",
            source: "Direct Registrar",
            tat: "T + 24 hrs",
            status: "FLAG",
            deduction: "−9 pts",
        },
        {
            check: "Employment History",
            finding: "2 employers verified — clean exit",
            source: "HR cross-check",
            tat: "T + 36 hrs",
            status: "VERIFIED",
        },
        {
            check: "Global Screening",
            finding: "No watchlist / PEP / AML hits",
            source: "Interpol · FBI · OFAC",
            tat: "T + 40 hrs",
            status: "VERIFIED",
        },
        {
            check: "Reference Check",
            finding: "2 referees — positive feedback",
            source: "Human-led calls",
            tat: "T + 43 hrs",
            status: "VERIFIED",
        },
    ],

    checks: {
        identity: {
            status: "VERIFIED",
            subtitle: "OCR · NSDL · DigiLocker · Surepass · Face Match",
            rows: [
                {
                    check: "PAN Verification",
                    value: "ABCDE1234F",
                    source: "NSDL Real-time API",
                    status: "VERIFIED",
                },
                {
                    check: "Aadhaar Auth",
                    value: "XXXX XXXX 7821",
                    source: "DigiLocker Consent Flow",
                    status: "VERIFIED",
                },
                {
                    check: "Passport Check",
                    value: "Z1234567 (valid 2029)",
                    source: "Surepass API",
                    status: "VERIFIED",
                },
                {
                    check: "Face Match",
                    value: "98.4% match — live vs ID photo",
                    source: "In-app biometric capture",
                    status: "VERIFIED",
                },
                {
                    check: "Duplicate Profile",
                    value: "None detected",
                    source: "Multi-vector AI",
                    status: "VERIFIED",
                },
                {
                    check: "OCR Typing Accuracy",
                    value: "60% reduction achieved",
                    source: "AI-Assisted ID Capture",
                    status: "VERIFIED",
                },
            ],
        },

        criminal: {
            status: "VERIFIED",
            subtitle: "15,000+ District · High · Supreme Courts · Fuzzy Match",
            riskScore: 0,
            riskMax: 100,
            riskCategory: "LOW RISK",
            finding:
                "No criminal records found across 15,000+ courts nationwide.",
            detail:
                "Fuzzy name matching applied across Devanagari, Telugu, and Roman script variants. Father's name cross-referenced.",
        },

        address: {
            status: "VERIFIED",
            subtitle: "GPS Coordinates · EXIF Forensics · Triangulated Approval",
            declaredAddress:
                "Suite 402, Block B, Innovation Hub, Hitech City, Hyderabad 500081",
            gps: "17.4482° N, 78.3914° E",
            exifTimestamp: "21 Apr 2026 · 14:32 IST",
            galleryDisabled: true,
            triangulation: "GPS + Address + EXIF — 100%",
            finding: "Physical presence confirmed via three independent signals. Address fraud eliminated.",
        },

        education: {
            status: "FLAG",
            subtitle: "Direct Registrar Contact · Document Forensics · OCR Extraction",
            scoreImpact: "−9 pts",
            flagTitle: "MINOR DISCREPANCY — DETECTED & RESOLVED",
            flagDetail:
                "Typographic error in father's name on the Consolidated Marksheet. Detected via OCR cross-match and confirmed by direct Registrar communication. Degree authenticity confirmed. No fraud indicators.",
            institution: "JNTU Hyderabad",
            degree: "B.Tech – Computer Science",
            yearClaimed: "2017",
            yearVerified: "2017",
            rollNumber: "17241A0534",
            registrarConfirmation: "Direct contact — confirmed",
            discrepancy: "Father's name typo on Marksheet",
            resolution: "OCR cross-match + Registrar confirmation",
            fraudRisk: "NONE DETECTED",
        },

        employment: {
            status: "VERIFIED",
            subtitle: "One-Click Dispatch · Structured Questionnaire · Tenure Verification",
            employers: [
                {
                    company: "TechBridge Solutions Pvt Ltd",
                    period: "January 2021 – Present",
                    role: "Senior Software Engineer",
                    verifiedBy: "Anita Kapoor — HR Manager",
                    tenure: "Confirmed (Current)",
                    exitReason: "N/A (Current Employee)",
                    rehireEligible: true,
                    detail:
                        "All employment details verified. Designation and compensation bracket confirmed. No disciplinary records.",
                    status: "VERIFIED",
                },
                {
                    company: "Infosys Ltd",
                    period: "June 2017 – December 2020",
                    role: "Systems Engineer",
                    verifiedBy: "Ravi Kumar — HRBP",
                    tenure: "3 Years 6 Months",
                    exitReason: "Voluntary — better opportunity",
                    rehireEligible: true,
                    detail:
                        "Clean separation. PF records reconciled. No performance concerns raised.",
                    status: "VERIFIED",
                },
            ],
        },

        global: {
            status: "VERIFIED",
            subtitle: "1,200+ Watchlists · AML · PEP · Adverse Media · Fuzzy Match",
            screenings: [
                { label: "Interpol Red Notice", result: "CLEAR" },
                { label: "FBI Most Wanted",     result: "CLEAR" },
                { label: "OFAC Sanctions",      result: "CLEAR" },
                { label: "UN Sanctions",        result: "CLEAR" },
                { label: "PEP Screening",       result: "CLEAR" },
                { label: "Adverse Media",       result: "CLEAR" },
            ],
        },

        reference: {
            status: "VERIFIED",
            subtitle: "Human-Led Calls · Behavioural Questionnaire · Sentiment Analysis",
            referees: [
                {
                    name: "Anita Kapoor",
                    designation: "HR Manager, TechBridge Solutions",
                    integrityScore: 94,
                    status: "VERIFIED",
                    feedback:
                        "Excellent team player with strong technical delivery. Consistent performance across all projects. Would rehire without hesitation.",
                },
                {
                    name: "Suresh Menon",
                    designation: "Tech Lead, Infosys Ltd",
                    integrityScore: 91,
                    status: "VERIFIED",
                    feedback:
                        "Highly reliable. Quick learner and strong under pressure. No integrity concerns raised. Recommended for senior roles.",
                },
            ],
        },
    },

    documents: [
        { label: "Aadhaar Card",            url: "https://view.vantira.io/docs/VTR-08821/aadhaar",     status: "VERIFIED", note: null },
        { label: "PAN Card",                url: "https://view.vantira.io/docs/VTR-08821/pan",         status: "VERIFIED", note: null },
        { label: "Passport (Bio Page)",     url: "https://view.vantira.io/docs/VTR-08821/passport",    status: "VERIFIED", note: null },
        { label: "Provisional Certificate", url: "https://view.vantira.io/docs/VTR-08821/prov-cert",   status: "VERIFIED", note: null },
        { label: "Consolidated Marksheet",  url: "https://view.vantira.io/docs/VTR-08821/marksheet",   status: "VERIFIED", note: "Minor father's name typo — resolved" },
        { label: "Offer Letter — TechBridge", url: "https://view.vantira.io/docs/VTR-08821/offer-tb", status: "VERIFIED", note: null },
        { label: "Offer Letter — Infosys",  url: "https://view.vantira.io/docs/VTR-08821/offer-inf",  status: "VERIFIED", note: null },
        { label: "Relieving Letter — Infosys", url: "https://view.vantira.io/docs/VTR-08821/relieve-inf", status: "VERIFIED", note: null },
        { label: "Live Address Photo",      url: "https://view.vantira.io/docs/VTR-08821/addr-photo",  status: "VERIFIED", note: null },
        { label: "GPS Capture Screenshot",  url: "https://view.vantira.io/docs/VTR-08821/gps",         status: "VERIFIED", note: null },
    ],

    authenticity: {
        reportId: "VTR-2024-08821",
        verifyUrl: "https://verify.vantira.io",
        hashAlgorithm: "SHA-256",
        documentHash: "a9f3c2d1e4b7...",
        signedBy: "Vantira AI Engine v2.0",
        timestamp: "22 Apr 2026 · 09:14 IST",
        guarantee:
            "This report is cryptographically hashed and stored on Vantira's immutable audit ledger. Any modification to this document will invalidate the hash.",
    },
};


const ReportPage = () => {
    return (
        <div className="bg-slate-300">
            <div className="max-w-6xl mx-auto space-y-10">
                <VantiraBGVReport reportData={mockBgvReport} />
            </div>
        </div>
)
}
export default ReportPage;