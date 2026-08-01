import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Building2, UserPlus, Edit, Trash2, 
  Mail, Phone, Clock, FileText, Activity, Users, Star, 
  MoreHorizontal, Eye
} from 'lucide-react';
import { entitiesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { SlideOverPanel } from '../components/common/SlideOverPanel';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState('view');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    doc_id: '', name: '', email: '', phone: '',
    qualification: 'MD, MBBS', specialization: 'Cardiology',
    experience_years: 5, department: 'Cardiology',
    hospital_name: 'Metro General Hospital', consultation_fee: 150.0,
    available_days: 'Mon, Tue, Wed, Thu, Fri', available_time: '09:00 AM - 05:00 PM',
    status: 'Active', biography: '', patients_assigned: 0,
    success_rate: 98.0, total_patients: 120
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await entitiesAPI.getDoctors({ search: search || undefined, specialization: specFilter || undefined });
      setDoctors(data);
    } catch (err) {
      toast.error('Failed to load doctors list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, [search, specFilter]);

  const handleOpenAdd = () => {
    setFormData({ ...initialForm, doc_id: `DOC-${Math.floor(100 + Math.random() * 900)}` });
    setPanelMode('add');
    setIsPanelOpen(true);
  };

  const handleOpenView = (doc) => {
    setSelectedDoc(doc);
    setPanelMode('view');
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setSelectedDoc(doc);
    setFormData({ ...doc });
    setPanelMode('edit');
    setIsPanelOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading(panelMode === 'edit' ? 'Updating Doctor Profile...' : 'Provisioning Doctor...');
    try {
      if (panelMode === 'edit') {
        await entitiesAPI.updateDoctor(selectedDoc.id, { ...formData });
        toast.success('Doctor details updated successfully', { id: tid });
      } else {
        await entitiesAPI.createDoctor({ ...formData });
        toast.success('New Doctor onboarded successfully', { id: tid });
      }
      setIsPanelOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error('Operation failed', { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to remove ${doc.name}?`)) return;
    const tid = toast.loading('Removing doctor record...');
    try {
      await entitiesAPI.deleteDoctor(doc.id);
      toast.success('Doctor record deleted', { id: tid });
      fetchDoctors();
    } catch (err) {
      toast.error('Failed to remove doctor', { id: tid });
    }
  };

  const activeCount = doctors.filter(d => d.status === 'Active').length;
  const avgExp = Math.round(doctors.reduce((acc, d) => acc + (d.experience_years || 0), 0) / (doctors.length || 1));
  const stats = [
    { label: 'Total Doctors', value: doctors.length },
    { label: 'Active Roster', value: activeCount, trend: '98%', trendColor: 'text-accent-emerald' },
    { label: 'Avg Experience', value: `${avgExp} Yrs` },
    { label: 'Network Hospitals', value: new Set(doctors.map(d => d.hospital_name)).size },
  ];

  const columns = [
    { 
      label: 'Doctor Profile', 
      key: 'name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            {row.name.split(' ')[1]?.[0] || row.name[0]}
          </div>
          <div>
            <div className="font-bold text-txt-primary">{row.name}</div>
            <div className="text-[10px] font-mono text-txt-muted">{row.doc_id} • {row.qualification}</div>
          </div>
        </div>
      )
    },
    { 
      label: 'Specialization', 
      key: 'specialization',
      render: (row) => (
        <Badge variant="blue">{row.specialization}</Badge>
      )
    },
    { 
      label: 'Hospital Affiliation', 
      key: 'hospital_name',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-txt-secondary">
          <Building2 className="w-3.5 h-3.5 text-accent-blue" />
          <span className="truncate max-w-[150px]">{row.hospital_name}</span>
        </div>
      )
    },
    { 
      label: 'Performance', 
      key: 'performance',
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-txt-primary text-[11px] font-bold">
            <Activity className="w-3.5 h-3.5 text-accent-emerald" />
            {row.success_rate}% Success
          </div>
          <div className="text-[10px] text-txt-muted">{row.experience_years} Years Exp</div>
        </div>
      )
    },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'emerald' : 'amber'}>
          {row.status}
        </Badge>
      )
    },
    {
      label: '',
      key: 'actions',
      tdClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => handleOpenView(row)} className="p-1.5 text-txt-muted hover:text-accent-blue hover:bg-dark-hover rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
          <button onClick={() => handleOpenEdit(row)} className="p-1.5 text-txt-muted hover:text-accent-orange hover:bg-dark-hover rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(row)} className="p-1.5 text-txt-muted hover:text-accent-red hover:bg-dark-hover rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  const specOptions = ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 'Pulmonology', 'Gastroenterology'];

  return (
    <div className="max-w-[1600px] mx-auto pb-12 bg-dark-canvas">
      <PageHeader 
        title="Physicians & Specialists" 
        description="Enterprise medical staff directory, schedule management, and performance analytics synced with PostgreSQL."
        stats={stats}
        actions={[
          { label: 'Export Roster', icon: FileText },
          { label: 'Provision Doctor', icon: UserPlus, primary: true, onClick: handleOpenAdd }
        ]}
      />

      <DataTable 
        columns={columns}
        data={doctors}
        isLoading={loading}
        searchPlaceholder="Search by name, ID, hospital..."
        searchValue={search}
        onSearchChange={setSearch}
        onRowClick={handleOpenView}
        filters={[
          { label: 'Specialization', value: specFilter, onChange: setSpecFilter, options: specOptions }
        ]}
        emptyMessage="No doctors match the current filters."
      />

      {/* SlideOverPanel */}
      <SlideOverPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={panelMode === 'add' ? 'Provision New Doctor' : panelMode === 'edit' ? `Edit ${selectedDoc?.name}` : selectedDoc?.name}
        subtitle={panelMode === 'view' ? `${selectedDoc?.doc_id} • ${selectedDoc?.specialization}` : 'Update PostgreSQL database records'}
        footer={
          panelMode !== 'view' && (
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          )
        }
      >
        {panelMode === 'view' && selectedDoc ? (
          <div className="space-y-8">
            <div className="flex gap-4 items-center border-b border-white/[0.08] pb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/20 shrink-0">
                {selectedDoc.name.split(' ')[1]?.[0] || selectedDoc.name[0]}
              </div>
              <div>
                <div className="text-xl font-black text-txt-primary">{selectedDoc.name}</div>
                <div className="text-sm font-bold text-accent-blue">{selectedDoc.qualification}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={selectedDoc.status === 'Active' ? 'emerald' : 'amber'}>{selectedDoc.status}</Badge>
                  <span className="text-xs text-txt-muted font-mono">{selectedDoc.doc_id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-dark-shell rounded-2xl border border-white/[0.08]">
              <div>
                <div className="text-[10px] text-txt-muted font-bold uppercase">Experience</div>
                <div className="text-lg font-black text-txt-primary">{selectedDoc.experience_years} <span className="text-xs font-semibold text-txt-muted">Yrs</span></div>
              </div>
              <div>
                <div className="text-[10px] text-txt-muted font-bold uppercase">Success Rate</div>
                <div className="text-lg font-black text-accent-emerald">{selectedDoc.success_rate}%</div>
              </div>
              <div>
                <div className="text-[10px] text-txt-muted font-bold uppercase">Patients</div>
                <div className="text-lg font-black text-accent-blue">{selectedDoc.total_patients}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-txt-primary border-b border-white/[0.08] pb-2">Professional Details</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Hospital Affiliation</div>
                  <div className="flex items-center gap-1.5 mt-1 text-txt-secondary font-medium"><Building2 className="w-3.5 h-3.5 text-accent-blue" /> {selectedDoc.hospital_name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Department</div>
                  <div className="mt-1 text-txt-secondary font-medium">{selectedDoc.department}</div>
                </div>
                <div>
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Consultation Fee</div>
                  <div className="mt-1 text-txt-secondary font-medium">${selectedDoc.consultation_fee}</div>
                </div>
                <div>
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Availability</div>
                  <div className="mt-1 text-txt-secondary font-medium text-xs">{selectedDoc.available_days}<br/>{selectedDoc.available_time}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-txt-primary border-b border-white/[0.08] pb-2">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-txt-secondary font-medium"><Mail className="w-4 h-4 text-txt-muted" /> {selectedDoc.email || 'N/A'}</div>
                <div className="flex items-center gap-3 text-sm text-txt-secondary font-medium"><Phone className="w-4 h-4 text-txt-muted" /> {selectedDoc.phone || 'N/A'}</div>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Doctor ID *" value={formData.doc_id} onChange={e => setFormData({...formData, doc_id: e.target.value})} required />
              <Input label="Full Name & Title *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Dr. Alexander Wright" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Specialization *" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
              <Input label="Hospital Facility *" value={formData.hospital_name} onChange={e => setFormData({...formData, hospital_name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Experience (Yrs)" type="number" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: e.target.value})} />
              <Input label="Consultation Fee ($)" type="number" value={formData.consultation_fee} onChange={e => setFormData({...formData, consultation_fee: e.target.value})} />
              <Select label="Status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Retired">Retired</option>
              </Select>
            </div>
          </form>
        )}
      </SlideOverPanel>
    </div>
  );
};

export default Doctors;
