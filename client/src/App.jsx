import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Interview, { InterviewMode } from './pages/Interview';
import Dashboard from './pages/Dashboard';
import ResumeReview from './pages/ResumeReview';
import Library from './pages/Library';

function App() {
  useEffect(() => {
    let audioCtx;

    const playClickSound = () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Fast, high-to-low sweeping pop sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // keep volume low
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.05);
    };

    const handleClick = (e) => {
      // Only play sounds for interactive elements
      const target = e.target.closest('button, a, [role="button"], input[type="submit"], select');
      if (target) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview-mode" element={<InterviewMode />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeReview />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </div>
  );
}

export default App;
