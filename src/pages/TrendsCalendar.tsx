import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PillTabs from "@/components/PillTabs";
import { 
  TrendingUp, Calendar, Sparkles, Hash, Instagram, Linkedin, Youtube, Twitter, 
  Clock, Target, Users, Eye, BarChart3, Zap, Globe, Filter, Search,
  ChevronLeft, ChevronRight, Plus, Save, Copy, Check, Music, Facebook
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-4 h-4 text-pink-400" />,
  LinkedIn: <Linkedin className="w-4 h-4 text-blue-400" />,
  YouTube: <Youtube className="w-4 h-4 text-red-400" />,
  "X (Twitter)": <Twitter className="w-4 h-4 text-sky-400" />,
  TikTok: <Music className="w-4 h-4 text-black dark:text-white" />,
  Facebook: <Facebook className="w-4 h-4 text-blue-600" />,
};

const niches = ["Tech", "Fitness", "Business", "Lifestyle", "Education", "Entertainment", "Food", "Travel"];
const regions = ["Global", "India", "United States", "Europe", "Asia", "Middle East"];
const contentTypes = ["Post", "Reel", "Story", "Video", "Article", "Thread", "Carousel"];

interface TrendData {
  hashtag: string;
  volume: number;
  growth: number;
  platforms: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

interface ContentIdea {
  title: string;
  format: string;
  platform: string;
  estimatedReach: string;
  difficulty: "Easy" | "Medium" | "Hard";
  trending: boolean;
}

const TrendsCalendar = () => {
  const [subTab, setSubTab] = useState("Trend Intelligence");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    niche: "Tech",
    language: "English",
    region: "Global",
    platforms: ["Instagram", "LinkedIn", "YouTube"],
    targetAudience: "",
    contentGoal: "Engagement"
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock trending data
  const mockTrendData: TrendData[] = [
    { hashtag: "#AI2025", volume: 125000, growth: 45, platforms: ["Instagram", "LinkedIn", "YouTube"], difficulty: "Medium" },
    { hashtag: "#NoCode", volume: 89000, growth: 32, platforms: ["LinkedIn", "YouTube"], difficulty: "Easy" },
    { hashtag: "#TechStartup", volume: 156000, growth: 28, platforms: ["Instagram", "LinkedIn", "X (Twitter)"], difficulty: "Hard" },
    { hashtag: "#SoloFounder", volume: 67000, growth: 67, platforms: ["LinkedIn", "X (Twitter)"], difficulty: "Easy" },
    { hashtag: "#ProductHunt", volume: 45000, growth: 23, platforms: ["X (Twitter)", "LinkedIn"], difficulty: "Medium" },
    { hashtag: "#BuildInPublic", volume: 78000, growth: 41, platforms: ["X (Twitter)", "Instagram"], difficulty: "Easy" },
    { hashtag: "#SaaS", volume: 234000, growth: 19, platforms: ["LinkedIn", "YouTube"], difficulty: "Hard" },
    { hashtag: "#CreatorTools", volume: 34000, growth: 89, platforms: ["Instagram", "YouTube"], difficulty: "Easy" }
  ];

  const mockContentIdeas: ContentIdea[] = [
    { title: "AI Agents for Solo Creators", format: "YouTube Video", platform: "YouTube", estimatedReach: "50K–120K", difficulty: "Medium", trending: true },
    { title: "No-Code vs Code Debate", format: "Twitter Thread", platform: "X (Twitter)", estimatedReach: "20K–80K", difficulty: "Easy", trending: true },
    { title: "Day in Life of AI Creator", format: "Instagram Reel", platform: "Instagram", estimatedReach: "30K–90K", difficulty: "Easy", trending: false },
    { title: "SaaS Pricing Psychology", format: "LinkedIn Article", platform: "LinkedIn", estimatedReach: "15K–45K", difficulty: "Hard", trending: true },
    { title: "Building in Public Journey", format: "Instagram Carousel", platform: "Instagram", estimatedReach: "25K–60K", difficulty: "Medium", trending: true },
    { title: "Creator Economy Trends 2025", format: "YouTube Short", platform: "YouTube", estimatedReach: "40K–100K", difficulty: "Medium", trending: true }
  ];

  // Calendar data with more comprehensive scheduling
  const calendarData = [
    { day: "Mon", date: "Jan 6", platform: "Instagram", type: "Reel", topic: "Quick AI tip", time: "9:00 AM", status: "scheduled", engagement: "High" },
    { day: "Tue", date: "Jan 7", platform: "LinkedIn", type: "Article", topic: "Industry analysis", time: "8:00 AM", status: "draft", engagement: "Medium" },
    { day: "Wed", date: "Jan 8", platform: "YouTube", type: "Video", topic: "Tool review", time: "5:00 PM", status: "idea", engagement: "High" },
    { day: "Thu", date: "Jan 9", platform: "X (Twitter)", type: "Thread", topic: "Hot take on trends", time: "12:00 PM", status: "scheduled", engagement: "Medium" },
    { day: "Fri", date: "Jan 10", platform: "Instagram", type: "Carousel", topic: "Weekly roundup", time: "6:00 PM", status: "draft", engagement: "High" },
    { day: "Sat", date: "Jan 11", platform: "YouTube", type: "Short", topic: "Behind the scenes", time: "10:00 AM", status: "idea", engagement: "Medium" },
    { day: "Sun", date: "Jan 12", platform: "LinkedIn", type: "Post", topic: "Week reflection", time: "7:00 PM", status: "scheduled", engagement: "Low" },
  ];

  // Performance analytics data
  const performanceData = [
    { day: 'Mon', posts: 2, engagement: 450, reach: 12000 },
    { day: 'Tue', posts: 1, engagement: 320, reach: 8500 },
    { day: 'Wed', posts: 3, engagement: 680, reach: 18000 },
    { day: 'Thu', posts: 2, engagement: 520, reach: 14000 },
    { day: 'Fri', posts: 4, engagement: 890, reach: 25000 },
    { day: 'Sat', posts: 2, engagement: 340, reach: 9500 },
    { day: 'Sun', posts: 1, engagement: 280, reach: 7200 }
  ];

  const handleGenerateTrends = async () => {
    setLoading(true);
    try {
      // In a real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTrendData(mockTrendData);
      setContentIdeas(mockContentIdeas);
      setGenerated(true);
      toast({
        title: "Trends Discovered!",
        description: `Found ${mockTrendData.length} trending hashtags and ${mockContentIdeas.length} content ideas`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch trends. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCalendar = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setGenerated(true);
      toast({
        title: "Calendar Generated!",
        description: "Your weekly content calendar is ready",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-green-500/10 text-green-500";
      case "draft": return "bg-yellow-500/10 text-yellow-500";
      case "idea": return "bg-blue-500/10 text-blue-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <PillTabs 
        tabs={["Trend Intelligence", "AI Idea Calendar", "Scheduling"]} 
        active={subTab} 
        onChange={(t) => { setSubTab(t); setGenerated(false); }} 
      />

      {subTab === "Trend Intelligence" && (
        <div className="space-y-6 animate-fade-in">
          {/* Enhanced Search Form */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">Discover Trending Content</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Niche</label>
                  <select 
                    value={formData.niche}
                    onChange={(e) => setFormData({...formData, niche: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {niches.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Region</label>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {regions.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Language</label>
                  <input 
                    placeholder="e.g., English, Hindi" 
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Target Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(platformIcons).map(platform => (
                    <button
                      key={platform}
                      onClick={() => {
                        const newPlatforms = formData.platforms.includes(platform)
                          ? formData.platforms.filter(p => p !== platform)
                          : [...formData.platforms, platform];
                        setFormData({...formData, platforms: newPlatforms});
                      }}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-2 ${
                        formData.platforms.includes(platform)
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                      }`}
                    >
                      {platformIcons[platform]}
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerateTrends} 
              disabled={loading} 
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="dot-bounce"><span /><span /><span /></span>
                  <span>Discovering Trends...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Find Trends
                </>
              )}
            </button>
          </div>

          {generated && (
            <>
              {/* Trending Hashtags */}
              <div className="card-surface p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-500" />
                    Trending Hashtags
                  </h4>
                  <span className="text-xs text-muted-foreground">{trendData.length} hashtags found</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendData.map((trend, i) => (
                    <div key={i} className="p-4 rounded-lg bg-secondary border border-border group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-blue-500">{trend.hashtag}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(trend.difficulty)}`}>
                              {trend.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{trend.volume.toLocaleString()} posts</span>
                            <span className="text-green-500">+{trend.growth}% growth</span>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(trend.hashtag)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {copiedText === trend.hashtag ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex gap-1">
                        {trend.platforms.map(platform => (
                          <span key={platform} className="flex items-center">
                            {platformIcons[platform]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Ideas */}
              <div className="card-surface p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI-Generated Content Ideas
                  </h4>
                  <div className="flex gap-2">
                    <button className="text-xs text-muted-foreground hover:text-foreground">All</button>
                    <button className="text-xs text-muted-foreground hover:text-foreground">Trending</button>
                    <button className="text-xs text-muted-foreground hover:text-foreground">Easy</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentIdeas.map((idea, i) => (
                    <div key={i} className="card-surface p-4 group hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {idea.trending && <TrendingUp className="w-3 h-3 text-red-500" />}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(idea.difficulty)}`}>
                            {idea.difficulty}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(idea.title)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <h5 className="font-medium text-foreground text-sm mb-2">{idea.title}</h5>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Format: {idea.format}</span>
                          <span className="flex items-center gap-1">
                            {platformIcons[idea.platform]}
                            {idea.platform}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Est. Reach: {idea.estimatedReach}</span>
                          <button className="text-xs text-primary hover:text-primary/80 font-medium">
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div className="card-surface p-5">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Audience Behavior Insights
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Peak activity: 6-9 PM IST on weekdays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span>Short-form content gets 3x more engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                      <span>Tuesday & Thursday show highest engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      <span>Tech content performs best with visual elements</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-surface p-5">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4">Trending Topics This Week</h4>
                  <div className="space-y-2">
                    {[
                      { topic: "AI Automation", growth: "+89%" },
                      { topic: "No-Code Tools", growth: "+67%" },
                      { topic: "Creator Economy", growth: "+45%" },
                      { topic: "Remote Work", growth: "+34%" },
                      { topic: "Startup Funding", growth: "+23%" }
                    ].map((topic, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                        <span className="text-sm text-foreground">{topic.topic}</span>
                        <span className="text-xs text-green-500 font-medium">{topic.growth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "AI Idea Calendar" && (
        <div className="space-y-6 animate-fade-in">
          {/* Calendar Header */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-foreground">AI Content Calendar</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-foreground px-4">
                  Week of Jan {6 + currentWeek * 7} - {12 + currentWeek * 7}
                </span>
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Content Goal</label>
                <select 
                  value={formData.contentGoal}
                  onChange={(e) => setFormData({...formData, contentGoal: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                >
                  <option>Engagement</option>
                  <option>Brand Awareness</option>
                  <option>Lead Generation</option>
                  <option>Community Building</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Posting Frequency</label>
                <select className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
                  <option>Daily</option>
                  <option>3x per week</option>
                  <option>Weekly</option>
                  <option>Custom</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Content Mix</label>
                <select className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
                  <option>Balanced</option>
                  <option>Educational Focus</option>
                  <option>Entertainment Focus</option>
                  <option>Promotional Focus</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerateCalendar} 
              disabled={loading} 
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="dot-bounce"><span /><span /><span /></span>
                  <span>Generating Calendar...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Weekly Calendar
                </>
              )}
            </button>
          </div>

          {generated && (
            <>
              {/* Weekly Calendar Grid */}
              <div className="card-surface p-5 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  This Week's Content Plan
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {calendarData.map((item, i) => (
                    <div key={i} className="card-surface p-4 border border-border hover:border-primary/50 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">{item.day}</p>
                          <p className="text-sm font-bold text-foreground">{item.date}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          {platformIcons[item.platform]}
                          <span className="text-xs text-muted-foreground">{item.platform}</span>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-primary">{item.type}</p>
                          <p className="text-xs text-foreground line-clamp-2">{item.topic}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{item.time}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.engagement === 'High' ? 'bg-green-500/10 text-green-500' :
                            item.engagement === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-gray-500/10 text-gray-500'
                          }`}>
                            {item.engagement}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <button className="flex-1 text-xs text-primary hover:text-primary/80 font-medium">
                            Edit
                          </button>
                          <button className="flex-1 text-xs text-muted-foreground hover:text-foreground">
                            Duplicate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Ideas for Next Week */}
              <div className="card-surface p-5 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-foreground mb-4">AI Suggestions for Next Week</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { day: "Monday", idea: "Share weekend project results", type: "Behind-the-scenes", platform: "Instagram" },
                    { day: "Tuesday", idea: "Tutorial: Setting up AI workflow", type: "Educational", platform: "YouTube" },
                    { day: "Wednesday", idea: "Industry news roundup", type: "News Commentary", platform: "LinkedIn" },
                    { day: "Thursday", idea: "Q&A with followers", type: "Community", platform: "X (Twitter)" },
                    { day: "Friday", idea: "Week's wins and lessons", type: "Reflection", platform: "Instagram" },
                    { day: "Saturday", idea: "Tool recommendation", type: "Review", platform: "YouTube" }
                  ].map((suggestion, i) => (
                    <div key={i} className="p-4 rounded-lg bg-secondary border border-border group hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-primary">{suggestion.day}</span>
                        <button
                          onClick={() => toast({ title: "Added to Calendar", description: `${suggestion.idea} scheduled for ${suggestion.day}` })}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{suggestion.idea}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{suggestion.type}</span>
                        <div className="flex items-center gap-1">
                          {platformIcons[suggestion.platform]}
                          <span className="text-xs text-muted-foreground">{suggestion.platform}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "Scheduling" && (
        <div className="space-y-6 animate-fade-in">
          {/* Scheduling Interface */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">Smart Scheduling</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Content to Schedule</label>
                  <textarea 
                    placeholder="Paste your content here..." 
                    rows={4} 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
                    <select 
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                    >
                      {platforms.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Content Type</label>
                    <select 
                      value={formData.contentType}
                      onChange={(e) => setFormData({...formData, contentType: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                    >
                      {contentTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Schedule Date & Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="date" 
                      className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all" 
                    />
                    <input 
                      type="time" 
                      className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Optimal Time Suggestions</label>
                  <div className="space-y-2">
                    {[
                      { time: "9:00 AM", reason: "Peak morning engagement", score: "95%" },
                      { time: "1:00 PM", reason: "Lunch break activity", score: "87%" },
                      { time: "6:00 PM", reason: "Evening commute", score: "92%" }
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        className="w-full p-3 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{suggestion.time}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                          </div>
                          <span className="text-xs font-bold text-green-500">{suggestion.score}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => toast({ title: "Content Scheduled!", description: "Your post has been scheduled successfully" })}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Schedule Post
              </button>
              <button className="px-6 py-3 rounded-lg bg-secondary text-foreground font-bold text-sm hover:bg-secondary/80 transition-colors">
                Save Draft
              </button>
            </div>
          </div>

          {/* Scheduled Posts Queue */}
          <div className="card-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Scheduled Posts Queue
              </h4>
              <div className="flex gap-2">
                <button className="text-xs text-muted-foreground hover:text-foreground">All</button>
                <button className="text-xs text-primary font-medium">This Week</button>
                <button className="text-xs text-muted-foreground hover:text-foreground">Next Week</button>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { content: "5 AI tools that just changed everything...", platform: "LinkedIn", time: "Today, 2:00 PM", status: "scheduled" },
                { content: "Behind the scenes: Building my AI workflow", platform: "Instagram", time: "Tomorrow, 9:00 AM", status: "scheduled" },
                { content: "Hot take: No-code is the future of development", platform: "X (Twitter)", time: "Jan 8, 12:00 PM", status: "draft" },
                { content: "Weekly AI news roundup and analysis", platform: "YouTube", time: "Jan 10, 5:00 PM", status: "scheduled" }
              ].map((post, i) => (
                <div key={i} className="p-4 rounded-lg bg-secondary border border-border group hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {platformIcons[post.platform]}
                        <span className="text-xs font-medium text-muted-foreground">{post.platform}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1 line-clamp-1">{post.content}</p>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <Clock className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Scheduling */}
          <div className="card-surface p-5">
            <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Bulk Scheduling Tools
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors text-left">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-foreground">Weekly Batch</span>
                </div>
                <p className="text-xs text-muted-foreground">Schedule 7 posts across all platforms with optimal timing</p>
              </button>
              
              <button className="p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors text-left">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-foreground">Campaign Mode</span>
                </div>
                <p className="text-xs text-muted-foreground">Schedule coordinated content across platforms for maximum impact</p>
              </button>
              
              <button className="p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors text-left">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-foreground">Auto-Pilot</span>
                </div>
                <p className="text-xs text-muted-foreground">Let AI schedule your content based on audience behavior patterns</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendsCalendar;
