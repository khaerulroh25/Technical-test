import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
}

function SummaryCard({ title, value, change, icon: Icon }: SummaryCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <Icon size={24} />
        </div>

        {/* Content */}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
