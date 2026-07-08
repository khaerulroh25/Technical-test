import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const topProductData = [
  {
    product: "WHITE HANGING HEART T-LIGHT HOLDER",
    quantity: 35317,
  },
  {
    product: "JUMBO BAG RED RETROSPOT",
    quantity: 18744,
  },
  {
    product: "REGENCY CAKESTAND 3 TIER",
    quantity: 13033,
  },
  {
    product: "PARTY BUNTING",
    quantity: 11315,
  },
  {
    product: "LUNCH BAG RED RETROSPOT",
    quantity: 10129,
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function TopProductChart() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Produk Terlaris</h2>

        <p className="mt-1 text-sm text-gray-500">
          Produk dengan penjualan tertinggi berdasarkan jumllah terjual
        </p>
      </div>

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
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="product"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
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
                fill: "#6b7280",
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
                border: "1px solid #e5e7eb",
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
    </section>
  );
}

export default TopProductChart;
