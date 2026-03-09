import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PillTabs from "@/components/PillTabs";
import ScoreRing from "@/components/ScoreRing";
import { 
  Sparkles, Instagram, Linkedin, Youtube, Twitter, Zap, Globe, Copy, Check, 
  Download, Save, Wand2, Video, FileText, Search, Edit, Trash2, RefreshCw,
  TrendingUp, BarChart3, Filter, Link as LinkIcon
} from "lucide-react";

const hookStyles = ["Question", "Bold Claim", "Statistic", "Story", "Contrarian", "How-to", "List", "Behind-the-scenes"];
const languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", "Gujarati", "Punjabi"];
const platforms = ["Instagram", "LinkedIn", "YouTube", "X (Twitter)", "TikTok", "Facebook"];
const contentTypes = ["Post", "Reel", "Story", "Carousel", "Video", "Thread", "Article"];
const processingModes = ["Smart Summary", "Key Points", "Story Format", "Tutorial Steps"];
const culturalContexts = ["Indian Context", "Western Context", "Southeast Asian", "Middle Eastern", "Global Neutral"];
const accessibilityLevels = ["Standard", "Simple Language", "Screen Reader Optimized", "Visual Descriptions Added"];

interface GeneratedHookContent {
  mainHook: string;
  alternativeHooks: string[];
  engagementScore: number;
  clarityScore: number;
  hookStrength: number;
  reachPotential: "Low" | "Medium" | "High";
}

interface PlatformContent {
  Instagram: { caption: string; hashtags: string; charCount: number };
  LinkedIn: { post: string; charCount: number };
  YouTube: { script: string; title: string; charCount: number };
  "X (Twitter)": { tweets: string[]; charCount: number };
}

interface TranslationResult {
  translated: string;
  romanized?: string;
  culturalNotes: string[];
}

interface SavedContent {
  id: string;
  type: "Post" | "Hook" | "Thumbnail" | "Translation";
  content: string;
  platform: string;
  date: string;
  usageCount: number;
}

