interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const ScoreRing = ({ score, size = 120, strokeWidth = 8 }: ScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = score >= 75 ? "text-primary" : score >= 50 ? "text-yellow-400" : "text-destructive";
  const strokeColor = score >= 75 ? "hsl(84 100% 65%)" : score >= 50 ? "hsl(45 100% 65%)" : "hsl(0 100% 70%)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="score-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(240 20% 14%)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-heading text-2xl font-extrabold ${colorClass}`}>{score}</span>
      </div>
    </div>
  );
};

export default ScoreRing;
