export const VERIFY_CREDENTIALS = "/auth/verify-credentials"
export const VERIFY_OTP = "/auth/verify-otp"
export const RESEND_OTP = "/auth/resend-otp"
export const USER_PROFILE = "/user/me"
export const ACTIVATE_ROLE = '/pre-auth/select-role'
export const GET_ALL_USERS = "/user/get-all"
export const GET_ALL_ALLOCATED_ROLES = "/pre-auth/get-allocated-roles"
export const UPDATE_USER_ROLES = '/user/update-user-roles'
export const UPDATE_USER = '/user/update-user'
export const CREATE_USER = '/user/create-user'
export const TOGGLE_USER_ACTIVE = '/user/toggle-user-active'
export const EMAIL_RESET_URL = '/auth/generate-reset-password-link'
export const RESET_PASSWORD = '/auth/reset-password'
export const MANUAL_RESET_PASSWORD = '/auth/manual-reset-password'
export const VALIDATE_RESET_TOKEN = '/auth/validate-reset-token'

export const ADMIN_DASHBOARD = '/admin/dashboard'
export const TENANT_MANAGER_DASHBOARD = '/admin/tenants'
export const GET_TENANT_BALANCE = "/wallet/get-balance"
export const GET_TRANSACTION_ACTIVITIES = "/wallet/transactions"
export const GET_RESERVED_TRANSACTION_ACTIVITIES = "/wallet/reserved-transactions"
export const GET_COMMITTED_TRANSACTION_ACTIVITIES = "/wallet/committed-transactions"
export const GET_TRANSACTION_RESERVATION_ITEMS = "/wallet/get-reservation-items"
export const RELEASE_TRANSACTION_RESERVATION = "/wallet/reservation-items/release"
export const GET_TASK_RESERVATION = "/wallet/reservation-items/task"
export const REVERT_TASK_RESERVATION = "/wallet/reservation-item/revert"

export const GET_TENANT_METADATA = '/admin/tenants/get-meta-data-config'

export const GET_ALL_ROLES = '/role/get-all-roles'
export const GET_ALL_ENABLED_ROLES = '/role/get-all-enabled-roles'
export const GET_ALL_ENABLED_TENANTS = '/admin/tenants/get-all-minimal-data'
export const CREATE_NEW_ROLE = '/role/create-role'
export const UPDATE_ROLE_ENDPOINT = '/role/update-role'

export const VERIFY_CANDIDATE_TOKEN = '/auth/verify-invite'
export const VERIFY_ADDRESS_TOKEN = '/auth/verify-address-invite'
export const VERIFY_DIGI_LOCKER_TOKEN = '/auth/verify-digilocker-invite'
export const INITIATE_DIGILOCKER_VERIFICATION = '/aadhaar/generate-url'
export const CREATE_IDENTITY_CHECK = "/identity-check/save-identity"

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

export const SAVE_BGV_STEP = "/candidate-register/save-form"
export const OCR_PAN_UPLOAD = "/ocr/extract-pan-number"
export const PASSPORT_FRONT_OCR = "/passport/extract/front"
export const PASSPORT_BACK_OCR = "/passport/extract/back"
export const OCR_AADHAAR_UPLOAD = "/ocr/extract-aadhaar-number"
export const REMOVE_DOCUMENT = "/files/candidate/document"
export const UPLOAD_PROFILE_PICTURE = "/candidate/{candidateId}/profile-picture"
export const REMOVE_PROFILE_PICTURE = "/candidate/{candidateId}/remove-profile-picture"
export const DELETE_CANDIDATE_PII = "/candidate/delete-candidate"

export const GET_IDENTITY_DETAILS = "/identity-check/get-identity"
export const SAVE_IDENTITY_DETAILS = "/identity-check/update-identity"

export const UPLOAD_CANDIDATE_DOCUMENT = '/tasks/candidate-doc/{taskId}/upload?type={type}'
export const REMOVE_CANDIDATE_DOCUMENT = "/tasks/candidate-doc/{taskId}/delete/{fileId}?type={type}"

