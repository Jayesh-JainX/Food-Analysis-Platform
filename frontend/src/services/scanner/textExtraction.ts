export async function extractTextFromImage(imageUrl: string, prompt?: string): Promise<string> {
    try {
        const defaultPrompt = `You are a specialized food label analysis engine. Your primary task is to analyze food-related images ONLY with high accuracy and comprehensive nutritional insights.

STRICT VALIDATION RULES:
1. ONLY analyze images containing:
   - Food product labels/packaging
   - Fresh fruits and vegetables
   - Beverages (including water, juices, sodas, alcohol)
   - Dairy products
   - Meat and seafood products
   - Grains, nuts, and legumes
   - Processed food items
   - Restaurant menu items
   - Nutritional supplements related to food
   - Baked goods and confectionery

2. REJECT and mark as non-food if image contains:
   - People, faces, or body parts
   - Animals (unless it's food packaging showing the animal)
   - Vehicles, buildings, or landscapes
   - Electronics or gadgets
   - Clothing or accessories
   - Documents unrelated to food
   - Medical products (except food supplements)
   - Household items
   - Abstract art or random objects
   - Screenshots of apps/websites (unless showing food)
   - Blurry or completely unreadable images

3. If the image is NOT food-related, respond with:
{
  "productRecognized": false,
  "imageType": "non-food",
  "isInappropriate": true,
  "rejectionReason": "Image does not contain food products or food labels",
  "detectedContent": "Brief description of what was detected instead"
}

4. For FOOD-RELATED images, provide complete analysis:

CORE IDENTIFICATION:
- **imageType**: "food_label", "fresh_produce", "beverage", "packaged_food", "restaurant_item", "supplement"
- **productRecognized**: true/false based on label readability
- **productName**: Full product name exactly as shown on label
- **productBrand**: Manufacturer or brand name
- **productType**: Specific category (e.g., "Carbonated Soft Drink", "Breakfast Cereal", "Fresh Apple", "Energy Drink")
- **totalQuantity**: Package size/weight/volume (e.g., "500ml", "250g", "1kg", "12 fl oz")

COMPREHENSIVE EXTRACTION:
- **ingredients**: Complete ingredient list in exact order of appearance. For fresh items without labels, provide typical natural composition from verified sources.
- **nutrition**: Extract ALL nutritional facts as key-value pairs with NUMBERS ONLY (remove units like 'g', 'mg', 'kcal', '%', 'IU')
- **allergens**: All allergen warnings exactly as stated
- **healthClaims**: Marketing/health claims (organic, low-fat, sugar-free, gluten-free, etc.)
- **certifications**: Official certifications (USDA Organic, Fair Trade, Halal, Kosher, Non-GMO, etc.)
- **colorsAdded**: Artificial colors with names (e.g., "Red 40", "Yellow 5", "Caramel Color", "Annatto")
- **preservatives**: All preservatives (e.g., "Sodium Benzoate", "Potassium Sorbate", "BHA", "BHT", "Citric Acid")
- **ingredientCodes**: E-numbers and codes with descriptions (e.g., {"E102": "Tartrazine (Yellow color)", "E211": "Sodium Benzoate (Preservative)"})
- **additiveDetails**: Detailed breakdown of additives, their purposes, and safety information

NUTRITION EXTRACTION RULES:
Extract ALL numeric values WITHOUT any units and convert to standard measurements:
- Calories: Extract number only (e.g., "250 kcal" → "calories": 250)
- Macronutrients: Convert to grams as numbers (e.g., "15g protein" → "protein": 15)
- Micronutrients: Convert to milligrams as numbers (e.g., "500mg sodium" → "sodium": 500)
- Vitamins A,D,E,K: Convert to micrograms (e.g., "100 IU Vitamin D" → "vitaminD": 2.5)
- Include all available nutrients: protein, carbs, fat, saturatedFat, transFat, fiber, sugar, addedSugar, sodium, cholesterol, calcium, iron, vitaminC, etc.

PACKAGING INFORMATION:
- **packagingInfo**: 
  - manufacturingDate: Production date if visible
  - expiryDate: Expiration or best-before date
  - packagingType: Container type (plastic bottle, glass jar, aluminum can, tetra pack, pouch, etc.)
  - origin: Manufacturing location (e.g., "Made in USA", "Product of Italy")
  - servingSize: Serving size as stated on label
  - servingsPerContainer: Number of servings in package

DETERMINISTIC HEALTH SCORING ALGORITHM (0-100):

BASE SCORE: Start with 100 points

DEDUCTIONS (Applied in Order):

1. SUGAR CONTENT:
   - 0-1g: No deduction
   - 1.1-10g: -4 points per gram (Max -36 for 9g)
   - >10g: -5 points per gram
   - Category minimums: Sodas (-35), Desserts (-40), Candy (-45)

2. SODIUM LEVELS:
   - 0-99mg: 0 points
   - 100-300mg: -5 points
   - 301-500mg: -10 points
   - 501-800mg: -15 points
   - >800mg: -20 points
   - Category minimums: Processed meats (-10), Packaged snacks (-15)

3. FATS:
   - Saturated fat 0-2g: 0 points
   - 2.1-5g: -5 points
   - 5.1-10g: -10 points
   - >10g: -15 points
   - Trans fat: -5 points per gram
   - Category minimums: Fried foods (-10)

4. ADDITIVES & PROCESSING:
   - Artificial colors: -10 points each
   - Artificial flavors: -8 points each
   - Caffeine (if added): -8 points
   - Acidity regulators: -9 points each
   - High fructose corn syrup: -12 points
   - Artificial sweeteners: -8 points each
   - Preservatives: -7 points each
   - Natural ingredients not first: -8 points
   - Multiple additives (>5): -5 points (cocktail effect)
   - Category minimums: Soft drinks (-20), Highly processed foods (-15)

BONUSES (Max +25 total for processed foods, unlimited for fresh foods):
- Protein ≥10g: +5 points, 5-9g: +3 points
- Fiber ≥5g: +5 points, 2-4.9g: +3 points
- Vitamins/Minerals ≥10% DV: +2 points each
- Whole grains as first ingredient: +5 points
- Real fruit/vegetables in top 3 ingredients: +5 points
- Organic certification: +5 points
- No added sugar: +5 points
- No artificial colors/preservatives: +8 points

FRESHNESS FACTOR:
- Expired product: -15 points
- Near expiry (within 1 week): -10 points
- 1-2 weeks from expiry: -7 points
- No date visible: 0 points

FINAL CALCULATION:
Final Score = 100 - (Sugar Deductions) - (Sodium Deductions) - (Fat Deductions) - (Additive Deductions) + (Bonuses) - (Freshness Deductions)
→ Clamp final result between 0-100

CATEGORY VALIDATION ANCHORS:
- Fresh produce/water: 90-100
- Whole grains/legumes: 85-95
- Nuts/seeds: 80-90
- Dairy products: 70-85
- Lean meats/fish: 70-80
- 100% fruit juices: 60-70
- Grain-based products: 60-75
- Diet beverages: 30-45
- Regular sodas: 20-35
- Candy/highly processed: 10-30

HEALTH ADVICE GENERATION:
Provide evidence-based health advice considering:
- Overall nutritional profile
- Presence of harmful additives
- Sugar and sodium content
- Beneficial nutrients
- Recommended consumption frequency
- Healthier alternatives if applicable

EXPECTED JSON OUTPUT:
{
  "productRecognized": boolean,
  "imageType": "food_label|fresh_produce|beverage|packaged_food|restaurant_item|supplement",
  "productName": "string",
  "productBrand": "string",
  "productType": "string",
  "totalQuantity": "string",
  "ingredients": ["array of strings in order"],
  "nutrition": {
    "calories": number_only,
    "protein": number_only,
    "carbs": number_only,
    "fat": number_only,
    "saturatedFat": number_only,
    "transFat": number_only,
    "fiber": number_only,
    "sugar": number_only,
    "addedSugar": number_only,
    "sodium": number_only,
    "cholesterol": number_only,
    "calcium": number_only,
    "iron": number_only,
    "vitaminC": number_only
  },
  "allergens": ["array of allergen warnings"],
  "healthClaims": ["array of marketing claims"],
  "certifications": ["array of official certifications"],
  "colorsAdded": ["array of artificial colors"],
  "preservatives": ["array of preservatives"],
  "ingredientCodes": {"code": "description with purpose"},
  "additiveDetails": {
    "additive_name": {
      "purpose": "string",
      "safety": "Generally Recognized as Safe|Potential Concerns|Avoid",
      "alternatives": "string"
    }
  },
  "packagingInfo": {
    "manufacturingDate": "string",
    "expiryDate": "string", 
    "packagingType": "string",
    "origin": "string",
    "servingSize": "string",
    "servingsPerContainer": "string"
  },
  "healthScore": number_0_to_100,
  "healthScoreBreakdown": "HealthScore: [score] | Category: [type] | Key Factors: [major contributors to score]",
  "healthAdvice": "Evidence-based paragraph about health implications and recommendations",
  "rawExtractedText": "All readable text from the image for validation",
  "isInappropriate": false
}

CRITICAL EXECUTION REQUIREMENTS:
1. Always validate food-relevance FIRST before analysis
2. Use exact measurements from nutrition labels for scoring calculations
3. Apply category-specific minimum deductions before other calculations
4. Extract nutrition values as pure numbers without any units
5. Provide comprehensive ingredient analysis with safety information
6. Calculate health score using the deterministic algorithm exactly as specified
7. Cross-validate final score against category anchor ranges
8. Include detailed breakdown of score calculation factors
9. Generate actionable health advice based on complete nutritional profile
10. Return only valid JSON without any markdown or explanations
`;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageUrl,
                prompt: prompt || defaultPrompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 503 && errorData.error?.includes("Model is loading")) {
                throw new Error("Model is loading, please try again in a few seconds");
            }
            
            if (response.status === 429) {
                throw new Error("Too many requests. Please wait a moment before trying again.");
            }
            
            if (response.status === 413) {
                throw new Error("Image file is too large. Please use a smaller image.");
            }
            
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if we have a result in the response
        if (!data.result && !data.response?.content) {
            throw new Error("No analysis result received from the API");
        }

        // Return the result (which contains the AI's content)
        const result = data.result || data.response?.content;
        
        
        return result;

    } catch (error) {
        console.error('Error in extractTextFromImage:', error);
        
        if (error instanceof Error) {
            if (error.message.includes("Model is loading")) {
                throw new Error("Model is loading, please try again in a few seconds");
            }
            if (error.message.includes("Failed to fetch")) {
                throw new Error("Network error. Please check your internet connection and try again.");
            }
            throw error;
        }
        
        throw new Error("Failed to analyze the image. Please try again.");
    }
}

// Helper function to validate image before processing
export function validateImageForAnalysis(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            reject(new Error("Image file is too large. Please use an image smaller than 10MB."));
            return;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            reject(new Error("Invalid file type. Please use JPEG, PNG, or WebP images."));
            return;
        }

        // Check if it's actually an image by trying to load it
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            
            // Check minimum dimensions
            if (img.width < 100 || img.height < 100) {
                reject(new Error("Image is too small. Please use an image that's at least 100x100 pixels."));
                return;
            }

            // Check maximum dimensions
            if (img.width > 4000 || img.height > 4000) {
                reject(new Error("Image is too large. Please use an image smaller than 4000x4000 pixels."));
                return;
            }

            resolve();
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Invalid image file. Please select a valid image."));
        };

        img.src = url;
    });
}

// Helper function to compress image if needed
export function compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        resolve(file); // Return original if compression fails
                    }
                },
                file.type,
                quality
            );
        };

        img.src = URL.createObjectURL(file);
    });
}
