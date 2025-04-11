const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get API key from environment variable
const genAI = new GoogleGenerativeAI("AIzaSyAOaM4w4LCzGELsLO4Vh4nXIs0HhoEQMLw");

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const generationConfig = {
      temperature: 0.2,  
      topK: 1,
      topP: 0.8,
    };
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro", 
      generationConfig,
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_LOW_AND_ABOVE"
        }
      ]
    });

    const chat = model.startChat({
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

    const result = await chat.sendMessage(message);
    const response = result.response;
    
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to process your request" });
  }
};