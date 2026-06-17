/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation.
 * @param {number} weight  - Body weight in kg
 * @param {number} height  - Height in cm
 * @param {number} age     - Age in years
 * @param {string} gender  - 'male' or 'female'
 * @returns {number} BMR in kcal/day (rounded)
 */
export function calculateBMR(weight, height, age, gender) {
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return Math.max(500, Math.round(bmr));
}

/**
 * Calculate Total Daily Energy Expenditure.
 * @param {number} bmr                - Basal Metabolic Rate
 * @param {number} activityMultiplier - Activity level multiplier (e.g. 1.2–1.9)
 * @returns {number} TDEE in kcal/day (rounded)
 */
export function calculateTDEE(bmr, activityMultiplier) {
  return Math.max(500, Math.round(bmr * activityMultiplier));
}

/**
 * Calculate target calories based on fitness goal.
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - 'lose' | 'muscle' | 'recomp' | 'maintain'
 * @returns {number} Target calories (rounded)
 */
export function calculateTargetCalories(tdee, goal) {
  let target = tdee;
  switch (goal) {
    case 'lose':     target = tdee - 500; break;
    case 'muscle':   target = tdee + 300; break;
    case 'recomp':   target = tdee - 250; break;
    case 'maintain':
    default:         target = tdee; break;
  }
  return Math.max(1200, Math.round(target));
}

/**
 * Calculate macronutrient targets.
 * Protein g/kg varies by goal; remaining calories split 30% fat / 70% carbs.
 * @param {number} targetCalories - Daily calorie target
 * @param {number} weight         - Body weight in kg
 * @param {string} goal           - 'lose' | 'muscle' | 'recomp' | 'maintain'
 * @returns {{ protein: number, carbs: number, fats: number }} grams per day
 */
export function calculateMacros(targetCalories, weight, goal) {
  const proteinPerKg = {
    lose: 2.2,
    muscle: 2.0,
    recomp: 2.4,
    maintain: 1.6
  };

  const protein = Math.round((proteinPerKg[goal] || proteinPerKg.maintain) * weight);
  const proteinCalories = protein * 4;
  const remaining = Math.max(0, targetCalories - proteinCalories);

  const fats = Math.max(0, Math.round((remaining * 0.3) / 9));
  const carbs = Math.max(0, Math.round((remaining * 0.7) / 4));

  return {
    protein: Math.max(10, protein),
    carbs: Math.max(10, carbs),
    fats: Math.max(5, fats)
  };
}

/**
 * Calculate Body Mass Index.
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI to 1 decimal place
 */
export function calculateBMI(weight, height) {
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

/**
 * Calculate all stats from a user data object.
 * @param {{ weight: number, height: number, age: number, gender: string, activityLevel: number, goal: string }} userData
 * @returns {{ bmr: number, tdee: number, targetCalories: number, macros: { protein: number, carbs: number, fats: number }, bmi: number }}
 */
export function calculateAllStats(userData) {
  const { weight, height, age, gender, activityLevel, goal } = userData;

  const bmr            = calculateBMR(weight, height, age, gender);
  const tdee           = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const macros         = calculateMacros(targetCalories, weight, goal);
  const bmi            = calculateBMI(weight, height);

  return { bmr, tdee, targetCalories, macros, bmi };
}

/**
 * Convert weight between kg and lbs.
 * @param {number} value - Weight value
 * @param {string} from  - 'kg' or 'lbs'
 * @param {string} to    - 'kg' or 'lbs'
 * @returns {number} Converted weight (2 decimal places)
 */
export function convertWeight(value, from, to) {
  if (from === to) return value;
  if (from === 'kg' && to === 'lbs') return Math.round(value * 2.20462 * 100) / 100;
  if (from === 'lbs' && to === 'kg') return Math.round((value / 2.20462) * 100) / 100;
  return value;
}

/**
 * Convert height between cm and ft/in.
 * @param {number} value - Height value (cm or total inches when from='ft')
 * @param {string} from  - 'cm' or 'ft'
 * @param {string} to    - 'cm' or 'ft'
 * @returns {number | { feet: number, inches: number }} Converted height
 */
export function convertHeight(value, from, to) {
  if (from === to) return value;

  if (from === 'cm' && to === 'ft') {
    const totalInches = value / 2.54;
    return {
      feet:   Math.floor(totalInches / 12),
      inches: Math.round(totalInches % 12)
    };
  }

  if (from === 'ft' && to === 'cm') {
    // value is expected as total inches, or as an object { feet, inches }
    let totalInches;
    if (typeof value === 'object' && value.feet !== undefined) {
      totalInches = (value.feet * 12) + (value.inches || 0);
    } else {
      totalInches = value;
    }
    return Math.round(totalInches * 2.54);
  }

  return value;
}
