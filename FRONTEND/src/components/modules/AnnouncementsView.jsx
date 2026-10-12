import React, { useState, useEffect } from 'react';
import { 
  Bell, Plus, CheckCircle, Pin, Calendar, 
  Sparkles, Megaphone, X, Gift, Award
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AnnouncementsView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Company Event',
    content: '',
    pinned: false
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getAnnouncements().then(setAnnouncements).catch(console.error);
  }, [refreshKey]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.createAnnouncement({
      ...form,
      author: `${currentUser.name} (${currentUser.designation})`
    });
    setShowModal(false);
    setToastMessage("Announcement broadcasted successfully to all employees!");
    triggerRefresh();
    setForm({ title: '', category: 'Company Event', content: '', pinned: false });
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
          <h2 className="text-xl font-bold text-slate-900 font-display">Company News & Announcements</h2>
          <p className="text-xs text-slate-500">Official bulletins, festive event notifications, HR updates & policy broadcasts</p>
        </div>

        {currentUser.role !== 'employee' && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition self-start sm:self-auto"
          >
            <Megaphone className="w-4 h-4" />
            <span>Broadcast Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className={`bg-white rounded-3xl border p-6 transition shadow-xs ${
              anc.pinned ? 'border-brand-500/80 bg-brand-50/20 ring-1 ring-brand-500/20' : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  anc.category.includes('Event') ? 'bg-amber-50 text-amber-700' :
                  anc.category.includes('Policy') ? 'bg-indigo-50 text-indigo-700' :
                  'bg-emerald-50 text-emerald-700'
                }`}>
                  {anc.category}
                </span>
                {anc.pinned && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-100 text-brand-800 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned Priority
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-medium">{anc.date}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-3 font-display">{anc.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{anc.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Author: <strong>{anc.author}</strong></span>
              <span className="text-brand-600 font-semibold">Broadcasting to All Branches</span>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Broadcast Company Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual All-Hands Offsite & Award Ceremony"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Company Event</option>
                  <option>Policy Update</option>
                  <option>HR Updates</option>
                  <option>Emergency Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear, engaging details for the entire organization..."
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={form.pinned}
                  onChange={e => setForm({ ...form, pinned: e.target.checked })}
                  className="rounded text-brand-600"
                />
                <label htmlFor="pinnedCheck" className="text-xs text-slate-700 font-semibold">
                  Pin to top of employee dashboard
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Publish & Notify All Employees
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
