import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { YOUTUBE_LINKS } from "../data/youtube_links.js";
import * as appointmentAgent from "./appointmentAgent.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = "llama-3.3-70b-versatile";

// In-memory cache for AI recommendations
const recommendationCache = new Map();
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

const AVAILABLE_ASANAS = [
  "Adho Mukha Svanasana.jpg", "anulom_vilom.jpg", "ardha_matsyendrasana.jpg", "balasana.jpg", "bhastrika.jpg",
  "bhujangasana.jpg", "dhanurasana.jpg", "gomukhasana.jpg", "kapalbhati.jpg", "malasana.jpg", "marjariasana.jpg",
  "matsyasana.jpg", "padmasana.jpg", "paschimottanasana.jpg", "pawanmuktasana.jpg", "setu_bandha.jpg", "shavasana.jpg",
  "sukhasana.jpg", "supta_baddha_konasana.jpg", "supta_padangusthasana.jpg", "surya_namaskar.jpg", "tadasana.jpg",
  "trikonasana.jpg", "ustrasana.jpg", "uttanasana.jpg", "vajrasana.jpg", "virbhadrasana.jpg", "vrikshasana.jpg"
];

const AVAILABLE_REMEDIES = [
  "ajwain_water.jpg", "amla_juice.jpg", "ashwagandha.jpg", "bitter_gourd_juice.jpg", "brahmi_leaves.jpg", "brahmi_tea.jpg",
  "cardomon_pods.jpg", "cinnamon_water.jpg", "cloves.jpg", "cummin_seeds.jpg", "fennel_water.jpg", "garlic_remedy.jpg",
  "giloy_juice.jpg", "ginger_lemon.jpg", "green_tea.jpg", "jatamansi_tea.jpg", "karela_juice.jpg", "kokum_drink.jpg",
  "methi_seeds.jpg", "neem_water.jpg", "nutmeg_milk.jpg", "steam.jpg", "triphala.jpg", "tulsi.jpg", "tulsi_ginger_kadha.jpg",
  "tulsi_honey.jpg", "tumeric_milk.jpg", "turmeric_honey.jpg"
];

