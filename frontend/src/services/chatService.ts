export interface ChatResponse {
  question: string;
  answer: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function sendChatMessage(
  datasetId: number,
  message: string,
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/datasets/${datasetId}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal mengirim pertanyaan.");
  }

  return result.data;
}
