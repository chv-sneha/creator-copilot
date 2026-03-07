import { useState } from "react";
import ScoreRing from "@/components/ScoreRing";
import { Sparkles, AlertCircle, Lightbulb, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeContentWithBedrock } from "@/lib/bedrock";

interface BedrockResult {
  qualityScore: number;
  hookRating: number;
  issues: string[];
  suggestions: string[];
  platformTip: string;
}

const ContentAnalyzerBedrock = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [region, setRegion] = useState("India");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BedrockResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter your content first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const analysisResult = await analyzeContentWithBedrock(content, platform, region);
      setResult(analysisResult);
      setAnalyzed(true);
      toast({
        title: "Analysis Complete!",
        description: "Your content has been analyzed by AWS Bedrock",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
      {/* Left Panel - Input */}
      <div className="space-y-4">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground">
            Analyze Your Content (AWS Bedrock)
          </h3>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Paste your content draft
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or paste your social media post here..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {content.length} characters
              </span>
            </div>
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
                <option>TikTok</option>
                <option>Facebook</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Global</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !content}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="dot-bounce"><span /><span /><span /></span>
                <span>Analyzing with AWS Bedrock...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze with AWS Bedrock
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="space-y-4">
        {!analyzed || !result ? (
          <div className="card-surface p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Sparkles className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              Paste your content and hit Analyze to get AI-powered insights from AWS Bedrock
            </p>
          </div>
        ) : (
          <>
            {/* Quality Score */}
            <div className="card-surface p-6 flex flex-col items-center animate-fade-in">
              <ScoreRing score={result.qualityScore} />
              <p className={`text-3xl font-heading font-extrabold mt-3 ${getScoreColor(result.qualityScore)}`}>
                {result.qualityScore >= 70 ? "Excellent" : result.qualityScore >= 40 ? "Good" : "Needs Work"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Content Quality Score</p>
              <div className="mt-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Hook Rating: {result.hookRating}/10</span>
              </div>
            </div>

            {/* Issues Found */}
            {result.issues.length > 0 && (
              <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Issues Found
                </h4>
                <ul className="space-y-2">
                  {result.issues.map((issue, index) => (
                    <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span className="flex-1">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Improvement Suggestions
              </h4>
              <ul className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span className="flex-1">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform-Specific Tip */}
            <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                {platform} Optimization Tip
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.platformTip}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentAnalyzerBedrock;
