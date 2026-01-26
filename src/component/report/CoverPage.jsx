import React from 'react';
import { User } from 'lucide-react';

const CoverPage = ({ data }) => {
    return (
        <div className="w-[210mm] min-h-[297mm] bg-white p-20 flex flex-col items-center justify-between relative overflow-hidden shadow-lg mx-auto mb-10 print:shadow-none print:m-0">
            {/* Top Network Graphic Placeholder */}
            <div className="absolute top-0 right-0 w-2/3 opacity-20">
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="200" r="10" fill="#00A38D" />
                    <line x1="200" y1="200" x2="300" y2="100" stroke="#00A38D" strokeWidth="1" />
                    {/* ... (Add more circles and lines for the network effect) */}
                </svg>
            </div>

            <div className="mt-40 text-center">
                <h1 className="text-5xl font-light text-[#00A38D] tracking-tight mb-20">Final Report</h1>

                {/* Profile Placeholder */}
                <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-20 border-8 border-white shadow-xl">
                    <User className="w-24 h-24 text-slate-300" />
                </div>

                <div className="text-left space-y-4 max-w-md mx-auto">
                    <p className="text-[#00A38D] text-xl font-medium">
                        Name of the Candidate : <span className="text-slate-700">{data.candidateName}</span>
                    </p>
                    <p className="text-[#00A38D] text-xl font-medium">
                        Case Number : <span className="text-slate-700">{data.caseNumber}</span>
                    </p>
                    <p className="text-[#00A38D] text-xl font-medium">
                        Date: <span className="text-slate-700">{data.reportDate}</span>
                    </p>
                </div>
            </div>

            <div className="w-full flex justify-end">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#00A38D] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-3xl font-black text-slate-800">Speedcheck</span>
                </div>
            </div>
        </div>
    );
};

export default CoverPage;