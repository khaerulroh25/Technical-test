import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const salesByCountryData = [
  {
    country: "United Kingdom",
    revenue: 7200000,
    fill: "#f97316",
  },
  {
    country: "Netherlands",
    revenue: 285000,
    fill: "#fb923c",
  },
  {
    country: "Ireland",
    revenue: 265000,
    fill: "#fdba74",
  },
  {
    country: "Germany",
    revenue: 220000,
    fill: "#fed7aa",
  },
  {
    country: "France",
    revenue: 195000,
    fill: "#ffedd5",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    notation: "compact",
  }).format(value);
}

function SalesByCountryChart() {
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
              formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
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
