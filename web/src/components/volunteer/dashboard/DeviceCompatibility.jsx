import { Smartphone, Tablet, Monitor, Signal } from "lucide-react";

export default function DeviceCompatibility() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-blue-600 mb-3">
              <div className="flex flex-col items-center">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
                <span className="text-xs sm:text-sm font-medium">
                  iPhone 16 Pro Max
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Tablet className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
                <span className="text-xs sm:text-sm font-medium">iPad</span>
              </div>
              <div className="flex flex-col items-center">
                <Monitor className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Desktop</span>
              </div>
              <div className="flex flex-col items-center">
                <Signal className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Global</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-blue-600 font-medium">
              ✅ iPhone 16 Pro Max Optimized • Works worldwide • US accessible
            </p>
        </div>
    )
}
