import { Banknote, ShoppingCart, Package, Users } from "lucide-react";
import { useState, useEffect } from "react";

import SummaryCard from "./SummaryCard";
import {
  getDashboardOverview,
  type DashboardOverviewData,
} from "../../services/dashboardService";

interface DashboardOverviewProps {
  datasetId: number | null;
}
function DashboardOverview({ datasetId }: DashboardOverviewProps) {
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const datasetId = localStorage.getItem("activeDatasetId");

    if (!datasetId) {
      setOverview(null);
      return;
    }

    const fetchOverview = async () => {
      try {
        setIsLoading(true);

        const data = await getDashboardOverview(Number(datasetId));

        setOverview(data);
      } catch (error) {
        console.error(error);

        setOverview(null);
        localStorage.removeItem("activeDatasetId");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, [datasetId]);

  const overviewData = [
    {
      title: "Total Pendapatan",
      value: overview ? overview.total_revenue.toLocaleString("id-ID") : "0",
      change: 0,
      icon: Banknote,
    },
    {
      title: "Total Order",
      value: overview ? overview.total_orders.toLocaleString("id-ID") : "0",
      change: 0,
      icon: ShoppingCart,
    },
    {
      title: "Produk Terjual",
      value: overview ? overview.products_sold.toLocaleString("id-ID") : "0",
      change: 0,
      icon: Package,
    },
    {
      title: "Total Pelanggan",
      value: overview ? overview.total_customers.toLocaleString("id-ID") : "0",
      change: 0,
      icon: Users,
    },
  ];
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        Dashboard Overview
      </h2>

      {isLoading && (
        <p className="mb-4 text-sm text-gray-500">Memuat overview...</p>
      )}

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
