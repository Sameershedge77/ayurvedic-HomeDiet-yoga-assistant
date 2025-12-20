import { isAsanaSafe } from "./yogaSafety.js";

export function generateRecommendations({
  yogaData,
  remedyData,
  mappingData,
  userIssues
}) {
  let recommendedAsanas = [];
  let recommendedRemedies = [];
  let consultDoctor = false;

  for (let issue of userIssues) {
    const mapping = mappingData.find(m => m.health_issue === issue);
    if (!mapping) continue;

    // Doctor warning
    if (mapping.medical_consultation_required !== "none") {
      consultDoctor = true;
    }

    // Yoga
    if (mapping.recommended_asanas !== "none") {
      const asanaNames = mapping.recommended_asanas.split(";");
      const filteredAsanas = yogaData.filter(asana =>
        asanaNames.includes(asana.asana_name) &&
        isAsanaSafe(asana, userIssues)
      );
      recommendedAsanas.push(...filteredAsanas);
    }

    // Remedies
    const remedies = remedyData.filter(remedy =>
      remedy.health_issue_internal.includes(issue)
    );
    recommendedRemedies.push(...remedies);
  }

  return {
    asanas: [...new Map(recommendedAsanas.map(a => [a.asana_id, a])).values()],
    remedies: [...new Map(recommendedRemedies.map(r => [r.remedy_id, r])).values()],
    consultDoctor
  };
}
