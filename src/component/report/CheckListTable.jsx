import AnnexurePage from "./AnnexurePage.jsx";

const CheckListTable = ({ checks }) => {
    const thClass = "border border-slate-800 bg-slate-50 p-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700";
    const tdClass = "border border-slate-800 p-3 text-sm text-slate-600";
    return (
        <div className="w-[210mm] min-h-[297mm] bg-white p-12 mx-auto mb-10 shadow-lg print:shadow-none">
            <h2 className="text-center border border-slate-800 py-2 font-bold text-[#00A38D] uppercase tracking-widest mb-8">
                Report Executive Summary
            </h2>

            <table className="w-full border-collapse border border-slate-800">
                <thead>
                <tr>
                    <th className={thClass}>Check Name</th>
                    <th className={thClass}>Source of Verification</th>
                    <th className={thClass}>Check Status</th>
                    <th className={thClass}>Color Severity</th>
                    <th className={thClass}>Page</th>
                    <th className={thClass}>Annexure</th>
                </tr>
                </thead>
                <tbody>
                {checks.map((check, index) => (
                    <tr key={index}>
                        <td className={tdClass}>{check.name}</td>
                        <td className={tdClass}>{check.source}</td>
                        <td className={tdClass}>{check.status}</td>
                        <td className={`${tdClass} font-bold text-emerald-600`}>
                            {check.severity}
                        </td>
                        <td className={tdClass}>
                            <a href={`#page-${index}`} className="text-blue-600 underline">
                                {String.fromCharCode(65 + index)}
                            </a>
                        </td>
                        <td className={tdClass}>
                            <a href={`#annexure-${index}`} className="text-blue-600 underline">
                                {String.fromCharCode(65 + index)}
                            </a>
                        </td>
                    </tr>
                ))}
                {checks.map((check) => (
                    check.hasDocument && <AnnexurePage key={check.id} check={check} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CheckListTable;