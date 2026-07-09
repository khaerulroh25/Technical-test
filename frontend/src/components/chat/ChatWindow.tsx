import { Bot, Send, X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import ChatMessage from "./ChatMessage";
import { sendChatMessage } from "../../services/chatService";

interface ChatWindowProps {
  onClose: () => void;
}

interface Message {
  id: number;
  role: "user" | "bot";
  message: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    message:
      "Halo! Saya bisa membantu menjawab pertanyaan tentang dataset Anda.",
  },
];

function ChatWindow({ onClose }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) return;

    const datasetId = localStorage.getItem("activeDatasetId");

    if (!datasetId) {
      const botMessage: Message = {
        id: Date.now(),
        role: "bot",
        message: "Silakan upload dataset terlebih dahulu.",
      };

      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      message: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setIsLoading(true);

      const data = await sendChatMessage(Number(datasetId), message);

      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        message: data.answer,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memproses pertanyaan.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
    fixed
    inset-x-4 bottom-20
    z-50
    flex h-[70vh] flex-col
    overflow-hidden rounded-2xl
    border border-gray-200 bg-white shadow-2xl

    sm:inset-x-auto
    sm:bottom-24 sm:right-6
    sm:h-120 sm:w-95
  "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <Bot size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Tanya Data</h3>

            <p className="text-xs text-gray-500">
              Tanya apa saja tentang dataset
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((item) => (
          <ChatMessage key={item.id} role={item.role} message={item.message} />
        ))}

        {isLoading && (
          <ChatMessage role="bot" message="Sedang menganalisis data..." />
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
            placeholder={
              isLoading ? "Sedang menganalisis..." : "Tanya tentang data..."
            }
            className="h-11 flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            <Send size={19} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
