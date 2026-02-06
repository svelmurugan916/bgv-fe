import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {formatDateForInput} from "../utils/date-util.js";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        basic: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '',
            gender: '',
            profilePic: null,
            fatherName: '',
            dateOfBirth: '',
            addresses: [{
                addressType: '',
                addressLine1: '',
                addressLine2: '',
                pincode: '',
                city: '',
                state: '',
                country: '',
                siteContactMobile: '',
                isSelfContact: true,
                stayingFrom: '',
                stayingTo: '',
                isCurrentAddress: false
            }]
        },
        idVerification: {
            pan: { file: null, fileName: '', idNumber: '', dob: '', isExtracted: false },
            aadhar: { file: null, fileName: '', idNumber: '', dob: '', isExtracted: false },
            passport: { file: null, fileName: '', idNumber: '', dob: '', isExtracted: false },
            consent: false
        },
        // --- NEW ADDRESS VERIFICATION STATE ---
        addressVerification: {
            addressInfo: {},
            location: { lat: null, long: null, accuracy: null },
            photos: { frontDoor: null, landmark: null },
            consent: false
        },
        education: [{
            id: uuidv4(),
            level: '',
            degree: '',
            college: '',
            year: '',
            gpa: '',
            rollNumber: '',
            isExtracted: false,
            documents: []
        }],
        employment: {
            details: [{
                id: uuidv4(),
                company: '',
                designation: '',
                employeeId: '',
                joinedDate: '',
                relievedDate: '',
                isCurrent: false,
                hrName: '',
                doNotContact: false,
                hrEmail: '',
                hrContact: '',
                reason: '',
                documents: []
            }],
            isFresher: false,
        } ,
        references: [
            { id: uuidv4(), name: '', designation: '', company: '', email: '', phone: '', relationship: '', yearsKnown: '' },
            { id: uuidv4(), name: '', designation: '', company: '', email: '', phone: '', relationship: '', yearsKnown: '' }
        ],
        consent: false,
    });

    const [errors, setErrors] = useState({});
    const [candidateId, setCandidateId] = useState(null);

    const updateFormData = (step, newData) => {
        setFormData(prev => ({
            ...prev,
            [step]: newData
        }));
    };

    const initBasicInfo = (data) => {
        setFormData(prev => ({
            ...prev,
            basic: {
                ...prev.basic,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phone || ''
            }
        }));
    };

    const hydrateForm = (data) => {
        if (!data) return; // Guard clause

        setFormData(prev => ({
            ...prev,
            ...data,
            basic: { ...prev.basic, ...(data.basic || {}) },
            idVerification: {
                ...prev.idVerification,
                pan: {
                    ...prev.idVerification.pan,
                    idNumber: data.idVerification?.pan?.idNumber || '',
                    fileName: data.idVerification?.pan?.fileName || '',
                    dob: data.idVerification?.pan?.dob || '',
                    isExtracted: data.idVerification?.pan?.isExtracted || false,
                    fileId: data.idVerification?.pan?.fileId || '',
                },
                aadhar: {
                    ...prev.idVerification.aadhar,
                    idNumber: data.idVerification?.aadhar?.idNumber || '',
                    fileName: data.idVerification?.aadhar?.fileName || '',
                    dob: data.idVerification?.aadhar?.dob || '',
                    isExtracted: data.idVerification?.aadhar?.isExtracted || false,
                    fileId: data.idVerification?.aadhar?.fileId || '',
                },
                passport: {
                    ...prev.idVerification.passport,
                    idNumber: data.idVerification?.passport?.idNumber || '',
                    fileName: data.idVerification?.passport?.fileName || '',
                    dob: data.idVerification?.passport?.dob || '',
                    isExtracted: data.idVerification?.passport?.isExtracted || false,
                    fileId: data.idVerification?.passport?.fileId || '',
                },
                consent: data?.idVerification?.consent
            },
            education: data.education?.length > 0 ? data.education : prev.education,
            employment: data.employment
                ? {
                    isFresher: data.employment.isFresher || false,
                    details: data.employment.details?.map(emp => ({
                        ...emp,
                        joinedDate: formatDateForInput(emp.joinedDate),
                        relievedDate: formatDateForInput(emp.relievedDate),
                    })) || prev.employment.details
                }
                : prev.employment,
            references: data.references?.length > 0 ? data.references : prev.references,
        }));
    };

    const setError = (key, message) => {
        setErrors(prev => ({ ...prev, [key]: message }));
    };

    const clearError = (key) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData, setFormData, errors, setErrors, clearError, initBasicInfo, hydrateForm, setCandidateId, candidateId }}>
            {children}
        </FormContext.Provider>
    );
};

export const useForm = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useForm must be used within FormProvider');
    }
    return context;
}
