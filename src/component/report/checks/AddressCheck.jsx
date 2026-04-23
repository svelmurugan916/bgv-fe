// components/bgv/checks/AddressCheck.jsx
import { MapPin, CheckSquare } from "lucide-react";
import { GlassCard, SectionTitle, DetailRow } from "../sections/HelperComponent.jsx";

export const AddressCheck = ({ data }) => (
    <GlassCard className="p-8">
        <SectionTitle number="3" title="Geo-Spatial Address Audit" subtitle={data.subtitle} status={data.status} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Address Details */}
            <div className="space-y-5">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Declared Address</p>
                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                        <p className="text-sm font-bold text-slate-700 leading-snug">{data.declaredAddress}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="GPS Captured"     value={data.gps} />
                    <DetailRow label="EXIF Timestamp"   value={data.exifTimestamp} />
                    <DetailRow label="Gallery Disabled" value={data.galleryDisabled ? "Yes — live capture enforced" : "No"} />
                    <DetailRow label="Triangulation"    value={data.triangulation} />
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[160px] border border-indigo-100">
                <MapPin size={32} className="text-indigo-400" />
                <p className="text-xs font-black text-indigo-600">GPS Confirmed</p>
                <p className="text-[10px] font-bold text-slate-400">{data.gps}</p>
            </div>
        </div>

        <div className="mt-5 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <CheckSquare size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-700">{data.finding}</p>
        </div>
    </GlassCard>
);
