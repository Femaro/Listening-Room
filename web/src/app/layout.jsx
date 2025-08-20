"use client";

import { useState, useEffect } from "react";
import { Smartphone } from "lucide-react";

export default function IPhone16ProMaxOptimizer({ children }) {
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIPhone(isIOS);
  }, []);

  if (isIPhone) {
    return (
      <div className="iphone-optimized">
               {" "}
        <style jsx global>{`
          :root {
            /* Use standard iOS safe area variables */
            --safe-area-inset-top: env(safe-area-inset-top);
            --safe-area-inset-bottom: env(safe-area-inset-bottom);
            --safe-area-inset-left: env(safe-area-inset-left);
            --safe-area-inset-right: env(safe-area-inset-right);
          }

          /* Example usage of safe area variables */
          .header-content {
            padding-top: calc(var(--safe-area-inset-top) + 8px);
          }
          .session-dialog {
            bottom: var(--safe-area-inset-bottom);
          }
        `}</style>
               {" "}
        <div className="flex items-center justify-center bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <Smartphone className="w-5 h-5 text-purple-600 mr-2" />     
             {" "}
          <span className="text-sm text-purple-800 font-medium">
                        ✨ iOS Optimized Experience Active          {" "}
          </span>
                 {" "}
        </div>
                {children}     {" "}
      </div>
    );
  }

  return children;
}