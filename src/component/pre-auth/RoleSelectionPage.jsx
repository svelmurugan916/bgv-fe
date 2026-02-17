import React, { useEffect, useRef, useState } from 'react';
import { Shield, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { useNavigate } from "react-router-dom";
import { ACTIVATE_ROLE, GET_ALL_ALLOCATED_ROLES } from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import RoleListSkeletonLoader from "./RoleListSkeletonLoader.jsx";

const RoleSelectionPage = () => {
    const { setAuthData, authenticatedRequest, loggedInRole, availableRoles } = useAuthApi();

    const [selectedRoleId, setSelectedRoleId] = useState(loggedInRole || null);
    const [isLoading, setIsLoading] = useState(false); // For the Continue button
    const [loading, setLoading] = useState(false);    // For the initial API fetch
    const navigate = useNavigate();
    const initComponentRef = useRef(false);
    const [userRoles, setUserRoles] = useState(availableRoles || []);

    useEffect(() => {
        const getRolesForUser = async () => {
            try {
                setLoading(true);
                const response = await authenticatedRequest(undefined, GET_ALL_ALLOCATED_ROLES, METHOD.GET);
                if (response.status === 200) {
                    setUserRoles(response.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        // Only fetch if availableRoles is empty and we haven't fetched yet
        if ((!availableRoles || availableRoles.length === 0) && !initComponentRef.current) {
            initComponentRef.current = true;
            getRolesForUser();
        }
    }, [availableRoles, authenticatedRequest]);

    const handleContinue = async () => {
        if (!selectedRoleId) return;
        setIsLoading(true);
        try {
            const response = await authenticatedRequest(undefined, `${ACTIVATE_ROLE}/${selectedRoleId}`, METHOD.GET);
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
                    {loading ? (
                        <RoleListSkeletonLoader />
                    ) : userRoles.length > 0 ? (
                        /* DATA LOADED STATE */
                        userRoles.map((role) => {
                            const isSelected = selectedRoleId === role.id;
                            return (
                                <div
                                    key={role.id}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 
                                        ${isSelected
                                        ? 'border-[#5D4591] bg-[#F9F7FF] shadow-sm'
                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors
                                        ${isSelected ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <Shield size={24} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={`font-bold text-base ${isSelected ? 'text-[#5D4591]' : 'text-slate-800'}`}>
                                            {role.name?.replace('_', ' ')}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                                            {role.description}
                                        </p>
                                    </div>

                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                        ${isSelected ? 'border-[#5D4591]' : 'border-slate-200'}`}>
                                        {isSelected && <div className="w-3 h-3 rounded-full bg-[#5D4591]" />}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* EMPTY STATE MESSAGE (Only shows if not loading and roles are empty) */
                        <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-amber-100 flex items-center justify-center mx-auto mb-4">
                                <ShieldAlert size={32} className="text-amber-500" />
                            </div>
                            <h3 className="text-amber-900 font-black text-sm uppercase tracking-widest mb-2">No Access Found</h3>
                            <p className="text-amber-800/70 text-xs leading-relaxed font-medium">
                                No roles have been assigned to your account. <br />
                                <span className="font-bold text-amber-900">Please contact the admin</span> to request system access.
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!selectedRoleId || isLoading || userRoles.length === 0 || loading}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2
                        ${selectedRoleId && userRoles.length > 0 && !loading
                        ? 'bg-[#5D4591] hover:bg-[#4a3675] shadow-purple-200'
                        : 'bg-slate-300 cursor-not-allowed shadow-none'
                    }`}
                >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    {isLoading ? "Processing..." : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
