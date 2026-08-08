import React, { useState } from 'react';
import {
  Bell, Calendar, Pill, FlaskConical, CreditCard, Info,
  CheckCheck, Trash2, Filter, X, Clock
} from 'lucide-react';

const ALL_NOTIFS = [
  { id: 1, category: 'Appointments', icon: Calendar, color: 'text-accent-blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20', title: 'Appointment Tomorrow', message: 'You have an appointment with Dr. John Smith tomorrow at 10:30 AM.', time: '2 hours ago', read: false },
  { id: 2, category: 'Medicines', icon: Pill, color: 'text-accent-purple', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'Medication Reminder', message: 'Time to take your evening medication: Atorvastatin 20mg.', time: '4 hours ago', read: false },
  { id: 3, category: 'Lab Reports', icon: FlaskConical, color: 'text-accent-orange', bg: 'bg-amber-500/10', border: 'border-amber-500/20', title: 'Lab Results Ready', message: 'Your Lipid Panel results are now available. Tap to view.', time: '1 day ago', read: false },
  { id: 4, category: 'Bills', icon: CreditCard, color: 'text-accent-red', bg: 'bg-rose-500/10', border: 'border-rose-500/20', title: 'Payment Due in 7 Days', message: 'Invoice INV-2026-004 of $180 is due on August 20, 2026.', time: '1 day ago', read: true },
  { id: 5, category: 'General', icon: Info, color: 'text-accent-teal', bg: 'bg-teal-500/10', border: 'border-teal-500/20', title: 'Health Tip', message: 'Staying hydrated helps maintain healthy blood pressure. Aim for 8 glasses of water today.', time: '2 days ago', read: true },
  { id: 6, category: 'Appointments', icon: Calendar, color: 'text-accent-blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20', title: 'Appointment Confirmed', message: 'Your appointment with Dr. John Smith on August 9 has been confirmed.', time: '3 days ago', read: true },
  { id: 7, category: 'Medicines', icon: Pill, color: 'text-accent-purple', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'Refill Reminder', message: 'Lisinopril 10mg is running low. You have 2 refills remaining. Consider requesting a refill.', time: '4 days ago', read: true },
  { id: 8, category: 'Lab Reports', icon: FlaskConical, color: 'text-accent-orange', bg: 'bg-amber-500/10', border: 'border-amber-500/20', title: 'New Lab Order', message: 'Dr. John Smith has ordered a Thyroid Function Test (TSH, T3, T4). Please visit the lab.', time: '5 days ago', read: true },
];

const CATEGORIES = ['All', 'Appointments', 'Medicines', 'Lab Reports', 'Bills', 'General'];

const CAT_ICONS = {
  Appointments: Calendar, Medicines: Pill, 'Lab Reports': FlaskConical, Bills: CreditCard, General: Info
};

export const PatientNotifications = () => {
  const [notifs, setNotifs] = useState(ALL_NOTIFS);
  const [activeCategory, setActiveCategory] = useState('All');

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifs(prev => prev.filter(n => !n.read));
  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id));
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter(n => !n.read).length;
  const filtered = notifs.filter(n => activeCategory === 'All' || n.category === activeCategory);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-txt-primary">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-accent-emerald text-white text-[11px] font-black rounded-full">{unreadCount}</span>
            )}
          </div>
          <p className="text-xs text-txt-muted mt-0.5">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-section border border-white/[0.08] text-txt-muted hover:text-txt-primary text-xs font-bold rounded-xl transition-colors">
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
            </button>
          )}
          <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-section border border-white/[0.08] text-txt-muted hover:text-accent-red text-xs font-bold rounded-xl transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Clear Read
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const Icon = cat === 'All' ? Bell : CAT_ICONS[cat];
          const catCount = cat === 'All' ? notifs.filter(n => !n.read).length : notifs.filter(n => n.category === cat && !n.read).length;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                ${activeCategory === cat
                  ? 'bg-accent-emerald text-white border-emerald-500/50 shadow-md shadow-emerald-500/20'
                  : 'bg-dark-section border-white/[0.08] text-txt-muted hover:text-txt-primary hover:bg-dark-card'
                }`}>
              <Icon className="w-3 h-3" />
              {cat}
              {catCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-accent-emerald/20 text-accent-emerald'}`}>
                  {catCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-section border border-white/[0.08] flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-txt-muted/40" />
          </div>
          <h3 className="font-black text-sm text-txt-primary">No notifications</h3>
          <p className="text-xs text-txt-muted mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all group
                  ${n.read ? 'bg-dark-section border-white/[0.06] opacity-60 hover:opacity-100' : `${n.bg} ${n.border} shadow-sm`}`}
              >
                <div className={`w-9 h-9 rounded-xl ${n.bg} border ${n.border} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${n.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-accent-emerald shrink-0 mt-0.5" />}
                      <h3 className={`font-black text-xs ${n.read ? 'text-txt-muted' : 'text-txt-primary'}`}>{n.title}</h3>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-dark-hover text-txt-muted hover:text-txt-primary transition-all shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-txt-secondary mt-0.5 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-txt-disabled">
                    <Clock className="w-3 h-3" />
                    {n.time}
                    <span className="ml-1 px-1.5 py-0.5 bg-dark-card rounded text-[9px]">{n.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientNotifications;
