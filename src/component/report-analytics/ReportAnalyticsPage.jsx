import React, { useState } from 'react';
import {
    BarChart2,
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    Radio, // Lucide doesn't have a specific radio button icon, using Radio
    Calendar,
    User,
    CheckCircle,
    Hourglass,
    FileText,
    Tag,
    CalendarRange,
    Repeat,
    Clock,
    Plus, // For "New Report" button if it were visible
    Database, // For Operational Reports icon
    ShieldCheck, // For BGV Reports icon
    Settings, CircleCheckIcon, // For Custom Report icon
} from 'lucide-react';

// --- Placeholder Components ---
// These are simple wrappers to demonstrate the structure.
// In a real app, these would be more complex components handling logic and state.

const ReportTypeCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
    </div>
);

const StatusPill = ({ status }) => {
    let className = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    let displayName = status;

    switch (status) {
        case 'Processing':
            className += " bg-orange-100 text-orange-800";
            displayName = "Processing";
            break;
        case 'Complete':
            className += " bg-emerald-100 text-emerald-800";
            displayName = "Complete";
            break;
        default:
            className += " bg-slate-100 text-slate-800";
            break;
    }

    return (
        <span className={className}>
            {displayName}
        </span>
    );
};

// --- Main Reports Page Component ---
const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [newReportType, setNewReportType] = useState('download'); // 'download' or 'schedule'
    const [reportName, setReportName] = useState('Custom_report_Type_23_Mar_18_23');
    const [generateBy, setGenerateBy] = useState('initiationDate');
    const [scheduleFrequency, setScheduleFrequency] = useState('weekly');
    const [scheduleDay, setScheduleDay] = useState('Mon');
    const [scheduleTime, setScheduleTime] = useState('18:00-21:00'); // 6:00 PM - 9:00 PM

    // Dummy data for recently generated reports
    const recentlyGeneratedReports = [
        { id: 1, name: "Initiated cases status tra...", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Processing" },
        { id: 2, name: "Pending forms", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Processing" },
        { id: 3, name: "Login expired", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Processing" },
        { id: 4, name: "Case summary", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Complete" },
        { id: 5, name: "Pending forms", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Complete" },
        { id: 6, name: "Pending forms", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Complete" },
        { id: 7, name: "Pending forms", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Complete" },
        { id: 8, name: "Pending forms", requestedOn: "22 Aug 2022", requestedBy: "Arjun Sagar", status: "Complete" },
    ];

    return (
        <div className="flex bg-gray-50 min-h-screen text-slate-800">
            {/* Main Content Area (Left/Middle) */}
            <div className="flex-1 p-8">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-8">
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' ? 'text-[#5D4591] border-b-2 border-[#5D4591]' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'scheduled' ? 'text-[#5D4591] border-b-2 border-[#5D4591]' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('scheduled')}
                    >
                        Scheduled Reports
                    </button>
                </div>

                {/* Reports Section */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Reports</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium mb-6">You can generate or scheduled reports reports</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ReportTypeCard
                            icon={Database}
                            title="Operational Reports"
                            description="Case summary, pending cases, login expired, WIP etc."
                        />
                        <ReportTypeCard
                            icon={CircleCheckIcon}
                            title="Final Review"
                            description="The cases which are all completed and waiting for final review."
                        />
                        <ReportTypeCard
                            icon={Settings}
                            title="Custom Report"
                            description="Case summary, pending cases, login expired, WIP etc."
                        />
                    </div>
                </div>

                {/* Recently Generated Reports Section */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">Recently Generated Reports</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium mb-6">list of recently generated reports of last 30 days</p>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by report name"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                        />
                    </div>

                    {/* Reports Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Report Name</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Requested on</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Requested by</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {recentlyGeneratedReports.map(report => (
                                    <tr key={report.id} className="hover:bg-[#F9F7FF]/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{report.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{report.requestedOn}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{report.requestedBy}</td>
                                        <td className="px-6 py-4">
                                            <StatusPill status={report.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                                                <Download size={16} />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between py-4 text-sm text-slate-500">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <div className="flex gap-1">
                            {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1.5 rounded-lg ${page === 1 ? 'bg-[#5D4591] text-white' : 'hover:bg-slate-100'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* New Report Panel (Right Sidebar) */}
            <div className="w-80 shrink-0 bg-white p-6 border-l border-slate-200 shadow-lg">
                <h2 className="text-xl font-bold text-slate-800 mb-6">New Report</h2>

                {/* I want to section */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-slate-700 mb-2">I want to</p>
                    <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5D4591] border-slate-300 focus:ring-[#5D4591]"
                                name="reportAction"
                                value="download"
                                checked={newReportType === 'download'}
                                onChange={() => setNewReportType('download')}
                            />
                            <span className="ml-2 text-sm text-slate-700">Download Report</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5D4591] border-slate-300 focus:ring-[#5D4591]"
                                name="reportAction"
                                value="schedule"
                                checked={newReportType === 'schedule'}
                                onChange={() => setNewReportType('schedule')}
                            />
                            <span className="ml-2 text-sm text-slate-700">Schedule Report</span>
                        </label>
                    </div>
                </div>

                {/* Report Type */}
                <div className="mb-4">
                    <label htmlFor="report-type" className="block text-sm font-medium text-slate-700 mb-1">Report Type</label>
                    <div className="relative">
                        <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            id="report-type"
                            className="block w-full pl-9 pr-10 py-2.5 text-base bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                            value="Custom_Report" // Placeholder value from screenshot
                            onChange={() => {}}
                        >
                            <option value="Custom_Report">Custom Report</option>
                            {/* Add other report types */}
                        </select>
                    </div>
                </div>

                {/* Report Name */}
                <div className="mb-4">
                    <label htmlFor="report-name" className="block text-sm font-medium text-slate-700 mb-1">Report Name</label>
                    <div className="relative">
                        <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            id="report-name"
                            className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Generate by */}
                <div className="mb-4">
                    <label htmlFor="generate-by" className="block text-sm font-medium text-slate-700 mb-1">Generate by</label>
                    <div className="relative">
                        <CalendarRange size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            id="generate-by"
                            className="block w-full pl-9 pr-10 py-2.5 text-base bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                            value={generateBy}
                            onChange={(e) => setGenerateBy(e.target.value)}
                        >
                            <option value="initiationDate">By initiation date</option>
                            {/* Add other options */}
                        </select>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">*from current year (Jan2023)</p>
                </div>

                {/* Schedule Report Fields (Conditional) */}
                {newReportType === 'schedule' && (
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">Schedule Range</p>
                        {/* Frequency */}
                        <div>
                            <label htmlFor="schedule-frequency" className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                            <div className="relative">
                                <Repeat size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="schedule-frequency"
                                    className="block w-full pl-9 pr-10 py-2.5 text-base bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                                    value={scheduleFrequency}
                                    onChange={(e) => setScheduleFrequency(e.target.value)}
                                >
                                    <option value="weekly">weekly</option>
                                    <option value="monthly">monthly</option>
                                    {/* Add other options */}
                                </select>
                            </div>
                        </div>
                        {/* Report on (Day of week) */}
                        <div>
                            <label htmlFor="schedule-day" className="block text-sm font-medium text-slate-700 mb-1">Report on</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="schedule-day"
                                    className="block w-full pl-9 pr-10 py-2.5 text-base bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                                    value={scheduleDay}
                                    onChange={(e) => setScheduleDay(e.target.value)}
                                >
                                    <option value="Mon">Mon</option>
                                    <option value="Tue">Tue</option>
                                    {/* Add other days */}
                                </select>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">(of every Week)</p>
                        </div>
                        {/* Report at time */}
                        <div>
                            <label htmlFor="schedule-time" className="block text-sm font-medium text-slate-700 mb-1">Report at time</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="schedule-time"
                                    className="block w-full pl-9 pr-10 py-2.5 text-base bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                >
                                    <option value="18:00-21:00">6:00 PM - 9:00 PM</option>
                                    {/* Add other time slots */}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
