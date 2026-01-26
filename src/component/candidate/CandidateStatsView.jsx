import {CheckCircle2, Clock, FileQuestion, Users} from "lucide-react";
import React from "react";

const CandidateStatsView = ({candidates, parentDivClass = "max-w-7xl"}) => {
    return (
        <div className={`${parentDivClass} mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-5`} >
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Candidates</p>
                    <p className="text-2xl font-black text-slate-900">{candidates?.length || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Completed</p>
                    <p className="text-2xl font-black text-slate-900">{candidates?.filter(c => ['GREEN', 'AMBER', 'RED'].includes(c?.caseDetails?.status)).length ?? 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <Clock className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Work In progress</p>
                    <p className="text-2xl font-black text-slate-900">{candidates?.filter(c => c?.caseDetails?.status === 'IN_PROGRESS')?.length || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                    <FileQuestion className="w-7 h-7 text-red-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Insufficiency</p>
                    <p className="text-2xl font-black text-slate-900">{candidates?.filter(c => c?.caseDetails?.status === 'INSUFFICIENCY_RAISED')?.length || 0}</p>
                </div>
            </div>
        </div>
    )
}

export default CandidateStatsView;