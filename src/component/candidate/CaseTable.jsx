import {
    MoreVertical,
    CheckCircle2,
    GraduationCap,
    Briefcase,
    Scale,
    AlertCircle,
    FileTextIcon,
    SendIcon
} from 'lucide-react';

const CaseTable = ({ cases }) => {
    const getStatusStyles = (status) => {
        switch(status) {
            case 'Completed': return 'bg-green-50 text-green-700 border-green-100';
            case 'WIP': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Insufficiency': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'Invited': return 'bg-purple-50 text-[#5D4591] border-purple-100';
            case 'Stop-Case': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getRiskIcon = (risk) => {
        if (risk === 'green') return <span className="w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-green-50" title="Green - Clear"></span>;
        if (risk === 'amber') return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50" title="Amber - Minor Discrepancy"></span>;
        if (risk === 'red') return <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-50" title="Red - Major Discrepancy"></span>;
        return <span className="text-slate-300">--</span>;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Package & Checks</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">TAT</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Risk</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {cases.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#F9F7FF] border border-[#5D4591]/10 flex items-center justify-center text-[#5D4591] font-bold text-xs shrink-0">
                                    {item.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[11px] text-slate-400 font-medium">{item.id}</p>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <p className="text-[11px] text-slate-400 truncate">{item.email}</p>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">{item.package} Package</p>
                            <div className="flex items-center gap-2">
                                <GraduationCap size={14} className="text-slate-300" />
                                <Briefcase size={14} className="text-slate-300" />
                                <Scale size={14} className="text-slate-300" />
                                <div className="ml-2 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-[#5D4591] h-full" style={{ width: `${item.progress}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{item.progress}%</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border ${getStatusStyles(item.status)}`}>
                                    {item.status}
                                </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                                <p className="text-sm font-bold text-slate-700">{item.tat} Days</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Elapsed</p>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                            {getRiskIcon(item.risk)}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                {item.status === 'Completed' ? (
                                    <button className="p-2 text-[#5D4591] hover:bg-[#F9F7FF] rounded-lg transition-all" title="View Report"><FileTextIcon size={18} /></button>
                                ) : item.status === 'Invited' ? (
                                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Send Reminder"><SendIcon size={18} /></button>
                                ) : item.status === 'Insufficiency' ? (
                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Manage Blocking"><AlertCircle size={18} /></button>
                                ) : null}
                                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical size={18} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CaseTable;