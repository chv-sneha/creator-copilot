import { useState } from "react";
import { Shield, FileCheck, Eye, AlertTriangle, CheckCircle } from "lucide-react";

const SafetyCopyright = () => {
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setScanned(true); }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
      {/* Left — Copyright Shield */}
      <div className="space-y-4">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Copyright Shield
          </h3>
          <textarea
            placeholder="Paste your content to scan for copyright risks..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
          />
          <button onClick={handleScan} disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Shield className="w-4 h-4" />Scan for Risks</>}
          </button>
        </div>

        {scanned && (
          <>
            <div className="card-surface p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">Low Risk</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-destructive font-medium">Phrase match: "game-changing"</p>
                      <p className="text-xs text-muted-foreground mt-1">Safe alternative: "transformative" or "breakthrough"</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">Structure and wording are original — no plagiarism detected.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-accent-blue" />
                Proof of Originality
              </h4>
              <div className="p-3 rounded-lg bg-surface-input border border-border">
                <p className="font-mono text-xs text-muted-foreground break-all">
                  SHA-256: a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5<br />
                  Timestamp: 2025-02-25T18:42:00Z<br />
                  Content ID: CC-2025-0284751
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right — Language Safety */}
      <div className="space-y-4">
        <div className="card-surface p-5">
          <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-accent-blue" />
            Language Safety & Accessibility
          </h3>

          {!scanned ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Eye className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Scan your content on the left to see accessibility analysis here</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Accessibility Score:</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">8.5/10</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-400 font-medium">"Obsolete" — complex word</p>
                      <p className="text-xs text-muted-foreground mt-1">Simpler: "outdated" or "no longer needed"</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-400 font-medium">"On steroids" — non-inclusive phrase</p>
                      <p className="text-xs text-muted-foreground mt-1">Simpler: "supercharged" or "enhanced"</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">Overall tone is inclusive and appropriate for all audiences.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyCopyright;
