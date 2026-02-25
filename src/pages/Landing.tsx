import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BarChart3, Palette, Shield } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Content Analyzer",
      desc: "Get instant AI-powered scores on engagement, clarity, and hook strength for any post.",
    },
    {
      icon: Palette,
      title: "Content Studio",
      desc: "Generate platform-native content, hooks, and thumbnails from a single idea.",
    },
    {
      icon: Shield,
      title: "Safety & Copyright",
      desc: "Scan content for copyright risks and get proof of originality instantly.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Floating orbs */}
      <div className="orb orb-green w-72 h-72 top-[10%] left-[15%]" style={{ animationDelay: "0s" }} />
      <div className="orb orb-blue w-96 h-96 bottom-[10%] right-[10%]" style={{ animationDelay: "2s" }} />
      <div className="orb orb-green w-48 h-48 top-[60%] left-[60%]" style={{ animationDelay: "4s", opacity: 0.15 }} />

      {/* Hero */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
          <span className="font-heading text-2xl font-extrabold text-foreground">Creator Copilot</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-foreground mb-4 leading-tight">
          Your AI-powered<br />content team
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Plan, analyze, create, and monetize your content — all from one intelligent dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/auth?tab=signup")}
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-base hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-primary/20"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate("/auth?tab=signin")}
            className="px-8 py-3 rounded-lg bg-secondary text-foreground font-medium text-base border border-border hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full">
        {features.map((f) => (
          <div key={f.title} className="card-surface p-6 hover:-translate-y-1 transition-transform duration-200">
            <f.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
