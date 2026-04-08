
import * as agentService from "../services/agentService.js";
import db from "../config/db.js";
import { YOUTUBE_LINKS } from "../data/youtube_links.js";
import { normalizeKey } from "../services/recommendationService.js";

export const getMealPlan = async (req, res) => {
    try {
        const { userId } = req.body;

        // Fetch user profile from DB to pass to AI
        const [userRows] = await db.promise().query(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const [recRows] = await db.promise().query(
            "SELECT health_issues FROM user_recommendations WHERE user_id = ? order by created_at desc limit 1",
            [userId]
        );

        const userData = {
            ...userRows[0],
            healthIssues: recRows[0]?.health_issues?.split(", ") || []
        };

        const mealPlan = await agentService.generateMealPlan(userData);

        res.json({
            success: true,
            data: mealPlan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getYogaSequence = async (req, res) => {
    try {
        const { userId } = req.body;

        const [userRows] = await db.promise().query(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );

        const [recRows] = await db.promise().query(
            "SELECT health_issues FROM user_recommendations WHERE user_id = ? order by created_at desc limit 1",
            [userId]
        );

        const userData = {
            ...userRows[0],
            healthIssues: recRows[0]?.health_issues?.split(", ") || []
        };

        const sequenceData = await agentService.generateYogaSequence(userData);

        // Enrich with YouTube videos
        const enrichedSequence = sequenceData.sequence.map(item => {
            const normalized = normalizeKey(item.name);
            let video = YOUTUBE_LINKS[normalized];

            // Fallback: If no exact match (e.g. "Marjaryasana" vs "Marjariasana"), try partial match
            if (!video) {
                const matchingKey = Object.keys(YOUTUBE_LINKS).find(key =>
                    normalized.includes(key) || key.includes(normalized)
                );
                if (matchingKey) video = YOUTUBE_LINKS[matchingKey];
            }

            return { ...item, video };
        });

        res.json({
            success: true,
            data: { sequence: enrichedSequence }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
