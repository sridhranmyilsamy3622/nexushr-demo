import React, { useState, useEffect } from 'react';
import { 
  Award, Target, Star, TrendingUp, CheckCircle, 
  Sparkles, Plus, ChevronRight, UserCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PerformanceView() {
  const { triggerRefresh, refreshKey } = useAuth();
  const [goals, setGoals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getGoals().then(setGoals).catch(console.error);
    api.getReviews().then(setReviews).catch(console.error);
  }, [refreshKey]);

  const updateGoalProgress = async (id, newProgress) => {
    await api.updateGoal(id, { progress: newProgress });
    setToastMessage("Goal progress updated!");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Performance Management & OKRs</h2>
          <p className="text-xs text-slate-500">Continuous goals tracking, 360-degree feedback, appraisal cycles & promotion recommendations</p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 self-start sm:self-auto">
          Active Cycle: Annual Appraisal 2026
        </span>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Organization Rating</span>
          <div className="mt-2 flex items-center space-x-2">
            <h3 className="text-3xl font-extrabold text-amber-500 font-display">4.6</h3>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on 360-degree peer and manager evaluations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Goals On Track</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-brand-600 font-display">88%</h3>
            <span className="text-xs text-slate-400">Quarterly OKRs</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% vs last quarter</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Appraisal Completion</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-emerald-600 font-display">95%</h3>
            <span className="text-xs text-slate-400">Reviews finalized</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for merit increment processing</p>
        </div>
      </div>

      {/* Goals & Key Results Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" />
              Active Strategic Goals & OKRs
            </h3>
            <p className="text-xs text-slate-500">Drag sliders to adjust key result milestone progress</p>
          </div>
        </div>

        <div className="space-y-4">
          {goals.map((g) => (
            <div key={g.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-xs text-slate-900">{g.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-50 text-brand-700">
                      Weight: {g.weightage}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                      {g.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Assigned to: <strong>{g.employeeName}</strong> • Target: {g.targetDate}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-brand-600 font-mono">{g.progress}%</span>
                </div>
              </div>

              {/* Interactive Range Slider */}
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={g.progress}
                  onChange={e => updateGoalProgress(g.id, e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 360 Reviews & Promotion Recommendations */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Completed 360° Appraisal Reviews & Merit Outcomes
        </h3>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{r.employeeName}</h4>
                  <p className="text-[11px] text-slate-500">{r.cycle} • Evaluator: {r.managerName}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-600">Final Score:</span>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {r.finalScore} / 5.0
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic">
                "{r.feedback}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Recommendation: {r.promotionRecommendation}</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 font-semibold">
                  Merit Bonus Multiplier: {r.bonusMultiplier}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
