import { useState } from "react";
import PillTabs from "@/components/PillTabs";
import { TrendingUp, Calendar, Sparkles, Hash, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-4 h-4 text-pink-400" />,
  LinkedIn: <Linkedin className="w-4 h-4 text-blue-400" />,
  YouTube: <Youtube className="w-4 h-4 text-red-400" />,
  X: <Twitter className="w-4 h-4 text-sky-400" />,
};

const calendarData = [
  { day: "Mon", platform: "Instagram", type: "Reel", topic: "Quick AI tip", time: "9:00 AM" },
  { day: "Tue", platform: "LinkedIn", type: "Article", topic: "Industry analysis", time: "8:00 AM" },
  { day: "Wed", platform: "YouTube", type: "Video", topic: "Tool review", time: "5:00 PM" },
  { day: "Thu", platform: "X", type: "Thread", topic: "Hot take on trends", time: "12:00 PM" },
  { day: "Fri", platform: "Instagram", type: "Carousel", topic: "Weekly roundup", time: "6:00 PM" },
  { day: "Sat", platform: "YouTube", type: "Short", topic: "Behind the scenes", time: "10:00 AM" },
  { day: "Sun", platform: "LinkedIn", type: "Post", topic: "Week reflection", time: "7:00 PM" },
];

const TrendsCalendar = () => {
  const [subTab, setSubTab] = useState("Trend Intelligence");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <PillTabs tabs={["Trend Intelligence", "AI Idea Calendar"]} active={subTab} onChange={(t) => { setSubTab(t); setGenerated(false); }} />

      {subTab === "Trend Intelligence" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-5 space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">Discover Trending Content</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input placeholder="Niche (e.g., Tech, Fitness)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
              <input placeholder="Language (e.g., English)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
              <div className="flex flex-wrap gap-2 items-center">
                {["Instagram", "LinkedIn", "YouTube", "X"].map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-foreground cursor-pointer hover:border-primary/50 transition-colors">{p}</span>
                ))}
              </div>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
              {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><TrendingUp className="w-4 h-4" />Find Trends</>}
            </button>
          </div>

          {generated && (
            <>
              <div className="card-surface p-5 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2"><Hash className="w-4 h-4 text-accent-blue" />Trending Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {["#AI2025", "#NoCode", "#TechStartup", "#SoloFounder", "#ProductHunt", "#BuildInPublic", "#SaaS", "#CreatorTools"].map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                {[
                  { topic: "AI Agents for Solo Creators", format: "YouTube Video", reach: "50K–120K" },
                  { topic: "No-Code vs Code Debate", format: "Twitter Thread", reach: "20K–80K" },
                  { topic: "Day in Life of AI Creator", format: "Instagram Reel", reach: "30K–90K" },
                ].map((idea, i) => (
                  <div key={i} className="card-surface p-5">
                    <h5 className="font-heading text-sm font-bold text-foreground mb-2">{idea.topic}</h5>
                    <p className="text-xs text-muted-foreground mb-2">Format: {idea.format}</p>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">Est. Reach: {idea.reach}</span>
                  </div>
                ))}
              </div>
              <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h4 className="font-heading text-sm font-bold text-foreground mb-2">Audience Behavior Insight</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Your niche audience is most active between 6–9 PM IST on weekdays. Short-form content (Reels, Shorts) gets 3x more engagement than long posts. Tuesday and Thursday show the highest engagement rates for tech content.</p>
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "AI Idea Calendar" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-5 space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">Generate Your Week</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input placeholder="Niche (e.g., Tech)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
              <input placeholder="Target audience description" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
              <div className="flex flex-wrap gap-2 items-center">
                {["Instagram", "LinkedIn", "YouTube", "X"].map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-foreground cursor-pointer hover:border-primary/50 transition-colors">{p}</span>
                ))}
              </div>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
              {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Calendar className="w-4 h-4" />Generate Calendar</>}
            </button>
          </div>

          {generated && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 animate-fade-in">
              {calendarData.map((d, i) => (
                <div key={i} className="card-surface p-4 text-center space-y-2">
                  <p className="font-heading text-xs font-bold text-muted-foreground uppercase">{d.day}</p>
                  <div className="flex justify-center">{platformIcons[d.platform]}</div>
                  <p className="text-xs font-medium text-foreground">{d.type}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{d.topic}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{d.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendsCalendar;
