import { loadCSV } from "../utils/csvLoader.js";
import { YOUTUBE_LINKS } from "../data/youtube_links.js";
import { getStaticRecommendation } from "./mappingService.js";

/* ---------------- YOGA STEPS LIBRARY ---------------- */

const YOGA_STEPS_DB = {
  bhujangasana: [
    "Lie flat on your stomach with legs together and tops of feet on the floor.",
    "Place hands under shoulders, elbows close to the body.",
    "Inhale and slowly lift your chest off the floor while keeping the navel down.",
    "Keep shoulders relaxed and gaze slightly upward.",
    "Hold for 15-30 seconds, then exhale and lower slowly."
  ],
  balasana: [
    "Kneel on the floor with big toes touching and sit on your heels.",
    "Separate your knees about hip-width apart.",
    "Exhale and lay your torso down between your thighs.",
    "Rest your forehead on the mat and stretch your arms forward or alongside the body.",
    "Breathe deeply and hold for 1-3 minutes."
  ],
  tadasana: [
    "Stand with feet together or slightly apart, arms at sides.",
    "Distribute weight evenly on both feet.",
    "Inhale, lift your arches, and engage your leg muscles.",
    "Roll shoulders back and down, gaze forward.",
    "Breathe steadily and feel the length in your spine."
  ],
  vrikshasana: [
    "Stand in Tadasana, shift weight to the left foot.",
    "Place the right foot on the inner left thigh (avoid the knee).",
    "Bring palms together in prayer position at the chest or overhead.",
    "Find a focal point in front and maintain balance.",
    "Hold for 30 seconds, then switch legs."
  ],
  setu_bandha: [
    "Lie on your back with knees bent and feet hip-width apart.",
    "Keep arms alongside the body, palms down.",
    "Inhale, press your feet into the floor, and lift your hips.",
    "Interlace hands under your back and stay on top of your shoulders.",
    "Hold for 30-60 seconds, then exhaling, roll down slowly."
  ],
  anulom_vilom: [
    "Sit in a comfortable cross-legged position with spine straight.",
    "Close the right nostril with the thumb and inhale deeply through the left.",
    "Close the left nostril with the ring finger and exhale through the right.",
    "Inhale through the right, then close it and exhale through the left.",
    "Continue this cycle for 5-10 minutes."
  ],
  kapalbhati: [
    "Sit comfortably with a straight back.",
    "Inhale deeply through both nostrils.",
    "Exhale forcefully by contracting your abdominal muscles.",
    "Allow the inhalation to happen passively.",
    "Start with 20-30 breaths per round."
  ],
  surya_namaskar: [
    "1. Prayer Pose (Pranamasana): Stand at the edge of the mat.",
    "2. Raised Arms Pose (Hastauttanasana): Inhale and lift arms up and back.",
    "3. Hand to Foot Pose (Hastapadasana): Exhale and bend forward to touch feet.",
    "4. Ashwa Sanchalanasana: Inhale, push right leg back, look up.",
    "5. Plank Pose (Dandasana): Bring both legs back, body in straight line.",
    "6. Ashtanga Namaskara: Knees, chest, and chin to floor.",
    "7. Cobra Pose (Bhujangasana): Slide forward into a backbend.",
    "8. Mountain Pose (Parvatasana): Lift hips into inverted V.",
    "9. Ashwa Sanchalanasana: Right foot forward between hands.",
    "10. Hastapadasana: Exhale, bring left foot forward.",
    "11. Hastauttanasana: Inhale, lift arms and bend back.",
    "12. Pranamasana: Return to prayer pose."
  ],
  sukhasana: [
    "Sit with legs stretched out in front.",
    "Fold your legs and tuck your feet under opposite thighs.",
    "Keep your spine straight, shoulders relaxed, and hands on knees.",
    "Close your eyes and focus on deep, steady breathing.",
    "Maintain this pose for 5-10 minutes during meditation."
  ],
  marjariasana: [
    "Start on your hands and knees in a tabletop position.",
    "Inhale, drop your belly, and look up toward the ceiling (Cow Pose).",
    "Exhale, round your spine, and tuck your chin toward your chest (Cat Pose).",
    "Flow between these two movements with your breath.",
    "Repeat for 10-15 rounds to improve spinal flexibility."
  ],
  uttanasana: [
    "Stand in Tadasana with hands on hips.",
    "Exhale and fold forward from the hip joints, not the waist.",
    "Reach your hands toward the floor or grab your ankles.",
    "Let your head hang heavy and keep knees slightly bent if needed.",
    "Hold for 30-60 seconds."
  ],
  paschimottanasana: [
    "Sit with legs straight out in front and feet flexed.",
    "Inhale and reach your arms overhead.",
    "Exhale and fold forward toward your feet, keeping spine long.",
    "Hold your shins, ankles, or feet.",
    "Stay in the pose for 1-3 minutes."
  ],
  vajrasana: [
    "Kneel on the floor with knees together.",
    "Lower your hips onto your heels with toes pointing back.",
    "Place hands on your knees and keep your back straight.",
    "Breathe deeply and hold for 5-10 minutes, ideally after meals.",
    "This pose aids digestion significantly."
  ],
  ustrasana: [
    "Kneel on the floor with knees hip-width apart.",
    "Place hands on the lower back, fingers pointing down.",
    "Inhale and lift your chest, leaning back slowly.",
    "If comfortable, reach hands down to hold your heels.",
    "Hold for 20-30 seconds, then release slowly."
  ],
  dhanurasana: [
    "Lie on your stomach with feet hip-width apart and arms at sides.",
    "Fold your knees and hold your ankles with your hands.",
    "Inhale and lift your chest and thighs off the floor.",
    "Look forward and breathe steadily.",
    "Hold for 15-20 seconds and relax."
  ],
  pawanmuktasana: [
    "Lie on your back with legs straight.",
    "Exhale, bend both knees, and pull them toward your chest.",
    "Clasp your hands around your shins.",
    "Lift your head and try to touch your nose to your knees.",
    "Hold for 30 seconds and release."
  ],
  bhastrika: [
    "Sit in a comfortable pose with back straight.",
    "Take a deep breath in and exhale forcefully through the nose.",
    "Inhale immediately with the same force.",
    "Continue this rhythmic bellows-breathing.",
    "Do 10-20 breaths per round for 3 rounds."
  ],
  supta_padangusthasana: [
    "Lie on your back with legs extended.",
    "Inhale and lift your right leg toward the ceiling.",
    "Loop a strap around the foot or hold the big toe.",
    "Keep the left leg grounded and the right leg straight.",
    "Hold for 1 minute, then switch sides."
  ],
  ardha_matsyendrasana: [
    "Sit with legs straight, then bend the right leg and place the foot outside the left hip.",
    "Fold the left leg and place the foot outside the right hip.",
    "Inhale, lift the left arm, and twist to the right.",
    "Place the left elbow outside the right knee.",
    "Hold for 30-60 seconds and repeat on the other side."
  ],
  gomukhasana: [
    "Sit and cross your left leg over the right so knees are stacked.",
    "Bring your right arm up and bend it behind your neck.",
    "Bring your left arm behind your back and try to clasp hands.",
    "Keep chest open and spine straight.",
    "Hold for 30-60 seconds, then switch sides."
  ],
  malasana: [
    "Squat with feet as wide as the mat, toes pointing slightly out.",
    "Bring your palms together at your chest.",
    "Press your elbows against your inner knees.",
    "Keep your spine long and shoulders down.",
    "Stay in the pose for 1 minute."
  ],
  supta_baddha_konasana: [
    "Lie on your back and bend your knees.",
    "Bring the soles of your feet together and let knees fall to the sides.",
    "Place hands on your belly or arms overhead.",
    "Relax deeply and breathe into the hips.",
    "Stay for 5-10 minutes."
  ]
};