export const analyzeHealthProfile = async (profileData) => {
  // Construct dynamic parts of the prompt based on critical conditions
  let specializedInstruction = "";

  const isPregnant = profileData.healthIssues.some(issue => /pregnan|maternity/i.test(issue)) ||
    profileData.symptoms.toLowerCase().includes("pregnant");
  const isChild = parseInt(profileData.age) <= 12;
  const isElderly = parseInt(profileData.age) >= 60;

  if (isPregnant) {
    specializedInstruction = `
    CRITICAL: The user is PREGNANT.
    - STRICTLY FORBID any poses that put pressure on the belly, deep twists, or inversions.
    - Recommend ONLY safe, gentle prenatal yoga (e.g., Cat-Cow, Butterfly, Side lying).
    - Remedies must be 100% safe for pregnancy.
    - Include a clear disclaimer: "Please consult your doctor before starting any new practice during pregnancy."
    `;
  } else if (isChild) {
    specializedInstruction = `
    CRITICAL: The user is a CHILD (Age ${profileData.age}).
    - Make yoga fun and playful (animals names).
    - Keep remedies very gentle and tasty if possible. No harsh herbs.
    - Focus on growth, immunity, and concentration.
    `;
  } else if (isElderly) {
    specializedInstruction = `
    CRITICAL: The user is ELDERLY (Age ${profileData.age}).
    - Focus on joint mobility, gentle chair yoga, or supported poses.
    - Avoid fast movements or balances without support.
    - Consider common issues like arthritis, BP, or diabetes if mentioned.
    `;
  }

  const ragContextString = profileData.contextData
    ? JSON.stringify(profileData.contextData, null, 2)
    : "No static context matched.";

  const prompt = `
    You are an Expert Ayurvedic Doctor.
    
    TASK: Analyze the user profile and generate a JSON response with specific Yoga and Remedy recommendations.
    
    CONSIDER INTERACTIONS: If the user is taking allopathic medicines, ensure Ayurvedic recommendations are safe and include a note in the summary or safety warning that they should consult their doctor before combining treatments.

    ${specializedInstruction}

    USER PROFILE:
    - Age: ${profileData.age}
    - Gender: ${profileData.gender}
    - Prakriti: ${profileData.prakriti || "Unknown"}
    - Issues: ${profileData.healthIssues.join(", ")}
    - Severity: ${profileData.severity}
    - Lifestyle: ${profileData.lifestyle}
    - Symptoms: ${profileData.symptoms}
    - Current Allopathic Medicines: ${profileData.allopathicMedicine || "None"}

    RAG CONTEXT (DATABASE MATCHES):
    Here is data retrieved from our expert database tailored to the user's Dosha and Health Issues:
    ${ragContextString}

    INSTRUCTIONS FOR RAG:
    - You MUST PRIORITIZE selecting the best 3-5 Yoga poses and Remedial herbs strictly from the "RAG CONTEXT" provided above.
    - Retain their EXACT names, spelling, provided duration, steps, ingredients, frequencies, restrictions, image keywords, and video links where applicable. Do not alter their core data.
    - If the RAG Context is empty, OR if the RAG context is completely inappropriate for the user's critical conditions (e.g. pregnancy, extreme age constraints), you may gracefully fallback to your own general Ayurvedic knowledge. However, the output format must remain exactly the same.

    AVAILABLE YOGA IMAGES (Match exactly if possible):
    ${AVAILABLE_ASANAS.join(", ")}

    AVAILABLE REMEDY IMAGES (Match exactly if possible):
    ${AVAILABLE_REMEDIES.join(", ")}

    YOUTUBE VIDEO KEYS (Use these names for "name" field to ensure video matching):
    ${Object.keys(YOUTUBE_LINKS).join(", ")}

    RESPONSE FORMAT (Strict JSON):
    {
      "summary": "Warm, personal summary (2 sentences).",
      "dosha_analysis": "Explanation of imbalance (2 sentences).",
      "recommendations": {
        "yoga": [
          {
            "name": "Sanskrit Name",
            "image_keyword": "EXACT string from 'AVAILABLE YOGA IMAGES' or empty",
            "benefits": "Short benefit.",
            "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
            "duration": "5-10 mins (Mandatory)",
            "contraindications": "Safety warning"
          }
        ],
        "ayurveda": [
          {
            "name": "Remedy Name",
            "image_keyword": "EXACT string from 'AVAILABLE REMEDY IMAGES' or empty",
            "usage": "Step-by-step preparation and usage.",
            "dosage_timing": "EXACT timing (e.g. 'Empty stomach morning', 'Before sleep'). Mandatory.",
            "benefits": "Why it works.",
            "type": "Herb/Lifestyle/Diet",
            "ingredients": "List ingredients",
            "preparation_time": "5 mins"
          }
        ],
        "diet_tips": ["Tip 1", "Tip 2", "Tip 3"],
        "lifestyle_tips": ["Tip 1", "Tip 2", "Tip 3"]
      },
      "safety_warning": "Specific safety warning."
    }
  `;

  // Generate a simple cache key based on profile data
  const cacheKey = JSON.stringify({
    age: profileData.age,
    gender: profileData.gender,
    issues: profileData.healthIssues.sort(),
    severity: profileData.severity,
    symptoms: profileData.symptoms,
    prakriti: profileData.prakriti,
    context: profileData.contextData ? true : false
  });

  // Check cache
  const cachedData = recommendationCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION)) {
    console.log("Serving recommendations from cache...");
    return cachedData.data;
  }

  // 1️⃣ Try Gemini First
  try {
    console.log("Attempting Gemini analysis...");
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(jsonString);

    // Save to cache
    recommendationCache.set(cacheKey, {
      timestamp: Date.now(),
      data: parsedData
    });

    console.log("✅ Gemini Success");
    return parsedData;
  } catch (geminiError) {
    console.warn("⚠️ Gemini failed, trying Groq fallback...", geminiError.message);

    // 2️⃣ Fallback to Groq if Gemini fails (especially for 429)
    try {
      console.log("Attempting Groq analysis (Llama 3.3)...");
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an Expert Ayurvedic Doctor. Always respond in strict JSON format as requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: GROQ_MODEL,
        response_format: { type: "json_object" }
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) throw new Error("Groq returned empty response");

      const parsedData = JSON.parse(responseContent);

      // Save to cache
      recommendationCache.set(cacheKey, {
        timestamp: Date.now(),
        data: parsedData
      });

      console.log("✅ Groq Success (Fallback)");
      return parsedData;
    } catch (groqError) {
      console.error("❌ Both AI Services Failed:", groqError);
      throw new Error("AI services are currently unavailable. Please try again in 1 minute.");
    }
  }
};

