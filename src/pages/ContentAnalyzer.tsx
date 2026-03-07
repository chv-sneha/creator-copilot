import { useState } from "react";
import ScoreRing from "@/components/ScoreRing";
import { Sparkles, Copy, Check, TrendingUp, Clock, Target, Zap, Heart, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeContentWithBedrock } from "@/lib/bedrock";
interface AnalysisResult {
  score: number;
  hookRating?: number;
  suggestions: string[];
  issues?: string[];
  platformTip?: string;
  hashtags: string[];
  engagementPrediction: "Low" | "Medium" | "High";
  engagementReason: string;
  readabilityScore?: number;
  sentimentScore?: number;
  keywordDensity?: { [key: string]: number };
  optimalPostingTimes?: string[];
  competitorAnalysis?: string;
  viralPotential?: number;
  brandAlignment?: number;
  callToActionStrength?: number;
}

const ContentAnalyzer = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [region, setRegion] = useState("India");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "optimization">("overview");
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
      
      const mappedResult: AnalysisResult = {
        score: analysisResult.qualityScore || analysisResult.score || 0,
        hookRating: analysisResult.hookRating,
        suggestions: analysisResult.suggestions || [],
        issues: analysisResult.issues,
        platformTip: analysisResult.platformTip,
        hashtags: analysisResult.hashtags || [],
        engagementPrediction: analysisResult.engagementPrediction || "Medium",
        engagementReason: analysisResult.engagementReason || "Analysis complete",
        readabilityScore: analysisResult.readabilityScore,
        sentimentScore: analysisResult.sentimentScore,
        keywordDensity: analysisResult.keywordDensity,
        optimalPostingTimes: analysisResult.optimalPostingTimes,
        competitorAnalysis: analysisResult.competitorAnalysis,
        viralPotential: analysisResult.viralPotential,
        brandAlignment: analysisResult.brandAlignment,
        callToActionStrength: analysisResult.callToActionStrength,
      };
      
      setResult(mappedResult);
      setAnalyzed(true);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong, please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyHashtag = (hashtag: string) => {
    navigator.clipboard.writeText(hashtag);
    setCopiedHashtag(hashtag);
    toast({
      title: "Copied!",
      description: `${hashtag} copied to clipboard`,
    });
    setTimeout(() => setCopiedHashtag(null), 2000);
  };

  const copyAllHashtags = () => {
    if (result?.hashtags) {
      const hashtagText = result.hashtags.join(' ');
      navigator.clipboard.writeText(hashtagText);
      toast({
        title: "All Hashtags Copied!",
        description: `${result.hashtags.length} hashtags copied to clipboard`,
      });
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 20) return "text-green-500";
    if (score > -20) return "text-yellow-500";
    return "text-red-500";
  };

  const getMetricColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const exportAnalysis = () => {
    if (!result) return;
    
    const exportData = {
      content: content.substring(0, 100) + "...",
      platform,
      region,
      analysisDate: new Date().toISOString(),
      ...result
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis Exported!",
      description: "Your analysis has been downloaded as a JSON file",
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return "text-primary";
    if (score >= 40) return "text-yellow-400";
    return "text-destructive";
  };

  const getEngagementColor = (prediction: string) => {
    if (prediction === "High") return "bg-primary/10 text-primary border-primary/20";
    if (prediction === "Medium") return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
      {/* Left — Input */}
      <div className="space-y-4">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground">Analyze Your Content (AWS Bedrock)</h3>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Paste your content draft</label>
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
              <span className="text-xs text-muted-foreground">
                {platform === 'X (Twitter)' && content.length > 280 ? 'Exceeds Twitter limit' : 
                 platform === 'Instagram' && content.length > 2200 ? 'Exceeds Instagram limit' : 
                 'Within limits'}
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
                <option>Pinterest</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Posting Region</label>
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
                <option>Germany</option>
                <option>France</option>
                <option>Japan</option>
                <option>Brazil</option>
                <option>Global</option>
                <option>Europe</option>
                <option>Asia</option>
                <option>North America</option>
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
                <span>Analyzing...</span>
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

      {/* Right — Output */}
      <div className="space-y-4">
        {!analyzed || !result ? (
          <div className="card-surface p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Sparkles className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">Paste your content and hit Analyze to get AI-powered insights</p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="card-surface p-1 flex rounded-lg">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "overview" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("metrics")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "metrics" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Advanced Metrics
              </button>
              <button
                onClick={() => setActiveTab("optimization")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "optimization" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Optimization
              </button>
              <button
                onClick={exportAnalysis}
                className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-all"
                title="Export Analysis"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Content Quality Score */}
                <div className="card-surface p-6 flex flex-col items-center animate-fade-in">
                  <ScoreRing score={result.score} />
                  <p className={`text-3xl font-heading font-extrabold mt-3 ${getScoreColor(result.score)}`}>
                    {result.score > 70 ? "Excellent" : result.score >= 40 ? "Good" : "Needs Work"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Content Quality Score</p>
                  {result.hookRating !== undefined && (
                    <div className="mt-4 text-center">
                      <p className="text-2xl font-bold text-primary">{result.hookRating}/10</p>
                      <p className="text-xs text-muted-foreground">Hook Rating</p>
                    </div>
                  )}
                </div>

                {/* Issues */}
                {result.issues && result.issues.length > 0 && (
                  <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-red-500">⚠</span>
                      Issues Found
                    </h4>
                    <ul className="space-y-3">
                      {result.issues.map((issue, index) => (
                        <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span className="flex-1">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions for Improvement */}
                <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Suggestions for Improvement
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

                {/* Platform Tip */}
                {result.platformTip && (
                  <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      {platform} Pro Tip
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.platformTip}
                    </p>
                  </div>
                )}

                {/* Predicted Engagement */}
                <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <h4 className="font-heading text-sm font-bold text-foreground mb-3">
                    Predicted Engagement
                  </h4>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-4 py-2 rounded-lg border font-bold text-sm ${getEngagementColor(result.engagementPrediction)}`}>
                      {result.engagementPrediction}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.engagementReason}
                  </p>
                </div>
              </>
            )}

            {/* Advanced Metrics Tab */}
            {activeTab === "metrics" && (
              <>
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <div className="card-surface p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-muted-foreground">Readability</span>
                    </div>
                    <p className={`text-2xl font-bold ${getMetricColor(result.readabilityScore || 50)}`}>
                      {result.readabilityScore || 50}%
                    </p>
                  </div>
                  
                  <div className="card-surface p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-xs font-medium text-muted-foreground">Sentiment</span>
                    </div>
                    <p className={`text-2xl font-bold ${getSentimentColor(result.sentimentScore || 0)}`}>
                      {result.sentimentScore || 0}
                    </p>
                  </div>

                  <div className="card-surface p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-medium text-muted-foreground">Viral Potential</span>
                    </div>
                    <p className={`text-2xl font-bold ${getMetricColor(result.viralPotential || 30)}`}>
                      {result.viralPotential || 30}%
                    </p>
                  </div>

                  <div className="card-surface p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-muted-foreground">Brand Alignment</span>
                    </div>
                    <p className={`text-2xl font-bold ${getMetricColor(result.brandAlignment || 50)}`}>
                      {result.brandAlignment || 50}%
                    </p>
                  </div>
                </div>

                {/* Keyword Density */}
                {result.keywordDensity && Object.keys(result.keywordDensity).length > 0 && (
                  <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                    <h4 className="font-heading text-sm font-bold text-foreground mb-4">
                      Keyword Density
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(result.keywordDensity).slice(0, 5).map(([keyword, density], index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-foreground">{keyword}</span>
                          <span className="text-sm text-muted-foreground">{density}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimal Posting Times */}
                <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Optimal Posting Times ({region})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(result.optimalPostingTimes || ["9:00 AM", "1:00 PM", "7:00 PM"]).map((time, index) => (
                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Optimization Tab */}
            {activeTab === "optimization" && (
              <>
                {/* Hashtag Recommendations */}
                <div className="card-surface p-5 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-heading text-sm font-bold text-foreground">
                      Hashtag Recommendations
                    </h4>
                    <button
                      onClick={copyAllHashtags}
                      className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        onClick={() => copyHashtag(hashtag)}
                        className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-medium transition-all hover:scale-105 flex items-center gap-1.5"
                      >
                        {hashtag}
                        {copiedHashtag === hashtag ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-50" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Competitor Analysis */}
                {result.competitorAnalysis && (
                  <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                    <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Competitor Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.competitorAnalysis}
                    </p>
                  </div>
                )}

                {/* Call-to-Action Strength */}
                <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <h4 className="font-heading text-sm font-bold text-foreground mb-4">
                    Call-to-Action Effectiveness
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${result.callToActionStrength || 40}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold ${getMetricColor(result.callToActionStrength || 40)}`}>
                      {result.callToActionStrength || 40}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentAnalyzer;
