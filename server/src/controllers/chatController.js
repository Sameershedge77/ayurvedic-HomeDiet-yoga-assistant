import { chatWithAyurBot, chatWithAyurBotStream } from "../services/aiService.js";
import db from "../config/db.js";

// Helper to save message
const saveMessage = (userId, role, message) => {
    const sql = "INSERT INTO chat_messages (userId, role, message) VALUES (?, ?, ?)";
    db.query(sql, [userId, role, message], (err) => {
        if (err) console.error("Error saving message:", err);
    });
};

export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const sql = "SELECT role, message as text FROM chat_messages WHERE userId = ? ORDER BY timestamp ASC";
        db.query(sql, [userId], (err, rows) => {
            if (err) throw err;
            res.json({ success: true, history: rows });
        });
    } catch (err) {
        console.error("History error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch history" });
    }
};

export const chatWithBot = async (req, res) => {
    try {
        const { history, message, userId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Save user message
        if (userId) saveMessage(userId, "user", message);

        const responseText = await chatWithAyurBot(history || [], message, userId);

        // Save model response
        if (userId) saveMessage(userId, "model", responseText);

        res.json({
            success: true,
            response: responseText
        });

    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({
            success: false,
            message: "Chat failed: " + err.message
        });
    }
};

export const chatWithBotStream = async (req, res) => {
    try {
        const { history, message, userId } = req.body;

        if (!message) return res.status(400).send("Message is required");

        // Save user message
        if (userId) saveMessage(userId, "user", message);

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let fullText = "";
        await chatWithAyurBotStream(history || [], message, userId, (chunk) => {
            fullText += chunk;
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        });

        // Save model response once finished
        if (userId) saveMessage(userId, "model", fullText);

        res.write("data: [DONE]\n\n");
        res.end();

    } catch (err) {
        console.error("Stream error:", err);
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    }
};
