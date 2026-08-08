import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Search, Send, Phone, Video, Stethoscope, Building2, FlaskConical, HeadphonesIcon, Circle } from 'lucide-react';

const CONTACTS = [
  { id: 1, name: 'Dr. John Smith', role: 'Attending Physician', type: 'doctor', icon: Stethoscope, online: true, color: 'from-blue-600 to-teal-500', lastMsg: 'Please continue the medication as prescribed.', lastTime: '2:45 PM', unread: 0 },
  { id: 2, name: 'Metro General Hospital', role: 'Main Facility', type: 'hospital', icon: Building2, online: false, color: 'from-emerald-600 to-teal-500', lastMsg: 'Your appointment has been confirmed.', lastTime: 'Yesterday', unread: 1 },
  { id: 3, name: 'Diagnostic Lab Services', role: 'Laboratory', type: 'lab', icon: FlaskConical, online: false, color: 'from-purple-600 to-blue-500', lastMsg: 'Your lab results are ready for review.', lastTime: 'Mon', unread: 1 },
  { id: 4, name: 'Patient Support', role: 'Help & Assistance', type: 'support', icon: HeadphonesIcon, online: true, color: 'from-orange-600 to-rose-500', lastMsg: 'How can we help you today?', lastTime: 'Last week', unread: 0 },
];

const CONVERSATIONS = {
  1: [
    { id: 1, from: 'doctor', text: 'Hello! How are you feeling today?', time: '10:00 AM' },
    { id: 2, from: 'me', text: 'I\'m feeling much better, thank you. The blood pressure has been stable.', time: '10:05 AM' },
    { id: 3, from: 'doctor', text: 'Excellent news! Keep monitoring it daily and log the readings. I\'ll review them at your next visit.', time: '10:08 AM' },
    { id: 4, from: 'me', text: 'Will do. Should I continue with the Atorvastatin?', time: '10:12 AM' },
    { id: 5, from: 'doctor', text: 'Please continue the medication as prescribed. Take it at bedtime and avoid grapefruit.', time: '2:45 PM' },
  ],
  2: [
    { id: 1, from: 'hospital', text: 'Dear Patient, your appointment with Dr. John Smith has been confirmed for August 9, 2026 at 10:30 AM.', time: 'Yesterday' },
    { id: 2, from: 'me', text: 'Thank you for the confirmation.', time: 'Yesterday' },
  ],
  3: [
    { id: 1, from: 'lab', text: 'Dear Patient, your lab results for Comprehensive Metabolic Panel are now ready. Please log in to view them.', time: 'Monday' },
  ],
  4: [
    { id: 1, from: 'support', text: 'Welcome to Patient Support! How can we help you today?', time: 'Last week' },
  ],
};

export const PatientMessages = () => {
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState(CONVERSATIONS[1]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const msgEndRef = useRef(null);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectContact = (c) => {
    setActiveContact(c);
    setMessages(CONVERSATIONS[c.id] || []);
  };

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'me', text: input.trim(), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    // Simulated response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'doctor',
        text: 'Thank you for your message. I will review this and get back to you shortly.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const filteredContacts = CONTACTS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="flex h-full rounded-2xl border border-white/[0.08] overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-80 shrink-0 border-r border-white/[0.08] bg-dark-section flex flex-col">
          <div className="p-4 border-b border-white/[0.08]">
            <h2 className="font-black text-sm text-txt-primary mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-muted" />
              <input type="text" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-dark-card border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(c => {
              const Icon = c.icon;
              const isActive = activeContact.id === c.id;
              return (
                <button key={c.id} onClick={() => selectContact(c)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-white/[0.04] hover:bg-dark-hover
                    ${isActive ? 'bg-emerald-500/10 border-l-2 border-l-accent-emerald' : ''}`}>
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${c.color} flex items-center justify-center`}>
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-emerald border-2 border-dark-section" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-txt-primary truncate">{c.name}</span>
                      <span className="text-[10px] text-txt-muted shrink-0 ml-1">{c.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-txt-muted truncate flex-1">{c.lastMsg}</span>
                      {c.unread > 0 && <span className="w-4 h-4 rounded-full bg-accent-emerald text-white text-[9px] font-black flex items-center justify-center shrink-0 ml-1">{c.unread}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-dark-canvas">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-dark-section shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeContact.color} flex items-center justify-center`}>
                <activeContact.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="font-black text-sm text-txt-primary">{activeContact.name}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-txt-muted">
                  {activeContact.online ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" /><span className="text-accent-emerald font-bold">Online</span></>
                  ) : (
                    <><span className="w-1.5 h-1.5 rounded-full bg-txt-muted" />Offline</>
                  )}
                  <span className="mx-1">•</span>
                  {activeContact.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-dark-hover text-txt-muted hover:text-txt-primary transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl hover:bg-dark-hover text-txt-muted hover:text-txt-primary transition-colors">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map(msg => {
              const isMe = msg.from === 'me';
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${activeContact.color} flex items-center justify-center shrink-0`}>
                      <activeContact.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed
                      ${isMe
                        ? 'bg-accent-emerald text-white rounded-br-sm shadow-md shadow-emerald-500/20'
                        : 'bg-dark-card border border-white/[0.08] text-txt-secondary rounded-bl-sm'
                      }`}>
                      {msg.text}
                    </div>
                    <div className={`text-[9px] text-txt-disabled mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={msgEndRef} />
          </div>

          {/* Compose */}
          <div className="p-4 border-t border-white/[0.08] bg-dark-section shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${activeContact.name}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                className="flex-1 px-4 py-2.5 bg-dark-card border border-white/[0.08] rounded-xl text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-accent-emerald/50 transition-colors"
              />
              <button
                onClick={sendMsg}
                className="w-10 h-10 rounded-xl bg-accent-emerald flex items-center justify-center text-white shadow-md shadow-emerald-500/20 hover:opacity-90 transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-txt-disabled mt-2">This is a secure healthcare messaging channel. For emergencies, call 911 or your local emergency services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;
