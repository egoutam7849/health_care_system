import React, { useState, useEffect } from 'react';
import { 
  UserPlus, FileSpreadsheet, Eye, Edit, Trash2, 
  Activity, Calendar, Building2, Stethoscope, Droplets, MapPin, 
  Phone, Mail, Receipt, AlertCircle, CheckCircle2
} from 'lucide-react';
import { entitiesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { SlideOverPanel } from '../components/common/SlideOverPanel';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState('view');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    patient_id: '', name: '', date_of_birth: '', age: '', gender: 'Male', blood_group: 'O+',
    phone: '', email: '', address: '', city: 'New York', state: 'NY', emergency_contact: '',
    insurance_provider: 'BlueCross', insurance_number: '', doctor_name: 'Dr. Alexander Wright',
    hospital_name: 'Metro General Hospital', department: 'Cardiology', disease: 'Cardiovascular Disease',
    diagnosis: '', admission_date: new Date().toISOString().split('T')[0], discharge_date: '',
    status: 'Admitted', medical_history: '', bill_amount: 15000.0, is_readmitted: false
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await entitiesAPI.getPatients({
        search: search || undefined,
        disease: diseaseFilter || undefined,
        status: statusFilter || undefined
      });
      setPatients(data);
    } catch (err) {
      toast.error('Failed to fetch patients dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, [search, diseaseFilter, statusFilter]);

  const handleOpenAdd = () => {
    setFormData({ ...initialForm, patient_id: `PAT-${Math.floor(1000 + Math.random() * 9000)}` });
    setPanelMode('add');
    setIsPanelOpen(true);
  };

  const handleOpenView = (p) => {
    setSelectedPatient(p);
    setPanelMode('view');
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedPatient(p);
    setFormData({ ...p });
    setPanelMode('edit');
    setIsPanelOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading(panelMode === 'edit' ? 'Updating Patient Record...' : 'Creating Patient Record...');
    try {
      if (panelMode === 'edit') {
        await entitiesAPI.updatePatient(selectedPatient.id, { 
          ...formData, 
          age: parseInt(formData.age || 30),
          bill_amount: parseFloat(formData.bill_amount || 0)
        });
        toast.success('Patient record updated', { id: tid });
      } else {
        await entitiesAPI.createPatient({ 
          ...formData,
          age: parseInt(formData.age || 30),
          bill_amount: parseFloat(formData.bill_amount || 0)
        });
        toast.success('Patient registered successfully', { id: tid });
      }
      setIsPanelOpen(false);
      fetchPatients();
    } catch (err) {
      toast.error('Operation failed', { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Permanently delete record for ${p.name}?`)) return;
    const tid = toast.loading('Deleting patient record...');
    try {
      await entitiesAPI.deletePatient(p.id);
      toast.success('Record deleted from database', { id: tid });
      fetchPatients();
    } catch (err) {
      toast.error('Failed to delete record', { id: tid });
    }
  };

  const handleExportCSV = () => {
    if (patients.length === 0) return toast.error('No records to export');
    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Blood Group', 'Disease', 'Doctor', 'Hospital', 'Status'];
    const rows = patients.map(p => [p.patient_id, p.name, p.age, p.gender, p.blood_group, p.disease, p.doctor_name, p.hospital_name, p.status]);
    let csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Patients_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Exported to CSV');
  };

  const admittedCount = patients.filter(p => p.status === 'Admitted').length;
  const readmittedCount = patients.filter(p => p.status === 'Readmitted').length;
  const stats = [
    { label: 'Total Registry', value: patients.length },
    { label: 'Active Inpatients', value: admittedCount, trend: 'Live', trendColor: 'text-accent-emerald' },
    { label: 'Readmissions', value: readmittedCount, trend: 'Warning', trendColor: 'text-accent-orange' },
  ];

  const columns = [
    { 
      label: 'Patient Record', 
      key: 'name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20">
            {row.name.split(' ')[1]?.[0] || row.name[0]}
          </div>
          <div>
            <div className="font-bold text-txt-primary">{row.name}</div>
            <div className="text-[10px] font-mono text-txt-muted">{row.patient_id} • {row.age}Y • {row.gender}</div>
          </div>
        </div>
      )
    },
    { 
      label: 'Diagnosis', 
      key: 'disease',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-txt-secondary">{row.disease}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-txt-muted font-mono">
            <Droplets className="w-3 h-3 text-accent-red" /> {row.blood_group}
          </div>
        </div>
      )
    },
    { 
      label: 'Attending & Facility', 
      key: 'hospital_name',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-txt-secondary font-medium">
            <Stethoscope className="w-3.5 h-3.5 text-accent-emerald" />
            <span className="truncate max-w-[150px]">{row.doctor_name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-txt-muted">
            <Building2 className="w-3 h-3" />
            <span className="truncate max-w-[150px]">{row.hospital_name}</span>
          </div>
        </div>
      )
    },
    { 
      label: 'Admission', 
      key: 'admission_date',
      render: (row) => (
        <div className="text-txt-muted font-mono">{row.admission_date}</div>
      )
    },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => {
        const isAdmitted = row.status === 'Admitted' || row.status === 'Readmitted';
        return (
          <Badge variant={isAdmitted ? 'amber' : 'emerald'}>
            {row.status}
          </Badge>
        );
      }
    },
    {
      label: '',
      key: 'actions',
      tdClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => handleOpenView(row)} className="p-1.5 text-txt-muted hover:text-accent-emerald hover:bg-dark-hover rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
          <button onClick={() => handleOpenEdit(row)} className="p-1.5 text-txt-muted hover:text-accent-orange hover:bg-dark-hover rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(row)} className="p-1.5 text-txt-muted hover:text-accent-red hover:bg-dark-hover rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  const diseaseOptions = ['Cardiovascular Disease', 'Diabetes Mellitus Type II', 'Pneumonia', 'Asthma', 'Hypertension'];
  const statusOptions = ['Admitted', 'Discharged', 'Recovered', 'Readmitted'];

  return (
    <div className="max-w-[1600px] mx-auto pb-12 bg-dark-canvas">
      <PageHeader 
        title="Patient Management" 
        description="Real-time patient directory and clinical records synchronized with PostgreSQL warehouse."
        stats={stats}
        actions={[
          { label: 'Export Data', icon: FileSpreadsheet, onClick: handleExportCSV },
          { label: 'Register Patient', icon: UserPlus, primary: true, onClick: handleOpenAdd }
        ]}
      />

      <DataTable 
        columns={columns}
        data={patients}
        isLoading={loading}
        searchPlaceholder="Search patients, ID..."
        searchValue={search}
        onSearchChange={setSearch}
        onRowClick={handleOpenView}
        onExport={handleExportCSV}
        filters={[
          { label: 'Condition', value: diseaseFilter, onChange: setDiseaseFilter, options: diseaseOptions },
          { label: 'Status', value: statusFilter, onChange: setStatusFilter, options: statusOptions }
        ]}
      />

      {/* SlideOverPanel */}
      <SlideOverPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={panelMode === 'add' ? 'Register New Patient' : panelMode === 'edit' ? `Edit ${selectedPatient?.name}` : selectedPatient?.name}
        subtitle={panelMode === 'view' ? `${selectedPatient?.patient_id} • Age ${selectedPatient?.age}` : 'Update PostgreSQL records'}
        footer={
          panelMode !== 'view' && (
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
              <Button variant="success" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Patient Record'}
              </Button>
            </div>
          )
        }
      >
        {panelMode === 'view' && selectedPatient ? (
          <div className="space-y-8">
            <div className="flex gap-4 items-center border-b border-white/[0.08] pb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-emerald-500/20 shrink-0">
                {selectedPatient.name.split(' ')[1]?.[0] || selectedPatient.name[0]}
              </div>
              <div className="min-w-0">
                <div className="text-xl font-black text-txt-primary truncate">{selectedPatient.name}</div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <Badge variant={selectedPatient.status === 'Admitted' ? 'amber' : 'emerald'}>{selectedPatient.status}</Badge>
                  <span className="text-xs font-mono text-txt-muted">{selectedPatient.patient_id}</span>
                  <Badge variant="red" icon={Droplets}>{selectedPatient.blood_group}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-txt-primary flex items-center gap-2 border-b border-white/[0.08] pb-2">
                <Activity className="w-4 h-4 text-accent-emerald" /> Clinical Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-dark-shell border border-white/[0.08]">
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Primary Diagnosis</div>
                  <div className="mt-1 text-sm font-semibold text-txt-primary">{selectedPatient.disease}</div>
                  <div className="mt-2 text-[11px] text-txt-secondary">{selectedPatient.diagnosis || 'No secondary notes provided.'}</div>
                </div>
                <div className="p-4 rounded-xl bg-dark-shell border border-white/[0.08] flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-txt-muted font-bold uppercase">Assigned Care Team</div>
                    <div className="mt-1 text-sm font-semibold text-txt-primary">{selectedPatient.doctor_name}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <div className="text-[10px] text-txt-muted font-bold uppercase">Facility</div>
                    <div className="mt-1 text-xs font-medium text-txt-secondary">{selectedPatient.hospital_name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-txt-primary flex items-center gap-2 border-b border-white/[0.08] pb-2">
                <Receipt className="w-4 h-4 text-accent-emerald" /> Administration & Billing
              </h3>
              <div className="grid grid-cols-3 gap-y-4 text-sm bg-dark-shell p-5 rounded-2xl border border-white/[0.08]">
                <div>
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Admission Date</div>
                  <div className="mt-1 font-mono text-txt-primary">{selectedPatient.admission_date}</div>
                </div>
                <div>
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Discharge Date</div>
                  <div className="mt-1 font-mono text-txt-primary">{selectedPatient.discharge_date || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Total Billed</div>
                  <div className="mt-1 font-mono font-bold text-accent-emerald">${(selectedPatient.bill_amount || 0).toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] text-txt-muted font-bold uppercase">Insurance Provider</div>
                  <div className="mt-1 font-medium text-txt-primary">{selectedPatient.insurance_provider}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Patient ID *" value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})} required />
              <Input label="Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. John Doe" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Age *" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required />
              <Select label="Gender *" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </Select>
              <Select label="Blood Group" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})}>
                <option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="B+">B+</option><option value="AB+">AB+</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Diagnosed Disease *" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} required />
              <Input label="Assigned Doctor *" value={formData.doctor_name} onChange={e => setFormData({...formData, doctor_name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Assigned Hospital *" value={formData.hospital_name} onChange={e => setFormData({...formData, hospital_name: e.target.value})} required />
              <Select label="Inpatient Status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Admitted">Admitted</option><option value="Discharged">Discharged</option><option value="Recovered">Recovered</option><option value="Readmitted">Readmitted</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Total Billed ($)" type="number" value={formData.bill_amount} onChange={e => setFormData({...formData, bill_amount: e.target.value})} />
              <Input label="Insurance Provider" value={formData.insurance_provider} onChange={e => setFormData({...formData, insurance_provider: e.target.value})} />
            </div>
          </form>
        )}
      </SlideOverPanel>
    </div>
  );
};

export default Patients;
