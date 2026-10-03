import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AnalysisProgress } from "./AnalysisProgress";

interface ScannerActionsProps {
  selectedImage: string | null;
  isAnalyzing: boolean;
  onAnalyze: () => Promise<void>;
}

export function ScannerActions({
  selectedImage,
  isAnalyzing,
  onAnalyze,
}: ScannerActionsProps) {
  const [analysisStep, setAnalysisStep] = useState<
    "uploading" | "extracting" | "analyzing" | "calculating"
  >("uploading");

  if (!selectedImage) return null;

  const handleAnalyze = async () => {
    try {
      setAnalysisStep("uploading");
      setTimeout(() => setAnalysisStep("extracting"), 2000);
      setTimeout(() => setAnalysisStep("analyzing"), 4000);
      setTimeout(() => setAnalysisStep("calculating"), 6000);
      await onAnalyze();
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center space-y-4">
      <Button
        className="wellness-gradient min-w-[200px]"
        size="lg"
        disabled={isAnalyzing}
        onClick={handleAnalyze}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Label...
          </>
        ) : (
          "Analyze Food Label"
        )}
      </Button>

      {isAnalyzing && (
        <div className="mt-4">
          <AnalysisProgress currentStep={analysisStep} />
        </div>
      )}
    </div>
  );
}
