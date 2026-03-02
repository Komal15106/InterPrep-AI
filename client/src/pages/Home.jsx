import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, BrainCircuit, FileText, Code, Terminal, Database, Cpu, Sparkles, MessageSquare, Briefcase, Network, Globe, Blocks } from 'lucide-react';

const Home = () => {
    // Mouse movement physics for parallax background
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    const x1 = useTransform(smoothX, [-1, 1], [-30, 30]);
    const y1 = useTransform(smoothY, [-1, 1], [-30, 30]);

    const x2 = useTransform(smoothX, [-1, 1], [40, -40]);
    const y2 = useTransform(smoothY, [-1, 1], [40, -40]);

    const x3 = useTransform(smoothX, [-1, 1], [-60, 60]);
    const y3 = useTransform(smoothY, [-1, 1], [-60, 60]);

    const x4 = useTransform(smoothX, [-1, 1], [25, -25]);
    const y4 = useTransform(smoothY, [-1, 1], [25, -25]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative h-[calc(100vh-80px)] py-6 flex flex-col items-center justify-center text-center px-4 overflow-hidden">

            {/* Interactive Background Parallax Icons */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Layer 1 */}
                <motion.div style={{ x: x1, y: y1 }} className="absolute top-[10%] left-[10%] parallax-icon-blue"><Code className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x2, y: y1 }} className="absolute bottom-[20%] right-[15%] parallax-icon-emerald"><CheckCircle className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x3, y: y2 }} className="absolute top-[35%] right-[25%] parallax-icon-blue"><Database className="w-6 h-6" /></motion.div>
                <motion.div style={{ x: x4, y: y4 }} className="absolute bottom-[40%] left-[8%] parallax-icon-emerald"><Network className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x1, y: y3 }} className="absolute bottom-[10%] left-[25%] parallax-icon-blue"><Briefcase className="w-5 h-5" /></motion.div>

                {/* Layer 2 */}
                <motion.div style={{ x: x2, y: y2 }} className="absolute top-[18%] right-[8%] parallax-icon-violet"><Terminal className="w-6 h-6" /></motion.div>
                <motion.div style={{ x: x3, y: y3 }} className="absolute bottom-[15%] left-[15%] parallax-icon-pink"><Cpu className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x4, y: y1 }} className="absolute top-[45%] left-[5%] parallax-icon-violet"><Sparkles className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x1, y: y4 }} className="absolute bottom-[30%] right-[5%] parallax-icon-pink"><BrainCircuit className="w-6 h-6" /></motion.div>
                <motion.div style={{ x: x2, y: y3 }} className="absolute top-[65%] right-[35%] parallax-icon-violet"><MessageSquare className="w-5 h-5" /></motion.div>

                {/* Layer 3 */}
                <motion.div style={{ x: x3, y: y1 }} className="absolute top-[5%] right-[40%] parallax-icon-amber"><Zap className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x4, y: y2 }} className="absolute bottom-[5%] right-[45%] parallax-icon-amber"><Globe className="w-6 h-6" /></motion.div>
                <motion.div style={{ x: x1, y: y1 }} className="absolute top-[25%] left-[35%] parallax-icon-blue"><Blocks className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x2, y: y4 }} className="absolute top-[75%] left-[30%] parallax-icon-pink"><FileText className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x3, y: y4 }} className="absolute bottom-[50%] right-[10%] parallax-icon-emerald"><Cpu className="w-4 h-4" /></motion.div>

                {/* Additional Layer for density */}
                <motion.div style={{ x: x4, y: y3 }} className="absolute top-[12%] left-[55%] parallax-icon-pink"><Code className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x1, y: y2 }} className="absolute bottom-[28%] left-[45%] parallax-icon-violet"><Database className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x2, y: y1 }} className="absolute top-[40%] right-[10%] parallax-icon-amber"><Terminal className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x3, y: y1 }} className="absolute top-[60%] left-[15%] parallax-icon-blue"><Network className="w-6 h-6" /></motion.div>
                <motion.div style={{ x: x4, y: y2 }} className="absolute bottom-[10%] right-[65%] parallax-icon-emerald"><Sparkles className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x1, y: y4 }} className="absolute top-[80%] right-[20%] parallax-icon-pink"><BrainCircuit className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x2, y: y3 }} className="absolute top-[28%] left-[80%] parallax-icon-emerald"><Zap className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x3, y: y4 }} className="absolute bottom-[65%] left-[3%] parallax-icon-amber"><MessageSquare className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x4, y: y1 }} className="absolute top-[2%] left-[30%] parallax-icon-blue"><Globe className="w-5 h-5" /></motion.div>

                {/* Even More Density Layer 5 */}
                <motion.div style={{ x: x1, y: y1 }} className="absolute top-[18%] left-[30%] parallax-icon-pink"><FileText className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x2, y: y4 }} className="absolute bottom-[35%] left-[20%] parallax-icon-amber"><Database className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x3, y: y2 }} className="absolute top-[50%] right-[20%] parallax-icon-blue"><Cpu className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x4, y: y3 }} className="absolute bottom-[18%] right-[30%] parallax-icon-violet"><Briefcase className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x2, y: y1 }} className="absolute top-[8%] right-[60%] parallax-icon-emerald"><Terminal className="w-5 h-5" /></motion.div>

                {/* Super Dense Layer 6 */}
                <motion.div style={{ x: x4, y: y4 }} className="absolute bottom-[5%] left-[35%] parallax-icon-blue"><Globe className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x1, y: y2 }} className="absolute top-[55%] left-[45%] parallax-icon-pink"><Code className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x3, y: y3 }} className="absolute top-[35%] left-[65%] parallax-icon-amber"><Zap className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x2, y: y1 }} className="absolute bottom-[80%] right-[5%] parallax-icon-emerald"><MessageSquare className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x1, y: y4 }} className="absolute bottom-[40%] right-[40%] parallax-icon-blue"><BrainCircuit className="w-4 h-4" /></motion.div>

                {/* Layer 7: Far Left Fill */}
                <motion.div style={{ x: x3, y: y2 }} className="absolute top-[15%] left-[2%] parallax-icon-emerald"><Database className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x2, y: y3 }} className="absolute bottom-[45%] left-[5%] parallax-icon-amber"><BrainCircuit className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x4, y: y1 }} className="absolute top-[25%] left-[18%] parallax-icon-pink"><CheckCircle className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x1, y: y4 }} className="absolute bottom-[60%] left-[12%] parallax-icon-blue"><Sparkles className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x2, y: y2 }} className="absolute top-[40%] left-[3%] parallax-icon-violet"><Terminal className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x3, y: y4 }} className="absolute bottom-[15%] left-[7%] parallax-icon-pink"><Briefcase className="w-4 h-4" /></motion.div>
                <motion.div style={{ x: x4, y: y3 }} className="absolute top-[70%] left-[15%] parallax-icon-blue"><Network className="w-5 h-5" /></motion.div>
                <motion.div style={{ x: x1, y: y1 }} className="absolute bottom-[75%] left-[22%] parallax-icon-emerald"><Cpu className="w-4 h-4" /></motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 max-w-4xl mx-auto"
            >
                <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-2 drop-shadow-sm mt-2">
                    Master Your Next Interview
                </h1>
                <p className="text-base md:text-lg text-slate-400 mb-6 max-w-2xl mx-auto">
                    AI-powered mock interviews, real-time feedback, and resume analysis to help you land your dream job.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link
                        to="/interview-mode"
                        className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                    >
                        Start Mock Interview
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/resume"
                        className="px-8 py-4 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2"
                    >
                        Review Resume
                        <FileText className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-yellow-400" />}
                            title="Instant Feedback"
                            description="Get immediate analysis of your answers with actionable improvements."
                        />
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <FeatureCard
                            icon={<CheckCircle className="w-8 h-8 text-green-400" />}
                            title="Real-world Questions"
                            description="Practice with questions curated from top tech companies."
                        />
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <FeatureCard
                            icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                            title="AI Analysis"
                            description="Deep learning models evaluate your technical accuracy and soft skills."
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-4 lg:p-5 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors h-full shadow-lg flex flex-col items-center text-center sm:items-start sm:text-left">
        <div className="mb-2">{icon}</div>
        <h3 className="text-base lg:text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
    </div>
);

export default Home;
