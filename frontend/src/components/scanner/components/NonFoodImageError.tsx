import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Camera, Upload, MessageSquare } from "lucide-react";
import { FeedbackDialog } from "./FeedbackDialog";

interface NonFoodErrorData {
  imageUrl: string;
  rejectionReason: string;
  detectedContent: string;
}

export function NonFoodImageError() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);

  // Parse error data from location state
  const errorData: NonFoodErrorData = location.state?.errorData || null;

  // Redirect to scan-history if accessed manually (no error data)
  useEffect(() => {
    if (!errorData) {
      navigate("/scan-history", { replace: true });
    }
  }, [errorData, navigate]);

  // Don't render anything while redirecting
  if (!errorData) {
    return null;
  }

  const foodExamples = [
    {
      title: "Food Labels",
      description: "Nutrition labels on packaged foods",
      icon: "🏷️",
    },
    {
      title: "Fresh Produce",
      description: "Fruits, vegetables, and fresh items",
      icon: "🍎",
    },
    {
      title: "Beverages",
      description: "Drinks, juices, and beverage labels",
      icon: "🥤",
    },
    {
      title: "Packaged Foods",
      description: "Snacks, cereals, and processed foods",
      icon: "📦",
    },
    {
      title: "Restaurant Items",
      description: "Menu items and prepared foods",
      icon: "🍽️",
    },
    {
      title: "Supplements",
      description: "Nutritional and dietary supplements",
      icon: "💊",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto ">
        {/* ── TOP SECTION : 2-Cards-Side-by-Side ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT – Rejected image */}
          {errorData.imageUrl && (
            <Card className="p-0 overflow-hidden">
              <img
                src={errorData.imageUrl}
                alt="Rejected"
                className="h-[50vh] w-full object-cover"
              />
            </Card>
          )}

          {/* RIGHT – Warning information */}
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl text-orange-800 dark:text-orange-200">
                Non-Food Image Detected
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4 ">
              <p className="text-orange-700 dark:text-orange-300">
                {errorData.rejectionReason}
              </p>
              <p className="pt-8 text-lg text-orange-600 dark:text-orange-400">
                Detected: {errorData.detectedContent}
                <p className="text-xs">Reason: {errorData.rejectionReason}</p>
              </p>

              <p className="text-lg text-orange-600 dark:text-orange-400"></p>
            </CardContent>
          </Card>
        </div>

        {/* What We Can Scan */}
        <Card className="my-5">
          <CardHeader>
            <CardTitle className="text-lg">What We Can Scan</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Our food scanner works best with these types of images:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foodExamples.map((example, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <span className="text-2xl">{example.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {example.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {example.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips for Better Scanning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Ensure good lighting and clear focus</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Capture the entire nutrition label or product</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Avoid shadows or glare on the label</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>
                  Hold the camera steady and close enough to read text
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <Button
            onClick={() => navigate("/scanner")}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowFeedback(true)}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Report Issue</span>
          </Button>
        </div>

        {/* Feedback Dialog */}
        <FeedbackDialog
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          imageUrl={errorData.imageUrl}
          detectedContent={errorData.detectedContent}
        />
      </div>
    </div>
  );
}
