export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_NUMBER_REGEX = /^[6-9]\d{9}$/;


export const METHOD = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
});

export const AUTH_TYPE = Object.freeze({
    UN_AUTH: 'unAuth',
    AUTH: 'Auth',
});

export const SYSTEM_USER = "SYSTEM_USER";
export const TENANT_USER = "TENANT_USER";
export const ORG_USER = "ORG_USER";

export const TASK_COMPLETED_STATUS = ['CLEARED', 'FAILED', 'UNABLE_TO_VERIFY'];

export const READ_ONLY_TASK_STATUS = ['CLEARED', 'FAILED', 'UNABLE_TO_VERIFY', 'STOP_CASE'];


export const FAQ_DATA = {
    GENERAL_BGV: [
        { q: "Which documents are accepted?", a: "We accept original government-issued IDs like PAN, Aadhaar, and Passport." },
        { q: "Photo upload is failing?", a: "Ensure the file is under 5MB and in JPG, PNG, or PDF format." },
        { q: "Is my data secure?", a: "Yes, all documents are encrypted and used only for verification purposes." },
        { q: "What if I don't have a specific document?", a: "You can use the 'Provide Later' toggle for most sections. However, mandatory IDs like PAN/Aadhaar are required for initial processing." },
        { q: "Can I edit my details after submission?", a: "Once submitted, the form is locked. Please contact support immediately if you need to correct a critical error." }
    ],
    AADHAAR_DIGILOCKER: [
        {
            q: "What is DigiLocker and why should I use it?",
            a: "DigiLocker is a secure government-backed platform. Using it allows us to fetch authentic documents instantly, which significantly speeds up your verification and removes the need for manual document scans."
        },
        {
            q: "Is it safe to link my DigiLocker account?",
            a: "Absolutely. We only receive a one-time authorization to fetch the specific documents you approve. We do not store your DigiLocker credentials, and the entire process is protected by government-grade encryption."
        },
        {
            q: "What if my document is not available in DigiLocker?",
            a: "If the document cannot be fetched from DigiLocker, don't worry. Our verification team will simply use the manual copy you have already uploaded in the previous step to complete your check."
        },
        {
            q: "I'm not receiving the DigiLocker OTP. What should I do?",
            a: "Ensure your Aadhaar is linked to your current mobile number. If you still don't receive the OTP, please check your network or try again after a few minutes. Alternatively, you can proceed with manual document uploads."
        },
        {
            q: "Can you access all my files in DigiLocker?",
            a: "No. We can only access the specific documents (e.g., Aadhaar or Driving License) for which you provide explicit consent during the linking process."
        },
        {
            q: "Can I edit my details after submission?",
            a: "Once submitted, the form is locked to ensure data integrity. Please contact support immediately if you need to correct a critical error."
        }
    ],
    ADDRESS_VERIFICATION: [
        {
            q: "Why do you need my GPS location and photos of my residence?",
            a: "This is a 'Digital Physical Verification.' By capturing your real-time location and photos of your residence, we can instantly verify your address without requiring a physical visit from an agent, speeding up your onboarding by several days."
        },
        {
            q: "My detected location seems slightly inaccurate. Will this affect my verification?",
            a: "Don't worry. GPS can sometimes have a small margin of error (10–20 meters) due to network signals. As long as your front door and street photos clearly match the address you provided, our team will manually reconcile the slight difference."
        },
        {
            q: "What if I am not currently at my residence while filling this form?",
            a: "Since we require a live GPS match, you must be physically present at the address to complete this step. You can submit once you are at your home."
        },
        {
            q: "What should be visible in the 'Front Door' and 'Street' photos?",
            a: "For the Front Door, try to include your house/flat number if possible. For the Street photo, capture a clear view of the approach to your building or a nearby landmark (like a shop or street sign) to help identify the area."
        },
        {
            q: "I live in a large apartment complex. Which photos should I take?",
            a: "For the 'Front Door,' take a photo of your specific apartment/flat entrance. For the 'Street' photo, you can capture the main gate of your apartment complex or the building's entrance lobby."
        },
        {
            q: "The app is unable to access my location. How do I fix this?",
            a: "Ensure that 'Location Services' are enabled in your phone's settings and that your browser (Chrome/Safari) has permission to access your location. Refreshing the page usually prompts the permission request again."
        }
    ],
    INVALID_TOKEN:[
        {
            q: "Why is my verification link showing as 'Invalid' or 'Expired'?",
            a: "For security reasons, verification links are time-sensitive (usually 48–72 hours) and can only be used for a single active session. If the link has expired or the form was already submitted, the link becomes inactive."
        },
        {
            q: "How can I get a new link to complete my verification?",
            a: "Please contact your HR representative or the recruiting team who initiated the request. They can instantly trigger a fresh link to your registered email address."
        },
        {
            q: "I was halfway through the form when it expired. Is my data saved?",
            a: "Our system periodically saves drafts. In most cases, once you receive a new link, you can pick up right where you left off without re-entering all your details."
        },
        {
            q: "I received multiple emails; which link should I use?",
            a: "Always use the link from the most recent email you received. Older links are automatically deactivated whenever a new one is generated."
        },
        {
            q: "Can I use this link on a different device?",
            a: "Yes, but we recommend completing the entire process on a single device (preferably a smartphone for easier photo captures) to avoid session conflicts."
        }
    ],
    SUBMISSION_SUCCESS:[
        {
            q: "What happens now that I have submitted the form?",
            a: "Your data has been securely transmitted to our verification team. We will now begin cross-referencing your documents with the respective authorities (universities, employers, and government databases)."
        },
        {
            q: "How long will the entire background verification take?",
            a: "A standard verification typically takes between 3 to 7 business days, depending on the response time of external institutions. You will be notified if any additional information is required."
        },
        {
            q: "I realized I made a mistake in my details. Can I edit them now?",
            a: "To ensure data integrity, the form is locked immediately after submission. If you noticed a critical error (like a wrong Date of Birth or ID number), please contact your recruiter immediately to request a correction."
        },
        {
            q: "How will I know if my verification is complete?",
            a: "Once the process is finished, the final report is sent directly to your employer's HR department. They will reach out to you regarding the next steps in your onboarding process."
        },
        {
            q: "Will I receive a copy of my background check report?",
            a: "The report is the property of the requesting organization (your employer). You may contact their HR department if you wish to discuss the findings of your verification."
        }
    ]
};
