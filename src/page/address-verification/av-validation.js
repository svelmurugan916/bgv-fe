// Add these new page indexes
export const AV_LOCATION_PAGE_IDX = 1;
export const AV_PHOTOS_PAGE_IDX = 2;
export const AV_IDENTITY_PAGE_IDX = 3;
export const AV_REVIEW_PAGE_IDX = 3;

export const validateAVStep = (step, formData, setErrors) => {
    let newErrors = {};
    const { addressVerification } = formData;

    // Step 1: GPS Capture Validation
    if (step === AV_LOCATION_PAGE_IDX) {
        if (!addressVerification.location.lat || !addressVerification.location.long) {
            newErrors.av_location = "GPS capture is mandatory to proceed.";
        }
    }

    // Step 2: Photo Proofs Validation
    if (step === AV_PHOTOS_PAGE_IDX) {
        if (!addressVerification.photos.frontDoor) {
            newErrors.av_frontDoor = "Front door picture is mandatory.";
        }
        if (!addressVerification.photos.landmark) {
            newErrors.av_landmark = "Landmark picture is mandatory.";
        }
    }

    // Step 3: Identity Document Validation
    // if (step === AV_IDENTITY_PAGE_IDX) {
    //     if (!addressVerification.identity.addressId) {
    //         newErrors.av_addressId = "Authentic ID proof is required for verification.";
    //     }
    // }

    // Step 4: Final Consent Validation
    if (step === AV_REVIEW_PAGE_IDX) {
        if (!addressVerification.consent) {
            newErrors.av_consent = "You must provide consent before submission.";
        }
    }

    setErrors(newErrors);
    return newErrors;
};