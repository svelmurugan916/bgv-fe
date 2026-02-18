import React from 'react';
import {
    User,
    Clock,
    Calendar,
    AlertCircle,
    CheckCircle2,
    FileText,
    Maximize2,
    Gauge,
    AlertOctagon,
    UserCheck,
    History,
    Info,
    ClipboardEdit,
    Timer,
    FileSearch,
    ArrowLeft, RefreshCwIcon, UserPlusIcon, UserIcon, CheckIcon, MessageSquareQuoteIcon, UserCheckIcon, TerminalIcon,
    CpuIcon
} from 'lucide-react';
import { formatFullDateTime } from "../../../utils/date-util.js";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {ASSIGN_CHECK_TO_ME} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";

const CheckAuditTrail = ({ data = {}, checkId  }) => {
    const isSlaBreached = data.isSlaBreached || (data.slaRemainingHours <= 0);
    const isCompleted = data.status === "COMPLETED" || !!data.taskCompletedAt;
    const [isAssigning, setIsAssigning] = React.useState(false);
    const [isAssigned, setIsAssigned] = React.useState(false);
    const [errorWhileAssigned, setErrorWhileAssigned] = React.useState(false);
    const {authenticatedRequest, user} = useAuthApi();
    console.log(user);

    const formatRemainingTime = (remainingHours) => {
        if (remainingHours < 0) {
            const days = Math.abs(Math.floor(remainingHours / 24));
            return `${days} ${days === 1 ? 'Day' : 'Days'} Overdue`;
        }

        if (remainingHours < 24) {
            return `${remainingHours} Hours Left`; // Switch to hours when urgent
        }

        const days = Math.floor(remainingHours / 24);
        return `${days} of ${data.slaTotalDays} Days Left`;
    };

    const clickAssignToMe = async () => {
        setIsAssigning(true);
        setErrorWhileAssigned(false);
        try {
            const payload = {
                taskId: checkId,
                assignedToUserId: user.id,
                assignmentNotes: "Self assignment",
            }
            const response = await authenticatedRequest(payload, `${ASSIGN_CHECK_TO_ME}`, METHOD.POST);
            if(response.status === 200) {
                setIsAssigned(true);
                data.assignedTo = response?.data?.assignedToUserName;
                data.assignedToId = response?.data?.assignedToUserId
                data.taskAssignedAt = response?.data?.assignedAt;
            } else {
                setErrorWhileAssigned(true);
            }
        } catch (err) {
            console.log(err);
            setErrorWhileAssigned(true);
        } finally {
            setIsAssigning(false);
        }
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10 animate-in fade-in duration-500">

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-5">

                        <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-sm p-1 bg-white flex-shrink-0 transition-colors 
                            ${data.assignedTo ? 'border-slate-50' : 'border-rose-100 bg-rose-50/30'}`}>
                            {data.assignedTo ? (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${data.assignedTo}&background=5D4591&color=fff`}
                                    alt="Auditor"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                    <UserIcon size={32} strokeWidth={1.5} />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">
                                Assigned Auditor
                            </p>

                            <h3 className={`text-lg font-bold tracking-tight leading-none ${data.assignedTo ? 'text-slate-800' : 'text-rose-500'}`}>
                                {data.assignedTo || 'UNASSIGNED'}
                            </h3>

                            <div className={`mt-2 flex items-center  ${user?.id !== data.assignedToId && "gap-3"}`}>
                                <button
                                    onClick={clickAssignToMe}
                                    disabled={isAssigning || isAssigned}
                                    className={`text-[11px] font-semibold flex items-center gap-1 transition-all group
                                    ${isAssigned ? 'text-emerald-600' : errorWhileAssigned ? 'text-red-600' : 'text-blue-600 hover:text-blue-800'}`}
                                >
                                    {isAssigning ? (
                                        <>
                                            <RefreshCwIcon size={10} className="animate-spin" />
                                            <span>Assigning...</span>
                                        </>
                                    ) : errorWhileAssigned ? (
                                        <>
                                            <AlertCircle size={10} />
                                            <span className={"underline"}>Error occurred, Try again!.</span>
                                        </>
                                    ) : isAssigned ? (
                                        <>
                                            <CheckIcon size={10} />
                                            <span>Assigned Successfully</span>
                                        </>
                                    ) : user?.id !== data.assignedToId && (
                                        <>
                                            <UserPlusIcon size={10} />
                                            <span className="underline underline-offset-4 decoration-blue-200 group-hover:decoration-blue-800">
                                                Assign to me
                                            </span>
                                        </>
                                    )}
                                </button>

                                {!isAssigned && !isAssigning && (
                                    <>
                                        {
                                            user?.id !== data.assignedToId && <span className="text-slate-300 text-[10px]">|</span>
                                        }


                                        <button
                                            onClick={() => console.log(data.assignedTo ? 'Re-assign clicked' : 'Assign clicked')}
                                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-all group"
                                        >
                                            {data.assignedTo ? (
                                                <>
                                                    <RefreshCwIcon size={10} className="group-hover:rotate-180 transition-transform duration-500" />
                                                    <span className="underline underline-offset-4 decoration-blue-200 group-hover:decoration-blue-800">
                                                        Re-assign Task
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlusIcon size={10} />
                                                    <span className="underline underline-offset-4 decoration-blue-200 group-hover:decoration-blue-800">
                                                        Assign
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`rounded-[1.5rem] p-5 flex items-center gap-10 min-w-[360px] relative shadow-xl transition-all duration-500 
                    ${isSlaBreached ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-[#111322] text-white'}`}>

                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border 
                            ${isSlaBreached ? 'bg-white/20 border-white/30 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                            {isSlaBreached ? (
                                <AlertOctagon size={20} />
                            ) : isCompleted ? (
                                <CheckCircle2 size={20} className="text-emerald-400" />
                            ) : (
                                <Gauge size={20} className="text-white/40" />
                            )}
                        </div>

                        <div>
                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 
                                ${isSlaBreached ? 'text-white/80' : 'text-white/40'}`}>
                                {isSlaBreached
                                    ? 'CRITICAL SLA BREACH'
                                    : isCompleted ? 'PERFORMANCE RESULT' : 'SLA COMPLIANCE'
                                }
                            </p>

                            <p className="text-sm font-bold tracking-tight">
                                {isCompleted ? (
                                    isSlaBreached
                                        ? `Target Missed (${Math.abs(data.slaRemainingHours)}d Over)`
                                        : `SLA Met Successfully (Goal: ${data.slaTotalDays}d)`
                                ) : (
                                    isSlaBreached
                                        ? `${formatRemainingTime(data.slaRemainingHours)}`
                                        : `${formatRemainingTime(data.slaRemainingHours)}`
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="absolute top-4 right-5 text-right">
                        <p className={`text-[8px] font-black uppercase tracking-[0.1em] flex items-center gap-1 justify-end 
                            ${isSlaBreached ? 'text-white/80' : 'text-white/40'}`}>
                            {isSlaBreached && <AlertCircle size={8} />}
                            {isCompleted ? 'FINAL TAT' : 'CURRENT TAT'}
                        </p>
                        <p className={`text-xl font-black tracking-tighter leading-none mt-0.5 
                            ${isSlaBreached ? 'text-white' : 'text-emerald-400'}`}>
                            {data.tatInHours}h
                        </p>
                    </div>
                </div>

            </div>

            <div className="space-y-8">
                <h4 className="text-[11px] font-black text-[#5D4591] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <History size={16} className="text-[#5D4591]" /> Task Lifecycle Timeline
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-50">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-300">
                            <Clock className={"text-slate-500"} size={12} />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Created</span>
                        </div>
                        <p className="text-[13px] font-bold text-slate-700">{formatFullDateTime(data.taskCreatedAt)}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-300">
                            <UserCheck className={"text-slate-500"} size={12} />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Assigned</span>
                        </div>
                        <p className="text-[13px] font-bold text-slate-700">{formatFullDateTime(data.taskAssignedAt)}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Completed</span>
                        </div>
                        <p className="text-[13px] font-bold text-emerald-500">{formatFullDateTime(data.taskCompletedAt)}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-300">
                            <Timer className={"text-slate-500"} size={12} />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration</span>
                        </div>
                        <p className="text-[13px] font-bold text-slate-700">{data.tatInHours} Total Hours</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckAuditTrail;
