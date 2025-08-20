import {
  Users,
  UserCheck,
  Calendar,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const tabs = [
  { id: "overview", name: "Overview", icon: BarChart3 },
  { id: "users", name: "User Management", icon: Users },
  { id: "volunteers", name: "Volunteers", icon: UserCheck },
  { id: "sessions", name: "Sessions", icon: Calendar },
  { id: "training", name: "Training", icon: BookOpen },
  { id: "feedback", name: "Reviews & Feedback", icon: MessageSquare },
  { id: "payments", name: "Payments", icon: CreditCard },
  { id: "analytics", name: "Analytics", icon: TrendingUp },
  { id: "settings", name: "Settings", icon: Settings },
];

export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 flex-shrink-0">
      <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-teal-100 text-teal-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
