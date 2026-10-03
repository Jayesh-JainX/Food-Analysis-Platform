import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SEO } from "@/components/shared/SEO";
import {
  AlertTriangle,
  Package,
  Shield,
  Beaker,
  Activity,
  ShieldAlert,
  Apple,
  Utensils,
  Code,
} from "lucide-react";
import ScanChat from "@/components/scanner/ScanChat";

interface ScanData {
  id: string;
  name: string;
  type: string;
  image_url: string;
  health_score: number;
  nutrition: Record<string, number>;
  ingredients: string[];
  allergens: string[];
  health_advice: string;
  extracted_text: string;
  created_at: string;
  product_brand: string | null;
  packaging_info: Record<string, any>;
  certifications: string[];
  health_claims: string[];
  colors_added: string[];
  preservatives: string[];
  total_quantity: string | null;
  ingredient_codes: Record<string, string>;
  additive_details: Record<string, any>;
}

export default function ScanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadScanData();
    getCurrentUser();
  }, [id]);

  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  const loadScanData = async () => {
    try {
      const { data, error } = await supabase
        .from("food_scans")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setScanData(data);
    } catch (error) {
      console.error("Error loading scan data:", error);
      toast.error("Failed to load scan data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const formatNutritionValue = (key: string, value: number): string => {
    // Apply proper units based on nutrient type
    switch (key.toLowerCase()) {
      case "calories":
      case "energy":
        return `${value} kcal`;
      case "sodium":
      case "potassium":
      case "calcium":
      case "iron":
      case "magnesium":
      case "phosphorus":
      case "zinc":
      case "vitamin_c":
      case "vitaminc":
      case "thiamine":
      case "riboflavin":
      case "niacin":
      case "folate":
      case "vitamin_b12":
      case "vitaminb12":
        return `${value} mg`;
      case "vitamin_a":
      case "vitamina":
      case "vitamin_d":
      case "vitamind":
      case "vitamin_e":
      case "vitamine":
      case "vitamin_k":
      case "vitamink":
      case "biotin":
      case "selenium":
        return `${value} µg`;
      case "protein":
      case "carbs":
      case "carbohydrates":
      case "fat":
      case "totalfat":
      case "saturatedfat":
      case "saturated_fat":
      case "transfat":
      case "trans_fat":
      case "fiber":
      case "dietaryfiber":
      case "dietary_fiber":
      case "sugar":
      case "sugars":
      case "addedsugar":
      case "added_sugar":
      case "cholesterol":
        return `${value} g`;
      default:
        // For unknown nutrients, assume grams if > 1, mg if <= 1
        if (value > 1) {
          return `${value} g`;
        } else {
          return `${value} mg`;
        }
    }
  };

  const getHealthScoreRating = (score: number) => {
    if (score >= 81)
      return {
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
        icon: "🌿",
        rating: "Very Healthy",
        description:
          "Excellent nutritional profile with minimal processing, low sugar content, and beneficial nutrients. This product supports a healthy diet.",
      };
    if (score >= 61)
      return {
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200",
        icon: "✅",
        rating: "Fairly Healthy",
        description:
          "Good nutritional balance with moderate processing. Contains some beneficial nutrients with minimal harmful additives.",
      };
    if (score >= 41)
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200",
        icon: "😐",
        rating: "Moderate",
        description:
          "Mixed nutritional profile. May contain moderate amounts of sugar, sodium, or additives. Consider consuming in moderation.",
      };
    if (score >= 21)
      return {
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200",
        icon: "⚠️",
        rating: "Unhealthy",
        description:
          "Poor nutritional profile with high sugar, sodium, or harmful additives. Limited nutritional benefits and should be consumed sparingly.",
      };
    return {
      color: "text-red-600",
      bgColor: "bg-red-300 border-red-200",
      icon: "🚨",
      rating: "Very Unhealthy",
      description:
        "Highly processed with excessive sugar, sodium, and artificial additives. May pose health risks if consumed regularly. Consider healthier alternatives.",
    };
  };

  const getCertificationColor = (cert: string) => {
    const lowerCert = cert.toLowerCase();
    if (lowerCert.includes("organic"))
      return "bg-green-100 text-green-800 border-green-300";
    if (lowerCert.includes("halal"))
      return "bg-blue-100 text-blue-800 border-blue-300";
    if (lowerCert.includes("kosher"))
      return "bg-purple-100 text-purple-800 border-purple-300";
    if (lowerCert.includes("vegan"))
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (lowerCert.includes("gluten"))
      return "bg-amber-100 text-amber-800 border-amber-300";
    if (lowerCert.includes("non-gmo"))
      return "bg-teal-100 text-teal-800 border-teal-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (loading) {
    return (
      <div className="mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Mobile Layout Skeleton */}
        <div className="block lg:hidden space-y-6">
          {/* Product Image Card Skeleton */}
          <div className="rounded-lg border bg-card">
            <div className="p-4 space-y-4">
              <Skeleton className="w-full h-64 rounded-lg" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>

          {/* Health Analysis Card Skeleton */}
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-6">
                {/* Health Score */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>

                {/* Nutrition Facts */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-28" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-40 w-full rounded-md" />
                </div>

                {/* Additional sections */}
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>

          {/* AI Chat Card Skeleton */}
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <Skeleton className="h-6 w-36 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>

        {/* Desktop Layout Skeleton */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Product Image Card Skeleton */}
            <div className="rounded-lg border bg-card">
              <div className="p-4 space-y-4">
                <Skeleton className="w-full h-80 rounded-lg" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* AI Chat Card Skeleton */}
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <Skeleton className="h-6 w-36 mb-4" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Health Analysis Card Skeleton */}
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-6">
                  {/* Health Score */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>

                  {/* Nutrition Facts */}
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-28" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                      ))}
                    </div>
                  </div>

                  {/* Separator */}
                  <Skeleton className="h-px w-full" />

                  {/* Ingredients */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-40 w-full rounded-md" />
                  </div>

                  {/* Allergens */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16" />
                      ))}
                    </div>
                  </div>

                  {/* Health Advice */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-16 w-full" />
                  </div>

                  {/* Additional sections */}
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scanData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Scan not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <SEO
        title={scanData?.name || "Food Scan Details"}
        description={`Comprehensive nutritional analysis and health assessment for ${
          scanData?.name
        }. Health score: ${scanData?.health_score}/100. ${
          scanData?.health_advice || ""
        }`}
        image={scanData?.image_url}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{scanData.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mt-1">
            <span>{new Date(scanData.created_at).toLocaleDateString()}</span>
            {scanData.total_quantity && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {scanData.total_quantity}
                </span>
              </>
            )}
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          {scanData.type}
        </Badge>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-6">
        {/* Product Image Card */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              {!imageLoaded && (
                <Skeleton className="w-full h-64 rounded-lg absolute inset-0" />
              )}
              <img
                src={scanData.image_url}
                alt={scanData.name}
                className={`w-full h-auto rounded-lg object-cover ${
                  !imageLoaded ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                onLoad={handleImageLoad}
              />
            </div>
            {scanData.product_brand && (
              <div className="flex items-center justify-between">
                <span className="font-semibold">Brand</span>
                <Badge variant="outline">{scanData.product_brand}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Analysis Card */}
        <Card>
          <CardHeader>
            <CardTitle>Health Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Health Score</span>
                  <span
                    className={`font-bold ${
                      getHealthScoreRating(scanData.health_score).color
                    }`}
                  >
                    {scanData.health_score}/100
                  </span>
                </div>
                <Progress value={scanData.health_score} className="h-3" />
              </div>

              <div
                className={`p-4 rounded-lg border-2 ${
                  getHealthScoreRating(scanData.health_score).bgColor
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {getHealthScoreRating(scanData.health_score).icon}
                  </span>
                  <span
                    className={`font-semibold ${
                      getHealthScoreRating(scanData.health_score).color
                    }`}
                  >
                    {getHealthScoreRating(scanData.health_score).rating}
                  </span>
                </div>
                <p className="text-sm text-muted">
                  {getHealthScoreRating(scanData.health_score).description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold">Nutrition Facts</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(scanData.nutrition || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="bg-muted rounded-lg p-3 text-center"
                    >
                      <span className="block text-sm text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="block text-lg font-semibold">
                        {formatNutritionValue(key, value)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Ingredients</h3>
                </div>
                <ScrollArea className="h-40 rounded-md border p-4">
                  <div className="flex flex-wrap gap-2">
                    {(scanData.ingredients || []).map((ingredient, index) => (
                      <Badge key={index} variant="secondary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {scanData.allergens && scanData.allergens.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Allergens
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {scanData.allergens.map((allergen, index) => (
                      <Badge key={index} variant="destructive">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {scanData.colors_added && scanData.colors_added.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-orange-500" />
                    Artificial Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {scanData.colors_added.map((color, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-300"
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {scanData.preservatives && scanData.preservatives.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Preservatives
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {scanData.preservatives.map((preservative, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-300"
                      >
                        {preservative}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {scanData.ingredient_codes &&
              Object.keys(scanData.ingredient_codes).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-700" />
                    <h3 className="font-semibold">
                      Ingredient Codes (E-Numbers)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(scanData.ingredient_codes).map(
                      ([code, description]) => (
                        <div key={code} className="bg-muted rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="font-mono">
                              {code}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {scanData.additive_details &&
              Object.keys(scanData.additive_details).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold">Additive Details</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(scanData.additive_details).map(
                      ([additive, details]: [string, any]) => (
                        <div key={additive} className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">{additive}</h4>
                          {details.purpose && (
                            <p className="text-sm text-muted-foreground mb-1">
                              <strong>Purpose:</strong> {details.purpose}
                            </p>
                          )}
                          {details.safety && (
                            <p className="text-sm text-muted-foreground mb-1">
                              <strong>Safety:</strong> {details.safety}
                            </p>
                          )}
                          {details.alternatives && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Alternatives:</strong>{" "}
                              {details.alternatives}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {scanData.health_advice && (
              <div className="space-y-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold">Health Advice</h3>
                <p className="text-muted-foreground bg-muted rounded-lg p-4">
                  {scanData.health_advice}
                </p>
              </div>
            )}

            {scanData.packaging_info &&
              Object.keys(scanData.packaging_info).length > 0 &&
              Object.values(scanData.packaging_info).some(
                (value) =>
                  value && value !== "" && value !== null && value !== undefined
              ) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold">Packaging Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(scanData.packaging_info).map(
                      ([key, value]) =>
                        value &&
                        value !== "" &&
                        value !== null &&
                        value !== undefined && (
                          <div key={key} className="bg-muted rounded-lg p-3">
                            <span className="block text-sm text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="block font-semibold">
                              {String(value)}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

            {scanData.certifications && scanData.certifications.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {scanData.certifications.map((cert, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`border-2 ${getCertificationColor(cert)}`}
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {scanData.health_claims && scanData.health_claims.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Health Claims</h3>
                <div className="flex flex-wrap gap-2">
                  {scanData.health_claims.map((claim, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-50 text-green-700"
                    >
                      {claim}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Chat Card - At bottom on mobile */}
        <Card>
          <CardHeader>
            <CardTitle>AI Chat Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <ScanChat scanId={scanData.id} userId={currentUserId} />
          </CardContent>
        </Card>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                {!imageLoaded && (
                  <Skeleton className="w-full h-80 rounded-lg absolute inset-0" />
                )}
                <img
                  src={scanData.image_url}
                  alt={scanData.name}
                  className={`w-full h-auto rounded-lg object-cover ${
                    !imageLoaded ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                  onLoad={handleImageLoad}
                />
              </div>
              {scanData.product_brand && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Brand</span>
                  <Badge variant="outline">{scanData.product_brand}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Chat Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <ScanChat scanId={scanData.id} userId={currentUserId} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Health Score</span>
                    <span
                      className={`font-bold ${
                        getHealthScoreRating(scanData.health_score).color
                      }`}
                    >
                      {scanData.health_score}/100
                    </span>
                  </div>
                  <Progress value={scanData.health_score} className="h-3" />
                </div>

                <div
                  className={`p-4 rounded-lg border-2 ${
                    getHealthScoreRating(scanData.health_score).bgColor
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {getHealthScoreRating(scanData.health_score).icon}
                    </span>
                    <span
                      className={`font-semibold ${
                        getHealthScoreRating(scanData.health_score).color
                      }`}
                    >
                      {getHealthScoreRating(scanData.health_score).rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {getHealthScoreRating(scanData.health_score).description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Apple className="w-4 h-4 text-green-500" />
                  <h3 className="font-semibold">Nutrition Facts</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(scanData.nutrition || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="bg-muted rounded-lg p-3 text-center"
                      >
                        <span className="block text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="block text-lg font-semibold">
                          {formatNutritionValue(key, value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 my-2">
                    <Utensils className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">Ingredients</h3>
                  </div>
                  <ScrollArea className="h-40 rounded-md border p-4">
                    <div className="flex flex-wrap gap-2">
                      {(scanData.ingredients || []).map((ingredient, index) => (
                        <Badge key={index} variant="secondary">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {scanData.allergens && scanData.allergens.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Allergens
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {scanData.allergens.map((allergen, index) => (
                        <Badge key={index} variant="destructive">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {scanData.colors_added && scanData.colors_added.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Beaker className="w-4 h-4 text-orange-500" />
                      Artificial Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {scanData.colors_added.map((color, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-300"
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {scanData.preservatives &&
                  scanData.preservatives.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        Preservatives
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {scanData.preservatives.map((preservative, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-300"
                          >
                            {preservative}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {scanData.ingredient_codes &&
                Object.keys(scanData.ingredient_codes).length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-amber-700" />
                      <h3 className="font-semibold">
                        Ingredient Codes (E-Numbers)
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(scanData.ingredient_codes).map(
                        ([code, description]) => (
                          <div key={code} className="bg-muted rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="font-mono">
                                {code}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {scanData.additive_details &&
                Object.keys(scanData.additive_details).length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-orange-500" />
                      <h3 className="font-semibold">Additive Details</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(scanData.additive_details).map(
                        ([additive, details]: [string, any]) => (
                          <div
                            key={additive}
                            className="bg-muted rounded-lg p-4"
                          >
                            <h4 className="font-medium mb-2">{additive}</h4>
                            {details.purpose && (
                              <p className="text-sm text-muted-foreground mb-1">
                                <strong>Purpose:</strong> {details.purpose}
                              </p>
                            )}
                            {details.safety && (
                              <p className="text-sm text-muted-foreground mb-1">
                                <strong>Safety:</strong> {details.safety}
                              </p>
                            )}
                            {details.alternatives && (
                              <p className="text-sm text-muted-foreground">
                                <strong>Alternatives:</strong>{" "}
                                {details.alternatives}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {scanData.health_advice && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">Health Advice</h3>
                  </div>
                  <p className="text-muted-foreground bg-muted rounded-lg p-4">
                    {scanData.health_advice}
                  </p>
                </div>
              )}

              {scanData.packaging_info &&
                Object.keys(scanData.packaging_info).length > 0 &&
                Object.values(scanData.packaging_info).some(
                  (value) =>
                    value &&
                    value !== "" &&
                    value !== null &&
                    value !== undefined
                ) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-500" />
                      <h3 className="font-semibold">Packaging Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(scanData.packaging_info).map(
                        ([key, value]) =>
                          value &&
                          value !== "" &&
                          value !== null &&
                          value !== undefined && (
                            <div key={key} className="bg-muted rounded-lg p-3">
                              <span className="block text-sm text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="block font-semibold">
                                {String(value)}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {scanData.certifications &&
                scanData.certifications.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {scanData.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`border-2 ${getCertificationColor(cert)}`}
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {scanData.health_claims && scanData.health_claims.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Health Claims</h3>
                  <div className="flex flex-wrap gap-2">
                    {scanData.health_claims.map((claim, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-50 text-green-700"
                      >
                        {claim}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
