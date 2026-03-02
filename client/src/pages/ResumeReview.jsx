import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const ResumeReview = () => {
    const [resumeText, setResumeText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        if (!resumeText.trim()) return;

        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/resume`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeText }),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 flex-shrink-0 flex items-center gap-3">
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                AI Resume Review
            </h1>

            <div className="grid md:grid-cols-2 gap-6 flex-grow min-h-0 pb-6">
                <div className="flex flex-col h-full">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col h-full">
                        <label className="block text-slate-300 font-medium mb-3 flex-shrink-0">
                            Paste your resume content here
                        </label>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            className="w-full flex-grow bg-slate-900 border-slate-700 rounded-xl p-4 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm min-h-0"
                            placeholder="Experience&#10;- Senior Developer at Tech Co...&#10;&#10;Education&#10;- BS Computer Science..."
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !resumeText.trim()}
                            className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Analyze Resume
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col h-full min-h-0">
                    {result ? (
                        <div className="flex flex-col h-full animate-fade-in shadow-lg">
                            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col h-full overflow-y-auto">
                                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                                    <h3 className="text-xl font-bold text-white">Analysis Result</h3>
                                    <div className={`px-4 py-1 rounded-full text-base font-bold ${result.score >= 80 ? 'bg-green-500/10 text-green-400' :
                                        result.score >= 60 ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                        Score: {result.score}/100
                                    </div>
                                </div>

                                <div className="mb-5 flex-shrink-0">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Summary</h4>
                                    <p className="text-slate-200">{result.summary}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Suggested Improvements</h4>
                                    <ul className="space-y-3">
                                        {result.improvements.map((item, index) => (
                                            <li key={index} className="flex gap-3 text-slate-300 bg-slate-700/30 p-3 rounded-lg">
                                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 border-2 border-dashed border-slate-700 rounded-2xl flex-grow">
                            <FileText className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-center">Paste your resume text and click Analyze to get AI-powered feedback.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeReview;
