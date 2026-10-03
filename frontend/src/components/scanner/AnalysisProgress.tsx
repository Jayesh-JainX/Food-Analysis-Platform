import { Loader2 } from "lucide-react";

interface AnalysisProgressProps {
  currentStep: "uploading" | "extracting" | "analyzing" | "calculating";
}

const progressSteps = {
  uploading: {
    message: "Uploading image...",
    description: "Securely uploading your image for analysis",
  },
  extracting: {
    message: "Extracting text...",
    description: "Reading and processing text from the image",
  },
  analyzing: {
    message: "Analyzing content...",
    description: "Identifying ingredients and nutrition facts",
  },
  calculating: {
    message: "Calculating health score...",
    description: "Evaluating nutritional value and health metrics",
  },
};

export function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  const { message, description } = progressSteps[currentStep];

  return (
    <div className="flex flex-col items-center space-y-2 text-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="font-medium text-primary">{message}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
