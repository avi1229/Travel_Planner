import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import "./Planner.css";

export default function Planner() {
  const [intent, setIntent] = useState<string | null>(null);
  const navigate = useNavigate();

  const travelIntents = [
    { key: "relaxation", label: "Relaxation" },
    { key: "adventure", label: "Adventure" },
    { key: "culture", label: "Culture" },
    { key: "weekend", label: "Short Weekend" },
    { key: "family", label: "Family" },
  ];

  const destinations = [
    {
      id: 1,
      name: "Red Rock Canyon National Conservation Area",
      intent: "adventure",
      image: "https://www.redrockcanyonlv.org/wp-content/uploads/2012/09/red-rock-canyon6-550x550.jpg", 
      description: "Natural wonder with red rocks draws those looking to hike, rock climb or go for a scenic drive.",
    },
    {
      id: 2,
      name: "Goa Beaches",
      intent: "relaxation",
      image: "https://360-degree-beach-resort.goa-india-hotels-resorts.com/data/Photos/OriginalPhoto/2144/214456/214456799.JPEG", // Replace with 360 image link
      description: "Golden sands, palm trees, beach shacks, and seafood bliss.",
    },
  ];

  const filtered = intent
    ? destinations.filter((d) => d.intent === intent)
    : [];

  return (
    <div className="planner-container">
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
          <div className="destinations-grid">
            {filtered.map((d) => (
              <Card
                key={d.id}
                title={d.name}
                subTitle={d.description}
                header={<img alt={d.name} src={d.image} className="destination-image" />}
                className="destination-card"
              >
                <Button
                  label="Explore in 360°"
                  icon="pi pi-compass"
                  className="p-button-sm"
                  onClick={() => navigate(`/destination/${d.id}`)}
                />
              </Card>
            ))}
          </div>
          <Button
            label="← Back"
            className="p-button-text mt-4"
            onClick={() => setIntent(null)}
          />
        </div>
      )}
    </div>
  );
}
