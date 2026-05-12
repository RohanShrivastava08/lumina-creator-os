import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Linkedin, 
  Instagram, 
  Copy, 
  Check, 
  Zap, 
  Hash, 
  Anchor, 
  MessageSquare,
  Send,
  RefreshCw,
  Twitter,
  ChevronDown,
  BarChart3,
  Layers,
  ArrowRight,
  User,
  Heart,
  Type as FontType,
  Eye,
  Wand2,
  Brain,
  Rocket,
  PlusCircle,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-react';
import { 
  generateSocialContent, 
  Platform, 
  Tone, 
  PostLength, 
  GeneratedContent,
  GenerationMode
} from './services/gemini';

// Typing effect component - fixed for valid HTML nesting
const Typewriter = ({ text, delay = 10, className = "" }: { text: string; delay?: number; className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return <span className={`whitespace-pre-wrap ${className}`}>{displayedText}</span>;
};

export default function App() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.LINKEDIN);
  const [tone, setTone] = useState<Tone>(Tone.STORYTELLER);
  const [length, setLength] = useState<PostLength>(PostLength.MEDIUM);
  const [hashtagCount, setHashtagCount] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'carousel' | 'analytics' | 'visuals'>('content');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumina-theme');
      return (saved as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('lumina-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleGenerate = async (mode: GenerationMode = GenerationMode.INITIAL) => {
    if (!topic.trim() && mode === GenerationMode.INITIAL) return;
    setLoading(true);
    try {
      const generated = await generateSocialContent(topic, platform, tone, length, hashtagCount, mode, result || undefined);
      setResult(generated);
      if (mode === GenerationMode.INITIAL) setActiveTab('content');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyFullPost = () => {
    if (!result) return;
    const fullText = `${result.hook}\n\n${result.mainContent}\n\n${result.cta}\n\n${result.hashtags.join(' ')}`;
    copyToClipboard(fullText, 'full');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden md:h-screen transition-colors duration-700">
      {/* Header */}
      <header className="h-24 border-b border-border bg-panel/80 backdrop-blur-xl shrink-0 z-50 sticky top-0 transition-all duration-500">
        <div className="h-full px-10 md:px-16 flex items-center justify-between max-w-[2400px] mx-auto w-full">
          <div className="flex items-center gap-10 group cursor-pointer">
            <div className="w-10 h-10 bg-accent flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 bg-text-primary/5"
               />
              <Zap className="w-4 h-4 text-[#050505] fill-current relative z-10" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl tracking-tighter leading-none font-black italic serif text-text-primary uppercase group-hover:text-accent transition-colors">Lumina <span className="text-accent/60">OS</span></h1>
              <p className="label-micro !text-[7px] tracking-[0.7em] text-text-muted font-black opacity-80 uppercase">Creator Intelligence Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-16">
            <nav className="hidden lg:flex gap-16 label-micro !tracking-[0.4em]">
              {['Ghostwriter', 'Strategy', 'Growth', 'Vault'].map((item) => (
                <span key={item} className={`hover:text-accent transition-all cursor-pointer relative group py-2 ${item === 'Ghostwriter' ? 'text-accent' : 'text-text-secondary hover:text-text-primary font-bold'}`}>
                  {item}
                  <span className={`absolute -bottom-2 left-0 h-0.5 bg-accent transition-all duration-700 ${item === 'Ghostwriter' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </span>
              ))}
            </nav>
            <div className="flex items-center gap-10">
              <div className="hidden xl:flex items-center gap-5 px-8 py-3 rounded-none border border-border bg-panel-muted/30 backdrop-blur-sm transition-all hover:bg-panel-muted group">
                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_12px_rgba(197,161,97,0.6)]"></div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-text-muted font-black group-hover:text-text-primary transition-colors">Neural Link: Active</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-full border border-border bg-panel flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-all duration-500 overflow-hidden relative group"
                  title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ y: 20, opacity: 0, rotate: -45 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -20, opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.3, ease: "circOut" }}
                    >
                      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
                <div className="w-10 h-10 rounded-full border border-border bg-panel group cursor-pointer overflow-hidden flex items-center justify-center hover:border-accent transition-all">
                  <User className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        {/* Sidebar Controls */}
        <aside className="w-full md:w-[420px] border-r border-border p-10 md:p-16 bg-panel flex flex-col gap-16 shrink-0 overflow-y-auto scrollbar-hide z-20 transition-all duration-500">
          <div className="space-y-16">
            <section className="sidebar-section">
              <div className="flex justify-between items-end pb-3 border-b-2 border-border">
                <label className="label-micro font-black text-text-primary !tracking-[0.4em]">Target Platform</label>
                <Layers className="w-4 h-4 text-accent/30" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { id: Platform.LINKEDIN, icon: Linkedin },
                  { id: Platform.INSTAGRAM, icon: Instagram },
                  { id: Platform.X, icon: Twitter }
                ].map(({ id, icon: Icon }) => (
                  <button 
                    key={id}
                    onClick={() => setPlatform(id)}
                    className={`group flex flex-col items-center justify-center gap-4 py-8 border-2 transition-all duration-700 rounded-0 ${platform === id ? 'bg-accent/5 border-accent text-accent shadow-xl shadow-accent/5' : 'bg-panel-muted/30 border-border text-text-muted hover:border-text-muted/50 hover:text-text-secondary'}`}
                  >
                    <Icon className="w-5 h-5 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6" />
                    <span className="text-[9px] uppercase font-black tracking-[0.3em]">{id.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="sidebar-section">
              <div className="flex justify-between items-end pb-3 border-b-2 border-border">
                <label className="label-micro font-black text-text-primary !tracking-[0.4em]">Concept Seed</label>
                <Brain className="w-4 h-4 text-accent/30" />
              </div>
              <div className="relative group">
                <textarea 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Seeding Narrative flow..."
                  className="input-minimal h-48 md:h-80 resize-none leading-relaxed text-sm bg-panel-muted/20 border-border shadow-sm focus:bg-panel transition-all p-8 placeholder:italic placeholder:opacity-30"
                />
                <div className="absolute bottom-6 right-6 pointer-events-none opacity-10 group-focus-within:opacity-50 transition-opacity">
                  <Wand2 className="w-5 h-5 text-accent" />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-12">
              <section className="sidebar-section">
                <label className="label-micro font-black text-text-muted opacity-80">Creative Depth</label>
                <div className="relative group">
                  <select 
                    value={length}
                    onChange={(e) => setLength(e.target.value as PostLength)}
                    className="w-full bg-transparent border-b-2 border-border py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer text-text-primary"
                  >
                    {Object.values(PostLength).map(L => (
                      <option key={L} value={L} className="bg-panel text-text-primary px-6 py-4 uppercase font-black tracking-widest">{L.split(' ')[0]}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors pointer-events-none" />
                </div>
              </section>

              <section className="sidebar-section">
                <label className="label-micro font-black text-text-muted opacity-80">Architect Tone</label>
                <div className="relative group">
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="w-full bg-transparent border-b-2 border-border py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer text-text-primary"
                  >
                    {Object.values(Tone).map(T => (
                      <option key={T} value={T} className="bg-panel text-text-primary px-6 py-4 uppercase font-black tracking-widest">{T}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors pointer-events-none" />
                </div>
              </section>
            </div>

            <section className="sidebar-section pt-4">
              <div className="flex justify-between items-center mb-6">
                <label className="label-micro font-black text-text-muted opacity-80">Taxonomy Scale</label>
                <span className="text-[10px] text-accent font-black tracking-widest bg-accent/5 px-3 py-1 border border-accent/20">#{hashtagCount}</span>
              </div>
              <div className="relative group h-6 flex items-center">
                <input 
                  type="range"
                  min="0"
                  max="15"
                  value={hashtagCount}
                  onChange={(e) => setHashtagCount(parseInt(e.target.value))}
                  className="w-full appearance-none bg-border h-0.5 rounded-0 accent-accent cursor-pointer transition-all hover:h-1"
                />
              </div>
            </section>
          </div>

          <button 
            onClick={() => handleGenerate(GenerationMode.INITIAL)}
            disabled={loading || !topic.trim()}
            className="btn-accent border-2 border-accent/30 mt-auto shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-surface relative z-10" />
            ) : (
              <span className="flex items-center justify-center gap-4 relative z-10">
                Architect Artifact
                <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-3" />
              </span>
            )}
          </button>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 p-12 md:p-20 bg-surface overflow-y-auto scrollbar-hide artifact-container-inverted border-l border-border transition-colors duration-1000">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-10"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border border-accent/20 rounded-none flex items-center justify-center relative overflow-hidden bg-panel/20 backdrop-blur-md">
                       <div className="absolute inset-0 bg-accent/5 animate-pulse"></div>
                       <Zap className="w-10 h-10 text-accent animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <p className="label-micro text-accent tracking-[0.5em] font-black">Architecting Synthesis</p>
                    <div className="h-0.5 w-40 bg-border/30 mx-auto overflow-hidden">
                       <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-20 bg-accent shadow-[0_0_15px_rgba(197,161,97,0.5)]"
                       />
                    </div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="flex-1 flex flex-col pt-8 md:pt-0"
                >
                  {/* Results Controls Grid */}
                      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-16 mb-20 pb-12 border-b border-border/20">
                        <div className="space-y-4">
                          <h2 className="text-5xl md:text-7xl tracking-tighter text-text-primary font-black italic serif leading-none uppercase">
                            The <span className="text-accent">Artifact</span>
                          </h2>
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(197,161,97,0.4)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">Synthesis Complete // Vector Alpha</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-10 items-center bg-panel-muted/20 px-10 py-3 border border-border/10 backdrop-blur-sm">
                          {[
                            { id: 'content', label: 'Draft', icon: FontType },
                            { id: 'visuals', label: 'Scene', icon: Zap },
                            { id: 'carousel', label: 'Matrix', icon: Layers },
                            { id: 'analytics', label: 'Data', icon: BarChart3 }
                          ].map((tab) => (
                            <button 
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as any)}
                              className={`flex items-center gap-3 transition-all duration-500 relative group py-2 ${activeTab === tab.id ? 'text-accent' : 'text-text-muted hover:text-text-primary'}`}
                            >
                              <tab.icon className={`w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 ${activeTab === tab.id ? 'text-accent' : 'text-text-muted/40 group-hover:text-text-muted'}`} />
                              <span className="text-[10px] uppercase font-black tracking-[0.3em]">{tab.label}</span>
                              {activeTab === tab.id && (
                                <motion.div 
                                  layoutId="tabUnderline"
                                  className="absolute -bottom-3 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_rgba(197,161,97,0.3)]"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                    <div className="flex flex-wrap gap-8 mb-20">
                      <button 
                        onClick={copyFullPost}
                        className="flex items-center gap-6 px-16 py-8 bg-accent/5 border-2 border-accent/10 hover:bg-accent/10 hover:border-accent group transition-all duration-700 active:scale-95 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                        {copiedSection === 'full' ? <Check className="w-6 h-6 text-accent relative z-10" /> : <Copy className="w-6 h-6 text-text-muted group-hover:text-accent transition-colors relative z-10" />}
                        <span className="text-[12px] uppercase font-black tracking-[0.5em] text-text-muted group-hover:text-text-primary transition-colors relative z-10">{copiedSection === 'full' ? 'Artifact Secured' : 'Export Full Artifact'}</span>
                      </button>
                    </div>

                  {activeTab === 'content' && (
                    <div className="flex flex-col lg:flex-row gap-20 flex-1 min-h-[600px]">
                      {/* Detailed Editor Tab */}
                      <div className="flex-1 space-y-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        {/* Hook Section */}
                        <div className="relative border-l-6 border-accent/30 pl-12 md:pl-24 py-12 group/section hover:border-accent transition-all duration-700">
                          <div className="flex items-center justify-between mb-12">
                            <label className="label-micro flex items-center gap-6 text-accent font-black !tracking-[0.5em]">
                              <Anchor className="w-5 h-5 shadow-[0_0_15px_rgba(197,161,97,0.4)]" /> 01 // THE HOOK
                            </label>
                            <button onClick={() => copyToClipboard(result.hook, 'hook')} className="p-6 bg-panel border-2 border-border/50 hover:text-accent hover:border-accent transition-all shadow-xl group-hover:scale-110 duration-500">
                              {copiedSection === 'hook' ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5 text-text-muted" />}
                            </button>
                          </div>
                          <p className="text-4xl md:text-6xl leading-[1.05] italic font-serif text-text-primary pr-12 tracking-tight group-hover:translate-x-2 transition-transform duration-700">
                            <Typewriter text={result.hook} />
                          </p>
                        </div>

                        {/* Body Section */}
                        <div className="relative pl-12 md:pl-24 group/section pt-10">
                          <div className="flex items-center justify-between mb-12">
                            <label className="label-micro flex items-center gap-6 text-text-muted font-black !tracking-[0.5em]">
                              <MessageSquare className="w-5 h-5" /> 02 // NARRATIVE FLOW
                            </label>
                            <button onClick={() => copyToClipboard(result.mainContent, 'body')} className="p-6 bg-panel border-2 border-border/50 hover:text-accent hover:border-accent transition-all shadow-xl group-hover:scale-110 duration-500">
                               {copiedSection === 'body' ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5 text-text-muted" />}
                            </button>
                          </div>
                          <div className="text-2xl md:text-3xl leading-[1.7] font-sans font-normal text-text-secondary max-w-3xl whitespace-pre-wrap pr-16 opacity-90 group-hover:opacity-100 transition-opacity duration-700">
                            <Typewriter text={result.mainContent} delay={3} />
                          </div>
                        </div>

                        {/* CTA & Hashtags */}
                        <div className="pt-24 border-t-2 border-border/10 flex flex-col gap-24">
                          <div className="flex items-center justify-between group/cta group/section">
                            <div className="space-y-8 flex-1">
                              <label className="label-micro flex items-center gap-6 text-text-muted font-black !tracking-[0.5em]">
                                <Send className="w-5 h-5" /> 03 // CALL TO ACTION
                              </label>
                              <p className="text-text-primary text-3xl md:text-5xl font-serif italic border-b-6 border-accent/20 pb-6 w-fit hover:border-accent transition-all cursor-default leading-none">
                                {result.cta}
                              </p>
                            </div>
                            <button onClick={() => copyToClipboard(result.cta, 'cta')} className="p-6 bg-panel border-2 border-border/50 hover:text-accent hover:border-accent transition-all shadow-xl group-hover:scale-110 duration-500">
                              {copiedSection === 'cta' ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5 text-text-muted" />}
                            </button>
                          </div>

                          {result.hashtags.length > 0 && (
                            <div className="space-y-10 group/section">
                              <label className="label-micro flex items-center gap-4 text-text-muted">
                                <Hash className="w-4 h-4 opacity-50" /> Taxonomy Matrix
                              </label>
                              <div className="flex flex-wrap gap-5">
                                {result.hashtags.map((tag, i) => (
                                  <span key={i} className="px-8 py-4 bg-panel-muted/50 border-2 border-border/50 text-text-secondary rounded-none text-[12px] font-black tracking-widest hover:text-accent hover:border-accent transition-all cursor-pointer shadow-sm active:scale-95">
                                    {tag.startsWith('#') ? tag.toUpperCase() : `#${tag.toUpperCase()}`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Side Insight Panel */}
                        <div className="w-full lg:w-[320px] flex flex-col gap-16 shrink-0 lg:border-l-2 lg:border-border/10 lg:pl-16 transition-all duration-700">
                          <div className="space-y-16">
                            <div>
                              <h4 className="label-micro mb-12 border-b-2 border-border/10 pb-5 flex justify-between items-center text-text-primary font-black !tracking-[0.5em]">
                                Analysis Vector
                                <BarChart3 className="w-4 h-4 text-accent/20" />
                              </h4>
                              <div className="space-y-12">
                                {[
                                   { label: 'Platform Optimization', value: platform.split(' ')[0], icon: Rocket },
                                   { label: 'Voice Persona', value: tone, icon: MessageSquare },
                                   { label: 'Creative Depth', value: length.split(' ')[0], icon: Layers }
                                ].map((meta, i) => (
                                  <div key={i} className="flex items-start gap-6 group cursor-default">
                                    <div className="w-10 h-10 rounded-none bg-panel-muted/50 border-2 border-border/50 flex items-center justify-center text-text-muted transition-all duration-500 group-hover:bg-accent/5 group-hover:border-accent group-hover:text-accent group-hover:rotate-12">
                                      <meta.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <span className="text-[9px] uppercase tracking-[0.4em] text-text-muted font-black">{meta.label}</span>
                                      <span className="text-sm text-text-primary font-serif italic font-bold">{meta.value}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <button className="btn-ghost w-full justify-center group active:scale-95 border-2 py-6">
                                Archive Artifact
                                <PlusCircle className="w-5 h-5 transition-all duration-700 group-hover:rotate-180 group-hover:text-accent" />
                            </button>
                          </div>

                          <div className="p-12 border-2 border-border/10 bg-panel-muted/20 relative overflow-hidden group hover:border-accent/30 transition-all duration-700">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <label className="text-[10px] uppercase font-black tracking-[0.4em] text-accent block mb-8 border-b border-accent/20 pb-2 w-fit">Expert Guidance</label>
                            <p className="text-md font-serif italic leading-loose text-text-secondary relative z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                              "Authenticity is the only algorithm that lasts. This synthesis is designed to amplify your unique voice while maintaining absolute structural precision."
                            </p>
                          </div>
                        </div>
                    </div>
                  )}

                  {activeTab === 'visuals' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto"
                    >
                      {[
                        { title: 'Midjourney', key: 'midjourney', description: 'Artistic High-Fidelity', engine: 'v6.0' },
                        { title: 'Gemini Image', key: 'gemini', description: 'Photorealistic Precision', engine: 'Imagen 3' },
                        { title: 'Leonardo AI', key: 'leonardo', description: 'Aesthetic Consistency', engine: 'Phoenix' },
                        { title: 'Stable Diffusion', key: 'stableDiffusion', description: 'Technical Control', engine: 'XL 1.0' }
                      ].map((prompt) => (
                        <div key={prompt.key} className="bg-panel p-16 border-2 border-border/10 flex flex-col space-y-12 group transition-all duration-700 hover:border-accent/40 shadow-xl overflow-hidden relative">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-700"></div>
                          <div className="flex justify-between items-start relative z-10">
                            <div>
                              <h4 className="text-3xl font-serif italic text-text-primary mb-2 tracking-tight">{prompt.title}</h4>
                              <p className="text-[10px] text-accent font-black uppercase tracking-[0.4em]">{prompt.engine}</p>
                            </div>
                            <button 
                              onClick={() => copyToClipboard(result.visualPrompts?.[prompt.key as keyof typeof result.visualPrompts] || '', prompt.key)}
                              className="w-14 h-14 bg-panel border-2 border-border/50 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-500 shadow-sm"
                            >
                              {copiedSection === prompt.key ? <Check className="w-6 h-6 text-accent" /> : <Copy className="w-6 h-6" />}
                            </button>
                          </div>

                          <div className="flex-1 relative z-10">
                            <p className="label-micro mb-10 border-b border-border/10 pb-3 text-text-muted opacity-60">Architectural Prompt</p>
                            <p className="text-[13px] text-text-secondary leading-relaxed font-mono bg-panel-muted/50 p-8 border border-border/30 italic group-hover:border-accent/20 transition-all duration-700">
                               <span className="text-accent opacity-40 text-xl font-serif">"</span>
                               {result.visualPrompts?.[prompt.key as keyof typeof result.visualPrompts] || 'Synthesizing...'}
                               <span className="text-accent opacity-40 text-xl font-serif">"</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-5 pt-12 border-t border-border/10 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(197,161,97,0.6)]"></div>
                            <span className="label-micro !text-[9px] !tracking-[0.6em] text-text-muted">Matrix: {platform.split(' ')[0]} // GEN-3</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === 'carousel' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="grid lg:grid-cols-2 xl:grid-cols-3 gap-10"
                    >
                      {result.carouselIdeas?.map((idea, i) => (
                        <div key={i} className="bg-panel border-2 border-border/10 p-12 flex flex-col h-[550px] group transition-all duration-1000 shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-60 h-60 bg-accent/[0.03] -mr-32 -mt-32 rounded-full blur-[100px] transition-all group-hover:bg-accent/10 duration-1000"></div>
                          <div className="flex justify-between items-start mb-16">
                             <div className="text-8xl font-serif italic text-text-primary/5 font-black group-hover:text-accent/10 transition-all duration-1000 leading-none select-none">0{i+1}</div>
                            <div className="w-14 h-14 bg-panel border-2 border-border/50 flex items-center justify-center transition-all duration-700 group-hover:border-accent group-hover:rotate-12 group-active:scale-90">
                               <Layers className="w-6 h-6 text-text-muted group-hover:text-accent transition-colors" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="label-micro mb-10 block border-b-2 border-border/10 pb-4 font-black">Visual Narrative Flow</label>
                            <p className="text-3xl text-text-primary leading-[1.2] font-serif italic group-hover:translate-x-4 transition-transform duration-1000 pr-4">{idea}</p>
                          </div>
                          <button className="pt-12 flex items-center gap-6 text-[10px] uppercase font-black tracking-[0.5em] text-text-muted hover:text-accent transition-all duration-700 group/btn">
                             Execute Matrix <ArrowRight className="w-5 h-5 transition-transform duration-700 group-hover/btn:translate-x-5" />
                          </button>
                        </div>
                      )) || (
                        <div className="col-span-full h-96 border-4 border-dashed border-border/20 rounded-none flex flex-col items-center justify-center text-text-muted space-y-6">
                           <Layers className="w-12 h-12 opacity-20" />
                           <span className="label-micro tracking-[0.8em]">Awaiting Story Blocks...</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'analytics' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="max-w-4xl mx-auto space-y-24"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        {[
                          { label: 'Hook Impact', value: result.analytics.hookStrength },
                          { label: 'Engagement Velocity', value: result.analytics.engagementPotential },
                          { label: 'Syntactic Flow', value: result.analytics.readabilityScore },
                          { label: 'Algorithm Fit', value: result.analytics.optimizationScore }
                        ].map((stat, i) => (
                          <div key={i} className="space-y-6 group">
                            <div className="flex justify-between items-end border-b-2 border-border/10 pb-6 group-hover:border-accent/30 transition-all duration-700">
                              <label className="label-micro font-black tracking-[0.4em]">{stat.label}</label>
                              <span className="text-5xl font-serif italic text-text-primary group-hover:text-accent transition-colors duration-700">{stat.value}<span className="text-[14px] text-accent/40 italic ml-3">%</span></span>
                            </div>
                            <div className="h-1 w-full bg-border/20 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.value}%` }}
                                transition={{ duration: 2.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full bg-accent shadow-[0_0_20px_rgba(197,161,97,0.5)]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-32 border-t-2 border-border/10">
                        <div className="max-w-3xl space-y-16">
                           <h3 className="text-5xl font-serif italic text-text-primary leading-tight uppercase tracking-tighter">Critical Synthesis <span className="text-accent underline decoration-accent/20 underline-offset-[25px]">Report</span></h3>
                            <p className="text-text-secondary font-serif italic leading-relaxed text-3xl border-l-8 border-accent/20 pl-16 py-10 group hover:border-accent transition-all duration-1000">
                             "The artifact exhibits high informational density while maintaining low cognitive friction. Our neural models indicate that the storytelling arc utilized aligns perfectly with the current dwell-time optimization metrics observed in high-performing creators on {platform}."
                            </p>
                           <div className="flex flex-wrap items-center gap-20">
                              <div className="flex items-center gap-6">
                                <span className="w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_rgba(197,161,97,0.8)]"></span>
                                <span className="label-micro !tracking-[0.4em] font-black text-text-primary text-[10px]">High Authority Vector</span>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className="w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_rgba(197,161,97,0.8)]"></span>
                                <span className="label-micro !tracking-[0.4em] font-black text-text-primary text-[10px]">Sentiment Matched (+84%)</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <footer className="mt-40 pb-20 flex flex-col md:flex-row justify-between items-center gap-16 shrink-0 border-t border-border/10 transition-all duration-1000 pt-20">
                    <div className="flex gap-16">
                      {[Zap, RefreshCw, Layers, Sparkles, Brain].map((Icon, i) => (
                        <Icon key={i} className="w-5 h-5 text-text-muted hover:text-accent transition-all duration-500 cursor-pointer hover:scale-150 hover:rotate-12" />
                      ))}
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                       <p className="label-micro !text-[9px] font-black text-text-primary tracking-[0.5em]">Architectural Core v3.2.0 // Neural Lattice</p>
                       <div className="text-[8px] uppercase tracking-[1em] text-text-muted font-black border-t border-border/10 pt-3 opacity-60">The future of intentional creating</div>
                    </div>
                  </footer>

                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-12"
                >
                  <div className="w-20 h-20 border-2 border-border/50 flex items-center justify-center relative overflow-hidden group transition-all duration-700 hover:border-accent hover:rotate-45">
                    <Sparkles className="w-8 h-8 text-text-muted/30 transition-all duration-500 group-hover:text-accent group-hover:-rotate-45" />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-5xl md:text-8xl font-black italic mb-8 serif text-text-primary uppercase tracking-tighter leading-none">
                      Ready to <br /><span className="text-accent underline decoration-accent/10 underline-offset-[20px]">Manifest</span>
                    </h2>
                    <p className="label-micro max-w-sm mx-auto text-text-muted leading-relaxed opacity-60">
                      Seed your creative concept in the neural link to begin the synthesis process.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
