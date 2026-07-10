import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import { type DashboardFilter } from "../../types/dashboard";
import {
  getSalesTrend,
  type SalesTrendData,
} from "../../services/dashboardService";

interface SalesTrendChartProps {
  datasetId: number | null;
  filters: DashboardFilter;
}

const formatNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("id-ID")} jt`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString("id-ID")} rb`;
  }

  return value.toLocaleString("id-ID");
};

function SalesTrendChart({ datasetId, filters }: SalesTrendChartProps) {
  const [salesTrendData, setSalesTrendData] = useState<SalesTrendData[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!datasetId) {
      setSalesTrendData([]);
      return;
    }

    const fetchSalesTrend = async () => {
      try {
        setIsLoading(true);

        const data = await getSalesTrend(datasetId, filters);

        setSalesTrendData(data);
      } catch (error) {
        console.error(error);
        setSalesTrendData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesTrend();
  }, [datasetId, filters]);

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tren Penjualan
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kinerja pendapatan bulanan
        </p>
      </div>

      {isLoading ? (
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Memuat tren penjualan...
        </p>
      ) : salesTrendData.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Data tidak ditemukan untuk filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesTrendData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />

              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: isDark ? "#9ca3af" : "#6b7280",
                  fontSize: 12,
                }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: isDark ? "#9ca3af" : "#6b7280",
                  fontSize: 12,
                }}
                tickFormatter={(value) => formatNumber(Number(value))}
                width={65}
              />

              <Tooltip
                formatter={(value) => [
                  formatNumber(Number(value)),
                  "Pendapatan",
                ]}
                labelFormatter={(label) => `Periode: ${label}`}
                contentStyle={{
                  borderRadius: "12px",
                  border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                  backgroundColor: isDark ? "#111827" : "#ffffff",
                  color: isDark ? "#f9fafb" : "#111827",
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#f97316",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 6,
                  fill: "#f97316",
                  stroke: isDark ? "#111827" : "#ffffff",
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default SalesTrendChart;
