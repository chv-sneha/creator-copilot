import { useNavigate } from "react-router-dom";
import { Search, Palette, TrendingUp, Shield, DollarSign, Calendar, Zap, Hash } from "lucide-react";
import MetricCard from "@/components/MetricCard";

const quickActions = [
  { label: "Analyze Content", icon: Search, path: "/dashboard/analyzer" },
  { label: "Create Content", icon: Palette, path: "/dashboard/studio" },
  { label: "View Trends", icon: TrendingUp, path: "/dashboard/trends" },
  { label: "Check Safety", icon: Shield, path: "/dashboard/safety" },
  { label: "Monetize", icon: DollarSign, path: "/dashboard/monetization" },
];

const todayPosts = [
  { time: "9:00 AM", platform: "Instagram", topic: "Morning routine for creators" },
  { time: "12:30 PM", platform: "LinkedIn", topic: "5 tools every creator needs" },
  { time: "6:00 PM", platform: "YouTube", topic: "Weekly tech roundup" },
];

const trendingTags = ["#AICreators", "#ContentStrategy", "#TechReview", "#ShortForm", "#CreatorEconomy", "#Viral2025"];

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Content Score Avg" value="82" icon={<Zap className="w-5 h-5" />} trend="↑ 5% this week" />
        <MetricCard label="Posts Planned" value="12" icon={<Calendar className="w-5 h-5" />} trend="This week" />
        <MetricCard label="Trending Topics" value="24" icon={<TrendingUp className="w-5 h-5" />} trend="Found today" />
        <MetricCard label="Monetization Score" value="7.4" icon={<DollarSign className="w-5 h-5" />} trend="↑ 0.3 from last month" />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <a.icon className="w-4 h-4 text-primary" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Plan */}
        <div className="card-surface p-5">
          <h3 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Today's Content Plan
          </h3>
          <div className="space-y-3">
            {todayPosts.map((post, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary">
                <span className="text-xs font-mono text-primary font-bold w-16">{post.time}</span>
                <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">
                  {post.platform}
                </span>
                <span className="text-sm text-foreground truncate">{post.topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Now */}
        <div className="card-surface p-5">
          <h3 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4 text-accent-blue" />
            Trending Now
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium hover:bg-accent-blue/20 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Refreshed by AI • Updated 12 mins ago</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
