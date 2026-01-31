import React, { useState } from 'react';
import { Shield, User, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { useNavigate } from "react-router-dom";
import { ACTIVATE_ROLE } from "../../constant/Endpoint.tsx";

const RoleSelectionPage = () => {
    const { setAuthData, unAuthenticatedRequest, loggedInRole } = useAuthApi();

    // 1. Store the ID string (e.g., "ROLE_ADMIN") rather than the whole object
    const [selectedRoleId, setSelectedRoleId] = useState(loggedInRole || null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const roleDetails = {
        "ROLE_ADMIN": {
            title: "Administrator",
            desc: "Full access to system settings and user management.",
            icon: <Shield size={24} />
        },
        "ROLE_OPERATIONS_MANAGER": {
            title: "Operations Manager",
            desc: "Manage candidates, cases, and verification workflows.",
            icon: <Briefcase size={24} />
        },
        "ROLE_OPERATIONS": {
            title: "Operations Manager",
            desc: "Manage candidates, cases, and verification workflows.",
            icon: <Briefcase size={24} />
        },
        "ROLE_REPORT_VIEWER": {
            title: "Operations Manager",
            desc: "Manage candidates, cases, and verification workflows.",
            icon: <Briefcase size={24} />
        },
        "ROLE_CLIENT_ADMIN": {
            title: "Operations Manager",
            desc: "Manage candidates, cases, and verification workflows.",
            icon: <Briefcase size={24} />
        }
    };

    // This would typically come from your useAuthApi context
    const roles = [
        { "id": "ROLE_ADMIN", "displayName": "Administrator", "description": "Full system access" },
        { "id": "ROLE_OPERATIONS_MANAGER", "displayName": "Ops Manager", "description": "Manage candidate cases" },
        { "id": "ROLE_OPERATIONS", "displayName": "Ops Manager", "description": "Manage candidate cases" },
        { "id": "ROLE_REPORT_VIEWER", "displayName": "Ops Manager", "description": "Manage candidate cases" },
        { "id": "ROLE_CLIENT_ADMIN", "displayName": "Ops Manager", "description": "Manage candidate cases" }
    ];

    const handleContinue = async () => {
        if (!selectedRoleId) return;
        setIsLoading(true);
        try {
            // Send only the ID string to the backend
            const response = await unAuthenticatedRequest({ role: selectedRoleId }, ACTIVATE_ROLE);

            if (response.data.success) {
                setAuthData(response.data.responseData.accessToken);
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Role activation failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FDFDFF] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome to TraceU</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Empowering businesses to connect, grow, & collaborate effortlessly.
                    </p>
                </div>

                <div className="space-y-4 mb-10">
                    {roles.map((role) => {
                        // 2. Logic fixes: Use role.id for comparison and lookup
                        const isSelected = selectedRoleId === role.id;
                        const details = roleDetails[role.id] || {
                            title: role.displayName,
                            desc: role.description,
                            icon: <User size={24} />
                        };

                        return (
                            <div
                                key={role.id} // Use the string ID as the key
                                onClick={() => setSelectedRoleId(role.id)}
                                className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 
                                    ${isSelected
                                    ? 'border-[#5D4591] bg-[#F9F7FF] shadow-sm'
                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors
                                    ${isSelected ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {details.icon}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-bold text-base ${isSelected ? 'text-[#5D4591]' : 'text-slate-800'}`}>
                                        {details.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        {details.desc}
                                    </p>
                                </div>

                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                    ${isSelected ? 'border-[#5D4591]' : 'border-slate-200'}`}>
                                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#5D4591]" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!selectedRoleId || isLoading}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg
                        ${selectedRoleId
                        ? 'bg-[#5D4591] hover:bg-[#4a3675] shadow-purple-200'
                        : 'bg-slate-300 cursor-not-allowed shadow-none'
                    }`}
                >
                    {isLoading ? "Processing..." : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
