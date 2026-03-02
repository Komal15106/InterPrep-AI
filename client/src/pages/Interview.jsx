import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User, Bot, StopCircle, Mic, MicOff, Volume2, VolumeX, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Interview = () => {
    const location = useLocation();
    const initialMode = location.state?.mode || 'text';
    const role = location.state?.role || 'Frontend Developer';

    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello! I'm your AI interviewer. I'll be asking you questions about the ${role} role. Ready to begin?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const isSpeakingRef = useRef(false);
    const [voiceEnabled, setVoiceEnabled] = useState(initialMode === 'voice');
    const [voices, setVoices] = useState([]);
    const [selectedVoiceUri, setSelectedVoiceUri] = useState('');

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cleanup speech on unmount so it stops talking if user leaves page
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Load Voices
    useEffect(() => {
        let isMounted = true;
        const loadVoices = () => {
            if (!isMounted) return;
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                // Try to get English voices, otherwise use whatever is available
                const enVoices = availableVoices.filter(v => v.lang.startsWith('en'));
                const finalVoices = enVoices.length > 0 ? enVoices : availableVoices;

                setVoices(finalVoices);

                // Only set default if it hasn't been set yet
                setSelectedVoiceUri(prev => {
                    if (prev) return prev;
                    const defaultFemale = finalVoices.find(v =>
                        v.name.toLowerCase().includes('samantha') ||
                        v.name.toLowerCase().includes('zira') ||
                        v.name.toLowerCase().includes('female') ||
                        v.name.toLowerCase().includes('google us english')
                    );
                    return defaultFemale ? defaultFemale.voiceURI : finalVoices[0].voiceURI;
                });
            }
        };

        // Try immediately
        loadVoices();

        // Listeners for when voices load asynchronously
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // Fallback timeouts for Chrome on Windows which sometimes misses the event
        const t1 = setTimeout(loadVoices, 500);
        const t2 = setTimeout(loadVoices, 1000);
        const t3 = setTimeout(loadVoices, 2000);

        return () => {
            isMounted = false;
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                if (isSpeakingRef.current) return;

                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setInput(prev => {
                        const newText = prev + (prev ? ' ' : '') + finalTranscript;
                        return newText;
                    });
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    setIsListening(false);
                    alert("Microphone access denied. Please allow microphone access.");
                }
            };

            recognitionRef.current.onend = () => {
                if (isListening && !isSpeakingRef.current) {
                    try {
                        recognitionRef.current.start();
                    } catch (e) {
                        console.error("Failed to restart recognition", e);
                        setIsListening(false);
                    }
                }
            };
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, [isListening]);

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
            }
        }
    };

    // Speak initial message on load if voice enabled
    useEffect(() => {
        if (voiceEnabled && messages.length === 1) {
            speakText(messages[0].content);
        }
    }, [voiceEnabled]);

    const speakText = (text) => {
        if (!voiceEnabled) return;

        if (isListening) {
            recognitionRef.current?.stop();
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 0.5;
        utterance.rate = 0.9;

        if (selectedVoiceUri) {
            const voice = voices.find(v => v.voiceURI === selectedVoiceUri);
            if (voice) utterance.voice = voice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            isSpeakingRef.current = true;
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            isSpeakingRef.current = false;

            if (voiceEnabled) {
                setTimeout(() => {
                    setIsListening(true);
                    try {
                        recognitionRef.current?.start();
                    } catch (e) {
                        console.error("Error restarting recognition:", e);
                    }
                }, 500);
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        if (isListening) {
            setIsListening(false);
            recognitionRef.current?.stop();
        }

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/interview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: messages[messages.length - 1]?.content,
                    answer: input,
                    history: messages,
                    role: role
                }),
            });

            const data = await response.json();

            if (data.score) {
                const newTotal = (currentScore * questionCount) + data.score;
                setQuestionCount(prev => prev + 1);
                setCurrentScore(newTotal / (questionCount + 1));
                localStorage.setItem('lastScore', data.score);
            }

            const responseText = data.feedback + "\n\n" + data.nextQuestion;
            const botMessage = {
                role: 'assistant',
                content: responseText,
                score: data.score
            };

            setMessages(prev => [...prev, botMessage]);
            speakText(responseText);

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = () => {
        window.speechSynthesis.cancel();
        const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
        history.push({
            date: new Date().toISOString(),
            score: currentScore,
            questions: questionCount
        });
        localStorage.setItem('interviewHistory', JSON.stringify(history));
        window.location.href = '/dashboard';
    };

    // Audio Visualization State
    const [audioLevels, setAudioLevels] = useState([10, 10, 10, 10]);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    const rafIdRef = useRef(null);

    // Initialize Audio Visualization
    useEffect(() => {
        if (isListening) {
            const startVisualization = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                    analyserRef.current = audioContextRef.current.createAnalyser();
                    analyserRef.current.fftSize = 32; // Low fftSize for performance and fewer bars
                    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                    sourceRef.current.connect(analyserRef.current);

                    const bufferLength = analyserRef.current.frequencyBinCount;
                    dataArrayRef.current = new Uint8Array(bufferLength);

                    const updateLevels = () => {
                        if (!analyserRef.current) return;
                        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

                        // Map frequency data to 4 bars
                        // We take 4 distinct points from the frequency data to represent different ranges
                        const l1 = Math.max(10, dataArrayRef.current[0] / 2);
                        const l2 = Math.max(10, dataArrayRef.current[2] / 2);
                        const l3 = Math.max(10, dataArrayRef.current[4] / 2);
                        const l4 = Math.max(10, dataArrayRef.current[6] / 2);

                        setAudioLevels([l1, l2, l3, l4]);
                        rafIdRef.current = requestAnimationFrame(updateLevels);
                    };

                    updateLevels();
                } catch (err) {
                    console.error("Error accessing microphone for visualization:", err);
                }
            };

            startVisualization();
        } else {
            // Cleanup
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            if (sourceRef.current) {
                sourceRef.current.disconnect();
                sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) audioContextRef.current.close();
            setAudioLevels([10, 10, 10, 10]);
        }

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            if (sourceRef.current) {
                sourceRef.current.disconnect();
                // Don't stop tracks here if we want to keep listening, but usually we want to stop visualizer
                // Actually, SpeechRecognition handles its own stream, so we might be opening two streams.
                // This is fine for visualization purposes.
                sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [isListening]);

    const textareaRef = useRef(null);

    // Auto-focus textarea when listening starts so Enter key works
    useEffect(() => {
        if (isListening) {
            textareaRef.current?.focus();
        }
    }, [isListening]);

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col p-4 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 md:gap-0">
                <h2 className="text-xl md:text-2xl font-bold text-white text-center md:text-left">Mock Interview Session</h2>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="bg-slate-800 px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                        <span className="text-slate-400 text-xs md:text-sm">Avg Score:</span>
                        <span className="ml-2 text-indigo-400 font-bold text-sm md:text-base">{currentScore.toFixed(1)}/10</span>
                    </div>

                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`p-2 rounded-lg transition-colors ${voiceEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        title={voiceEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
                    >
                        {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    {voiceEnabled && voices.length > 0 && (
                        <select
                            value={selectedVoiceUri}
                            onChange={(e) => setSelectedVoiceUri(e.target.value)}
                            className="bg-slate-800 text-slate-300 text-xs md:text-sm rounded-lg px-2 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 max-w-[100px] md:max-w-[150px] truncate"
                            title="Select AI Voice"
                        >
                            {voices.map(v => (
                                <option key={v.voiceURI} value={v.voiceURI}>
                                    {v.name.replace('Microsoft ', '').replace(' Desktop', '').replace('Google ', '')}
                                </option>
                            ))}
                        </select>
                    )}

                    <button
                        onClick={handleEndSession}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                        <StopCircle className="w-5 h-5" />
                        End Session
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-2xl border border-slate-700 p-6 mb-4 space-y-6 pb-24">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                                }`}>
                                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100'
                                : 'bg-slate-800 border border-slate-700 text-slate-200'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                {msg.score && (
                                    <div className="mt-2 pt-2 border-t border-slate-700/50 text-sm text-emerald-400 font-medium">
                                        Score: {msg.score}/10
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={isListening ? "Listening..." : "Type your answer here..."}
                    className={`w-full bg-slate-800 border-slate-700 rounded-xl p-4 pr-16 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24 transition-colors ${isListening ? 'border-indigo-500/50 bg-indigo-500/5' : ''
                        }`}
                />

                <div className="absolute right-4 bottom-4 flex gap-2">
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/25"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Google Assistant Style Voice Overlay */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-slate-700 px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50"
                    >
                        <div className="flex gap-2 items-center h-8">
                            {/* Google Colors: Blue, Red, Yellow, Green */}
                            <motion.div
                                animate={{ height: Math.min(32, Math.max(8, audioLevels[0])) }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-3 bg-[#4285F4] rounded-full"
                            />
                            <motion.div
                                animate={{ height: Math.min(48, Math.max(8, audioLevels[1])) }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-3 bg-[#EA4335] rounded-full"
                            />
                            <motion.div
                                animate={{ height: Math.min(32, Math.max(8, audioLevels[2])) }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-3 bg-[#FBBC05] rounded-full"
                            />
                            <motion.div
                                animate={{ height: Math.min(40, Math.max(8, audioLevels[3])) }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-3 bg-[#34A853] rounded-full"
                            />
                        </div>
                        <span className="text-white font-medium">Listening...</span>
                        <button
                            onClick={toggleListening}
                            className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <StopCircle className="w-5 h-5 text-slate-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Mic Button (Always visible when not listening) */}
            {!isListening && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleListening}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-full shadow-lg shadow-purple-500/30 text-white z-40"
                >
                    <Mic className="w-6 h-6" />
                </motion.button>
            )}
        </div>
    );
};

export const InterviewMode = () => {
    const navigate = useNavigate();
    const [role, setRole] = React.useState('');

    const handleSelectMode = (mode) => {
        navigate('/interview', { state: { mode, role } });
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
                    Choose Your Interview Style
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
                    Select how you want to interact. You can toggle voice features later.
                </p>

                <div className="max-w-md mx-auto bg-slate-800/50 p-3 md:p-4 rounded-xl border border-slate-700">
                    <label className="block text-slate-300 font-medium mb-1 text-left text-sm">
                        Target Role
                    </label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-900 border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="e.g. Backend Developer"
                    />
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl w-full">
                {/* Voice Mode Card */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectMode('voice')}
                    className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl md:rounded-2xl p-4 text-left transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col h-full items-start">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Mic className="w-5 h-5 text-indigo-400" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">Voice Interview</h3>
                        <p className="text-slate-400 text-xs md:text-sm mb-3 flex-grow">
                            Speak naturally. Best for practicing verbal communication.
                        </p>

                        <div className="flex items-center text-indigo-400 font-medium text-xs md:text-sm group-hover:translate-x-2 transition-transform">
                            Start Session <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </motion.button>

                {/* Text Mode Card */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectMode('text')}
                    className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl md:rounded-2xl p-4 text-left transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col h-full items-start">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquare className="w-5 h-5 text-purple-400" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">Text Interview</h3>
                        <p className="text-slate-400 text-xs md:text-sm mb-3 flex-grow">
                            Type responses. Ideal for focusing on technical accuracy.
                        </p>

                        <div className="flex items-center text-purple-400 font-medium text-xs md:text-sm group-hover:translate-x-2 transition-transform">
                            Start Session <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </motion.button>
            </div>
        </div>
    );
};

export default Interview;
