export type DatasetStatus = "pending" | "processing" | "completed" | "failed";

export interface Dataset {
  id: number;
  name: string;
  original_filename: string;
  total_rows: number;
  status: DatasetStatus;
  error_message: string | null;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadDataset(file: File): Promise<Dataset> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/datasets/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal mengupload dataset.");
  }

  return result.data;
}

export async function getDatasetStatus(datasetId: number): Promise<Dataset> {
  const response = await fetch(`${API_URL}/datasets/${datasetId}/status`);

  const result: ApiResponse<Dataset> = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal mengambil status dataset.");
  }

  return result.data;
}
