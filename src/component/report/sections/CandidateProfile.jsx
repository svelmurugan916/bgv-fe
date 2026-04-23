// components/bgv/sections/CandidateProfile.jsx
import { User, Phone, Mail, MapPin, Calendar, CreditCard } from "lucide-react";
import { GlassCard, DetailRow } from "./HelperComponent.jsx";

export const CandidateProfile = ({ candidate }) => (
    <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <User size={20} className="text-indigo-600" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Profile</p>
                <p className="text-xs font-bold text-slate-600">Verified personal identifiers</p>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DetailRow label="Full Name"    value={candidate.fullName} />
            <DetailRow label="Date of Birth" value={candidate.dateOfBirth} />
            <DetailRow label="PAN Number"   value={candidate.pan} mono />
            <DetailRow label="Aadhaar"      value={candidate.aadhaar} mono />
            <DetailRow label="Mobile"       value={candidate.mobile} />
            <DetailRow label="Email"        value={candidate.email} />
            <DetailRow label="Current City" value={candidate.city} />
            <DetailRow label="Applied Role" value={candidate.role} />
        </div>
    </GlassCard>
);
