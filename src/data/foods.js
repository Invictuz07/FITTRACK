const foods = [
  // ── PROTEIN ──
  { id: 'chicken_breast', name: 'Chicken Breast', category: 'protein', protein: 31, carbs: 0, fats: 3.6, calories: 165, servingSize: '100g', servingUnit: 'g' },
  { id: 'turkey_breast', name: 'Turkey Breast', category: 'protein', protein: 29, carbs: 0, fats: 1, calories: 135, servingSize: '100g', servingUnit: 'g' },
  { id: 'salmon', name: 'Salmon Fillet', category: 'protein', protein: 20, carbs: 0, fats: 13, calories: 208, servingSize: '100g', servingUnit: 'g' },
  { id: 'tuna', name: 'Tuna (canned)', category: 'protein', protein: 26, carbs: 0, fats: 1, calories: 116, servingSize: '100g', servingUnit: 'g' },
  { id: 'eggs', name: 'Whole Eggs', category: 'protein', protein: 13, carbs: 1.1, fats: 11, calories: 155, servingSize: '100g', servingUnit: 'g' },
  { id: 'egg_whites', name: 'Egg Whites', category: 'protein', protein: 11, carbs: 0.7, fats: 0.2, calories: 52, servingSize: '100g', servingUnit: 'g' },
  { id: 'shrimp', name: 'Shrimp', category: 'protein', protein: 24, carbs: 0.2, fats: 0.3, calories: 99, servingSize: '100g', servingUnit: 'g' },
  { id: 'beef_lean', name: 'Lean Beef (sirloin)', category: 'protein', protein: 26, carbs: 0, fats: 8, calories: 180, servingSize: '100g', servingUnit: 'g' },
  { id: 'ground_beef', name: 'Ground Beef (90% lean)', category: 'protein', protein: 20, carbs: 0, fats: 10, calories: 176, servingSize: '100g', servingUnit: 'g' },
  { id: 'cottage_cheese', name: 'Cottage Cheese (low-fat)', category: 'protein', protein: 11, carbs: 3.4, fats: 1, calories: 72, servingSize: '100g', servingUnit: 'g' },
  { id: 'greek_yogurt', name: 'Greek Yogurt (plain)', category: 'protein', protein: 10, carbs: 3.6, fats: 0.7, calories: 59, servingSize: '100g', servingUnit: 'g' },
  { id: 'whey_protein', name: 'Whey Protein Powder', category: 'protein', protein: 80, carbs: 6, fats: 3, calories: 370, servingSize: '100g', servingUnit: 'g' },
  { id: 'tofu', name: 'Firm Tofu', category: 'protein', protein: 8, carbs: 2, fats: 4.8, calories: 76, servingSize: '100g', servingUnit: 'g' },
  { id: 'tempeh', name: 'Tempeh', category: 'protein', protein: 19, carbs: 9.4, fats: 11, calories: 192, servingSize: '100g', servingUnit: 'g' },
  { id: 'paneer', name: 'Paneer', category: 'protein', protein: 18, carbs: 1.2, fats: 25, calories: 296, servingSize: '100g', servingUnit: 'g' },
  { id: 'chicken_thigh', name: 'Chicken Thigh', category: 'protein', protein: 26, carbs: 0, fats: 10.9, calories: 209, servingSize: '100g', servingUnit: 'g' },

  // ── GRAINS ──
  { id: 'white_rice', name: 'White Rice (cooked)', category: 'grains', protein: 2.7, carbs: 28, fats: 0.3, calories: 130, servingSize: '100g', servingUnit: 'g' },
  { id: 'brown_rice', name: 'Brown Rice (cooked)', category: 'grains', protein: 2.6, carbs: 23, fats: 0.9, calories: 111, servingSize: '100g', servingUnit: 'g' },
  { id: 'oats', name: 'Rolled Oats (dry)', category: 'grains', protein: 13, carbs: 67, fats: 7, calories: 389, servingSize: '100g', servingUnit: 'g' },
  { id: 'whole_wheat_bread', name: 'Whole Wheat Bread', category: 'grains', protein: 13, carbs: 43, fats: 3.4, calories: 247, servingSize: '100g', servingUnit: 'g' },
  { id: 'quinoa', name: 'Quinoa (cooked)', category: 'grains', protein: 4.4, carbs: 21, fats: 1.9, calories: 120, servingSize: '100g', servingUnit: 'g' },
  { id: 'pasta', name: 'Pasta (cooked)', category: 'grains', protein: 5, carbs: 31, fats: 0.9, calories: 157, servingSize: '100g', servingUnit: 'g' },
  { id: 'sweet_potato', name: 'Sweet Potato (baked)', category: 'grains', protein: 2, carbs: 20, fats: 0.1, calories: 90, servingSize: '100g', servingUnit: 'g' },
  { id: 'potato', name: 'Potato (baked)', category: 'grains', protein: 2.5, carbs: 21, fats: 0.1, calories: 93, servingSize: '100g', servingUnit: 'g' },
  { id: 'corn_tortilla', name: 'Corn Tortilla', category: 'grains', protein: 5.7, carbs: 44, fats: 3, calories: 218, servingSize: '100g', servingUnit: 'g' },
  { id: 'flour_tortilla', name: 'Flour Tortilla', category: 'grains', protein: 8.3, carbs: 50, fats: 7.4, calories: 306, servingSize: '100g', servingUnit: 'g' },
  { id: 'bagel', name: 'Plain Bagel', category: 'grains', protein: 10, carbs: 53, fats: 1.6, calories: 270, servingSize: '100g', servingUnit: 'g' },
  { id: 'granola', name: 'Granola', category: 'grains', protein: 8, carbs: 64, fats: 18, calories: 450, servingSize: '100g', servingUnit: 'g' },

  // ── DAIRY ──
  { id: 'whole_milk', name: 'Whole Milk', category: 'dairy', protein: 3.4, carbs: 4.8, fats: 3.6, calories: 61, servingSize: '100g', servingUnit: 'ml' },
  { id: 'skim_milk', name: 'Skim Milk', category: 'dairy', protein: 3.5, carbs: 5, fats: 0.1, calories: 35, servingSize: '100g', servingUnit: 'ml' },
  { id: 'cheddar_cheese', name: 'Cheddar Cheese', category: 'dairy', protein: 25, carbs: 1.3, fats: 33, calories: 403, servingSize: '100g', servingUnit: 'g' },
  { id: 'mozzarella', name: 'Mozzarella Cheese', category: 'dairy', protein: 22, carbs: 2.2, fats: 22, calories: 300, servingSize: '100g', servingUnit: 'g' },
  { id: 'butter', name: 'Butter', category: 'dairy', protein: 0.9, carbs: 0.1, fats: 81, calories: 717, servingSize: '100g', servingUnit: 'g' },
  { id: 'cream_cheese', name: 'Cream Cheese', category: 'dairy', protein: 6, carbs: 4, fats: 34, calories: 342, servingSize: '100g', servingUnit: 'g' },
  { id: 'yogurt', name: 'Plain Yogurt', category: 'dairy', protein: 3.5, carbs: 4.7, fats: 3.3, calories: 61, servingSize: '100g', servingUnit: 'g' },
  { id: 'parmesan', name: 'Parmesan Cheese', category: 'dairy', protein: 38, carbs: 4, fats: 29, calories: 431, servingSize: '100g', servingUnit: 'g' },

  // ── VEGETABLES ──
  { id: 'broccoli', name: 'Broccoli', category: 'vegetables', protein: 2.8, carbs: 7, fats: 0.4, calories: 34, servingSize: '100g', servingUnit: 'g' },
  { id: 'spinach', name: 'Spinach (raw)', category: 'vegetables', protein: 2.9, carbs: 3.6, fats: 0.4, calories: 23, servingSize: '100g', servingUnit: 'g' },
  { id: 'kale', name: 'Kale', category: 'vegetables', protein: 4.3, carbs: 8.8, fats: 0.9, calories: 49, servingSize: '100g', servingUnit: 'g' },
  { id: 'bell_pepper', name: 'Bell Pepper', category: 'vegetables', protein: 1, carbs: 6, fats: 0.3, calories: 31, servingSize: '100g', servingUnit: 'g' },
  { id: 'tomato', name: 'Tomato', category: 'vegetables', protein: 0.9, carbs: 3.9, fats: 0.2, calories: 18, servingSize: '100g', servingUnit: 'g' },
  { id: 'cucumber', name: 'Cucumber', category: 'vegetables', protein: 0.7, carbs: 3.6, fats: 0.1, calories: 15, servingSize: '100g', servingUnit: 'g' },
  { id: 'carrot', name: 'Carrot', category: 'vegetables', protein: 0.9, carbs: 10, fats: 0.2, calories: 41, servingSize: '100g', servingUnit: 'g' },
  { id: 'cauliflower', name: 'Cauliflower', category: 'vegetables', protein: 1.9, carbs: 5, fats: 0.3, calories: 25, servingSize: '100g', servingUnit: 'g' },
  { id: 'green_beans', name: 'Green Beans', category: 'vegetables', protein: 1.8, carbs: 7, fats: 0.1, calories: 31, servingSize: '100g', servingUnit: 'g' },
  { id: 'asparagus', name: 'Asparagus', category: 'vegetables', protein: 2.2, carbs: 3.9, fats: 0.1, calories: 20, servingSize: '100g', servingUnit: 'g' },
  { id: 'zucchini', name: 'Zucchini', category: 'vegetables', protein: 1.2, carbs: 3.1, fats: 0.3, calories: 17, servingSize: '100g', servingUnit: 'g' },
  { id: 'mushrooms', name: 'Mushrooms', category: 'vegetables', protein: 3.1, carbs: 3.3, fats: 0.3, calories: 22, servingSize: '100g', servingUnit: 'g' },
  { id: 'onion', name: 'Onion', category: 'vegetables', protein: 1.1, carbs: 9.3, fats: 0.1, calories: 40, servingSize: '100g', servingUnit: 'g' },

  // ── FRUITS ──
  { id: 'banana', name: 'Banana', category: 'fruits', protein: 1.1, carbs: 23, fats: 0.3, calories: 89, servingSize: '100g', servingUnit: 'g' },
  { id: 'apple', name: 'Apple', category: 'fruits', protein: 0.3, carbs: 14, fats: 0.2, calories: 52, servingSize: '100g', servingUnit: 'g' },
  { id: 'orange', name: 'Orange', category: 'fruits', protein: 0.9, carbs: 12, fats: 0.1, calories: 47, servingSize: '100g', servingUnit: 'g' },
  { id: 'strawberries', name: 'Strawberries', category: 'fruits', protein: 0.7, carbs: 7.7, fats: 0.3, calories: 32, servingSize: '100g', servingUnit: 'g' },
  { id: 'blueberries', name: 'Blueberries', category: 'fruits', protein: 0.7, carbs: 14, fats: 0.3, calories: 57, servingSize: '100g', servingUnit: 'g' },
  { id: 'mango', name: 'Mango', category: 'fruits', protein: 0.8, carbs: 15, fats: 0.4, calories: 60, servingSize: '100g', servingUnit: 'g' },
  { id: 'avocado', name: 'Avocado', category: 'fruits', protein: 2, carbs: 8.5, fats: 15, calories: 160, servingSize: '100g', servingUnit: 'g' },
  { id: 'grapes', name: 'Grapes', category: 'fruits', protein: 0.7, carbs: 18, fats: 0.2, calories: 69, servingSize: '100g', servingUnit: 'g' },
  { id: 'watermelon', name: 'Watermelon', category: 'fruits', protein: 0.6, carbs: 7.6, fats: 0.2, calories: 30, servingSize: '100g', servingUnit: 'g' },
  { id: 'pineapple', name: 'Pineapple', category: 'fruits', protein: 0.5, carbs: 13, fats: 0.1, calories: 50, servingSize: '100g', servingUnit: 'g' },
  { id: 'mixed_berries', name: 'Mixed Berries', category: 'fruits', protein: 0.7, carbs: 10, fats: 0.3, calories: 42, servingSize: '100g', servingUnit: 'g' },

  // ── SNACKS ──
  { id: 'almonds', name: 'Almonds', category: 'snacks', protein: 21, carbs: 22, fats: 49, calories: 579, servingSize: '100g', servingUnit: 'g' },
  { id: 'peanuts', name: 'Peanuts (roasted)', category: 'snacks', protein: 26, carbs: 16, fats: 49, calories: 567, servingSize: '100g', servingUnit: 'g' },
  { id: 'peanut_butter', name: 'Peanut Butter', category: 'snacks', protein: 25, carbs: 20, fats: 50, calories: 588, servingSize: '100g', servingUnit: 'g' },
  { id: 'dark_chocolate', name: 'Dark Chocolate (70%)', category: 'snacks', protein: 8, carbs: 46, fats: 43, calories: 598, servingSize: '100g', servingUnit: 'g' },
  { id: 'protein_bar', name: 'Protein Bar', category: 'snacks', protein: 20, carbs: 30, fats: 8, calories: 280, servingSize: '100g', servingUnit: 'g' },
  { id: 'rice_cake', name: 'Rice Cakes', category: 'snacks', protein: 7, carbs: 82, fats: 2.8, calories: 387, servingSize: '100g', servingUnit: 'g' },
  { id: 'trail_mix', name: 'Trail Mix', category: 'snacks', protein: 14, carbs: 45, fats: 29, calories: 462, servingSize: '100g', servingUnit: 'g' },
  { id: 'hummus', name: 'Hummus', category: 'snacks', protein: 8, carbs: 14, fats: 10, calories: 166, servingSize: '100g', servingUnit: 'g' },
  { id: 'cashews', name: 'Cashews', category: 'snacks', protein: 18, carbs: 30, fats: 44, calories: 553, servingSize: '100g', servingUnit: 'g' },

  // ── BEVERAGES ──
  { id: 'orange_juice', name: 'Orange Juice', category: 'beverages', protein: 0.7, carbs: 10, fats: 0.2, calories: 45, servingSize: '100g', servingUnit: 'ml' },
  { id: 'coconut_water', name: 'Coconut Water', category: 'beverages', protein: 0.7, carbs: 3.7, fats: 0.2, calories: 19, servingSize: '100g', servingUnit: 'ml' },
  { id: 'almond_milk', name: 'Almond Milk (unsweetened)', category: 'beverages', protein: 0.6, carbs: 0.3, fats: 1.1, calories: 15, servingSize: '100g', servingUnit: 'ml' },
  { id: 'coffee_black', name: 'Black Coffee', category: 'beverages', protein: 0.1, carbs: 0, fats: 0, calories: 2, servingSize: '100g', servingUnit: 'ml' },
  { id: 'green_tea', name: 'Green Tea', category: 'beverages', protein: 0, carbs: 0, fats: 0, calories: 1, servingSize: '100g', servingUnit: 'ml' },
  { id: 'milk_shake', name: 'Protein Shake (whey + milk)', category: 'beverages', protein: 15, carbs: 10, fats: 3, calories: 130, servingSize: '100g', servingUnit: 'ml' },

  // ── LEGUMES ──
  { id: 'chickpeas', name: 'Chickpeas (cooked)', category: 'legumes', protein: 9, carbs: 27, fats: 2.6, calories: 164, servingSize: '100g', servingUnit: 'g' },
  { id: 'lentils', name: 'Lentils (cooked)', category: 'legumes', protein: 9, carbs: 20, fats: 0.4, calories: 116, servingSize: '100g', servingUnit: 'g' },
  { id: 'black_beans', name: 'Black Beans (cooked)', category: 'legumes', protein: 9, carbs: 24, fats: 0.5, calories: 132, servingSize: '100g', servingUnit: 'g' },
  { id: 'kidney_beans', name: 'Kidney Beans (cooked)', category: 'legumes', protein: 9, carbs: 22, fats: 0.5, calories: 127, servingSize: '100g', servingUnit: 'g' },
  { id: 'edamame', name: 'Edamame', category: 'legumes', protein: 11, carbs: 10, fats: 5, calories: 121, servingSize: '100g', servingUnit: 'g' },
  { id: 'dal', name: 'Dal (moong, cooked)', category: 'legumes', protein: 7, carbs: 12, fats: 0.4, calories: 82, servingSize: '100g', servingUnit: 'g' },
  { id: 'rajma', name: 'Rajma (cooked)', category: 'legumes', protein: 8.7, carbs: 23, fats: 0.5, calories: 127, servingSize: '100g', servingUnit: 'g' },

  // ── OILS/FATS ──
  { id: 'olive_oil', name: 'Olive Oil', category: 'fats & oils', protein: 0, carbs: 0, fats: 100, calories: 884, servingSize: '100g', servingUnit: 'ml' },
  { id: 'coconut_oil', name: 'Coconut Oil', category: 'fats & oils', protein: 0, carbs: 0, fats: 99, calories: 862, servingSize: '100g', servingUnit: 'ml' },
  { id: 'honey', name: 'Honey', category: 'fats & oils', protein: 0.3, carbs: 82, fats: 0, calories: 304, servingSize: '100g', servingUnit: 'g' },
];

export default foods;

export const FOOD_CATEGORIES = [...new Set(foods.map(f => f.category))];

export function getFoodsByCategory(category) {
  return foods.filter(f => f.category === category);
}

export function searchFoods(query) {
  const q = query.toLowerCase().trim();
  if (!q) return foods.slice(0, 20);
  return foods.filter(f => f.name.toLowerCase().includes(q));
}

export function getFoodById(id) {
  return foods.find(f => f.id === id) || null;
}
