import React, { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { CreditCard, Receipt, ShieldCheck, Download, ExternalLink, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_INVOICES = [
  { id: 'INV-2026-001', date: '2026-07-28', description: 'Cardiology Consultation & ECG', amount: 350.00, insurance_covered: 280.00, patient_responsibility: 70.00, status: 'Unpaid' },
  { id: 'INV-2026-002', date: '2026-06-22', description: 'Comprehensive Metabolic Panel', amount: 120.00, insurance_covered: 120.00, patient_responsibility: 0.00, status: 'Paid' },
  { id: 'INV-2026-003', date: '2026-01-15', description: 'Chest X-Ray', amount: 200.00, insurance_covered: 160.00, patient_responsibility: 40.00, status: 'Paid' },
];

export const PatientBilling = () => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);

  const handlePay = (id) => {
    toast.success('Redirecting to secure payment gateway...');
  };

  const handleDownload = () => {
    toast.success('Downloading invoice PDF...');
  };

  const totalDue = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + i.patient_responsibility, 0);

  return (
    <div className="max-w-[1200px] mx-auto pb-12 space-y-6">
      <div>
        <h1 className="text-xl font-black text-txt-primary">Billing & Insurance</h1>
        <p className="text-xs text-txt-muted mt-1">Manage your financial responsibilities and view claims</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Insurance Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-5 bg-gradient-to-tr from-emerald-900 to-teal-900 rounded-2xl border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <ShieldCheck className="w-24 h-24 text-emerald-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-400 mb-6">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">Active Coverage</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-emerald-400/70 font-bold uppercase">Provider</div>
                  <div className="text-lg font-black text-white">BlueCross BlueShield</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400/70 font-bold uppercase">Policy Number</div>
                  <div className="text-sm font-mono text-white">BCBS-884-9921-X</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-emerald-400/70 font-bold uppercase">Copay</div>
                    <div className="text-sm font-bold text-white">$25.00</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400/70 font-bold uppercase">Deductible Met</div>
                    <div className="text-sm font-bold text-white">$1,250 / $2,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-dark-section rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="text-[10px] font-bold uppercase text-txt-muted mb-1">Total Outstanding Balance</div>
            <div className="text-3xl font-black text-txt-primary mb-4">${totalDue.toFixed(2)}</div>
            <button 
              onClick={() => handlePay('all')}
              disabled={totalDue === 0}
              className="w-full py-2.5 bg-accent-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              Pay Total Balance
            </button>
          </div>
        </div>

        {/* Invoice List */}
        <div className="md:col-span-2 p-5 bg-dark-section rounded-2xl border border-white/[0.08] shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-accent-blue" />
            <h2 className="text-sm font-black text-txt-primary">Recent Invoices & Claims</h2>
          </div>

          <div className="space-y-4">
            {invoices.map(inv => (
              <div key={inv.id} className="p-4 bg-dark-card rounded-xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-txt-primary text-sm">{inv.description}</span>
                    <Badge variant={inv.status === 'Paid' ? 'emerald' : 'amber'} size="sm">{inv.status}</Badge>
                  </div>
                  <div className="text-[11px] font-mono text-txt-muted">{inv.id} • {inv.date}</div>
                  
                  <div className="flex items-center gap-4 mt-3 text-[10px]">
                    <div><span className="text-txt-muted">Total: </span><span className="font-bold text-txt-secondary">${inv.amount.toFixed(2)}</span></div>
                    <div><span className="text-txt-muted">Insurance Covered: </span><span className="font-bold text-accent-emerald">${inv.insurance_covered.toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0 border-t sm:border-t-0 border-white/[0.05] pt-3 sm:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-txt-muted uppercase">Your Responsibility</div>
                    <div className="text-lg font-black text-txt-primary">${inv.patient_responsibility.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleDownload} className="p-1.5 text-txt-muted hover:text-txt-primary bg-dark-shell border border-white/[0.08] rounded-lg transition-colors" title="Download Invoice">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {inv.status === 'Unpaid' && (
                      <button onClick={() => handlePay(inv.id)} className="px-3 py-1.5 bg-accent-blue text-white text-[11px] font-bold rounded-lg hover:bg-blue-600 transition-colors">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientBilling;
