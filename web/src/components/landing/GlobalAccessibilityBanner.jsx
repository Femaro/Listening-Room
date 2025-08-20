import { Globe } from "lucide-react";

export default function GlobalAccessibilityBanner() {
  return (
    <div className="bg-blue-600 text-white py-2 px-4 text-center">
      <div className="flex items-center justify-center space-x-2 text-sm">
        <Globe className="w-4 h-4" />
        <span>
          🌍 Available worldwide • 40+ countries supported • 24/7 global
          coverage
        </span>
      </div>
    </div>
  );
}
