import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesTrendData = [
  {
    month: "Jan",
    revenue: 520000,
  },
  {
    month: "Feb",
    revenue: 610000,
  },
  {
    month: "Mar",
    revenue: 580000,
  },
  {
    month: "Apr",
    revenue: 720000,
  },
  {
    month: "May",
    revenue: 680000,
  },
  {
    month: "Jun",
    revenue: 850000,
  },
  {
    month: "Jul",
    revenue: 790000,
  },
  {
    month: "Aug",
    revenue: 920000,
  },
  {
    month: "Sep",
    revenue: 880000,
  },
  {
    month: "Oct",
    revenue: 1050000,
  },
  {
    month: "Nov",
    revenue: 1180000,
  },
  {
    month: "Dec",
    revenue: 1250000,
  },
];

const formatNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("id-ID")} jt`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString("id-ID")} rb`;
  }

  return value.toLocaleString("id-ID");
};

function SalesTrendChart() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Tren Penjualan</h2>

        <p className="mt-1 text-sm text-gray-500">Kinerja pendapatan bulanan</p>
      </div>

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
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              tickFormatter={(value) => formatNumber(Number(value))}
              width={65}
            />

            <Tooltip
              formatter={(value) => [formatNumber(Number(value)), "Pendapatan"]}
              labelFormatter={(label) => `Bulan: ${label}`}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
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
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SalesTrendChart;
