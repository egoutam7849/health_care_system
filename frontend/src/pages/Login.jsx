import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Activity, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('admin@healthflow.ai');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Authenticating JWT session...');

    try {
      const data = await authAPI.login(email, password);
      toast.dismiss();
      toast.success(`Welcome back, ${data.user_name}!`);
      login(
        { name: data.user_name, email: data.user_email, role: data.role },
        data.access_token
      );
      navigate('/');
    } catch (err) {
      toast.dismiss();
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-health-950 to-slate-900 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glass Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-health-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-tealAccent-500/20 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
        {/* Healthcare Platform Brand Hero Section */}
        <div className="space-y-6 hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-health-500 to-tealAccent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-health-500/30">
              <Activity className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                HealthFlow AI
              </h1>
              <span className="text-xs text-tealAccent-400 font-semibold tracking-wider uppercase">Enterprise Healthcare Platform</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Enterprise Healthcare Data Engineering & Analytics Platform featuring Medallion Architecture (Bronze → Silver → Gold), PySpark Data Cleaning, Airflow DAG Orchestration, and Data Quality Validation.
          </p>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Medallion ETL Processing Engine</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automated Data Quality & Schema Checks</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Executive Hospital & Epidemiological Dashboards</span>
            </div>
          </div>
        </div>

        {/* Login Form Glass Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl bg-slate-900/80 backdrop-blur-xl space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Sign In to HealthFlow</h2>
            <p className="text-xs text-slate-400">Enter your credentials to access the analytics workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:border-health-500 focus:outline-none"
                  placeholder="admin@healthflow.ai"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:border-health-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-health-500 rounded"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('Contact system administrator for password resets.'); }} className="text-health-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-health-600 to-tealAccent-600 text-white font-bold text-sm rounded-xl hover:opacity-95 shadow-lg shadow-health-500/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with JWT'}
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-400 border-t border-slate-800 pt-4">
            <span>Demo Admin Credentials: </span>
            <span className="font-mono text-tealAccent-400 font-bold">admin@healthflow.ai</span> / <span className="font-mono text-tealAccent-400 font-bold">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
