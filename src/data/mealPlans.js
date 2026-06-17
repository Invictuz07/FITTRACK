const mealPlans = [
  // ── 1500 kcal ──
  {
    id: 'plan_1500_nonveg', name: 'Lean Cut 1500', targetCalories: 1500, type: 'non-veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'egg_whites', amount: 200, unit: 'g' }, { foodId: 'whole_wheat_bread', amount: 50, unit: 'g' }, { foodId: 'coffee_black', amount: 200, unit: 'ml' }] },
      { name: 'Lunch', foods: [{ foodId: 'chicken_breast', amount: 150, unit: 'g' }, { foodId: 'brown_rice', amount: 100, unit: 'g' }, { foodId: 'broccoli', amount: 100, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'banana', amount: 100, unit: 'g' }, { foodId: 'coffee_black', amount: 200, unit: 'ml' }] },
      { name: 'Dinner', foods: [{ foodId: 'salmon', amount: 120, unit: 'g' }, { foodId: 'sweet_potato', amount: 100, unit: 'g' }, { foodId: 'spinach', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'greek_yogurt', amount: 150, unit: 'g' }] },
    ]
  },
  {
    id: 'plan_1500_veg', name: 'Plant Lean 1500', targetCalories: 1500, type: 'veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 50, unit: 'g' }, { foodId: 'almond_milk', amount: 200, unit: 'ml' }, { foodId: 'banana', amount: 80, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'lentils', amount: 150, unit: 'g' }, { foodId: 'brown_rice', amount: 80, unit: 'g' }, { foodId: 'spinach', amount: 80, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'apple', amount: 150, unit: 'g' }, { foodId: 'peanut_butter', amount: 15, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'tofu', amount: 150, unit: 'g' }, { foodId: 'quinoa', amount: 100, unit: 'g' }, { foodId: 'broccoli', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'almonds', amount: 20, unit: 'g' }] },
    ]
  },

  // ── 1800 kcal ──
  {
    id: 'plan_1800_nonveg', name: 'Balanced 1800', targetCalories: 1800, type: 'non-veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'eggs', amount: 100, unit: 'g' }, { foodId: 'oats', amount: 50, unit: 'g' }, { foodId: 'banana', amount: 100, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'chicken_breast', amount: 150, unit: 'g' }, { foodId: 'white_rice', amount: 150, unit: 'g' }, { foodId: 'bell_pepper', amount: 80, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 30, unit: 'g' }, { foodId: 'banana', amount: 100, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'beef_lean', amount: 130, unit: 'g' }, { foodId: 'sweet_potato', amount: 150, unit: 'g' }, { foodId: 'asparagus', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'almonds', amount: 25, unit: 'g' }, { foodId: 'greek_yogurt', amount: 100, unit: 'g' }] },
    ]
  },
  {
    id: 'plan_1800_veg', name: 'Plant Power 1800', targetCalories: 1800, type: 'veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 60, unit: 'g' }, { foodId: 'whole_milk', amount: 200, unit: 'ml' }, { foodId: 'honey', amount: 15, unit: 'g' }, { foodId: 'mixed_berries', amount: 80, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'chickpeas', amount: 150, unit: 'g' }, { foodId: 'brown_rice', amount: 120, unit: 'g' }, { foodId: 'tomato', amount: 100, unit: 'g' }, { foodId: 'onion', amount: 50, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'peanut_butter', amount: 20, unit: 'g' }, { foodId: 'whole_wheat_bread', amount: 50, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'paneer', amount: 100, unit: 'g' }, { foodId: 'quinoa', amount: 120, unit: 'g' }, { foodId: 'broccoli', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'almonds', amount: 30, unit: 'g' }] },
    ]
  },

  // ── 2000 kcal ──
  {
    id: 'plan_2000_nonveg', name: 'Standard 2000', targetCalories: 2000, type: 'non-veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 60, unit: 'g' }, { foodId: 'eggs', amount: 100, unit: 'g' }, { foodId: 'banana', amount: 120, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'chicken_breast', amount: 180, unit: 'g' }, { foodId: 'white_rice', amount: 180, unit: 'g' }, { foodId: 'broccoli', amount: 100, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 30, unit: 'g' }, { foodId: 'banana', amount: 100, unit: 'g' }, { foodId: 'peanut_butter', amount: 15, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'salmon', amount: 150, unit: 'g' }, { foodId: 'sweet_potato', amount: 150, unit: 'g' }, { foodId: 'asparagus', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'greek_yogurt', amount: 150, unit: 'g' }, { foodId: 'almonds', amount: 25, unit: 'g' }] },
    ]
  },
  {
    id: 'plan_2000_veg', name: 'Green Fuel 2000', targetCalories: 2000, type: 'veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 70, unit: 'g' }, { foodId: 'whole_milk', amount: 200, unit: 'ml' }, { foodId: 'banana', amount: 100, unit: 'g' }, { foodId: 'honey', amount: 15, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'dal', amount: 200, unit: 'g' }, { foodId: 'white_rice', amount: 180, unit: 'g' }, { foodId: 'cucumber', amount: 100, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'peanut_butter', amount: 25, unit: 'g' }, { foodId: 'whole_wheat_bread', amount: 60, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'paneer', amount: 120, unit: 'g' }, { foodId: 'brown_rice', amount: 120, unit: 'g' }, { foodId: 'bell_pepper', amount: 100, unit: 'g' }, { foodId: 'onion', amount: 50, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'cashews', amount: 30, unit: 'g' }, { foodId: 'yogurt', amount: 150, unit: 'g' }] },
    ]
  },

  // ── 2200 kcal ──
  {
    id: 'plan_2200_nonveg', name: 'Performance 2200', targetCalories: 2200, type: 'non-veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 80, unit: 'g' }, { foodId: 'eggs', amount: 150, unit: 'g' }, { foodId: 'whole_wheat_bread', amount: 50, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'chicken_breast', amount: 200, unit: 'g' }, { foodId: 'white_rice', amount: 200, unit: 'g' }, { foodId: 'broccoli', amount: 100, unit: 'g' }, { foodId: 'olive_oil', amount: 5, unit: 'ml' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 30, unit: 'g' }, { foodId: 'banana', amount: 120, unit: 'g' }, { foodId: 'oats', amount: 30, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'beef_lean', amount: 180, unit: 'g' }, { foodId: 'sweet_potato', amount: 200, unit: 'g' }, { foodId: 'green_beans', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'peanut_butter', amount: 25, unit: 'g' }, { foodId: 'apple', amount: 150, unit: 'g' }] },
    ]
  },
  {
    id: 'plan_2200_veg', name: 'Plant Build 2200', targetCalories: 2200, type: 'veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 80, unit: 'g' }, { foodId: 'whole_milk', amount: 250, unit: 'ml' }, { foodId: 'banana', amount: 120, unit: 'g' }, { foodId: 'peanut_butter', amount: 20, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'rajma', amount: 200, unit: 'g' }, { foodId: 'white_rice', amount: 200, unit: 'g' }, { foodId: 'yogurt', amount: 100, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 30, unit: 'g' }, { foodId: 'banana', amount: 100, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'paneer', amount: 150, unit: 'g' }, { foodId: 'quinoa', amount: 150, unit: 'g' }, { foodId: 'spinach', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'trail_mix', amount: 40, unit: 'g' }, { foodId: 'orange', amount: 150, unit: 'g' }] },
    ]
  },

  // ── 2500 kcal ──
  {
    id: 'plan_2500_nonveg', name: 'Bulk Mode 2500', targetCalories: 2500, type: 'non-veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 80, unit: 'g' }, { foodId: 'eggs', amount: 150, unit: 'g' }, { foodId: 'whole_wheat_bread', amount: 80, unit: 'g' }, { foodId: 'peanut_butter', amount: 20, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'chicken_thigh', amount: 200, unit: 'g' }, { foodId: 'white_rice', amount: 250, unit: 'g' }, { foodId: 'broccoli', amount: 100, unit: 'g' }, { foodId: 'olive_oil', amount: 10, unit: 'ml' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 35, unit: 'g' }, { foodId: 'banana', amount: 150, unit: 'g' }, { foodId: 'granola', amount: 30, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'salmon', amount: 200, unit: 'g' }, { foodId: 'pasta', amount: 200, unit: 'g' }, { foodId: 'bell_pepper', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'almonds', amount: 40, unit: 'g' }, { foodId: 'greek_yogurt', amount: 200, unit: 'g' }, { foodId: 'honey', amount: 15, unit: 'g' }] },
    ]
  },
  {
    id: 'plan_2500_veg', name: 'Green Bulk 2500', targetCalories: 2500, type: 'veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 100, unit: 'g' }, { foodId: 'whole_milk', amount: 300, unit: 'ml' }, { foodId: 'peanut_butter', amount: 30, unit: 'g' }, { foodId: 'banana', amount: 120, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'chickpeas', amount: 200, unit: 'g' }, { foodId: 'white_rice', amount: 250, unit: 'g' }, { foodId: 'paneer', amount: 80, unit: 'g' }, { foodId: 'tomato', amount: 80, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 35, unit: 'g' }, { foodId: 'banana', amount: 100, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'tempeh', amount: 150, unit: 'g' }, { foodId: 'pasta', amount: 200, unit: 'g' }, { foodId: 'mushrooms', amount: 100, unit: 'g' }, { foodId: 'olive_oil', amount: 10, unit: 'ml' }] },
      { name: 'Snack', foods: [{ foodId: 'trail_mix', amount: 50, unit: 'g' }, { foodId: 'whole_milk', amount: 200, unit: 'ml' }] },
    ]
  },

  // ── 3000 kcal ──
  {
    id: 'plan_3000_nonveg', name: 'Mass Gain 3000', targetCalories: 3000, type: 'non-veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 100, unit: 'g' }, { foodId: 'eggs', amount: 200, unit: 'g' }, { foodId: 'whole_wheat_bread', amount: 100, unit: 'g' }, { foodId: 'peanut_butter', amount: 30, unit: 'g' }, { foodId: 'banana', amount: 120, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'chicken_thigh', amount: 250, unit: 'g' }, { foodId: 'white_rice', amount: 300, unit: 'g' }, { foodId: 'broccoli', amount: 100, unit: 'g' }, { foodId: 'olive_oil', amount: 10, unit: 'ml' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 40, unit: 'g' }, { foodId: 'banana', amount: 150, unit: 'g' }, { foodId: 'oats', amount: 40, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'ground_beef', amount: 250, unit: 'g' }, { foodId: 'pasta', amount: 250, unit: 'g' }, { foodId: 'mozzarella', amount: 40, unit: 'g' }, { foodId: 'tomato', amount: 100, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'almonds', amount: 50, unit: 'g' }, { foodId: 'greek_yogurt', amount: 250, unit: 'g' }, { foodId: 'honey', amount: 20, unit: 'g' }, { foodId: 'granola', amount: 30, unit: 'g' }] },
    ]
  },
  {
    id: 'plan_3000_veg', name: 'Plant Mass 3000', targetCalories: 3000, type: 'veg',
    meals: [
      { name: 'Breakfast', foods: [{ foodId: 'oats', amount: 120, unit: 'g' }, { foodId: 'whole_milk', amount: 300, unit: 'ml' }, { foodId: 'peanut_butter', amount: 40, unit: 'g' }, { foodId: 'banana', amount: 150, unit: 'g' }, { foodId: 'honey', amount: 20, unit: 'g' }] },
      { name: 'Lunch', foods: [{ foodId: 'dal', amount: 250, unit: 'g' }, { foodId: 'white_rice', amount: 300, unit: 'g' }, { foodId: 'paneer', amount: 100, unit: 'g' }, { foodId: 'yogurt', amount: 100, unit: 'g' }] },
      { name: 'Pre-Workout', foods: [{ foodId: 'whey_protein', amount: 40, unit: 'g' }, { foodId: 'banana', amount: 120, unit: 'g' }, { foodId: 'oats', amount: 40, unit: 'g' }] },
      { name: 'Dinner', foods: [{ foodId: 'rajma', amount: 250, unit: 'g' }, { foodId: 'quinoa', amount: 200, unit: 'g' }, { foodId: 'avocado', amount: 100, unit: 'g' }, { foodId: 'onion', amount: 50, unit: 'g' }] },
      { name: 'Snack', foods: [{ foodId: 'trail_mix', amount: 60, unit: 'g' }, { foodId: 'whole_milk', amount: 300, unit: 'ml' }, { foodId: 'dark_chocolate', amount: 30, unit: 'g' }] },
    ]
  },
];

export default mealPlans;

export function getMealPlansByCalories(target) {
  return mealPlans.filter(p => Math.abs(p.targetCalories - target) <= 200);
}

export function getMealPlansByType(type) {
  return mealPlans.filter(p => p.type === type);
}

export function getMealPlanById(id) {
  return mealPlans.find(p => p.id === id) || null;
}
