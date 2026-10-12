import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Download, Search, AlertCircle, 
  CheckCircle, Plus, X, ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DocumentsView() {
  const { triggerRefresh, refreshKey } = useAuth();
  const [docs, setDocs] = useState([]);
  const [category, setCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Company Policy',
    size: '1.8 MB',
    expiryDate: 'None',
    access: 'All Employees'
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getDocuments().then(setDocs).catch(console.error);
  }, [refreshKey]);

  const handleUpload = async (e) => {
    e.preventDefault();
    await api.uploadDocument(uploadForm);
    setShowUploadModal(false);
    setToastMessage("Document uploaded successfully to corporate repository!");
    triggerRefresh();
    setUploadForm({ title: '', category: 'Company Policy', size: '1.8 MB', expiryDate: 'None', access: 'All Employees' });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const categories = ['All', 'Company Policy', 'Benefits', 'Tax Documents', 'Contracts'];
  const filtered = category === 'All' ? docs : docs.filter(d => d.category === category);

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
          <h2 className="text-xl font-bold text-slate-900 font-display">Employee & Corporate Document Vault</h2>
          <p className="text-xs text-slate-500">Secure storage for legal policies, Form 16 certificates, NDAs & compliance contracts</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 shrink-0 ml-1">Category:</span>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              category === c ? 'bg-brand-600 text-white font-semibold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <div key={d.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-brand-500/50 transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {d.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{d.size}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mt-3">{d.title}</h4>
              <p className="text-xs text-slate-500 mt-1">Uploaded: {d.uploadDate}</p>

              {d.expiryDate !== 'None' && (
                <div className="mt-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Valid until: {d.expiryDate}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{d.access}</span>
              <button
                onClick={() => {
                  setToastMessage(`Downloading ${d.title}...`);
                  setTimeout(() => setToastMessage(''), 2000);
                }}
                className="px-3 py-1.5 rounded-xl font-semibold text-brand-600 hover:bg-brand-50 transition flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Upload Corporate Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel & Daily Allowance Policy 2026"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={uploadForm.category}
                  onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Company Policy</option>
                  <option>Benefits</option>
                  <option>Tax Documents</option>
                  <option>Contracts</option>
                  <option>Identity & KYC</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Access Level</label>
                <select
                  value={uploadForm.access}
                  onChange={e => setUploadForm({ ...uploadForm, access: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>All Employees</option>
                  <option>Managers Only</option>
                  <option>Confidential (HR Admin Only)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Upload & Publish to Repository
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