export const EXTRACT_EDUCATION_DOCUMENT = "/ocr/extract-marksheet-data"
export const UPLOAD_SUPPORTING_DOCUMENT = "/candidate/upload-supporting-document"
export const UPLOAD_EMPLOYMENT_DOCUMENT = "/files/candidate/{candidateId}/upload-multiple";
export const UPLOAD_INTERNAL_PROOF = "/files/task/{taskId}/upload-proof"
export const REMOVE_INTERNAL_PROOF = "/files/task/{fileId}/delete-file"
export const REMOVE_EVIDENCE_PROOF_DOCUMENT = "/files/task/{fileId}/delete-evidence-file"

export const SEND_DIGI_LOCKER_LINK_FOR_AADHAAR = "/aadhaar/send-digilocker-verification-url"
export const PAN_VERIFY = "/pan/verify"
export const PASSPORT_VERIFY = "/passport/verify"

export const INVITED_CANDIDATE_LIST = "/candidate/invited-candidate";
export const INVITED_ALL_CANDIDATE_LIST = "/candidate/all-invited-candidate";
export const FORM_NOT_SUBMITTED_COUNT = "/candidate/form-non-submitted-stop-case-count"
export const RESEND_INVITE_NOTIFICATION = "/candidate/resend-invitation"

export const GET_ALL_CANDIDATES_TASKS = "/tasks/get-all-candidate";
export const GET_CANDIDATES_TASKS_FOR_ORGANIZATION = "/tasks/get-candidate-for-organization";
export const MARK_CANDIDATE_AS_STOP_CASE = "/candidate/mark-as-stop-case"
export const RESUME_CANDIDATE_STATUS = "/candidate/resume-candidate-status"
export const CANDIDATE_SEARCH_API = "/candidate/search-candidate"
export const GET_CANDIDATE_DETAILS = "/tasks/get-candidate-details"
export const ORGANIZATION_STATISTICS = "/organizations/statistics"

export const SUBMIT_ADDRESS_VERIFICATION = "/address-check/submit-verification"
export const UPDATE_EDUCATION_CHECK = "/education-check/update-check"

export const GET_TASK_DETAILS = "/tasks/get-details"
export const VERIFY_DIGILOCKER_STATUS = "/aadhaar/download";
export const VERIFY_AND_DOWNLOAD_DIGILOCKER_STATUS = "/aadhaar/verify-and-download";

export const UPDATE_EMPLOYMENT_CHECK = "/employment-check/update-check"
export const SEND_VERIFICATION_MAIL_TO_HR = "/employment-check/send-hr-mail"
export const HR_MAIL_HISTORY = "/employment-check/email-log"
export const UPDATE_REFERENCE_CHECK = '/reference-check/update-check';

export const UPDATE_IDENTITY_CHECK_ENDPOINT = ""

export const UPDATE_ADDRESS_ENDPOINT = "/address-check/update-address"
export const SAVE_NEW_ADDRESS_ENDPOINT = "/address-check/save-address"

export const ASSIGN_CHECK_TO_ME = "/task-assignments/assign"

export const GET_TASK_AUDIT_DETAILS = "/tasks/audit-details"
export const SUBMIT_TASK_FEEDBACK_DETAILS = "/tasks/submit-feedback"
export const UPDATE_TASK_STAUS = "/tasks/update-task"

export const DOWNLOAD_CANDIDATE_REPORT = "/reports/bgv"

export const GET_ALL_OPERATIONS_MEMBERS = "/user/get-all-operations-user"
export const GET_ALL_PENDING_TASKS = "/tasks/get-all-pending-tasks"
export const SEARCH_PENDING_TASKS = "/tasks/search"
export const GET_ALL_PENDING_CANDIDATES = "/candidate/get-pending-candidates"

export const SINGLE_TASK_ASSIGN = "/task-assignments/assign"
export const BULK_TASK_ASSIGN = "/task-assignments/bulk-assign"
export const REASSIGN_TASK = "/task-assignments/reassign"

export const GET_SYSTEM_OVERVIEW_DETAILS = "/tasks/get-system-overview"
export const GET_MONTH_WISE_DETAILS = "/tasks/month-wise-data"
export const GET_THROUGHPUT_DATA = "/case/get-throughput-metrics"
export const GET_OPERATIONS_BOTTLENECK_DATA = "/tasks/operation-bottleneck-data"
export const GET_RISK_PROFILE_DATA = "/tasks/risk-profile-data"
export const GET_ORGANIZATION_HEALTH_PORTFOLIO = "/organizations/portfolio-health"
export const GET_TIMELINE_DATA = "/case/timeline"