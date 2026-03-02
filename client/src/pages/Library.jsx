import React, { useState, useEffect } from 'react';
import { FileText, Save, Trash2, Clock, Plus, X } from 'lucide-react';

const Library = () => {
    const [resumeText, setResumeText] = useState('');
    const [resumeTitle, setResumeTitle] = useState('');
    const [savedResumes, setSavedResumes] = useState([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedResumes') || '[]');
        setSavedResumes(saved);
    }, []);

    const saveResume = () => {
        if (!resumeText.trim()) return;
        const finalTitle = resumeTitle.trim() || 'Untitled Resume';
        const newResume = {
            id: Date.now(),
            date: new Date().toISOString(),
            title: finalTitle,
            content: resumeText,
            preview: resumeText.substring(0, 100).replace(/\n/g, ' ') + "..."
        };
        const updated = [newResume, ...savedResumes];
        setSavedResumes(updated);
        localStorage.setItem('savedResumes', JSON.stringify(updated));
        setResumeText('');
        setResumeTitle(''); // Clear input after saving to allow for a new resume
        setIsEditorOpen(false);
    };

    const loadResume = (resumeObj) => {
        setResumeText(resumeObj.content);
        setResumeTitle(resumeObj.title || '');
        setIsEditorOpen(true);
    };

    const deleteResume = (id) => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            const updated = savedResumes.filter(r => r.id !== id);
            setSavedResumes(updated);
            localStorage.setItem('savedResumes', JSON.stringify(updated));
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-400" />
                    Resume Library
                </h1>
                <button
                    onClick={() => setIsEditorOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-5 h-5" /> Add Resume
                </button>
            </div>

            {savedResumes.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed mb-12">
                    <FileText className="w-16 h-16 mx-auto text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No resumes saved yet</h3>
                    <p className="text-slate-400 mb-6">Add your first resume below to start building your library.</p>
                    <button
                        onClick={() => setIsEditorOpen(true)}
                        className="mx-auto px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Add First Resume
                    </button>
                </div>
            ) : (
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center gap-2">
                        <Save className="w-6 h-6 text-indigo-400" /> Your Saved Resumes
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {savedResumes.map((resume) => (
                            <div key={resume.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between h-56">
                                <div>
                                    <h3 className="text-white font-bold mb-2 truncate">{resume.title || 'Untitled Resume'}</h3>
                                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-3 bg-slate-900/50 w-fit px-2 py-1 rounded-md">
                                        <Clock className="w-3 h-3" />
                                        {new Date(resume.date).toLocaleDateString()} at {new Date(resume.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <p className="text-slate-300 text-sm font-mono line-clamp-4 leading-relaxed tracking-tight">"{resume.preview}"</p>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
                                    <button
                                        onClick={() => loadResume(resume)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteResume(resume.id)}
                                        className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isEditorOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <label className="block text-xl font-bold text-white">
                                {resumeText.trim() ? 'Edit Resume' : 'Add New Resume'}
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { setIsEditorOpen(false); setResumeText(''); setResumeTitle(''); }}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-transparent"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={saveResume}
                                    disabled={!resumeText.trim()}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    <Save className="w-5 h-5" /> Save
                                </button>
                            </div>
                        </div>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                                placeholder="Resume Title (e.g. Frontend Dev Variant)"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                className="w-full h-[400px] bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                                placeholder="Paste your resume content here...&#10;&#10;Experience&#10;- Senior Developer at Tech Co...&#10;- Developed scalable architecture...&#10;&#10;Education&#10;- BS Computer Science..."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
