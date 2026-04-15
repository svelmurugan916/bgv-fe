// src/components/identity-check/CheckIdentity.jsx
import React, { useEffect, useRef, useState } from 'react';
import BaseCheckLayout from "../base-check-layout/BaseCheckLayout.jsx";
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import SimpleLoader from "../../../common/SimpleLoader.jsx";
import IdentityCheckSection from "./IdentityCheckSection.jsx";
import {METHOD} from "../../../../constant/ApplicationConstant.js";
import {GET_TASK_DETAILS, UPDATE_IDENTITY_CHECK_ENDPOINT} from "../../../../constant/Endpoint.tsx";
import IDVerificationModal from "./IDVerificationModal.jsx";

const CheckIdentity = ({ taskId, fetchCandidateDetails }) => {
    const [loading, setLoading] = useState(true);
    const [identityData, setIdentityData] = useState({}); // State to hold all identity document data
    const [activeDocument, setActiveDocument] = useState('aadhaar'); // State to control which section is active
    const componentInitRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();
    const [isIDModalOpen, setIsIDModalOpen] = useState(false);

    const handleCloseIDVerificationModal = () => {
        setIsIDModalOpen(false);
    };

    const onSuccess = () => {
        fetchIdentityDetails();
        if(fetchCandidateDetails) {
            fetchCandidateDetails();
        }
    }

    useEffect(() => {
        console.log("isIDModalOpen update: ", isIDModalOpen);
    }, [isIDModalOpen])

    const fetchIdentityDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${taskId}?taskType=idVerification`, METHOD.GET);
            if (response.status === 200) {
                setIdentityData(response.data);
                setActiveDocument(response.data?.documentType);
            } else {
                console.error("Failed to fetch identity data");
            }
        } catch (err) {
            console.error("Error fetching identity details:", err);
        } finally {
            setLoading(false);
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

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    // Get the currently active document data
    const currentActiveDocumentData = identityData;
    return (
        <BaseCheckLayout
            title="Identity Verification"
            description="Automated and manual verification of candidate's identity documents."
            setIsEditModalOpen={setIsIDModalOpen}
            checkId={taskId}
            onStatusUpdateSuccess={fetchIdentityDetails}
        >
            <div className="mx-auto p-10 pt-6 space-y-8">
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
            </div>
            <IDVerificationModal
                isOpen={isIDModalOpen}
                onClose={handleCloseIDVerificationModal}
                documentType={currentActiveDocumentData.documentType}
                taskId={taskId}
                onUpdateSuccess={(payload) => onSuccess(payload)}
            />
        </BaseCheckLayout>
    );
};

export default CheckIdentity;