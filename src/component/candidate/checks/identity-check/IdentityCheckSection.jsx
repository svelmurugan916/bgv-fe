// src/components/identity-check/components/IdentityCheckSection.jsx
import React from 'react';
import {Clock, ClockIcon, SearchIcon, ShieldCheck, ShieldQuestion, XCircle} from 'lucide-react';
import VerifierIntervention from './VerifierIntervention.jsx';
import PanDetails from './PanDetails.jsx';
import AadhaarDetails from './AadhaarDetails.jsx';
import PassportDetails from './PassportDetails.jsx';
import {formatFullDateTime} from '../../../../utils/date-util.js';
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import {PAN_VERIFY, PASSPORT_VERIFY, SEND_DIGI_LOCKER_LINK_FOR_AADHAAR} from "../../../../constant/Endpoint.tsx";
import {METHOD} from "../../../../constant/ApplicationConstant.js";

const IdentityCheckSection = ({
                                  documentType,
                                  taskId,
                                  data,
                                  updateIdentityData,
                                  fetchIdentityDetails,
                                  caseBillingStatus
                              }) => {

    const { authenticatedRequest } = useAuthApi();

    console.log('documentType- ', documentType)

    const getOverallStatusColor = () => {
        switch (data.overallStatus) {
            case 'CLEARED': return 'bg-emerald-50 text-emerald-700';
            case 'FAILED': return 'bg-red-50 text-red-600';
            case 'IN_PROGRESS':
                return 'bg-blue-50 text-blue-700';
            case 'NEEDS_REVIEW':
                return 'bg-violet-50 text-violet-700';
            case 'UNABLE_TO_VERIFY':
                return 'bg-amber-50 text-amber-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusIcon = () => {
        switch (data.overallStatus) {
            case 'CLEARED': return <ShieldCheck size={20} className="text-emerald-700" />;
            case 'IN_PROGRESS':
                return <ClockIcon size={20} className="text-blue-700" />;
            case 'NEEDS_REVIEW':
                return <ShieldQuestion size={20} className="text-violet-700" />;
            case 'UNABLE_TO_VERIFY':
                return <ShieldQuestion size={20} className="text-amber-700" />;
            case 'FAILED': return <XCircle size={20} className="text-red-500" />;
            default: return <Clock size={20} className="text-slate-400" />;
        }
    };

    const handleSendDigilockerLink = async () => {
        try {
            console.log("Triggering DigiLocker Link Service...");

            const payload = {
                candidateId: data.candidateId,
                identityCheckId: taskId,
            };

            const response = await authenticatedRequest(payload, SEND_DIGI_LOCKER_LINK_FOR_AADHAAR, METHOD.POST);
            return response.status === 200;
        } catch (error) {
            // Re-throw so AadhaarDetails can catch it
            throw error;
        }
    };

    const handleOnTriggerReVerify = async (type) => {
        try {
            console.log("Triggering DigiLocker Link Service...");

            const payload = {
                candidateId: data.candidateId,
                task_id: taskId,
            };
            return await authenticatedRequest(payload, type === "PAN" ? PAN_VERIFY : PASSPORT_VERIFY, METHOD.POST);
        } catch (error) {
            // Re-throw so AadhaarDetails can catch it
            throw error;
        }
    }

    const renderDetailsComponent = () => {
        switch (documentType) {
            case 'PAN': return <PanDetails data={data} onTriggerReVerify={() => handleOnTriggerReVerify("PAN")} fetchIdentityDetails={fetchIdentityDetails} caseBillingStatus={caseBillingStatus}/>;
            case 'AADHAAR': return (
                <AadhaarDetails
                    data={data}
                    onSendDigilockerLink={handleSendDigilockerLink}
                    fetchIdentityDetails={fetchIdentityDetails}
                />
            );
            case 'PASSPORT': return <PassportDetails data={data} onTriggerReVerify={() => handleOnTriggerReVerify("PASSPORT")} fetchIdentityDetails={fetchIdentityDetails} caseBillingStatus={caseBillingStatus}/>;
            default: return null;
        }
    };

    const handleUpdateField = (fieldName, value) => {
        updateIdentityData(data.documentType.toLowerCase(), {
            ...data,
            [fieldName]: value
        });
    };

    const hasAnyDiscrepancy = data.claimedDetails
        ? Object.values(data.claimedDetails).some(field => field.doesMatch === false)
        : false;

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="w-full flex items-center justify-between p-8 border-b border-slate-50">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${getOverallStatusColor()}`}>
                        {getStatusIcon()}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800">{documentType} Verification</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity Assurance Level 2</p>
                    </div>
                </div>
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${getOverallStatusColor()}`}>
                    {data.overallStatus?.replace(/_/g, ' ')}
                </span>
            </div>

            <div className="p-8">
                {renderDetailsComponent()}

                <div className="grid grid-cols-2 gap-4 pt-6 mt-4 border-t border-slate-100">

                    {/* 1. Verification Method */}
                    <div className="flex items-center gap-3 group/meta">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50 transition-transform group-hover/meta:scale-110">
                            <SearchIcon size={16} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                                Verification Method
                            </p>
                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                                {data.verificationMethod || 'Direct API Sync'}
                            </p>
                        </div>
                    </div>

                    {/* 2. Verification Timestamp */}
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-100 group/meta">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-200/50 transition-transform group-hover/meta:scale-110">
                            <ClockIcon size={16} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                                Last Synced At
                            </p>
                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                                {data.verificationTimestamp ? formatFullDateTime(data.verificationTimestamp) : 'Pending Sync'}
                            </p>
                        </div>
                    </div>
                </div>


                <VerifierIntervention
                    discrepancyReason={data.discrepancyReason}
                    onDiscrepancyReasonChange={(val) => handleUpdateField('discrepancyReason', val)}
                    verifierComments={data.verifierComments}
                    onVerifierCommentsChange={(val) => handleUpdateField('verifierComments', val)}
                    finalVerifierStatus={data.finalVerifierStatus || data.overallStatus}
                    onFinalVerifierStatusChange={(val) => handleUpdateField('overallStatus', val)}
                    hasDiscrepancy={hasAnyDiscrepancy || data.overallStatus === 'DISCREPANCY'}
                />
            </div>
        </div>
    );
};

export default IdentityCheckSection;
