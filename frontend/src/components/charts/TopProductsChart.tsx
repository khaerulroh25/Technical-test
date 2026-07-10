import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useState, useEffect } from "react";
import type { DashboardFilter } from "../../types/dashboard";
import {
  getTopProducts,
  type TopProductData,
} from "../../services/dashboardService";

interface TopProductChartProps {
  datasetId: number | null;
  filters: DashboardFilter;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function TopProductChart({ datasetId, filters }: TopProductChartProps) {
  const [topProductData, setTopProductData] = useState<TopProductData[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!datasetId) {
      setTopProductData([]);
      return;
    }

    const fetchTopProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getTopProducts(datasetId, filters);

        setTopProductData(data);
      } catch (error) {
        console.error(error);
        setTopProductData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProducts();
  }, [datasetId, filters]);

  const isDark = document.documentElement.classList.contains("dark");
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Produk Terlaris
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Produk dengan penjualan tertinggi berdasarkan jumllah terjual
        </p>
      </div>

      {isLoading ? (
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Memuat produk terlaris...
        </p>
      ) : topProductData.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Data tidak ditemukan untuk filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProductData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                horizontal={false}
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="product"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: isDark ? "#9ca3af" : "#6b7280",
                  fontSize: 12,
                }}
                angle={-25}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: isDark ? "#9ca3af" : "#6b7280",
                  fontSize: 12,
                }}
                tickFormatter={(value) => formatNumber(Number(value))}
              />
              <Tooltip
                formatter={(value) => [
                  Number(value).toLocaleString("en-GB"),
                  "Quantity Sold",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                  backgroundColor: isDark ? "#111827" : "#ffffff",
                  color: isDark ? "#f9fafb" : "#111827",
                }}
              />
              <Bar
                dataKey="quantity"
                fill="#f97316"
                radius={[0, 8, 8, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default TopProductChart;
