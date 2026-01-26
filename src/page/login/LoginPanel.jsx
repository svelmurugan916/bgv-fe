import React from 'react';
import { Mail, Lock, ShieldAlert, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const LoginPanel = ({ email, setEmail, password, setPassword, fieldErrors, setFieldErrors, error, isLoading, onSubmit }) => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to access your dashboard.</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in shake">
                <ShieldAlert size={20} />
                <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Work Email</label>
                <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.email ? 'text-red-400' : 'text-slate-300 group-focus-within:text-[#5D4591]'}`} size={18} />
                    <input
                        type="text" value={email}
                        onChange={(e) => { setEmail(e.target.value); if(fieldErrors.email) setFieldErrors({...fieldErrors, email: ''}); }}
                        placeholder="name@company.com"
                        className={`w-full pl-12 pr-4 py-4 bg-white border rounded-xl outline-none transition-all font-medium ${fieldErrors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/10'}`}
                    />
                </div>
                {fieldErrors.email && <div className="flex items-center gap-1.5 mt-2 text-red-500 text-[10px] font-bold uppercase"><AlertCircle size={14} /> {fieldErrors.email}</div>}
            </div>

            <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
                <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.password ? 'text-red-400' : 'text-slate-300 group-focus-within:text-[#5D4591]'}`} size={18} />
                    <input
                        type="password" value={password}
                        onChange={(e) => { setPassword(e.target.value); if(fieldErrors.password) setFieldErrors({...fieldErrors, password: ''}); }}
                        placeholder="••••••••"
                        className={`w-full pl-12 pr-4 py-4 bg-white border rounded-xl outline-none transition-all font-medium ${fieldErrors.password ? 'border-red-500 bg-red-50/30' : 'border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/10'}`}
                    />
                </div>
                <div className="text-right mt-2"><a href="#" className="text-[11px] font-bold text-[#5D4591] uppercase hover:underline">Forgot Password?</a></div>
                {fieldErrors.password && <div className="flex items-center gap-1.5 mt-2 text-red-500 text-[10px] font-bold uppercase"><AlertCircle size={14} /> {fieldErrors.password}</div>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#5D4591] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#5D4591]/10 flex items-center justify-center gap-3 hover:bg-[#4a3675] active:scale-[0.98] transition-all disabled:opacity-80">
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : <><span className="ml-4">Secure Login</span><ArrowRight size={18} /></>}
            </button>
        </form>
    </div>
);

export default LoginPanel;
