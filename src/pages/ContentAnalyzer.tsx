import { useState } from "react";
import ScoreRing from "@/components/ScoreRing";
import { Sparkles, Clock, AlertTriangle } from "lucide-react";

const breakdownItems = [
  { label: "Engagement", score: 85 },
  { label: "Clarity", score: 78 },
  { label: "Grammar", score: 92 },
  { label: "Hook Strength", score: 70 },
  { label: "Hashtag Quality", score: 65 },
];

const ContentAnalyzer = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [region, setRegion] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!content) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
      {/* Left — Input */}
      <div className="space-y-4">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground">Analyze Your Content</h3>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Paste your content draft</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or paste your social media post here..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
              >
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>YouTube</option>
                <option>X (Twitter)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Posting Region</label>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. India, US, Global"
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !content}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="dot-bounce"><span /><span /><span /></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right — Output */}
      <div className="space-y-4">
        {!analyzed ? (
          <div className="card-surface p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Sparkles className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">Paste your content and hit Analyze to get AI-powered insights</p>
          </div>
        ) : (
          <>
            {/* Score Ring */}
            <div className="card-surface p-6 flex flex-col items-center animate-fade-in">
              <ScoreRing score={78} />
              <p className="text-sm text-muted-foreground mt-3">Overall Content Score</p>
            </div>

            {/* Breakdown */}
            <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <h4 className="font-heading text-sm font-bold text-foreground mb-4">Score Breakdown</h4>
              <div className="space-y-3">
                {breakdownItems.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-heading font-bold text-primary">{item.score}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${item.score}%`,
                          background: item.score >= 75 ? "hsl(84 100% 65%)" : item.score >= 50 ? "hsl(45 100% 65%)" : "hsl(0 100% 70%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Flagged Issues
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  Hook could be stronger — consider starting with a question or bold claim.
                </div>
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  Only 2 hashtags used — aim for 5–8 relevant hashtags for better discovery.
                </div>
              </div>
            </div>

            {/* Best time + Rewrite */}
            <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.45s" }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-accent-blue" />
                <span className="text-sm text-muted-foreground">Best posting time for {platform}:</span>
                <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-bold">6:30 PM IST</span>
              </div>
              <h4 className="font-heading text-sm font-bold text-foreground mb-2">AI-Rewritten Version</h4>
              <div className="p-4 rounded-lg bg-surface-input border border-primary/20 text-sm text-foreground leading-relaxed">
                🚀 Ever wondered what separates viral content from average posts? Here are 5 game-changing principles every creator needs to master in 2025. Thread 🧵 #ContentCreation #CreatorEconomy #ViralContent #SocialMedia #GrowthHacks
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentAnalyzer;
