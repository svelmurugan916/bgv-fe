import React, { lazy, Suspense } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import TopBarLoader from "./component/common/TopBarLoader.jsx";
import {VERIFY_ADDRESS_TOKEN, VERIFY_CANDIDATE_TOKEN} from "./constant/Endpoint.tsx";




// --- LAZY IMPORTS ---
const BGVForm = lazy(() => import("./page/bgv-form/BGVForm.jsx"));
const DashboardContent = lazy(() => import("./component/dashboard/DashboardContent.jsx"));
const MainLayout = lazy(() => import("./MainLayout.jsx"));
const Candidates = lazy(() => import("./component/candidate/Candidates.jsx"));
const OperationsDashboard = lazy(() => import("./component/dashboard/OperationsDashboard.jsx"));
const AddressVerificationForm = lazy(() => import("./page/address-verification/AddressVerificationForm.jsx"));
const BulkCreateCandidates = lazy(() => import("./component/candidate/BulkCreateCandidates.jsx"));
const CandidateDetails = lazy(() => import("./component/candidate/CandidateDetails.jsx"));
const LoginPage = lazy(() => import("./page/login/LoginPage.jsx"));
const AdminDashboard = lazy(() => import("./component/dashboard/AdminDashboard.jsx"));
const DashboardPage = lazy(() => import("./component/dashboard/DashboardPage.jsx"));
const ProtectedRoute = lazy(() => import("./component/routes/ProtectedRoute.jsx"));
const RoleSelectionPage = lazy(() => import("./component/pre-auth/RoleSelectionPage.jsx"));
const TokenVerifier = lazy(() => import("./page/bgv-form/CandidateTokenVerifier.jsx"));
const OrganizationDashboard = lazy(() => import("./component/dashboard/organization/OrganizationDashboard.jsx"));
const CreateOrganization = lazy(() => import("./page/organization/CreateOrganization.jsx"));
const ReportGenerator = lazy(() => import("./component/report/ReportGenerator.jsx"));
const OrganizationDetail = lazy(() => import("./page/organization/OrganizationDetail.jsx"));
const OrganizationCases = lazy(() => import("./component/candidate/OrganizationCases.jsx"));
const PendingInvitations = lazy(() => import("./component/candidate/pending-invitation/PendingInvitations.jsx"));
const CaseAssignmentPage = lazy(() => import("./page/case-assignment/CaseAssignmentPage.jsx"));

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function App() {
    return (
        <GoogleReCaptchaProvider
            siteKey={RECAPTCHA_SITE_KEY}
            scriptProps={{ async: true, defer: true, appendTo: 'head' }} reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-700">
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 overflow-y-auto">
                        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
                            <div className={`flex-grow`}>
                                <Suspense fallback={<TopBarLoader />}>
                                    <Routes>
                                        <Route path="/login" element={<LoginPage />} />
                                        {/*<Route path="/fill-candidate-form/:token?" element={<TokenVerifier />} />*/}
                                        <Route
                                            path="/fill-candidate-form/:token?"
                                            element={
                                                <TokenVerifier
                                                    TargetForm={BGVForm}
                                                    endpoint={VERIFY_CANDIDATE_TOKEN}
                                                    successMessage="Preparing your verification form..."
                                                />
                                            }
                                        />

                                        <Route
                                            path="/address-verification-form/:token?"
                                            element={
                                                <TokenVerifier
                                                    TargetForm={AddressVerificationForm}
                                                    endpoint={VERIFY_ADDRESS_TOKEN}
                                                    loadingSubtext="Validating Address Link..."
                                                    successMessage="Preparing Digital Address Check..."
                                                />
                                            }
                                        />
                                        {/*<Route path="/address-verification/:token?" element={<AddressVerificationForm />} />*/}

                                        <Route element={<ProtectedRoute />}>
                                            <Route path="/select-role" element={<RoleSelectionPage />} />
                                        </Route>

                                        {/* --- DASHBOARD ROUTES --- */}
                                        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_OPERATIONS_MANAGER']} />}>
                                            <Route element={<MainLayout />}>
                                                <Route path="/dashboard" element={<DashboardPage />} />
                                                <Route path="/organisation-dashboard" element={<OrganizationDashboard />} />
                                                <Route path="/organisation-dashboard/organisation-form/:id?" element={<CreateOrganization />} />
                                                <Route path="/organisation-dashboard/organisation-details/:id?" element={<OrganizationDetail />} />
                                                <Route path="/organisation-dashboard/organisation-cases/:id?" element={<OrganizationCases />} />
                                                <Route path="/case-assignment" element={<CaseAssignmentPage />} />

                                                <Route path="/candidate/pending-invitation/:id?" element={<PendingInvitations />} />


                                                <Route path="/ops-dashboard" element={<OperationsDashboard />} />
                                                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                                                <Route path="/candidate-list" element={<Candidates />} />
                                                <Route path="/add-candidate" element={<BulkCreateCandidates />} />
                                                <Route path="/candidate-details/:id?" element={<CandidateDetails />} />
                                                <Route path="/dddd" element={<DashboardContent />} />
                                                <Route path="/report" element={<ReportGenerator />} />
                                                <Route path="/reports" element={<div>Reports Page</div>} />
                                                <Route path="/settings" element={<div>Settings Page</div>} />
                                            </Route>
                                        </Route>
                                    </Routes>
                                </Suspense>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </GoogleReCaptchaProvider>
    )
}

export default App;
