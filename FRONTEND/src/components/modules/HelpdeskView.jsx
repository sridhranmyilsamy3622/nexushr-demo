import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, Plus, CheckCircle, Clock, MessageSquare, 
  Send, X, AlertCircle, Check, User
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function HelpdeskView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [ticketForm, setTicketForm] = useState({
    category: 'Payroll & Tax',
    subject: '',
    priority: 'Medium',
    message: ''
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getTickets().then(data => {
      setTickets(data);
      if (selectedTicket) {
        const updated = data.find(t => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    }).catch(console.error);
  }, [refreshKey]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    await api.createTicket({
      ...ticketForm,
      employeeId: currentUser.employeeId || 'NEX-003'
    });
    setShowCreateModal(false);
    setToastMessage("HR Support ticket raised successfully!");
    triggerRefresh();
    setTicketForm({ category: 'Payroll & Tax', subject: '', priority: 'Medium', message: '' });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    await api.replyTicket(selectedTicket.id, {
      sender: currentUser.name,
      role: currentUser.role,
      text: replyText
    });
    setReplyText('');
    triggerRefresh();
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    await api.updateTicketStatus(ticketId, newStatus);
    setToastMessage(`Ticket #${ticketId} status changed to ${newStatus}`);
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 2500);
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
          <h2 className="text-xl font-bold text-slate-900 font-display">HR Helpdesk & Employee Requests</h2>
          <p className="text-xs text-slate-500">Fast resolution for payroll queries, IT equipment, PF transfers & benefit questions</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Request</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Active Support Tickets</h3>
          <span className="text-xs text-slate-500 font-semibold">{tickets.length} Tickets Registered</span>
        </div>

        <div className="divide-y divide-slate-100">
          {tickets.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="p-4 sm:px-6 hover:bg-slate-50/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-400">#{t.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {t.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                    t.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {t.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    t.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.priority}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 mt-1.5 group-hover:text-brand-600 transition">
                  {t.subject}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Raised by: {t.employeeName} • {t.createdAt}</p>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.messages?.length || 0}</span>
                </span>
                <span className="text-xs font-semibold text-brand-600 group-hover:underline">
                  View Thread →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Conversation Thread Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-400">#{selectedTicket.id}</span>
                  <span className="font-bold text-sm text-slate-900">{selectedTicket.subject}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Category: {selectedTicket.category} • Raised by: {selectedTicket.employeeName}</p>
              </div>

              <div className="flex items-center space-x-2">
                {currentUser.role !== 'employee' && (
                  <select
                    value={selectedTicket.status}
                    onChange={e => handleUpdateStatus(selectedTicket.id, e.target.value)}
                    className="text-xs border rounded-xl px-2.5 py-1 font-semibold focus:outline-none focus:border-brand-500"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                )}
                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              {selectedTicket.messages?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl max-w-[85%] ${
                    msg.role === 'admin'
                      ? 'bg-brand-50 border border-brand-200/80 ml-auto'
                      : 'bg-slate-100 border border-slate-200 mr-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-bold text-slate-900">{msg.sender} ({msg.role === 'admin' ? 'HR Operations' : 'Employee'})</span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-white flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your response or update..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs border rounded-xl focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 transition flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Create New HR Request</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Request Category</label>
                <select
                  value={ticketForm.category}
                  onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Payroll & Tax</option>
                  <option>IT Equipment</option>
                  <option>Leave Correction</option>
                  <option>Company Benefits & Insurance</option>
                  <option>HR Policy Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Query regarding Form 16 Part B deduction"
                  value={ticketForm.subject}
                  onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue with all required particulars..."
                  value={ticketForm.message}
                  onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Submit HR Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
