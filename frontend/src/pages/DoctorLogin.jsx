import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const DoctorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('doctor123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Authenticating Physician Credentials...');

    try {
      const data = await authAPI.loginDoctor(email, password);
      login(data);
      toast.dismiss();
      toast.success(`Welcome back, ${data.user?.name || 'Doctor'}!`);
      const targetUrl = data.redirect_url || '/doctor/dashboard';
      navigate(targetUrl, { replace: true });
    } catch (err) {
      toast.dismiss();
      toast.error('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal Selector</span>
        </button>

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center shadow-inner">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Physician & Doctor Portal</h2>
            <p className="text-xs text-slate-400">Manage daily patient appointments, lab results, diagnoses & e-prescriptions</p>
          </div>

          <div className="flex gap-2 justify-center pb-2">
            <button
              type="button"
              onClick={() => setEmail('john.smith@healthflow.ai')}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${email === 'john.smith@healthflow.ai' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
            >
              Dr. John Smith
            </button>
            <button
              type="button"
              onClick={() => setEmail('e.rostova@jhmi.edu')}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${email === 'e.rostova@jhmi.edu' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
            >
              Dr. Elena Rostova
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Doctor Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 font-bold text-xs text-white rounded-xl hover:opacity-95 shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2"
            >
              <span>Access Physician Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
