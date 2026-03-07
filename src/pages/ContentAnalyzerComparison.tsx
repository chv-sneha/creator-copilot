import { useState } from "react";
import ScoreRing from "@/components/ScoreRing";
import { Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeContentWithBedrock } from "@/lib/bedrock";

interface AnalysisResult {
  score?: number;
  qualityScore?: number;
  hookRating?: number;
  suggestions?: string[];
  issues?: string[];
  platformTip?: string;
  hashtags?: string[];
  engagementPrediction?: "Low" | "Medium" | "High";
  engagementReason?: string;
}

const ContentAnalyzerComparison = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [region, setRegion] = useState("India");
  const [loading, setLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState<AnalysisResult | null>(null);
  const [bedrockResult, setBedrockResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({ title: "Content Required", description: "Please enter your content first", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    // Call both APIs in parallel
    const [geminiRes, bedrockRes] = await Promise.allSettled([
      fetch('http://localhost:3001/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, region })
      }).then(r => r.json()),
      analyzeContentWithBedrock(content, platform, region)
    ]);

    if (geminiRes.status === 'fulfilled') setGeminiResult(geminiRes.value);
    if (bedrockRes.status === 'fulfilled') setBedrockResult(bedrockRes.value);
    
    setLoading(false);
  };

  const ResultCard = ({ title, result, color }: { title: string; result: AnalysisResult | null; color: string }) => (
    <div className="space-y-4">
      <h3 className={`font-heading text-lg font-bold ${color}`}>{title}</h3>
      {!result ? (
        <div className="card-surface p-8 text-center text-muted-foreground">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Waiting for analysis...</p>
        </div>
      ) : (
        <>
          <div className="card-surface p-6 flex flex-col items-center">
            <ScoreRing score={result.score || result.qualityScore || 0} />
            <p className="text-sm text-muted-foreground mt-2">Quality Score</p>
            {result.hookRating !== undefined && (
              <div className="mt-3">
                <p className="text-xl font-bold text-primary">{result.hookRating}/10</p>
                <p className="text-xs text-muted-foreground">Hook Rating</p>
              </div>
            )}
          </div>

          {result.issues && result.issues.length > 0 && (
            <div className="card-surface p-4">
              <h4 className="text-sm font-bold mb-2 text-red-500">Issues</h4>
              <ul className="space-y-1">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span>•</span><span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="card-surface p-4">
              <h4 className="text-sm font-bold mb-2">Suggestions</h4>
              <ul className="space-y-1">
                {result.suggestions.map((sug, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span>•</span><span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.platformTip && (
            <div className="card-surface p-4">
              <h4 className="text-sm font-bold mb-2">Platform Tip</h4>
              <p className="text-xs text-muted-foreground">{result.platformTip}</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Input Section */}
      <div className="card-surface p-5 space-y-4">
        <h3 className="font-heading text-base font-bold">Compare AI Models</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste your social media post here..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none resize-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="px-4 py-3 rounded-lg bg-surface-input border border-border text-sm">
            <option>Instagram</option>
            <option>LinkedIn</option>
            <option>YouTube</option>
            <option>X (Twitter)</option>
            <option>TikTok</option>
          </select>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-4 py-3 rounded-lg bg-surface-input border border-border text-sm">
            <option>India</option>
            <option>United States</option>
            <option>Global</option>
          </select>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !content}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><span className="dot-bounce"><span /><span /><span /></span>Analyzing...</> : <><Sparkles className="w-4 h-4" />Compare Both Models</>}
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultCard title="🔷 Google Gemini" result={geminiResult} color="text-blue-500" />
        <ResultCard title="🟠 AWS Bedrock (Nova Lite)" result={bedrockResult} color="text-orange-500" />
      </div>
    </div>
  );
};

export default ContentAnalyzerComparison;
