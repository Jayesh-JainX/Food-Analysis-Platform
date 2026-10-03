import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NutritionAnalysis } from "@/components/nutrition/NutritionAnalysis";
import { ScanAnalysis } from "@/components/scanner/ScanAnalysis";
import { SEO } from "@/components/shared/SEO";

export default function AnalyticsPage() {
  return (
    <>
      <SEO
        title="Analytics"
        description="Track and analyze your nutrition patterns and food scan history. Get insights into your dietary habits and make informed decisions."
        keywords="nutrition analytics, food tracking, dietary analysis, nutrition insights, health tracking, food scan history"
      />
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze your nutrition and food scans
          </p>
        </div>

        <Tabs defaultValue="nutrition" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="nutrition">Nutrition Analysis</TabsTrigger>
            <TabsTrigger value="scans">Scan Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition">
            <NutritionAnalysis />
          </TabsContent>

          <TabsContent value="scans">
            <ScanAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
