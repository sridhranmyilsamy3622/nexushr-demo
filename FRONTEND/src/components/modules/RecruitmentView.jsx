import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Briefcase, Plus, Search, Calendar, 
  CheckCircle, ArrowRight, Star, Mail, Phone, X, Award,
  Clock, FileText, Send
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RecruitmentView() {
  const { triggerRefresh, refreshKey, setActiveTab } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [activeJobId, setActiveJobId] = useState('all');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(null);
  const [scheduleData, setScheduleData] = useState({ date: '2026-10-15', time: '11:00 AM', interviewer: 'Priya Nair' });
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Engineering',
    location: 'Bengaluru HQ (Hybrid)',
    type: 'Full-Time',
    experience: '4-7 Years',
    salaryRange: '₹18,00,000 - ₹26,00,000 PA',
    openings: 1,
    description: ''
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getJobs().then(setJobs).catch(console.error);
    api.getCandidates().then(setCandidates).catch(console.error);
  }, [refreshKey]);

  const stages = [
    { id: 'Applied', label: 'Applied', color: 'bg-slate-100 text-slate-700' },
    { id: 'Screening', label: 'Screening', color: 'bg-blue-50 text-blue-700' },
    { id: 'Technical Interview', label: 'Tech Round', color: 'bg-purple-50 text-purple-700' },
    { id: 'HR Round', label: 'HR Round', color: 'bg-amber-50 text-amber-700' },
    { id: 'Offered', label: 'Offered', color: 'bg-emerald-50 text-emerald-700' },
    { id: 'Hired', label: 'Hired', color: 'bg-indigo-50 text-indigo-700' }
  ];

  const handleStageMove = async (candidateId, nextStage) => {
    await api.updateCandidateStage(candidateId, nextStage);
    setToastMessage(`Moved candidate to ${nextStage}`);
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    await api.createJob(newJob);
    setShowJobModal(false);
    setToastMessage("New job opening published successfully!");
    triggerRefresh();
    setNewJob({
      title: '',
      department: 'Engineering',
      location: 'Bengaluru HQ (Hybrid)',
      type: 'Full-Time',
      experience: '4-7 Years',
      salaryRange: '₹18,00,000 - ₹26,00,000 PA',
      openings: 1,
      description: ''
    });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    await api.scheduleInterview({
      candidateId: showScheduleModal.id,
      ...scheduleData
    });
    setShowScheduleModal(null);
    setToastMessage("Interview scheduled! Calendar invite and Google Meet link dispatched.");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredCandidates = activeJobId === 'all' 
    ? candidates 
    : candidates.filter(c => c.jobId === activeJobId);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Recruitment & ATS Pipeline</h2>
          <p className="text-xs text-slate-500">End-to-end applicant tracking, Kanban pipeline, interview scheduler & offer rollout</p>
        </div>

        <button
          onClick={() => setShowJobModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Active Jobs Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 shrink-0 ml-1">Filter by Job:</span>
        <button
          onClick={() => setActiveJobId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeJobId === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Openings ({candidates.length})
        </button>
        {jobs.map(j => (
          <button
            key={j.id}
            onClick={() => setActiveJobId(j.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeJobId === j.id ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {j.title} ({candidates.filter(c => c.jobId === j.id).length})
          </button>
        ))}
      </div>

      {/* ATS Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map((stg, stgIdx) => {
          const stageCandidates = filteredCandidates.filter(c => c.stage === stg.id);

          return (
            <div key={stg.id} className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 min-w-[240px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${stg.color}`}>
                    {stg.label}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards in this Stage */}
                <div className="space-y-3">
                  {stageCandidates.map((cand) => (
                    <div key={cand.id} className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-2 hover:border-brand-500 transition">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-slate-900">{cand.name}</h4>
                        <div className="flex items-center text-amber-500 text-[11px] font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          <span>{cand.rating}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500">{cand.currentCompany} • {cand.experience}</p>
                      
                      {cand.offerCtc && (
                        <div className="p-1.5 bg-emerald-50 rounded-lg text-[10px] font-bold text-emerald-800">
                          Offer: {cand.offerCtc}
                        </div>
                      )}

                      {cand.interviewScheduled && (
                        <p className="text-[10px] text-purple-700 bg-purple-50 p-1.5 rounded-lg flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3" />
                          <span>{cand.interviewScheduled}</span>
                        </p>
                      )}

                      <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                        "{cand.notes}"
                      </p>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <button
                          onClick={() => setShowScheduleModal(cand)}
                          className="text-brand-600 hover:text-brand-800 font-semibold"
                        >
                          Schedule
                        </button>

                        {stgIdx < stages.length - 1 && (
                          <button
                            onClick={() => handleStageMove(cand.id, stages[stgIdx + 1].id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded font-bold transition flex items-center space-x-1"
                          >
                            <span>Move →</span>
                          </button>
                        )}
                        {stg.id === 'Hired' && (
                          <button
                            onClick={() => setActiveTab('onboarding')}
                            className="px-2 py-1 bg-emerald-600 text-white rounded font-bold transition"
                          >
                            Onboard
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Schedule Interview: {showScheduleModal.name}</h3>
              <button onClick={() => setShowScheduleModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Interview Date</label>
                <input
                  type="date"
                  required
                  value={scheduleData.date}
                  onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Time Slot (IST)</label>
                <input
                  type="text"
                  required
                  value={scheduleData.time}
                  onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lead Interviewer</label>
                <select
                  value={scheduleData.interviewer}
                  onChange={e => setScheduleData({ ...scheduleData, interviewer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Priya Nair (Engineering Director)</option>
                  <option>Aarav Sharma (VP HR)</option>
                  <option>Rohan Verma (Staff Engineer)</option>
                  <option>Karthik Subramanian (Cloud Architect)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30 flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Send Calendar Invite</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Publish New Job Opening</h3>
              <button onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Mobile App Architect"
                  value={newJob.title}
                  onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={newJob.department}
                    onChange={e => setNewJob({ ...newJob, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  >
                    <option>Engineering</option>
                    <option>Product & Design</option>
                    <option>Human Resources</option>
                    <option>Finance & Accounts</option>
                    <option>Marketing & Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Work Location</label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salary Range</label>
                  <input
                    type="text"
                    required
                    value={newJob.salaryRange}
                    onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Open Positions</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newJob.openings}
                    onChange={e => setNewJob({ ...newJob, openings: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role Description & Key Responsibilities</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key deliverables, tech stack, and experience qualifications..."
                  value={newJob.description}
                  onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Broadcast Job Opening to ATS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
