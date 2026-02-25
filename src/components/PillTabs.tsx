interface PillTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

const PillTabs = ({ tabs, active, onChange }: PillTabsProps) => (
  <div className="inline-flex bg-secondary rounded-full p-1 gap-1">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`pill-toggle ${active === tab ? "pill-toggle-active" : "pill-toggle-inactive"}`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default PillTabs;
