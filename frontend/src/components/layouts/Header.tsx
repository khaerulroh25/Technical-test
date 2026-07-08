import { Moon } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-end border-b border-gray-200 bg-white px-8">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        <Moon size={20} />
        <span>Dark Mode</span>
      </button>
    </header>
  );
}

export default Header;
