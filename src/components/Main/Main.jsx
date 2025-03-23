import React, { useContext, useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../Context/Context';
import robot from "../../assets/robot.gif";
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons for theme toggle
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Prism.js theme
import 'prismjs/components/prism-python'; // Add language support (e.g., Python)
import 'prismjs/components/prism-javascript'; // Add more languages as needed

const Main = () => {
    const {
        onSent,
        recentPrompt,
        showResult,
        loading,
        resultData,
        setInput,
        input,
        toggleListening,
        listening,
        editPrompt,
    } = useContext(Context);

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    // Toggle between light and dark mode
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    // Apply theme to the body
    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    // Handle copying text to clipboard
    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy text:", error);
            alert("Failed to copy text.");
        }
    };

    // Handle like action
    const handleLike = () => {
        alert("Liked!");
    };

    // Handle dislike action
    const handleDislike = () => {
        alert("Disliked!");
    };

    // Handle editing the prompt
    const handleEdit = () => {
        const newPrompt = prompt("Edit your prompt:", recentPrompt);
        if (newPrompt !== null) {
            editPrompt(newPrompt);
        }
    };

    // Format the response with syntax highlighting for code blocks
    const formatResponse = (text) => {
        const lines = text.split('\n');
        let formattedLines = [];
        let codeBlock = [];
        let inCodeBlock = false;
        let language = "";

        lines.forEach((line, index) => {
            if (line.startsWith("Method")) {
                formattedLines.push(<p key={index}><strong>{line}</strong></p>);
            } else if (line.startsWith("```")) {
                if (inCodeBlock) {
                    // End code block
                    const codeText = codeBlock.join('\n');
                    const highlightedCode = Prism.highlight(
                        codeText,
                        Prism.languages[language] || Prism.languages.plaintext,
                        language
                    );

                    formattedLines.push(
                        <div key={index} className="code-block">
                            <div className="code-language">{language}</div>
                            <pre>
                                <code
                                    className={`language-${language}`}
                                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                                />
                            </pre>
                            <button onClick={() => handleCopy(codeText)}>Copy</button>
                        </div>
                    );
                    codeBlock = [];
                    inCodeBlock = false;
                    language = "";
                } else {
                    // Start code block
                    inCodeBlock = true;
                    language = line.replace("```", "").trim() || "plaintext";
                }
            } else if (inCodeBlock) {
                codeBlock.push(line);
            } else {
                formattedLines.push(<p key={index}>{line}</p>);
            }
        });

        // Handle unclosed code blocks (edge case)
        if (inCodeBlock && codeBlock.length > 0) {
            const codeText = codeBlock.join('\n');
            const highlightedCode = Prism.highlight(
                codeText,
                Prism.languages[language] || Prism.languages.plaintext,
                language
            );

            formattedLines.push(
                <div key="last-code-block" className="code-block">
                    <div className="code-language">{language}</div>
                    <pre>
                        <code
                            className={`language-${language}`}
                            dangerouslySetInnerHTML={{ __html: highlightedCode }}
                        />
                    </pre>
                    <button onClick={() => handleCopy(codeText)}>Copy</button>
                </div>
            );
        }

        return formattedLines;
    };

    return (
        <div className={`main ${theme}`}>
            <div className="nav">
                <p>ChatBot</p>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                </button>
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, I am ChatBot</span></p>
                            <p>How can I help you?</p>
                        </div>
                        <div className="robot">
                            <img src={robot} alt="Greeting Robot" />
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        {/* Updated result-title for Edit button */}
                        <div className="result-title">
                            <img src={assets.user_icon} alt='' />
                            <div className="user-prompt">
                                <p>{recentPrompt}</p>
                                <button className="edit-btn" onClick={handleEdit}>✏️</button>
                            </div>
                        </div>

                        <div className="result-data">
                            <img src={assets.gemini_icon} alt='' />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <div className="response-block">
                                    {formatResponse(resultData)}
                                    <div className="action-buttons">
                                        <button onClick={() => handleCopy(resultData)}>📋</button>
                                        <button onClick={handleLike}>👍</button>
                                        <button onClick={handleDislike}>👎</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder='Enter a prompt here'
                        />
                        <div>
                            <img
                                src={assets.mic_icon}
                                alt="Mic"
                                onClick={toggleListening}
                                style={{ cursor: 'pointer', opacity: listening ? 1 : 0.5 }}
                            />
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;