import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, Trophy, TrendingUp, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({
        totalSessions: 0,
        avgScore: 0,
        totalQuestions: 0
    });

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
        setHistory(savedHistory.reverse()); // Show newest first

        if (savedHistory.length > 0) {
            const totalSessions = savedHistory.length;
            const totalScore = savedHistory.reduce((acc, curr) => acc + (curr.score || 0), 0);
            const totalQuestions = savedHistory.reduce((acc, curr) => acc + (curr.questions || 0), 0);

            setStats({
                totalSessions,
                avgScore: (totalScore / totalSessions).toFixed(1),
                totalQuestions
            });
        }
    }, []);

    const clearDashboard = () => {
        if (window.confirm('Are you sure you want to clear all your interview history? This action cannot be undone.')) {
            localStorage.removeItem('interviewHistory');
            setHistory([]);
            setStats({
                totalSessions: 0,
                avgScore: 0,
                totalQuestions: 0
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-4 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-xl md:text-2xl font-bold text-white">Performance Dashboard</h1>
                {history.length > 0 && (
                    <button
                        onClick={clearDashboard}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-xl transition-colors text-sm font-medium border border-red-500/20"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Dashboard
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 flex-shrink-0">
                <StatCard
                    icon={<Trophy className="w-6 h-6 text-yellow-400" />}
                    label="Average Score"
                    value={`${stats.avgScore}/10`}
                />
                <StatCard
                    icon={<Clock className="w-6 h-6 text-blue-400" />}
                    label="Total Sessions"
                    value={stats.totalSessions}
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                    label="Questions Answered"
                    value={stats.totalQuestions}
                />
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 flex flex-col flex-grow min-h-0">
                <h2 className="text-base md:text-lg font-bold text-white mb-3 flex items-center gap-2 flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    Recent Activity
                </h2>

                {history.length === 0 ? (
                    <div className="text-center flex-grow flex items-center justify-center text-sm text-slate-400">
                        No interview sessions yet. Start one to see your progress!
                    </div>
                ) : (
                    <div className="overflow-auto flex-grow min-h-0">
                        <table className="w-full text-left text-sm md:text-base">
                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400">
                                    <th className="pb-3 pl-4">Date</th>
                                    <th className="pb-3">Score</th>
                                    <th className="pb-3">Questions</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {history.map((session, index) => (
                                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="py-3 pl-4 text-slate-300">
                                            {new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString()}
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${session.score >= 8 ? 'bg-green-500/10 text-green-400' :
                                                session.score >= 5 ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-400'
                                                }`}>
                                                {session.score ? session.score.toFixed(1) : '0.0'}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-300">{session.questions}</td>
                                        <td className="py-3 text-slate-300">Completed</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-slate-700/50 rounded-lg">
                {icon}
            </div>
            <span className="text-slate-400 font-medium text-xs md:text-sm">{label}</span>
        </div>
        <div className="text-xl md:text-2xl font-bold text-white pl-1">{value}</div>
    </div>
);

export default Dashboard;
