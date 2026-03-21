// src/components/identity-check/components/PassportDetails.jsx
import React from 'react';
import DataComparisonField from './DataComparisonField.jsx';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';
import { format, isAfter } from 'date-fns'; // For date formatting and comparison

const PassportDetails = ({ data }) => {
    const { candidateClaims, systemVerifiedData, mrzData, mrzChecksumStatus, photoMatchConfidence } = data;

    const getPhotoMatchStatus = () => {
        if (photoMatchConfidence >= 80) return { icon: <ShieldCheck size={16} className="text-emerald-500" />, text: "High Confidence Match", color: "text-emerald-700" };
        if (photoMatchConfidence >= 60) return { icon: <AlertTriangle size={16} className="text-amber-500" />, text: "Medium Confidence Match", color: "text-amber-700" };
        return { icon: <XCircle size={16} className="text-rose-500" />, text: "Low Confidence Match / No Match", color: "text-rose-700" };
    };

    const photoMatch = getPhotoMatchStatus();

    const isPassportExpired = systemVerifiedData?.dateOfExpiry && isAfter(new Date(), new Date(systemVerifiedData.dateOfExpiry));
    const isPassportExpiringSoon = systemVerifiedData?.dateOfExpiry && isAfter(new Date(systemVerifiedData.dateOfExpiry), new Date()) && isAfter(new Date(systemVerifiedData.dateOfExpiry), new Date().setMonth(new Date().getMonth() + 6));


    return (
        <div className="space-y-4">
            <DataComparisonField
                label="Passport Number"
                candidateClaim={candidateClaims?.passportNumber}
                systemVerifiedData={systemVerifiedData?.passportNumber}
                isMatch={candidateClaims?.passportNumber === systemVerifiedData?.passportNumber}
            />
            <DataComparisonField
                label="Full Name (as per Passport)"
                candidateClaim={candidateClaims?.fullName}
                systemVerifiedData={systemVerifiedData?.fullName}
                isMatch={candidateClaims?.fullName === systemVerifiedData?.fullName}
            />
            <DataComparisonField
                label="Date of Birth"
                candidateClaim={candidateClaims?.dateOfBirth ? format(new Date(candidateClaims.dateOfBirth), 'dd-MM-yyyy') : ''}
                systemVerifiedData={systemVerifiedData?.dateOfBirth ? format(new Date(systemVerifiedData.dateOfBirth), 'dd-MM-yyyy') : ''}
                isMatch={candidateClaims?.dateOfBirth === systemVerifiedData?.dateOfBirth}
            />
            <DataComparisonField
                label="Place of Birth"
                candidateClaim={candidateClaims?.placeOfBirth}
                systemVerifiedData={systemVerifiedData?.placeOfBirth}
                isMatch={candidateClaims?.placeOfBirth === systemVerifiedData?.placeOfBirth}
            />
            <DataComparisonField
                label="Date of Issue"
                candidateClaim={candidateClaims?.dateOfIssue ? format(new Date(candidateClaims.dateOfIssue), 'dd-MM-yyyy') : ''}
                systemVerifiedData={systemVerifiedData?.dateOfIssue ? format(new Date(systemVerifiedData.dateOfIssue), 'dd-MM-yyyy') : ''}
                isMatch={candidateClaims?.dateOfIssue === systemVerifiedData?.dateOfIssue}
            />
            <DataComparisonField
                label="Date of Expiry"
                candidateClaim={candidateClaims?.dateOfExpiry ? format(new Date(candidateClaims.dateOfExpiry), 'dd-MM-yyyy') : ''}
                systemVerifiedData={systemVerifiedData?.dateOfExpiry ? format(new Date(systemVerifiedData.dateOfExpiry), 'dd-MM-yyyy') : ''}
                isMatch={candidateClaims?.dateOfExpiry === systemVerifiedData?.dateOfExpiry}
            />
            {systemVerifiedData?.dateOfExpiry && (
                <div className="flex flex-col border-b border-slate-100 py-3 last:border-b-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Validity Status</p>
                    <p className={`text-sm font-bold ${isPassportExpired ? 'text-rose-600' : isPassportExpiringSoon ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {isPassportExpired ? 'Expired' : isPassportExpiringSoon ? 'Expires Soon (< 6 months)' : 'Valid'}
                    </p>
                </div>
            )}
            <DataComparisonField
                label="Nationality"
                candidateClaim={candidateClaims?.nationality}
                systemVerifiedData={systemVerifiedData?.nationality}
                isMatch={candidateClaims?.nationality === systemVerifiedData?.nationality}
            />
            <DataComparisonField
                label="Gender"
                candidateClaim={candidateClaims?.gender}
                systemVerifiedData={systemVerifiedData?.gender}
                isMatch={candidateClaims?.gender === systemVerifiedData?.gender}
            />
            {mrzData && (
                <div className="flex flex-col border-b border-slate-100 py-3 last:border-b-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Raw MRZ Data (Extracted)</p>
                    <p className="text-sm font-mono text-slate-700 break-all">{mrzData}</p>
                </div>
            )}
            {mrzChecksumStatus && (
                <div className="flex flex-col border-b border-slate-100 py-3 last:border-b-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">MRZ Checksum Status</p>
                    <p className={`text-sm font-bold ${mrzChecksumStatus === 'Valid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {mrzChecksumStatus}
                    </p>
                </div>
            )}
            {photoMatchConfidence !== undefined && (
                <div className="flex flex-col border-b border-slate-100 py-3 last:border-b-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Photo Match Confidence</p>
                    <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold ${photoMatch.color}`}>
                            {photoMatchConfidence}% - {photoMatch.text}
                        </p>
                        {photoMatch.icon}
                    </div>
                    {/* Optional: Add side-by-side photo display here if actual images are available */}
                </div>
            )}
        </div>
    );
};

export default PassportDetails;
