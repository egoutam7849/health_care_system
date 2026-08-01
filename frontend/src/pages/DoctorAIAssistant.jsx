import React, { useState } from 'react';
import { Sparkles, Send, User, Bot, Stethoscope, FlaskConical, Pill, AlertTriangle, RotateCcw, Copy } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  { label: 'Drug Interaction', icon: AlertTriangle, prompt: 'Check drug interactions between Amlodipine 5mg and Metformin 500mg for a 52-year-old male patient.' },
  { label: 'Differential Diagnosis', icon: Stethoscope, prompt: 'Generate a differential diagnosis for a 45-year-old female presenting with fatigue, weight gain, cold intolerance, and dry skin.' },
  { label: 'Lab Interpretation', icon: FlaskConical, prompt: 'Interpret the following lab values: HbA1c 8.2%, Fasting Glucose 186 mg/dL, LDL 142 mg/dL, Hb 11.2 g/dL.' },
  { label: 'Dosage Calculator', icon: Pill, prompt: 'Calculate the appropriate Metformin dose for a Type 2 Diabetes patient with eGFR of 58 mL/min/1.73m².' },
];

const AI_RESPONSES = {
  'Check drug interactions': `**Drug Interaction Analysis — Amlodipine + Metformin**

**Risk Level:** ⚠️ Minor Interaction

**Interaction Summary:**
- No significant pharmacokinetic interaction between Amlodipine and Metformin has been documented.
- Amlodipine (calcium channel blocker) may cause peripheral edema; Metformin does not potentiate this.
- Both drugs may be used concomitantly with standard monitoring.

**Clinical Recommendations:**
1. Monitor blood glucose periodically — Amlodipine has no effect on glycemic control.
2. Check renal function (eGFR) every 6 months — Metformin contraindicated if eGFR < 30.
3. Monitor for peripheral edema from Amlodipine.

**Verdict:** ✅ Safe to co-prescribe. No dose adjustment needed.`,
  
  'Generate a differential': `**Differential Diagnosis — Fatigue, Weight Gain, Cold Intolerance, Dry Skin (Female, 45Y)**

**Most Likely (Rule Out First):**
1. **Hypothyroidism** (ICD-10: E03.9) — Classic presentation. Order TSH, Free T4.
2. **Hashimoto's Thyroiditis** — Autoimmune hypothyroidism. Order TPO antibodies.

**Also Consider:**
3. **Type 2 Diabetes Mellitus** — Fatigue + weight changes. Order HbA1c, FPG.
4. **Iron Deficiency Anemia** — Fatigue + cold intolerance. Order CBC, Ferritin, TIBC.
5. **Cushing's Syndrome** — Weight gain + fatigue. Order 24hr UFC, ACTH.
6. **Depression/Mood Disorder** — Overlapping symptoms.

**Recommended Workup:**
- TSH, Free T4, TPO Antibody
- CBC, CMP, HbA1c
- Vitamin D, B12, Ferritin
- Morning Cortisol if BMI > 30

**Priority: TSH is the single best screening test.**`,

  'Interpret the following': `**Laboratory Interpretation Report**

| Parameter | Value | Status | Action |
|-----------|-------|--------|--------|
| HbA1c | 8.2% | 🔴 High | Adjust therapy |
| Fasting Glucose | 186 mg/dL | 🔴 High | Confirm with OGTT |
| LDL Cholesterol | 142 mg/dL | 🟡 Borderline | Consider statin |
| Hemoglobin | 11.2 g/dL | 🟡 Low | Investigate cause |

**Clinical Interpretation:**
- **Glycemic Control:** HbA1c of 8.2% indicates suboptimal glycemic control (target: < 7.0%). Metformin dose escalation or addition of GLP-1 receptor agonist (e.g., semaglutide) should be considered.
- **Lipid Profile:** LDL of 142 mg/dL is above the target of < 100 mg/dL in diabetic patients. Initiate statin therapy (e.g., Atorvastatin 10–20mg).
- **Hematology:** Hb of 11.2 g/dL suggests mild anemia — order Iron studies + B12/Folate.

**Immediate Actions:**
1. Escalate antidiabetic therapy
2. Start Atorvastatin 20mg daily
3. Work up anemia`,

  'Calculate the appropriate': `**Metformin Dosage — Renal Impairment Calculator**

**Patient Data:** Type 2 Diabetes • eGFR: 58 mL/min/1.73m²

**CKD Stage:** Stage 3a (Mild-Moderate)

**Metformin Dosing by eGFR:**
| eGFR (mL/min/1.73m²) | Recommendation |
|----------------------|----------------|
| ≥ 60 | Standard dosing — 500–2550 mg/day |
| 45–59 | **Continue, reduce max dose to 1000 mg/day** |
| 30–44 | Use with caution, 500 mg daily max |
| < 30 | **Contraindicated** |

**For this patient (eGFR 58):**
- ✅ Metformin may be continued
- **Recommended dose:** 500 mg twice daily (max 1000 mg/day)
- **Monitor:** eGFR every 3–6 months
- **Caution:** Hold if contrast media needed; restart 48h post-procedure if eGFR stable

**Alternative if eGFR continues declining:** Consider SGLT-2 inhibitor (Empagliflozin 10mg) — reno-protective benefits in CKD.`,
};

