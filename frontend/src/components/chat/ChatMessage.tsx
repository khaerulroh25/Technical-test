interface ChatMessageProps {
  role: "user" | "bot";
  message: string;
}

function ChatMessage({ role, message }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "rounded-br-md bg-orange-500 text-white"
            : "rounded-bl-md bg-gray-100 text-gray-700"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

export default ChatMessage;
