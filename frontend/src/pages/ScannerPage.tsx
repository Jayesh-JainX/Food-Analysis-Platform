import { FoodScanner } from "@/components/scanner/FoodScanner";
import { SEO } from "@/components/shared/SEO";
import { Card, CardContent } from "@/components/ui/card";

export default function ScannerPage() {
  return (
    <div className=" mx-auto space-y-6">
      <SEO
        title="Food Scanner"
        description="Scan food labels instantly to get detailed nutritional information, health scores, and ingredient analysis."
      />
      <div className="text-start mx-auto mb-6">
        <h1 className="text-3xl font-bold">Food Scanner</h1>
        <p className="text-muted-foreground mt-1">
          Take a photo or upload an image of any food label to get detailed
          nutritional information and health insights
        </p>
      </div>

      <Card className="mx-auto">
        <CardContent>
          <FoodScanner />
        </CardContent>
      </Card>
    </div>
  );
}
