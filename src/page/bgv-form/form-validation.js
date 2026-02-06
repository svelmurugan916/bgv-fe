import {EMAIL_REGEX, PHONE_NUMBER_REGEX} from "../../constant/ApplicationConstant.js";

export const BASIC_INFO_PAGE_IDX = 1;
export const ADDRESS_INFO_PAGE_IDX = 2;
export const IDENTIFIER_PAGE_IDX = 3;
export const EDUCATION_PAGE_IDX = 4;
export const EXPERIENCE_PAGE_IDX = 5;
export const REFERENCE_PAGE_IDX = 6;
export const REVIEW_PAGE_IDX = 7;

export const validateStep = (step, formData, setErrors, checkConfigs = {}, checks = []) => {
    let newErrors = {};

    if (step === BASIC_INFO_PAGE_IDX) {
        const { basic } = formData;
        if (!basic.firstName) newErrors.firstName = "First name is required";
        if (!basic.lastName) newErrors.lastName = "Last name is required";
        if(!basic.fatherName) newErrors.fatherName = "Father name is required";
        if (!basic.gender) newErrors.gender = "Gender is required";
        if (!EMAIL_REGEX.test(basic.email)) newErrors.email = "Invalid email format";
        if (!PHONE_NUMBER_REGEX.test(basic.phone)) newErrors.phone = "Invalid 10-digit phone number";
        if(checks.includes("ADDRESS") && !basic.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    }

    if(step === ADDRESS_INFO_PAGE_IDX) {
        const { basic } = formData;
        const addresses = basic.addresses || [];
        if (!addresses || addresses.length === 0) {
            newErrors.addr_general = "At least one address is required";
        } else {
            addresses.forEach((addr, i) => {
                if (!addr.addressLine1) newErrors[`addr_${i}_addressLine1`] = "Required";
                if (!addr.city) newErrors[`addr_${i}_city`] = "Required";
                if(!addr.state) newErrors[`addr_${i}_state`] = "Required";
                if(!addr.country) newErrors[`addr_${i}_country`] = "Required";
                if(!addr.addressType) newErrors[`addr_${i}_addressType`] = "Required";
                if (!addr.pincode || addr.pincode.length !== 6) newErrors[`addr_${i}_pincode`] = "Invalid PIN";
                if (!addr.isSelfContact && !PHONE_NUMBER_REGEX.test(addr.siteContactMobile)) newErrors[`addr_${i}_siteContactMobile`] = "Invalid Mobile";
                if (!addr.stayingFrom) newErrors[`addr_${i}_stayingFrom`] = "Required";
                if (!addr.isCurrentAddress && !addr.stayingTo) {
                    newErrors[`addr_${i}_stayingTo`] = "Required";
                }
                if (addr.stayingFrom && addr.stayingTo && new Date(addr.stayingFrom) > new Date(addr.stayingTo)) {
                    newErrors[`addr_${i}_stayingTo`] = "Must be after 'From' date";
                }
            });
            const addrConfig = checkConfigs?.ADDRESS;
            if (addrConfig) {
                const { history, customHistory } = addrConfig;

                if (history === 'permanent') {
                    const hasPermanent = addresses.some(a => a.addressType === 'PERMANENT');
                    if (!hasPermanent) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        newErrors.addr_general = "Configuration requires at least one Permanent Address."
                    }
                }
                else if (history === 'current') {
                    const hasCurrent = addresses.some(a => a.addressType === 'CURRENT');
                    if (!hasCurrent) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        newErrors.addr_general = "Configuration requires a Current Address entry."
                    }
                }
                else if (history === 'past') {
                    const requiredYears = parseInt(customHistory) || 0;

                    // 1. Collect all valid intervals
                    const intervals = addresses
                        .filter(addr => addr.stayingFrom)
                        .map(addr => ({
                            start: new Date(addr.stayingFrom).getTime(),
                            end: addr.isCurrentAddress
                                ? new Date().getTime()
                                : (addr.stayingTo ? new Date(addr.stayingTo).getTime() : new Date().getTime())
                        }))
                        .sort((a, b) => a.start - b.start); // Sort by start date

                    const totalYears = calculateTotalYears(intervals);

                    if (totalYears < requiredYears) {
                        // Calculate years and months for the message
                        const years = Math.floor(totalYears);
                        const months = Math.round((totalYears - years) * 12);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        newErrors.addr_general = `Residency history of ${requiredYears} years is mandatory. You have provided ${years} year(s)${months > 0 ? ` ${months} month(s)` : ""}. Please add more addresses or correct overlapping dates.`;
                    }
                }

            }
        }
    }

    if (step === IDENTIFIER_PAGE_IDX) {
        const { idVerification } = formData;

        const hasPan = !!idVerification?.pan?.file || !!idVerification?.pan?.fileName;
        const hasAadhar = !!idVerification?.aadhar?.file || !!idVerification?.aadhar?.fileName;
        const hasPassport = !!idVerification?.passport?.file || !!idVerification?.passport?.fileName;
        if (!hasPan && !hasAadhar && !hasPassport) {
            newErrors.id_required = "At least one Government ID (PAN, Aadhar, or Passport) is required.";
        }

        if (!idVerification?.consent) {
            newErrors.consent = "You must confirm the document validity to proceed.";
        }

        if (hasPan && !idVerification.pan.idNumber) newErrors.id_required = "Please enter the PAN Number.";
        if (hasAadhar && !idVerification.aadhar.idNumber) newErrors.id_required = "Please enter the Aadhar Number.";

        const identityConfig = checkConfigs?.IDENTITY;
        if(identityConfig) {
            const { mandatory = [] } = identityConfig;

            if(mandatory.length > 0) {
                if(mandatory.includes("PAN") && !hasPan) {
                    newErrors.id_general = 'PAN is Mandatory.';
                }
                if(mandatory.includes("Aadhar") && !hasAadhar) {
                    newErrors.id_general = 'Aadhar is Mandatory.';
                }
                if(mandatory.includes("Passport") && !hasPassport) {
                    newErrors.id_general = 'Passport is Mandatory.';
                }
            }

        }
    }

    if (step === EDUCATION_PAGE_IDX) {
        const gpaRegex = /^\d+(\.\d+)?$/; // Strict decimal check
        const {education} = formData;
        if (!education || education.length === 0) {
            newErrors.education_general = "At least one education is required";
        } else {
            education.forEach((edu) => {
                if (!edu.level) newErrors[`edu_${edu.id}_level`] = "Required";
                if (!edu.degree) newErrors[`edu_${edu.id}_degree`] = "Required";
                if (!edu.college) newErrors[`edu_${edu.id}_college`] = "Required";
                if (!edu.year) newErrors[`edu_${edu.id}_year`] = "Required";
                if (!edu.gpa) {
                    newErrors[`edu_${edu.id}_gpa`] = "Required";
                } else if (!gpaRegex.test(edu.gpa)) {
                    newErrors[`edu_${edu.id}_gpa`] = "Invalid format (use 8.5 or 90)";
                }
                if (!edu.rollNumber) newErrors[`edu_${edu.id}_roll`] = "Required";
                if (edu.documents.length === 0 && !edu.provideLater) newErrors[`edu_${edu.id}_doc`] = "Please upload or select 'Provide Later'"
            });
            const educationConfig = checkConfigs?.EDUCATION;
            if (educationConfig && Array.isArray(educationConfig.levels)) {
                const { levels = [] } = educationConfig;
                const enteredLevels = education.map((edu) => edu.level);
                const missingLabels = [];

                if (levels.length > 0) {
                    if (levels.includes("SSLC") && !enteredLevels.includes("SSLC")) {
                        missingLabels.push("10th (SSLC)");
                    }

                    const needsHigherSecondary = levels.includes("HSC") || levels.includes("DIPLOMA");
                    const hasHigherSecondary = enteredLevels.includes("HSC") || enteredLevels.includes("DIPLOMA");

                    if (needsHigherSecondary && !hasHigherSecondary) {
                        missingLabels.push("12th (HSC) or Diploma");
                    }

                    if (levels.includes("UNDER_GRADUATE") && !enteredLevels.includes("UNDER_GRADUATE")) {
                        missingLabels.push("Under Graduate (UG)");
                    }

                    if (missingLabels.length > 0) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        newErrors.education_general = `Mandatory educational details missing: ${missingLabels.join(", ")}.`;
                    }
                }
            }

        }
    }

    if(step === EXPERIENCE_PAGE_IDX) {
        const {employment} = formData;

        if (!employment) {
            newErrors.employment_general = "Employment information is missing";
            setErrors(newErrors);
            return newErrors;
        }

        const isFresher = employment?.isFresher === true;
        if (!isFresher) {
            newErrors = validateEmployment(employment.details || employment, checkConfigs);
        } else {
            newErrors = {}; // No errors if fresher
        }
    }

    if(step === REFERENCE_PAGE_IDX) {
        const {references} = formData;
        newErrors = validateReferences(references);
    }

    if(step === REVIEW_PAGE_IDX) {
        if(!formData.consent) {
            newErrors.consent = "You must agree to the declaration to proceed.";
        }
    }

    setErrors(newErrors);
    console.log(newErrors);
    return newErrors;
};

