import React from 'react';
import { BarChart3, TrendingUp, Star, Calendar, Users, Clock, Award } from 'lucide-react';
import { Badge } from '../components/common/Badge';

const MONTHLY_DATA = [
  { month: 'Feb', appointments: 82, completed: 78, rating: 4.7 },
  { month: 'Mar', appointments: 91, completed: 88, rating: 4.8 },
  { month: 'Apr', appointments: 76, completed: 73, rating: 4.6 },
  { month: 'May', appointments: 95, completed: 91, rating: 4.9 },
  { month: 'Jun', appointments: 88, completed: 84, rating: 4.7 },
  { month: 'Jul', appointments: 102, completed: 97, rating: 4.8 },
];

const maxApts = Math.max(...MONTHLY_DATA.map(d => d.appointments));

export const DoctorPerformance = () => {
  return (
    <div className="max-w-[1400px] mx-auto pb-12 space-y-6">
      <div>
        <h1 className="text-xl font-black text-txt-primary">Performance Analytics</h1>
        <p className="text-xs text-txt-muted mt-1">Your clinical performance dashboard — last 6 months</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: '534', icon: Calendar, color: 'text-accent-blue', bg: 'bg-blue-500/10 border-blue-500/20', change: '+12%' },
          { label: 'Completion Rate', value: '95.3%', icon: TrendingUp, color: 'text-accent-emerald', bg: 'bg-emerald-500/10 border-emerald-500/20', change: '+2.1%' },
          { label: 'Patient Rating', value: '4.8★', icon: Star, color: 'text-accent-orange', bg: 'bg-amber-500/10 border-amber-500/20', change: '+0.1' },
          { label: 'Avg. Consult Time', value: '18 min', icon: Clock, color: 'text-accent-purple', bg: 'bg-purple-500/10 border-purple-500/20', change: '-2 min' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={`p-5 rounded-2xl border ${k.bg} shadow-lg`}>
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${k.color}`} />
                <Badge variant="emerald" size="sm">{k.change}</Badge>
              </div>
              <div className={`text-2xl font-black mt-3 ${k.color}`}>{k.value}</div>
              <div className="text-xs text-txt-muted font-semibold mt-1">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Monthly Chart */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
        <div className="font-black text-txt-primary text-sm mb-6">Monthly Appointment Volume</div>
        <div className="flex items-end gap-4 h-40">
          {MONTHLY_DATA.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-[10px] font-bold text-txt-muted">{d.appointments}</div>
              <div className="w-full flex gap-1 items-end" style={{ height: '100px' }}>
                <div
                  className="flex-1 rounded-t-lg bg-accent-blue/50 hover:bg-accent-blue transition-colors"
                  style={{ height: `${(d.appointments / maxApts) * 100}%` }}
                  title={`Total: ${d.appointments}`}
                />
                <div
                  className="flex-1 rounded-t-lg bg-accent-emerald/70 hover:bg-accent-emerald transition-colors"
                  style={{ height: `${(d.completed / maxApts) * 100}%` }}
                  title={`Completed: ${d.completed}`}
                />
              </div>
              <div className="text-[10px] text-txt-muted font-bold">{d.month}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-accent-blue/50" /><span className="text-[10px] text-txt-muted">Total</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-accent-emerald/70" /><span className="text-[10px] text-txt-muted">Completed</span></div>
        </div>
      </div>

      {/* Patient Satisfaction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
          <div className="font-black text-txt-primary text-sm mb-4">Patient Satisfaction</div>
          <div className="text-5xl font-black text-accent-orange mb-2">4.8 <span className="text-2xl text-txt-muted">/ 5</span></div>
          <div className="flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-5 h-5 ${s <= 4 ? 'text-accent-orange fill-accent-orange' : 'text-txt-muted'}`} />
            ))}
          </div>
          <div className="space-y-2">
            {['Communication', 'Diagnosis Accuracy', 'Follow-up Care', 'Wait Time'].map((cat, i) => {
              const pct = [96, 94, 92, 88][i];
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-txt-secondary">{cat}</span>
                    <span className="font-bold text-txt-primary">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-dark-card rounded-full overflow-hidden">
                    <div className="h-full bg-accent-orange rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.08] bg-dark-section shadow-xl">
          <div className="font-black text-txt-primary text-sm mb-4">Recent Achievements</div>
          <div className="space-y-3">
            {[
              { icon: Award, color: 'text-accent-orange', label: 'Top Performer — July 2026', desc: 'Highest completion rate in Cardiology' },
              { icon: Star, color: 'text-accent-blue', label: '100 Consultations — Milestone', desc: 'Reached 100 consultations this quarter' },
              { icon: TrendingUp, color: 'text-accent-emerald', label: 'Zero Late Starts — 30 Days', desc: 'Perfect punctuality streak' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-dark-card rounded-xl border border-white/[0.06]">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.color} bg-current/10 shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-txt-primary text-xs">{a.label}</div>
                    <div className="text-[10px] text-txt-muted">{a.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPerformance;