const toolDeclarations = [
  {
    functionDeclarations: [
      {
        name: "getAvailableDoctors",
        description: "Returns a list of available doctors with their specialties and fees.",
      },
      {
        name: "getUserProfile",
        description: "Returns the name and email of the user by their ID.",
        parameters: {
          type: "OBJECT",
          properties: {
            userId: { type: "NUMBER", description: "The ID of the user." },
          },
          required: ["userId"],
        },
      },
      {
        name: "checkAvailability",
        description: "Checks if a doctor is available at a specific date and time.",
        parameters: {
          type: "OBJECT",
          properties: {
            doctorId: { type: "NUMBER", description: "The ID of the doctor." },
            date: { type: "STRING", description: "The appointment date (YYYY-MM-DD)." },
            time: { type: "STRING", description: "The appointment time (HH:mm)." },
          },
          required: ["doctorId", "date", "time"],
        },
      },
      {
        name: "bookAppointmentRequest",
        description: "Creates a pending appointment request. Call this when the user has provided all details (name, email, doctor, date, time, problem).",
        parameters: {
          type: "OBJECT",
          properties: {
            userId: { type: "NUMBER", description: "The ID of the user." },
            doctorId: { type: "NUMBER", description: "The ID of the doctor." },
            patientName: { type: "STRING", description: "The name of the patient." },
            patientEmail: { type: "STRING", description: "The email of the patient." },
            problem: { type: "STRING", description: "The health issue or reason for appointment." },
            date: { type: "STRING", description: "The appointment date (YYYY-MM-DD)." },
            time: { type: "STRING", description: "The appointment time (HH:mm)." },
          },
          required: ["userId", "doctorId", "patientName", "patientEmail", "problem", "date", "time"],
        },
      },
    ],
  },
];

export const chatWithAyurBot = async (history, message, userId) => {
  // Define tools inside to capture userId
  const appointmentTools = {
    getAvailableDoctors: appointmentAgent.getAvailableDoctors,
    getUserProfile: (args) => appointmentAgent.getUserProfile({ ...args, userId }),
    checkAvailability: appointmentAgent.checkAvailability,
    bookAppointmentRequest: (args) => appointmentAgent.bookAppointmentRequest({ ...args, userId }),
  };

  // 1️⃣ Try Gemini Chat
  try {
    const chat = geminiModel.startChat({
      history: history,
      tools: toolDeclarations,
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
      },
      systemInstruction: {
        parts: [{
          text: `You are AyurBot, a highly efficient AI Appointment Agent.
          
          TASK: Help users with Ayurveda/Yoga and book doctor appointments.
          
          CONCISE RULE: Provide natural, human-like responses. Keep them around 60-100 words—not too short, but concise enough for a small chat window.
          
          BOOKING PROCESS:
          1. FIRST, call 'getUserProfile' to see if you already have the user's name/email.
          2. SECOND, ask for missing info (Doctor, Date, Time, Problem) one at a time.
          3. THIRD, call 'checkAvailability' for the chosen slot.
          4. FOURTH, once all data is collected and slot is checked, call 'bookAppointmentRequest'.
          5. FIFTH, tell the user to click the "Pay Now" button to confirm.
          
          CRITICAL:
          - DO NOT promise a booking until 'bookAppointmentRequest' returns success.
          - Current User ID: ${userId}.
          - Always end with: "Disclaimer: Consulting a doctor is advised."` }]
      }
    });

    let result = await chat.sendMessage(message);
    let response = await result.response;
    let responseText = response.text();

    // Check for function calls
    const calls = response.functionCalls();
    if (calls && calls.length > 0) {
      const toolResponses = [];
      for (const call of calls) {
        const fnName = call.name;
        const args = call.args;
        console.log(`AI calling tool: ${fnName}`, args);

        const fn = appointmentTools[fnName];
        if (fn) {
          const toolResult = await fn(args);
          toolResponses.push({
            functionResponse: {
              name: fnName,
              response: { content: toolResult },
            },
          });
        }
      }

      // Send tool results back to the model
      result = await chat.sendMessage(toolResponses);
      response = await result.response;
      responseText = response.text();

      // Check if any tool result was a successful booking and append a tag for frontend
      const bookingResult = toolResponses.find(r =>
        r.functionResponse.name === "bookAppointmentRequest" &&
        r.functionResponse.response.content.success
      );

      if (bookingResult) {
        const { appointmentId, amount } = bookingResult.functionResponse.response.content;
        responseText += `\n\n[PAYMENT_REQUIRED:${appointmentId}:${amount}]`;
      }
    }

    return responseText;
  } catch (geminiError) {
    console.warn("⚠️ Gemini Chat failed, trying Groq fallback...", geminiError.message);
    // Fallback to Groq if Gemini fails
    try {
      const groqHistory = history.map(h => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.parts[0].text
      }));

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an Expert Ayurvedic Health Assistant. Provide clear, human-like answers. Keep responses around 60-100 words. Use markdown and always include a medical disclaimer."
          },
          ...groqHistory,
          { role: "user", content: message }
        ],
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 300
      });

      return completion.choices[0]?.message?.content || "I apologize, but I am having trouble responding right now.";
    } catch (groqError) {
      console.error("❌ Both AI Chat Services Failed:", groqError);
      throw new Error("AyurBot is currently unavailable.");
    }
  }
};