const ContentStudio = () => {
  const [subTab, setSubTab] = useState("Hook & Platform Writer");
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedHook, setSelectedHook] = useState(0);
  const [activePlatformTab, setActivePlatformTab] = useState("Instagram");
  const [showRomanized, setShowRomanized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [libraryFilter, setLibraryFilter] = useState("All");
  
  // Form states
  const [hookFormData, setHookFormData] = useState({
    content: "",
    niche: "",
    platform: "Instagram",
    hookStyle: "Question",
    targetAudience: "",
    tone: "Professional"
  });
  
  const [assemblyFormData, setAssemblyFormData] = useState({
    content: "",
    platform: "Instagram",
    contentFormat: "Post",
    processingMode: "Smart Summary",
    youtubeUrl: ""
  });
  
  const [translationFormData, setTranslationFormData] = useState({
    content: "",
    targetLanguage: "Hindi",
    culturalContext: "Indian Context",
    accessibilityLevel: "Standard"
  });
  
  // Generated content states
  const [hookContent, setHookContent] = useState<GeneratedHookContent | null>(null);
  const [platformContent, setPlatformContent] = useState<PlatformContent | null>(null);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [savedLibrary, setSavedLibrary] = useState<SavedContent[]>([
    { id: "1", type: "Post", content: "5 AI Tools That Replace Teams", platform: "Instagram", date: "2 hours ago", usageCount: 5 },
    { id: "2", type: "Hook", content: "🤖 These 5 AI tools just made my entire team obsolete...", platform: "Multi", date: "1 day ago", usageCount: 12 },
    { id: "3", type: "Post", content: "The AI Automation Playbook", platform: "LinkedIn", date: "3 days ago", usageCount: 8 }
  ]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (subTab === "Hook & Platform Writer" && !loading) {
          handleGenerateHook();
        } else if (subTab === "Content Assembly" && !loading) {
          handleGenerateAssembly();
        } else if (subTab === "Language & Accessibility" && !loading) {
          handleTranslate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [subTab, loading, hookFormData, assemblyFormData, translationFormData]);

  // TAB 1: Hook & Platform Writer
  const handleGenerateHook = async () => {
    if (!hookFormData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter your content idea first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_LAMBDA_GENERATE_HOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hookFormData)
      });

      if (!response.ok) throw new Error('Generation failed');

      const result = await response.json();
      setHookContent(result);
      
      toast({
        title: "Hook Generated! 🎉",
        description: "Your AI-powered hook is ready",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // TAB 2: Content Assembly
  const handleGenerateAssembly = async () => {
    if (!assemblyFormData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to process",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_LAMBDA_GENERATE_ASSEMBLY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assemblyFormData)
      });

      if (!response.ok) throw new Error('Generation failed');

      const result = await response.json();
      setPlatformContent(result);
      
      toast({
        title: "Content Generated! 🎨",
        description: "Platform-specific versions ready",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // TAB 3: Translation
  const handleTranslate = async () => {
    if (!translationFormData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to translate",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_LAMBDA_TRANSLATE_CONTENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translationFormData)
      });

      if (!response.ok) throw new Error('Translation failed');

      const result = await response.json();
      setTranslationResult(result);
      
      toast({
        title: "Translated! 🌍",
        description: `Content adapted to ${translationFormData.targetLanguage}`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Translation Failed",
        description: error instanceof Error ? error.message : "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Extract from YouTube URL
  const handleExtractFromVideo = async () => {
    if (!assemblyFormData.youtubeUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    toast({
      title: "Extracting...",
      description: "Analyzing video content",
    });

    try {
      const response = await fetch('http://localhost:3001/api/extract-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: assemblyFormData.youtubeUrl })
      });

      if (!response.ok) throw new Error('Extraction failed');

      const result = await response.json();
      setAssemblyFormData({
        ...assemblyFormData,
        content: result.extractedContent
      });
      
      toast({
        title: "Extracted! 📹",
        description: "Content idea extracted from video",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Extraction Failed",
        description: "Could not extract content from video. Please try entering content manually.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string = "Content") => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast({
      title: "Copied! ✓",
      description: `${label} copied to clipboard`,
    });
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Save to library
  const saveToLibrary = (content: string, type: SavedContent["type"], platform: string) => {
    const newItem: SavedContent = {
      id: Date.now().toString(),
      type,
      content,
      platform,
      date: "Just now",
      usageCount: 0
    };
    setSavedLibrary([newItem, ...savedLibrary]);
    toast({
      title: "Saved to Library! 💾",
      description: `${type} saved successfully`,
    });
  };

  // Delete from library
  const deleteFromLibrary = (id: string) => {
    setSavedLibrary(savedLibrary.filter(item => item.id !== id));
    toast({
      title: "Deleted",
      description: "Item removed from library",
    });
  };

  // Export library
  const exportLibrary = () => {
    const dataStr = JSON.stringify(savedLibrary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-library-${Date.now()}.json`;
    link.click();
    toast({
      title: "Exported! 📥",
      description: "Library downloaded as JSON",
    });
  };

  // Get quality badge
  const getQualityBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "bg-green-500/10 text-green-500 border-green-500/20" };
    if (score >= 60) return { label: "Good", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    return { label: "Needs Work", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" };
  };

  // Get reach potential badge
  const getReachBadge = (potential: string) => {
    if (potential === "High") return { label: "High Reach Potential 🔥", color: "bg-red-500/10 text-red-500" };
    if (potential === "Medium") return { label: "Medium Reach Potential ⚡", color: "bg-yellow-500/10 text-yellow-500" };
    return { label: "Low Reach Potential 💡", color: "bg-blue-500/10 text-blue-500" };
  };

  // Filter library
  const filteredLibrary = savedLibrary.filter(item => {
    const matchesFilter = libraryFilter === "All" || 
                         (libraryFilter === "Posts" && item.type === "Post") ||
                         (libraryFilter === "Hooks" && item.type === "Hook") ||
                         (libraryFilter === "Thumbnails" && item.type === "Thumbnail") ||
                         (libraryFilter === "Translations" && item.type === "Translation");
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Library stats
  const libraryStats = {
    total: savedLibrary.length,
    thisWeek: savedLibrary.filter(item => item.date.includes("hour") || item.date.includes("day")).length,
    mostUsed: savedLibrary.reduce((acc, item) => item.platform === "Instagram" ? acc + 1 : acc, 0) > savedLibrary.length / 2 ? "Instagram" : "LinkedIn"
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <PillTabs
        tabs={["Hook & Platform Writer", "Content Assembly", "Language & Accessibility", "Content Library"]}
        active={subTab}
        onChange={(t) => { 
          setSubTab(t); 
          setHookContent(null);
          setPlatformContent(null);
          setTranslationResult(null);
        }}
      />

      {/* TAB 1: Hook & Platform Writer */}
      {subTab === "Hook & Platform Writer" && (
        <div className="space-y-6 animate-fade-in">
          {/* Input Form */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">AI Hook Generator</h3>
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Enter to generate</span>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Content Idea</label>
              <textarea
                placeholder="Enter your content idea (e.g., '5 AI tools for video editing')..."
                rows={4}
                value={hookFormData.content}
                onChange={(e) => setHookFormData({...hookFormData, content: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">{hookFormData.content.length} characters</span>
                <span className="text-xs text-muted-foreground">{hookFormData.content.split(' ').filter(w => w).length} words</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Niche</label>
                <input 
                  placeholder="e.g., Tech, Fitness" 
                  value={hookFormData.niche}
                  onChange={(e) => setHookFormData({...hookFormData, niche: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow" 
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
                <select 
                  value={hookFormData.platform}
                  onChange={(e) => setHookFormData({...hookFormData, platform: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {platforms.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Hook Style</label>
                <select 
                  value={hookFormData.hookStyle}
                  onChange={(e) => setHookFormData({...hookFormData, hookStyle: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {hookStyles.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Tone</label>
                <select 
                  value={hookFormData.tone}
                  onChange={(e) => setHookFormData({...hookFormData, tone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Humorous</option>
                  <option>Inspirational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Target Audience</label>
              <input 
                placeholder="e.g., Entrepreneurs, Students" 
                value={hookFormData.targetAudience}
                onChange={(e) => setHookFormData({...hookFormData, targetAudience: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow" 
              />
            </div>

            <button 
              onClick={handleGenerateHook} 
              disabled={loading || !hookFormData.content.trim()} 
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4 animate-fade-in">
              <div className="card-surface p-6 space-y-4">
                <div className="h-6 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="h-32 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
                  <div className="h-24 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
                  <div className="h-24 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Output */}
          {hookContent && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              {/* Left: Hook Content */}
              <div className="space-y-4">
                <div className="card-surface p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading text-sm font-bold text-foreground">Generated Hook</h4>
                    <button
                      onClick={() => copyToClipboard(hookContent.alternativeHooks[selectedHook], "Hook")}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      {copiedText === hookContent.alternativeHooks[selectedHook] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-input border border-border">
                    <p className="text-foreground text-base leading-relaxed">
                      {hookContent.alternativeHooks[selectedHook]}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => saveToLibrary(hookContent.alternativeHooks[selectedHook], "Hook", hookFormData.platform)}
                      className="flex-1 py-2 px-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save to Library
                    </button>
                  </div>
                </div>

                {/* Alternative Hooks */}
                <div className="card-surface p-6">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4">Alternative Variations</h4>
                  <div className="space-y-2">
                    {hookContent.alternativeHooks.map((hook, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedHook(i)}
                        className={`w-full p-3 rounded-lg text-left text-sm transition-all ${
                          selectedHook === i 
                            ? 'bg-primary/10 border-2 border-primary text-foreground' 
                            : 'bg-surface-input border border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {hook}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Quality Scores */}
              <div className="space-y-4">
                <div className="card-surface p-6">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-6">Quality Scores</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <ScoreRing score={hookContent.engagementScore} size={80} />
                      <p className="text-xs text-muted-foreground mt-2 text-center">Engagement</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <ScoreRing score={hookContent.clarityScore} size={80} />
                      <p className="text-xs text-muted-foreground mt-2 text-center">Clarity</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <ScoreRing score={hookContent.hookStrength} size={80} />
                      <p className="text-xs text-muted-foreground mt-2 text-center">Hook Strength</p>
                    </div>
                  </div>
                </div>

                <div className="card-surface p-6">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4">Reach Potential</h4>
                  <div className={`p-4 rounded-lg border ${getReachBadge(hookContent.reachPotential).color}`}>
                    <p className="text-center font-bold">{getReachBadge(hookContent.reachPotential).label}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hookContent && !loading && (
            <div className="card-surface p-12 flex flex-col items-center justify-center text-center animate-fade-in">
              <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">Ready to Create Amazing Hooks?</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Enter your content idea above and let AI generate attention-grabbing hooks optimized for your platform.
              </p>
              <p className="text-xs text-muted-foreground mt-4">💡 Tip: Be specific for better results</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Content Assembly */}
      {subTab === "Content Assembly" && (
        <div className="space-y-6 animate-fade-in">
          {/* Input Form */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">Content Assembly Line</h3>
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Enter to generate</span>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Raw Content Input</label>
              <textarea 
                placeholder="Paste raw text, voice transcript, or content idea..." 
                rows={6} 
                value={assemblyFormData.content}
                onChange={(e) => setAssemblyFormData({...assemblyFormData, content: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" 
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{assemblyFormData.content.split(' ').filter(w => w).length} words</span>
                  <span>{assemblyFormData.content.length} characters</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="YouTube URL"
                      value={assemblyFormData.youtubeUrl}
                      onChange={(e) => setAssemblyFormData({...assemblyFormData, youtubeUrl: e.target.value})}
                      className="px-3 py-1 text-xs rounded bg-surface-input border border-border focus:outline-none focus:border-primary"
                    />
                    <button 
                      onClick={handleExtractFromVideo}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10"
                    >
                      <Video className="w-3 h-3" />
                      From Video
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Target Platform</label>
                <select 
                  value={assemblyFormData.platform}
                  onChange={(e) => setAssemblyFormData({...assemblyFormData, platform: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {platforms.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Content Format</label>
                <select 
                  value={assemblyFormData.contentFormat}
                  onChange={(e) => setAssemblyFormData({...assemblyFormData, contentFormat: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {contentTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Processing Mode</label>
                <select 
                  value={assemblyFormData.processingMode}
                  onChange={(e) => setAssemblyFormData({...assemblyFormData, processingMode: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {processingModes.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerateAssembly} 
              disabled={loading || !assemblyFormData.content.trim()} 
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Post
                </>
              )}
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="card-surface p-6 space-y-4 animate-fade-in">
              <div className="h-6 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
              <div className="h-48 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
            </div>
          )}

          {/* Platform Tabs Output */}
          {platformContent && !loading && (
            <div className="card-surface p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-heading text-sm font-bold text-foreground">Platform-Specific Content</h4>
                <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getQualityBadge(85).color}`}>
                  {getQualityBadge(85).label}
                </div>
              </div>

              {/* Platform Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {Object.keys(platformContent).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setActivePlatformTab(platform)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activePlatformTab === platform
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-input text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {platform === "Instagram" && <Instagram className="w-4 h-4 inline mr-2" />}
                    {platform === "LinkedIn" && <Linkedin className="w-4 h-4 inline mr-2" />}
                    {platform === "YouTube" && <Youtube className="w-4 h-4 inline mr-2" />}
                    {platform === "X (Twitter)" && <Twitter className="w-4 h-4 inline mr-2" />}
                    {platform}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activePlatformTab === "Instagram" && platformContent.Instagram && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-surface-input border border-border">
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {platformContent.Instagram.caption}
                      </p>
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-blue-500 text-sm">{platformContent.Instagram.hashtags}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{platformContent.Instagram.charCount} characters</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(`${platformContent.Instagram.caption}\n\n${platformContent.Instagram.hashtags}`, "Instagram post")}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          {copiedText?.includes(platformContent.Instagram.caption) ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => saveToLibrary(platformContent.Instagram.caption, "Post", "Instagram")}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatformTab === "LinkedIn" && platformContent.LinkedIn && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-surface-input border border-border">
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {platformContent.LinkedIn.post}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{platformContent.LinkedIn.charCount} characters</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(platformContent.LinkedIn.post, "LinkedIn post")}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          {copiedText === platformContent.LinkedIn.post ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => saveToLibrary(platformContent.LinkedIn.post, "Post", "LinkedIn")}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatformTab === "YouTube" && platformContent.YouTube && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-surface-input border border-border space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Title:</p>
                        <p className="text-foreground font-medium">{platformContent.YouTube.title}</p>
                      </div>
                      <div className="border-t border-border pt-3">
                        <p className="text-xs text-muted-foreground mb-1">Script:</p>
                        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {platformContent.YouTube.script}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{platformContent.YouTube.charCount} characters</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(`${platformContent.YouTube.title}\n\n${platformContent.YouTube.script}`, "YouTube content")}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          {copiedText?.includes(platformContent.YouTube.title) ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => saveToLibrary(platformContent.YouTube.script, "Post", "YouTube")}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatformTab === "X (Twitter)" && platformContent["X (Twitter)"] && (
                  <div className="space-y-3">
                    {platformContent["X (Twitter)"].tweets.map((tweet, i) => (
                      <div key={i} className="p-4 rounded-lg bg-surface-input border border-border">
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-bold text-primary">Tweet {i + 1}</span>
                          <p className="flex-1 text-foreground text-sm leading-relaxed">{tweet}</p>
                          <button
                            onClick={() => copyToClipboard(tweet, `Tweet ${i + 1}`)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            {copiedText === tweet ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{platformContent["X (Twitter)"].tweets.length} tweets in thread</span>
                      <button
                        onClick={() => saveToLibrary(platformContent["X (Twitter)"].tweets.join("\n\n"), "Post", "X (Twitter)")}
                        className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                      >
                        <Save className="w-3 h-3" />
                        Save Thread
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!platformContent && !loading && (
            <div className="card-surface p-12 flex flex-col items-center justify-center text-center animate-fade-in">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">Transform Raw Content</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Paste your raw content and get platform-optimized versions for Instagram, LinkedIn, YouTube, and Twitter.
              </p>
              <p className="text-xs text-muted-foreground mt-4">💡 Tip: You can also extract content from YouTube videos</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Language & Accessibility */}
      {subTab === "Language & Accessibility" && (
        <div className="space-y-6 animate-fade-in">
          {/* Input Form */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">Language & Accessibility Adapter</h3>
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Enter to translate</span>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Content to Translate</label>
              <textarea 
                placeholder="Paste content to translate and adapt..." 
                rows={6} 
                value={translationFormData.content}
                onChange={(e) => setTranslationFormData({...translationFormData, content: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" 
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">{translationFormData.content.length} characters</span>
                <span className="text-xs text-muted-foreground">{translationFormData.content.split(' ').filter(w => w).length} words</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Target Language</label>
                <select 
                  value={translationFormData.targetLanguage}
                  onChange={(e) => setTranslationFormData({...translationFormData, targetLanguage: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {languages.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cultural Context</label>
                <select 
                  value={translationFormData.culturalContext}
                  onChange={(e) => setTranslationFormData({...translationFormData, culturalContext: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {culturalContexts.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Accessibility Level</label>
                <select 
                  value={translationFormData.accessibilityLevel}
                  onChange={(e) => setTranslationFormData({...translationFormData, accessibilityLevel: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
                >
                  {accessibilityLevels.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleTranslate} 
                disabled={loading || !translationFormData.content.trim()} 
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Translate & Adapt
                  </>
                )}
              </button>
              <button 
                className="px-6 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-sm transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Translate All Saved
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              <div className="card-surface p-6 space-y-4">
                <div className="h-6 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="h-32 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
              </div>
              <div className="card-surface p-6 space-y-4">
                <div className="h-6 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="h-32 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
              </div>
            </div>
          )}

          {/* Translation Output */}
          {translationResult && !loading && (
            <div className="space-y-6 animate-fade-in">
              {/* Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-surface p-6">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4">Original</h4>
                  <div className="p-4 rounded-lg bg-surface-input border border-border">
                    <p className="text-foreground text-sm leading-relaxed">{translationFormData.content}</p>
                  </div>
                </div>

                <div className="card-surface p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading text-sm font-bold text-foreground">Translated ({translationFormData.targetLanguage})</h4>
                    <button
                      onClick={() => copyToClipboard(translationResult.translated, "Translation")}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      {copiedText === translationResult.translated ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-input border border-border">
                    <p className="text-foreground text-sm leading-relaxed">{translationResult.translated}</p>
                  </div>
                  <button
                    onClick={() => saveToLibrary(translationResult.translated, "Translation", translationFormData.targetLanguage)}
                    className="w-full mt-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Translation
                  </button>
                </div>
              </div>

              {/* Romanized Version */}
              {translationResult.romanized && (
                <div className="card-surface p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading text-sm font-bold text-foreground">Romanized Version (Hinglish)</h4>
                    <button
                      onClick={() => setShowRomanized(!showRomanized)}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      {showRomanized ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showRomanized && (
                    <div className="p-4 rounded-lg bg-surface-input border border-border">
                      <p className="text-foreground text-sm leading-relaxed">{translationResult.romanized}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Cultural Adaptation Notes */}
              <div className="card-surface p-6">
                <h4 className="font-heading text-sm font-bold text-foreground mb-4">Cultural Adaptation Notes</h4>
                <ul className="space-y-2">
                  {translationResult.culturalNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="flex-1">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!translationResult && !loading && (
            <div className="card-surface p-12 flex flex-col items-center justify-center text-center animate-fade-in">
              <Globe className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">Reach Global Audiences</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Translate and culturally adapt your content for different languages and regions with AI-powered localization.
              </p>
              <p className="text-xs text-muted-foreground mt-4">💡 Tip: Choose the right cultural context for better adaptation</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Content Library */}
      {subTab === "Content Library" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-foreground">Your Content Library</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={exportLibrary}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-surface-input border border-border">
                <p className="text-2xl font-bold text-foreground">{libraryStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Saved</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-surface-input border border-border">
                <p className="text-2xl font-bold text-foreground">{libraryStats.thisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-surface-input border border-border">
                <p className="text-2xl font-bold text-foreground">{libraryStats.mostUsed}</p>
                <p className="text-xs text-muted-foreground">Most Used Platform</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search saved content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow"
                />
              </div>
              <div className="flex gap-2">
                {["All", "Posts", "Hooks", "Thumbnails", "Translations"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLibraryFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      libraryFilter === filter
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-input text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            {filteredLibrary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLibrary.map((item) => (
                  <div key={item.id} className="card-surface p-4 group hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-primary">{item.type}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyToClipboard(item.content, item.type)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Edit className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <button 
                          onClick={() => deleteFromLibrary(item.id)}
                          className="p-1 hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    </div>
                    <h5 className="font-medium text-foreground text-sm mb-2 line-clamp-2">{item.content}</h5>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <span>{item.platform}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Used {item.usageCount} times</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Save className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">No Content Found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery ? "Try a different search term" : "Start creating and saving content to build your library"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentStudio;
