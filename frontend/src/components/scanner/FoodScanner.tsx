import { useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useFoodAnalyzer } from "@/hooks/useFoodAnalyzer";
import { Card, CardContent } from "@/components/ui/card";
import { CameraCapture } from "./CameraCapture";
import { FoodImageDisplay } from "./FoodImageDisplay";
import { FoodAnalysisPrompt } from "./FoodAnalysisPrompt";
import { ScannerActions } from "./ScannerActions";
import { ScannerInstructions } from "./ScannerInstructions";
import { supabase } from "@/integrations/supabase/client";

export function FoodScanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { analyzeFoodImage } = useFoodAnalyzer();

  // Function to check daily scan limit
  const checkDailyLimit = async (): Promise<boolean> => {
    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User not authenticated:", authError);
        return false; // Allow action if user auth fails
      }

      // Fetch daily_scan_count from profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("daily_scan_count")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching daily scan count:", error);
        return false; // Allow action if database query fails
      }

      // Check if daily scan count exceeds 20
      return (data?.daily_scan_count || 0) >= 20;
    } catch (error) {
      console.error("Unexpected error checking daily limit:", error);
      return false; // Allow action if unexpected error occurs
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setSelectedFile(file);
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCameraActivation = () => {
    setCameraActive(true);
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const handleImageCapture = (imageDataURL: string) => {
    setSelectedImage(imageDataURL);
    setCameraActive(false);

    fetch(imageDataURL)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });
        setSelectedFile(file);
      });
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      toast.error("Please select or capture an image first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const scanData = await analyzeFoodImage(selectedFile);
      toast.success("Food label successfully analyzed");

      // Clear the current image after successful analysis
      clearImage();

      // Navigate to the scan result
      navigate(`/scan/${scanData.id}`);
    } catch (error) {
      console.error("Error analyzing image:", error);

      // Check if this is a non-food image error
      if (error instanceof Error && error.message === "NON_FOOD_IMAGE") {
        const errorData = (error as any).errorData;

        // Clear the current image before navigating
        clearImage();

        // Navigate to non-food error page
        navigate("/non-food-error", {
          state: { errorData },
          replace: true,
        });
        return;
      }

      // For other errors, show toast but keep the image
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full mx-auto px-2 py-6 overflow-x-hidden">
      <Card className="shadow-md dark:border-gray-700 h-full rounded-xl">
        <CardContent className="relative">
          {cameraActive ? (
            <CameraCapture
              onCapture={handleImageCapture}
              onCancel={() => setCameraActive(false)}
            />
          ) : selectedImage ? (
            <FoodImageDisplay imageUrl={selectedImage} onClear={clearImage} />
          ) : (
            <FoodAnalysisPrompt
              onUploadClick={() => fileInputRef.current?.click()}
              onCameraClick={handleCameraActivation}
              checkDailyLimit={checkDailyLimit}
            />
          )}
        </CardContent>
      </Card>

      <ScannerActions
        selectedImage={selectedImage}
        isAnalyzing={isAnalyzing}
        onAnalyze={analyzeImage}
      />

      <div className="mt-10 sm:mt-8">
        <ScannerInstructions />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        capture="environment"
      />
    </div>
  );
}
