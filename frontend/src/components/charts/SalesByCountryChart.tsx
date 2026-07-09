import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { type DashboardFilter } from "../../types/dashboard";
import {
  getSalesByCountry,
  type SalesByCountryData,
} from "../../services/dashboardService";

interface SalesByCountryChartProps {
  datasetId: number | null;
  filters: DashboardFilter;
}

interface SalesByCountryChartData extends SalesByCountryData {
  fill: string;
}

const CHART_COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"];

const formatNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("id-ID")} jt`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString("id-ID")} rb`;
  }

  return value.toLocaleString("id-ID");
};

function SalesByCountryChart({ datasetId, filters }: SalesByCountryChartProps) {
  const [salesByCountryData, setSalesByCountryData] = useState<
    SalesByCountryChartData[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!datasetId) {
      setSalesByCountryData([]);
      return;
    }

    const fetchSalesByCountry = async () => {
      try {
        setIsLoading(true);

        const data = await getSalesByCountry(datasetId, filters);

        const dataWithColors = data.map((item, index) => ({
          ...item,
          fill: CHART_COLORS[index % CHART_COLORS.length],
        }));

        setSalesByCountryData(dataWithColors);
      } catch (error) {
        console.error(error);
        setSalesByCountryData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesByCountry();
  }, [datasetId, filters]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Penjualan Berdasarkan Negara
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribusi Pendapatan di Negara - negara teratas
        </p>
      </div>

      {isLoading && (
        <p className="mb-4 text-sm text-gray-500">
          Memuat penjualan berdasarkan negara...
        </p>
      )}

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={salesByCountryData}
              dataKey="revenue"
              nameKey="country"
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
            ></Pie>

            <Tooltip
              formatter={(value) => [formatNumber(Number(value)), "Pendapatan"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SalesByCountryChart;
