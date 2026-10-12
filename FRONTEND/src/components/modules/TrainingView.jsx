import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, CheckCircle, Clock, User, 
  ExternalLink, Download, Sparkles, X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TrainingView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [courses, setCourses] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [certModal, setCertModal] = useState(null);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(console.error);
  }, [refreshKey]);

  const handleEnroll = async (courseId) => {
    await api.enrollCourse(courseId, currentUser.employeeId || 'NEX-001');
    setToastMessage("Successfully enrolled in course!");
    triggerRefresh();
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Training & Learning Management (LMS)</h2>
          <p className="text-xs text-slate-500">Statutory POSH compliance, cloud engineering skill paths & leadership certifications</p>
        </div>

        <button
          onClick={() => setCertModal({
            title: "POSH & Prevention of Workplace Harassment (2026 Edition)",
            recipient: currentUser.name,
            date: "October 10, 2026",
            certId: "NEX-LMS-2026-908"
          })}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition self-start sm:self-auto"
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>View My Certificate</span>
        </button>
      </div>

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:border-brand-500/50 transition group">
            <div>
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  c.category.includes('Compliance') ? 'bg-rose-50 text-rose-700' :
                  c.category.includes('Security') ? 'bg-indigo-50 text-indigo-700' :
                  'bg-emerald-50 text-emerald-700'
                }`}>
                  {c.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {c.duration}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 mt-4 group-hover:text-brand-600 transition">
                {c.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5">Instructor: {c.instructor}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{c.lessons} Interactive Modules with Assessment</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-medium">
                <strong>{c.enrolledCount}</strong> Enrolled • <strong>{c.completedCount}</strong> Certified
              </span>

              <button
                onClick={() => handleEnroll(c.id)}
                className="px-3 py-1.5 rounded-xl font-bold text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white transition"
              >
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Certificate Modal */}
      {certModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl relative border-8 border-brand-50">
            <button onClick={() => setCertModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <Award className="w-16 h-16 mx-auto text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Certificate of Completion</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">Nexus Learning Academy</h3>
              <p className="text-xs text-slate-600">This is proudly presented to</p>
              <h4 className="text-2xl font-bold text-brand-600 font-display underline decoration-brand-300 underline-offset-8">
                {certModal.recipient}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-2">
                for successfully completing the course curriculum and passing statutory knowledge verification for
              </p>
              <p className="font-bold text-sm text-slate-900">{certModal.title}</p>

              <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400 font-mono">
                <span>Issued on: {certModal.date}</span>
                <span>Cert ID: {certModal.certId}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
