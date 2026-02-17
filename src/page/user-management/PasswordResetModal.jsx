import { motion, AnimatePresence } from "framer-motion";
import {Edit2, Loader2, MailIcon, XIcon} from "lucide-react";


const PasswordResetModal = ({showResetModal, setShowResetModal, setResetStep, resetStep,
                                handleEmailReset, handleManualReset, newPassword, generatePassword, setNewPassword, isResetting, user }) => {
    return (
        <AnimatePresence>
            {showResetModal && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 max-w-md w-full"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Reset Password</h3>
                                <p className="text-slate-500 text-xs">Choose how you'd like to reset the credentials.</p>
                            </div>
                            <button onClick={() => { setShowResetModal(false); setResetStep('choice'); }} className="text-slate-400 hover:text-slate-600">
                                <XIcon size={20} />
                            </button>
                        </div>

                        {/* STEP 1: CHOICE */}
                        {resetStep === 'choice' && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => setResetStep('email')}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-50 hover:border-[#5D4591] hover:bg-[#F9F7FF] transition-all flex items-center gap-4 group text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-[#5D4591] transition-colors">
                                        <MailIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Send Reset Email</p>
                                        <p className="text-[10px] text-slate-400">User will receive a secure link via email.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setResetStep('manual')}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-50 hover:border-[#5D4591] hover:bg-[#F9F7FF] transition-all flex items-center gap-4 group text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-[#5D4591] transition-colors">
                                        <Edit2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Set Manually</p>
                                        <p className="text-[10px] text-slate-400">Create a password or generate a random one.</p>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* STEP 2: MANUAL INPUT */}
                        {resetStep === 'manual' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="relative">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-[#5D4591] transition-all"
                                            placeholder="Type or generate..."
                                        />
                                        <button
                                            onClick={generatePassword}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-[#5D4591] hover:bg-[#5D4591] hover:text-white px-2 py-1 rounded-lg transition-all"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setResetStep('choice')} className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600">Back</button>
                                    <button
                                        onClick={handleManualReset}
                                        disabled={!newPassword || isResetting}
                                        className="flex-1 py-3 bg-[#5D4591] rounded-xl text-xs font-bold text-white shadow-lg shadow-[#5D4591]/20 hover:opacity-90 transition-all"
                                    >
                                        {isResetting ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: EMAIL CONFIRMATION */}
                        {resetStep === 'email' && (
                            <div className="text-center py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MailIcon size={32} />
                                </div>
                                <p className="text-sm text-slate-600 mb-8">
                                    Send a password reset link to <br/>
                                    <span className="font-bold text-slate-800">{user?.email}</span>?
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setResetStep('choice')} className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600">Back</button>
                                    <button
                                        onClick={handleEmailReset}
                                        disabled={isResetting}
                                        className="flex-1 py-3 bg-[#5D4591] rounded-xl text-xs font-bold text-white shadow-lg shadow-[#5D4591]/20 hover:opacity-90 transition-all"
                                    >
                                        {isResetting ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Send Email'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PasswordResetModal;