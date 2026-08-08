import React, { useState } from 'react';
import {
  Sparkles, Pill, Calendar, Activity, Heart, AlertTriangle,
  Bot, Send, ChevronRight, CheckCircle2, Shield, Info, Droplets
} from 'lucide-react';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  {
    id: 1,
    type: 'Reminders',
    icon: Pill,
    color: 'text-accent-emerald',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: 'Evening Medication Reminder',
    text: 'Your Atorvastatin 20mg is scheduled for 8:00 PM tonight. Taking it consistently helps manage cholesterol effectively.',
    action: 'Log Taken'
  },
  {
    id: 2,
    type: 'Reminders',
    icon: Calendar,
    color: 'text-accent-blue',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'Upcoming Cardiology Follow-up',
    text: 'You have a follow-up with Dr. John Smith in 3 days. Make sure to log your blood pressure readings before your appointment.',
    action: 'View Schedule'
  },
  {
    id: 3,
    type: 'Wellness',
    icon: Activity,
    color: 'text-accent-orange',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: 'Physical Activity Recommendation',
    text: 'Your vital trends show steady improvements. Adding 20–30 minutes of brisk walking today can help maintain blood pressure stability.',
    action: 'Track Activity'
  },
  {
    id: 4,
    type: 'Lifestyle',
    icon: Droplets,
    color: 'text-accent-teal',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    title: 'Hydration Target',
    text: 'Aim for 2.5 liters of water today. Proper hydration supports cardiovascular function and metabolic balance.',
    action: 'Mark Goal'
  },
  {
    id: 5,
    type: 'Preventive',
    icon: Shield,
    color: 'text-accent-purple',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: 'Preventive Lab Screening',
    text: 'Your routine Lipid Panel was completed 3 months ago. Regular bi-annual checks are recommended for optimal monitoring.',
    action: 'Lab Info'
  }
];

export const PatientAIAssistant = () => {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your HealthFlow AI Companion. I can help answer questions about your health metrics, appointment schedules, medication guidance, and general wellness. How can I assist you today?'
    }
  ]);

  const CATEGORIES = ['All', 'Reminders', 'Wellness', 'Lifestyle', 'Preventive'];

  const filteredSuggestions = SUGGESTIONS.filter(
    s => filter === 'All' || s.type === filter
  );

  const handleSend = () => {
    if (!query.trim()) return;
    const userMsg = query;
    setChatLog(prev => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Thank you for asking about "${userMsg}". Based on your recent health records, your metrics remain stable. Remember that AI insights are suggestions and for clinical decisions, please consult Dr. John Smith.`
        }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <span className="font-black text-accent-orange uppercase tracking-wider block mb-0.5">
            Medical Advice Disclaimer
          </span>
          These insights and recommendations are AI-generated suggestions to help you manage your daily health routines. They are <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>. Always seek the advice of your physician or qualified health provider.
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-txt-primary">AI Health Assistant</h1>
          <p className="text-xs text-txt-muted mt-0.5">Personalized guidance & health companion</p>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-txt-primary">Personalized Recommendations</h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  filter === cat
                    ? 'bg-accent-emerald text-white border-emerald-500/50 shadow-md shadow-emerald-500/20'
                    : 'bg-dark-section border-white/[0.08] text-txt-muted hover:text-txt-primary hover:bg-dark-card'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuggestions.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border ${item.border} bg-dark-section space-y-3 flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-txt-muted tracking-wide">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-txt-primary">{item.title}</h3>
                  <p className="text-xs text-txt-secondary leading-relaxed">{item.text}</p>
                </div>
                <button
                  onClick={() => toast.success(`Action "${item.action}" updated`)}
                  className="self-start flex items-center gap-1.5 text-xs font-bold text-accent-emerald hover:text-emerald-400 transition-colors pt-2"
                >
                  {item.action} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive AI Chat */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-dark-section space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Bot className="w-5 h-5 text-accent-emerald" />
          <h2 className="font-black text-sm text-txt-primary">Ask AI Companion</h2>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-accent-emerald flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-accent-emerald text-white rounded-br-sm'
                    : 'bg-dark-card border border-white/[0.08] text-txt-secondary rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Ask about diet, medications, appointment prep..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-dark-card border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 bg-accent-emerald text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:opacity-90 transition"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAIAssistant;
