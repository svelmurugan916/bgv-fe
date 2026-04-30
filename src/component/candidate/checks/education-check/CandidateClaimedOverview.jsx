import {Building2Icon, CalendarDaysIcon, GraduationCap, Hash, MapPin, TrophyIcon} from "lucide-react";
import React from "react";

const CandidateClaimedOverview = ({candidateClaimedDetails}) => {
    return (
        <div className="p-8 bg-slate-50/40 border-b border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-10">

                {/* 1. Primary Qualification */}
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Qualification & Stream</p>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-[#5D4591]/10 rounded-lg shrink-0">
                            <GraduationCap size={14} className="text-[#5D4591]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                                {candidateClaimedDetails?.degree}
                            </p>
                            <p className="text-[11px] font-medium text-slate-500 mt-1">
                                {candidateClaimedDetails?.branch} • {candidateClaimedDetails?.educationLevel}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Institution Details */}
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Institution & University</p>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-[#5D4591]/10 rounded-lg shrink-0">
                            <Building2Icon size={14} className="text-[#5D4591]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                                {candidateClaimedDetails?.instituteName}
                            </p>
                            <p className="text-[11px] font-medium text-slate-500 mt-1 italic">
                                {candidateClaimedDetails?.universityName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Scores & Timeline */}
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Performance & Timeline</p>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-[#5D4591]/10 rounded-lg shrink-0">
                            <TrophyIcon size={14} className="text-[#5D4591]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                                {candidateClaimedDetails?.gpaOrPercentage}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mt-1">
                                <CalendarDaysIcon size={12} className="text-slate-300" />
                                <span>{candidateClaimedDetails?.monthOfPassing} {candidateClaimedDetails?.yearOfPassing}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Identity & Location */}
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Roll Number & Location</p>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-[#5D4591]/10 rounded-lg shrink-0">
                            <Hash size={14} className="text-[#5D4591]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight tracking-wide">
                                {candidateClaimedDetails?.rollNumber || "N/A"}
                            </p>
                            {
                                (candidateClaimedDetails?.cityOfInstitution || candidateClaimedDetails?.stateOfInstitution) && (
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mt-1">
                                        <MapPin size={12} className="text-slate-300" />
                                        <span>{candidateClaimedDetails?.cityOfInstitution}, {candidateClaimedDetails?.stateOfInstitution}</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CandidateClaimedOverview