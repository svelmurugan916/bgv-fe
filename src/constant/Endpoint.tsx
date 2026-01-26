export const VERIFY_CREDENTIALS = "/auth/verify-credentials"
export const VERIFY_OTP = "/auth/verify-otp"
export const RESEND_OTP = "/auth/resend-otp"
export const USER_PROFILE = "/user/me"
export const ACTIVATE_ROLE = '/auth/activate-role'

export const VERIFY_CANDIDATE_TOKEN = '/auth/verify-invite'
export const VERIFY_ADDRESS_TOKEN = '/auth/verify-address-invite'


export const REFRESH_TOKEN = "/auth/refresh-token"
export const LOGOUT = "/auth/logout";
export const CREATE_ORGANIZATION = "/organizations/new-organization";
export const SAVE_ORGANIZATION = "/organizations/save-organization";
export const GET_ALL_ORGANIZATION = "/organizations/get-all";
export const GET_ORGANIZATION = "/organizations";
export const FILE_GET = "/files"
export const GET_ALL_CHECK_TYPE = "/check-type/get-all"
export const SAVE_CHECK_PACKAGE = "/check-type/save-package"
export const DELETE_PACKAGE = "/check-type/delete-package"

export const GET_ALL_ORGANIZATIONS = "/organizations/get-all-organization"
export const GET_PACKAGES_BY_ORG = "/check-type/get-packages"
export const INITIATE_BULK_VERIFICATION = "/candidate/invite-bulk"
export const SEND_ADDRESS_VERIFICATION = "/address-check/{candidateId}/send-address-verification-link/{addressId}"

export const SAVE_BGV_STEP = "/candidate/form-step"
export const OCR_PAN_UPLOAD = "/ocr/extract-pan-number"
export const OCR_AADHAAR_UPLOAD = "/ocr/extract-aadhaar-number"
export const REMOVE_DOCUMENT = "/files/candidate/document"

export const EXTRACT_EDUCATION_DOCUMENT = "/ocr/extract-marksheet-data"
export const UPLOAD_EMPLOYMENT_DOCUMENT = "/files/candidate/{candidateId}/upload-multiple";

export const INVITED_CANDIDATE_LIST = "/candidate/invited-candidate";
export const FORM_NOT_SUBMITTED_COUNT = "/candidate/form-non-submitted-stop-case-count"
export const RESEND_INVITE_NOTIFICATION = "/candidate/resend-invitation"

export const GET_ALL_CANDIDATES_TASKS = "/tasks/get-all-candidate";
export const GET_CANDIDATES_TASKS_FOR_ORGANIZATION = "/tasks/get-candidate-for-organization";
export const MARK_CANDIDATE_AS_STOP_CASE = "/candidate/mark-as-stop-case"
export const CANDIDATE_SEARCH_API = "/candidate/search-candidate"
export const GET_CANDIDATE_DETAILS = "/tasks/get-candidate-details"

export const ADDRESS_CHECK_DETAILS = "/address-check/get-details"
export const SUBMIT_ADDRESS_VERIFICATION = "/address-check/submit-verification"