export const validateEmployment = (employmentData, checkConfigs) => {
    const errors = {};
    const phoneRegex = PHONE_NUMBER_REGEX;
    const details = Array.isArray(employmentData) ? employmentData : [];
    if (details.length === 0) {
        errors['education_general'] = "At least one Employment is required";
    } else {
        details.forEach((emp) => {
            if (!emp.id) return;
            // 1. Company Name
            if (!emp.company || emp.company.trim() === "") {
                errors[`emp_${emp.id}_company`] = "Company name is required";
            }

            // 2. Designation
            if (!emp.designation || emp.designation.trim() === "") {
                errors[`emp_${emp.id}_designation`] = "Designation is required";
            }

            // 3. Employee ID
            if (!emp.employeeId || emp.employeeId.trim() === "") {
                errors[`emp_${emp.id}_employeeId`] = "Employee ID is required";
            }

            // 4. Joining Date
            if (!emp.joinedDate) {
                errors[`emp_${emp.id}_joinedDate`] = "Joining date is required";
            }

            // 5. Relieved Date & Reason (Only if NOT current employer)
            if (!emp.isCurrent) {
                if (!emp.relievedDate) {
                    errors[`emp_${emp.id}_relievedDate`] = "Relieved date is required";
                } else if (emp.joinedDate && new Date(emp.relievedDate) <= new Date(emp.joinedDate)) {
                    errors[`emp_${emp.id}_relievedDate`] = "Relieved date must be after joining date";
                }

                if (!emp.reason || emp.reason.trim() === "") {
                    errors[`emp_${emp.id}_reason`] = "Reason for leaving is required";
                }
            }

            // 6. HR Verification Details
            if (!emp.hrName || emp.hrName.trim() === "") {
                errors[`emp_${emp.id}_hrName`] = "HR name is required";
            }

            if (!emp.hrEmail || !EMAIL_REGEX.test(emp.hrEmail)) {
                errors[`emp_${emp.id}_hrEmail`] = "Valid HR official email is required";
            }

            if (!emp.hrContact || !phoneRegex.test(emp.hrContact)) {
                errors[`emp_${emp.id}_hrContact`] = "Valid 10-digit HR contact is required";
            }

            if ((!emp.documents || emp.documents.length === 0) && !emp.provideLater) {
                errors[`emp_${emp.id}_doc`] = "Please upload at least one experience document/payslip or select 'Provide Later'";
            }
        });

        const validRanges = details
            .filter(emp => emp.joinedDate && (emp.isCurrent || emp.relievedDate))
            .map(emp => ({
                id: emp.id,
                company: emp.company || "Previous Company",
                start: new Date(emp.joinedDate).getTime(),
                end: emp.isCurrent
                    ? new Date().getTime()
                    : new Date(emp.relievedDate).getTime()
            }))
            .sort((a, b) => a.start - b.start);

        for (let i = 1; i < validRanges.length; i++) {
            const prev = validRanges[i - 1];
            const curr = validRanges[i];

            if (curr.start <= prev.end) {
                const prevEndDate = new Date(prev.end).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
                errors[`emp_${curr.id}_joinedDate`] = `Overlaps with your tenure at ${prev.company} (ended ${prevEndDate})`;
            }
        }

        const employeeConfig = checkConfigs?.EMPLOYMENT
        if(employeeConfig) {
            const {history, customHistory} = employeeConfig;
            let numberOfYearsRequired = parseInt(customHistory) || parseInt(history) || 0;
            if(numberOfYearsRequired > 0) {
                const intervals = details
                    .filter(emp => emp.joinedDate)
                    .map(emp => ({
                        start: new Date(emp.joinedDate).getTime(),
                        end: emp.isCurrent
                            ? new Date().getTime()
                            : (emp.relievedDate ? new Date(emp.relievedDate).getTime() : new Date().getTime())
                    }))
                    .sort((a, b) => a.start - b.start); // Sort by start date
                const experiencedYear = calculateTotalYears(intervals);
                if (experiencedYear < numberOfYearsRequired) {
                    // Calculate years and months for the message
                    const years = Math.floor(experiencedYear);
                    const months = Math.round((experiencedYear - years) * 12);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    errors.experience_general = `Employment history of ${numberOfYearsRequired} years is mandatory. You have provided ${years} year(s)${months > 0 ? ` ${months} month(s)` : ""}. Please add more experience.`;
                }
            }
        }
    }

    return errors;
};

