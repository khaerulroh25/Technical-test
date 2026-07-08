import UploadDataset from "../components/dashboard/UploadDataset";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import DashboardFilter from "../components/dashboard/DashboardFilter";
import SalesTrendChart from "../components/charts/SalesTrendChart";
import SalesByCountryChart from "../components/charts/SalesByCountryChart";
import TopProductsChart from "../components/charts/TopProductsChart";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's your data overview.
        </p>
      </div>

      <UploadDataset />

      <DashboardOverview />

      <DashboardFilter />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesTrendChart />
        <SalesByCountryChart />
      </div>

      <TopProductsChart />
    </div>
  );
}

export default DashboardPage;
