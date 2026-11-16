// AI Reference: Used Gemini for the .some() keyword matching check inside the getAiReply function.
import { useState, useContext } from "react";
import { aiDataset } from "../data/aiResponses";
import { RestaurantContext } from "../context/RestaurantContext";

export default function AiChatWidget() {
  const { orders } = useContext(RestaurantContext);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm your Smart Restaurant Assistant. Ask me about specials, dietary options, or recommendations!",
    },
  ]);

  const getAiReply = (userText) => {
    const lower = userText.toLowerCase();

    // Check live order history first if user asks about previous order
    if (
      (lower.includes("last time") || lower.includes("previous")) &&
      orders.length > 0
    ) {
      const lastItems = orders[0].items.map((i) => i.name).join(" and ");
      return `Your previous order was ${lastItems}.`;
    }

    const match = aiDataset.find(
      (entry) =>
        entry.question.toLowerCase() === lower ||
        entry.keywords.some((kw) => lower.includes(kw))
    );

    return match
      ? match.answer
      : "I can help with today's specials, vegetarian or gluten-free meals, popular desserts, and order history. Try clicking one of the questions below!";
  };

  const handleSend = (questionText) => {
    const textToSend = questionText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user", text: textToSend };
    const aiMsg = { sender: "ai", text: getAiReply(textToSend) };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    if (!questionText) setInput("");
  };

  return (
    <div className="ai-widget-container">
      {isOpen && (
        <div className="ai-chat-box">
          <div className="ai-header">
            <span>AI Menu Assistant</span>
            <button onClick={() => setIsOpen(false)}>X</button>
          </div>

          <div className="ai-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="ai-quick-questions">
            {aiDataset.slice(0, 4).map((item) => (
              <button
                key={item.question}
                type="button"
                onClick={() => handleSend(item.question)}
              >
                {item.question}
              </button>
            ))}
          </div>

          <form
            className="ai-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      <button className="ai-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close AI" : "AI Assistant"}
      </button>
    </div>
  );
}