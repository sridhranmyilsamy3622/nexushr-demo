import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, Award, ThumbsUp, Plus, Sparkles, 
  CheckCircle, MessageSquare, Star, Send, X, Vote
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EngagementView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [kudos, setKudos] = useState([]);
  const [polls, setPolls] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showKudoModal, setShowKudoModal] = useState(false);
  const [kudoForm, setKudoForm] = useState({ to: 'Rohan Verma', badge: 'Rockstar Coder 🚀', message: '' });
  const [showSugModal, setShowSugModal] = useState(false);
  const [sugText, setSugText] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getKudos().then(setKudos).catch(console.error);
    api.getPolls().then(setPolls).catch(console.error);
    api.getSuggestions().then(setSuggestions).catch(console.error);
  }, [refreshKey]);

  const handleGiveKudo = async (e) => {
    e.preventDefault();
    await api.giveKudo({
      from: currentUser.name,
      ...kudoForm
    });
    setShowKudoModal(false);
    setToastMessage(`Kudos badge dispatched to ${kudoForm.to}!`);
    triggerRefresh();
    setKudoForm({ to: 'Rohan Verma', badge: 'Rockstar Coder 🚀', message: '' });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleVote = async (pollId, optIdx) => {
    await api.votePoll(pollId, optIdx);
    setToastMessage("Your vote was cast!");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleAddSuggestion = async (e) => {
    e.preventDefault();
    await api.createSuggestion({
      text: sugText,
      anonymous: isAnon,
      author: currentUser.name
    });
    setShowSugModal(false);
    setToastMessage("Suggestion added to the employee ideation board!");
    triggerRefresh();
    setSugText('');
    setTimeout(() => setToastMessage(''), 3000);
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
          <h2 className="text-xl font-bold text-slate-900 font-display">Employee Engagement & Culture Hub</h2>
          <p className="text-xs text-slate-500">Peer kudos recognition, live company pulse polls, suggestions & culture scoring</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSugModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
          >
            Post Suggestion
          </button>
          <button
            onClick={() => setShowKudoModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Give Kudos Badge</span>
          </button>
        </div>
      </div>

      {/* Engagement Score & Culture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Employee Net Promoter Score (eNPS)</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-emerald-600 font-display">+74</h3>
            <span className="text-xs text-slate-400">World-Class Benchmarking</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">92% would recommend Nexus as a great workplace</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Kudos Dispatched this Month</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-brand-600 font-display">{kudos.length * 7}</h3>
            <span className="text-xs text-slate-400">Peer recognitions</span>
          </div>
          <p className="text-[11px] text-brand-600 font-semibold mt-1">High team collaboration pulse</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Polls Participation</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-indigo-600 font-display">
              {polls.reduce((acc, p) => acc + p.totalVotes, 0)}
            </h3>
            <span className="text-xs text-slate-400">Total votes cast</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Quarterly offsite & initiative polling</p>
        </div>
      </div>

      {/* Main Grid: Kudos Wall on Left, Polls & Suggestions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Kudos Wall */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Live Peer Recognition & Kudos Wall
              </h3>
              <span className="text-xs text-slate-400 font-medium">{kudos.length} Badges Awarded</span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {kudos.map((k) => (
                <div key={k.id} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs shadow-xs">
                        {k.badge}
                      </span>
                      <span className="text-[10px] text-slate-400">{k.date}</span>
                    </div>

                    <p className="text-xs text-slate-700 mt-3 italic leading-relaxed">
                      "{k.message}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 text-[11px] flex items-center justify-between">
                    <span className="text-slate-500">From: <strong className="text-slate-800">{k.from}</strong></span>
                    <span className="text-slate-500">To: <strong className="text-brand-600 font-bold">{k.to}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Polls & Suggestion Box */}
        <div className="space-y-6">
          {/* Live Pulse Poll */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
              <Vote className="w-4 h-4 text-brand-600" />
              Company Pulse Poll
            </h3>

            {polls.map((p) => (
              <div key={p.id} className="space-y-3 text-xs">
                <p className="font-semibold text-slate-800 leading-snug">{p.question}</p>
                <div className="space-y-2">
                  {p.options.map((opt, optIdx) => {
                    const pct = p.totalVotes > 0 ? Math.round((opt.votes / p.totalVotes) * 100) : 0;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleVote(p.id, optIdx)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 cursor-pointer transition relative overflow-hidden group"
                      >
                        <div
                          className="absolute inset-0 bg-brand-50 opacity-40 group-hover:opacity-70 transition"
                          style={{ width: `${pct}%` }}
                        ></div>
                        <div className="relative flex justify-between items-center font-medium">
                          <span className="text-slate-800">{opt.text}</span>
                          <span className="font-mono font-bold text-brand-700">{pct}% ({opt.votes})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 text-right">Total Votes: {p.totalVotes} • Click any option to vote</p>
              </div>
            ))}
          </div>

          {/* Suggestion Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Suggestion Box
            </h3>

            <div className="space-y-3 text-xs">
              {suggestions.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <p className="text-slate-800 font-medium">"{s.text}"</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>By: {s.author}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {s.upvotes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Give Kudo Modal */}
      {showKudoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Send Kudos & Recognition Badge</h3>
              <button onClick={() => setShowKudoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGiveKudo} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recognize Colleague</label>
                <select
                  value={kudoForm.to}
                  onChange={e => setKudoForm({ ...kudoForm, to: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Rohan Verma (Senior Frontend Engineer)</option>
                  <option>Ananya Deshmukh (Lead UI/UX Designer)</option>
                  <option>Kavita Rao (HR Specialist)</option>
                  <option>Karthik Subramanian (Cloud Architect)</option>
                  <option>Sneha Mukherjee (Content Specialist)</option>
                  <option>Priya Nair (Engineering Director)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kudos Badge Category</label>
                <select
                  value={kudoForm.badge}
                  onChange={e => setKudoForm({ ...kudoForm, badge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Rockstar Coder 🚀</option>
                  <option>Design Wizard 🎨</option>
                  <option>Culture Champion 🌟</option>
                  <option>Problem Solver 💡</option>
                  <option>Super Mentor 🤝</option>
                  <option>Customer Hero 🦸</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Appreciation Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share what makes their contribution special..."
                  value={kudoForm.message}
                  onChange={e => setKudoForm({ ...kudoForm, message: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Dispatched Kudos to Wall
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Suggestion Modal */}
      {showSugModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Submit a Workplace Suggestion</h3>
              <button onClick={() => setShowSugModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSuggestion} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Idea / Improvement</label>
                <textarea
                  rows={4}
                  required
                  placeholder="What would make working at Nexus even more fulfilling and effective?"
                  value={sugText}
                  onChange={e => setSugText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnon}
                  onChange={e => setIsAnon(e.target.checked)}
                  className="rounded text-brand-600"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-700 font-semibold">
                  Post anonymously
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Submit to Suggestion Box
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
