import React from 'react';
import { Activity, Database, CheckCircle2, AlertTriangle, Sparkles, FileText, UserPlus, Server } from 'lucide-react';

export const LiveActivityFeed = () => {
  const activities = [
    { id: 1, type: 'upload', title: 'Hospital A uploaded patients.csv', detail: 'Ingested 10,000 raw rows to Bronze storage layer', time: '2 mins ago', icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { id: 2, type: 'etl', title: 'PySpark Silver Clean Completed', detail: 'Deduplicated keys & imputed median missing ages', time: '5 mins ago', icon: Database, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' },
    { id: 3, type: 'airflow', title: 'Airflow DAG Executed Successfully', detail: 'healthcare_medallion_etl_dag finished in 12.4s', time: '8 mins ago', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { id: 4, type: 'quality', title: 'Great Expectations Quality Score Updated', detail: 'Overall dataset quality assertion score reached 99.8%', time: '12 mins ago', icon: Activity, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { id: 5, type: 'ai', title: 'AI Generated Executive Insight', detail: 'Cardiology admissions increased by 15% across network', time: '15 mins ago', icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    { id: 6, type: 'admission', title: 'New Inpatient Admitted', detail: 'Patient Emily Watson assigned to Dr. Alexander Wright', time: '18 mins ago', icon: UserPlus, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-health-600 dark:text-health-400 animate-pulse" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Live Activity Feed</h3>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
          Real-Time Stream
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((item) => {
          const IconComp = item.icon;
          return (
            <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-start space-x-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                <IconComp className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
