
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { YOUTUBE_LINKS } from "../data/youtube_links.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = "llama-3.3-70b-versatile";

export const generateMealPlan = async (userData) => {
  const prompt = `
    You are an Ayurvedic Nutritionist.
    User Info:
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Issues: ${userData.healthIssues?.join(", ")}
    - Prakriti: ${userData.prakriti || "Unknown"}

    TASK: Generate a 1-day Ayurvedic meal plan (Breakfast, Lunch, Dinner).
    For each meal, provide a name and a specific 'image_keyword'.
    CRITICAL: 'image_keyword' must be a simple, search-friendly dish name in English (e.g., 'oatmeal', 'khichdi', 'vegetable soup', 'pancakes', 'fruit salad') to ensure accurate photo matching. Avoid vague terms.

    RESPONSE FORMAT (Strict JSON):
    {
      "breakfast": { "name": "...", "image_keyword": "..." },
      "lunch": { "name": "...", "image_keyword": "..." },
      "dinner": { "name": "...", "image_keyword": "..." },
      "guna": "Summary of qualities",
      "tip": "Daily tip"
    }
  `;

  try {
    console.log("Attempting Gemini for Meal Plan...");
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("Gemini Meal Plan failed, trying Groq fallback...", error.message);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an Ayurvedic Nutritionist. Respond in strict JSON." },
          { role: "user", content: prompt }
        ],
        model: GROQ_MODEL,
        response_format: { type: "json_object" }
      });
      const responseContent = completion.choices[0]?.message?.content;
      return JSON.parse(responseContent);
    } catch (groqError) {
      console.error("Agent Service Error:", groqError);
      throw new Error("Failed to generate meal plan");
    }
  }
};

export const generateYogaSequence = async (userData) => {
  const prompt = `
    You are an Ayurvedic Yoga Expert.
    User Info: ${JSON.stringify(userData)}
    
    TASK: Create a 30-minute sequence.
    Include 5 poses with durations and special notes. 
    
    CRITICAL: Use ONLY these names for "name" to ensure video matching:
    ${Object.keys(YOUTUBE_LINKS).join(", ")}

    RESPONSE FORMAT (Strict JSON):
    {
      "sequence": [
        {"name": "...", "duration": "...", "reason": "..."}
      ]
    }
  `;

  try {
    console.log("Attempting Gemini for Yoga Sequence...");
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("Gemini Yoga Sequence failed, trying Groq fallback...", error.message);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an Ayurvedic Yoga Expert. Respond in strict JSON." },
          { role: "user", content: prompt }
        ],
        model: GROQ_MODEL,
        response_format: { type: "json_object" }
      });
      const responseContent = completion.choices[0]?.message?.content;
      return JSON.parse(responseContent);
    } catch (groqError) {
      console.error("Yoga Sequence Error:", groqError);
      throw new Error("Failed to generate yoga sequence");
    }
  }
};
