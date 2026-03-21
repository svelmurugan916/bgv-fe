import {
    Briefcase, ClockIcon,
    DatabaseIcon, FingerprintPattern,
    GraduationCap, IdCard,
    MapPinIcon, Package,
    ShieldCheck,
    UserCheck,
    UserPlusIcon,
    UsersIcon
} from "lucide-react";

export const getTaskIcon = (taskName) => {
    switch (taskName.toLowerCase()) {
        case 'unassigned': return UserPlusIcon;
        case 'id':
        case 'aadhaar':
        case 'pan':
        case 'passport':
        case 'identity': return FingerprintPattern;
        case 'criminal': return ShieldCheck;
        case 'education': return GraduationCap;
        case 'employment':
        case 'experience': return Briefcase;
        case 'address': return MapPinIcon;
        case 'db check':
        case 'database': return DatabaseIcon;
        case 'reference':
        case 'reference check': return UsersIcon;
        case 'timeline': return ClockIcon;
        default: return Package;
    }
};