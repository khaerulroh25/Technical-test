import { Moon, Sun, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:h-20 lg:px-8 dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
      >
        <Menu size={24} />
      </button>

      <button
        type="button"
        onClick={() => setIsDark((prev) => !prev)}
        className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}

        <span className="hidden sm:inline">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      </button>
    </header>
  );
}

export default Header;