/* ---------------- HELPERS ---------------- */

// normalize names for youtube keys (asana/remedy)
export const normalizeKey = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

// normalize health issues (back pain → back_pain)
const normalizeIssue = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

/* ---------------- SAFETY CHECK ---------------- */

export const isAsanaSafe = (asana, userIssues) => {
  if (!asana.contraindicated_for || asana.contraindicated_for === "none") {
    return true;
  }

  const contraindications = asana.contraindicated_for
    .toLowerCase()
    .split(";");

  return !userIssues.some(issue =>
    contraindications.includes(issue)
  );
};

/* ---------------- MAIN ENGINE ---------------- */

export const getRetrievalContext = async (userInput) => {
  const {
    healthIssues,
    prakriti_primary,
    prakriti_secondary,
    vikriti
  } = userInput;

  /* ---------------- 1️⃣ LOAD CSV DATA ---------------- */

  const yogaData = await loadCSV("yoga.csv");
  const remedyData = await loadCSV("remedies.csv");
  const issueMap = await loadCSV("health_issue_mapping.csv");

  const normalizedIssues = (healthIssues || []).map(i =>
    normalizeIssue(i)
  );

  // Fallback: Map primary/secondary doshas to common "issues" to ensure we always have recommendations
  const doshaToIssues = {
    vata: ["stress", "anxiety", "insomnia", "constipation", "back_pain"],
    pitta: ["acidity", "headache", "stress", "skin_issues"],
    kapha: ["obesity", "weak_immunity", "bloating", "stiffness"],
    balanced: ["stress", "weak_immunity", "digestive_problems"]
  };

  const searchIssues = [...normalizedIssues];
  if (prakriti_primary) {
    const d1 = prakriti_primary.toLowerCase();
    if (doshaToIssues[d1]) searchIssues.push(...doshaToIssues[d1]);
  }
  if (prakriti_secondary) {
    const d2 = prakriti_secondary.toLowerCase();
    if (doshaToIssues[d2]) searchIssues.push(...doshaToIssues[d2]);
  }

  /* ---------------- 2️⃣ ISSUE → YOGA ---------------- */

  const matchedIssues = issueMap.filter(row => {
    const rawIssue = row.health_issue || row["\ufeffhealth_issue"];
    if (!rawIssue) return false;

    const csvIssue = normalizeIssue(rawIssue);
    return searchIssues.includes(csvIssue);
  });

  const recommendedAsanaNames = matchedIssues.flatMap(row =>
    row.recommended_asanas
      ? row.recommended_asanas.split(";")
      : []
  );

  const safeAsanas = yogaData.filter(asana =>
    recommendedAsanaNames.includes(asana.asana_name) &&
    isAsanaSafe(asana, normalizedIssues)
  );

  const asanasWithMedia = safeAsanas.map(asana => {
    let key = normalizeKey(asana.asana_name);

    // Choose the best steps
    let steps = YOGA_STEPS_DB[key];
    if (!steps || steps.length < 2) {
      steps = asana.steps ? asana.steps.split(";").map(s => s.trim()) : ["Prepare for " + asana.asana_name];
    }

    // Determine reps/sets based on difficulty or name
    let reps = "3-5 rounds";
    if (key.includes("pranayama") || key.includes("bhati") || key.includes("vilom")) reps = "5-10 mins";
    if (key.includes("namaskar")) reps = "12 rounds";

    // Fix: extract filename from path
    const imageFilename = asana.image_path ? asana.image_path.split('/').pop() : null;

    return {
      name: asana.asana_name,
      image_keyword: imageFilename,
      video: YOUTUBE_LINKS[key] || YOUTUBE_LINKS[key.replace("_churna", "")] || null,
      benefits: asana.benefits,
      steps: steps,
      duration: asana.duration_minutes ? `${asana.duration_minutes} mins` : "5-10 mins",
      reps_sets: reps,
      contraindications: asana.contraindicated_for || "None"
    };
  });

  /* ---------------- 3️⃣ ISSUE → REMEDIES ---------------- */

  const matchedRemedies = remedyData.filter(remedy =>
    remedy.health_issue_internal
      ?.split(";")
      .some(issue =>
        searchIssues.includes(normalizeIssue(issue))
      )
  );

  const remediesWithMedia = matchedRemedies.map(remedy => {
    const key = normalizeKey(remedy.remedy_name);
    const imageFilename = remedy.image_path ? remedy.image_path.split('/').pop() : null;

    return {
      name: remedy.remedy_name,
      image_keyword: imageFilename,
      video: YOUTUBE_LINKS[key] || YOUTUBE_LINKS[key.replace("_churna", "")] || YOUTUBE_LINKS[key.split("_")[0]] || null,
      benefits: remedy.benefits || "Supports holistic health.",
      usage: remedy.usage_instructions || remedy.ingredients || "Consult practitioner.",
      dosage_timing: remedy.notes || "Follow practitioner guidance.",
      frequency: remedy.notes?.toLowerCase().includes("night") ? "Once daily at night" : "1-2 times daily",
      ingredients: remedy.ingredients || "Natural herbs.",
      preparation_time: remedy.preparation_time ? `${remedy.preparation_time} mins` : "5 mins",
      type: remedy.type || "Herbal"
    };
  });

  // Limit to a reasonable amount for context window (e.g. 15 each max)
  const limitedAsanas = asanasWithMedia.slice(0, 15);
  const limitedRemedies = remediesWithMedia.slice(0, 15);

  return {
    yoga: limitedAsanas,
    remedies: limitedRemedies
  };
};

