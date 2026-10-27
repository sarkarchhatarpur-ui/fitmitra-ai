import {
  UserProfile,
  EnergyAndMacroTargets,
  ExerciseItem,
  WorkoutDayPlan,
  FoodItem,
  PlannedMealSlot,
  ProgressLogEntry,
} from '../types/fitness';

export const NUTRITION_DATABASE: FoodItem[] = [
  // BREAKFAST ITEMS
  {
    id: 'oats_milk_porridge',
    name: 'Rolled Oats Porridge with Milk & Almonds',
    hindiAlias: 'Doodh Daliya / Oats',
    category: 'breakfast',
    servingDescription: '1 medium bowl (50g dry oats + 200ml toned milk + 8 almonds)',
    servingGrams: 260,
    calories: 345,
    protein: 14.5,
    carbs: 46,
    fats: 10.5,
    fiber: 6.2,
    allowedDiets: ['vegetarian', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['dairy', 'nuts', 'gluten'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Simmer 50g rolled oats in 200ml toned milk with a pinch of cardamom or cinnamon for 5 minutes. Top with 8 chopped almonds and a few slices of seasonal fruit.',
    affordableAlternative: 'Broken wheat (Gehun Daliya) cooked in toned milk with roasted peanuts.',
    sourceCitation: 'IFCT 2017 (NIN India) & USDA FoodData Central approximate values',
  },
  {
    id: 'oats_soy_vegan_bowl',
    name: 'Savory Vegetable Masala Oats with Roasted Peanuts',
    hindiAlias: 'Masala Oats & Moongphali',
    category: 'breakfast',
    servingDescription: '1 large bowl (60g dry oats + 100g mixed vegetables + 20g peanuts)',
    servingGrams: 280,
    calories: 350,
    protein: 13.8,
    carbs: 45,
    fats: 12,
    fiber: 7.5,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['nuts', 'gluten'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Sauté finely chopped carrots, peas, beans, and onions in 1 tsp mustard oil with turmeric and cumin. Add 60g rolled oats and water, cook for 5 minutes, and garnish with 20g crushed roasted peanuts and coriander.',
    affordableAlternative: 'Savory vegetable Gehun Daliya (broken wheat) with roasted chana.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'moong_dal_chilla_paneer',
    name: 'Moong Dal Chilla Stuffed with Grated Paneer',
    hindiAlias: 'Moong Dal & Paneer Cheela',
    category: 'breakfast',
    servingDescription: '2 medium chillas (70g dry yellow moong dal + 50g low-fat paneer)',
    servingGrams: 220,
    calories: 380,
    protein: 26,
    carbs: 42,
    fats: 11,
    fiber: 6.8,
    allowedDiets: ['vegetarian', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['dairy'],
    budgetTier: ['moderate', 'flexible'],
    prepInstructions:
      'Soak 70g moong dal for 3 hours and grind with ginger, green chili, and cumin into a smooth batter. Spread on a cast-iron tawa with 1 tsp oil, top with 50g seasoned grated paneer, fold, and serve with mint chutney.',
    affordableAlternative: 'Besan (chickpea flour) chilla stuffed with grated soya granules or seasonal vegetables.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'poha_sprouts_peanuts',
    name: 'Kanda Poha with Steamed Moong Sprouts',
    hindiAlias: 'Kanda Poha + Ankurit Moong',
    category: 'breakfast',
    servingDescription: '1 medium plate (60g dry flattened rice + 80g steamed moong sprouts + 15g peanuts)',
    servingGrams: 250,
    calories: 335,
    protein: 12.5,
    carbs: 54,
    fats: 7.5,
    fiber: 5.4,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['nuts'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Rinse 60g thick poha. Temper mustard seeds, curry leaves, onions, and 15g peanuts in 1 tsp oil. Toss in steamed green moong sprouts, turmeric, poha, and fresh lemon juice.',
    affordableAlternative: 'Puffed rice (Murmura) upma tossed with boiled black chana and chopped vegetables.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'idli_sambar_chutney',
    name: 'Steamed Rice-Lentil Idlis with Vegetable Sambar',
    hindiAlias: 'Idli Sambar',
    category: 'breakfast',
    servingDescription: '3 medium idlis (150g) + 1 large bowl Toor Dal Vegetable Sambar (200g)',
    servingGrams: 350,
    calories: 330,
    protein: 12,
    carbs: 58,
    fats: 4.5,
    fiber: 6.0,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: [],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Steam fermented rice and urad dal batter in idli molds for 10 minutes. Serve warm with drumstick, carrot, and bottle gourd sambar made with 35g dry toor dal and tamarind.',
    affordableAlternative: 'Ragi or Suji (semolina) idli with homemade roasted chana dal chutney.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'egg_bhurji_roti',
    name: 'Masala Egg Bhurji (3 Eggs) with 2 Whole Wheat Rotis',
    hindiAlias: 'Anda Bhurji & Phulka',
    category: 'breakfast',
    servingDescription: '2 whole eggs + 1 egg white scrambled (140g) + 2 medium rotis (60g atta)',
    servingGrams: 260,
    calories: 410,
    protein: 24.5,
    carbs: 42,
    fats: 15,
    fiber: 5.2,
    allowedDiets: ['egg_inclusive', 'non_vegetarian'],
    allergens: ['eggs', 'gluten'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Sauté chopped onions, tomatoes, green chilies, and turmeric in 1 tsp oil. Whisk 2 whole eggs plus 1 egg white, scramble gently on medium heat, garnish with coriander, and serve with 2 dry-roasted whole wheat phulkas.',
    affordableAlternative: '2 boiled eggs with 2 whole wheat rotis and cucumber-tomato salad.',
    sourceCitation: 'IFCT 2017 & USDA FoodData Central approximate values',
  },

  // LUNCH & DINNER MAIN MEALS
  {
    id: 'dal_roti_curd_sabzi',
    name: 'Yellow Toor/Moong Dal Tadka, 2 Rotis, Seasonal Sabzi & Curd',
    hindiAlias: 'Dal, 2 Phulka, Bhindi/Gobhi Sabzi & Dahi',
    category: 'lunch_dinner',
    servingDescription: '1 bowl thick dal (180g) + 2 rotis (60g atta) + 100g sabzi + 100g curd',
    servingGrams: 460,
    calories: 485,
    protein: 21,
    carbs: 72,
    fats: 11.5,
    fiber: 10.5,
    allowedDiets: ['vegetarian', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['dairy', 'gluten'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Pressure cook 45g dry yellow moong/toor dal with turmeric and tomatoes; temper with cumin and garlic in 1 tsp ghee. Pair with 2 whole wheat phulkas, lightly sautéed seasonal vegetable sabzi, and 100g low-fat dahi.',
    affordableAlternative: 'Use seasonal lauki/cabbage sabzi and homemade chaas (buttermilk).',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'soya_chunks_pulao_raita',
    name: 'High-Protein Soya Chunks Vegetable Pulao with Cucumber Raita',
    hindiAlias: 'Soya Wadi Pulao & Dahi Raita',
    category: 'lunch_dinner',
    servingDescription: '1 large bowl (50g dry soya chunks + 60g raw rice + 100g veggies + 100g curd)',
    servingGrams: 420,
    calories: 495,
    protein: 34.5,
    carbs: 71,
    fats: 7.5,
    fiber: 9.2,
    allowedDiets: ['vegetarian', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['soy', 'dairy'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Boil and squeeze 50g dry soya chunks thoroughly. Cook in a pot with 60g basmati/sona masoori rice, peas, carrots, whole spices, and 1 tsp oil. Serve with 100g grated cucumber dahi raita.',
    affordableAlternative: 'Soya chunks curry with 2 whole wheat rotis or steamed parboiled rice.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'soya_kala_chana_vegan_bowl',
    name: 'Kala Chana & Soya Masala Curry with Steamed Rice & Salad',
    hindiAlias: 'Kala Chana Soya Curry & Chawal',
    category: 'lunch_dinner',
    servingDescription: '1 bowl curry (40g dry kala chana + 30g dry soya chunks) + 150g cooked rice + salad',
    servingGrams: 430,
    calories: 480,
    protein: 28.5,
    carbs: 74,
    fats: 7.0,
    fiber: 11.8,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['soy'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Pressure cook soaked kala chana until tender. Simmer with boiled soya chunks in an onion-tomato-ginger gravy using 1.5 tsp mustard oil and garam masala. Serve with 150g steamed rice and cucumber-carrot kachumber.',
    affordableAlternative: 'Lobia (black-eyed peas) or whole masoor dal curry with rice.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'paneer_tikka_roti_dal',
    name: 'Tawa Paneer Bhurji / Tikka (120g) with 2 Rotis & Cucumber Salad',
    hindiAlias: 'Paneer Tikka/Bhurji + 2 Roti + Salad',
    category: 'lunch_dinner',
    servingDescription: '120g paneer cooked with bell peppers + 2 whole wheat rotis (60g atta) + 100g salad',
    servingGrams: 380,
    calories: 520,
    protein: 28,
    carbs: 46,
    fats: 23,
    fiber: 6.5,
    allowedDiets: ['vegetarian', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['dairy', 'gluten'],
    budgetTier: ['moderate', 'flexible'],
    prepInstructions:
      'Marinate 120g cubed paneer with 2 tbsp hung curd, turmeric, chili powder, and kasuri methi. Pan-sear on a non-stick or cast-iron tawa with capsicum and onions using 1 tsp oil. Serve with 2 phulkas.',
    affordableAlternative: 'Tofu bhurji (150g firm tofu) or homemade toned-milk chhena bhurji.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'rajma_chawal_curd',
    name: 'Homestyle Rajma Masala with Steamed Jeera Rice & Kachumber',
    hindiAlias: 'Rajma Chawal & Salad',
    category: 'lunch_dinner',
    servingDescription: '1 large bowl Rajma (60g dry kidney beans) + 150g cooked rice + 100g salad',
    servingGrams: 430,
    calories: 465,
    protein: 18.5,
    carbs: 82,
    fats: 6.5,
    fiber: 11.2,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: [],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Soak 60g red kidney beans overnight and pressure cook until soft. Simmer in a slow-cooked tomato, onion, ginger, and garlic masala with 1 tsp oil. Serve over 150g steamed rice with lemon-onion-cucumber salad.',
    affordableAlternative: 'Chole (chickpeas) or Chawli (black-eyed beans) masala with steamed rice.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'chicken_breast_curry_roti',
    name: 'Homestyle Grilled / Curry Chicken Breast (150g) with 2 Rotis & Dal',
    hindiAlias: 'Chicken Curry / Tikka + 2 Roti',
    category: 'lunch_dinner',
    servingDescription: '150g raw weight lean chicken breast + 2 whole wheat rotis (60g atta) + 100g salad',
    servingGrams: 370,
    calories: 475,
    protein: 42,
    carbs: 44,
    fats: 12,
    fiber: 5.8,
    allowedDiets: ['non_vegetarian'],
    allergens: ['gluten'],
    budgetTier: ['moderate', 'flexible'],
    prepInstructions:
      'Marinate 150g skinless chicken breast in ginger-garlic paste, turmeric, coriander powder, and 1 tbsp curd. Cook in a light onion-tomato gravy or pan-grill with 1.5 tsp oil. Serve with 2 whole wheat rotis and salad.',
    affordableAlternative: '3-egg curry in onion-tomato masala or soya chunk curry.',
    sourceCitation: 'IFCT 2017 & USDA FoodData Central approximate values',
  },
  {
    id: 'rohu_fish_curry_rice',
    name: 'Light Mustard / Tomato Fish Curry (150g Rohu/Surmai) with Steamed Rice',
    hindiAlias: 'Machhli Curry & Chawal',
    category: 'lunch_dinner',
    servingDescription: '150g raw weight fish fillets + 160g cooked parboiled/basmati rice + cucumber salad',
    servingGrams: 400,
    calories: 455,
    protein: 34,
    carbs: 50,
    fats: 12.5,
    fiber: 3.5,
    allowedDiets: ['non_vegetarian'],
    allergens: ['seafood'],
    budgetTier: ['moderate', 'flexible'],
    prepInstructions:
      'Lightly sear 150g fresh Rohu or Surmai pieces with turmeric and salt, then simmer in a light tomato, cumin, and mustard seed broth with 1.5 tsp mustard oil. Serve with 160g steamed rice.',
    affordableAlternative: 'Lean chicken curry or egg curry with steamed rice.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },

  // SNACKS & PROTEIN SIDES
  {
    id: 'roasted_chana_chaat',
    name: 'Crunchy Roasted Bhuna Chana & Sprouts Bhel',
    hindiAlias: 'Bhuna Chana & Sprouts Chaat',
    category: 'snack',
    servingDescription: '1 bowl (45g roasted black chana + 50g moong sprouts + tomato, onion, lemon)',
    servingGrams: 160,
    calories: 215,
    protein: 13.5,
    carbs: 32,
    fats: 3.5,
    fiber: 7.8,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: [],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Toss 45g crunchy roasted kala chana with 50g steamed green moong sprouts, finely diced onion, tomato, cucumber, roasted cumin powder, chaat masala, and fresh lemon juice.',
    affordableAlternative: 'Boiled kala chana chaat with lemon and black salt.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'dahi_fruit_nuts_bowl',
    name: 'Thick Dahi (Curd) Bowl with Banana & Roasted Flax/Pumpkin Seeds',
    hindiAlias: 'Dahi, Kela & Seeds',
    category: 'snack',
    servingDescription: '150g low-fat curd + 1 medium banana (100g) + 10g mixed seeds',
    servingGrams: 260,
    calories: 235,
    protein: 10.5,
    carbs: 34,
    fats: 6.5,
    fiber: 3.8,
    allowedDiets: ['vegetarian', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['dairy'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Whisk 150g chilled homemade or low-fat dahi until smooth. Top with 1 sliced medium banana, 10g roasted flax or pumpkin seeds, and a pinch of cinnamon.',
    affordableAlternative: '1 glass masala chaas (buttermilk) + 1 seasonal fruit (guava/apple/banana) + 15g roasted peanuts.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'sattu_protein_drink',
    name: 'Traditional Chana Sattu Cooler with Lemon & Roasted Jeera',
    hindiAlias: 'Namkeen Chana Sattu Sharbat',
    category: 'snack',
    servingDescription: '1 tall glass (45g roasted gram flour sattu in 300ml water) + 1 seasonal fruit',
    servingGrams: 400,
    calories: 230,
    protein: 11.8,
    carbs: 38,
    fats: 3.2,
    fiber: 6.5,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: [],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Whisk 45g roasted chana sattu into 300ml cold water with roasted cumin powder, black salt, finely chopped mint leaves, and half a lemon. Pair with 1 medium apple or guava.',
    affordableAlternative: 'Handful of roasted chana (40g) with 1 glass nimbu pani (unsweetened).',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
  {
    id: 'boiled_eggs_pepper_snack',
    name: '3 Hard-Boiled Eggs (2 Whole + 1 White) with Black Pepper & Fruit',
    hindiAlias: 'Uble Ande & Seb/Amrood',
    category: 'snack',
    servingDescription: '2 whole boiled eggs + 1 boiled egg white + 1 medium guava/apple (120g)',
    servingGrams: 250,
    calories: 230,
    protein: 16.5,
    carbs: 18,
    fats: 10.2,
    fiber: 4.5,
    allowedDiets: ['egg_inclusive', 'non_vegetarian'],
    allergens: ['eggs'],
    budgetTier: ['budget_friendly', 'moderate', 'flexible'],
    prepInstructions:
      'Boil eggs for 9 minutes, peel, slice in half, and season with crushed black pepper, roasted cumin, and a pinch of rock salt. Serve alongside a fresh guava or apple.',
    affordableAlternative: '45g roasted bhuna chana + 1 seasonal fruit.',
    sourceCitation: 'USDA FoodData Central & IFCT 2017 approximate values',
  },
  {
    id: 'makhana_peanut_roast',
    name: 'Dry-Roasted Phool Makhana (Foxnuts) & Peanuts Trail Mix',
    hindiAlias: 'Bhuna Makhana & Moongphali',
    category: 'snack',
    servingDescription: '1 medium bowl (30g makhana + 25g roasted peanuts)',
    servingGrams: 55,
    calories: 245,
    protein: 9.8,
    carbs: 26,
    fats: 12.5,
    fiber: 4.2,
    allowedDiets: ['vegetarian', 'vegan', 'egg_inclusive', 'non_vegetarian'],
    allergens: ['nuts'],
    budgetTier: ['moderate', 'flexible'],
    prepInstructions:
      'Dry roast 30g phool makhana on low flame for 6–8 minutes until crisp. Toss with 25g dry-roasted peanuts, ½ tsp ghee/oil, turmeric, and black pepper.',
    affordableAlternative: 'Roasted puffed rice (murmura) mixed with 30g roasted chana and 15g peanuts.',
    sourceCitation: 'IFCT 2017 (NIN India) approximate values',
  },
];

export const EXERCISE_LIBRARY: ExerciseItem[] = [
  {
    id: 'goblet_or_bodyweight_squat',
    name: 'Controlled Squat (Bodyweight or Goblet Squat)',
    muscleGroup: 'Legs & Glutes',
    equipmentRequired: ['bodyweight', 'dumbbells', 'kettlebell', 'full_gym'],
    location: ['home', 'gym'],
    difficulty: 'beginner',
    sets: 3,
    reps: '10–12 reps',
    restSeconds: 75,
    beginnerSets: 2,
    beginnerReps: '8–10 slow box-assisted reps',
    beginnerRestSeconds: 90,
    instructions: [
      'Stand with your feet shoulder-width apart and toes turned slightly outward (10–15 degrees).',
      'Brace your core gently as if preparing for a light tap on the stomach, keeping your chest tall.',
      'Push your hips slightly back and bend your knees to lower your body until your thighs are roughly parallel to the floor (or a comfortable depth).',
      'Press evenly through your mid-foot and heels to return to the standing position without locking your knees harshly.',
    ],
    warmupTip: 'Perform 8 slow bodyweight hip circles and 6 ankle dorsiflexion rocks per side before starting.',
    cooldownTip: 'Hold a standing quadriceps stretch and gentle figure-four glute stretch for 30 seconds each side.',
    easierAlternative: 'Chair Box Squat: Lower yourself softly onto a sturdy chair, pause for 1 second, and stand back up.',
    progressionTip: 'Hold a dumbbell or kettlebell against your upper chest (Goblet position) or add a 3-second lowering tempo.',
    contraindicatedInjuries: ['knee_discomfort'],
    injuryModificationNote: 'For knee sensitivity, reduce depth to a pain-free half-squat onto a high chair and keep shins more vertical.',
    illustrationType: 'squat',
    referenceTitle: 'ACE Fitness Exercise Library — Squat Biomechanics',
    referenceUrl: 'https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/',
  },
  {
    id: 'glute_bridge_hip_thrust',
    name: 'Supine Glute Bridge (Knee-Friendly Lower Body)',
    muscleGroup: 'Legs & Glutes',
    equipmentRequired: ['bodyweight', 'resistance_bands', 'dumbbells', 'full_gym'],
    location: ['home', 'gym'],
    difficulty: 'beginner',
    sets: 3,
    reps: '12–15 reps (2s pause at top)',
    restSeconds: 60,
    beginnerSets: 2,
    beginnerReps: '10 controlled reps',
    beginnerRestSeconds: 75,
    instructions: [
      'Lie flat on your back on a mat with knees bent and feet flat on the floor, about hip-width apart.',
      'Flatten your lower back gently by engaging your abs so your ribs stay down.',
      'Drive through your heels to lift your hips until your knees, hips, and shoulders form a straight diagonal line.',
      'Squeeze your glutes for 2 full seconds at the top, then lower slowly with control.',
    ],
    warmupTip: 'Perform 6 gentle pelvic tilts lying on your back to wake up deep core stabilizers.',
    cooldownTip: 'Hug both knees gently toward your chest for 30 seconds to relax the lower back.',
    easierAlternative: 'Short-range pelvic bridge with a 3-second isometric hold.',
    progressionTip: 'Place a dumbbell across your hips or progress to Single-Leg Glute Bridges.',
    contraindicatedInjuries: [],
    injuryModificationNote: 'Excellent low-shear alternative for individuals with knee discomfort or lower back stiffness.',
    illustrationType: 'glute_bridge',
    referenceTitle: 'ACE Fitness Exercise Library — Glute Bridge Guide',
    referenceUrl: 'https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/',
  },
  {
    id: 'pushup_or_incline_pushup',
    name: 'Push-Up (Incline or Floor Push-Up)',
    muscleGroup: 'Chest & Push',
    equipmentRequired: ['bodyweight', 'full_gym'],
    location: ['home', 'gym'],
    difficulty: 'beginner',
    sets: 3,
    reps: '8–12 reps',
    restSeconds: 75,
    beginnerSets: 2,
    beginnerReps: '8–10 incline reps (hands on sturdy table/bench)',
    beginnerRestSeconds: 90,
    instructions: [
      'Place your hands slightly wider than shoulder-width on the floor or an elevated bench/wall.',
      'Keep your body in a straight plank line from head to heels, squeezing your glutes and core.',
      'Lower your chest toward your hands while tucking your elbows at a 45-degree angle (like an arrow, not a T-shape).',
      'Exhale and press firmly back to the starting plank position.',
    ],
    warmupTip: 'Do 10 scapular wall slides and 10 gentle wrist circles in each direction.',
    cooldownTip: 'Doorway chest stretch for 30 seconds per side with relaxed breathing.',
    easierAlternative: 'Wall Push-Up or Countertop Incline Push-Up to reduce joint load while keeping full core engagement.',
    progressionTip: 'Slow down the lowering phase to 3 seconds or elevate feet slightly once 15 clean floor reps feel easy.',
    contraindicatedInjuries: ['wrist_sensitivity', 'shoulder_impingement'],
    injuryModificationNote: 'Use neutral-grip dumbbells as push-up handles for wrist comfort, and use a higher incline to protect shoulders.',
    illustrationType: 'pushup',
    referenceTitle: 'ACE Fitness Exercise Library — Push-Up Form',
    referenceUrl: 'https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/',
  },
  {
    id: 'dumbbell_or_band_row',
    name: 'Single-Arm Dumbbell Row / Resistance Band Row',
    muscleGroup: 'Back & Pull',
    equipmentRequired: ['dumbbells', 'resistance_bands', 'kettlebell', 'full_gym', 'bodyweight'],
    location: ['home', 'gym'],
    difficulty: 'beginner',
    sets: 3,
    reps: '10–12 reps per side',
    restSeconds: 75,
    beginnerSets: 2,
    beginnerReps: '10 controlled reps per side',
    beginnerRestSeconds: 75,
    instructions: [
      'Support one hand and knee on a bench or sturdy chair (or sit tall with a resistance band anchored in front of you).',
      'Keep your spine flat and neck neutral, looking slightly ahead at the floor.',
      'Pull your elbow back toward your hip pocket, initiating the movement by drawing your shoulder blade back.',
      'Pause for 1 second at the top, then lower the weight slowly over 2 seconds.',
    ],
    warmupTip: '10 band pull-aparts or arm-Y-T-W raises to activate mid-back muscles.',
    cooldownTip: 'Child’s pose with hands reaching forward and slightly to each side for 30 seconds.',
    easierAlternative: 'Seated Towel Iso-Row or Prone Cobra back extensions if training with zero equipment.',
    progressionTip: 'Increase dumbbell weight by 1–2 kg or add a 2-second peak squeeze at the top of every rep.',
    contraindicatedInjuries: [],
    injuryModificationNote: 'Always support your non-working hand on a bench or chair to remove strain from the lower back.',
    illustrationType: 'row',
    referenceTitle: 'ExRx Exercise Directory — Back & Latissimus Exercises',
    referenceUrl: 'https://exrx.net/Lists/ExList/BackWt',
  },
  {
    id: 'romanian_deadlift_hip_hinge',
    name: 'Romanian Deadlift (Dumbbell / Hip Hinge)',
    muscleGroup: 'Legs & Glutes',
    equipmentRequired: ['dumbbells', 'kettlebell', 'resistance_bands', 'full_gym', 'bodyweight'],
    location: ['home', 'gym'],
    difficulty: 'intermediate',
    sets: 3,
    reps: '10–12 reps',
    restSeconds: 90,
    beginnerSets: 2,
    beginnerReps: '10 bodyweight dowel/wall hip hinges',
    beginnerRestSeconds: 90,
    instructions: [
      'Stand tall holding dumbbells or a resistance band in front of your thighs, feet hip-width apart.',
      'Unlock your knees softly (about 15 degrees) and keep that exact knee angle fixed.',
      'Push your hips straight backward as if closing a car door with your glutes, keeping weights skimming close to your shins.',
      'Stop as soon as you feel a deep stretch in your hamstrings (usually mid-shin), then drive your hips forward to stand tall.',
    ],
    warmupTip: 'Practice 8 unloaded wall hip-taps standing 15 cm away from a wall.',
    cooldownTip: 'Supine hamstring towel stretch lying flat on your back for 30 seconds each leg.',
    easierAlternative: 'Standing Bodyweight Hip Hinge (Good Morning) with hands across chest.',
    progressionTip: 'Slow 3-second eccentric (lowering) phase or progress to single-leg kickstand RDLs.',
    contraindicatedInjuries: ['lower_back_sensitivity'],
    injuryModificationNote: 'If you have lower back sensitivity, substitute with Supine Glute Bridges to train glutes and hamstrings without spinal loading.',
    illustrationType: 'deadlift',
    referenceTitle: 'ACE Fitness Exercise Library — Hip Hinge Technique',
    referenceUrl: 'https://www.acefitness.org/resources/everyone/exercise-library/276/romanian-deadlift/',
  },
  {
    id: 'overhead_shoulder_press',
    name: 'Standing or Seated Overhead Shoulder Press',
    muscleGroup: 'Shoulders',
    equipmentRequired: ['dumbbells', 'resistance_bands', 'kettlebell', 'full_gym', 'bodyweight'],
    location: ['home', 'gym'],
    difficulty: 'beginner',
    sets: 3,
    reps: '10–12 reps',
    restSeconds: 75,
    beginnerSets: 2,
    beginnerReps: '8–10 light neutral-grip reps',
    beginnerRestSeconds: 90,
    instructions: [
      'Hold dumbbells or resistance band handles at shoulder height with palms facing slightly inward (neutral/scaption plane).',
      'Brace your abs and glutes so your lower back does not arch excessively.',
      'Press the weights smoothly overhead until arms are straight alongside your ears.',
      'Lower back to shoulder height with steady 2-second control.',
    ],
    warmupTip: '10 slow arm circles forward and backward plus 8 wall angels.',
    cooldownTip: 'Cross-body posterior shoulder stretch for 30 seconds per arm.',
    easierAlternative: 'Lateral-to-Front Scaption Raises with light water bottles or bodyweight Pike Hold.',
    progressionTip: 'Perform standing single-arm presses to challenge anti-lateral core stability.',
    contraindicatedInjuries: ['shoulder_impingement'],
    injuryModificationNote: 'For shoulder impingement, replace overhead pressing with Floor Landmine/Incline Press or Lateral Raises below 80 degrees.',
    illustrationType: 'overhead_press',
    referenceTitle: 'ACE Fitness Exercise Library — Overhead Dumbbell Press',
    referenceUrl: 'https://www.acefitness.org/resources/everyone/exercise-library/165/dumbbell-overhead-press/',
  },
  {
    id: 'reverse_lunge_split_squat',
    name: 'Controlled Reverse Lunge',
    muscleGroup: 'Legs & Glutes',
    equipmentRequired: ['bodyweight', 'dumbbells', 'kettlebell', 'full_gym'],
    location: ['home', 'gym'],
    difficulty: 'intermediate',
    sets: 3,
    reps: '8–10 reps per leg',
    restSeconds: 75,
    beginnerSets: 2,
    beginnerReps: '6–8 supported split squats holding a chair',
    beginnerRestSeconds: 90,
    instructions: [
      'Stand tall with feet hip-width apart. Hold onto a wall or chair lightly if needed for balance.',
      'Step one foot backward and lower your back knee toward the floor until both knees are bent at roughly 90 degrees.',
      'Keep your torso slightly leaned forward (weight over your front mid-foot).',
      'Push firmly through your front foot to return to the starting position.',
    ],
    warmupTip: '6 dynamic walking knee hugs per side.',
    cooldownTip: 'Kneeling hip flexor lunge stretch for 30 seconds per side.',
    easierAlternative: 'Wall-Supported Stationary Split Squat with reduced depth.',
    progressionTip: 'Hold dumbbells at your sides or elevate your back foot for Bulgarian Split Squats.',
    contraindicatedInjuries: ['knee_discomfort', 'ankle_mobility'],
    injuryModificationNote: 'Stepping backward places less stress on the knee than forward lunges; hold a sturdy chair to offload balance.',
    illustrationType: 'lunge',
    referenceTitle: 'ACE Fitness Exercise Library — Lunge Mechanics',
    referenceUrl: 'https://www.acefitness.org/resources/everyone/exercise-library/94/lunge/',
  },
  {
    id: 'plank_deadbug_core',
    name: 'Forearm Plank & Alternating Dead Bug',
    muscleGroup: 'Core & Stability',
    equipmentRequired: ['bodyweight', 'full_gym'],
    location: ['home', 'gym'],
    difficulty: 'beginner',
    sets: 3,
    reps: '30–40 sec hold (or 10 Dead Bugs)',
    restSeconds: 60,
    beginnerSets: 2,
    beginnerReps: '20 sec knee plank or 8 slow Dead Bugs',
    beginnerRestSeconds: 60,
    instructions: [
      'For Forearm Plank: Rest on your forearms with elbows directly beneath your shoulders, body in a straight line.',
      'Pull your elbows slightly toward your toes and squeeze your glutes so your lower back never sags.',
      'For Dead Bug (zero wrist/shoulder load): Lie on your back, press lower back into the mat, and slowly extend opposite arm and leg.',
      'Breathe steadily through your nose and mouth—never hold your breath during core work.',
    ],
    warmupTip: '5 deep diaphragmatic 360-degree breaths lying on your back.',
    cooldownTip: 'Gentle Cat-Cow spinal mobility flow for 6 breaths.',
    easierAlternative: 'Supine Dead Bug (alternating heel taps only) with lower back gently pressed to the mat.',
    progressionTip: 'Extend plank hold to 45–60 seconds or add slow alternating shoulder taps.',
    contraindicatedInjuries: [],
    injuryModificationNote: 'Switch to Supine Dead Bugs if you have wrist or shoulder discomfort.',
    illustrationType: 'plank',
    referenceTitle: 'ACE Fitness Exercise Library — Plank Stability',
    referenceUrl: 'https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/',
  },
];

export function calculateEnergyAndMacros(profile: UserProfile): EnergyAndMacroTargets {
  const heightM = profile.heightCm / 100;
  const bmi = Number((profile.weightKg / (heightM * heightM)).toFixed(1));

  let bmiCategory = 'Normal range (WHO global standard)';
  if (bmi < 18.5) bmiCategory = 'Underweight range (<18.5)';
  else if (bmi >= 18.5 && bmi < 23) bmiCategory = 'Healthy weight (Asian & WHO optimal <23)';
  else if (bmi >= 23 && bmi < 25) bmiCategory = 'Normal WHO / Overweight Asian cut-off (23–24.9)';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight range (25–29.9)';
  else bmiCategory = 'Obesity range (≥30)';

  // Mifflin-St Jeor Equation
  // Male: 10*W + 6.25*H - 5*A + 5
  // Female: 10*W + 6.25*H - 5*A - 161
  // Unspecified: midpoint (-78)
  let sexOffset = -78;
  if (profile.sex === 'male') sexOffset = 5;
  else if (profile.sex === 'female') sexOffset = -161;

  const bmr = Math.round(
    10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + sexOffset
  );

  const activityMultipliers: Record<UserProfile['activityLevel'], number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  const tdee = Math.round(bmr * activityMultipliers[profile.activityLevel]);

  let rawTargetCalories = tdee;
  if (profile.goal === 'fat_loss') rawTargetCalories = tdee - 400; // safe moderate deficit
  else if (profile.goal === 'muscle_gain') rawTargetCalories = tdee + 250; // lean surplus
  else if (profile.goal === 'strength') rawTargetCalories = tdee + 150;
  else rawTargetCalories = tdee;

  // Enforce safe minimum floor to prevent crash dieting
  const minSafeCalories = profile.sex === 'male' ? 1600 : 1400;
  let safetyNotice: string | undefined;
  let targetCalories = rawTargetCalories;
  if (targetCalories < minSafeCalories) {
    targetCalories = minSafeCalories;
    safetyNotice = `To protect metabolic health and prevent nutrient deficiencies, FitMitra never recommends crash diets below ${minSafeCalories} kcal/day.`;
  }

  // Protein multiplier (g per kg body weight)
  let proteinPerKg = 1.6;
  if (profile.goal === 'muscle_gain' || profile.goal === 'strength') proteinPerKg = 1.8;
  else if (profile.goal === 'fat_loss') proteinPerKg = 1.7;
  else proteinPerKg = 1.4;

  // Adjust if BMI is high so protein isn't artificially inflated
  const referenceWeightForProtein =
    bmi > 28 ? Math.round(24 * heightM * heightM + (profile.weightKg - 24 * heightM * heightM) * 0.25) : profile.weightKg;

  const proteinGrams = Math.round(referenceWeightForProtein * proteinPerKg);
  const fatsGrams = Math.round((targetCalories * 0.27) / 9);
  const remainingCals = Math.max(400, targetCalories - proteinGrams * 4 - fatsGrams * 9);
  const carbsGrams = Math.round(remainingCals / 4);

  const waterLiters = Number(Math.max(2.2, profile.weightKg * 0.035 + (profile.daysPerWeek >= 4 ? 0.4 : 0.2)).toFixed(1));

  const assumptions = [
    `BMR (${bmr} kcal) estimated via the Mifflin-St Jeor equation (${
      profile.sex === 'unspecified' ? 'sex-neutral midpoint offset used' : `${profile.sex} reference coefficient`
    }).`,
    `TDEE (${tdee} kcal) uses activity multiplier ×${activityMultipliers[profile.activityLevel]} (${profile.activityLevel.replace('_', ' ')}).`,
    `Daily target (${targetCalories} kcal) applies a sustainable ${
      profile.goal === 'fat_loss'
        ? '~400 kcal moderate deficit (~0.35–0.5 kg/week)'
        : profile.goal === 'muscle_gain'
        ? '+250 kcal lean muscle surplus'
        : 'maintenance/performance balance'
    }.`,
    `Protein target (${proteinGrams}g/day, ~${proteinPerKg}g/kg) supports lean muscle preservation and recovery.`,
  ];

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    waterLiters,
    assumptions,
    safetyNotice,
  };
}

const DAY_NAMES: Array<{ full: string; short: string }> = [
  { full: 'Monday', short: 'Mon' },
  { full: 'Tuesday', short: 'Tue' },
  { full: 'Wednesday', short: 'Wed' },
  { full: 'Thursday', short: 'Thu' },
  { full: 'Friday', short: 'Fri' },
  { full: 'Saturday', short: 'Sat' },
  { full: 'Sunday', short: 'Sun' },
];

export function generateWeeklyWorkoutPlan(profile: UserProfile): WorkoutDayPlan[] {
  const isSafeBeginner = profile.safeBeginnerMode || profile.experience === 'beginner';

  // Filter exercises compatible with location & equipment (bodyweight is always available)
  const availableEquip = new Set<string>(['bodyweight', ...profile.equipment]);
  if (profile.workoutLocation === 'gym') {
    availableEquip.add('full_gym');
    availableEquip.add('dumbbells');
  }

  const compatibleExercises = EXERCISE_LIBRARY.filter((ex) =>
    ex.equipmentRequired.some((eq) => availableEquip.has(eq))
  ).map((ex) => {
    const hasInjuryConflict = ex.contraindicatedInjuries.some((inj) =>
      profile.injuries.includes(inj)
    );
    return {
      ...ex,
      sets: isSafeBeginner ? ex.beginnerSets : ex.sets,
      reps: isSafeBeginner ? ex.beginnerReps : ex.reps,
      restSeconds: isSafeBeginner ? ex.beginnerRestSeconds : ex.restSeconds,
      injuryModificationNote: hasInjuryConflict
        ? `Modified for your logged joint sensitivity: ${ex.easierAlternative}`
        : ex.injuryModificationNote,
    };
  });

  // Determine which day indices (0..6) are training days based on profile.daysPerWeek
  const trainingDayPatterns: Record<number, number[]> = {
    2: [0, 3], // Mon, Thu
    3: [0, 2, 4], // Mon, Wed, Fri
    4: [0, 1, 3, 4], // Mon, Tue, Thu, Fri
    5: [0, 1, 2, 4, 5], // Mon, Tue, Wed, Fri, Sat
    6: [0, 1, 2, 3, 4, 5], // Mon-Sat
  };
  const activeIndices = trainingDayPatterns[Math.min(6, Math.max(2, profile.daysPerWeek))] || [0, 2, 4];

  const byId = (id: string) =>
    compatibleExercises.find((e) => e.id === id) || compatibleExercises[0];

  const templates = [
    {
      title: 'Full Body Foundation & Posture',
      focus: 'Legs, Push, Pull & Core Stability',
      exercises: [
        byId('goblet_or_bodyweight_squat'),
        byId('pushup_or_incline_pushup'),
        byId('dumbbell_or_band_row'),
        byId('plank_deadbug_core'),
      ],
    },
    {
      title: 'Lower Body Strength & Glutes',
      focus: 'Quads, Hamstrings, Glutes & Core',
      exercises: [
        byId('glute_bridge_hip_thrust'),
        byId('reverse_lunge_split_squat'),
        byId('romanian_deadlift_hip_hinge'),
        byId('plank_deadbug_core'),
      ],
    },
    {
      title: 'Upper Body Push, Pull & Shoulders',
      focus: 'Chest, Back, Shoulders & Posture',
      exercises: [
        byId('pushup_or_incline_pushup'),
        byId('dumbbell_or_band_row'),
        byId('overhead_shoulder_press'),
        byId('plank_deadbug_core'),
      ],
    },
    {
      title: 'Metabolic Conditioning & Functional Strength',
      focus: 'Compound Full-Body Movement & Core',
      exercises: [
        byId('goblet_or_bodyweight_squat'),
        byId('glute_bridge_hip_thrust'),
        byId('overhead_shoulder_press'),
        byId('dumbbell_or_band_row'),
      ],
    },
  ];

  let trainingCounter = 0;

  return DAY_NAMES.map((day, idx) => {
    const isTraining = activeIndices.includes(idx);
    if (!isTraining) {
      return {
        dayIndex: idx,
        dayName: day.full,
        shortName: day.short,
        title: 'Active Recovery & Mobility Rest Day',
        focus: '20–30 min brisk walk, light stretching, hydration & sleep recovery',
        isRestDay: true,
        estimatedMinutes: 20,
        warmupRoutine: [
          '5 minutes of slow nasal breathing and neck/shoulder rolls',
          '10 gentle cat-cow spinal mobility repetitions',
        ],
        cooldownRoutine: [
          '15–20 minute outdoor walk at a conversational pace',
          'Full-body foam rolling or gentle hamstring and chest stretches',
        ],
        exercises: [],
      };
    }

    const template = templates[trainingCounter % templates.length];
    trainingCounter++;

    return {
      dayIndex: idx,
      dayName: day.full,
      shortName: day.short,
      title: isSafeBeginner ? `${template.title} (Safe Beginner Pace)` : template.title,
      focus: template.focus,
      isRestDay: false,
      estimatedMinutes: profile.sessionDurationMin || 40,
      warmupRoutine: [
        '3 mins brisk march in place or light jumping jacks to raise core temperature',
        '10 dynamic arm circles + 8 hip circles per side',
        '6 slow bodyweight practice reps of your first exercise',
      ],
      cooldownRoutine: [
        '2 mins slow walking to bring heart rate down gradually',
        '30 sec standing chest & shoulder stretch + 30 sec hamstring/glute stretch',
        'Drink 250–300 ml water and log your completed sets',
      ],
      exercises: template.exercises,
    };
  });
}

export function getCompatibleFoods(profile: UserProfile): FoodItem[] {
  return NUTRITION_DATABASE.filter((food) => {
    const dietMatch = food.allowedDiets.includes(profile.dietPreference);
    const allergenConflict = food.allergens.some((al) => profile.allergies.includes(al));
    const budgetMatch = food.budgetTier.includes(profile.budget);
    return dietMatch && !allergenConflict && budgetMatch;
  });
}

export function generateDefaultMealPlan(
  profile: UserProfile,
  targets: EnergyAndMacroTargets
): PlannedMealSlot[] {
  const compatible = getCompatibleFoods(profile);
  const fallbackPool = compatible.length >= 3 ? compatible : NUTRITION_DATABASE.filter((f) => f.allowedDiets.includes(profile.dietPreference));

  const breakfasts = fallbackPool.filter((f) => f.category === 'breakfast');
  const mains = fallbackPool.filter((f) => f.category === 'lunch_dinner');
  const snacks = fallbackPool.filter((f) => f.category === 'snack');

  const pick = (list: FoodItem[], idx: number): FoodItem =>
    list[idx % Math.max(1, list.length)] || fallbackPool[0] || NUTRITION_DATABASE[0];

  const baseSlots: Array<{ slotId: string; slotName: string; timeSuggestion: string; food: FoodItem; weight: number }> = [
    {
      slotId: 'breakfast',
      slotName: 'Breakfast',
      timeSuggestion: '08:00 AM',
      food: pick(breakfasts, 0),
      weight: 0.26,
    },
    {
      slotId: 'lunch',
      slotName: 'Lunch',
      timeSuggestion: '01:15 PM',
      food: pick(mains, 0),
      weight: 0.34,
    },
    {
      slotId: 'evening_snack',
      slotName: 'Evening Fuel Snack',
      timeSuggestion: '05:00 PM',
      food: pick(snacks, 0),
      weight: 0.14,
    },
    {
      slotId: 'dinner',
      slotName: 'Dinner',
      timeSuggestion: '08:15 PM',
      food: pick(mains, 1),
      weight: 0.26,
    },
  ];

  let selectedSlots = baseSlots;
  if (profile.mealFrequency === 3) {
    selectedSlots = [
      { ...baseSlots[0], weight: 0.3 },
      { ...baseSlots[1], weight: 0.38 },
      { ...baseSlots[3], weight: 0.32 },
    ];
  } else if (profile.mealFrequency === 5) {
    selectedSlots = [
      { ...baseSlots[0], weight: 0.22 },
      {
        slotId: 'mid_morning',
        slotName: 'Mid-Morning Mini Meal',
        timeSuggestion: '11:00 AM',
        food: pick(snacks, 1),
        weight: 0.12,
      },
      { ...baseSlots[1], weight: 0.28 },
      { ...baseSlots[2], weight: 0.13 },
      { ...baseSlots[3], weight: 0.25 },
    ];
  }

  return selectedSlots.map((slot) => {
    const desiredCals = targets.targetCalories * slot.weight;
    const rawMultiplier = desiredCals / Math.max(150, slot.food.calories);
    // Snap multiplier to clean 0.25 increments between 0.75 and 2.0
    const snapped = Math.min(2.0, Math.max(0.75, Math.round(rawMultiplier * 4) / 4));
    return {
      slotId: slot.slotId,
      slotName: slot.slotName,
      timeSuggestion: slot.timeSuggestion,
      foodId: slot.food.id,
      servingsMultiplier: snapped,
    };
  });
}

export const DEMO_USER_PROFILE: UserProfile = {
  name: 'Aarav Sharma (Demo Account)',
  age: 28,
  heightCm: 174,
  weightKg: 76.4,
  targetWeightKg: 71.0,
  goal: 'fat_loss',
  sex: 'male',
  activityLevel: 'moderately_active',
  experience: 'beginner',
  workoutLocation: 'home',
  daysPerWeek: 4,
  sessionDurationMin: 40,
  dietPreference: 'vegetarian',
  allergies: [],
  dietaryRestrictionsNote: 'Prefers traditional home-cooked North & South Indian vegetarian meals with high protein.',
  budget: 'moderate',
  mealFrequency: 4,
  equipment: ['bodyweight', 'dumbbells', 'resistance_bands'],
  injuries: [],
  injuryNotes: '',
  safeBeginnerMode: false,
  isDemoAccount: true,
  createdAt: '2026-10-01T08:00:00.000Z',
  updatedAt: '2026-10-25T08:00:00.000Z',
};

export function createDemoProgressLogs(): ProgressLogEntry[] {
  const today = new Date();
  const entries: ProgressLogEntry[] = [];
  const sampleWeights = [77.8, 77.5, 77.3, 77.0, 76.8, 76.6, 76.4];
  const sampleWaists = [88.5, 88.2, 88.0, 87.6, 87.4, 87.1, 86.8];
  const sampleWater = [9, 10, 8, 11, 10, 12, 9];
  const sampleActive = [35, 45, 25, 40, 45, 30, 40];
  const sampleWorkout = [true, true, false, true, true, false, true];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isoDate = d.toISOString().split('T')[0];
    const idx = 6 - i;
    entries.push({
      id: `demo_log_${idx}`,
      date: isoDate,
      weightKg: sampleWeights[idx],
      waistCm: sampleWaists[idx],
      waterGlasses: sampleWater[idx],
      activeMinutes: sampleActive[idx],
      workoutCompleted: sampleWorkout[idx],
      notes: idx === 6 ? 'Completed full-body dumbbell session; felt energetic.' : undefined,
    });
  }
  return entries;
}

export function generateDemoCoachReply(question: string, profile: UserProfile): string {
  const q = question.toLowerCase();
  const targets = calculateEnergyAndMacros(profile);

  if (q.includes('protein') || q.includes('veg') || q.includes('paneer') || q.includes('dal') || q.includes('soya')) {
    return `[Demo Mode — Evidence-Based Coaching]\n\nFor your ${profile.dietPreference.replace('_', ' ')} preference and daily target of ~${targets.proteinGrams}g protein, here are the most cost-effective Indian protein sources:\n\n1. Soya Chunks (Wadi): 50g dry weight provides ~26g complete protein for very low cost. Boil, squeeze, and add to pulao or sabzi.\n2. Moong / Toor / Chana Dal + Roti: Combining lentils with whole wheat or rice provides complementary essential amino acids (~18–21g per meal).\n3. Low-fat Paneer or Tofu: 100g offers ~18–20g protein. Try Tawa Paneer Bhurji with minimal oil.\n4. Roasted Chana Sattu or Bhuna Chana: 45g as an evening snack adds ~11–13g protein plus gut-friendly fiber.\n\nNote: Nutrition values are approximate estimates based on IFCT data.`;
  }

  if (q.includes('squat') || q.includes('knee') || q.includes('form') || q.includes('pain') || q.includes('injury')) {
    return `[Demo Mode — Evidence-Based Coaching]\n\nIf you feel knee discomfort during squats or lunges, follow these biomechanical adjustments:\n\n1. Switch to Box Squats or Supine Glute Bridges: Sitting back onto a sturdy chair keeps your shins more vertical and reduces forward knee shear.\n2. Check Foot & Hip Alignment: Keep your entire foot planted (tripod foot) and track your knees gently in line with your 2nd and 3rd toes.\n3. Control the Tempo: Take 2–3 seconds to lower down and avoid bouncing at the bottom.\n\nSafety Reminder: If you experience sharp, stabbing, or persistent joint pain or swelling, stop the exercise immediately and consult a qualified physiotherapist or orthopedic specialist.`;
  }

  if (q.includes('push') || q.includes('chest') || q.includes('wrist') || q.includes('upper')) {
    return `[Demo Mode — Evidence-Based Coaching]\n\nTo master push-up form safely at ${profile.workoutLocation}:\n\n1. Start with an Incline: Place your hands on a sturdy bench, dining table, or countertop. This lets you keep a rigid core plank while learning proper scapular control.\n2. 45-Degree Elbow Tuck: Avoid flaring your elbows straight out to the sides (90°). Tuck them roughly 45° like an arrow to protect your shoulder joint.\n3. Wrist Comfort: If flat palms bother your wrists, grip a pair of hexagonal dumbbells on the floor to keep your wrists straight.`;
  }

  if (q.includes('weight') || q.includes('fat') || q.includes('calorie') || q.includes('plateau') || q.includes('diet')) {
    return `[Demo Mode — Evidence-Based Coaching]\n\nBased on your current weight (${profile.weightKg} kg) and goal (${profile.goal.replace('_', ' ')}), your estimated daily target is ~${targets.targetCalories} kcal with ~${targets.proteinGrams}g protein.\n\nKey principles for sustainable progress:\n1. Aim for 0.25–0.75 kg change per week: Daily scale weight fluctuates by 0.5–1.5 kg due to water, sodium, and digestion. Focus on your 7-day rolling average.\n2. Never Crash Diet: Avoid dropping below safe calorie floors or skipping meals—this causes muscle loss and rebound fatigue.\n3. Prioritize NEAT & Sleep: 7–8 hours of sleep and 7,000–8,000 daily steps often break plateaus more reliably than cutting food further.`;
  }

  return `[Demo Mode — Evidence-Based Coaching]\n\nHere is a practical tip tailored to your ${profile.daysPerWeek}-day/week ${profile.workoutLocation} routine:\n\n• Consistency beats intensity: Focus on completing your scheduled ${profile.sessionDurationMin}-minute sessions with clean technique and logging 1 extra repetition or slightly better control each week.\n• Nutrition synergy: Pair your workouts with ~${targets.proteinGrams}g daily protein spread evenly across your ${profile.mealFrequency} meals, and aim for ${targets.waterLiters}L of water.\n\nTry asking me specifically about "Indian vegetarian protein swaps", "knee-friendly squat form", "incline push-up progression", or "breaking a weight loss plateau". (For medical concerns, always consult a qualified healthcare professional.)`;
}
