import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings, Bell, Lock, Globe, ShieldAlert, Key, Save, Moon
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PatientSettings = () => {
  const { logout } = useAuth();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSave = () => {
    toast.success('Settings updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      toast.error('Please complete both password fields');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div>
        <h1 className="text-xl font-black text-txt-primary">Settings</h1>
        <p className="text-xs text-txt-muted mt-0.5">Manage your notification preferences and account security</p>
      </div>

      {/* Notifications Preferences */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Bell className="w-4 h-4 text-accent-emerald" />
          <h2 className="font-black text-sm text-txt-primary">Notifications</h2>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Email Notifications', sub: 'Receive lab results and billing updates via email', state: emailNotif, set: setEmailNotif },
            { label: 'SMS Notifications', sub: 'Receive urgent appointment alerts on your phone', state: smsNotif, set: setSmsNotif },
            { label: 'Appointment Reminders', sub: 'Get automated reminders 24h before scheduled visits', state: appointmentReminders, set: setAppointmentReminders },
          ].map(({ label, sub, state, set }) => (
            <div key={label} className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-bold text-txt-primary">{label}</div>
                <div className="text-[10px] text-txt-muted">{sub}</div>
              </div>
              <button
                onClick={() => { set(!state); handleSave(); }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  state ? 'bg-accent-emerald' : 'bg-dark-card'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${state ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Security */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Key className="w-4 h-4 text-accent-blue" />
          <h2 className="font-black text-sm text-txt-primary">Security</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <div>
            <label className="text-[10px] text-txt-muted font-bold block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPass}
              onChange={e => setCurrentPass(e.target.value)}
              className="w-full px-3 py-2 bg-dark-card border border-white/[0.08] rounded-xl text-xs text-txt-primary focus:outline-none focus:border-accent-emerald/50"
            />
          </div>
          <div>
            <label className="text-[10px] text-txt-muted font-bold block mb-1">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              className="w-full px-3 py-2 bg-dark-card border border-white/[0.08] rounded-xl text-xs text-txt-primary focus:outline-none focus:border-accent-emerald/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-accent-blue text-white rounded-xl font-bold text-xs hover:opacity-90 transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent-red" />
          <h2 className="font-black text-sm text-accent-red">Account Session</h2>
        </div>
        <p className="text-xs text-txt-muted">Sign out of your active Patient Portal session.</p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-500/20 text-accent-red border border-rose-500/30 rounded-xl font-bold text-xs hover:bg-accent-red hover:text-white transition-colors"
        >
          Sign Out Now
        </button>
      </div>
    </div>
  );
};

export default PatientSettings;
