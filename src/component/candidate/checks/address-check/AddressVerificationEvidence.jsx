import React from "react";
import {SEND_ADDRESS_VERIFICATION} from "../../../../constant/Endpoint.tsx";
import {METHOD} from "../../../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import {useParams} from "react-router-dom";
import AddressSubmittedCoordinateDetails from "./AddressSubmittedCoordinateDetails.jsx";
import AddressVerificationLinkResent from "./AddressVerificationLinkResent.jsx";
import AddressVerificationLinkExpired from "./AddressVerificationLinkExpired.jsx";
import AddressLinkSent from "./AddressLinkSent.jsx";
import AddressNoLinkSentYet from "./AddressNoLinkSentYet.jsx";
import CaseInActive from "../CaseInActive.jsx";
import InsufficientFundView from "../../../InsufficientFundView.jsx";

const AddressVerificationEvidence = ({addressData, setLoading, fetchAddressDetails, addressId, caseBillingStatus}) => {
    const {authenticatedRequest} = useAuthApi();
    const { id } = useParams();
    const hasCoordinates = addressData?.addressCandidateSubmittedResponse?.lat && addressData?.addressCandidateSubmittedResponse?.lng;
    const isLinkSent = addressData.isLinkSent;
    const isLinkExpired = addressData.isLinkExpired || (addressData.linkExpiresAt && new Date(addressData.linkExpiresAt) < new Date());
    const isLinkResent = (hasCoordinates && addressData.isSubmissionPending === true);

    const sendAddressVerificationLink = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, SEND_ADDRESS_VERIFICATION?.replace("{candidateId}", id)?.replaceAll("{addressId}", addressId), METHOD.GET);
            if (response.status === 200) {
                await fetchAddressDetails();
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    return (
        <>
            {hasCoordinates ? (
                <div className="space-y-8">
                    {isLinkResent && <AddressVerificationLinkResent addressData={addressData} />}
                    {hasCoordinates && <AddressSubmittedCoordinateDetails addressData={addressData} sendAddressVerificationLink={sendAddressVerificationLink} />}
                </div>
            ) : caseBillingStatus === 'INSUFFICIENT_FUNDS' ? (
                <InsufficientFundView label={"Address"} process={"this address case"} />
            )  : addressData?.isFundReleasedOrCancelled ? (
                <CaseInActive taskId={addressId} onRevertSuccess={fetchAddressDetails} label={"Address"} process={"Geo-location"} />
            ) : isLinkExpired ? (
                <AddressVerificationLinkExpired addressData={addressData} sendAddressVerificationLink={sendAddressVerificationLink} />
            )  : isLinkSent ? (
                <AddressLinkSent addressData={addressData} sendAddressVerificationLink={sendAddressVerificationLink} />
            ) : (
                <AddressNoLinkSentYet sendAddressVerificationLink={sendAddressVerificationLink} />
            )}
        </>
    )
}

export default AddressVerificationEvidence
