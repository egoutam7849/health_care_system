import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Lock, Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const AnalystLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('marcus.vance@analytics.org');
  const [password, setPassword] = useState('analyst123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Authenticating Analyst Credentials...');

    try {
      const data = await authAPI.loginAnalyst(email, password);
      login(data);
      toast.dismiss();
      toast.success(`Welcome back, ${data.user?.name || 'Analyst'}!`);
      const targetUrl = data.redirect_url || '/analytics/dashboard';
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
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />

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
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Healthcare Analyst Portal</h2>
            <p className="text-xs text-slate-400">Query Gold layer aggregations, AI Summaries & Warehouse reports</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Analyst Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium focus:border-amber-500 focus:outline-none"
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
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-xs text-white rounded-xl hover:opacity-95 shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              <span>Access Analytics Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
