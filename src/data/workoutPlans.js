import { getExerciseById } from './exercises.js';

const workoutPlans = {
  ppl: {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    description: 'The classic 6-day split for balanced hypertrophy. Each muscle group hit twice per week.',
    daysPerWeek: 6,
    schedule: [
      { day: 'Day 1', label: 'Push A', focus: 'Chest, Shoulders, Triceps', exercises: [
        { exerciseId: 'bench_press', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'incline_bench_press', sets: 3, reps: '8-12', rest: 90 },
        { exerciseId: 'overhead_press', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'lateral_raises', sets: 4, reps: '12-15', rest: 60 },
        { exerciseId: 'tricep_pushdown', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'overhead_extension', sets: 3, reps: '10-12', rest: 60 },
      ]},
      { day: 'Day 2', label: 'Pull A', focus: 'Back, Biceps', exercises: [
        { exerciseId: 'deadlift', sets: 4, reps: '5-6', rest: 180 },
        { exerciseId: 'lat_pulldown', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'bent_over_row', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'face_pulls', sets: 3, reps: '15-20', rest: 60 },
        { exerciseId: 'barbell_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'hammer_curl', sets: 3, reps: '10-12', rest: 60 },
      ]},
      { day: 'Day 3', label: 'Legs A', focus: 'Quads, Hamstrings, Calves', exercises: [
        { exerciseId: 'squat', sets: 4, reps: '6-8', rest: 180 },
        { exerciseId: 'leg_press', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'romanian_deadlift', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'leg_extension', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'leg_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'calf_raises', sets: 4, reps: '15-20', rest: 60 },
      ]},
      { day: 'Day 4', label: 'Push B', focus: 'Chest, Shoulders, Triceps', exercises: [
        { exerciseId: 'dumbbell_press_flat', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'dumbbell_press_incline', sets: 3, reps: '8-12', rest: 90 },
        { exerciseId: 'arnold_press', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'cable_crossover', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'skull_crushers', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'dips', sets: 3, reps: '8-12', rest: 60 },
      ]},
      { day: 'Day 5', label: 'Pull B', focus: 'Back, Biceps', exercises: [
        { exerciseId: 'pull_ups', sets: 4, reps: '6-10', rest: 120 },
        { exerciseId: 'cable_row', sets: 4, reps: '10-12', rest: 90 },
        { exerciseId: 'tbar_row', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'single_arm_row', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'dumbbell_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'concentration_curl', sets: 3, reps: '12-15', rest: 60 },
      ]},
      { day: 'Day 6', label: 'Legs B', focus: 'Quads, Glutes, Calves', exercises: [
        { exerciseId: 'leg_press', sets: 4, reps: '8-10', rest: 120 },
        { exerciseId: 'bulgarian_split_squat', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'lunges', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'leg_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'leg_extension', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'calf_raises', sets: 4, reps: '15-20', rest: 60 },
      ]},
      { day: 'Day 7', label: 'Rest', focus: 'Recovery', exercises: [] },
    ]
  },

  upper_lower: {
    id: 'upper_lower',
    name: 'Upper / Lower',
    description: 'A balanced 4-day split ideal for intermediates. Great recovery and solid volume.',
    daysPerWeek: 4,
    schedule: [
      { day: 'Day 1', label: 'Upper A', focus: 'Chest, Back, Shoulders, Arms', exercises: [
        { exerciseId: 'bench_press', sets: 4, reps: '6-8', rest: 120 },
        { exerciseId: 'bent_over_row', sets: 4, reps: '6-8', rest: 120 },
        { exerciseId: 'overhead_press', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'lat_pulldown', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'lateral_raises', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'barbell_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'tricep_pushdown', sets: 3, reps: '10-12', rest: 60 },
      ]},
      { day: 'Day 2', label: 'Lower A', focus: 'Quads, Hamstrings, Calves, Core', exercises: [
        { exerciseId: 'squat', sets: 4, reps: '6-8', rest: 180 },
        { exerciseId: 'romanian_deadlift', sets: 3, reps: '8-10', rest: 120 },
        { exerciseId: 'leg_press', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'leg_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'calf_raises', sets: 4, reps: '15-20', rest: 60 },
        { exerciseId: 'plank', sets: 3, reps: '60s hold', rest: 60 },
      ]},
      { day: 'Day 3', label: 'Rest', focus: 'Recovery', exercises: [] },
      { day: 'Day 4', label: 'Upper B', focus: 'Chest, Back, Shoulders, Arms', exercises: [
        { exerciseId: 'dumbbell_press_incline', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'cable_row', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'arnold_press', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'pull_ups', sets: 3, reps: '6-10', rest: 90 },
        { exerciseId: 'dumbbell_fly', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'hammer_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'skull_crushers', sets: 3, reps: '10-12', rest: 60 },
      ]},
      { day: 'Day 5', label: 'Lower B', focus: 'Quads, Glutes, Hamstrings, Core', exercises: [
        { exerciseId: 'deadlift', sets: 4, reps: '5-6', rest: 180 },
        { exerciseId: 'bulgarian_split_squat', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'leg_extension', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'leg_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'calf_raises', sets: 4, reps: '15-20', rest: 60 },
        { exerciseId: 'hanging_leg_raise', sets: 3, reps: '12-15', rest: 60 },
      ]},
      { day: 'Day 6', label: 'Rest', focus: 'Recovery', exercises: [] },
      { day: 'Day 7', label: 'Rest', focus: 'Recovery', exercises: [] },
    ]
  },

  full_body: {
    id: 'full_body',
    name: 'Full Body',
    description: 'Hit every muscle 3× per week. Perfect for beginners or those with limited time.',
    daysPerWeek: 3,
    schedule: [
      { day: 'Day 1', label: 'Full Body A', focus: 'All Major Muscle Groups', exercises: [
        { exerciseId: 'squat', sets: 4, reps: '6-8', rest: 180 },
        { exerciseId: 'bench_press', sets: 4, reps: '6-8', rest: 120 },
        { exerciseId: 'bent_over_row', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'overhead_press', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'barbell_curl', sets: 2, reps: '10-12', rest: 60 },
        { exerciseId: 'tricep_pushdown', sets: 2, reps: '10-12', rest: 60 },
        { exerciseId: 'plank', sets: 3, reps: '45s hold', rest: 60 },
      ]},
      { day: 'Day 2', label: 'Rest', focus: 'Recovery', exercises: [] },
      { day: 'Day 3', label: 'Full Body B', focus: 'All Major Muscle Groups', exercises: [
        { exerciseId: 'deadlift', sets: 4, reps: '5-6', rest: 180 },
        { exerciseId: 'dumbbell_press_incline', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'lat_pulldown', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'lateral_raises', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'leg_press', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'hammer_curl', sets: 2, reps: '10-12', rest: 60 },
        { exerciseId: 'russian_twist', sets: 3, reps: '15-20', rest: 60 },
      ]},
      { day: 'Day 4', label: 'Rest', focus: 'Recovery', exercises: [] },
      { day: 'Day 5', label: 'Full Body C', focus: 'All Major Muscle Groups', exercises: [
        { exerciseId: 'leg_press', sets: 4, reps: '8-10', rest: 120 },
        { exerciseId: 'dumbbell_press_flat', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'cable_row', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'arnold_press', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'romanian_deadlift', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'dumbbell_curl', sets: 2, reps: '10-12', rest: 60 },
        { exerciseId: 'hanging_leg_raise', sets: 3, reps: '10-15', rest: 60 },
      ]},
      { day: 'Day 6', label: 'Rest', focus: 'Recovery', exercises: [] },
      { day: 'Day 7', label: 'Rest', focus: 'Recovery', exercises: [] },
    ]
  },

  bro_split: {
    id: 'bro_split',
    name: 'Bro Split',
    description: 'Classic 5-day bodybuilding split. Maximum volume per muscle group per session.',
    daysPerWeek: 5,
    schedule: [
      { day: 'Day 1', label: 'Chest', focus: 'Chest', exercises: [
        { exerciseId: 'bench_press', sets: 4, reps: '6-8', rest: 120 },
        { exerciseId: 'incline_bench_press', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'dumbbell_press_flat', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'dumbbell_fly', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'cable_crossover', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'push_ups', sets: 3, reps: 'To failure', rest: 60 },
      ]},
      { day: 'Day 2', label: 'Back', focus: 'Back', exercises: [
        { exerciseId: 'deadlift', sets: 4, reps: '5-6', rest: 180 },
        { exerciseId: 'pull_ups', sets: 4, reps: '6-10', rest: 120 },
        { exerciseId: 'bent_over_row', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'cable_row', sets: 3, reps: '10-12', rest: 90 },
        { exerciseId: 'lat_pulldown', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'face_pulls', sets: 3, reps: '15-20', rest: 60 },
      ]},
      { day: 'Day 3', label: 'Shoulders', focus: 'Shoulders, Traps', exercises: [
        { exerciseId: 'overhead_press', sets: 4, reps: '6-8', rest: 120 },
        { exerciseId: 'arnold_press', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'lateral_raises', sets: 4, reps: '12-15', rest: 60 },
        { exerciseId: 'front_raises', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'rear_delt_fly', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'shrugs', sets: 4, reps: '10-12', rest: 60 },
      ]},
      { day: 'Day 4', label: 'Arms', focus: 'Biceps, Triceps', exercises: [
        { exerciseId: 'barbell_curl', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'close_grip_bench', sets: 4, reps: '8-10', rest: 90 },
        { exerciseId: 'dumbbell_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'skull_crushers', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'preacher_curl', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'tricep_pushdown', sets: 3, reps: '12-15', rest: 60 },
      ]},
      { day: 'Day 5', label: 'Legs', focus: 'Quads, Hamstrings, Calves', exercises: [
        { exerciseId: 'squat', sets: 4, reps: '6-8', rest: 180 },
        { exerciseId: 'leg_press', sets: 4, reps: '10-12', rest: 120 },
        { exerciseId: 'romanian_deadlift', sets: 3, reps: '8-10', rest: 90 },
        { exerciseId: 'leg_extension', sets: 3, reps: '12-15', rest: 60 },
        { exerciseId: 'leg_curl', sets: 3, reps: '10-12', rest: 60 },
        { exerciseId: 'calf_raises', sets: 4, reps: '15-20', rest: 60 },
      ]},
      { day: 'Day 6', label: 'Rest', focus: 'Recovery', exercises: [] },
      { day: 'Day 7', label: 'Rest', focus: 'Recovery', exercises: [] },
    ]
  },
};

export default workoutPlans;

export const PLAN_IDS = Object.keys(workoutPlans);

export function getPlanById(id) {
  return workoutPlans[id] || null;
}

export function getRecommendedPlan(experience, daysAvailable = 5) {
  if (experience === 'beginner' || daysAvailable <= 3) return 'full_body';
  if (daysAvailable === 4) return 'upper_lower';
  if (daysAvailable === 5) return 'bro_split';
  return 'ppl';
}