function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-purple-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
      )}
      <div className={`max-w-3xl rounded-2xl px-4 py-3 text-sm ${isUser ? 'bg-accent-blue text-white' : 'bg-dark-section border border-white/[0.08]'}`}>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-inherit break-words">{message.content}</pre>
        {!isUser && (
          <button onClick={handleCopy} className="mt-2 flex items-center gap-1 text-[10px] text-txt-muted hover:text-txt-primary transition-colors">
            <Copy className="w-3 h-3" /> Copy
          </button>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-dark-section border border-white/[0.08] flex items-center justify-center text-txt-muted shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export const DoctorAIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello, Doctor. I\'m your AI Clinical Assistant powered by Gemini.\n\nI can help you with:\n• Drug interaction checks\n• Differential diagnosis generation\n• Lab result interpretation\n• Dosage calculations\n• Clinical decision support\n• Evidence-based treatment guidelines\n\nHow can I assist your clinical practice today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getResponse = (prompt) => {
    const key = Object.keys(AI_RESPONSES).find(k => prompt.startsWith(k));
    if (key) return AI_RESPONSES[key];
    return `**Clinical Query Response**\n\nI've analyzed your query: "${prompt.substring(0, 60)}..."\n\nBased on current clinical guidelines and evidence-based medicine:\n\n1. A thorough patient assessment is recommended.\n2. Consider ordering relevant diagnostic investigations.\n3. Review current medication list for interactions.\n4. Consult specialty guidelines for this condition.\n\n*Note: This AI assistant provides clinical decision support only. All final clinical decisions must be made by the treating physician.*`;
  };

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content) return;

    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');
    setLoading(true);

    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 1200));

    const response = getResponse(content);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared. How can I assist you?' }]);
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-6 h-full flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-txt-primary">AI Clinical Assistant</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-[11px] text-txt-muted">Powered by Gemini 1.5 Pro • Clinical Mode Active</span>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-txt-muted border border-white/[0.08] rounded-xl hover:bg-dark-hover transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Chat
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 shrink-0">
        {QUICK_PROMPTS.map((qp, i) => {
          const Icon = qp.icon;
          return (
            <button
              key={i}
              onClick={() => sendMessage(qp.prompt)}
              className="flex items-center gap-2 px-3 py-2.5 bg-dark-section border border-white/[0.08] hover:border-white/20 hover:bg-dark-hover rounded-xl text-xs font-bold text-txt-secondary transition-all text-left"
            >
              <Icon className="w-3.5 h-3.5 text-accent-blue shrink-0" />
              <span className="truncate">{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-5 bg-dark-section rounded-2xl border border-white/[0.08] mb-4">
        {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 bg-dark-section border border-white/[0.08] rounded-2xl">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-txt-muted animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-end gap-3 shrink-0">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ask a clinical question... (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="flex-1 dark-input rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none leading-relaxed"
        />
        <Button variant="primary" icon={Send} onClick={() => sendMessage()} disabled={!input.trim() || loading}>
          Send
        </Button>
      </div>

      <p className="text-[10px] text-txt-muted text-center mt-2">
        AI Clinical Assistant provides decision support only. Always apply clinical judgment. Not a substitute for professional medical advice.
      </p>
    </div>
  );
};

export default DoctorAIAssistant;
