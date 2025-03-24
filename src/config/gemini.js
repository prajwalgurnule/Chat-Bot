import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  // Load API key from environment variables
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  
  const MODEL_NAME = "gemini-1.5-flash";
  
  async function runChat(prompt) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };
  
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ];
  
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });
  
      const result = await chat.sendMessage(prompt);
      const response = result.response;
  
      console.log("Gemini Response:", response.text());
      return response.text();
    } catch (error) {
      console.error("Error in runChat:", error);
      return "Sorry, I encountered an error while processing your request. Please try again.";
    }
  }
  
  export default runChat;
  