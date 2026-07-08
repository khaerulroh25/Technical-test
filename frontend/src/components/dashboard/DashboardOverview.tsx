import { Banknote, ShoppingCart, Package, Users } from "lucide-react";

import SummaryCard from "./SummaryCard";

const overviewData = [
  {
    title: "Total Pendapatan",
    value: "250M",
    change: 12.5,
    icon: Banknote,
  },
  {
    title: "Total Order",
    value: "50.231",
    change: 8.3,
    icon: ShoppingCart,
  },
  {
    title: "Produk Terjual",
    value: "1.250",
    change: 5.2,
    icon: Package,
  },
  {
    title: "Total Pelanggan",
    value: "4,300",
    change: 10.1,
    icon: Users,
  },
];

function DashboardOverview() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewData.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}

export default DashboardOverview;
