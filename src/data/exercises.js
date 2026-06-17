const exercises = [
  // ── CHEST ──
  { id: 'bench_press', name: 'Barbell Bench Press', muscle: 'chest', equipment: 'barbell', difficulty: 'intermediate', description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width, lower to chest and press up.', tips: 'Keep feet flat, arch upper back slightly, squeeze shoulder blades together.' },
  { id: 'incline_bench_press', name: 'Incline Bench Press', muscle: 'chest', equipment: 'barbell', difficulty: 'intermediate', description: 'Set bench to 30-45 degree incline, press barbell from upper chest.', tips: 'Focus on upper chest contraction, don\'t flare elbows excessively.' },
  { id: 'decline_bench_press', name: 'Decline Bench Press', muscle: 'chest', equipment: 'barbell', difficulty: 'intermediate', description: 'Set bench to decline, press barbell from lower chest.', tips: 'Use a spotter, keep controlled tempo throughout.' },
  { id: 'dumbbell_fly', name: 'Dumbbell Fly', muscle: 'chest', equipment: 'dumbbell', difficulty: 'beginner', description: 'Lie flat, hold dumbbells above chest with slight elbow bend, lower in an arc to sides.', tips: 'Keep slight bend in elbows, feel the stretch at the bottom.' },
  { id: 'cable_crossover', name: 'Cable Crossover', muscle: 'chest', equipment: 'cable', difficulty: 'intermediate', description: 'Stand between cable stations, bring handles together in front of chest.', tips: 'Lean slightly forward, cross hands at bottom for full contraction.' },
  { id: 'push_ups', name: 'Push-Ups', muscle: 'chest', equipment: 'bodyweight', difficulty: 'beginner', description: 'Standard push-up from plank position, lower chest to floor and press up.', tips: 'Keep core tight, full range of motion, elbows at 45 degrees.' },
  { id: 'dumbbell_press_flat', name: 'Flat Dumbbell Press', muscle: 'chest', equipment: 'dumbbell', difficulty: 'beginner', description: 'Lie flat, press dumbbells from chest level to lockout.', tips: 'Allows greater range of motion than barbell, squeeze at top.' },
  { id: 'dumbbell_press_incline', name: 'Incline Dumbbell Press', muscle: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', description: 'Set bench to 30-45 degrees, press dumbbells from upper chest.', tips: 'Great for upper chest development, use controlled tempo.' },

  // ── BACK ──
  { id: 'deadlift', name: 'Deadlift', muscle: 'back', equipment: 'barbell', difficulty: 'advanced', description: 'Hinge at hips, grip barbell, stand up by driving through heels.', tips: 'Keep back flat, bar close to body, engage lats throughout.' },
  { id: 'bent_over_row', name: 'Bent-Over Barbell Row', muscle: 'back', equipment: 'barbell', difficulty: 'intermediate', description: 'Bend at hips, pull barbell to lower chest/upper abdomen.', tips: 'Keep back flat, squeeze shoulder blades at top.' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'back', equipment: 'cable', difficulty: 'beginner', description: 'Sit at lat pulldown machine, pull bar to upper chest.', tips: 'Lead with elbows, lean back slightly, squeeze lats at bottom.' },
  { id: 'pull_ups', name: 'Pull-Ups', muscle: 'back', equipment: 'bodyweight', difficulty: 'advanced', description: 'Hang from bar with overhand grip, pull chin above bar.', tips: 'Full extension at bottom, lead with chest, controlled descent.' },
  { id: 'cable_row', name: 'Seated Cable Row', muscle: 'back', equipment: 'cable', difficulty: 'beginner', description: 'Sit at cable row station, pull handle to midsection.', tips: 'Keep chest up, squeeze shoulder blades together at contraction.' },
  { id: 'tbar_row', name: 'T-Bar Row', muscle: 'back', equipment: 'barbell', difficulty: 'intermediate', description: 'Straddle T-bar, pull weight to chest with both hands.', tips: 'Keep torso stable, great for thickness development.' },
  { id: 'face_pulls', name: 'Face Pulls', muscle: 'back', equipment: 'cable', difficulty: 'beginner', description: 'Pull cable rope attachment toward face, externally rotating shoulders.', tips: 'Great for rear delts and rotator cuff health, high reps.' },
  { id: 'single_arm_row', name: 'Single Arm Dumbbell Row', muscle: 'back', equipment: 'dumbbell', difficulty: 'beginner', description: 'One knee on bench, row dumbbell to hip with opposite arm.', tips: 'Keep back flat, pull to hip, squeeze at top.' },

  // ── SHOULDERS ──
  { id: 'overhead_press', name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', description: 'Press barbell from front of shoulders to overhead lockout.', tips: 'Brace core, don\'t lean back excessively, full lockout.' },
  { id: 'lateral_raises', name: 'Lateral Raises', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', description: 'Raise dumbbells to sides until arms are parallel to floor.', tips: 'Slight bend in elbows, lead with elbows, controlled descent.' },
  { id: 'front_raises', name: 'Front Raises', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', description: 'Raise dumbbells in front to shoulder height.', tips: 'Alternate arms or both together, don\'t swing.' },
  { id: 'rear_delt_fly', name: 'Rear Delt Fly', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', description: 'Bend forward, raise dumbbells to sides targeting rear delts.', tips: 'Keep torso parallel to floor, squeeze at top.' },
  { id: 'arnold_press', name: 'Arnold Press', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', description: 'Start palms facing you, rotate and press overhead.', tips: 'Smooth rotation, hits all three delt heads.' },
  { id: 'shrugs', name: 'Barbell Shrugs', muscle: 'shoulders', equipment: 'barbell', difficulty: 'beginner', description: 'Hold barbell at thighs, shrug shoulders straight up.', tips: 'Hold at top for 1-2 seconds, heavy weight okay.' },

  // ── BICEPS ──
  { id: 'barbell_curl', name: 'Barbell Curl', muscle: 'biceps', equipment: 'barbell', difficulty: 'beginner', description: 'Curl barbell from thighs to shoulders with strict form.', tips: 'Keep elbows pinned to sides, don\'t swing.' },
  { id: 'dumbbell_curl', name: 'Dumbbell Curl', muscle: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', description: 'Alternate curling dumbbells with supinated grip.', tips: 'Full extension at bottom, squeeze at top.' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', description: 'Curl dumbbells with neutral (palms facing) grip.', tips: 'Targets brachialis and brachioradialis, builds arm thickness.' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscle: 'biceps', equipment: 'barbell', difficulty: 'intermediate', description: 'Curl barbell on preacher bench for strict isolation.', tips: 'Don\'t fully extend at bottom to keep tension, controlled negative.' },
  { id: 'concentration_curl', name: 'Concentration Curl', muscle: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', description: 'Sit, brace elbow on inner thigh, curl dumbbell.', tips: 'Peak contraction at top, slow eccentric.' },

  // ── TRICEPS ──
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscle: 'triceps', equipment: 'cable', difficulty: 'beginner', description: 'Push cable attachment down until arms are fully extended.', tips: 'Keep elbows at sides, squeeze at full extension.' },
  { id: 'skull_crushers', name: 'Skull Crushers', muscle: 'triceps', equipment: 'barbell', difficulty: 'intermediate', description: 'Lie flat, lower barbell to forehead then extend.', tips: 'Keep upper arms vertical, use EZ bar for wrist comfort.' },
  { id: 'overhead_extension', name: 'Overhead Tricep Extension', muscle: 'triceps', equipment: 'dumbbell', difficulty: 'beginner', description: 'Hold dumbbell overhead with both hands, lower behind head.', tips: 'Keep elbows close to head, full stretch at bottom.' },
  { id: 'dips', name: 'Dips', muscle: 'triceps', equipment: 'bodyweight', difficulty: 'intermediate', description: 'Support body on parallel bars, lower and press up.', tips: 'Lean forward for chest focus, stay upright for triceps.' },
  { id: 'close_grip_bench', name: 'Close-Grip Bench Press', muscle: 'triceps', equipment: 'barbell', difficulty: 'intermediate', description: 'Bench press with hands shoulder-width apart.', tips: 'Keep elbows tucked, great compound tricep movement.' },

  // ── LEGS ──
  { id: 'squat', name: 'Barbell Squat', muscle: 'legs', equipment: 'barbell', difficulty: 'intermediate', description: 'Bar on upper back, squat down until thighs are parallel.', tips: 'Keep chest up, knees tracking over toes, brace core.' },
  { id: 'leg_press', name: 'Leg Press', muscle: 'legs', equipment: 'machine', difficulty: 'beginner', description: 'Push platform away using legs on the leg press machine.', tips: 'Don\'t lock knees at top, control the descent.' },
  { id: 'lunges', name: 'Walking Lunges', muscle: 'legs', equipment: 'dumbbell', difficulty: 'beginner', description: 'Step forward into lunge, alternate legs walking forward.', tips: 'Keep torso upright, front knee stays behind toes.' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell', difficulty: 'intermediate', description: 'Hinge at hips with slight knee bend, lower bar along legs.', tips: 'Feel hamstring stretch, keep bar close to body.' },
  { id: 'leg_curl', name: 'Lying Leg Curl', muscle: 'legs', equipment: 'machine', difficulty: 'beginner', description: 'Lie face down, curl weight toward glutes.', tips: 'Don\'t lift hips, squeeze at top contraction.' },
  { id: 'leg_extension', name: 'Leg Extension', muscle: 'legs', equipment: 'machine', difficulty: 'beginner', description: 'Sit on machine, extend legs to full lockout.', tips: 'Controlled movement, pause at top, great for quad isolation.' },
  { id: 'calf_raises', name: 'Standing Calf Raises', muscle: 'legs', equipment: 'machine', difficulty: 'beginner', description: 'Rise up on toes, lower below parallel for full stretch.', tips: 'Full range of motion, hold at top, high rep ranges work best.' },
  { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscle: 'legs', equipment: 'dumbbell', difficulty: 'intermediate', description: 'Rear foot elevated on bench, squat down on front leg.', tips: 'Keep torso upright, great for unilateral leg development.' },

  // ── CORE ──
  { id: 'crunches', name: 'Crunches', muscle: 'core', equipment: 'bodyweight', difficulty: 'beginner', description: 'Lie on back, curl upper body toward knees.', tips: 'Don\'t pull on neck, focus on abdominal contraction.' },
  { id: 'plank', name: 'Plank', muscle: 'core', equipment: 'bodyweight', difficulty: 'beginner', description: 'Hold push-up position on forearms, body straight.', tips: 'Don\'t let hips sag or pike up, breathe steadily.' },
  { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'core', equipment: 'bodyweight', difficulty: 'advanced', description: 'Hang from bar, raise legs to parallel or above.', tips: 'Minimize swinging, control the descent.' },
  { id: 'russian_twist', name: 'Russian Twist', muscle: 'core', equipment: 'bodyweight', difficulty: 'beginner', description: 'Sit with legs raised, rotate torso side to side.', tips: 'Hold weight for added difficulty, keep feet off floor.' },
  { id: 'cable_woodchop', name: 'Cable Woodchop', muscle: 'core', equipment: 'cable', difficulty: 'intermediate', description: 'Rotate torso pulling cable from high to low diagonally.', tips: 'Rotate through core, not arms. Control both directions.' },

  // ── CARDIO ──
  { id: 'running', name: 'Running', muscle: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', description: 'Steady state or interval running for cardiovascular fitness.', tips: 'Start with walk/run intervals, gradually increase duration.' },
  { id: 'cycling', name: 'Cycling', muscle: 'cardio', equipment: 'machine', difficulty: 'beginner', description: 'Stationary or outdoor cycling for endurance.', tips: 'Adjust seat height properly, mix steady-state with intervals.' },
  { id: 'jump_rope', name: 'Jump Rope', muscle: 'cardio', equipment: 'bodyweight', difficulty: 'intermediate', description: 'Skip rope for cardiovascular conditioning and coordination.', tips: 'Start with basic bounce, keep wrists relaxed, land softly.' },
  { id: 'rowing_machine', name: 'Rowing Machine', muscle: 'cardio', equipment: 'machine', difficulty: 'beginner', description: 'Full body rowing movement on ergometer.', tips: 'Drive with legs first, then pull with back, arms last.' },
  { id: 'burpees', name: 'Burpees', muscle: 'cardio', equipment: 'bodyweight', difficulty: 'intermediate', description: 'Squat down, kick back to plank, push-up, jump up.', tips: 'Full body conditioning, maintain form even when fatigued.' },
];

export default exercises;

export const MUSCLE_GROUPS = [...new Set(exercises.map(e => e.muscle))];

export function getExercisesByMuscle(muscle) {
  return exercises.filter(e => e.muscle === muscle);
}

export function getExerciseById(id) {
  return exercises.find(e => e.id === id) || null;
}
