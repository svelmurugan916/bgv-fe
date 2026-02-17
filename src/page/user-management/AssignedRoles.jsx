import {
    CheckCircle2, Edit2, Info, Shield, Trash2, Plus,
    Save, X, Loader2, AlertCircle
} from "lucide-react";
import React, { useState } from "react";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import { UPDATE_USER_ROLES } from "../../constant/Endpoint.tsx";

const AssignedRoles = ({ userId, roleSet, onUpdateSuccess, availableRoles }) => {
    const { authenticatedRequest } = useAuthApi();
    console.log('availableRoles in assignedRoles - ', roleSet);
    // States
    const [isEditing, setIsEditing] = useState(false);
    const [draftRoles, setDraftRoles] = useState([...roleSet]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Updated with all roles for styling
    const roleDetails = {
        'ADMIN': {
            desc: 'Full system access, user management, and configuration rights.',
            color: 'bg-purple-50 text-[#5D4591] border-purple-100'
        },
        'OPERATIONS_MANAGER': {
            desc: 'High-level access to verify records and manage operational workflows.',
            color: 'bg-blue-50 text-blue-600 border-blue-100'
        },
        'OPERATIONS': {
            desc: 'Standard access to platform features and task management.',
            color: 'bg-slate-50 text-slate-600 border-slate-100'
        },
        'CLIENT_MANAGER': {
            desc: 'Manage client relationships, view project data and specific analytics.',
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
        },
        'DATA_ENTRY': {
            desc: 'Restricted access focused on inputting and updating system records.',
            color: 'bg-amber-50 text-amber-600 border-amber-100'
        }
    };

    React.useEffect(() => {
        setDraftRoles([...roleSet]);
    }, [roleSet]);

    // Actions
    const handleRemoveRole = (roleIdToRemove) => {
        setDraftRoles(draftRoles.filter(r => r.id !== roleIdToRemove));
    };

    const handleAddRole = (roleObj) => {
        // Check if the role ID already exists in the draft
        if (!draftRoles.some(r => r.id === roleObj.id)) {
            setDraftRoles([...draftRoles, roleObj]);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Extracting ONLY the IDs to send to the API
            const roleIds = draftRoles.map(role => role.id);
            console.log('roleIds', roleIds);

            const response = await authenticatedRequest(
                roleIds,
                `${UPDATE_USER_ROLES}/${userId}`,
                METHOD.PUT
            );
            console.log('response', response);
            if (response.status === 200) {
                setMessage({ type: 'success', text: 'Roles updated successfully!' });
                setIsEditing(false);
                if (onUpdateSuccess) onUpdateSuccess(userId, draftRoles);
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to update roles.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">

            {/* Header Area */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Permissions & Roles</h3>
                    <p className="text-sm text-slate-400">Manage the access level for this user account</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#5D4591] bg-[#F9F7FF] rounded-xl hover:bg-[#5D4591] hover:text-white transition-all border border-[#EBE5FF]"
                    >
                        <Edit2 size={14} /> Modify Roles
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setIsEditing(false); setDraftRoles([...roleSet]); }}
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#5D4591] rounded-xl shadow-lg shadow-[#5D4591]/20 hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* API Feedback Message */}
            {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold">{message.text}</p>
                </div>
            )}

            {/* Active/Draft Roles List */}
            <div className="grid grid-cols-1 gap-4">
                {(isEditing ? draftRoles : roleSet).map((role, index) => (
                    <div key={index} className={`group relative bg-white border rounded-2xl p-5 flex items-center gap-5 transition-all 
                        ${isEditing ? 'border-[#5D4591]/20 shadow-sm' : 'border-slate-100 hover:border-[#5D4591]/30 hover:shadow-md'}`}>

                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${roleDetails[role?.name]?.color || 'bg-slate-50 text-slate-400'}`}>
                            <Shield size={24} />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-800">{role?.name?.replace("_", " ")}</h4>
                                {!isEditing && <CheckCircle2 size={14} className="text-emerald-500" />}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {roleDetails[role?.name]?.desc || 'Standard system permissions.'}
                            </p>
                        </div>

                        {isEditing ? (
                            draftRoles.length > 1 && (
                                <button
                                    onClick={() => handleRemoveRole(role?.id)}
                                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )
                        ) : (
                            <div className="px-3 py-1 bg-emerald-50 rounded-lg text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                Active
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Role Section (Only in Edit Mode) */}
                {isEditing && (
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Available Roles to Add</p>
                        <div className="flex flex-wrap gap-2">
                            {/* Taking available roles from props and filtering out those already in draftRoles */}
                            {availableRoles?.filter(ar => !draftRoles.some(dr => dr.id === ar.id)).map(role => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => handleAddRole(role)}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-[#5D4591] hover:text-[#5D4591] transition-all"
                                >
                                    <Plus size={14} /> {role.name?.replace("_", " ")}
                                </button>
                            ))}
                            {availableRoles?.filter(ar => !draftRoles.some(dr => dr.id === ar.id)).length === 0 && (
                                <p className="text-xs text-slate-400 italic">All roles already assigned.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Security Note */}
            <div className="mt-8 p-5 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                <Info size={20} className="text-amber-600 shrink-0" />
                <div className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    <b className="block mb-1 text-xs">Security Note</b>
                    System access is strictly governed by the primary role assigned to this account. Permissions are scoped specifically to the selected role to ensure data integrity.
                </div>
            </div>
        </div>
    );
};

export default AssignedRoles;
