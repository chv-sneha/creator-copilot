import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Image, Download, RefreshCw, Save, Copy, Check, ChevronDown, ChevronUp, Sparkles, Zap, Target, TrendingUp, Eye, Upload, Layers } from "lucide-react";
import { generateThumbnail } from "@/lib/lambda";

const platforms = [
  { name: "YouTube", size: "1280x720" },
  { name: "Instagram", size: "1080x1080" },
  { name: "LinkedIn", size: "1200x627" },
  { name: "X (Twitter)", size: "1600x900" }
];

const styles = [
  "Bold & Dramatic",
  "Clean & Minimal",
  "Colorful & Vibrant",
  "Dark & Cinematic",
  "Professional & Corporate",
  "Fun & Playful"
];

const colorSchemes = [
  "Auto (AI decides)",
  "Dark Background",
  "Light Background",
  "Brand Colors (Blue/White)",
  "Warm Tones (Red/Orange)",
  "Cool Tones (Blue/Purple)"
];

const moods = ["Exciting", "Professional", "Inspiring", "Shocking", "Curious", "Urgent"];

const generationModes = [
  { 
    id: "structure", 
    title: "Structure Only", 
    desc: "Get layout suggestions and design guidelines",
    icon: Layers
  },
  { 
    id: "sample", 
    title: "Sample Thumbnail", 
    desc: "Generate a basic thumbnail preview",
    icon: Image
  },
  { 
    id: "professional", 
    title: "Professional Thumbnail", 
    desc: "Create a full-fledged thumbnail with custom elements",
    icon: Sparkles
  }
];

const tips = [
  { icon: Zap, text: "Use high contrast colors" },
  { icon: Target, text: "Keep text under 6 words" },
  { icon: Eye, text: "Show emotion/face if possible" },
  { icon: TrendingUp, text: "Test different styles" }
];

