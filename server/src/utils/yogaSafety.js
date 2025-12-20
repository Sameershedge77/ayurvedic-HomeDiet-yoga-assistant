export function isAsanaSafe(asana, userIssues) {
  const contraindications = asana.contraindicated_for
    ? asana.contraindicated_for.split(";")
    : [];

  // ❌ Block if user's issue is contraindicated
  for (let issue of userIssues) {
    if (contraindications.includes(issue)) {
      return false;
    }
  }

  // ❌ Block standing poses if ankle/knee pain
  if (
    asana.weight_bearing === "TRUE" &&
    (userIssues.includes("ankle_pain") || userIssues.includes("knee_pain"))
  ) {
    return false;
  }

  return true;
}
