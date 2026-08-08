import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Phone, Mail, MapPin, Heart, Shield, Stethoscope,
  Building2, AlertCircle, Edit3, Save, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PatientProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'patient@healthflow.ai',
    phone: '+1 (555) 234-5678',
    dob: '1985-04-12',
    gender: 'Female',
    blood_group: 'O+',
    address: '742 Evergreen Terrace, Springfield, IL',
    emergency_contact: 'Mark Doe (+1 555-987-6543) - Spouse',
    insurance_provider: 'BlueCross BlueShield',
    policy_number: 'BCB-2026-44821',
    allergies: 'Penicillin, Peanuts',
    medical_conditions: 'Essential Hypertension, Mild Asthma',
    assigned_doctor: 'Dr. John Smith (Cardiology)',
    preferred_hospital: 'Metro General Hospital'
  });

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile information updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header / Hero */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-dark-section flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/30">
            {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-txt-primary">{formData.name}</h1>
              <span className="px-2 py-0.5 bg-emerald-500/15 text-accent-emerald text-[10px] font-mono font-bold rounded-full border border-emerald-500/20">
                {user?.patient_id || 'PAT-001'}
              </span>
            </div>
            <p className="text-xs text-txt-muted mt-1">{formData.email} • {formData.phone}</p>
          </div>
        </div>

        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            editing
              ? 'bg-accent-emerald text-white shadow-lg shadow-emerald-500/20'
              : 'bg-dark-card border border-white/[0.08] text-txt-muted hover:text-txt-primary'
          }`}
        >
          {editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {editing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <User className="w-4 h-4 text-accent-emerald" />
            <h2 className="font-black text-sm text-txt-primary">Personal Details</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Date of Birth</label>
              {editing ? (
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full mt-1 p-2 bg-dark-card border border-white/[0.08] rounded-lg text-txt-primary"
                />
              ) : (
                <span className="font-bold text-txt-primary">{formData.dob}</span>
              )}
            </div>
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Gender</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full mt-1 p-2 bg-dark-card border border-white/[0.08] rounded-lg text-txt-primary"
                />
              ) : (
                <span className="font-bold text-txt-primary">{formData.gender}</span>
              )}
            </div>
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Blood Group</label>
              <span className="font-black text-accent-emerald bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-0.5">
                {formData.blood_group}
              </span>
            </div>
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Address</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full mt-1 p-2 bg-dark-card border border-white/[0.08] rounded-lg text-txt-primary"
                />
              ) : (
                <span className="font-bold text-txt-secondary">{formData.address}</span>
              )}
            </div>
          </div>
        </div>

        {/* Emergency & Insurance */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Shield className="w-4 h-4 text-accent-blue" />
            <h2 className="font-black text-sm text-txt-primary">Emergency & Insurance</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Emergency Contact</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={e => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full mt-1 p-2 bg-dark-card border border-white/[0.08] rounded-lg text-txt-primary"
                />
              ) : (
                <span className="font-bold text-txt-primary">{formData.emergency_contact}</span>
              )}
            </div>
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Insurance Provider</label>
              <span className="font-bold text-accent-blue">{formData.insurance_provider}</span>
            </div>
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Policy Number</label>
              <span className="font-mono text-txt-secondary">{formData.policy_number}</span>
            </div>
          </div>
        </div>

        {/* Clinical Overview */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Heart className="w-4 h-4 text-accent-red" />
            <h2 className="font-black text-sm text-txt-primary">Clinical Overview</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Known Allergies</label>
              <span className="font-bold text-accent-red bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block mt-0.5">
                {formData.allergies}
              </span>
            </div>
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Pre-existing Conditions</label>
              <span className="font-bold text-txt-secondary">{formData.medical_conditions}</span>
            </div>
          </div>
        </div>

        {/* Primary Care Team */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Stethoscope className="w-4 h-4 text-accent-teal" />
            <h2 className="font-black text-sm text-txt-primary">Care Team</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Assigned Doctor</label>
              <span className="font-bold text-txt-primary">{formData.assigned_doctor}</span>
            </div>
            <div>
              <label className="text-[10px] text-txt-muted font-bold block">Preferred Facility</label>
              <span className="font-bold text-txt-primary">{formData.preferred_hospital}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
