import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ScannerInstructions() {
  return (
    <Card className="bg-muted/10 dark:bg-muted/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm mb-2">
              Tips for better scanning results:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>Ensure good lighting and minimal glare on the food label</li>
              <li>Hold the camera steady and close to the nutrition facts</li>
              <li>
                Make sure the entire nutrition label is visible in the frame
              </li>
              <li>
                For packaged foods, focus on the ingredients list and nutrition
                facts
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
