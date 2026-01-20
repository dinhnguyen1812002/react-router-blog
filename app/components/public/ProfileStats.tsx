interface StatItemProps {
  value: string | number;
  label: string;
}

const StatItem = ({ value, label }: StatItemProps) => (
  <div className="text-center px-4 md:px-6">
    <div className="font-display text-2xl md:text-3xl font-semibold text-foreground">
      {value}
    </div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

interface ProfileStatsProps {
  articles: number;
  followers: number;
  following: number;
}

export const ProfileStats = ({ articles, followers, following }: ProfileStatsProps) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex items-center justify-center divide-x divide-border py-6">
      <StatItem value={formatNumber(articles)} label="Bài viết" />
      <StatItem value={formatNumber(followers)} label="Người theo dõi" />
      <StatItem value={formatNumber(following)} label="Đang theo dõi" />
    </div>
  );
};
