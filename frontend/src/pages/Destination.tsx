import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

export default function Destination() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Retrieve destination object passed from Planner
  const destination = location.state?.destination;

  if (!destination) {
    return (
      <div className="p-4 text-center">
        <h2>No destination data found</h2>
        <Button label="Back to Planner" onClick={() => navigate("/planner")} />
      </div>
    );
  }

  // ✅ Use the backend image_360_url (or fallback)
  const image360 = destination.image_360_url
    ? `http://localhost:8000${destination.image_360_url}`
    : destination.image_url; // fallback if 360 not provided

  return (
    <div
      style={{
        backgroundColor: "#000",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 360° Viewer */}
      <div
        style={{
          width: "100%",
          height: "80vh",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <ReactPhotoSphereViewer
          src={image360}
          height={"80vh"}
          width={"100%"}
          navbar={["zoom", "fullscreen"]}
        />
      </div>

      {/* Destination Info Card */}
      <Card
        title={destination.name}
        subTitle={destination.description}
        className="mt-3"
        style={{
          width: "80%",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div className="flex justify-content-between mt-4">
          <Button
            label="Add to Itinerary"
            icon="pi pi-plus"
            onClick={() => navigate("/itinerary")}
          />
          <Button
            label="Back to Planner"
            icon="pi pi-arrow-left"
            outlined
            onClick={() => navigate("/planner")}
          />
        </div>
      </Card>
    </div>
  );
}
