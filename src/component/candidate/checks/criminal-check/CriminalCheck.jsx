import React, {useState, useMemo, useEffect, useRef} from 'react';
import BaseCheckLayout from "../base-check-layout/BaseCheckLayout.jsx";
import CaseDetailModal from "./CaseDetailModal.jsx";
import CaseMinimalCard from "./CaseMinimalCard.jsx";
import SearchProfileCard from "./SearchProfileCard.jsx";
import ConsolidatedOverview from "./ConsolidatedOverview.jsx";
import SimpleLoader from "../../../common/SimpleLoader.jsx";
import {GET_TASK_DETAILS} from "../../../../constant/Endpoint.tsx";
import {METHOD} from "../../../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import CriminalCheckTrigger from "./CriminalCheckTrigger.jsx";
import CaseInActive from "../CaseInActive.jsx";
import InsufficientFundView from "../../../InsufficientFundView.jsx";

const CriminalCheck = ({ taskId, caseBillingStatus }) => {
    const [apiData, setApiData] = useState({});
    const [selectedCase, setSelectedCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);

    const fetchReferenceDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${taskId}?taskType=criminal`, METHOD.GET);
            if (response.status === 200) {
                setApiData(response.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchReferenceDetails();
        }
    }, []);

    const groupedCases = useMemo(() => {
        return apiData?.cases?.reduce((acc, current) => {
            const type = current.caseType || "Unclassified";
            if (!acc[type]) acc[type] = [];
            acc[type].push(current);
            return acc;
        }, {});
    }, [apiData?.cases]);

    if (loading) return <SimpleLoader size="lg" className="py-20" />;
    const isFundReleasedOrCancelled = apiData?.isFundReleasedOrCancelled;
    const getBadgeConfig = () => {
        if(caseBillingStatus === 'INSUFFICIENT_FUNDS') return { label: 'Insufficient Fund', colorClass: 'bg-rose-50 text-rose-600 border border-rose-100', icon: <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> };
        if (isFundReleasedOrCancelled) return { label: 'Funds Released', colorClass: 'bg-rose-50 text-rose-600 border border-rose-100', icon: <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> };
        return { };
    };
    return (
        <BaseCheckLayout
            title="Judicial Intelligence Report"
            description="Comprehensive e-Court cross-referencing and criminal record analysis."
            checkId={taskId}
            badgeConfig={getBadgeConfig()}
            onStatusUpdateSuccess={fetchReferenceDetails}
        >
            <div className="space-y-8 p-10 bg-[#FBFBFF] animate-in fade-in duration-700">
                {
                    apiData?.transactionId !== null ? (
                        <>
                            <ConsolidatedOverview data={apiData} />
                            <SearchProfileCard data={apiData} />
                            <div className="space-y-10">
                                {Object.entries(groupedCases).map(([type, cases]) => (
                                    <div key={type} className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className={`w-2 h-6 rounded-full ${
                                                type === 'Criminal' ? 'bg-rose-500' :
                                                    type === 'Civil'    ? 'bg-indigo-500' : 'bg-slate-400'
                                            }`} />
                                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
                                                {type} Records ({cases.length})
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {cases.map((item) => (
                                                <CaseMinimalCard
                                                    key={item.id}
                                                    caseData={item}
                                                    onClick={() => setSelectedCase(item)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ): caseBillingStatus === 'INSUFFICIENT_FUNDS' ? (
                        <InsufficientFundView label={"Criminal"} process={"this criminal case"} />
                    )  :  (
                        isFundReleasedOrCancelled ? (
                            <CaseInActive taskId={taskId} onRevertSuccess={fetchReferenceDetails} label={"Criminal"} process={"querying 15000+ courts"} />
                        ) : (
                            <CriminalCheckTrigger
                                data={apiData}
                                taskId={taskId}
                                onTriggerSuccess={fetchReferenceDetails}
                            />
                        )
                    )
                }

            </div>

            {selectedCase && (
                <CaseDetailModal
                    caseData={selectedCase}
                    onClose={() => setSelectedCase(null)}
                />
            )}
        </BaseCheckLayout>
    );
};

// Mock Data Integrated inside the component for demonstration
const mockApiResponse = {
        data: {
            "taskId": "550e8400-e29b-41d4-a716-446655440000",
            "taskType": "CRIMINAL",
            "verificationStatus": "FAILED",
            "adjudicationResult": "PENDING",
            "adjudicationRemarks": null,
            "automatedVerificationRemarks": "Active criminal case: [200328006652012] at Chief Metropolitan Magistrate, Esplanade Court, Mumbai (Score: 62%). Active criminal case: [202100121012018] at Chief Metropolitan Magistrate, Central, THC (Score: 58%).",
            "apiProvider": "SUREPASS_ECOURTS",
            "transactionId": "ecourt_search_v2_mxyvrmamIseuShYppgru",
            "nameChecked": "MEGHNA SAUMYA GANDHI",
            "fatherNameChecked": "HARSHAD PRANLAL KOTHARI",
            "addressChecked": "1902/ RUSTOMJEE ADARSH EXCELLENCY C.H.S$OFF MARVE ROAD, NEAR CARMEL SCHOOL MALAD WEST MUMBAI MH 400064",
            "yearChecked": "2016",
            "stateChecked": "Maharashtra",
            "recordFound": true,
            "numberOfCases": 10,
            "numberOfCriminalCases": 2,
            "numberOfCivilCases": 6,
            "apiRequestedAt": "2024-01-15T10:30:00",
            "apiRespondedAt": "2024-01-15T10:30:03",
            "completedAt": "2024-01-15T10:30:03",
            "cases": [
                {
                    "id": "uuid-case-1",
                    "caseNo": "200328006652012",
                    "caseName": "Ss casess  SS/2800665/2012",
                    "caseTypeName": "Ss casess  SS",
                    "caseTypeNumber": "3",
                    "caseType": "Criminal",
                    "caseStatus": "Pending",
                    "cnrNumber": "MHMM110017162012",
                    "caseRegDate": "19-04-2012",
                    "caseLink": "https://services.ecourts.gov.in/ecourtindia_v6/",
                    "caseYear": "2012",
                    "bench": "",
                    "crawlingDate": "2022-03-29T03:25:16.000Z",
                    "judgementDate": "",
                    "judgementDescription": "",
                    "courtName": "Chief Metropolitan Magistrate, Esplanade Court, Mumbai",
                    "courtType": "District Court",
                    "courtNumber": "1",
                    "courtNumberAndJudge": "6-M.M. , 28TH COURT",
                    "district": "Mumbai Cmm Courts",
                    "state": "Maharashtra",
                    "stateCode": "1",
                    "distCode": "23",
                    "registrationNumber": "2800665/2012",
                    "filingNumber": "100665/2012",
                    "filingDate": "19-04-2012",
                    "hearingDate": "18th June 2012",
                    "natureOfDisposal": "",
                    "firNumber": "",
                    "firLink": "",
                    "gfcFirNumberCourt": "",
                    "gfcFirYearCourt": "",
                    "gfcFirPoliceStationCourt": "",
                    "underAct": "N. I. Act",
                    "underSection": "138R-W141AND142",
                    "petitioner": "MS. AMARDEEP TRADING COMPANY PRO-MR. HITESH LAKHAM",
                    "respondent": "1. MRS. MEGHNA KRUNAL SANGHVI AND ANR",
                    "petitionerAddress": "1) MS. AMARDEEP TRADING COMPANY PRO-MR. HITESH LAKHAM    Address  - 191, DADI SHETH AGIARY LANE, MUM-2    Advocate- GAURAV G. DAVE",
                    "respondentAddress": "1) 1. MRS. MEGHNA KRUNAL SANGHVI AND ANR    Address - NEW VAISHALI CO-OP, HOUSING SOC LTD FLAT NO.503, NARSHINGH LANE,OPP N.M. COLLEGE, MALAD W MUM2)  2.MR. KRUNAL SANGHAVI    NEW VAISHALI CO-OP. HOUSING SOCIETY LTD FLAT NO.50",
                    "suitFiledAmount": "",
                    "gfcUpdatedAt": "10th May 2023",
                    "createdAtGfc": "26th September 2023",
                    "fuzzyNameScore": 0.62,
                    "gfcPetitioners": [
                        {
                            "name": "MS. AMARDEEP TRADING COMPANY PRO-MR. HITESH LAKHAM",
                            "address": "191, DADI SHETH AGIARY LANE, MUM-2"
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "1. MRS. MEGHNA KRUNAL SANGHVI AND ANR",
                            "address": "NEW VAISHALI CO-OP, HOUSING SOC LTD FLAT NO.503, NARSHINGH LANE,OPP N.M. COLLEGE, MALAD W MUM"
                        },
                        {
                            "name": "2.MR. KRUNAL SANGHAVI",
                            "address": "NEW VAISHALI CO-OP. HOUSING SOCIETY LTD FLAT NO.50"
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/200328006652012/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": [
                        {
                            "order": "Order",
                            "gfcOrderType": "Order",
                            "orderDate": "2019-12-24",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/200328006652012/order-0.pdf?X-Amz-Expires=3600..."
                        }
                    ]
                },
                {
                    "id": "uuid-case-2",
                    "caseNo": "200101030892014",
                    "caseName": "Petition A/103089/2014",
                    "caseTypeName": "Petition A",
                    "caseTypeNumber": "1",
                    "caseType": "Civil",
                    "caseStatus": "Disposed",
                    "cnrNumber": "MHFC010075402014",
                    "caseRegDate": "",
                    "caseLink": "https://services.ecourts.gov.in/ecourtindia_v6/",
                    "caseYear": "2014",
                    "bench": "",
                    "crawlingDate": "2022-03-19T03:26:51.000Z",
                    "judgementDate": "",
                    "judgementDescription": "",
                    "courtName": "Family Court, Bandra, Mumbai",
                    "courtType": "District Court",
                    "courtNumber": "11",
                    "courtNumberAndJudge": "",
                    "district": "Maharashtra-Family Courts",
                    "state": "Maharashtra",
                    "stateCode": "1",
                    "distCode": "42",
                    "registrationNumber": "",
                    "filingNumber": "",
                    "filingDate": "",
                    "hearingDate": "",
                    "natureOfDisposal": "",
                    "firNumber": "",
                    "firLink": "",
                    "gfcFirNumberCourt": "",
                    "gfcFirYearCourt": "",
                    "gfcFirPoliceStationCourt": "",
                    "underAct": "HINDU MARRIAGE ACT",
                    "underSection": "13(1)(ia)(ib)",
                    "petitioner": "",
                    "respondent": "",
                    "petitionerAddress": "1) XXXXXXX    Address  - XXXXXXX",
                    "respondentAddress": "1) XXXXXXX    Address - XXXXXXX2)  XXXXXXX    XXXXXXX",
                    "suitFiledAmount": "",
                    "gfcUpdatedAt": "25th July 2023",
                    "createdAtGfc": "2nd October 2023",
                    "fuzzyNameScore": 0.0,
                    "gfcPetitioners": [
                        {
                            "name": "XXXXXXX",
                            "address": "XXXXXXX"
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "XXXXXXX",
                            "address": "XXXXXXX"
                        },
                        {
                            "name": "XXXXXXX",
                            "address": "XXXXXXX"
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [
                            {
                                "name": "Mrs Meghna Rajkumar nee Meghna Bharat,",
                                "address": "residing at 10011002, Sevilla, Raheja Exotica, Patilwadi, Madh Island, Malad West Mumbai 400 064 Petitioner",
                                "age": "26",
                                "statename": "MAHARASHTRA",
                                "districtname": "MUMBAI",
                                "pincode": "400064"
                            }
                        ],
                        "respondents": [
                            {
                                "name": "Mr Rajkumar Madhavan So Srinivas Madhavan,",
                                "address": "resident of 101, Sai Gokul, Central Excise Colony,Bagh, Amberpeth, Hyderabad 500 013, Andhra Pradesh Respondent",
                                "age": "31",
                                "statename": "MAHARASHTRA",
                                "districtname": "OSMANABAD",
                                "pincode": "413507"
                            }
                        ]
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/200101030892014/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": [
                        {
                            "order": "Copy of Judgment",
                            "gfcOrderType": "Judgement",
                            "orderDate": "23-08-2016",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/200101030892014/order-0.pdf?X-Amz-Expires=3600..."
                        },
                        {
                            "order": "Copy of Judgment",
                            "gfcOrderType": "Judgement",
                            "orderDate": "23-08-2016",
                            "orderLinkUrl": null
                        }
                    ]
                },
                {
                    "id": "uuid-case-3",
                    "caseNo": "208502012402012",
                    "caseName": "Notice of Motion/201240/2012",
                    "caseTypeName": "Notice of Motion",
                    "caseTypeNumber": "85",
                    "caseType": "Civil",
                    "caseStatus": "Disposed",
                    "cnrNumber": "MHCC040011402012",
                    "caseRegDate": "11-05-2012",
                    "caseLink": "https://services.ecourts.gov.in/ecourtindia_v6/",
                    "caseYear": "2012",
                    "bench": "",
                    "crawlingDate": "2022-03-29T03:11:09.000Z",
                    "judgementDate": "",
                    "judgementDescription": "",
                    "courtName": "Civil Court, Dindoshi",
                    "courtType": "District Court",
                    "courtNumber": "3",
                    "courtNumberAndJudge": "2-Judge  Additional Sessions Judge",
                    "district": "Mumbai City Civil Court",
                    "state": "Maharashtra",
                    "stateCode": "1",
                    "distCode": "37",
                    "registrationNumber": "201240/2012",
                    "filingNumber": "201240/2012",
                    "filingDate": "11-05-2012",
                    "hearingDate": "15th June 2012",
                    "natureOfDisposal": "Contested--Allowed",
                    "firNumber": "",
                    "firLink": "",
                    "gfcFirNumberCourt": "",
                    "gfcFirYearCourt": "",
                    "gfcFirPoliceStationCourt": "",
                    "underAct": "",
                    "underSection": "",
                    "petitioner": "Dhaku P. Ghadigaonkar",
                    "respondent": "Meghana M. Ghadigonkar",
                    "petitionerAddress": "1) Dhaku P. Ghadigaonkar    Address  - Address- R.No.2,Parag Chawl,Baman Wada Hill,Justic M.C.Chhagala Marg,Vile Parle E,Mum99.    Advocate- M.K. Ghadigaonkar",
                    "respondentAddress": "1) Meghana M. Ghadigonkar    Address - Jai Ganesh CHS Ltd.Kanu Compound,Santosh Nagar,Malad E,Mum97.",
                    "suitFiledAmount": "",
                    "gfcUpdatedAt": "10th May 2023",
                    "createdAtGfc": "26th September 2023",
                    "fuzzyNameScore": 0.41,
                    "gfcPetitioners": [
                        {
                            "name": "Dhaku P. Ghadigaonkar",
                            "address": "Address- R.No.2,Parag Chawl,Baman Wada Hill,Justic M.C.Chhagala Marg,Vile Parle E,Mum99."
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "Meghana M. Ghadigonkar",
                            "address": "Jai Ganesh CHS Ltd.Kanu Compound,Santosh Nagar,Malad E,Mum97."
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [
                            {
                                "name": "BORIVALI DIVISION, (BRANCH)",
                                "address": ""
                            },
                            {
                                "name": "Mr.Dhaku Rajaram Ghadigaonkar",
                                "address": ""
                            }
                        ],
                        "respondents": [
                            {
                                "name": "Mrs.Meghana Manohar Ghadigaonkar & Ors.",
                                "address": ""
                            }
                        ]
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/208502012402012/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": [
                        {
                            "order": "Order Number 1",
                            "gfcOrderType": "Order",
                            "orderDate": "21-08-2012",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/208502012402012/order-0.pdf?X-Amz-Expires=3600..."
                        }
                    ]
                },
                {
                    "id": "uuid-case-4",
                    "caseNo": "220400000052008",
                    "caseName": "Tr.P.(C)./5/2008",
                    "caseTypeName": "Tr.P.(C). - Transfer Petition under Section 24 C.P.C.",
                    "caseTypeNumber": "204",
                    "caseType": "Civil",
                    "caseStatus": "Disposed",
                    "cnrNumber": "GAHC010013042008",
                    "caseRegDate": "14-03-2008",
                    "caseLink": "https://hcservices.ecourts.gov.in",
                    "caseYear": "2008",
                    "bench": "",
                    "crawlingDate": "2018-03-05T02:21:26.000Z",
                    "judgementDate": "",
                    "judgementDescription": "",
                    "courtName": "High Court of Gauhati",
                    "courtType": "High Court",
                    "courtNumber": "",
                    "courtNumberAndJudge": "",
                    "district": "",
                    "state": "Assam",
                    "stateCode": "6",
                    "distCode": "0",
                    "registrationNumber": "5/2008",
                    "filingNumber": "5/2008",
                    "filingDate": "14-03-2008",
                    "hearingDate": "14th March 2008",
                    "natureOfDisposal": " --",
                    "firNumber": "",
                    "firLink": "",
                    "gfcFirNumberCourt": "",
                    "gfcFirYearCourt": "",
                    "gfcFirPoliceStationCourt": "",
                    "underAct": "",
                    "underSection": "",
                    "petitioner": "SMTI MEGHNA AGARWAL @ SAUMYA AGARWAL",
                    "respondent": "SRI PRAVEEN AGARWAL",
                    "petitionerAddress": "1) SMTI MEGHNA AGARWAL @ SAUMYA AGARWAL    Address  - W/O SRI PRAVEEN AGARWAL AT PRESENT RESIDING AT   C/O SRI MAHABIR PRASAD BUKALSARIA, NEAR JAIN MANDIR, NEW MARKET, DIBRUGARH,   DIST. DIBRUGARH, ASSAM.    Advocate- MR.A KABRA,, MS.A BARUA,MR.R L YADAV,MS.K YADAV",
                    "respondentAddress": "1) SRI PRAVEEN AGARWAL    Address - S/O SRI JUGAL KISHORE AGARWAL,  BY CASTE HINDU, BY PROFESSION BUSINESSMAN...",
                    "suitFiledAmount": "",
                    "gfcUpdatedAt": "25th May 2023",
                    "createdAtGfc": "19th May 2023",
                    "fuzzyNameScore": 0.51,
                    "gfcPetitioners": [
                        {
                            "name": "SMTI MEGHNA AGARWAL @ SAUMYA AGARWAL ",
                            "address": "address  -   wifeof sri praveen agarwal at present residing at   c/o sri mahabir prasad bukalsaria, near jain mandir, new market, dibrugarh,   dist. dibrugarh, assam."
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "SRI PRAVEEN AGARWAL ",
                            "address": " "
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/220400000052008/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": []
                },
                {
                    "id": "uuid-case-5",
                    "caseNo": "Tr.P.(C). 5/2008",
                    "caseName": "",
                    "caseTypeName": "",
                    "caseTypeNumber": "",
                    "caseType": "",
                    "caseStatus": "Disposed",
                    "cnrNumber": "",
                    "caseRegDate": "14/03/2008",
                    "caseLink": "https://hcservices.ecourts.gov.in/ecourtindiaHC/cases/case_no.php?...",
                    "caseYear": "2008",
                    "bench": "",
                    "crawlingDate": "2017-10-02T05:32:38.000Z",
                    "judgementDate": "",
                    "judgementDescription": "",
                    "courtName": "High Court of Gauhati",
                    "courtType": "High Court",
                    "courtNumber": "0",
                    "courtNumberAndJudge": "",
                    "district": "",
                    "state": "Assam",
                    "stateCode": "6",
                    "distCode": "0",
                    "registrationNumber": "",
                    "filingNumber": "",
                    "filingDate": "",
                    "hearingDate": "",
                    "natureOfDisposal": "",
                    "firNumber": "",
                    "firLink": "",
                    "gfcFirNumberCourt": "",
                    "gfcFirYearCourt": "",
                    "gfcFirPoliceStationCourt": "",
                    "underAct": "",
                    "underSection": "",
                    "petitioner": "SMTI MEGHNA AGARWAL @ SAUMYA AGARWAL...",
                    "respondent": "SRI PRAVEEN AGARWAL...",
                    "petitionerAddress": "",
                    "respondentAddress": "",
                    "suitFiledAmount": "",
                    "gfcUpdatedAt": "25th May 2023",
                    "createdAtGfc": "19th May 2023",
                    "fuzzyNameScore": 0.48,
                    "gfcPetitioners": [
                        {
                            "name": "SMTI MEGHNA AGARWAL @ SAUMYA AGARWAL wifeof  SRI PRAVEEN AGARWAL AT PRESENT",
                            "address": "C/O SRI MAHABIR PRASAD BUKALSARIA, NEAR JAIN MANDIR, NEW MARKET, DIBRUGARH, DIST. DIBRUGARH, ASSAM"
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "SRI PRAVEEN AGARWAL sonof  SRI JUGAL KISHORE AGARWAL, BY CASTE HINDU, BY PROFESSION BUSINESSMAN",
                            "address": "HAIBARGAON, OID A.T. ROAD, MOUZA NAGAON TOWN..."
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/Tr_P__C___5_2008/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": []
                },
                {
                    "id": "uuid-case-6",
                    "caseNo": "205901012952014",
                    "caseName": "SUMMARY CIVIL SUIT/101295/2014",
                    "caseTypeName": "SUMMARY CIVIL SUIT",
                    "caseTypeNumber": "59",
                    "caseType": "Civil",
                    "caseStatus": "Pending",
                    "cnrNumber": "MHCC010078382014",
                    "caseRegDate": "11-08-2014",
                    "caseLink": "https://services.ecourts.gov.in/ecourtindia_v6/",
                    "caseYear": "2014",
                    "bench": "",
                    "crawlingDate": "2022-03-19T04:20:38.000Z",
                    "judgementDate": "",
                    "judgementDescription": "",
                    "courtName": "City Civil Court, Mumbai",
                    "courtType": "District Court",
                    "courtNumber": "1",
                    "courtNumberAndJudge": "56-COURT 56 ADDITIONAL SESSIONS JUDGE",
                    "district": "Mumbai City Civil Court",
                    "state": "Maharashtra",
                    "stateCode": "1",
                    "distCode": "37",
                    "registrationNumber": "101295/2014",
                    "filingNumber": "108387/2014",
                    "filingDate": "25-07-2014",
                    "hearingDate": "",
                    "natureOfDisposal": "",
                    "firNumber": "",
                    "firLink": "",
                    "gfcFirNumberCourt": "",
                    "gfcFirYearCourt": "",
                    "gfcFirPoliceStationCourt": "",
                    "underAct": "C.P.C.- Non-Interlocutory Order",
                    "underSection": "9",
                    "petitioner": "MS M. DARUWALLA AND SON",
                    "respondent": "1.SANJAY KEDIA 2. MEGHNA SANJAY KEDIA 3. MR. PERCY KUTAR",
                    "petitionerAddress": "1) MS M. DARUWALLA AND SON    Address  - 530 A, ARVIND NIWAS, ROOM NO.4, SANDHURST BRIDGE, OPERA HOUSE, MUMBAI-400007    Advocate- PRASAD L. GAJBHIYE, Rajiv A Jadhav",
                    "respondentAddress": "1) 1.SANJAY KEDIA 2. MEGHNA SANJAY KEDIA 3. MR. PERCY KUTAR    Address - 1ST TWO ARE AT, 4401, C BELLISIOMO, MAHALAXMI, MUMBAI...",
                    "suitFiledAmount": "",
                    "gfcUpdatedAt": "3rd May 2023",
                    "createdAtGfc": "2nd October 2023",
                    "fuzzyNameScore": 0.0,
                    "gfcPetitioners": [
                        {
                            "name": "MS M. DARUWALLA AND SON",
                            "address": "530 A, ARVIND NIWAS, ROOM NO.4, SANDHURST BRIDGE, OPERA HOUSE, MUMBAI-400007"
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "1.SANJAY KEDIA 2. MEGHNA SANJAY KEDIA 3. MR. PERCY KUTAR",
                            "address": "1ST TWO ARE AT, 4401, C BELLISIOMO, MAHALAXMI, MUMBAI..."
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/205901012952014/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": []
                },
                {
                    "id": "uuid-case-7",
                    "caseNo": "202100121012018",
                    "caseName": "Cr. Case/12101/2018",
                    "caseTypeName": "Cr. Case",
                    "caseTypeNumber": "21",
                    "caseType": "Criminal",
                    "caseStatus": "Disposed",
                    "cnrNumber": "DLCT020283712018",
                    "caseRegDate": "10-09-2018",
                    "caseLink": "https://services.ecourts.gov.in/ecourtindia_v6/",
                    "caseYear": "2018",
                    "bench": "",
                    "crawlingDate": "2019-11-24T10:21:07.000Z",
                    "judgementDate": "",
                    "judgementDescription": "",
                    "courtName": "Chief Metropolitan Magistrate, Central, THC",
                    "courtType": "District Court",
                    "courtNumber": "2",
                    "courtNumberAndJudge": "591-Metropolitan Magistrate",
                    "district": "Central",
                    "state": "Delhi",
                    "stateCode": "26",
                    "distCode": "8",
                    "registrationNumber": "12101/2018",
                    "filingNumber": "28292/2018",
                    "filingDate": "10-09-2018",
                    "hearingDate": "04th October 2018",
                    "natureOfDisposal": "Uncontested--PLEAD GUILTY",
                    "firNumber": "",
                    "firLink": "",
                    "gfcFirNumberCourt": "",
                    "gfcFirYearCourt": "",
                    "gfcFirPoliceStationCourt": "",
                    "underAct": "IPC",
                    "underSection": "380",
                    "petitioner": "STATE",
                    "respondent": "GURPREET SINGH OBEROI",
                    "petitionerAddress": "1) STATE2)  MEGHNA KHATURIA    R/O C-210, HOSTEL II, IIT BOMBAY POWEI MUMBAI - 400076",
                    "respondentAddress": "1) GURPREET SINGH OBEROI",
                    "suitFiledAmount": "",
                    "gfcUpdatedAt": "5th January 2023",
                    "createdAtGfc": "10th February 2023",
                    "fuzzyNameScore": 0.58,
                    "gfcPetitioners": [
                        {
                            "name": "STATE",
                            "address": null
                        },
                        {
                            "name": "MEGHNA KHATURIA",
                            "address": "r/o c-210, hostel ii, iit bombay powei mumbai - 400076"
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "GURPREET SINGH OBEROI",
                            "address": null
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/202100121012018/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": [
                        {
                            "order": "COPY OF ORDER",
                            "gfcOrderType": "Order",
                            "orderDate": "2019-05-17",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/202100121012018/order-0.pdf?X-Amz-Expires=3600..."
                        },
                        {
                            "order": "COPY OF ORDER",
                            "gfcOrderType": "Order",
                            "orderDate": "2019-01-30",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/202100121012018/order-1.pdf?X-Amz-Expires=3600..."
                        },
                        {
                            "order": "COPY OF ORDER",
                            "gfcOrderType": "Order",
                            "orderDate": "2018-10-04",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/202100121012018/order-2.pdf?X-Amz-Expires=3600..."
                        }
                    ]
                },
                {
                    "id": "uuid-case-8",
                    "caseNo": "200300003662011",
                    "caseName": "CMA DC/366/2011",
                    "caseTypeName": "CMA DC",
                    "caseTypeNumber": "3",
                    "caseType": "Civil",
                    "caseStatus": "Disposed",
                    "cnrNumber": "GJAH020003662011",
                    "caseRegDate": "04-05-2011",
                    "caseYear": "2011",
                    "courtName": "CITY CIVIL AND SESSIONS COURT, AHMEDABAD",
                    "courtType": "District Court",
                    "district": "Ahmedabad",
                    "state": "Gujarat",
                    "underAct": "",
                    "underSection": "",
                    "natureOfDisposal": "Contested--JUDGEMENT",
                    "fuzzyNameScore": 0.0,
                    "gfcPetitioners": [
                        {
                            "name": "JIGNESH KIRITKUMAR CAGNDHI",
                            "address": "B-605, SURYA PLAZA, UDHNA MAGDALA, ROAD, SURAT, ,SURAT"
                        },
                        {
                            "name": "MEGHNA JIGNESH GANDHI",
                            "address": "B-605, SURYA PLAZA, UDHNA MAGDALA, ROAD, SURAT, ,SURAT"
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "MIISSIONARIES OF CHARITY",
                            "address": "OFFICE AT BHIMJIPURA NAVA WADAJ, AHMEDABAD,AHMEDABAD"
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/200300003662011/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": []
                },
                {
                    "id": "uuid-case-9",
                    "caseNo": "CRP728/2016",
                    "caseName": "",
                    "caseTypeName": "CRP - CIVIL REVISION PETITION",
                    "caseTypeNumber": "",
                    "caseType": "Civil",
                    "caseStatus": "Pending",
                    "cnrNumber": "",
                    "caseRegDate": "09-02-2016",
                    "caseYear": "2016",
                    "courtName": "High Court of Andhra Pradesh",
                    "courtType": "High Court",
                    "state": "Andhra Pradesh",
                    "fuzzyNameScore": 0.0,
                    "gfcPetitioners": [
                        {
                            "name": "ANAND GANDHI ",
                            "address": null
                        }
                    ],
                    "gfcRespondents": [
                        {
                            "name": "MRS. MEGHNA GANDHI ",
                            "address": null
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/CRP728_2016/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": []
                },
                {
                    "id": "uuid-case-10",
                    "caseNo": "WP/17906/2021",
                    "caseName": "",
                    "caseTypeName": "WP(WRIT PETITION)",
                    "caseTypeNumber": "",
                    "caseType": "",
                    "caseStatus": "Pending",
                    "cnrNumber": "",
                    "caseRegDate": "31/07/2021",
                    "caseYear": "2021",
                    "courtName": "High Court of Telangana",
                    "courtType": "High Court",
                    "state": "Telangana",
                    "fuzzyNameScore": 0.0,
                    "gfcPetitioners": [
                        {
                            "name": "Navya Naveli Rai daughterof  Priya Naveen Age Mejor Occ Student",
                            "address": "R/o  63166/214 flat no 214 Laxminarayana Villa Shivrampally roads Opp Aramghar and pillar no 321 Hyderabad 500052"
                        },
                        {
                            "name": "Meghna Patra daughterof  Prasanta Kumar Patra Age Mejor OCC Student R/Gandhi Nagar 2nd lane Shree Ganesh appartments 2nd floor Berhampur Ganjam Odisha 760001",
                            "address": null
                        },
                        {
                            "name": "Meghna Boorugu daughterof  Naresh Boorugu Age Mejor OCC Student",
                            "address": "R/o  1102/4 Boorugu vihar Lane Beside Andhra Bank Begumpet Hyderabad 500016"
                        }
                        // ... remaining 26 petitioners
                    ],
                    "gfcRespondents": [
                        {
                            "name": "The Government of Telangana - Rep by its Principal Secretary Higher Education Secretariat Buildings Hyderabad ",
                            "address": null
                        },
                        {
                            "name": "The Comissioner - Higher Education for the State of Telangana Vidya Bhavan Nampally Hyderabad ",
                            "address": null
                        },
                        {
                            "name": "University Grants Commission - Bahadur Shah Zafar Marg New Delhi110002 ",
                            "address": null
                        },
                        {
                            "name": "South Central Regional Office - All India Counsel for Technical Education...",
                            "address": null
                        },
                        {
                            "name": "Woxsen University - Kamkole Sadasivpet Sangareedy District Telangana502345 ",
                            "address": null
                        }
                    ],
                    "gfcOrdersData": {
                        "petitioners": [],
                        "respondents": []
                    },
                    "caseDetailsPdfUrl": "https://s3.presigned.url/criminal-checks/550e8400/WP_17906_2021/case-details.pdf?X-Amz-Expires=3600...",
                    "caseFlow": [
                        {
                            "order": "Spl Cell Orders",
                            "gfcOrderType": "Order",
                            "orderDate": "2021-11-23",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/WP_17906_2021/order-0.pdf?X-Amz-Expires=3600..."
                        },
                        {
                            "order": "Spl Cell Orders",
                            "gfcOrderType": "Order",
                            "orderDate": "2021-11-19",
                            "orderLinkUrl": "https://s3.presigned.url/criminal-checks/550e8400/WP_17906_2021/order-1.pdf?X-Amz-Expires=3600..."
                        }
                    ]
                }
            ]
        }
    }
;

export default CriminalCheck;
