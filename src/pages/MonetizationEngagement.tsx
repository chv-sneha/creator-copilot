import { useState } from "react";
import { DollarSign, TrendingUp, MessageSquare, AlertTriangle, Sparkles, Clock } from "lucide-react";

const MonetizationEngagement = () => {
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoGenerated, setPromoGenerated] = useState(false);
  const [monetLoading, setMonetLoading] = useState(false);
  const [monetGenerated, setMonetGenerated] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentGenerated, setCommentGenerated] = useState(false);

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Section 1 — Promotional Timing */}
      <section className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Promotional Timing Advisor
        </h3>
        <div className="card-surface p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Content description (e.g., Tech review video)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input placeholder="Product/brand name" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input placeholder="Length (e.g., 10 min, 500 words)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
          </div>
          <button onClick={() => { setPromoLoading(true); setTimeout(() => { setPromoLoading(false); setPromoGenerated(true); }, 1000); }} disabled={promoLoading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
            {promoLoading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Sparkles className="w-4 h-4" />Analyze Timing</>}
          </button>
        </div>
        {promoGenerated && (
          <div className="card-surface p-5 animate-fade-in space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Optimal promo placement in your content:</p>
              <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
                <div className="absolute h-full bg-primary/20 rounded-full" style={{ width: "100%" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/30" style={{ left: "35%" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">Start</span>
                <span className="text-xs text-primary font-bold">35% mark</span>
                <span className="text-[10px] text-muted-foreground">End</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Best posting time:</span>
              <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-bold">Thursday 6:00 PM IST</span>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Audience drop-off risk: Placing promo before the 2-minute mark may reduce retention by 20%.</span>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-border" />

      {/* Section 2 — Monetization Predictor */}
      <section className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Monetization Predictor
        </h3>
        <div className="card-surface p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Topic (e.g., AI tools)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input placeholder="Monthly reach (e.g., 50K)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input placeholder="Audience (e.g., 18-35 males, India)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
          </div>
          <button onClick={() => { setMonetLoading(true); setTimeout(() => { setMonetLoading(false); setMonetGenerated(true); }, 1000); }} disabled={monetLoading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
            {monetLoading ? <span className="dot-bounce"><span /><span /><span /></span> : <><TrendingUp className="w-4 h-4" />Predict Earnings</>}
          </button>
        </div>
        {monetGenerated && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Monetization Score:</span>
              <span className="font-heading text-3xl font-extrabold text-primary">7.8</span>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Ad Revenue", range: "₹15K–₹40K/mo" },
                { label: "Brand Deals", range: "₹25K–₹80K/mo" },
                { label: "Affiliates", range: "₹10K–₹30K/mo" },
                { label: "Digital Products", range: "₹5K–₹50K/mo" },
              ].map((e) => (
                <div key={e.label} className="card-surface p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{e.label}</p>
                  <p className="font-heading text-sm font-bold text-primary">{e.range}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["SaaS Companies", "EdTech Brands", "Dev Tools"].map(b => (
                <span key={b} className="px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium">{b}</span>
              ))}
            </div>
            <div className="card-surface p-5">
              <h4 className="font-heading text-sm font-bold text-foreground mb-3">90-Day Action Steps</h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Build a media kit highlighting your audience demographics and engagement rates</li>
                <li>Reach out to 10 brands in your top-matched categories with personalized pitches</li>
                <li>Launch a digital product (e-book/course) on your best-performing topic</li>
                <li>Optimize affiliate links in your top 5 performing posts</li>
                <li>Create a dedicated "Sponsors" highlight/section on your profile</li>
              </ol>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-border" />

      {/* Section 3 — Comment Sentiment */}
      <section className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Comment Sentiment & Moderation
        </h3>
        <div className="card-surface p-5 space-y-4">
          <textarea
            placeholder="Paste comments (one per line)..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
          />
          <button onClick={() => { setCommentLoading(true); setTimeout(() => { setCommentLoading(false); setCommentGenerated(true); }, 1000); }} disabled={commentLoading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
            {commentLoading ? <span className="dot-bounce"><span /><span /><span /></span> : <><MessageSquare className="w-4 h-4" />Analyze Comments</>}
          </button>
        </div>
        {commentGenerated && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Positive", pct: 68, color: "hsl(84 100% 65%)" },
                { label: "Neutral", pct: 22, color: "hsl(215 100% 65%)" },
                { label: "Negative", pct: 10, color: "hsl(0 100% 70%)" },
              ].map((s) => (
                <div key={s.label} className="card-surface p-4">
                  <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mb-1">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <p className="font-heading text-lg font-extrabold" style={{ color: s.color }}>{s.pct}%</p>
                </div>
              ))}
            </div>

            <div className="card-surface p-5 space-y-2">
              <h4 className="font-heading text-sm font-bold text-foreground mb-2">Flagged Comments</h4>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold uppercase flex-shrink-0">Toxic</span>
                <p className="text-sm text-foreground">"This is just copied content, you have zero originality"</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase flex-shrink-0">Spam</span>
                <p className="text-sm text-foreground">"Check out my channel for FREE money making tips!!!"</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["AI Interest", "Tool Requests", "Pricing Questions", "Positive Feedback", "Skepticism"].map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium">{t}</span>
              ))}
            </div>

            <div className="card-surface p-5">
              <h4 className="font-heading text-sm font-bold text-foreground mb-2">Strategic Response Recommendation</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your audience is highly engaged with AI content but shows some skepticism. Consider addressing doubts transparently in your next post — share real numbers and behind-the-scenes proof. Pin the most constructive critical comment to show you value honest feedback. Ignore spam accounts but respond to genuine negative comments with empathy.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MonetizationEngagement;
