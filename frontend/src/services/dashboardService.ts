export interface DashboardOverviewData {
  total_revenue: number;
  total_orders: number;
  products_sold: number;
  total_customers: number;
}

interface DashboardOverviewResponse {
  message: string;
  data: DashboardOverviewData;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getDashboardOverview(
  datasetId: number,
): Promise<DashboardOverviewData> {
  const response = await fetch(
    `${API_URL}/datasets/${datasetId}/dashboard/overview`,
  );

  const result: DashboardOverviewResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal mengambil dashboard overview.");
  }

  return result.data;
}
