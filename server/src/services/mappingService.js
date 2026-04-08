import { loadCSV } from "../utils/csvLoader.js";

/**
 * Service to handle static dataset mapping for Ayurvedic recommendations.
 * Following rule-based logic from guide.
 */

export const getStaticRecommendation = async (input) => {
    const {
        prakriti_primary,
        prakriti_secondary,
        vikriti = {}
    } = input;

    // Load dataset
    const dataset = await loadCSV("ayurveda_static_mapping_minimal_v3.csv");

    if (!dataset || dataset.length === 0) return null;

    // Rule: Identify the two most imbalanced doshas from ALL three (Vata, Pitta, Kapha)
    const vikritiScores = [
        { name: 'vata', pct: vikriti.vata_pct || 0 },
        { name: 'pitta', pct: vikriti.pitta_pct || 0 },
        { name: 'kapha', pct: vikriti.kapha_pct || 0 }
    ].sort((a, b) => b.pct - a.pct);

    let searchPrimary = vikritiScores[0].name;
    let searchSecondary = vikritiScores[1].name;
    let s_primaryPct = vikritiScores[0].pct;
    let s_secondaryPct = vikritiScores[1].pct;
    let s_tertiaryPct = vikritiScores[2].pct;

    // RULE: If all three doshas are close (Tridosha / Balanced)
    // Threshold: If the difference between highest and lowest is less than 15%, treat as balanced
    if (s_primaryPct - s_tertiaryPct < 15) {
        console.log("Detecting Balanced/Tridosha constitution (scores are close).");
        searchPrimary = "balanced";
        searchSecondary = "balanced";
    }

    console.log("Mapping Logic Input (Refined):", {
        prakriti: `${prakriti_primary || 'N/A'}-${prakriti_secondary || 'N/A'}`,
        searchPrimary,
        searchSecondary,
        s_primaryPct,
        s_secondaryPct
    });

    const runFilter = (p_dosha, s_dosha, p_pct, s_pct, relaxed = false) => {
        const isSecMeaningful = s_pct > 15;
        const flag = isSecMeaningful ? "yes" : "no";

        // Lower threshold hack: If pct is 25%, treat it as 50% just to get a 'Gentle' match
        const searchPct = p_pct < 50 && p_pct >= 25 ? 50 : p_pct;

        return dataset.filter((row) => {
            const primaryMatch = row.primary_dosha?.toLowerCase() === p_dosha.toLowerCase();
            if (!primaryMatch) return false;

            // If not relaxed, check secondary
            if (!relaxed) {
                const secondaryMatch = row.secondary_dosha?.toLowerCase() === s_dosha.toLowerCase();
                if (!secondaryMatch) return false;

                const meaningfulMatch = row.secondary_meaningful?.toLowerCase() === flag;
                if (!meaningfulMatch) return false;
            } else {
                // In relaxed mode, we prefer rows where secondary_meaningful is 'no'
                // But we'll take anything that matches the primary
            }

            const pMin = parseInt(row.primary_pct_min);
            const pMax = parseInt(row.primary_pct_max);
            const pRangeMatch = searchPct >= pMin && searchPct <= pMax;
            if (!pRangeMatch) return false;

            if (!relaxed && isSecMeaningful) {
                const sMin = parseInt(row.secondary_pct_min);
                const sMax = parseInt(row.secondary_pct_max);
                const sRangeMatch = s_pct >= sMin && s_pct <= sMax;
                if (!sRangeMatch) return false;
            }

            return true;
        });
    };

    // Level 1: Specific Dual-Dosha Match
    let matches = runFilter(searchPrimary, searchSecondary, s_primaryPct, s_secondaryPct);

    // Level 2: Relaxed Single-Dosha Match (if Level 1 fails and we have any imbalance)
    if (matches.length === 0 && s_primaryPct >= 25) {
        console.log(`No specific match for ${searchPrimary}-${searchSecondary}. Trying relaxed search for ${searchPrimary}...`);
        matches = runFilter(searchPrimary, null, s_primaryPct, 0, true);
    }

    // Level 3: Balanced Fallback
    if (matches.length === 0) {
        console.log("No specific or relaxed matches found. Attempting Balanced fallback...");
        const balancedRow = dataset.find(row => row.row_label === "fallback" || row.primary_dosha === "balanced");
        if (balancedRow) {
            console.log("✅ Using Balanced (Fallback) Row.");
            return {
                type: "static_dosha",
                data: balancedRow
            };
        }
        return null;
    }

    // Rule 6: Select closest match (minimal primary diff)
    const bestMatch = matches.reduce((prev, curr) => {
        const prevDiff = Math.abs(parseInt(prev.primary_pct_min) - s_primaryPct);
        const currDiff = Math.abs(parseInt(curr.primary_pct_min) - s_primaryPct);
        return currDiff < prevDiff ? curr : prev;
    });

    console.log("Found best static match:", bestMatch.row_label);
    return {
        type: "static_dosha",
        data: bestMatch
    };
};
