import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FoodImageDisplayProps {
  imageUrl: string;
  onClear: () => void;
}

export function FoodImageDisplay({ imageUrl, onClear }: FoodImageDisplayProps) {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="Selected food"
        className="w-full h-[60vh] object-contain rounded-b-md bg-muted/40"
      />
      <Button
        variant="secondary"
        className="absolute top-4 right-4 rounded-full"
        size="icon"
        onClick={onClear}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
