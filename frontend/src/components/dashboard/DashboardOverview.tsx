import { Banknote, ShoppingCart, Package, Users } from "lucide-react";
import { useState, useEffect } from "react";

import SummaryCard from "./SummaryCard";
import {
  getDashboardOverview,
  type DashboardOverviewData,
} from "../../services/dashboardService";
import { type DashboardFilter } from "../../types/dashboard";

interface DashboardOverviewProps {
  datasetId: number | null;
  filters: DashboardFilter;
}
function DashboardOverview({ datasetId, filters }: DashboardOverviewProps) {
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!datasetId) {
      setOverview(null);
      return;
    }

    const fetchOverview = async () => {
      try {
        setIsLoading(true);

        const data = await getDashboardOverview(datasetId, filters);

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
  }, [datasetId, filters]);

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
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
        Dashboard Overview
      </h2>

      {isLoading && (
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Memuat overview...
        </p>
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
