import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@healthflow.ai');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Authenticating Administrator JWT Credentials...');

    try {
      const data = await authAPI.loginAdmin(email, password);
      login(data);
      toast.dismiss();
      toast.success(`Welcome back, ${data.user?.name || 'Admin'}!`);
      const targetUrl = data.redirect_url || '/admin/dashboard';
      navigate(targetUrl, { replace: true });
    } catch (err) {
      toast.dismiss();
      toast.error('Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

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
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">System Admin & Engineering Portal</h2>
            <p className="text-xs text-slate-400">Full access to Medallion ETL, Airflow, Monitoring & Star Schema Warehouse</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium focus:border-blue-500 focus:outline-none"
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
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-xs text-white rounded-xl hover:opacity-95 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
            >
              <span>Authenticate Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