export const validateReferences = (referenceData) => {
    const errors = {};

    if (!referenceData || referenceData.length === 0) {
        errors['refernce_general'] = "At least one reference is required";
    } else {
        referenceData.forEach((ref, index) => {
            // Required Fields Check
            if (!ref.name?.trim()) errors[`ref_${index}_name`] = "Referee name is required";
            if (!ref.designation?.trim()) errors[`ref_${index}_designation`] = "Designation is required";
            if (!ref.company?.trim()) errors[`ref_${index}_company`] = "Company/Institution is required";
            if (!ref.relationship?.trim()) errors[`ref_${index}_relationship`] = "Relationship is required";
            if (!ref.yearsKnown) errors[`ref_${index}_yearsKnown`] = "Please specify years known";

            // Email Validation
            if (!ref.email?.trim()) {
                errors[`ref_${index}_email`] = "Email is required";
            } else if (!EMAIL_REGEX.test(ref.email)) {
                errors[`ref_${index}_email`] = "Enter a valid email address";
            }

            // Phone Validation
            if (!ref.phone?.trim()) {
                errors[`ref_${index}_phone`] = "Phone number is required";
            } else if (!PHONE_NUMBER_REGEX.test(ref.phone)) {
                errors[`ref_${index}_phone`] = "Enter a valid 10-digit mobile number";
            }
        });
    }

    return errors;
};

const calculateTotalYears = (intervals = []) => {
    let totalTimeMs = 0;
    if (intervals.length > 0) {
        const merged = [];
        let currentInterval = intervals[0];

        for (let i = 1; i < intervals.length; i++) {
            const nextInterval = intervals[i];
            if (nextInterval.start <= currentInterval.end) {
                currentInterval.end = Math.max(currentInterval.end, nextInterval.end);
            } else {
                merged.push(currentInterval);
                currentInterval = nextInterval;
            }
        }
        merged.push(currentInterval);

        merged.forEach(interval => {
            totalTimeMs += (interval.end - interval.start);
        });
    }
    return  totalTimeMs / (1000 * 60 * 60 * 24 * 365.25);
}
