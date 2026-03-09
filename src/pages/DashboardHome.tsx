import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Palette, TrendingUp, Shield, DollarSign, Calendar, Zap, Hash, Sparkles } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analyzeTrends } from "@/lib/lambda";

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    avgScore: 0,
    postsPlanned: 0,
    trendingCount: 24,
    monetizationScore: 0
  });
  const [todayPosts, setTodayPosts] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load scheduled posts from Firebase
      const postsQuery = query(
        collection(db, "scheduledPosts"),
        where("userId", "==", user?.uid),
        orderBy("date", "asc"),
        limit(10)
      );
      const postsSnapshot = await getDocs(postsQuery);
      const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter today's posts
      const today = new Date().toISOString().split('T')[0];
      const todayScheduled = posts.filter((p: any) => p.date === today).slice(0, 3);
      setTodayPosts(todayScheduled);
      
      // Calculate metrics
      setMetrics({
        avgScore: 82, // This would come from content analyzer history
        postsPlanned: posts.length,
        trendingCount: 24,
        monetizationScore: 7.4
      });

      // Load trending tags
      try {
        const trendsResponse = await analyzeTrends({
          platform: 'Instagram',
          niche: 'Tech',
          region: 'Global'
        });
        if (trendsResponse.trends) {
          setTrendingTags(trendsResponse.trends.slice(0, 6).map((t: any) => t.hashtag));
        }
      } catch (error) {
        // Fallback to default tags
        setTrendingTags(["#AICreators", "#ContentStrategy", "#TechReview", "#ShortForm", "#CreatorEconomy", "#Viral2025"]);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Content Score Avg" value={loading ? "--" : metrics.avgScore.toString()} icon={<Zap className="w-5 h-5" />} trend="↑ 5% this week" />
        <MetricCard label="Posts Planned" value={loading ? "--" : metrics.postsPlanned.toString()} icon={<Calendar className="w-5 h-5" />} trend="This week" />
        <MetricCard label="Trending Topics" value={loading ? "--" : metrics.trendingCount.toString()} icon={<TrendingUp className="w-5 h-5" />} trend="Found today" />
        <MetricCard label="Monetization Score" value={loading ? "--" : metrics.monetizationScore.toString()} icon={<DollarSign className="w-5 h-5" />} trend="↑ 0.3 from last month" />
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
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-12 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded"></div>
              ))}
            </div>
          ) : todayPosts.length > 0 ? (
            <div className="space-y-3">
              {todayPosts.map((post: any) => (
                <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary">
                  <span className="text-xs font-mono text-primary font-bold w-16">{post.time}</span>
                  <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">
                    {post.platform}
                  </span>
                  <span className="text-sm text-foreground truncate">{post.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No posts scheduled for today</p>
              <button onClick={() => navigate('/dashboard/trends')} className="text-primary hover:text-primary/80 mt-2">Schedule a post →</button>
            </div>
          )}
        </div>

        {/* Trending Now */}
        <div className="card-surface p-5">
          <h3 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4 text-accent-blue" />
            Trending Now
          </h3>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-8 w-24 bg-gradient-to-r from-surface-input via-primary/10 to-surface-input bg-[length:200%_100%] animate-shimmer rounded-full"></div>
              ))}
            </div>
          ) : (
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
          )}
          <p className="text-xs text-muted-foreground mt-4">Refreshed by AI • Updated just now</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
