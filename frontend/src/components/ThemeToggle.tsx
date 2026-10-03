import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);

    // Determine initial theme based on system preference if theme is 'system'
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setCurrentTheme(isDark ? "dark" : "light");
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  if (!mounted) return null; // Prevent mismatch between server/client rendering

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-200 ease-in-out hover:scale-105"
    >
      {/* Sun Image */}
      <img
        src="/sun.png"
        alt="Sun"
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-200 ease-in-out ${
          currentTheme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />

      {/* Moon Image */}
      <img
        src="/moon.png"
        alt="Moon"
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-200 ease-in-out ${
          currentTheme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
