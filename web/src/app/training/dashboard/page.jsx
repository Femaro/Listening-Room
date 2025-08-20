"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Play, 
  Award, 
  BarChart3,
  AlertCircle,
  ArrowRight,
  Trophy,
  Star,
  Users,
  Lock
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function TrainingDashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [startingModule, setStartingModule] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTrainingData();
    }
  }, [user]);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/training/modules");
      
      if (!response.ok) {
        throw new Error("Failed to fetch training data");
      }

      const data = await response.json();
      setModules(data.modules || []);
      setProgress(data.progress || {});
    } catch (err) {
      console.error("Error fetching training data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (moduleId) => {
    setStartingModule(moduleId);
    try {
      const response = await fetch("/api/training/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId,
          action: "start"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start module");
      }

      const data = await response.json();
      setSelectedModule(data.moduleData);
      
      // Refresh training data
      fetchTrainingData();
    } catch (err) {
      console.error("Error starting module:", err);
      setError(err.message);
    } finally {
      setStartingModule(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'failed':
        return 'Failed';
      default:
        return 'Not Started';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isModuleUnlocked = (module, index) => {
    if (index === 0) return true; // First module is always unlocked
    
    const previousModule = modules[index - 1];
    return previousModule && previousModule.status === 'completed';
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access training</p>
          <a
            href="/account/signin"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Training Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchTrainingData}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Module Content Viewer */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{selectedModule.title}</h1>
                <p className="text-gray-600">{selectedModule.description}</p>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Video Section */}
          {selectedModule.video_url && (
            <div className="mb-8">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={selectedModule.video_url}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="prose max-w-none">
              {selectedModule.content && (
                <div dangerouslySetInnerHTML={{ __html: selectedModule.content }} />
              )}
            </div>
          </div>

          {/* Quiz Section */}
          {selectedModule.quiz_data && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Check</h3>
              <p className="text-gray-600 mb-6">
                Complete this quiz to finish the module. You need {selectedModule.quiz_data.passingScore || 80}% to pass.
              </p>
              
              {/* Quiz implementation would go here */}
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Quiz functionality coming soon...</p>
                <button
                  onClick={() => {
                    // For now, just mark as completed
                    fetch("/api/training/modules", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        moduleId: selectedModule.id,
                        action: "complete"
                      })
                    }).then(() => {
                      setSelectedModule(null);
                      fetchTrainingData();
                    });
                  }}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
                >
                  Mark as Complete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
                alt="ListeningRoom"
                className="h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Volunteer Training</h1>
                <p className="text-gray-600">Complete your training to start helping others</p>
              </div>
            </div>
            <a
              href="/volunteer/dashboard"
              className="text-gray-600 hover:text-teal-600 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                <p className="text-2xl font-bold text-teal-600">
                  {progress?.completionPercentage || 0}%
                </p>
                <p className="text-sm text-gray-600">
                  {progress?.completedModules || 0} of {progress?.totalModules || 0} modules
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Required Training</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {progress?.requiredCompletionPercentage || 0}%
                </p>
                <p className="text-sm text-gray-600">
                  {progress?.completedRequiredModules || 0} of {progress?.requiredModules || 0} required
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Certification</h3>
                <p className="text-lg font-bold text-green-600">
                  {progress?.isFullyTrained ? "Certified" : "In Progress"}
                </p>
                <p className="text-sm text-gray-600">
                  {progress?.isFullyTrained ? "Ready to volunteer!" : "Complete required modules"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certification Status */}
        {progress?.isFullyTrained && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-green-600 mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">🎉 Congratulations!</h3>
                <p className="text-green-700">
                  You've completed all required training modules and are now certified to volunteer. 
                  You can start creating sessions and helping others!
                </p>
              </div>
              <a
                href="/volunteer/dashboard"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Volunteering
              </a>
            </div>
          </div>
        )}

        {/* Training Modules */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Training Modules</h2>
            <p className="text-gray-600">Complete these modules to become a certified volunteer</p>
          </div>

          <div className="divide-y divide-gray-200">
            {modules.map((module, index) => {
              const isUnlocked = isModuleUnlocked(module, index);
              const isStarting = startingModule === module.id;
              
              return (
                <div key={module.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {!isUnlocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : (
                          getStatusIcon(module.status)
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            Module {index + 1}: {module.title}
                          </h3>
                          {module.is_required && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                              Required
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(module.status)}`}>
                            {getStatusText(module.status)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{module.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {module.duration_minutes} minutes
                          </div>
                          {module.score && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              Score: {module.score}%
                            </div>
                          )}
                          {module.attempts > 0 && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {module.attempts} attempt{module.attempts !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      {!isUnlocked ? (
                        <div className="text-sm text-gray-500">
                          Complete previous module to unlock
                        </div>
                      ) : module.status === 'completed' ? (
                        <button
                          onClick={() => startModule(module.id)}
                          disabled={isStarting}
                          className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Review
                        </button>
                      ) : (
                        <button
                          onClick={() => startModule(module.id)}
                          disabled={isStarting}
                          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isStarting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Starting...
                            </>
                          ) : module.status === 'in_progress' ? (
                            <>
                              Continue
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Module
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            If you have questions about the training modules or need assistance, 
            please don't hesitate to reach out to our support team.
          </p>
          <a
            href="/contact"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}