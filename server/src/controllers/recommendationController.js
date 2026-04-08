import db from "../config/db.js";
import { analyzeHealthProfile } from "../services/aiService.js";
import { YOUTUBE_LINKS } from "../data/youtube_links.js";
import { getRetrievalContext, normalizeKey, generateRecommendations } from "../services/recommendationService.js";
import { loadCSV } from "../utils/csvLoader.js";

export const getRecommendations = async (req, res) => {
  try {
    console.time("RecommendationTime");
    const {
      healthIssues,
      lifestyle,
      severity,
      preferences,
      userId,
      age,
      gender,
      prakriti,
      stressLevel,
      symptoms,
      allopathicMedicine
    } = req.body;

    // basic validation
    if (!healthIssues || !Array.isArray(healthIssues)) {
      return res.status(400).json({
        success: false,
        message: "healthIssues must be an array"
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    console.log("Generating AI recommendations for user:", userId);

    // 1️⃣ Try Static Mapping First
    const p_primary = req.body.prakriti_primary || prakriti;
    const p_secondary = req.body.prakriti_secondary;

    console.log("Checking RAG Mapping for:", {
      p_primary,
      p_secondary,
      vikriti: req.body.vikriti
    });

    // 1️⃣ ALWAYS GET RAG CONTEXT FROM DATABASE
    const contextData = await getRetrievalContext(req.body);

    let finalResponse;
    let source = "AI_RAG_GENERATED";

    // 2️⃣ PASS TO AI SERVICE
    console.log("Calling AI Service with RAG context...");
    try {
      const aiResponse = await analyzeHealthProfile({
        age,
        gender,
        p_primary,
        p_secondary,
        prakriti, // fallback
        healthIssues,
        lifestyle,
        severity,
        stressLevel,
        symptoms,
        allopathicMedicine,
        contextData // <-- NEW: RAG Context injected here
      });

      const recommendationsObj = aiResponse.recommendations || aiResponse;
      const yoga = recommendationsObj.yoga || [];
      const remedies = recommendationsObj.ayurveda || recommendationsObj.remedies || [];

      // Enrich with YouTube videos just in case the AI generated new ones
      const getBestVideoMatch = (name) => {
        const key = normalizeKey(name);
        if (YOUTUBE_LINKS[key]) return YOUTUBE_LINKS[key];
        const allKeys = Object.keys(YOUTUBE_LINKS);
        const partialMatch = allKeys.find(k => key.includes(k) || k.includes(key));
        return partialMatch ? YOUTUBE_LINKS[partialMatch] : null;
      };

      const enrichedYoga = yoga.map(item => ({ ...item, video: item.video || getBestVideoMatch(item.name) }));
      const enrichedRemedies = remedies.map(item => ({ ...item, video: item.video || getBestVideoMatch(item.name) }));

      finalResponse = {
        ...aiResponse,
        recommendations: {
          ...recommendationsObj,
          yoga: enrichedYoga,
          ayurveda: enrichedRemedies,
          remedies: enrichedRemedies
        }
      };
    } catch (aiError) {
      console.error("AI Service Error:", aiError.message);
      return res.status(503).json({
        success: false,
        message: "Recommendation services are temporarily busy. Please try again."
      });
    }

    // 3️⃣ SAVE recommendation to DB
    try {
      await db.promise().query(
        `INSERT INTO user_recommendations
        (user_id, health_issues, lifestyle, severity, preferences, yoga, remedies)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          healthIssues.join(", "),
          lifestyle || null,
          severity || null,
          preferences || null,
          JSON.stringify(finalResponse.recommendations.yoga || []),
          JSON.stringify({
            ...finalResponse.recommendations,
            summary: finalResponse.summary,
            doshaAnalysis: finalResponse.dosha_analysis
          })
        ]
      );
    } catch (dbErr) {
      console.error("DB Save failed (non-fatal):", dbErr);
    }

    // 4️⃣ Return response
    console.timeEnd("RecommendationTime");
    res.json({
      success: true,
      recommendations: finalResponse,
      source: source
    });

  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({
      success: false,
      message: "Recommendation failed: " + err.message
    });
  }
};
