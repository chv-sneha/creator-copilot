interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const MetricCard = ({ label, value, icon, trend }: MetricCardProps) => (
  <div className="card-surface p-5 flex items-start justify-between hover:-translate-y-0.5 transition-transform duration-200">
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-heading text-2xl font-extrabold text-primary">{value}</p>
      {trend && <p className="text-xs text-accent-blue mt-1">{trend}</p>}
    </div>
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
      {icon}
    </div>
  </div>
);

export default MetricCard;
