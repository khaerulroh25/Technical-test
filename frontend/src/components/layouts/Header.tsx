import { Moon, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:h-20 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu size={24} />
      </button>

      <button
        type="button"
        className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2"
      >
        <Moon size={20} />

        <span className="hidden sm:inline">Dark Mode</span>
      </button>
    </header>
  );
}

export default Header;
