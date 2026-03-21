// src/components/identity-check/components/VerifierIntervention.jsx
import React from 'react';
import SingleSelectDropdown from "../../../dropdown/SingleSelectDropdown.jsx";

const VerifierIntervention = ({
                                  discrepancyReason,
                                  onDiscrepancyReasonChange,
                                  verifierComments,
                                  onVerifierCommentsChange,
                                  finalVerifierStatus,
                                  onFinalVerifierStatusChange,
                                  hasDiscrepancy, // Boolean to control visibility
                                  errors = {} // For validation errors
                              }) => {

    const statusOptions = [
        { value: 'VERIFIED', text: 'Verified' },
        { value: 'DISCREPANCY', text: 'Discrepancy' },
        { value: 'PENDING_MANUAL_REVIEW', text: 'Pending Manual Review' },
        { value: 'FAILED', text: 'Failed' },
    ];

    return (
        <div className="space-y-4 pt-6 border-slate-100 overflow-visible">
            {hasDiscrepancy && (
                <div className="space-y-2">
                    <label htmlFor="discrepancyReason" className="text-[10px] font-bold text-slate-400 uppercase block">Reason for Discrepancy</label>
                    <textarea
                        id="discrepancyReason"
                        value={discrepancyReason}
                        onChange={(e) => onDiscrepancyReasonChange(e.target.value)}
                        placeholder="Detail the discrepancy found..."
                        rows={3}
                        className={`w-full p-3 bg-white border rounded-xl text-xs font-bold outline-none resize-y
                            ${errors.discrepancyReason ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-[#5D4591] focus:ring-2 focus:ring-[#5D4591]/10'}`}
                    />
                    {errors.discrepancyReason && <p className="text-rose-500 text-xs mt-1">{errors.discrepancyReason}</p>}
                </div>
            )}
        </div>
    );
};

export default VerifierIntervention;
