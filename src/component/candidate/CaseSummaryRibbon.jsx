import {CheckCircle2, ClockIcon, FileQuestion, UsersIcon} from "lucide-react";

const CaseSummaryRibbon = ({ allOrganizationStatistics }) => {
    return (
        <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <UsersIcon className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Cases</p>
                    <p className="text-2xl font-black text-slate-900">{allOrganizationStatistics?.totalCasesAcrossAll || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Completed</p>
                    <p className="text-2xl font-black text-slate-900">{allOrganizationStatistics?.totalCompleted || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <ClockIcon className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Work In progress</p>
                    <p className="text-2xl font-black text-slate-900">{allOrganizationStatistics?.pendingCases || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                    <FileQuestion className="w-7 h-7 text-red-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Insufficiency</p>
                    <p className="text-2xl font-black text-slate-900">{allOrganizationStatistics?.insufficientCases || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default CaseSummaryRibbon;