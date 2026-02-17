import React, {useEffect, useRef, useState} from 'react';
import {
    User, Search, UserPlusIcon
} from 'lucide-react';
import UserDetailsView from "./UserDetailsView.jsx";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import {GET_ALL_ENABLED_ROLES, GET_ALL_USERS} from "../../constant/Endpoint.tsx";
import UserListSkeleton from "./UserListSkeleton.jsx";
import UserListCard from "./UserListCard.jsx";
import CreateUserView from "./CreateUserView.jsx";

const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const initLoadRef = useRef(false);
    const {authenticatedRequest} = useAuthApi();
    const [loading, setLoading] = useState(false);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await authenticatedRequest(undefined, GET_ALL_USERS , METHOD.GET);
                if(response.status === 200) {
                    setUsers(response.data);
                } else {
                    console.error(response.data.message);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        const availableRoles = async () => {
            try {
                const response = await authenticatedRequest(undefined, GET_ALL_ENABLED_ROLES , METHOD.GET);
                if(response.status === 200) {
                    setAvailableRoles(response.data);
                } else {
                    console.error(response.data.message);
                }
            } catch (err) {
                console.error(err);
            }
        }

        if(!initLoadRef.current) {
            initLoadRef.current = true;
            fetchUsers();
            availableRoles();
        }
    }, [])

    const [selectedUser, setSelectedUser] = useState(undefined);
    const [activeTab, setActiveTab] = useState('Profile');

    const handleAddNewUser = () => {
        setSelectedUser(undefined);
        setIsCreating(true);
    };

    const handleBack = () => {
        setSelectedUser(undefined);
    }

    const handleClickUser = (user) => {
        setActiveTab('Profile');
        setIsEditing(false);
        setSelectedUser(user)
        setIsCreating(false);
    }

    const onCreateSuccess = (newUser) => {
        setUsers(prev => [newUser, ...prev]); // Add new user to the top of the list
        setSelectedUser(newUser); // Select the newly created user
        setIsCreating(false);
    };

    const onUpdateSuccess = (userId, updatedRoles, updatedUserData = null) => {
        setUsers(prevUsers =>
            prevUsers.map((user) => {
                if (user.id === userId) {
                    const updatedUser = updatedUserData
                        ? { ...updatedUserData, roleSet: updatedRoles }
                        : { ...user, roleSet: updatedRoles };

                    if (selectedUser?.id === userId) {
                        setSelectedUser(updatedUser);
                    }
                    return updatedUser;
                }
                return user;
            })
        );
    };
    console.log('user in user management - ', users);

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* LEFT SIDE: USER LIST (380px fixed width) */}
            <div className="w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Users</h2>
                        <button
                            onClick={handleAddNewUser}
                            className="p-2 bg-[#5D4591] text-white rounded-xl hover:bg-[#4a3675] transition-all shadow-md shadow-purple-200"
                        >
                            <UserPlusIcon size={18} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 ring-[#5D4591]/10 focus:border-[#5D4591] transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-6">

                    {loading ? (
                        [...Array(6)].map((_, i) => <UserListSkeleton key={i} />)
                    ) : (users.map((user) => (
                        <UserListCard
                            key={user.id}
                            user={user}
                            isActive={selectedUser?.id === user.id}
                            onClick={() => handleClickUser(user)}
                        />
                    )))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white flex justify-center gap-2">
                    {[1, 2, 3].map(n => (
                        <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold ${n===1 ? 'bg-[#5D4591] text-white' : 'text-slate-400'}`}>{n}</button>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: USER DETAILS */}
            <div className="flex-1 overflow-y-auto bg-white">
                {
                    isCreating ? (
                        <CreateUserView
                            availableRoles={availableRoles}
                            onCancel={() => setIsCreating(false)}
                            onCreateSuccess={onCreateSuccess}
                        />
                    ) : selectedUser ? (
                        <UserDetailsView
                            user={selectedUser}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            availableRoles={availableRoles}
                            onUpdateSuccess={(userId, updatedRoles, updatedUserData) => onUpdateSuccess(userId, updatedRoles, updatedUserData)}
                            setIsEditing={setIsEditing}
                            isEditing={isEditing}
                            handleBack={handleBack}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <User size={48} className="mb-4 opacity-20" />
                            <p>Select a user to view details</p>
                        </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
