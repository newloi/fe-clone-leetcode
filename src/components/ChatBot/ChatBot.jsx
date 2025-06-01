import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState(() => {
        try {
            const saved = localStorage.getItem("chatbotHistory");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, loading, isOpen]);

    // Persist chatHistory to localStorage
    useEffect(() => {
        localStorage.setItem("chatbotHistory", JSON.stringify(chatHistory));
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!message.trim()) return;
        setLoading(true);
        const userMessage = message;
        setMessage("");
        setChatHistory((prev) => [
            ...prev,
            { sender: "user", parts: userMessage },
        ]);

        const body = {
            message: userMessage,
            chat_history: [
                ...chatHistory,
                { sender: "user", parts: userMessage },
            ],
        };

        try {
            const accessToken = sessionStorage.getItem("accessToken");
            const csrfToken = sessionStorage.getItem("csrfToken");
            const res = await fetch(`${import.meta.env.VITE_API_CHATBOT}/chat/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "x-csrf-token": csrfToken,
                    "x-service-token": import.meta.env.VITE_SERVICE_TOKEN,
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            setChatHistory((prev) => [
                ...prev,
                { sender: "model", parts: data.message },
            ]);
        } catch (err) {
            setChatHistory((prev) => [
                ...prev,
                { sender: "model", parts: "Lỗi: " + err.message },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen ? (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3 style={{ color: "white" }}>LeetBase Assistant</h3>
                        <button onClick={toggleChat}>X</button>
                    </div>
                    <div className="chatbot-messages">
                        {chatHistory.map((chat, index) => (
                            <div
                                key={index}
                                className={`message ${chat.sender}`}
                            >
                                <b>{chat.sender === "user" ? "Bạn:" : "AI:"}</b>{" "}
                                {chat.parts}
                            </div>
                        ))}
                        {loading && (
                            <div className="message model">
                                Đang suy nghĩ...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập câu hỏi..."
                            rows="4"
                            cols="50"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="send-button"
                        >
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="chatbot-toggle fixed"
                    onClick={toggleChat}
                    title="Help"
                >
                    <i className="fa-solid fa-question-circle"></i>
                </button>
            )}
        </div>
    );
};

export default ChatBot;
