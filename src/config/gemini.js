import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = "AIzaSyBYHAxwZhG6GjTzScBs8Za1gj1Yw1ihcXM"; // Replace with your actual API key

async function runChat(prompt) {
  try {
      // Initialize the GenerativeAI instance
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      // Configuration for text generation
      const generationConfig = {
          temperature: 0.9, // Controls randomness (0 = deterministic, 1 = creative)
          topK: 1, // Limits the model's token selection
          topP: 1, // Controls diversity via nucleus sampling
          maxOutputTokens: 2048, // Maximum length of the response
      };

      // Safety settings to filter harmful content
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

      // Start a chat session with the model
      const chat = model.startChat({
          generationConfig,
          safetySettings,
          history: [], // Optional: Add chat history if needed
      });

      // Send the user's prompt to the model
      const result = await chat.sendMessage(prompt);
      const response = result.response;

      // Log and return the response text
      console.log("Gemini Response:", response.text());
      return response.text();
  } catch (error) {
      // Handle errors gracefully
      console.error("Error in runChat:", error);
      return "Sorry, I encountered an error while processing your request. Please try again.";
  }
}

export default runChat;