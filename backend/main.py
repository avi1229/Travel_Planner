from fastapi import FastAPI, UploadFile, Form, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient
import uuid, os, httpx

app = FastAPI()

# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend dev server
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- MongoDB ----
client = MongoClient("mongodb://localhost:27017/")
db = client["traveller_journey"]
collection = db["destinations"]

# ---- Upload Directory ----
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
async def root():
    return {"message": "✅ Server running on port 8000"}

# ---- Upload Destination ----
@app.post("/upload_destination")
async def upload_destination(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    image: UploadFile = Form(...),
    image_360: UploadFile = Form(...),
):
    # Save both images
    def save_file(file):
        filename = f"{uuid.uuid4()}_{file.filename}"
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            f.write(file.file.read())
        return f"/uploads/{filename}"

    image_url = save_file(image)
    image_360_url = save_file(image_360)

    doc = {
        "name": name,
        "category": category,
        "description": description,
        "image_url": image_url,
        "image_360_url": image_360_url,
    }

    result = collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)

    return {"message": "Destination uploaded", "data": doc}

# ---- Get Destinations ----
@app.get("/destinations")
def get_destinations(category: str = None):
    query = {}
    if category:
        query["category"] = category
    items = list(collection.find(query, {"_id": 0}))
    return {"destinations": items}

# ---- Proxy to Ollama ----
@app.post("/ask_ai")
async def ask_ai(request: Request):
    data = await request.json()
    question = data.get("question", "")

    if not question:
        return JSONResponse({"error": "Missing question"}, status_code=400)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": "llama3", "prompt": question, "stream": False},
                timeout=120.0,
            )
            return JSONResponse(response.json())
    except Exception as e:
        print("Ollama error:", e)
        return JSONResponse(
            {"error": "Failed to connect to Ollama", "details": str(e)},
            status_code=500,
        )
