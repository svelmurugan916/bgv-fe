// src/components/identity-check/CheckIdentity.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Fingerprint, Check, SaveIcon, Loader2, CheckIcon, AlertCircle } from 'lucide-react';
import BaseCheckLayout from "../base-check-layout/BaseCheckLayout.jsx";
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import SimpleLoader from "../../../common/SimpleLoader.jsx";
import IdentityCheckSection from "./IdentityCheckSection.jsx";
import {METHOD} from "../../../../constant/ApplicationConstant.js";
import {GET_TASK_DETAILS, UPDATE_IDENTITY_CHECK_ENDPOINT} from "../../../../constant/Endpoint.tsx";

const mockIdentityData = {
    pan: {
        id: "pan_123",
        documentType: "PAN",
        overallStatus: "VERIFIED", // VERIFIED, DISCREPANCY, PENDING, FAILED
        documentImage: "https://picsum.photos/id/1018/800/600", // Placeholder image
        ocrConfidenceScore: 98.7,
        verificationMethod: "NSDL Database Lookup & OCR",
        verificationTimestamp: "2026-03-07T10:30:00Z",
        discrepancyReason: "",
        verifierComments: "",
        finalVerifierStatus: "",
        candidateClaims: {
            panNumber: "ABCDE1234F",
            fullName: "ARJUN VARDHAN",
            dateOfBirth: "1995-05-15",
            fatherName: "RAJESH VARDHAN",
        },
        systemVerifiedData: {
            panNumber: "ABCDE1234F",
            fullName: "ARJUN VARDHAN",
            dateOfBirth: "1995-05-15",
            fatherName: "RAJESH VARDHAN",
        },
    },
    aadhaar: {
        "documentType": "AADHAAR",
        "overallStatus": "VERIFIED",
        "verificationMethod": "DIGILOCKER_XML",
        "verificationTimestamp": "2026-03-18T18:47:48Z",
        "uploadedDocuments": [
            {
                "id": "doc_001",
                "type": "AADHAAR_FRONT",
                "url": "https://traceu-uploads.s3.amazonaws.com/samples/aadhaar_sample.jpg"
            }
        ],
        "claimedDetails": {
            "idNumber": {
                "candidateClaimedData": "358123330655",
                "systemVerifiedData": "XXXXXXXX0655",
                "doesMatch": true
            },
            "fullName": {
                "candidateClaimedData": "Velmurugan S",
                "systemVerifiedData": "Velmurugan",
                "doesMatch": true
            },
            "dateOfBirth": {
                "candidateClaimedData": "1995-12-28",
                "systemVerifiedData": "1995-12-28",
                "doesMatch": true
            },
            "fatherName": {
                "candidateClaimedData": "Shanmuga Pandiyan",
                "systemVerifiedData": "S/O: Shanmuga Pandiyan",
                "doesMatch": true
            }
        },
        "digilockerResponse": {
            "success": true,
            "message": "Success",
            "data": {
                "client_id": "digilocker_dAtfZpwtEcVjILmteJzQ",
                "digilocker_metadata": {
                    "name": "Velmurugan",
                    "gender": "M",
                    "dob": "1995-12-28",
                    "mobile_number": "9626260440"
                },
                "aadhaar_xml_data": {
                    "full_name": "Velmurugan",
                    "care_of": "S/O: Shanmuga Pandiyan",
                    "dob": "1995-12-28",
                    "yob": "1995",
                    "zip": "623501",
                    "profile_image": "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",
                }
            }
        },
        "verifierComments": "Aadhaar verified successfully via DigiLocker. Photo and XML data match candidate claims.",
        "discrepancyReason": null
    }
    ,
    passport: {
        id: "passport_789",
        documentType: "PASSPORT",
        overallStatus: "PENDING",
        documentImage: "https://picsum.photos/id/1043/800/600", // Placeholder image
        ocrConfidenceScore: 99.2,
        verificationMethod: "OCR & MRZ Scan",
        verificationTimestamp: "2026-03-07T11:30:00Z",
        discrepancyReason: "",
        verifierComments: "",
        finalVerifierStatus: "",
        candidateClaims: {
            passportNumber: "L1234567",
            fullName: "ARJUN VARDHAN",
            dateOfBirth: "1995-05-15",
            placeOfBirth: "CHENNAI",
            dateOfIssue: "2018-01-20",
            dateOfExpiry: "2028-01-19",
            nationality: "Indian",
            gender: "Male",
        },
        systemVerifiedData: {
            passportNumber: "L1234567",
            fullName: "ARJUN VARDHAN",
            dateOfBirth: "1995-05-15",
            placeOfBirth: "CHENNAI",
            dateOfIssue: "2018-01-20",
            dateOfExpiry: "2028-01-19",
            nationality: "Indian",
            gender: "Male",
        },
        mrzData: "P<INDVARDHAN<<ARJUN<<<<<<<<<<<<<<<<<<<<<<<<<<L1234567<1IND9505159M2801199<<<<<<<<<<<<<<",
        mrzChecksumStatus: "Valid",
        photoMatchConfidence: 91,
    },
};

