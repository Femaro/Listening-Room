import {
  BookOpen,
  MessageSquare,
  TrendingUp,
  Settings
} from "lucide-react";

const tabInfo = {
  training: {
    icon: BookOpen,
    title: "Training Management",
    message: "Training module management coming soon",
  },
  feedback: {
    icon: MessageSquare,
    title: "Reviews & Feedback",
    message: "Feedback management coming soon",
  },
  analytics: {
    icon: TrendingUp,
    title: "Analytics",
    message: "Advanced analytics coming soon",
  },
  settings: {
    icon: Settings,
    title: "Platform Settings",
    message: "System settings coming soon",
  },
};

export default function PlaceholderTab({ tabId }) {
  const { icon: Icon, title, message } = tabInfo[tabId] || {};

  if (!Icon) return null;

  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
