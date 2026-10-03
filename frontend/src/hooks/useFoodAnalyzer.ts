// useFoodAnalyzer.ts
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateImage, isInappropriateContent } from '@/services/scanner/imagePreprocessing';
import { extractTextFromImage } from '@/services/scanner/textExtraction';

export interface NutritionFacts {
  [key: string]: number | string;
}

export interface FoodAnalysisResult {
  productRecognized: boolean;
  imageType: string;
  productName: string;
  imageUrl: string;
  productBrand: string;
  productType: string;
  totalQuantity: string;
  ingredients: string[];
  nutrition: NutritionFacts;
  allergens: string[];
  healthClaims: string[];
  certifications: string[];
  colorsAdded: string[];
  preservatives: string[];
  ingredientCodes: Record<string, string>;
  additiveDetails: Record<string, any>;
  packagingInfo: {
    manufacturingDate: string;
    expiry: string;
    packagingType: string;
    origin: string;
    servingSize: string;
  };
  healthScore: number;
  healthAdvice: string;
  rawExtractedText: string;
  dietaryInfo: string[];
  processingLevel: string;
  isInappropriate: boolean;
  rejectionReason?: string;
  detectedContent?: string;
}

export function useFoodAnalyzer() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const parseNutritionValue = (value: any): number => {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const cleaned = value.replace(/[a-zA-Z%]+/g, '').trim();
      try {
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  const formatNutritionWithUnits = (nutrition: any): Record<string, string> => {
    const formattedNutrition: Record<string, string> = {};
    
    if (nutrition && typeof nutrition === 'object') {
      Object.entries(nutrition).forEach(([key, value]) => {
        const numericValue = parseNutritionValue(value);
        
        // Apply proper units based on nutrient type
        switch (key.toLowerCase()) {
          case 'calories':
          case 'energy':
            formattedNutrition[key] = `${numericValue} kcal`;
            break;
          case 'sodium':
          case 'potassium':
          case 'calcium':
          case 'iron':
          case 'magnesium':
          case 'phosphorus':
          case 'zinc':
          case 'vitamin_c':
          case 'vitaminc':
          case 'thiamine':
          case 'riboflavin':
          case 'niacin':
          case 'folate':
          case 'vitamin_b12':
          case 'vitaminb12':
            formattedNutrition[key] = `${numericValue} mg`;
            break;
          case 'vitamin_a':
          case 'vitamina':
          case 'vitamin_d':
          case 'vitamind':
          case 'vitamin_e':
          case 'vitamine':
          case 'vitamin_k':
          case 'vitamink':
          case 'biotin':
          case 'selenium':
            formattedNutrition[key] = `${numericValue} µg`;
            break;
          case 'protein':
          case 'carbs':
          case 'carbohydrates':
          case 'fat':
          case 'totalfat':
          case 'saturatedfat':
          case 'saturated_fat':
          case 'transfat':
          case 'trans_fat':
          case 'fiber':
          case 'dietaryfiber':
          case 'dietary_fiber':
          case 'sugar':
          case 'sugars':
          case 'addedsugar':
          case 'added_sugar':
          case 'cholesterol':
            formattedNutrition[key] = `${numericValue} g`;
            break;
          default:
            // For unknown nutrients, assume grams if > 1, mg if <= 1
            if (numericValue > 1) {
              formattedNutrition[key] = `${numericValue} g`;
            } else {
              formattedNutrition[key] = `${numericValue} mg`;
            }
        }
      });
    }

    return formattedNutrition;
  };

  const parseNutritionObject = (nutrition: any): Record<string, number> => {
    const cleanedNutrition: Record<string, number> = {};
    
    if (nutrition && typeof nutrition === 'object') {
      Object.entries(nutrition).forEach(([key, value]) => {
        cleanedNutrition[key] = parseNutritionValue(value);
      });
    }

    return {
      calories: cleanedNutrition.calories || 0,
      protein: cleanedNutrition.protein || 0,
      carbs: cleanedNutrition.carbs || cleanedNutrition.carbohydrates || 0,
      fat: cleanedNutrition.fat || cleanedNutrition.totalFat || 0,
      fiber: cleanedNutrition.fiber || cleanedNutrition.dietaryFiber || 0,
      sugar: cleanedNutrition.sugar || cleanedNutrition.sugars || 0,
      sodium: cleanedNutrition.sodium || 0,
      saturatedFat: cleanedNutrition.saturatedFat || 0,
      ...cleanedNutrition
    };
  };

  const uploadImageToStorage = async (imageFile: File): Promise<string> => {
    try {
      await validateImage(imageFile);

      const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
      const fileName = `${user!.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          throw new Error('A file with this name already exists');
        }
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Storage bucket not found. Please check your Supabase configuration.');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('food-images')
        .getPublicUrl(fileName);

      if (!publicUrl) {
        throw new Error('Failed to get public URL');
      }

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      if (error.message === 'Authentication required') {
        throw new Error('Please sign in to upload images');
      }
      if (error.statusCode === 403 || error.message?.includes('permission denied')) {
        throw new Error('Storage permission denied. Please ensure RLS policies are configured correctly.');
      }
      throw new Error(error.message || 'Failed to upload image');
    }
  };

  const analyzeFoodImage = async (imageFile: File) => {
    if (!user) {
      throw new Error('User must be authenticated to analyze food');
    }

    setIsLoading(true);
    let imageUrl = '';
    
    try {
      toast.info("Analyzing image...", { id: "analyze-food" });

      // Upload image to storage first
      imageUrl = await uploadImageToStorage(imageFile);

      // Extract text and analyze with AI
      let aiResponse = "";
      try {
        aiResponse = await extractTextFromImage(imageUrl);
      } catch (error: any) {
        if (error.message.includes("Model is loading")) {
          toast.info("Model is warming up, retrying in 3 seconds...", { id: "analyze-food" });
          await new Promise(resolve => setTimeout(resolve, 3000));
          aiResponse = await extractTextFromImage(imageUrl);
        } else {
          throw error;
        }
      }

      if (!aiResponse) {
        throw new Error("Could not analyze the image");
      }

      // Parse AI response
      const jsonStart = aiResponse.indexOf('{');
      const jsonEnd = aiResponse.lastIndexOf('}');
      let jsonString = aiResponse.slice(jsonStart, jsonEnd + 1);

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(jsonString);
      } catch (jsonError) {
        console.error("Failed to parse extracted JSON string:", jsonString);
        throw new Error("Invalid JSON format from AI response");
      }

      // Check if image is non-food related AFTER successful JSON parsing
      if (parsedResponse.imageType === 'non-food' || parsedResponse.isInappropriate === true) {
        const nonFoodError = new Error('NON_FOOD_IMAGE');
        (nonFoodError as any).errorData = {
          imageUrl,
          rejectionReason: parsedResponse.rejectionReason || 'Image does not contain food products or food labels',
          detectedContent: parsedResponse.detectedContent || 'Non-food content detected'
        };
        throw nonFoodError;
      }

      // Parse nutrition with proper unit handling
      const cleanedNutrition = parseNutritionObject(parsedResponse.nutrition);
      const formattedNutrition = formatNutritionWithUnits(parsedResponse.nutrition);

      const analysisResult: FoodAnalysisResult = {
        productRecognized: parsedResponse.productRecognized || false,
        imageType: parsedResponse.imageType || 'food',
        imageUrl,
        productName: parsedResponse.productName || 'Unknown Product',
        productBrand: parsedResponse.productBrand || '',
        productType: parsedResponse.productType || 'food',
        totalQuantity: parsedResponse.totalQuantity || '',
        ingredients: Array.isArray(parsedResponse.ingredients) ? parsedResponse.ingredients : [],
        nutrition: formattedNutrition, // Use formatted nutrition with units
        allergens: Array.isArray(parsedResponse.allergens) ? parsedResponse.allergens : [],
        healthClaims: Array.isArray(parsedResponse.healthClaims) ? parsedResponse.healthClaims : [],
        certifications: Array.isArray(parsedResponse.certifications) ? parsedResponse.certifications : [],
        colorsAdded: Array.isArray(parsedResponse.colorsAdded) ? parsedResponse.colorsAdded : [],
        preservatives: Array.isArray(parsedResponse.preservatives) ? parsedResponse.preservatives : [],
        ingredientCodes: parsedResponse.ingredientCodes || {},
        additiveDetails: parsedResponse.additiveDetails || {},
        packagingInfo: {
          manufacturingDate: parsedResponse.packagingInfo?.manufacturingDate || '',
          expiry: parsedResponse.packagingInfo?.expiry || '',
          packagingType: parsedResponse.packagingInfo?.packagingType || '',
          origin: parsedResponse.packagingInfo?.origin || '',
          servingSize: parsedResponse.packagingInfo?.servingSize || ''
        },
        healthScore: parseNutritionValue(parsedResponse.healthScore) || 0,
        healthAdvice: parsedResponse.healthAdvice || '',
        rawExtractedText: parsedResponse.rawExtractedText || '',
        dietaryInfo: Array.isArray(parsedResponse.healthClaims) ? parsedResponse.healthClaims : [],
        processingLevel: parsedResponse.productType?.includes("Processed") ? "Processed" : "Natural",
        isInappropriate: false
      };

      // Create the scan record in database
      const scanId = crypto.randomUUID();
      const scanData = {
        id: scanId,
        user_id: user.id,
        image_url: analysisResult.imageUrl,
        scan_date: new Date().toISOString(),
        name: analysisResult.productName,
        type: analysisResult.productType,
        health_score: Math.round(analysisResult.healthScore),
        health_advice: analysisResult.healthAdvice || null,
        allergens: analysisResult.allergens,
        ingredients: analysisResult.ingredients,
        extracted_text: analysisResult.rawExtractedText || null,
        product_recognized: analysisResult.productRecognized,
        image_type: imageFile.type,
        product_brand: analysisResult.productBrand || null,
        nutrition: cleanedNutrition, // Store numeric values in DB
        packaging_info: analysisResult.packagingInfo,
        health_claims: analysisResult.healthClaims,
        certifications: analysisResult.certifications,
        colors_added: analysisResult.colorsAdded,
        preservatives: analysisResult.preservatives,
        total_quantity: analysisResult.totalQuantity || null,
        ingredient_codes: analysisResult.ingredientCodes,
        additive_details: analysisResult.additiveDetails,
        is_inappropriate: analysisResult.isInappropriate
      };

      const { data: insertData, error: insertError } = await supabase
        .from('food_scans')
        .insert([scanData])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        // Clean up uploaded image on database error
        const fileName = analysisResult.imageUrl.split('/').pop();
        if (fileName) {
          try {
            await supabase.storage
              .from('food-images')
              .remove([`${user.id}/${fileName}`]);
          } catch (deleteError) {
            console.error('Error deleting uploaded image after DB error:', deleteError);
          }
        }
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      toast.success("Analysis complete!", { id: "analyze-food" });
      return insertData;

    } catch (error) {
      console.error('Error in analyzeFoodImage:', error);
      
      // Handle non-food image errors specially
      if (error instanceof Error && error.message === 'NON_FOOD_IMAGE') {
        throw error; // Re-throw to handle in component
      }
      
      // For other errors, clean up uploaded image if it exists
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          try {
            await supabase.storage
              .from('food-images')
              .remove([`${user.id}/${fileName}`]);
          } catch (deleteError) {
            console.error('Error deleting uploaded image on error:', deleteError);
          }
        }
      }
      
      toast.error(error instanceof Error ? error.message : "Failed to analyze food label", { id: "analyze-food" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeFoodImage,
    isLoading
  };
}
