// src/pages/ChatMockPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChatMockPage = () => {
    const { proName } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'AI', text: `Hello! I'm Gemini, your support assistant. I can help answer common platform questions (e.g., 'how to hire?' or 'is payment safe?').` }
    ]);
    
    // FEATURE: Quick Message Templates
    const messageTemplates = [
        "How do I filter by location?",
        "Is my booking data saved?",
        "Tell me about the payment method.",
    ];

    // --- FEATURE: AI RESPONSE SIMULATION ---
    const getAIResponse = (query) => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('payment') || lowerQuery.includes('safe') || lowerQuery.includes('upi')) {
            return "Our payment is simulated using a secure UPI QR code in the prototype. All booking details are confirmed immediately.";
        }
        if (lowerQuery.includes('hire') || lowerQuery.includes('book')) {
            return "To hire, first Sign In, then use the advanced filters (price, rating, location) to find a professional, and click 'View Profile & Book.'";
        }
        if (lowerQuery.includes('data') || lowerQuery.includes('saved')) {
            return "Your client profile and booking history are securely saved locally (using localStorage) for persistence across sessions.";
        }
        if (lowerQuery.includes('filter') || lowerQuery.includes('location')) {
            return "You can use the dedicated input in the controls section to filter professionals by city or area (e.g., Mumbai, Bangalore).";
        }
        return "I'm sorry, I can only answer questions about the platform features right now. Try asking about 'payment' or 'hiring'!";
    };

    const sendMessage = (textToSend) => {
        if (!textToSend.trim()) return;

        const userMessage = { sender: 'Client', text: textToSend };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');
        
        // 1. Get Simulated AI Response
        const aiResponseText = getAIResponse(textToSend);

        // 2. Mock AI/Server Response Delay
        setTimeout(() => {
            const aiMessage = { sender: 'AI', text: aiResponseText };
            setChatHistory(prev => [...prev, aiMessage]);
        }, 800); // Shorter delay for an "instant" AI feel
    };

    const commonInputStyle = { flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };

    return (
        <div className="main-content" style={{ maxWidth: '700px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', margin: '20px 0' }}>
                Gemini Support Chat
            </h1>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', height: '60vh', display: 'flex', flexDirection: 'column' }}>
                
                {/* Chat History Area */}
                <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '10px' }}>
                    {chatHistory.map((msg, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                margin: '10px 0', 
                                textAlign: msg.sender === 'Client' ? 'right' : 'left' 
                            }}
                        >
                            <span style={{ 
                                padding: '8px 12px', 
                                borderRadius: '15px', 
                                backgroundColor: msg.sender === 'Client' ? '#007bff' : '#f0f0f0', 
                                color: msg.sender === 'Client' ? 'white' : '#333',
                                display: 'inline-block',
                                maxWidth: '80%',
                                fontWeight: msg.sender === 'AI' ? 'bold' : 'normal'
                            }}>
                                <strong>{msg.sender === 'Client' ? 'You' : 'Gemini'}:</strong> {msg.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Quick Templates (One-Click Messages) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    {messageTemplates.map((template, index) => (
                        <button key={index} onClick={() => sendMessage(template)} className="signin-btn" 
                            style={{ 
                                background: '#e9f0f9', color: '#007bff', fontSize: '12px', padding: '5px 10px',
                                border: '1px solid #cce0ff', fontWeight: 'normal', borderRadius: '20px', transition: 'background-color 0.2s'
                            }}>
                            {template}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Ask Gemini a question..."
                        onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(message); }}
                        style={commonInputStyle}
                    />
                    <button onClick={() => sendMessage(message)} className="signin-btn">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatMockPage;