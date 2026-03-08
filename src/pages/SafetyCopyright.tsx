import { useState } from "react";
import { Shield, FileCheck, Eye, AlertTriangle, CheckCircle, Sparkles, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeSafety } from "@/lib/lambda";

interface SafetyAnalysis {
  overallScore: number;
  riskLevel: string;
  copyright: {
    score: number;
    status: string;
    issues: string[];
    suggestions: string[];
  };
  platformCompliance: {
    score: number;
    status: string;
    issues: string[];
    suggestions: string[];
  };
  accessibility: {
    score: number;
    status: string;
    readabilityGrade: number;
    sentenceLength: string;
    issues: string[];
    suggestions: string[];
  };
  languageSafety: {
    score: number;
    status: string;
    toxicity: boolean;
    issues: string[];
    suggestions: string[];
  };
  plagiarism: {
    score: number;
    similarityRisk: number;
    status: string;
    possibleSources: string[];
  };
  safeRewrite: string;
}

const SafetyCopyright = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [contentType, setContentType] = useState("Video Description");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to scan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeSafety({ content, platform, contentType });
      setAnalysis(response.analysis);
      toast({
        title: "✅ Analysis Complete",
        description: `Safety Score: ${response.analysis.overallScore}/100`
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Safe") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === "Warning") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "Safe") return "bg-green-500/10 text-green-500 border-green-500/20";
    if (status === "Warning") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "bg-green-500/10 text-green-500";
    if (risk === "Medium") return "bg-yellow-500/10 text-yellow-500";
    return "bg-red-500/10 text-red-500";
  };

  const copyRewrite = () => {
    if (analysis?.safeRewrite) {
      navigator.clipboard.writeText(analysis.safeRewrite);
      toast({ title: "Copied!", description: "Safe rewrite copied to clipboard" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
      {/* Left — Input */}
      <div className="space-y-4">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Content Safety Analyzer
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none">
                <option>YouTube</option>
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>X (Twitter)</option>
                <option>TikTok</option>
                <option>Facebook</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Content Type</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none">
                <option>Caption</option>
                <option>Script</option>
                <option>Blog Post</option>
                <option>Tweet</option>
                <option>Video Description</option>
                <option>Post</option>
              </select>
            </div>
          </div>

          <textarea
            placeholder="Paste your content to scan for copyright, compliance, and safety risks..."
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
          />
          <button onClick={handleScan} disabled={loading || !content.trim()} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Shield className="w-4 h-4" />Scan for Risks</>}
          </button>
        </div>

        {analysis && (
          <div className="card-surface p-5 animate-fade-in">
            <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Safe Rewrite
            </h4>
            <div className="p-3 rounded-lg bg-surface-input border border-border mb-3">
              <p className="text-sm text-foreground">{analysis.safeRewrite}</p>
            </div>
            <button onClick={copyRewrite} className="w-full py-2 rounded-lg bg-secondary border border-primary text-primary font-medium text-sm hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" />Copy Safe Version
            </button>
          </div>
        )}
      </div>

      {/* Right — Results */}
      <div className="space-y-4">
        {!analysis ? (
          <div className="card-surface p-5 flex flex-col items-center justify-center py-12 text-center">
            <Shield className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">Scan your content to see comprehensive safety analysis</p>
          </div>
        ) : (
          <>
            <div className="card-surface p-5 animate-fade-in">
              <h4 className="font-heading text-sm font-bold text-foreground mb-3">Content Safety Report</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Overall Safety Score</span>
                <span className="text-3xl font-bold text-primary">{analysis.overallScore}/100</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskLevel} Risk
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(analysis.copyright.status)}
                    <span className="text-sm font-medium">Copyright Risk</span>
                  </div>
                  <span className="text-sm font-bold">{analysis.copyright.score}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(analysis.languageSafety.status)}
                    <span className="text-sm font-medium">Language Safety</span>
                  </div>
                  <span className="text-sm font-bold">{analysis.languageSafety.score}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(analysis.accessibility.status)}
                    <span className="text-sm font-medium">Accessibility</span>
                  </div>
                  <span className="text-sm font-bold">{analysis.accessibility.score}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(analysis.platformCompliance.status)}
                    <span className="text-sm font-medium">Platform Compliance</span>
                  </div>
                  <span className="text-sm font-bold">{analysis.platformCompliance.score}</span>
                </div>
              </div>
            </div>

            <div className="card-surface p-5 animate-fade-in">
              <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                Plagiarism Check
              </h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${100 - analysis.plagiarism.similarityRisk}%` }}></div>
                </div>
                <span className="text-xl font-bold text-primary">{analysis.plagiarism.score}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Similarity Risk: {analysis.plagiarism.similarityRisk}%</p>
            </div>

            {(analysis.copyright.issues.length > 0 || analysis.platformCompliance.issues.length > 0 || analysis.accessibility.issues.length > 0) && (
              <div className="card-surface p-5 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-foreground mb-3">Issues Found</h4>
                <div className="space-y-2">
                  {[...analysis.copyright.issues, ...analysis.platformCompliance.issues, ...analysis.accessibility.issues].map((issue, i) => (
                    <div key={i} className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card-surface p-5 animate-fade-in">
              <h4 className="font-heading text-sm font-bold text-foreground mb-3">Recommendations</h4>
              <div className="space-y-2">
                {[...analysis.copyright.suggestions, ...analysis.platformCompliance.suggestions, ...analysis.accessibility.suggestions].map((suggestion, i) => (
                  <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span className="flex-1">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SafetyCopyright;
