import React from "react";
import {Calendar, Fingerprint, User, MapPin, FileText, Info, CircleUserRoundIcon, FlagIcon} from "lucide-react";
import ValidatedInput from "./ValidatedInput";
import CustomDatePicker from "../../component/common/CustomDatePicker.jsx";
import { useForm } from "../../provider/FormProvider.jsx";

const ExtractedData = ({
                           idLabel,
                           documentType,
                           idValue,
                           dobValue,
                           onIdChange,
                           onDobChange,
                           name,
                           onNameChange,
                           passportData,
                           onFieldChange,
                           section
                       }) => {
    const isPassport = documentType === 'PASSPORT';
    const { errors } = useForm();
    const errorPrefix = isPassport ? `passport_${section}` : documentType.toLowerCase();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 p-4 lg:p-8 bg-[#F9F7FF] border border-[#5D4591]/10 rounded-2xl lg:rounded-[2rem] animate-in zoom-in-95 duration-300">

            {/* --- SHARED FIELDS (PAN, AADHAAR, PASSPORT FRONT) --- */}
            {(!section || section !== 'BACK') && (
                <>
                    <ValidatedInput
                        label={idLabel}
                        value={isPassport ? passportData?.idNumber : idValue}
                        onChange={onIdChange}
                        icon={Fingerprint}
                        errorId={`${errorPrefix}_idNumber`}
                    />

                    <CustomDatePicker
                        label="Date of Birth"
                        value={isPassport ? passportData?.dob : dobValue}
                        icon={Calendar}
                        placeholder={"Select Date of Birth"}
                        disableFuture={true}
                        onChange={onDobChange}
                        error={errors[`${errorPrefix}_dob`]}
                    />

                    <ValidatedInput
                        label="Name"
                        value={isPassport ? passportData?.name : name}
                        onChange={onNameChange}
                        icon={User}
                        errorId={`${errorPrefix}_name`}
                    />
                </>
            )}

            {/* --- PASSPORT ONLY FIELDS --- */}
            {isPassport && (
                <>
                    {section === "FRONT" ? (
                        <>
                            <ValidatedInput
                                label="Birth Place"
                                value={passportData.birthPlace}
                                onChange={(v) => onFieldChange('birthPlace', v)}
                                icon={MapPin}
                                errorId="passport_FRONT_birthPlace"
                            />
                            <CustomDatePicker
                                label="Issue Date"
                                value={passportData.dateOfIssue}
                                icon={Calendar}
                                placeholder={"Select Issue Date"}
                                disableFuture={true}
                                onChange={(v) => onFieldChange('dateOfIssue', v)}
                                error={errors[`passport_FRONT_dateOfIssue`]}
                            />
                            <CustomDatePicker
                                label="Expiry Date"
                                value={passportData.dateOfExpiry}
                                icon={Calendar}
                                placeholder={"Select Expiry Date"}
                                disableFuture={false}
                                onChange={(v) => onFieldChange('dateOfExpiry', v)}
                                error={errors[`passport_FRONT_dateOfExpiry`]}
                            />
                            <ValidatedInput
                                label="Gender"
                                value={passportData.gender}
                                onChange={(v) => onFieldChange('gender', v)}
                                icon={CircleUserRoundIcon}
                                errorId="passport_FRONT_gender"
                            />
                            <ValidatedInput
                                label="Nationality"
                                value={passportData.nationality}
                                onChange={(v) => onFieldChange('nationality', v)}
                                icon={FlagIcon}
                                errorId="passport_FRONT_nationality"
                            />
                        </>
                    ) : (
                        <>
                            <ValidatedInput
                                label="File Number"
                                value={passportData.fileNumber}
                                onChange={(v) => onFieldChange('fileNumber', v)}
                                icon={FileText}
                                errorId="passport_BACK_fileNumber"
                            />
                            <ValidatedInput
                                label="Father's Name"
                                value={passportData.fatherName}
                                onChange={(v) => onFieldChange('fatherName', v)}
                                icon={User}
                                errorId="passport_BACK_fatherName"
                            />
                            <ValidatedInput
                                label="Mother's Name"
                                value={passportData.motherName}
                                onChange={(v) => onFieldChange('motherName', v)}
                                icon={User}
                                errorId="passport_BACK_motherName"
                            />
                            <ValidatedInput
                                label="Permanent Address"
                                value={passportData.permanentAddress}
                                onChange={(v) => onFieldChange('permanentAddress', v)}
                                icon={MapPin}
                                errorId="passport_BACK_permanentAddress"
                                isTextArea={true}
                                className="md:col-span-2"
                            />
                        </>
                    )}
                </>
            )}

            {/* --- VERIFICATION NOTICE --- */}
            <div className="md:col-span-2 mt-2 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                <div className="mt-0.5 text-blue-500">
                    <Info size={16} />
                </div>
                <div className="flex-1">
                    <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-0.5">Verification Required</p>
                    <p className="text-xs text-blue-700/80 leading-relaxed">
                        Please review the extracted data carefully. If any details do not match your original document exactly,
                        please update the fields manually before proceeding.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExtractedData;
