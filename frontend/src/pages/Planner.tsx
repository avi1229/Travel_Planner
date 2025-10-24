import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Planner.css";

export default function Planner() {
  const [intent, setIntent] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const travelIntents = [
    { key: "relaxation", label: "Relaxation" },
    { key: "adventure", label: "Adventure" },
    { key: "culture", label: "Culture" },
    { key: "weekend", label: "Short Weekend" },
    { key: "family", label: "Family" },
  ];
//    const destinations = [
//     {
//       id: 1,
//       name: "Red Rock Canyon National Conservation Area",
//       intent: "adventure",
//       image:
//         "https://www.redrockcanyonlv.org/wp-content/uploads/2012/09/red-rock-canyon6-550x550.jpg",
//       description:
//         "Natural wonder with red rocks draws those looking to hike, rock climb or go for a scenic drive.",
//     },
//     {
//       id: 2,
//       name: "Goa Beaches",
//       intent: "relaxation",
//       image:
//         "https://360-degree-beach-resort.goa-india-hotels-resorts.com/data/Photos/OriginalPhoto/2144/214456/214456799.JPEG",
//       description: "Golden sands, palm trees, beach shacks, and seafood bliss.",
//     },
//   ];

  // 🧠 Fetch destinations from FastAPI
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const url = intent
          ? `http://localhost:8000/destinations?category=${intent}`
          : `http://localhost:8000/destinations`;
        const res = await axios.get(url);
        setDestinations(res.data.destinations);
      } catch (err) {
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    // fetch only after selecting intent
    if (intent) fetchDestinations();
  }, [intent]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  // Add AI placeholder + loading
  setMessages((prev) => [...prev, { sender: "ai", text: "..." }]);
  setLoading(true);

  try {
    const response = await fetch("http://localhost:8000/ask_ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    if (!response.ok) throw new Error("Network error");

    // ✅ Type-safe null check
    if (!response.body) {
      throw new Error("No response body received from server");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiText = "";

    // Stream chunks as they come in
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiText += decoder.decode(value, { stream: true });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "ai", text: aiText };
        return updated;
      });
    }

  } catch (err) {
    console.error("AI connection failed:", err);
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "⚠️ Sorry, something went wrong connecting to AI." },
    ]);
  } finally {
    setLoading(false);
  }
};




  // ---- Render ----
  return (
    <div className="planner-container" style={{ position: "relative" }}>
      {!intent && (
        <div className="intent-section">
          <h2>Choose Your Travel Intent</h2>
          <div className="intent-buttons">
            {travelIntents.map((t) => (
              <Button
                key={t.key}
                label={t.label}
                className="p-button-rounded p-button-outlined intent-btn"
                onClick={() => setIntent(t.key)}
              />
            ))}
          </div>
        </div>
      )}

      {intent && (
        <div className="destinations-section">
          <h2>Recommended Destinations for {intent}</h2>

          {loading ? (
            <p>Loading destinations...</p>
          ) : destinations.length === 0 ? (
            <p>No destinations found for this category.</p>
          ) : (
            <div className="destinations-grid">
              {destinations.map((d, idx) => (
                <Card
                  key={idx}
                  title={d.name}
                  subTitle={d.description}
                  header={
                    <img
                      alt={d.name}
                      src={`http://localhost:8000${d.image_url}`}
                      className="destination-image"
                    />
                  }
                  className="destination-card"
                >
                  <Button
                    label="Explore in 360°"
                    icon="pi pi-compass"
                    className="p-button-sm"
                    onClick={() =>
                        navigate(`/destination/${d.name}`, {
                        state: { destination: d }, // pass destination data
                        })
                    }
                    />
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-content-between mt-4">
            <Button
              label="← Back"
              className="p-button-text"
              onClick={() => setIntent(null)}
            />
            <Button
              label="Ask AI"
              icon="pi pi-comments"
              severity="info"
              onClick={() => setShowChat(!showChat)}
            />
          </div>
        </div>
      )}

      {/* --- Floating Chat Window --- */}
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            width: "320px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "10px",
              background: "#f5f5f5",
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
            }}
          >
            🧭 Ask AI about your trip
          </div>

          {/* Chat messages */}
          <div
            style={{
              padding: "10px",
              flex: 1,
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            {messages.length === 0 && (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>
                Ask me for ideas or travel tips…
              </p>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: m.sender === "user" ? "right" : "left",
                  margin: "8px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background:
                      m.sender === "user" ? "#DCF8C6" : "rgba(240,240,240,0.9)",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              padding: "8px",
              gap: "6px",
            }}
          >
            <InputText
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              icon="pi pi-send"
              onClick={sendMessage}
              rounded
              severity="info"
            />
          </div>
        </div>
      )}
    </div>
  );
}