const ThumbnailGenerator = () => {
  const [videoTitle, setVideoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("YouTube");
  const [style, setStyle] = useState("Bold & Dramatic");
  const [colorScheme, setColorScheme] = useState("Auto (AI decides)");
  const [textOverlay, setTextOverlay] = useState(true);
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");
  const [selectedMood, setSelectedMood] = useState("Exciting");
  const [generationMode, setGenerationMode] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const mockGeneratedImage = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&h=720&fit=crop";
  const mockPrompt = `Create a ${style.toLowerCase()} thumbnail for ${selectedPlatform} with ${colorScheme.toLowerCase()}. Title: "${videoTitle}". ${textOverlay ? `Main text: "${mainText}", Sub text: "${subText}".` : ''} Mood: ${selectedMood}. ${description}`;

  const handleGenerate = async () => {
    if (!videoTitle.trim()) {
      toast({ title: "Title Required", description: "Please enter a video title", variant: "destructive" });
      return;
    }
    if (!generationMode) {
      toast({ title: "Mode Required", description: "Please select a generation mode", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await generateThumbnail({
        mode: generationMode,
        videoTitle,
        description,
        platform: selectedPlatform,
        style,
        colorScheme,
        mainText: textOverlay ? mainText : undefined,
        subText: textOverlay ? subText : undefined,
        mood: selectedMood
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setGeneratedResult(response);
      setGenerated(true);
      toast({ title: "✅ Generated!", description: `Your ${generationMode} thumbnail is ready` });
    } catch (error) {
      console.error('Generation error:', error);
      const errorMsg = error instanceof Error ? error.message : "Generation failed. Please try again.";
      toast({ title: "Generation Failed", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages]);
      toast({
        title: "Images Uploaded! 📸",
        description: `${files.length} image(s) added`
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    toast({
      title: "Downloaded! 📥",
      description: "Thumbnail saved to your device"
    });
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(mockPrompt);
    setCopiedPrompt(true);
    toast({
      title: "Copied! ✓",
      description: "Prompt copied to clipboard"
    });
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL - Input */}
        <div className="space-y-6">
          <div className="card-surface p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">Thumbnail Generator</h2>
              </div>
              <p className="text-sm text-muted-foreground">Generate eye-catching thumbnails powered by AWS</p>
            
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-3 block font-medium">Generation Mode</label>
              <div className="grid grid-cols-1 gap-3">
                {generationModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setGenerationMode(mode.id);
                      if (mode.id === "professional") {
                        navigate('/dashboard/thumbcraft');
                      }
                    }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      generationMode === mode.id
                        ? "bg-primary/10 border-primary"
                        : "bg-surface-input border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <mode.icon className={`w-5 h-5 mt-0.5 ${
                        generationMode === mode.id ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm mb-1 ${
                          generationMode === mode.id ? "text-primary" : "text-foreground"
                        }`}>{mode.title}</h4>
                        <p className="text-xs text-muted-foreground">{mode.desc}</p>
                      </div>
                      {generationMode === mode.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Video Title</label>
              <input
                type="text"
                placeholder="e.g., 5 AI Tools That Changed My Life"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Content Description</label>
              <textarea
                rows={4}
                placeholder="Describe what your video/post is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow resize-none"
              />
            </div>

            {generationMode === "professional" && (
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Upload Images/Elements</label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-surface-input">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload images</span>
                    <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt={`Upload ${i + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => setSelectedPlatform(platform.name)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedPlatform === platform.name
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-surface-input text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    <div>{platform.name}</div>
                    <div className="text-xs opacity-70 mt-1">{platform.size}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Thumbnail Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
              >
                {styles.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Color Scheme</label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow appearance-none"
              >
                {colorSchemes.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-muted-foreground">Text Overlay</label>
                <button
                  onClick={() => setTextOverlay(!textOverlay)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    textOverlay ? "bg-primary" : "bg-surface-input border border-border"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      textOverlay ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
              {textOverlay && (
                <div className="space-y-3 mt-3">
                  <input
                    type="text"
                    placeholder="Main Text (e.g., 5 AI TOOLS)"
                    value={mainText}
                    onChange={(e) => setMainText(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow"
                  />
                  <input
                    type="text"
                    placeholder="Sub Text (e.g., That Changed Everything)"
                    value={subText}
                    onChange={(e) => setSubText(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Mood/Emotion</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedMood === mood
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-input text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {generationMode !== "professional" && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                    <span>Generating with AWS Titan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Thumbnail
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Output */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="card-surface p-6">
            {!generated && !loading ? (
              <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <Image className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">Your thumbnail will appear here</h3>
                <p className="text-sm text-muted-foreground">Powered by Amazon Titan Image Generator</p>
              </div>
            ) : loading ? (
              <div className="rounded-lg overflow-hidden min-h-[400px] bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer"></div>
            ) : (
              <div className="space-y-4">
                {generatedResult?.mode === 'structure' && (
                  <div className="card-surface p-5 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-foreground">Layout Guidelines</h4>
                    <div className="space-y-3">
                      <div><p className="text-xs text-muted-foreground mb-1">Composition</p><p className="text-sm text-foreground">{generatedResult.result.layout?.composition}</p></div>
                      <div><p className="text-xs text-muted-foreground mb-1">Text Placement</p><p className="text-sm text-foreground">{generatedResult.result.layout?.textPlacement}</p></div>
                      <div><p className="text-xs text-muted-foreground mb-1">Color Zones</p><p className="text-sm text-foreground">{generatedResult.result.layout?.colorZones}</p></div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-foreground">Design Guidelines</h5>
                      {generatedResult.result.designGuidelines?.map((g: string, i: number) => (
                        <p key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary">•</span>{g}</p>
                      ))}
                    </div>
                  </div>
                )}
                {generatedResult?.mode === 'sample' && (
                  <div className="space-y-4">
                    <h4 className="font-heading text-sm font-bold text-foreground">Google Image Search Links</h4>
                    <p className="text-xs text-muted-foreground">Click any link below to explore thumbnail inspiration on Google Images</p>
                    {generatedResult.result.samples?.map((s: any, i: number) => {
                      const cleanSearchTerm = s.searchTerm?.replace(/&quot;/g, '"').replace(/&amp;/g, '&') || 'thumbnail';
                      const cleanDescription = s.description?.replace(/&quot;/g, '"').replace(/&amp;/g, '&') || 'Thumbnail inspiration';
                      return (
                        <a 
                          key={i} 
                          href={s.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="card-surface p-4 space-y-2 block hover:border-primary transition-all border border-border rounded-lg"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground mb-1">{cleanSearchTerm}</p>
                              <p className="text-xs text-muted-foreground">{cleanDescription}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-primary">Match: {s.relevance}%</span>
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                    {generatedResult.result.note && (
                      <p className="text-xs text-muted-foreground italic p-3 bg-surface-input rounded">{generatedResult.result.note}</p>
                    )}
                  </div>
                )}
                {generatedResult?.mode === 'professional' && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={`data:image/png;base64,${generatedResult.result.image}`} alt="Generated thumbnail" className="w-full" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">{platforms.find(p => p.name === selectedPlatform)?.size}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownload}
                    className="py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="py-2 px-4 bg-secondary text-foreground rounded-lg text-sm font-medium hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button className="py-2 px-4 bg-secondary text-foreground rounded-lg text-sm font-medium hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Save to Library
                  </button>
                  <button
                    onClick={copyPrompt}
                    className="py-2 px-4 bg-secondary text-foreground rounded-lg text-sm font-medium hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy Prompt
                  </button>
                </div>

                <div className="card-surface p-4 space-y-2">
                  <h4 className="font-heading text-sm font-bold text-foreground">Generation Details</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Model Used:</span>
                      <span className="text-foreground">Amazon Nova Canvas v1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span className="text-foreground">{platforms.find(p => p.name === selectedPlatform)?.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Style:</span>
                      <span className="text-foreground">{style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span className="text-foreground">{selectedPlatform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Generation Time:</span>
                      <span className="text-foreground">~5s</span>
                    </div>
                  </div>
                </div>

                <div className="card-surface p-4">
                  <button
                    onClick={() => setShowPrompt(!showPrompt)}
                    className="w-full flex items-center justify-between text-sm font-bold text-foreground"
                  >
                    <span>Prompt Used</span>
                    {showPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showPrompt && (
                    <div className="mt-3 p-3 bg-surface-input rounded text-xs text-muted-foreground">
                      {mockPrompt}
                    </div>
                  )}
                </div>

                <div className="card-surface p-4">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-3">Previous Generations</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative group cursor-pointer rounded overflow-hidden">
                        <img src={mockGeneratedImage} alt={`Previous ${i}`} className="w-full aspect-video object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Download className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card-surface p-6">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Pro Tips for Better Thumbnails</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="p-4 rounded-lg bg-surface-input border border-border">
              <tip.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-foreground">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
