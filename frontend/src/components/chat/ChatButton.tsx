import { MessageCircleMore, X } from "lucide-react";
import { useState } from "react";
import ChatWindow from "./ChatWindow";

function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-orange-600"
        aria-label={isOpen ? "Tutup chat" : "Buka chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircleMore size={25} />}
      </button>
    </>
  );
}

export default ChatButton;
