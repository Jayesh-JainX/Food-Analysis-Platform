export interface FoodItem {
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  servingSize: string;
  defaultServingSize?: string;
  dietaryTags?: string[]; // Array of dietary restriction tags
}

// Common food items with nutritional values per serving
export const foodDatabase: FoodItem[] = [
  // Fruits
  { name: "Apple", type: "fruit", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.5, sugar: 19, servingSize: "1 medium (182g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Banana", type: "fruit", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, servingSize: "1 medium (118g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Orange", type: "fruit", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, servingSize: "1 medium (131g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Strawberries", type: "fruit", calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7, servingSize: "1 cup (152g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Blueberries", type: "fruit", calories: 85, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15, servingSize: "1 cup (148g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Grapes", type: "fruit", calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, sugar: 23, servingSize: "1 cup (151g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Mango", type: "fruit", calories: 107, protein: 0.8, carbs: 28, fat: 0.4, fiber: 3, sugar: 24, servingSize: "1 cup (165g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Pineapple", type: "fruit", calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, sugar: 16, servingSize: "1 cup (165g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Watermelon", type: "fruit", calories: 46, protein: 0.9, carbs: 12, fat: 0.2, fiber: 0.6, sugar: 9.4, servingSize: "1 cup (152g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Kiwi", type: "fruit", calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, sugar: 9, servingSize: "1 medium (69g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Avocado", type: "fruit", calories: 234, protein: 2.9, carbs: 12, fat: 21, fiber: 9.2, sugar: 0.7, servingSize: "1 medium (150g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Lemon", type: "fruit", calories: 17, protein: 0.6, carbs: 5.4, fat: 0.2, fiber: 1.6, sugar: 1.5, servingSize: "1 medium (60g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Vegetables
  { name: "Broccoli", type: "vegetable", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.2, servingSize: "1 cup (91g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Spinach", type: "vegetable", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, servingSize: "1 cup (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Carrot", type: "vegetable", calories: 50, protein: 1.2, carbs: 12, fat: 0.3, fiber: 3.4, sugar: 6.1, servingSize: "1 medium (61g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Sweet Potato", type: "vegetable", calories: 112, protein: 2, carbs: 26, fat: 0.1, fiber: 3.9, sugar: 5.6, servingSize: "1 medium (130g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Cucumber", type: "vegetable", calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, servingSize: "1/2 cup (52g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Tomato", type: "vegetable", calories: 32, protein: 1.6, carbs: 7, fat: 0.4, fiber: 2.2, sugar: 4.7, servingSize: "1 medium (123g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Bell Pepper", type: "vegetable", calories: 31, protein: 1, carbs: 7, fat: 0.3, fiber: 2.5, sugar: 4.2, servingSize: "1 medium (119g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Onion", type: "vegetable", calories: 64, protein: 1.8, carbs: 15, fat: 0.2, fiber: 2.7, sugar: 6.8, servingSize: "1 medium (110g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Lettuce", type: "vegetable", calories: 10, protein: 0.9, carbs: 2, fat: 0.2, fiber: 1, sugar: 0.8, servingSize: "1 cup (47g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Cauliflower", type: "vegetable", calories: 25, protein: 2, carbs: 5, fat: 0.3, fiber: 2, sugar: 1.9, servingSize: "1 cup (100g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Zucchini", type: "vegetable", calories: 20, protein: 1.5, carbs: 4, fat: 0.3, fiber: 1.2, sugar: 2.5, servingSize: "1 cup (124g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Mushrooms", type: "vegetable", calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7, sugar: 1.4, servingSize: "1 cup (70g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Protein Sources
  { name: "Chicken Breast", type: "protein", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, servingSize: "3 oz (85g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Chicken Thigh", type: "protein", calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, sugar: 0, servingSize: "3 oz (85g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Ground Beef (85% lean)", type: "protein", calories: 218, protein: 22, carbs: 0, fat: 14, fiber: 0, sugar: 0, servingSize: "3 oz (85g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Salmon", type: "protein", calories: 175, protein: 19, carbs: 0, fat: 10.5, fiber: 0, sugar: 0, servingSize: "3 oz (85g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Tuna", type: "protein", calories: 109, protein: 25, carbs: 0, fat: 1, fiber: 0, sugar: 0, servingSize: "3 oz (85g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Eggs", type: "protein", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, sugar: 0.6, servingSize: "1 large (50g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Tofu", type: "protein", calories: 94, protein: 10, carbs: 2.3, fat: 5.9, fiber: 1.0, sugar: 0.7, servingSize: "1/2 cup (124g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Black Beans", type: "protein", calories: 227, protein: 15, carbs: 41, fat: 0.9, fiber: 15, sugar: 0.3, servingSize: "1 cup (172g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Lentils", type: "protein", calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 16, sugar: 3.6, servingSize: "1 cup (198g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Pork Chop", type: "protein", calories: 231, protein: 23, carbs: 0, fat: 14, fiber: 0, sugar: 0, servingSize: "3 oz (85g)", dietaryTags: ["gluten-free", "dairy-free"] },

  // Dairy
  { name: "Greek Yogurt", type: "dairy", calories: 133, protein: 17, carbs: 8, fat: 2.5, fiber: 0, sugar: 7, servingSize: "1 container (170g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Milk (2%)", type: "dairy", calories: 122, protein: 8, carbs: 12, fat: 4.8, fiber: 0, sugar: 12, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Cheddar Cheese", type: "dairy", calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0, sugar: 0.5, servingSize: "1 oz (28g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Cottage Cheese", type: "dairy", calories: 163, protein: 25, carbs: 6, fat: 2.3, fiber: 0, sugar: 6, servingSize: "1 cup (210g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Mozzarella", type: "dairy", calories: 85, protein: 6.3, carbs: 1, fat: 6.3, fiber: 0, sugar: 1, servingSize: "1 oz (28g)", dietaryTags: ["vegetarian", "gluten-free"] },

  // Grains & Carbs
  { name: "Brown Rice", type: "grain", calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, servingSize: "1 cup cooked (195g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "White Rice", type: "grain", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, servingSize: "1 cup cooked (158g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Quinoa", type: "grain", calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5.2, sugar: 1.6, servingSize: "1 cup cooked (185g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Oatmeal", type: "grain", calories: 166, protein: 5.9, carbs: 28, fat: 3.6, fiber: 4, sugar: 1.1, servingSize: "1 cup cooked (234g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Whole Wheat Bread", type: "grain", calories: 81, protein: 4, carbs: 15, fat: 1, fiber: 2, sugar: 1.5, servingSize: "1 slice (28g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "White Bread", type: "grain", calories: 79, protein: 2.3, carbs: 15, fat: 1, fiber: 0.8, sugar: 1.5, servingSize: "1 slice (25g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Pasta", type: "grain", calories: 220, protein: 8, carbs: 44, fat: 1.1, fiber: 2.5, sugar: 1.1, servingSize: "1 cup cooked (140g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Potato", type: "grain", calories: 161, protein: 4.3, carbs: 37, fat: 0.2, fiber: 2.3, sugar: 1.7, servingSize: "1 medium (173g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Nuts & Seeds
  { name: "Almonds", type: "nuts", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, servingSize: "1/4 cup (28g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Walnuts", type: "nuts", calories: 185, protein: 4.3, carbs: 3.9, fat: 18, fiber: 1.9, sugar: 0.7, servingSize: "1/4 cup (29g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Peanuts", type: "nuts", calories: 161, protein: 7.3, carbs: 4.6, fat: 14, fiber: 2.4, sugar: 1.3, servingSize: "1/4 cup (28g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Peanut Butter", type: "nuts", calories: 188, protein: 8, carbs: 8, fat: 16, fiber: 2, sugar: 3, servingSize: "2 tbsp (32g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Cashews", type: "nuts", calories: 157, protein: 5.2, carbs: 8.6, fat: 12, fiber: 0.9, sugar: 1.7, servingSize: "1/4 cup (28g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Chia Seeds", type: "seeds", calories: 138, protein: 4.7, carbs: 12, fat: 8.7, fiber: 9.8, sugar: 0, servingSize: "1 oz (28g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Beverages
  { name: "Water", type: "beverage", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, servingSize: "1 cup (240ml)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Coffee (black)", type: "beverage", calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, servingSize: "1 cup (240ml)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Green Tea", type: "beverage", calories: 2, protein: 0, carbs: 0.5, fat: 0, fiber: 0, sugar: 0, servingSize: "1 cup (240ml)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Almond Milk", type: "beverage", calories: 39, protein: 1.5, carbs: 3.4, fat: 2.9, fiber: 0.5, sugar: 2.1, servingSize: "1 cup (240ml)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Orange Juice", type: "beverage", calories: 111, protein: 1.7, carbs: 25, fat: 0.5, fiber: 0.5, sugar: 20.8, servingSize: "1 cup (240ml)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Soda (Cola)", type: "beverage", calories: 139, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39, servingSize: "1 can (355ml)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Snacks & Treats
  { name: "Dark Chocolate", type: "snack", calories: 170, protein: 2.2, carbs: 13, fat: 12, fiber: 3.1, sugar: 7, servingSize: "1 oz (28g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Potato Chips", type: "snack", calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1.4, sugar: 0.1, servingSize: "1 oz (28g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Hummus", type: "snack", calories: 166, protein: 7.9, carbs: 14, fat: 10, fiber: 4, sugar: 0.3, servingSize: "1/2 cup (122g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Granola Bar", type: "snack", calories: 118, protein: 2.5, carbs: 16, fat: 5, fiber: 1.3, sugar: 6, servingSize: "1 bar (28g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Crackers", type: "snack", calories: 62, protein: 1.1, carbs: 10, fat: 2, fiber: 0.4, sugar: 0.3, servingSize: "5 crackers (16g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Common Meals
  { name: "Grilled Chicken Salad", type: "meal", calories: 350, protein: 30, carbs: 15, fat: 18, fiber: 5, sugar: 8, servingSize: "1 bowl (300g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Avocado Toast", type: "meal", calories: 260, protein: 8, carbs: 25, fat: 15, fiber: 12, sugar: 3, servingSize: "1 slice (120g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Spaghetti Bolognese", type: "meal", calories: 670, protein: 32, carbs: 85, fat: 22, fiber: 6, sugar: 12, servingSize: "1 plate (350g)", dietaryTags: ["dairy-free"] },
  { name: "Vegetable Stir Fry", type: "meal", calories: 380, protein: 12, carbs: 40, fat: 18, fiber: 8, sugar: 15, servingSize: "1 bowl (300g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Tuna Sandwich", type: "meal", calories: 350, protein: 23, carbs: 35, fat: 12, fiber: 4, sugar: 6, servingSize: "1 sandwich (160g)", dietaryTags: ["dairy-free"] },
  { name: "Caesar Salad", type: "meal", calories: 470, protein: 7, carbs: 7, fat: 40, fiber: 3, sugar: 3, servingSize: "1 bowl (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Chicken Burrito", type: "meal", calories: 540, protein: 28, carbs: 65, fat: 18, fiber: 8, sugar: 4, servingSize: "1 burrito (250g)", dietaryTags: ["dairy-free"] },
  { name: "Veggie Burger", type: "meal", calories: 390, protein: 16, carbs: 44, fat: 16, fiber: 7, sugar: 8, servingSize: "1 burger (150g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Fish and Chips", type: "meal", calories: 585, protein: 32, carbs: 45, fat: 32, fiber: 4, sugar: 2, servingSize: "1 serving (300g)", dietaryTags: ["dairy-free"] },
  { name: "Pizza Slice", type: "meal", calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2, sugar: 4, servingSize: "1 slice (107g)", dietaryTags: ["vegetarian"] },

  // Indian Foods - Rice & Breads
  { name: "Basmati Rice", type: "indian", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, servingSize: "1 cup cooked (158g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Jeera Rice", type: "indian", calories: 220, protein: 4.5, carbs: 47, fat: 0.6, fiber: 0.8, sugar: 0.2, servingSize: "1 cup cooked (160g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Biryani Rice", type: "indian", calories: 280, protein: 6, carbs: 52, fat: 4, fiber: 1.2, sugar: 0.5, servingSize: "1 cup cooked (180g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Roti", type: "indian", calories: 120, protein: 3.5, carbs: 22, fat: 2, fiber: 2.5, sugar: 0.5, servingSize: "1 piece (40g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Naan", type: "indian", calories: 262, protein: 9, carbs: 46, fat: 4, fiber: 2, sugar: 2, servingSize: "1 piece (90g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Paratha", type: "indian", calories: 180, protein: 4, carbs: 28, fat: 6, fiber: 2, sugar: 1, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Poori", type: "indian", calories: 220, protein: 4.5, carbs: 32, fat: 8, fiber: 1.5, sugar: 0.5, servingSize: "1 piece (45g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Dosa", type: "indian", calories: 140, protein: 4, carbs: 26, fat: 2, fiber: 2, sugar: 1, servingSize: "1 piece (80g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Idli", type: "indian", calories: 80, protein: 3, carbs: 15, fat: 0.5, fiber: 1.5, sugar: 0.5, servingSize: "2 pieces (60g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Upma", type: "indian", calories: 180, protein: 4, carbs: 32, fat: 3, fiber: 2, sugar: 1, servingSize: "1 cup (150g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Indian Curries & Main Dishes
  { name: "Butter Chicken", type: "indian", calories: 320, protein: 18, carbs: 8, fat: 24, fiber: 2, sugar: 4, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free"] },
  { name: "Chicken Tikka Masala", type: "indian", calories: 350, protein: 20, carbs: 10, fat: 26, fiber: 2.5, sugar: 5, servingSize: "1 cup (220g)", dietaryTags: ["gluten-free"] },
  { name: "Paneer Tikka", type: "indian", calories: 280, protein: 16, carbs: 6, fat: 22, fiber: 1.5, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Dal Makhani", type: "indian", calories: 240, protein: 12, carbs: 32, fat: 8, fiber: 8, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Chana Masala", type: "indian", calories: 220, protein: 10, carbs: 36, fat: 4, fiber: 10, sugar: 3, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Aloo Gobi", type: "indian", calories: 180, protein: 6, carbs: 28, fat: 6, fiber: 6, sugar: 4, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Baingan Bharta", type: "indian", calories: 160, protein: 4, carbs: 22, fat: 6, fiber: 5, sugar: 3, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Palak Paneer", type: "indian", calories: 200, protein: 12, carbs: 8, fat: 14, fiber: 4, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Mushroom Masala", type: "indian", calories: 140, protein: 6, carbs: 16, fat: 6, fiber: 4, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Fish Curry", type: "indian", calories: 220, protein: 18, carbs: 8, fat: 12, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Lamb Curry", type: "indian", calories: 280, protein: 20, carbs: 6, fat: 20, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Goat Curry", type: "indian", calories: 260, protein: 22, carbs: 4, fat: 18, fiber: 1.5, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },

  // Indian Snacks & Appetizers
  { name: "Samosa", type: "indian", calories: 260, protein: 6, carbs: 32, fat: 12, fiber: 3, sugar: 2, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Pakora", type: "indian", calories: 180, protein: 4, carbs: 20, fat: 10, fiber: 2, sugar: 1, servingSize: "1 piece (50g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Vada", type: "indian", calories: 140, protein: 4, carbs: 18, fat: 6, fiber: 2, sugar: 1, servingSize: "1 piece (40g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Bhel Puri", type: "indian", calories: 200, protein: 6, carbs: 28, fat: 8, fiber: 4, sugar: 3, servingSize: "1 cup (150g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Pani Puri", type: "indian", calories: 120, protein: 3, carbs: 18, fat: 4, fiber: 2, sugar: 2, servingSize: "6 pieces (60g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Papdi Chaat", type: "indian", calories: 280, protein: 8, carbs: 32, fat: 14, fiber: 3, sugar: 4, servingSize: "1 cup (180g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Indian Desserts
  { name: "Gulab Jamun", type: "indian", calories: 180, protein: 2, carbs: 28, fat: 6, fiber: 0, sugar: 24, servingSize: "2 pieces (60g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Rasgulla", type: "indian", calories: 160, protein: 3, carbs: 32, fat: 2, fiber: 0, sugar: 28, servingSize: "2 pieces (80g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Jalebi", type: "indian", calories: 200, protein: 2, carbs: 36, fat: 4, fiber: 0, sugar: 32, servingSize: "4 pieces (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Kheer", type: "indian", calories: 240, protein: 6, carbs: 36, fat: 8, fiber: 1, sugar: 28, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Kulfi", type: "indian", calories: 180, protein: 4, carbs: 24, fat: 8, fiber: 0, sugar: 20, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Ladoo", type: "indian", calories: 160, protein: 3, carbs: 20, fat: 8, fiber: 1, sugar: 16, servingSize: "1 piece (40g)", dietaryTags: ["vegetarian", "gluten-free"] },

  // Indian Beverages
  { name: "Masala Chai", type: "indian", calories: 80, protein: 2, carbs: 12, fat: 3, fiber: 0, sugar: 10, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Lassi", type: "indian", calories: 120, protein: 4, carbs: 16, fat: 4, fiber: 0, sugar: 14, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Mango Lassi", type: "indian", calories: 160, protein: 4, carbs: 24, fat: 4, fiber: 1, sugar: 20, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Thandai", type: "indian", calories: 140, protein: 4, carbs: 18, fat: 6, fiber: 1, sugar: 16, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },

  // Indian Condiments & Sides
  { name: "Raita", type: "indian", calories: 60, protein: 2, carbs: 4, fat: 4, fiber: 0, sugar: 2, servingSize: "1/2 cup (120g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Mint Chutney", type: "indian", calories: 20, protein: 1, carbs: 3, fat: 0, fiber: 1, sugar: 1, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Tamarind Chutney", type: "indian", calories: 40, protein: 0, carbs: 10, fat: 0, fiber: 0, sugar: 8, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Pickle", type: "indian", calories: 30, protein: 1, carbs: 6, fat: 0, fiber: 1, sugar: 4, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Papadum", type: "indian", calories: 40, protein: 2, carbs: 6, fat: 1, fiber: 1, sugar: 0, servingSize: "1 piece (10g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Indian Breakfast Items
  { name: "Poha", type: "indian", calories: 160, protein: 4, carbs: 28, fat: 3, fiber: 2, sugar: 2, servingSize: "1 cup (150g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Vermicelli Upma", type: "indian", calories: 180, protein: 4, carbs: 32, fat: 3, fiber: 2, sugar: 2, servingSize: "1 cup (150g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Masala Dosa", type: "indian", calories: 200, protein: 6, carbs: 32, fat: 4, fiber: 3, sugar: 2, servingSize: "1 piece (120g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Medu Vada", type: "indian", calories: 160, protein: 4, carbs: 20, fat: 8, fiber: 2, sugar: 1, servingSize: "2 pieces (60g)", dietaryTags: ["vegan", "vegetarian", "dairy-free"] },
  { name: "Masala Idli", type: "indian", calories: 120, protein: 5, carbs: 20, fat: 2, fiber: 2, sugar: 1, servingSize: "2 pieces (80g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Indian Street Food
  { name: "Pav Bhaji", type: "indian", calories: 320, protein: 8, carbs: 44, fat: 12, fiber: 6, sugar: 4, servingSize: "1 plate (250g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Vada Pav", type: "indian", calories: 280, protein: 8, carbs: 36, fat: 12, fiber: 3, sugar: 2, servingSize: "1 piece (120g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Dahi Puri", type: "indian", calories: 240, protein: 6, carbs: 32, fat: 10, fiber: 3, sugar: 4, servingSize: "1 plate (180g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Sev Puri", type: "indian", calories: 200, protein: 4, carbs: 28, fat: 8, fiber: 2, sugar: 3, servingSize: "1 plate (150g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Ragda Pattice", type: "indian", calories: 260, protein: 8, carbs: 36, fat: 10, fiber: 4, sugar: 3, servingSize: "1 plate (200g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Indian Regional Specialties
  { name: "Hyderabadi Biryani", type: "indian", calories: 420, protein: 16, carbs: 64, fat: 12, fiber: 3, sugar: 2, servingSize: "1 plate (300g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Kerala Fish Curry", type: "indian", calories: 240, protein: 20, carbs: 8, fat: 14, fiber: 2, sugar: 2, servingSize: "1 cup (220g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Punjabi Sarson Ka Saag", type: "indian", calories: 180, protein: 8, carbs: 20, fat: 8, fiber: 6, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Gujarati Kadhi", type: "indian", calories: 140, protein: 6, carbs: 16, fat: 6, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Maharashtrian Misal Pav", type: "indian", calories: 360, protein: 12, carbs: 48, fat: 14, fiber: 6, sugar: 4, servingSize: "1 plate (280g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Bengali Fish Curry", type: "indian", calories: 220, protein: 18, carbs: 6, fat: 12, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Tamil Nadu Sambar", type: "indian", calories: 160, protein: 8, carbs: 24, fat: 4, fiber: 6, sugar: 3, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Karnataka Bisi Bele Bath", type: "indian", calories: 320, protein: 10, carbs: 52, fat: 8, fiber: 6, sugar: 3, servingSize: "1 cup (250g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Andhra Pradesh Gongura Pachadi", type: "indian", calories: 80, protein: 3, carbs: 12, fat: 2, fiber: 3, sugar: 2, servingSize: "1/2 cup (100g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Rajasthani Dal Baati", type: "indian", calories: 380, protein: 12, carbs: 56, fat: 12, fiber: 4, sugar: 2, servingSize: "1 plate (250g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Additional Indian Rice Varieties
  { name: "Lemon Rice", type: "indian", calories: 240, protein: 5, carbs: 48, fat: 2, fiber: 1, sugar: 1, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Coconut Rice", type: "indian", calories: 280, protein: 5, carbs: 52, fat: 4, fiber: 2, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Tomato Rice", type: "indian", calories: 260, protein: 5, carbs: 50, fat: 3, fiber: 2, sugar: 3, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Pulao", type: "indian", calories: 300, protein: 6, carbs: 56, fat: 4, fiber: 2, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Khichdi", type: "indian", calories: 220, protein: 8, carbs: 40, fat: 2, fiber: 4, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Additional Indian Breads
  { name: "Bhatura", type: "indian", calories: 280, protein: 6, carbs: 48, fat: 6, fiber: 2, sugar: 2, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Kulcha", type: "indian", calories: 240, protein: 6, carbs: 44, fat: 4, fiber: 2, sugar: 2, servingSize: "1 piece (70g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Thepla", type: "indian", calories: 200, protein: 6, carbs: 32, fat: 6, fiber: 3, sugar: 1, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Missi Roti", type: "indian", calories: 160, protein: 6, carbs: 28, fat: 4, fiber: 4, sugar: 1, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Makki Ki Roti", type: "indian", calories: 140, protein: 4, carbs: 24, fat: 3, fiber: 2, sugar: 1, servingSize: "1 piece (50g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Additional Indian Curries
  { name: "Rajma Masala", type: "indian", calories: 240, protein: 12, carbs: 40, fat: 4, fiber: 12, sugar: 3, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Moong Dal", type: "indian", calories: 200, protein: 12, carbs: 32, fat: 2, fiber: 8, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Toor Dal", type: "indian", calories: 220, protein: 12, carbs: 36, fat: 2, fiber: 8, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Urad Dal", type: "indian", calories: 240, protein: 14, carbs: 36, fat: 2, fiber: 8, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Masoor Dal", type: "indian", calories: 200, protein: 12, carbs: 32, fat: 2, fiber: 8, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Mixed Dal", type: "indian", calories: 220, protein: 12, carbs: 34, fat: 2, fiber: 8, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Additional Vegetable Dishes
  { name: "Bhindi Masala", type: "indian", calories: 140, protein: 4, carbs: 20, fat: 6, fiber: 6, sugar: 3, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Lauki Ki Sabzi", type: "indian", calories: 120, protein: 3, carbs: 18, fat: 4, fiber: 4, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Tinda Masala", type: "indian", calories: 100, protein: 3, carbs: 16, fat: 3, fiber: 3, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Karela Sabzi", type: "indian", calories: 120, protein: 4, carbs: 18, fat: 4, fiber: 5, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Arbi Ki Sabzi", type: "indian", calories: 160, protein: 4, carbs: 28, fat: 4, fiber: 4, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Sarson Ka Saag", type: "indian", calories: 180, protein: 8, carbs: 20, fat: 8, fiber: 6, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Methi Ki Sabzi", type: "indian", calories: 120, protein: 4, carbs: 16, fat: 4, fiber: 4, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Additional Paneer Dishes
  { name: "Paneer Butter Masala", type: "indian", calories: 320, protein: 16, carbs: 8, fat: 26, fiber: 2, sugar: 4, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Paneer Bhurji", type: "indian", calories: 240, protein: 14, carbs: 6, fat: 18, fiber: 2, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Paneer Do Pyaza", type: "indian", calories: 280, protein: 14, carbs: 8, fat: 22, fiber: 3, sugar: 3, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Paneer Jalfrezi", type: "indian", calories: 260, protein: 12, carbs: 8, fat: 20, fiber: 3, sugar: 3, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Paneer Tikka Masala", type: "indian", calories: 300, protein: 16, carbs: 8, fat: 24, fiber: 2, sugar: 4, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },

  // Additional Chicken Dishes
  { name: "Chicken Do Pyaza", type: "indian", calories: 280, protein: 22, carbs: 6, fat: 18, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Chicken Jalfrezi", type: "indian", calories: 260, protein: 20, carbs: 6, fat: 16, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Chicken Kadai", type: "indian", calories: 240, protein: 18, carbs: 4, fat: 16, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Chicken Chettinad", type: "indian", calories: 280, protein: 20, carbs: 6, fat: 18, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Chicken Vindaloo", type: "indian", calories: 300, protein: 22, carbs: 8, fat: 20, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },

  // Additional Fish Dishes
  { name: "Fish Tikka", type: "indian", calories: 200, protein: 18, carbs: 4, fat: 12, fiber: 1, sugar: 1, servingSize: "1 cup (180g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Fish Do Pyaza", type: "indian", calories: 220, protein: 18, carbs: 6, fat: 12, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Fish Jalfrezi", type: "indian", calories: 200, protein: 16, carbs: 6, fat: 10, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Fish Kadai", type: "indian", calories: 180, protein: 14, carbs: 4, fat: 10, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },

  // Additional Snacks
  { name: "Kachori", type: "indian", calories: 240, protein: 6, carbs: 28, fat: 12, fiber: 2, sugar: 2, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Dhokla", type: "indian", calories: 160, protein: 6, carbs: 24, fat: 4, fiber: 2, sugar: 2, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Khandvi", type: "indian", calories: 120, protein: 4, carbs: 18, fat: 4, fiber: 2, sugar: 1, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Methi Thepla", type: "indian", calories: 180, protein: 6, carbs: 28, fat: 6, fiber: 3, sugar: 1, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Aloo Tikki", type: "indian", calories: 160, protein: 4, carbs: 20, fat: 8, fiber: 2, sugar: 1, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Hara Bhara Kabab", type: "indian", calories: 140, protein: 6, carbs: 16, fat: 6, fiber: 3, sugar: 1, servingSize: "1 piece (50g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Additional Desserts
  { name: "Rasmalai", type: "indian", calories: 200, protein: 4, carbs: 32, fat: 6, fiber: 0, sugar: 28, servingSize: "2 pieces (80g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Gajar Ka Halwa", type: "indian", calories: 240, protein: 4, carbs: 32, fat: 10, fiber: 2, sugar: 24, servingSize: "1 cup (150g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Besan Ladoo", type: "indian", calories: 180, protein: 4, carbs: 20, fat: 10, fiber: 1, sugar: 16, servingSize: "1 piece (40g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Mysore Pak", type: "indian", calories: 220, protein: 4, carbs: 16, fat: 16, fiber: 0, sugar: 12, servingSize: "1 piece (50g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Sooji Halwa", type: "indian", calories: 200, protein: 3, carbs: 24, fat: 10, fiber: 1, sugar: 18, servingSize: "1 cup (120g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Kaju Katli", type: "indian", calories: 160, protein: 4, carbs: 12, fat: 12, fiber: 1, sugar: 8, servingSize: "1 piece (30g)", dietaryTags: ["vegetarian", "gluten-free"] },

  // Additional Beverages
  { name: "Filter Coffee", type: "indian", calories: 60, protein: 2, carbs: 8, fat: 2, fiber: 0, sugar: 6, servingSize: "1 cup (120ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Masala Doodh", type: "indian", calories: 140, protein: 6, carbs: 16, fat: 6, fiber: 0, sugar: 14, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Badam Milk", type: "indian", calories: 180, protein: 6, carbs: 20, fat: 8, fiber: 1, sugar: 16, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Rose Lassi", type: "indian", calories: 140, protein: 4, carbs: 18, fat: 6, fiber: 0, sugar: 16, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Saffron Milk", type: "indian", calories: 160, protein: 6, carbs: 18, fat: 6, fiber: 0, sugar: 16, servingSize: "1 cup (240ml)", dietaryTags: ["vegetarian", "gluten-free"] },

  // Additional Chutneys & Pickles
  { name: "Coconut Chutney", type: "indian", calories: 80, protein: 2, carbs: 8, fat: 6, fiber: 2, sugar: 2, servingSize: "2 tbsp (30g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Tomato Chutney", type: "indian", calories: 40, protein: 1, carbs: 8, fat: 1, fiber: 1, sugar: 6, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Onion Chutney", type: "indian", calories: 30, protein: 1, carbs: 6, fat: 0, fiber: 1, sugar: 4, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Coriander Chutney", type: "indian", calories: 20, protein: 1, carbs: 3, fat: 0, fiber: 1, sugar: 1, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Mango Pickle", type: "indian", calories: 40, protein: 1, carbs: 8, fat: 1, fiber: 1, sugar: 6, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Lemon Pickle", type: "indian", calories: 30, protein: 1, carbs: 6, fat: 0, fiber: 1, sugar: 4, servingSize: "2 tbsp (30g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Additional Breakfast Items
  { name: "Masala Omelette", type: "indian", calories: 180, protein: 12, carbs: 4, fat: 12, fiber: 1, sugar: 2, servingSize: "1 piece (100g)", dietaryTags: ["gluten-free"] },
  { name: "Bread Omelette", type: "indian", calories: 220, protein: 12, carbs: 12, fat: 14, fiber: 1, sugar: 2, servingSize: "1 piece (120g)", dietaryTags: ["vegetarian"] },
  { name: "Egg Bhurji", type: "indian", calories: 200, protein: 14, carbs: 4, fat: 14, fiber: 1, sugar: 2, servingSize: "1 cup (150g)", dietaryTags: ["gluten-free"] },
  { name: "Masala Dosa with Chutney", type: "indian", calories: 240, protein: 8, carbs: 36, fat: 6, fiber: 4, sugar: 3, servingSize: "1 piece (150g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Idli with Sambar", type: "indian", calories: 160, protein: 8, carbs: 24, fat: 2, fiber: 4, sugar: 2, servingSize: "2 pieces with sambar (120g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Additional Street Food
  { name: "Chole Bhature", type: "indian", calories: 480, protein: 12, carbs: 64, fat: 20, fiber: 8, sugar: 4, servingSize: "1 plate (300g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Dahi Vada", type: "indian", calories: 200, protein: 6, carbs: 24, fat: 10, fiber: 2, sugar: 4, servingSize: "2 pieces (100g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Aloo Chaat", type: "indian", calories: 180, protein: 4, carbs: 24, fat: 8, fiber: 3, sugar: 3, servingSize: "1 cup (150g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Dahi Puri", type: "indian", calories: 240, protein: 6, carbs: 32, fat: 10, fiber: 3, sugar: 4, servingSize: "1 plate (180g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Ragda Pattice", type: "indian", calories: 260, protein: 8, carbs: 36, fat: 10, fiber: 4, sugar: 3, servingSize: "1 plate (200g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Bhel Puri", type: "indian", calories: 200, protein: 6, carbs: 28, fat: 8, fiber: 4, sugar: 3, servingSize: "1 cup (150g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // Additional Regional Specialties
  { name: "Kashmiri Pulao", type: "indian", calories: 320, protein: 8, carbs: 56, fat: 6, fiber: 3, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Goan Fish Curry", type: "indian", calories: 240, protein: 20, carbs: 8, fat: 14, fiber: 2, sugar: 2, servingSize: "1 cup (220g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Assamese Fish Curry", type: "indian", calories: 220, protein: 18, carbs: 6, fat: 12, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Manipuri Eromba", type: "indian", calories: 180, protein: 8, carbs: 24, fat: 6, fiber: 4, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Mizoram Bai", type: "indian", calories: 160, protein: 6, carbs: 20, fat: 6, fiber: 3, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Nagaland Pork Curry", type: "indian", calories: 280, protein: 20, carbs: 4, fat: 20, fiber: 1, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Tripura Fish Curry", type: "indian", calories: 220, protein: 18, carbs: 6, fat: 12, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Meghalaya Pork Curry", type: "indian", calories: 260, protein: 18, carbs: 4, fat: 18, fiber: 1, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Arunachal Pradesh Thukpa", type: "indian", calories: 200, protein: 8, carbs: 32, fat: 4, fiber: 3, sugar: 2, servingSize: "1 cup (250g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Sikkim Momos", type: "indian", calories: 160, protein: 6, carbs: 24, fat: 4, fiber: 2, sugar: 1, servingSize: "4 pieces (80g)", dietaryTags: ["vegetarian", "dairy-free"] },

  // More Regional Specialties
  { name: "Kerala Beef Fry", type: "indian", calories: 320, protein: 24, carbs: 4, fat: 22, fiber: 1, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Kerala Chicken Stew", type: "indian", calories: 280, protein: 20, carbs: 8, fat: 18, fiber: 2, sugar: 2, servingSize: "1 cup (220g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Kerala Fish Molee", type: "indian", calories: 240, protein: 18, carbs: 6, fat: 14, fiber: 2, sugar: 2, servingSize: "1 cup (220g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Kerala Appam", type: "indian", calories: 120, protein: 3, carbs: 22, fat: 2, fiber: 1, sugar: 1, servingSize: "2 pieces (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Kerala Puttu", type: "indian", calories: 140, protein: 4, carbs: 26, fat: 2, fiber: 2, sugar: 1, servingSize: "1 piece (100g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Kerala Malabar Parotta", type: "indian", calories: 200, protein: 5, carbs: 36, fat: 4, fiber: 2, sugar: 1, servingSize: "1 piece (70g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Tamil Nadu Chettinad Chicken", type: "indian", calories: 300, protein: 22, carbs: 8, fat: 20, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Tamil Nadu Rasam", type: "indian", calories: 80, protein: 4, carbs: 12, fat: 2, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Tamil Nadu Poriyal", type: "indian", calories: 120, protein: 4, carbs: 16, fat: 4, fiber: 3, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Tamil Nadu Kootu", type: "indian", calories: 160, protein: 8, carbs: 20, fat: 6, fiber: 4, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Tamil Nadu Thayir Sadam", type: "indian", calories: 200, protein: 6, carbs: 36, fat: 4, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Karnataka Ragi Mudde", type: "indian", calories: 180, protein: 6, carbs: 32, fat: 2, fiber: 4, sugar: 1, servingSize: "2 pieces (120g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Karnataka Neer Dosa", type: "indian", calories: 80, protein: 2, carbs: 16, fat: 1, fiber: 1, sugar: 0, servingSize: "3 pieces (60g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Karnataka Mangalore Fish Curry", type: "indian", calories: 240, protein: 20, carbs: 8, fat: 14, fiber: 2, sugar: 2, servingSize: "1 cup (220g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Karnataka Coorg Pork Curry", type: "indian", calories: 280, protein: 20, carbs: 4, fat: 20, fiber: 1, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Karnataka Udupi Sambar", type: "indian", calories: 160, protein: 8, carbs: 24, fat: 4, fiber: 6, sugar: 3, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Andhra Pradesh Pesarattu", type: "indian", calories: 160, protein: 8, carbs: 24, fat: 4, fiber: 3, sugar: 1, servingSize: "2 pieces (100g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Andhra Pradesh Gutti Vankaya", type: "indian", calories: 180, protein: 6, carbs: 20, fat: 8, fiber: 4, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Andhra Pradesh Chicken Pulao", type: "indian", calories: 360, protein: 16, carbs: 56, fat: 8, fiber: 3, sugar: 2, servingSize: "1 cup (250g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Andhra Pradesh Fish Pulusu", type: "indian", calories: 200, protein: 16, carbs: 12, fat: 10, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Telangana Mirchi Ka Salan", type: "indian", calories: 120, protein: 4, carbs: 16, fat: 6, fiber: 3, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Telangana Bagara Baingan", type: "indian", calories: 160, protein: 4, carbs: 20, fat: 8, fiber: 4, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Telangana Double Ka Meetha", type: "indian", calories: 280, protein: 4, carbs: 44, fat: 10, fiber: 1, sugar: 32, servingSize: "1 piece (100g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Maharashtra Puran Poli", type: "indian", calories: 200, protein: 4, carbs: 32, fat: 6, fiber: 2, sugar: 16, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Maharashtra Bharli Vangi", type: "indian", calories: 180, protein: 6, carbs: 20, fat: 8, fiber: 4, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Maharashtra Modak", type: "indian", calories: 160, protein: 3, carbs: 24, fat: 6, fiber: 1, sugar: 18, servingSize: "2 pieces (60g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Gujarat Undhiyu", type: "indian", calories: 240, protein: 8, carbs: 32, fat: 10, fiber: 6, sugar: 3, servingSize: "1 cup (250g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Gujarat Fafda", type: "indian", calories: 180, protein: 4, carbs: 28, fat: 6, fiber: 2, sugar: 1, servingSize: "1 piece (50g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Rajasthan Gatte Ki Sabzi", type: "indian", calories: 200, protein: 8, carbs: 24, fat: 8, fiber: 3, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Rajasthan Ker Sangri", type: "indian", calories: 140, protein: 4, carbs: 16, fat: 6, fiber: 4, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Rajasthan Laal Maas", type: "indian", calories: 320, protein: 24, carbs: 6, fat: 22, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Rajasthan Ghewar", type: "indian", calories: 240, protein: 3, carbs: 36, fat: 10, fiber: 1, sugar: 24, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Punjab Amritsari Fish", type: "indian", calories: 280, protein: 18, carbs: 16, fat: 16, fiber: 2, sugar: 1, servingSize: "1 piece (100g)", dietaryTags: ["dairy-free"] },
  { name: "Punjab Tandoori Chicken", type: "indian", calories: 240, protein: 22, carbs: 4, fat: 14, fiber: 1, sugar: 1, servingSize: "1 piece (120g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Haryana Bajra Roti", type: "indian", calories: 120, protein: 4, carbs: 20, fat: 3, fiber: 3, sugar: 1, servingSize: "1 piece (50g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Haryana Singri Ki Sabzi", type: "indian", calories: 140, protein: 4, carbs: 18, fat: 6, fiber: 4, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Haryana Kachri Ki Sabzi", type: "indian", calories: 120, protein: 3, carbs: 16, fat: 5, fiber: 3, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "UP Awadhi Biryani", type: "indian", calories: 400, protein: 16, carbs: 60, fat: 12, fiber: 3, sugar: 2, servingSize: "1 plate (300g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "UP Galouti Kebab", type: "indian", calories: 200, protein: 16, carbs: 4, fat: 12, fiber: 1, sugar: 1, servingSize: "2 pieces (80g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "UP Kakori Kebab", type: "indian", calories: 180, protein: 14, carbs: 4, fat: 10, fiber: 1, sugar: 1, servingSize: "2 pieces (80g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "UP Shami Kebab", type: "indian", calories: 160, protein: 12, carbs: 6, fat: 8, fiber: 1, sugar: 1, servingSize: "2 pieces (80g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "UP Sheermal", type: "indian", calories: 220, protein: 5, carbs: 36, fat: 6, fiber: 1, sugar: 8, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Bihar Litti Chokha", type: "indian", calories: 320, protein: 10, carbs: 48, fat: 10, fiber: 4, sugar: 2, servingSize: "2 pieces (200g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Bihar Sattu Paratha", type: "indian", calories: 240, protein: 8, carbs: 36, fat: 8, fiber: 3, sugar: 1, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Bihar Chana Ghugni", type: "indian", calories: 200, protein: 10, carbs: 28, fat: 6, fiber: 6, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Bihar Khaja", type: "indian", calories: 180, protein: 3, carbs: 24, fat: 8, fiber: 1, sugar: 12, servingSize: "2 pieces (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Bengal Chingri Malai Curry", type: "indian", calories: 280, protein: 16, carbs: 8, fat: 20, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free"] },
  { name: "Bengal Aloo Posto", type: "indian", calories: 160, protein: 6, carbs: 16, fat: 8, fiber: 3, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Bengal Bhapa Ilish", type: "indian", calories: 240, protein: 20, carbs: 4, fat: 16, fiber: 1, sugar: 1, servingSize: "1 piece (120g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Odisha Pakhala", type: "indian", calories: 120, protein: 3, carbs: 24, fat: 1, fiber: 1, sugar: 1, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Odisha Dalma", type: "indian", calories: 160, protein: 8, carbs: 20, fat: 6, fiber: 4, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Odisha Santula", type: "indian", calories: 180, protein: 10, carbs: 24, fat: 6, fiber: 5, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Odisha Chhena Poda", type: "indian", calories: 200, protein: 6, carbs: 28, fat: 8, fiber: 1, sugar: 20, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "gluten-free"] },
  { name: "Chhattisgarh Chila", type: "indian", calories: 140, protein: 5, carbs: 20, fat: 4, fiber: 2, sugar: 1, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Chhattisgarh Fara", type: "indian", calories: 160, protein: 6, carbs: 24, fat: 4, fiber: 2, sugar: 1, servingSize: "1 piece (80g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Chhattisgarh Muthia", type: "indian", calories: 120, protein: 4, carbs: 18, fat: 3, fiber: 2, sugar: 1, servingSize: "1 piece (60g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "MP Poha Jalebi", type: "indian", calories: 280, protein: 6, carbs: 44, fat: 8, fiber: 2, sugar: 20, servingSize: "1 plate (200g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "MP Bhutte Ka Kees", type: "indian", calories: 160, protein: 4, carbs: 24, fat: 6, fiber: 3, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "MP Dal Bafla", type: "indian", calories: 320, protein: 10, carbs: 48, fat: 10, fiber: 3, sugar: 2, servingSize: "1 plate (250g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "MP Bhopali Gosht Korma", type: "indian", calories: 300, protein: 20, carbs: 8, fat: 20, fiber: 2, sugar: 2, servingSize: "1 cup (200g)", dietaryTags: ["gluten-free", "dairy-free"] },
  { name: "Jharkhand Dhuska", type: "indian", calories: 200, protein: 6, carbs: 32, fat: 6, fiber: 2, sugar: 1, servingSize: "2 pieces (100g)", dietaryTags: ["vegetarian", "dairy-free"] },
  { name: "Jharkhand Handia", type: "indian", calories: 80, protein: 2, carbs: 16, fat: 0, fiber: 0, sugar: 0, servingSize: "1 cup (200ml)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Jharkhand Rugda Curry", type: "indian", calories: 120, protein: 4, carbs: 16, fat: 4, fiber: 3, sugar: 2, servingSize: "1 cup (180g)", dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] }
];

// Function to search for foods that match a given input
export function searchFoods(input: string, dietaryRestrictions?: string[]): FoodItem[] {
  if (!input || input.length < 2) return [];
  
  const lowerInput = input.toLowerCase();
  
  let filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowerInput) || 
    food.type.toLowerCase().includes(lowerInput)
  );

  // Apply dietary restrictions filter if provided
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    filteredFoods = filteredFoods.filter(food => {
      // If food has no dietary tags, it's not compatible with any restrictions
      if (!food.dietaryTags || food.dietaryTags.length === 0) {
        return false;
      }
      
      // Check if food has ALL the required dietary tags
      return dietaryRestrictions.every(restriction => 
        food.dietaryTags!.includes(restriction)
      );
    });
  }

  return filteredFoods.slice(0, 20); // Limit results to 20 items for better performance
}

// Function to get foods by category
export function getFoodsByCategory(category: string, dietaryRestrictions?: string[]): FoodItem[] {
  let filteredFoods = foodDatabase.filter(food => food.type === category);

  // Apply dietary restrictions filter if provided
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    filteredFoods = filteredFoods.filter(food => {
      // If food has no dietary tags, it's not compatible with any restrictions
      if (!food.dietaryTags || food.dietaryTags.length === 0) {
        return false;
      }
      
      // Check if food has ALL the required dietary tags
      return dietaryRestrictions.every(restriction => 
        food.dietaryTags!.includes(restriction)
      );
    });
  }

  return filteredFoods;
}

// Function to get all food categories
export function getFoodCategories(): string[] {
  const categories = [...new Set(foodDatabase.map(food => food.type))];
  return categories.sort();
}
