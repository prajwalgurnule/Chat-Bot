import { createContext, useState } from "react";
import runChat from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [listening, setListening] = useState(false); // State for voice recognition
    const [recognition, setRecognition] = useState(null); // State for SpeechRecognition object

    // Initialize SpeechRecognition
    const initializeRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false; // Stop after one sentence
            recognitionInstance.interimResults = false; // Only final results
            recognitionInstance.lang = 'en-US'; // Set language

            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript); // Set the transcribed text as input
                setListening(false); // Stop listening
            };

            recognitionInstance.onend = () => {
                setListening(false); // Reset listening state when recognition ends
            };

            setRecognition(recognitionInstance);
        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }
    };

    // Toggle voice recognition
    const toggleListening = () => {
        if (!recognition) {
            initializeRecognition();
        }

        if (listening) {
            recognition.stop(); // Stop recognition
            setListening(false);
        } else {
            recognition.start(); // Start recognition
            setListening(true);
        }
    };

    // Delay typing effect for the response
    const delayPara = (index, nextword) => {
        setTimeout(function () {
            setResultData(prev => prev + nextword);
        }, 75 * index);
    };

    // Reset chat
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setInput("");
        setResultData("");
    };

    // Handle sending prompts
    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }

        // Format the response
        let responseArray = response.split("");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += responseArray[i];
            }
        }

        let newResponse2 = newResponse.split("*").join("");
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextword = newResponseArray[i];
            delayPara(i, nextword + " ");
        }

        setLoading(false);
        setInput("");
    };

    // Edit prompt
    const editPrompt = (newPrompt) => {
        setRecentPrompt(newPrompt);
        setInput(newPrompt);
    };

    // Context value to be provided
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        listening,
        toggleListening,
        editPrompt, // Add editPrompt to context
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;