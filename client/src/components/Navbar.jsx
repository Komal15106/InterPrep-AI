import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, FileText, Palette, ChevronDown } from 'lucide-react';

const themes = [
    { id: 'default', name: 'Default White' },
    { id: 'theme-cyberpunk', name: 'Cyberpunk Neon' },
    { id: 'theme-indigo', name: 'Dark Indigo' },
    { id: 'theme-blossom', name: 'White Pink Blossom' },
];

const Navbar = () => {
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('appTheme') || 'default');
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Apply theme to body
        document.body.className = '';
        if (currentTheme !== 'default') {
            document.body.classList.add(currentTheme);
        }
        localStorage.setItem('appTheme', currentTheme);
    }, [currentTheme]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsThemeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (themeId) => {
        setCurrentTheme(themeId);
        setIsThemeOpen(false);
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 text-indigo-400 font-bold text-xl sm:text-3xl group truncate">
                        <BrainCircuit className="w-6 h-6 sm:w-10 sm:h-10 group-hover:rotate-12 transition-transform shrink-0" />
                        <span className="truncate">InterPrep AI</span>
                    </Link>
                    <div className="flex items-center">
                        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                            <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white hover:text-indigo-400 transition-colors font-medium text-base sm:text-lg shrink-0">
                                <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            <Link to="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white hover:text-indigo-400 transition-colors font-medium text-base sm:text-lg shrink-0">
                                <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <Link to="/library" className="flex items-center gap-2 text-slate-300 hover:text-white hover:text-indigo-400 transition-colors font-medium text-base sm:text-lg shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="hidden sm:inline">Library</span>
                            </Link>
                        </div>

                        {/* Theme Switcher */}
                        <div className="relative ml-4 shrink-0 z-50" ref={dropdownRef}>
                            <button
                                onClick={() => setIsThemeOpen(!isThemeOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-base text-white font-medium transition-colors"
                            >
                                <Palette className="w-5 h-5 text-indigo-400" />
                                <span className="hidden md:inline">Theme</span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isThemeOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isThemeOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                                    <div className="py-1">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => handleThemeChange(theme.id)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentTheme === theme.id
                                                    ? 'bg-indigo-500/20 text-indigo-400 font-bold'
                                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                                    }`}
                                            >
                                                {theme.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
