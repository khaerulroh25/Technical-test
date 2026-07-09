import type { DashboardFilter } from "../types/dashboard";
export interface DashboardOverviewData {
  total_revenue: number;
  total_orders: number;
  products_sold: number;
  total_customers: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getDashboardOverview(
  datasetId: number,
  filters: DashboardFilter,
): Promise<DashboardOverviewData> {
  const params = new URLSearchParams();

  if (filters.date_from) {
    params.append("date_from", filters.date_from);
  }

  if (filters.date_to) {
    params.append("date_to", filters.date_to);
  }

  if (filters.country) {
    params.append("country", filters.country);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_URL}/datasets/${datasetId}/dashboard/overview?${queryString}`
    : `${API_URL}/datasets/${datasetId}/dashboard/overview`;

  const response = await fetch(url);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal mengambil dashboard overview.");
  }

  return result.data;
}

export interface FilterOptionsResponse {
  countries: string[];
}

export async function getFilterOptions(
  datasetId: number,
): Promise<FilterOptionsResponse> {
  const response = await fetch(
    `${API_URL}/datasets/${datasetId}/dashboard/filter-options`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
}
