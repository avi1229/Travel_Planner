import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [image360, setImage360] = useState<File | null>(null);
  const toast = useRef<Toast>(null);

  const travelIntents = [
    { key: "relaxation", label: "Relaxation" },
    { key: "adventure", label: "Adventure" },
    { key: "culture", label: "Culture" },
    { key: "weekend", label: "Short Weekend" },
    { key: "family", label: "Family" },
  ];

  const handleUpload = async () => {
    if (!name || !category || !image || !image360) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing info",
        detail: "Please fill all fields and upload both images",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("image_360", image360);

    try {
      const res = await axios.post("http://localhost:8000/upload_destination", formData);
      toast.current?.show({ severity: "success", summary: "Uploaded", detail: res.data.message });
    } catch (err) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Upload failed" });
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-3">Admin - Add Destination</h2>

      <div className="p-field mb-3">
        <label>Name</label>
        <InputText value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
      </div>

      <div className="p-field mb-3">
        <label>Category</label>
        <Dropdown
          value={category}
          options={travelIntents.map((i) => ({ label: i.label, value: i.key }))}
          onChange={(e) => setCategory(e.value)}
          placeholder="Select travel intent"
          className="w-full"
        />
      </div>

      <div className="p-field mb-3">
        <label>Description</label>
        <InputText
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="p-field mb-3">
        <label>Thumbnail Image (for card)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <div className="p-field mb-3">
        <label>360° Image (for explore view)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage360(e.target.files?.[0] || null)}
        />
      </div>

      <Button label="Upload Destination" icon="pi pi-upload" onClick={handleUpload} />
    </div>
  );
}
