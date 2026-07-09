import UploadDataset from "../components/dashboard/UploadDataset";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import DashboardFilter from "../components/dashboard/DashboardFilter";
import SalesTrendChart from "../components/charts/SalesTrendChart";
import SalesByCountryChart from "../components/charts/SalesByCountryChart";
import TopProductsChart from "../components/charts/TopProductsChart";
import { type DashboardFilter as DashboardFilterType } from "../types/dashboard";
import { useState } from "react";

function DashboardPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<number | null>(() => {
    const savedId = localStorage.getItem("activeDatasetId");

    return savedId ? Number(savedId) : null;
  });
  const [filters, setFilters] = useState<DashboardFilterType>({});

  const handleDatasetCompleted = (datasetId: number) => {
    localStorage.setItem("activeDatasetId", datasetId.toString());

    setActiveDatasetId(datasetId);
  };

  const handleApplyFilter = (filter: DashboardFilterType) => {
    setFilters(filter);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's your data overview.
        </p>
      </div>

      <UploadDataset onUploadCompleted={handleDatasetCompleted} />

      <DashboardOverview datasetId={activeDatasetId} filters={filters} />

      <DashboardFilter
        datasetId={activeDatasetId}
        onApply={handleApplyFilter}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesTrendChart />
        <SalesByCountryChart />
      </div>

      <TopProductsChart />
    </div>
  );
}

export default DashboardPage;
