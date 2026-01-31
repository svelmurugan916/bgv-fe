import React, { useEffect, useRef, useState } from 'react';
import {
    Clock,
    Phone,
    UserCheck,
    Home,
} from 'lucide-react';
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import {ADDRESS_CHECK_DETAILS, SEND_ADDRESS_VERIFICATION} from "../../../constant/Endpoint.tsx";
import { METHOD } from "../../../constant/ApplicationConstant.js";
import SimpleLoader from "../../common/SimpleLoader.jsx";
import EditAddressModal from "./EditAddressModal.jsx";
import AddressVerificationEvidence from "./AddressVerificationEvidence.jsx";
import BaseCheckLayout from "./BaseCheckLayout.jsx";

const CheckAddress = ({ addressId }) => {
    const [loading, setLoading] = useState(true);
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);
    const [addressData, setAddressData] = useState({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchAddressDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${ADDRESS_CHECK_DETAILS}/${addressId}`, METHOD.GET);
            if (response.status === 200) {
                setAddressData(response.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchAddressDetails();
        }
    }, [addressId, authenticatedRequest]);

    const updateAddress = (updatedAddress) => {
        console.log(updatedAddress);
        setAddressData(prevState => ({
            ...prevState,
            ...updatedAddress,
            addressCandidateSubmittedResponse: {
                ...prevState.addressCandidateSubmittedResponse,
                siteContactMobile: updatedAddress.siteContactMobile,

            }
            })
        )
    }

    const hasCoordinates = addressData?.addressCandidateSubmittedResponse?.lat && addressData?.addressCandidateSubmittedResponse?.lng;
    const isLinkSent = addressData.isLinkSent;
    const isLinkExpired = addressData.isLinkExpired || (addressData.linkExpiresAt && new Date(addressData.linkExpiresAt) < new Date());


    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }

    const getBadgeConfig = () => {
        if (hasCoordinates) return { label: 'Verification Received', colorClass: 'bg-emerald-50 text-emerald-600', icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> };
        if (isLinkExpired) return { label: 'Link Expired', colorClass: 'bg-rose-50 text-rose-600', icon: <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> };
        if (isLinkSent) return { label: 'Awaiting Submission', colorClass: 'bg-amber-50 text-amber-600', icon: <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> };
        return { label: 'Invitation Pending', colorClass: 'bg-slate-50 text-slate-500', icon: <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> };
    };

    return (
        <BaseCheckLayout
            title="Address Verification"
            description="Physical verification via geo-tagging and site photography."
            status={addressData.status}
            checkId={addressId}
            onStatusUpdate={fetchAddressDetails}
            setIsEditModalOpen={setIsEditModalOpen}
            badgeConfig={getBadgeConfig()}
        >
            <div className="p-8 bg-slate-50/40 border-b border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Address Type</p>
                        <div className="flex items-center gap-2 text-slate-700">
                            <Home size={14} className="text-[#5D4591]" />
                            <p className="text-xs font-bold capitalize">{addressData.addressType?.toLowerCase()} Address</p>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Address</p>
                        <div className="flex gap-2 text-slate-700">
                            <Home size={14} className="text-[#5D4591]" />
                            <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                {addressData.addressLine1},<br />
                                {addressData.addressLine2 && <>{addressData.addressLine2},<br /></>}
                                {addressData.city},<br />
                                {addressData.state},<br />
                                {addressData.country} - {addressData.pinCode}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duration of Stay</p>
                        <div className="flex items-center gap-2 text-slate-700">
                            <Clock size={14} className="text-[#5D4591]" />
                            <p className="text-xs font-bold">
                                {
                                    formatDate(addressData.stayingFrom)} - {addressData.isCurrentAddress ?
                                        <span className="text-emerald-600 ml-1">Present</span> :
                                        formatDate(addressData.stayingTo)
                                }
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verification Contact</p>
                        <div className="flex items-center gap-2 text-slate-700">
                            {addressData.isSelfContact ? (
                                <><UserCheck size={14} className="text-emerald-500" /><p className="text-xs font-bold">Self Verified</p></>
                            ) : (
                                <><Phone size={14} className="text-[#5D4591]" /><p className="text-xs font-bold">{addressData?.addressCandidateSubmittedResponse?.siteContactMobile}</p></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-8">
                <AddressVerificationEvidence
                    addressData={addressData}
                    setLoading={setLoading}
                    fetchAddressDetails={fetchAddressDetails}
                    addressId={addressId}
                />
            </div>
            <EditAddressModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                addressData={addressData}
                addressId={addressId}
                onUpdateSuccess={(payload) => updateAddress(payload)}
            />
        </BaseCheckLayout>
    );
};


export default CheckAddress;