export const generateRecommendations = async (userInput) => {
  const {
    healthIssues,
    prakriti_primary,
    prakriti_secondary,
    vikriti,
    mode // New: allow switching to AI
  } = userInput;

  /* ---------------- 0️⃣ CHECK FOR AI OVERRIDE ---------------- */
  if (mode === 'ai') {
    console.log("Switching to AI Mode as requested by user.");
    return null;
  }

  /* ---------------- 1️⃣ TRY STATIC DOSHA MAPPING ---------------- */

  const staticDosha = await getStaticRecommendation({
    prakriti_primary,
    prakriti_secondary,
    vikriti
  });

  /* ---------------- 2️⃣ LOAD CSV DATA ---------------- */

  const yogaData = await loadCSV("yoga.csv");
  const remedyData = await loadCSV("remedies.csv");
  const issueMap = await loadCSV("health_issue_mapping.csv");

  const normalizedIssues = (healthIssues || []).map(i =>
    normalizeIssue(i)
  );

  // Fallback: Map primary/secondary doshas to common "issues" to ensure we always have recommendations
  const doshaToIssues = {
    vata: ["stress", "anxiety", "insomnia", "constipation", "back_pain"],
    pitta: ["acidity", "headache", "stress", "skin_issues"],
    kapha: ["obesity", "weak_immunity", "bloating", "stiffness"],
    balanced: ["stress", "weak_immunity", "digestive_problems"]
  };

  const searchIssues = [...normalizedIssues];
  if (prakriti_primary) {
    const d1 = prakriti_primary.toLowerCase();
    if (doshaToIssues[d1]) searchIssues.push(...doshaToIssues[d1]);
  }
  if (prakriti_secondary) {
    const d2 = prakriti_secondary.toLowerCase();
    if (doshaToIssues[d2]) searchIssues.push(...doshaToIssues[d2]);
  }
  if (staticDosha && staticDosha.data && staticDosha.data.primary_dosha === "balanced") {
    searchIssues.push(...doshaToIssues.balanced);
  }

  const matchedIssues = issueMap.filter(row => {
    const rawIssue = row.health_issue || row["\ufeffhealth_issue"];
    if (!rawIssue) return false;

    const csvIssue = normalizeIssue(rawIssue);
    return searchIssues.includes(csvIssue);
  });

  const recommendedAsanaNames = matchedIssues.flatMap(row =>
    row.recommended_asanas
      ? row.recommended_asanas.split(";")
      : []
  );

  const safeAsanas = yogaData.filter(asana =>
    recommendedAsanaNames.includes(asana.asana_name) &&
    isAsanaSafe(asana, normalizedIssues)
  );

  const asanasWithMedia = safeAsanas.map(asana => {
    let key = normalizeKey(asana.asana_name);

    // Choose the best steps
    let steps = YOGA_STEPS_DB[key];
    if (!steps || steps.length < 2) {
      steps = asana.steps ? asana.steps.split(";").map(s => s.trim()) : ["Prepare for " + asana.asana_name];
    }

    // Determine reps/sets based on difficulty or name
    let reps = "3-5 rounds";
    if (key.includes("pranayama") || key.includes("bhati") || key.includes("vilom")) reps = "5-10 mins";
    if (key.includes("namaskar")) reps = "12 rounds";

    // Fix: extract filename from path
    const imageFilename = asana.image_path ? asana.image_path.split('/').pop() : null;

    return {
      name: asana.asana_name,
      image_keyword: imageFilename,
      video: YOUTUBE_LINKS[key] || YOUTUBE_LINKS[key.replace("_churna", "")] || null,
      benefits: asana.benefits,
      steps: steps,
      duration: asana.duration_minutes ? `${asana.duration_minutes} mins` : "5-10 mins",
      reps_sets: reps,
      contraindications: asana.contraindicated_for || "None"
    };
  });

  /* ---------------- 4️⃣ ISSUE → REMEDIES ---------------- */

  const matchedRemedies = remedyData.filter(remedy =>
    remedy.health_issue_internal
      ?.split(";")
      .some(issue =>
        searchIssues.includes(normalizeIssue(issue))
      )
  );

  const remediesWithMedia = matchedRemedies.map(remedy => {
    const key = normalizeKey(remedy.remedy_name);
    const imageFilename = remedy.image_path ? remedy.image_path.split('/').pop() : null;

    return {
      name: remedy.remedy_name,
      image_keyword: imageFilename,
      video: YOUTUBE_LINKS[key] || YOUTUBE_LINKS[key.replace("_churna", "")] || YOUTUBE_LINKS[key.split("_")[0]] || null,
      benefits: remedy.benefits || "Supports holistic health.",
      usage: remedy.usage_instructions || remedy.ingredients || "Consult practitioner.",
      dosage_timing: remedy.notes || "Follow practitioner guidance.",
      frequency: remedy.notes?.toLowerCase().includes("night") ? "Once daily at night" : "1-2 times daily",
      ingredients: remedy.ingredients || "Natural herbs.",
      preparation_time: remedy.preparation_time ? `${remedy.preparation_time} mins` : "5 mins",
      type: remedy.type || "Herbal"
    };
  });

  // Limit to top 5 recommendations each
  const limitedAsanas = asanasWithMedia.slice(0, 5);
  const limitedRemedies = remediesWithMedia.slice(0, 5);

  /* ---------------- 5️⃣ IF STATIC DOSHA FOUND ---------------- */

  if (staticDosha && staticDosha.data) {
    const row = staticDosha.data;

    // Generate a human-friendly Dosha Analysis paragraph
    let descriptiveAnalysis = "";
    if (row.primary_dosha === "balanced") {
      descriptiveAnalysis = "Your profile shows a rare and harmonious balance of Vata, Pitta, and Kapha. This state of Tridoshic equilibrium suggests strong natural immunity and stability. We recommend a balanced routine that sustains this harmony without tipping into any extreme.";
    } else {
      const p = row.primary_dosha?.toUpperCase() || "";
      const s = row.secondary_dosha?.toUpperCase() || "";
      descriptiveAnalysis = `Your constitution is primarily governed by ${p} energy with a significant ${s} influence. Currently, ${p} is the most active dosha in your system, which may manifest as ${p === 'VATA' ? 'irregularity and dryness' : p === 'PITTA' ? 'excess heat and intensity' : 'heaviness and congestion'}. Balancing these forces will restore your natural vitality.`;
    }

    return {
      success: true,
      source: "STATIC_MAPPING",
      summary: row.dosha_insight || `Personalized Ayurvedic plan to balance ${prakriti_primary || 'your'} constitution.`,
      dosha_analysis: descriptiveAnalysis,
      recommendations: {
        yoga: limitedAsanas,
        ayurveda: limitedRemedies,
        remedies: limitedRemedies, // Keep both for frontend compatibility
        diet_tips: row.diet_do_base ? row.diet_do_base.split(";") : [],
        lifestyle_tips: row.lifestyle_do_base ? row.lifestyle_do_base.split(";") : [],
        // Rich details
        diet_do: row.diet_do_base,
        diet_dont: row.diet_dont_base,
        lifestyle_do: row.lifestyle_do_base,
        lifestyle_dont: row.lifestyle_dont_base,
        exercise_do: row.exercise_do_base,
        exercise_dont: row.exercise_dont_base,
        ayurvedic_support: row.meds_base,
        support_timing: row.meds_timing_base,
        frequency_plan: row.frequency_plan,
        secondary_constraints: row.secondary_constraints
      },
      safety_warning: row.safety_note || "Consult a qualified practitioner before following remedies."
    };
  }

  /* ---------------- 6️⃣ STATIC FAILED → RETURN NULL ---------------- */

  return null;
};
