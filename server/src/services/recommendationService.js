import { loadCSV } from "../utils/csvLoader.js";
import { YOUTUBE_LINKS } from "../data/youtube_links.js";

/* ---------------- HELPERS ---------------- */

// normalize names for youtube keys (asana/remedy)
const normalizeKey = (name = "") =>
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

export const generateRecommendations = async (userInput) => {
  const { healthIssues } = userInput;

  if (!healthIssues || !Array.isArray(healthIssues)) {
    throw new Error("healthIssues must be an array");
  }

  // ✅ normalize user input
  const normalizedIssues = healthIssues.map(issue =>
    normalizeIssue(issue)
  );

  console.log("User issues:", normalizedIssues);

  // Load CSV data
  const yogaData = await loadCSV("yoga.csv");
  const remedyData = await loadCSV("remedies.csv");
  const issueMap = await loadCSV("health_issue_mapping.csv");

  console.log("Yoga rows:", yogaData.length);
  console.log("Remedy rows:", remedyData.length);
  console.log("Issue mappings:", issueMap.length);

  /* 1️⃣ Match health issues (handles back_pain vs back pain) */
  const matchedIssues = issueMap.filter(row => {
    const rawIssue =
      row.health_issue || row["\ufeffhealth_issue"];

    if (!rawIssue) return false;

    const csvIssue = normalizeIssue(rawIssue);
    return normalizedIssues.includes(csvIssue);
  });

  console.log(
    "Matched issues:",
    matchedIssues.map(i => i.health_issue || i["\ufeffhealth_issue"])
  );

  /* 2️⃣ Collect recommended asana names */
  const recommendedAsanaNames = matchedIssues.flatMap(row =>
    row.recommended_asanas
      ? row.recommended_asanas.split(";")
      : []
  );

  console.log("Recommended asanas:", recommendedAsanaNames);

  /* 3️⃣ Filter safe asanas */
  const safeAsanas = yogaData.filter(asana =>
    recommendedAsanaNames.includes(asana.asana_name) &&
    isAsanaSafe(asana, normalizedIssues)
  );

  /* 4️⃣ Attach images + YouTube to asanas */
  const asanasWithMedia = safeAsanas.map(asana => {
    const key = normalizeKey(asana.asana_name);
    return {
      name: asana.asana_name,
      image: asana.image_path,
      video: YOUTUBE_LINKS[key] || null,
      benefits: asana.benefits,
      duration: asana.duration_minutes,
    };
  });

  /* 5️⃣ Filter remedies */
  const matchedRemedies = remedyData.filter(remedy =>
    remedy.health_issue_internal
      ?.split(";")
      .some(issue =>
        normalizedIssues.includes(normalizeIssue(issue))
      )
  );

  /* 6️⃣ Attach images + YouTube to remedies */
  const remediesWithMedia = matchedRemedies.map(remedy => {
    const key = normalizeKey(remedy.remedy_name);
    return {
      name: remedy.remedy_name,
      image: remedy.image_path,
      video: YOUTUBE_LINKS[key] || null,
      ingredients: remedy.ingredients,
      preparation_time: remedy.preparation_time,
    };
  });

  /* 7️⃣ Final response */
  return {
    asanas: asanasWithMedia,
    remedies: remediesWithMedia,
    safety_note:
      "All recommendations are filtered using safety rules. Consult a certified doctor for severe or persistent conditions.",
  };
};
