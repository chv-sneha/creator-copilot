import { useState } from "react";
import PillTabs from "@/components/PillTabs";
import { Sparkles, Instagram, Linkedin, Youtube, Twitter, Zap, Globe } from "lucide-react";

const hookStyles = ["Question", "Bold Claim", "Statistic", "Story", "Contrarian"];
const languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali"];

const ContentStudio = () => {
  const [subTab, setSubTab] = useState("Hook & Platform Writer");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <PillTabs
        tabs={["Hook & Platform Writer", "Content Assembly", "Language & Accessibility"]}
        active={subTab}
        onChange={(t) => { setSubTab(t); setGenerated(false); }}
      />

      {subTab === "Hook & Platform Writer" && (
        <div className="space-y-6 animate-fade-in">
          {/* Input */}
          <div className="card-surface p-5 space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">Generate Hooks & Platform Content</h3>
            <textarea
              placeholder="Enter your raw content idea (e.g., '5 AI tools that replaced my team')..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input placeholder="Niche (e.g., Tech)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
              <select className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
                <option>Instagram</option><option>LinkedIn</option><option>YouTube</option><option>X (Twitter)</option>
              </select>
              <select className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
                {hookStyles.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
              {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Sparkles className="w-4 h-4" />Generate</>}
            </button>
          </div>

          {generated && (
            <>
              {/* Hooks */}
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Generated Hooks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["🤖 These 5 AI tools just made my entire team obsolete...", "What if I told you AI can do 90% of your work?", "Stop hiring. Start automating. Here's how →", "I replaced 5 employees with these AI tools (results shocked me)", "The AI revolution isn't coming — it's already here"].map((hook, i) => (
                    <div key={i} className="card-surface p-4 text-sm text-foreground hover:border-primary/50 transition-colors cursor-pointer">
                      {hook}
                    </div>
                  ))}
                </div>
              </div>

              {/* Title chips */}
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {["5 AI Tools That Replace Teams", "The AI Automation Playbook", "Why I Fired My Team (For AI)", "AI vs Human: The Real Cost"].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors">{t}</span>
                ))}
              </div>

              {/* Platform Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <div className="platform-instagram border border-border rounded-[14px] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Instagram className="w-5 h-5 text-pink-400" />
                    <span className="font-heading text-sm font-bold text-foreground">Instagram</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">🤖 I replaced 5 team members with AI tools — and my productivity went UP 300%. Here are the exact tools I'm using (save this post): 1. ChatGPT for writing 2. Midjourney for design... #AITools #Productivity #CreatorTips</p>
                </div>
                <div className="platform-linkedin border border-border rounded-[14px] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                    <span className="font-heading text-sm font-bold text-foreground">LinkedIn</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">I made a controversial decision last month. I let go of 5 team members. Not because of budget cuts — because AI could do their jobs better, faster, and 24/7. Here's what happened next...</p>
                </div>
                <div className="platform-youtube border border-border rounded-[14px] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Youtube className="w-5 h-5 text-red-400" />
                    <span className="font-heading text-sm font-bold text-foreground">YouTube</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">I Replaced My Entire Team With AI — Here's What Happened (5 tools, real results, no BS). Watch as I walk through each tool and show you exactly how I set them up...</p>
                </div>
                <div className="platform-twitter border border-border rounded-[14px] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Twitter className="w-5 h-5 text-sky-400" />
                    <span className="font-heading text-sm font-bold text-foreground">X (Twitter)</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">I replaced 5 employees with AI tools. My output went up 300%. My costs went down 80%. Here are the 5 tools (thread) 🧵</p>
                </div>
              </div>

              {/* Thumbnail Concepts */}
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Thumbnail Concepts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { text: '"5 AI TOOLS"', palette: ["#b5ff4d", "#0a0a0f", "#ffffff"], tip: "Bold text overlay, shocked face, split screen" },
                    { text: '"AI vs TEAM"', palette: ["#ff6b6b", "#4d9fff", "#ffffff"], tip: "VS layout, contrast colors, minimal text" },
                    { text: '"I FIRED MY TEAM"', palette: ["#ff4444", "#b5ff4d", "#0a0a0f"], tip: "Clickbait style, emoji overlay, dark bg" },
                  ].map((thumb, i) => (
                    <div key={i} className="card-surface p-4">
                      <p className="font-heading text-lg font-extrabold text-foreground mb-2">{thumb.text}</p>
                      <div className="flex gap-1.5 mb-2">
                        {thumb.palette.map((c) => (
                          <span key={c} className="w-5 h-5 rounded-full border border-border" style={{ background: c }} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{thumb.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "Content Assembly" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-5 space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">Content Assembly Line</h3>
            <textarea placeholder="Paste raw text, voice transcript, or a link..." rows={5} className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" />
            <select className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
              <option>Instagram</option><option>LinkedIn</option><option>YouTube</option><option>X (Twitter)</option>
            </select>
            <button onClick={handleGenerate} disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Zap className="w-4 h-4" />Generate Post</>}
            </button>
          </div>
          {generated && (
            <div className="card-surface p-6 animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-sm font-bold text-foreground">Ready-to-Post Content</h4>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Saved ~45 mins
                </span>
              </div>
              <div className="p-4 rounded-lg bg-surface-input border border-border text-sm text-foreground leading-relaxed space-y-3">
                <p className="font-semibold">🚀 Stop scrolling — this might change how you create content forever.</p>
                <p>I spent the last 30 days testing every AI tool that promises to "10x your productivity." Most were garbage. But these 5? They actually delivered.</p>
                <p>Here's the breakdown: 🧵</p>
                <p>1/ ChatGPT-4 — Writing partner that never sleeps<br />2/ Midjourney — Visual content without a designer<br />3/ Descript — Video editing with AI magic<br />4/ Notion AI — Research assistant on steroids<br />5/ Buffer AI — Smart scheduling</p>
                <p className="text-primary font-medium">💬 Which AI tool changed YOUR workflow? Drop it below 👇</p>
                <p className="text-accent-blue">#AITools #ContentCreator #Productivity #TechCreator #CreatorEconomy</p>
              </div>
            </div>
          )}
        </div>
      )}

      {subTab === "Language & Accessibility" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-5 space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">Language & Accessibility Adapter</h3>
            <textarea placeholder="Paste content to translate and adapt..." rows={5} className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" />
            <select className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
              {languages.map(l => <option key={l}>{l}</option>)}
            </select>
            <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
              {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Globe className="w-4 h-4" />Translate & Adapt</>}
            </button>
          </div>
          {generated && (
            <>
              <div className="card-surface p-5 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="font-heading text-sm font-bold text-foreground">Translated Version</h4>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">Readability: 8.2/10</span>
                </div>
                <div className="p-4 rounded-lg bg-surface-input border border-border text-sm text-foreground leading-relaxed">
                  🚀 स्क्रॉल करना बंद करो — ये आपका content creation बदल सकता है। मैंने पिछले 30 दिन हर AI tool test किया। ज़्यादातर बेकार थे। लेकिन ये 5? इन्होंने सच में deliver किया...
                </div>
              </div>
              <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                <h4 className="font-heading text-sm font-bold text-foreground mb-3">Formatting Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Use shorter sentences for Hindi audience — attention span is lower on mobile</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Mix Hinglish where natural — pure Hindi feels too formal</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Keep emojis — they transcend language barriers</li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentStudio;
