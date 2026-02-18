import React, {useEffect, useRef, useState} from 'react';
import { Search, Plus, ShieldOff, Loader2 } from 'lucide-react';
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {CREATE_NEW_ROLE, GET_ALL_ROLES, UPDATE_ROLE_ENDPOINT} from "../../constant/Endpoint.tsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import RoleCard from "./RoleCard.jsx";
import RoleCardSkeleton from "./RoleCardSkeleton.jsx";
import RoleCreationModal from "./RoleCreationModal.jsx";

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [apiError, setApiError] = useState(null); // API Error state

    const [isEditing, setIsEditing] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);

    const [formData, setFormData] = useState({
        roleName: '',
        description: '',
        rank: 1,
        enabled: true
    });

    const { authenticatedRequest } = useAuthApi();
    const initComponentRef = useRef(false);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest(undefined, GET_ALL_ROLES, METHOD.GET);
            if (response.status === 200) setRoles(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!initComponentRef.current) {
            initComponentRef.current = true;
            fetchRoles();
        }
    }, [])

    const handleOpenCreate = () => {
        setIsEditing(false);
        setApiError(null);
        setFormData({ roleName: '', description: '', rank: 1, enabled: true });
        setShowModal(true);
    };

    const handleOpenEdit = (role) => {
        setIsEditing(true);
        setApiError(null);
        setSelectedRoleId(role.id);
        setFormData({
            roleName: role.roleName,
            description: role.description,
            rank: role.roleRank || 1,
            enabled: role.enabled,
        });
        setShowModal(true);
    };

    const handleCreateRole = async () => {
        setIsSaving(true);
        setApiError(null);
        try {
            const endpoint = isEditing ? `${UPDATE_ROLE_ENDPOINT}/${selectedRoleId}` : CREATE_NEW_ROLE;
            const method = isEditing ? METHOD.PUT : METHOD.POST;

            const response = await authenticatedRequest(formData, endpoint, method);
            if (response.status === 200 || response.status === 201) {
                setShowModal(false);
                fetchRoles();
            } else {
                // Handle non-success status codes
                setApiError(response.data || "An unexpected error occurred. Please try again.");
            }
        } catch (err) {
            console.error('err:', err.message);
            setApiError("Server connection failed. Please check your network.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredRoles = roles.filter(role =>
        role.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-12 relative overflow-hidden">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Role Management
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Create and Manage the roles.</p>
            </div>

            <main className="max-w-[1400px] mx-auto mt-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex-1 min-w-[300px] max-w-md relative group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-[#5D4591]' : 'text-slate-400'}`} size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by role name..."
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-10 text-sm focus:ring-4 ring-[#5D4591]/5 focus:border-[#5D4591] outline-none transition-all"
                        />
                    </div>
                    <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-[#5D4591] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#5D4591]/20 hover:opacity-90 transition-all ml-2">
                        <Plus size={18} /> Create new role
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => <RoleCardSkeleton key={i} />)
                    ) : filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                            <RoleCard key={role.id} role={role} handleOpenEdit={() => handleOpenEdit(role)} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[32px] border border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-300">
                            <ShieldOff size={48} className="mb-4 opacity-20" />
                            <p className="font-bold text-slate-600">No roles found</p>
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <RoleCreationModal
                    apiError={apiError}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    handleCreateRole={handleCreateRole}
                    setShowModal={setShowModal}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}
        </div>
    );
};

export default RoleManagement;
