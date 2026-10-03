import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Image, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface FoodAnalysisPromptProps {
  onUploadClick: () => void;
  onCameraClick: () => void;
  checkDailyLimit: () => Promise<boolean>;
}

export function FoodAnalysisPrompt({
  onUploadClick,
  onCameraClick,
  checkDailyLimit,
}: FoodAnalysisPromptProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleUploadClick = async () => {
    const limitExceeded = await checkDailyLimit();
    if (limitExceeded) {
      setDialogMessage(
        "Daily scan limit of 20 exceeded. Please try again tomorrow."
      );
      setIsDialogOpen(true);
      return;
    }
    onUploadClick();
  };

  const handleCameraClick = async () => {
    const limitExceeded = await checkDailyLimit();
    if (limitExceeded) {
      setDialogMessage(
        "Daily scan limit of 20 exceeded. Please try again tomorrow."
      );
      setIsDialogOpen(true);
      return;
    }
    onCameraClick();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full py-10 rounded-b-md w-full bg-muted/40">
        <div className=" text-center">
          <Image className="h-16 w-16 mb-4 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">Scan Food Label</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Upload or take a photo of any food label to get detailed nutritional
            information, ingredients analysis, and health insights
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="flex items-center gap-2 px-6 py-2 h-auto"
            size="lg"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>

          <Button
            onClick={handleCameraClick}
            className="wellness-gradient flex items-center gap-2 px-6 py-2 h-auto"
            size="lg"
          >
            <Camera className="h-4 w-4" />
            Open Camera
          </Button>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3 max-w-xl mx-2">
          <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
              Smart Label Analysis
            </p>
            <p className="text-muted-foreground">
              Our AI-powered scanner uses image recognition to extract
              nutritional information, identify all ingredients, and provide a
              health assessment of packaged foods.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daily Limit Exceeded!</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>

          {/* Center the button */}
          <div className="flex justify-center mt-4">
            <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