export const chatWithAyurBotStream = async (history, message, userId, onChunk) => {
  const appointmentTools = {
    getAvailableDoctors: appointmentAgent.getAvailableDoctors,
    getUserProfile: (args) => appointmentAgent.getUserProfile({ ...args, userId }),
    checkAvailability: appointmentAgent.checkAvailability,
    bookAppointmentRequest: (args) => appointmentAgent.bookAppointmentRequest({ ...args, userId }),
  };

  try {
    const chat = geminiModel.startChat({
      history: history,
      tools: toolDeclarations,
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
      },
      systemInstruction: {
        parts: [{
          text: `You are AyurBot, a highly efficient AI Appointment Agent.
          
          TASK: Help users with Ayurveda/Yoga and book doctor appointments.
          
          CONCISE RULE: Provide natural, human-like responses. Keep them around 60-100 words—not too short, but concise enough for a small chat window.
          
          BOOKING PROCESS:
          1. FIRST, call 'getUserProfile'.
          2. Ask for missing info (Doctor, Date, Time, Problem) one at a time.
          3. Call 'checkAvailability' for the chosen slot.
          4. Call 'bookAppointmentRequest'.
          5. Tell the user to click the "Pay Now" button to confirm.
          
          CRITICAL:
          - Current User ID: ${userId}.
          - Always end with: "Disclaimer: Consulting a doctor is advised."` }]
      }
    });

    const result = await chat.sendMessageStream(message);
    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }

    const response = await result.response;
    const calls = response.functionCalls();

    if (calls && calls.length > 0) {
      const toolResponses = [];
      for (const call of calls) {
        const fnName = call.name;
        const args = call.args;
        const fn = appointmentTools[fnName];
        if (fn) {
          const toolResult = await fn(args);
          toolResponses.push({
            functionResponse: {
              name: fnName,
              response: { content: toolResult },
            },
          });
        }
      }

      const followUpResult = await chat.sendMessage(toolResponses);
      const followUpResponse = await followUpResult.response;
      let followUpText = followUpResponse.text();

      const bookingResult = toolResponses.find(r =>
        r.functionResponse.name === "bookAppointmentRequest" &&
        r.functionResponse.response.content.success
      );

      if (bookingResult) {
        const { appointmentId, amount } = bookingResult.functionResponse.response.content;
        followUpText += `\n\n[PAYMENT_REQUIRED:${appointmentId}:${amount}]`;
      }

      if (onChunk) onChunk(followUpText);
      fullText += followUpText;
    }

    return fullText;

  } catch (geminiError) {
    console.warn("⚠️ Gemini Stream failed, trying Groq fallback...", geminiError.message);

    try {
      // Convert Gemini history format to OpenAI/Groq format
      const groqHistory = history.map(h => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.parts[0].text
      }));

      const stream = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an Expert Ayurvedic Health Assistant. Provide clear, human-like answers. Keep responses around 60-100 words. Use markdown and always include a medical disclaimer."
          },
          ...groqHistory,
          { role: "user", content: message }
        ],
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 300,
        stream: true,
      });

      let fullText = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullText += content;
          if (onChunk) onChunk(content);
        }
      }

      return fullText;
    } catch (groqError) {
      console.error("❌ Both AI Services Failed (Stream):", groqError);
      throw new Error("AyurBot is currently unavailable.");
    }
  }
};