const CheckIdentity = ({ taskId }) => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [identityData, setIdentityData] = useState({}); // State to hold all identity document data
    const [activeDocument, setActiveDocument] = useState('aadhaar'); // State to control which section is active
    const componentInitRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();

    // Fetch identity details (using mock data for now)
    const fetchIdentityDetails = async () => {
        setLoading(true);
        try {
            // In a real application, you would make an actual API call here
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${taskId}?taskType=idVerification`, METHOD.GET);
            if (response.status === 200) {
                setIdentityData(response.data);
                setActiveDocument(response.data?.documentType);
            } else {
                console.error("Failed to fetch identity data");
                // Fallback to mock data or show error
            }

            // --- Using mockData for demonstration ---
            // Simulate API delay
            // await new Promise(resolve => setTimeout(resolve, 500));
            // setIdentityData(mockIdentityData);
            // --- End mockData usage ---

        } catch (err) {
            console.error("Error fetching identity details:", err);
            // setActiveDocument('aadhaar');
            // Fallback to mock data or show error
            // setIdentityData(mockIdentityData);
        } finally {
            setLoading(false);
            // setIdentityData(mockIdentityData)
        }
    };

    useEffect(() => {
        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchIdentityDetails();
        }
    }, [taskId]);

    // Function to update data for a specific identity document
    const updateIdentityDocument = (docType, newData) => {
        setIdentityData(prev => ({
            ...prev,
            [docType]: newData
        }));
    };

    const validateAllIdentities = () => {
        const errors = {};
        let isValid = true;

        Object.keys(identityData).forEach(docTypeKey => {
            const doc = identityData[docTypeKey];
            if (doc.overallStatus === 'PENDING' || doc.overallStatus === 'PENDING_MANUAL_REVIEW') {
                errors[docTypeKey] = "Final status selection required.";
                isValid = false;
            }
            if ((doc.overallStatus === 'DISCREPANCY' || doc.overallStatus === 'FAILED') && !doc.discrepancyReason?.trim()) {
                errors[docTypeKey] = errors[docTypeKey] ? `${errors[docTypeKey]} Discrepancy reason required.` : "Discrepancy reason required.";
                isValid = false;
            }
        });

        // This would be more complex in a real app, perhaps storing errors per document
        // For now, we'll just show a generic error if any document has issues.
        if (!isValid) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
        return isValid;
    };

    const handleOverallSave = async () => {
        if (!validateAllIdentities()) {
            return;
        }

        setIsSaving(true);
        setSaveStatus(null);

        const payload = Object.keys(identityData).reduce((acc, docTypeKey) => {
            const doc = identityData[docTypeKey];
            acc[docTypeKey] = {
                id: doc.id,
                overallStatus: doc.overallStatus,
                discrepancyReason: doc.discrepancyReason,
                verifierComments: doc.verifierComments,
                finalVerifierStatus: doc.finalVerifierStatus || doc.overallStatus, // Ensure final status is set
            };
            return acc;
        }, {});

        try {
            // Replace with your actual API endpoint for updating identity checks
            const response = await authenticatedRequest(payload, `${UPDATE_IDENTITY_CHECK_ENDPOINT}/${taskId}`, METHOD.PUT);
            if (response.status === 200) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                fetchIdentityDetails(); // Re-fetch to ensure UI is in sync
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
            console.error("Error saving identity data:", err);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    // Get the currently active document data
    const currentActiveDocumentData = identityData;
    return (
        <BaseCheckLayout
            title="Identity Verification"
            description="Automated and manual verification of candidate's identity documents."
            checkId={taskId}
        >
            <div className="mx-auto p-10 pt-6 space-y-8">
                {/* Render only the active Identity Check Section */}
                {currentActiveDocumentData && (
                    <IdentityCheckSection
                        taskId={taskId}
                        key={activeDocument} // Key is important for React to re-render when activeDocument changes
                        documentType={currentActiveDocumentData.documentType}
                        data={currentActiveDocumentData}
                        updateIdentityData={updateIdentityDocument}
                        fetchIdentityDetails={fetchIdentityDetails}
                    />
                )}

                {/* Save Section */}
                {/*<div className="flex items-center justify-between pt-6 border-t border-slate-100">*/}
                {/*    <div className="flex items-center gap-3">*/}
                {/*        {saveStatus === 'success' && (*/}
                {/*            <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-2">*/}
                {/*                <Check size={18} className="bg-emerald-100 rounded-full p-0.5" />*/}
                {/*                <span className="text-xs font-bold uppercase tracking-wider">Identity Checks Saved Successfully</span>*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*        {saveStatus === 'error' && (*/}
                {/*            <div className="flex items-center gap-2 text-rose-600 animate-in shake">*/}
                {/*                <AlertCircle size={18} />*/}
                {/*                <span className="text-xs font-bold uppercase tracking-wider">Failed to save changes. Please check for errors.</span>*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}

                {/*    <button*/}
                {/*        onClick={handleOverallSave}*/}
                {/*        disabled={isSaving}*/}
                {/*        className={`*/}
                {/*            flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300*/}
                {/*            ${isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :*/}
                {/*            saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :*/}
                {/*                'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] hover:shadow-xl hover:shadow-[#5D4591]/30 hover:-translate-y-0.5 active:scale-95'}*/}
                {/*        `}*/}
                {/*    >*/}
                {/*        {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveStatus === 'success' ? <CheckIcon size={18} /> : <SaveIcon size={18} />}*/}
                {/*        <span className="uppercase tracking-widest">*/}
                {/*            {isSaving ? 'Saving All...' : saveStatus === 'success' ? 'All Identities Updated' : 'Submit All Identities'}*/}
                {/*        </span>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </BaseCheckLayout>
    );
};

export default CheckIdentity;