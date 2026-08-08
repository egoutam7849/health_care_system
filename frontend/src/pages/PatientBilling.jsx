import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { portalsAPI } from '../services/api';
import {
  CreditCard, Download, CheckCircle2, AlertCircle, Clock,
  Shield, FileText, X, ChevronRight, TrendingDown, DollarSign,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Fallback Data ─────────────────────────────────────────────────────────────
const FALLBACK_BILLS = [
  { invoice_id: 'INV-2026-001', date: '2026-07-15', description: 'Cardiology Consultation & ECG', amount: 4500, insurance_covered: 4050, patient_paid: 450, status: 'PAID', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', due_date: '2026-07-30' },
  { invoice_id: 'INV-2026-002', date: '2026-06-28', description: 'Laboratory Tests — Metabolic Panel', amount: 2200, insurance_covered: 1980, patient_paid: 220, status: 'PAID', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', due_date: '2026-07-15' },
  { invoice_id: 'INV-2026-003', date: '2026-06-12', description: 'Inpatient Cardiovascular Care & Diagnostics', amount: 18500, insurance_covered: 16650, patient_paid: 1850, status: 'PAID', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', due_date: '2026-07-05' },
  { invoice_id: 'INV-2026-004', date: '2026-08-02', description: 'Follow-up Consultation', amount: 1800, insurance_covered: 1620, patient_paid: 180, status: 'PENDING', doctor: 'Dr. John Smith', facility: 'Metro General Hospital', due_date: '2026-08-20' },
];

const INSURANCE = {
  provider: 'BlueCross BlueShield',
  policy_number: 'BCB-2026-44821',
  group_number: 'GRP-8841',
  coverage_type: 'Comprehensive Health Plan',
  coverage_pct: 90,
  deductible: 1500,
  deductible_met: 1250,
  out_of_pocket_max: 5000,
  out_of_pocket_used: 2720,
  effective_date: '2026-01-01',
  expiry_date: '2026-12-31',
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ icon: Icon, label, value, sub, color, bg, border }) {
  return (
    <div className={`p-5 rounded-2xl border ${border} ${bg} space-y-1`}>
      <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} />
      </div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[11px] font-bold text-txt-muted">{label}</div>
      {sub && <div className="text-[10px] text-txt-disabled">{sub}</div>}
    </div>
  );
}

// ─── Bill Card ─────────────────────────────────────────────────────────────────
function BillCard({ bill, onDownload }) {
  const isPaid = bill.status === 'PAID';
  const isPending = bill.status === 'PENDING';

  return (
    <div className={`p-5 rounded-2xl border transition-all
      ${isPending ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50' : 'border-white/[0.08] bg-dark-section hover:border-white/[0.15]'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
            {isPaid ? <CheckCircle2 className="w-5 h-5 text-accent-emerald" /> : <AlertCircle className="w-5 h-5 text-accent-orange" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-txt-muted">{bill.invoice_id}</span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border
                ${isPaid ? 'bg-emerald-500/15 text-accent-emerald border-emerald-500/25' : 'bg-amber-500/15 text-accent-orange border-amber-500/25'}`}>
                {bill.status}
              </span>
            </div>
            <h3 className="font-bold text-sm text-txt-primary mt-1">{bill.description}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
              <span className="text-[11px] text-txt-muted">{bill.doctor}</span>
              <span className="text-[11px] text-txt-muted">{bill.date}</span>
              {isPending && (
                <span className="flex items-center gap-1 text-[11px] text-accent-orange font-bold">
                  <Clock className="w-3 h-3" /> Due {bill.due_date}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <div className="text-xl font-black text-txt-primary">${bill.patient_paid?.toLocaleString()}</div>
          <div className="text-[10px] text-txt-muted">Your share</div>
          <div className="text-[10px] text-accent-emerald mt-0.5">Ins: ${bill.insurance_covered?.toLocaleString()}</div>
        </div>
      </div>

      {/* Cost breakdown bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-txt-muted mb-1">
          <span>Total: ${bill.amount?.toLocaleString()}</span>
          <span>Coverage: {Math.round((bill.insurance_covered / bill.amount) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-dark-card rounded-full overflow-hidden">
          <div className="h-full bg-accent-emerald rounded-full" style={{ width: `${(bill.insurance_covered / bill.amount) * 100}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
        {isPending && (
          <button onClick={() => toast.success('Redirecting to payment portal...')}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent-emerald text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:opacity-90 transition">
            <DollarSign className="w-3.5 h-3.5" /> Pay Now
          </button>
        )}
        <button onClick={() => onDownload(bill)}
          className="flex items-center gap-1.5 px-3 py-2 bg-dark-card border border-white/[0.08] hover:bg-dark-hover text-txt-muted hover:text-txt-primary text-xs font-bold rounded-xl transition">
          <Download className="w-3.5 h-3.5" /> Download Invoice
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-dark-card border border-white/[0.08] hover:bg-dark-hover text-txt-muted hover:text-txt-primary text-xs font-bold rounded-xl transition">
          <FileText className="w-3.5 h-3.5" /> View Details
        </button>
      </div>
    </div>
  );
}

// ─── Insurance Panel ──────────────────────────────────────────────────────────
function InsurancePanel({ ins }) {
  const deductiblePct = (ins.deductible_met / ins.deductible) * 100;
  const oopPct = (ins.out_of_pocket_used / ins.out_of_pocket_max) * 100;

  return (
    <div className="space-y-4">
      {/* Policy Card */}
      <div className="p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-blue-500/5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-blue" />
              <h3 className="font-black text-base text-txt-primary">{ins.provider}</h3>
            </div>
            <p className="text-xs text-txt-muted mt-1">{ins.coverage_type}</p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/15 text-accent-emerald text-[10px] font-black rounded-full border border-emerald-500/25">Active</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Policy Number', value: ins.policy_number },
            { label: 'Group Number', value: ins.group_number },
            { label: 'Effective Date', value: ins.effective_date },
            { label: 'Expiry Date', value: ins.expiry_date },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-dark-section/60 border border-white/[0.06]">
              <div className="text-[10px] text-txt-muted">{label}</div>
              <div className="text-xs font-bold text-txt-primary mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Details */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
        <h3 className="font-black text-sm text-txt-primary">Coverage Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-txt-muted">Annual Deductible</span>
              <span className="font-bold text-txt-primary">${ins.deductible_met} / ${ins.deductible}</span>
            </div>
            <div className="h-2 bg-dark-card rounded-full overflow-hidden">
              <div className="h-full bg-accent-blue rounded-full transition-all" style={{ width: `${Math.min(deductiblePct, 100)}%` }} />
            </div>
            <div className="text-[10px] text-txt-muted mt-1">{Math.round(deductiblePct)}% met</div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-txt-muted">Out-of-Pocket Max</span>
              <span className="font-bold text-txt-primary">${ins.out_of_pocket_used} / ${ins.out_of_pocket_max}</span>
            </div>
            <div className="h-2 bg-dark-card rounded-full overflow-hidden">
              <div className="h-full bg-accent-emerald rounded-full transition-all" style={{ width: `${Math.min(oopPct, 100)}%` }} />
            </div>
            <div className="text-[10px] text-txt-muted mt-1">{Math.round(oopPct)}% reached</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-emerald" />
            <span className="text-xs text-txt-primary font-bold">Coverage Rate</span>
          </div>
          <span className="text-lg font-black text-accent-emerald">{ins.coverage_pct}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const PatientBilling = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Pending');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await portalsAPI.getPatientSummary({ patient_id: user?.patient_id });
        setBills(res?.billing_history?.length > 0 ? res.billing_history : FALLBACK_BILLS);
      } catch {
        setBills(FALLBACK_BILLS);
      }
      setLoading(false);
    };
    load();
  }, []);

  const pending = bills.filter(b => b.status !== 'PAID');
  const paid = bills.filter(b => b.status === 'PAID');
  const totalPaid = paid.reduce((s, b) => s + (b.patient_paid || 0), 0);
  const totalPending = pending.reduce((s, b) => s + (b.patient_paid || 0), 0);
  const totalCoverage = bills.reduce((s, b) => s + (b.insurance_covered || 0), 0);

  const TABS = ['Pending', 'Paid', 'Insurance'];
  const tabBills = tab === 'Pending' ? pending : tab === 'Paid' ? paid : [];

  const handleDownload = (bill) => {
    toast.success(`Downloading ${bill.invoice_id}...`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-txt-primary">Billing & Insurance</h1>
        <p className="text-xs text-txt-muted mt-0.5">
          {pending.length > 0 ? `${pending.length} payment${pending.length > 1 ? 's' : ''} pending` : 'All bills cleared'} • ${totalCoverage.toLocaleString()} covered by insurance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={AlertCircle} label="Outstanding Balance" value={`$${totalPending.toLocaleString()}`}
          sub={`${pending.length} pending bill${pending.length !== 1 ? 's' : ''}`}
          color={totalPending > 0 ? 'text-accent-orange' : 'text-accent-emerald'}
          bg={totalPending > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10'}
          border={totalPending > 0 ? 'border-amber-500/25' : 'border-emerald-500/25'} />
        <SummaryCard icon={CheckCircle2} label="Total Paid" value={`$${totalPaid.toLocaleString()}`}
          sub={`${paid.length} invoice${paid.length !== 1 ? 's' : ''} settled`}
          color="text-accent-emerald" bg="bg-emerald-500/10" border="border-emerald-500/25" />
        <SummaryCard icon={Shield} label="Insurance Coverage" value={`$${totalCoverage.toLocaleString()}`}
          sub="Total covered by your insurer"
          color="text-accent-blue" bg="bg-blue-500/10" border="border-blue-500/25" />
      </div>

      {/* Pending alert */}
      {pending.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <AlertCircle className="w-4 h-4 text-accent-orange shrink-0" />
          <p className="text-xs text-txt-secondary flex-1">
            You have <span className="font-black text-accent-orange">${totalPending.toLocaleString()}</span> in outstanding payments.
          </p>
          <button onClick={() => toast.success('Redirecting to payment portal...')}
            className="px-3 py-1.5 bg-accent-orange text-white text-[10px] font-black rounded-xl hover:opacity-90 transition shrink-0">
            Pay All
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-dark-section rounded-xl border border-white/[0.08]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150
              ${tab === t ? 'bg-accent-emerald text-white shadow-lg shadow-emerald-500/20' : 'text-txt-muted hover:text-txt-primary hover:bg-dark-hover'}`}>
            {t}
            {t !== 'Insurance' && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${tab === t ? 'bg-white/20 text-white' : 'bg-dark-card text-txt-muted'}`}>
                {t === 'Pending' ? pending.length : paid.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-dark-section rounded-2xl border border-white/[0.05]" />)}
        </div>
      ) : tab === 'Insurance' ? (
        <InsurancePanel ins={INSURANCE} />
      ) : tabBills.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <CheckCircle2 className="w-12 h-12 text-txt-muted/30 mb-3" />
          <p className="font-black text-sm text-txt-primary">
            {tab === 'Pending' ? 'No outstanding bills' : 'No payment history'}
          </p>
          <p className="text-xs text-txt-muted mt-1">
            {tab === 'Pending' ? "You're all caught up!" : 'Completed payments will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tabBills.map(bill => (
            <BillCard key={bill.invoice_id} bill={bill} onDownload={handleDownload} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientBilling;
