// Browser-compatible API client
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Initialize the API client
const genAI = new GoogleGenerativeAI("AIzaSyAOaM4w4LCzGELsLO4Vh4nXIs0HhoEQMLw");

// Chat model configuration
const generationConfig = {
  temperature: 0.2,  
  topK: 1,
  topP: 0.8,
};

// Create the model instance
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig,
  safetySettings: [
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    }
  ]
});

// Chat instance with fitness-focused system instructions
let chatSession;

// Initialize chat session
function initChat() {
  chatSession = model.startChat({
    history: [],
    generationConfig,
    safetySettings: [
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_LOW_AND_ABOVE"
      }
    ],
    systemInstruction: {
      role: "system",
      parts: [{ text: "You are a professional fitness assistant. ONLY answer questions related to fitness, workouts, nutrition, and health. For ANY questions outside of these topics, respond ONLY with: 'Aku hanya bisa menjawab pertanyaan terkait GYM dan WORKOUT ya adick-adick. Please be smart.'" }]
    }
  });
  return chatSession;
}

// Send message to API
async function sendMessage(message) {
  if (!chatSession) {
    initChat();
  }
  
  const result = await chatSession.sendMessage(message);
  return result.response.text();
}

export { initChat, sendMessage };