from fastapi import FastAPI, UploadFile, Form, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient
from ollama import chat
from pydantic import BaseModel
import uuid, os
from fastapi.responses import StreamingResponse, JSONResponse
import httpx
import json
import asyncio

app = FastAPI()

class AIRequest(BaseModel):
    question: str
# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Mongo ----
client = MongoClient("mongodb://localhost:27017/")
db = client["traveller_journey"]
collection = db["destinations"]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Server running on port 8000"}


@app.post("/upload_destination")
async def upload_destination(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    image: UploadFile = Form(...),
    image_360: UploadFile = Form(...),
):
    filename_normal = f"{uuid.uuid4()}_{image.filename}"
    filename_360 = f"{uuid.uuid4()}_{image_360.filename}"

    path_normal = os.path.join(UPLOAD_DIR, filename_normal)
    path_360 = os.path.join(UPLOAD_DIR, filename_360)

    with open(path_normal, "wb") as f:
        f.write(await image.read())

    with open(path_360, "wb") as f:
        f.write(await image_360.read())

    doc = {
        "name": name,
        "category": category,
        "description": description,
        "image_url": f"/uploads/{filename_normal}",
        "image_360_url": f"/uploads/{filename_360}",
    }

    collection.insert_one(doc)
    return {"message": "Destination uploaded", "data": doc}


@app.get("/destinations")
def get_destinations(category: str = None):
    query = {}
    if category:
        query["category"] = category
    items = list(collection.find(query, {"_id": 0}))
    return {"destinations": items}


# ---- Ask AI (Ollama Python SDK) ----
@app.post("/ask_ai")
async def ask_ai(request: Request):
    """
    Stream AI responses word-by-word from Ollama model
    """
    data = await request.json()
    question = data.get("question", "")

    if not question:
        return JSONResponse({"error": "Missing question"}, status_code=400)

    async def generate():
        try:
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/generate",
                    json={"model": "llama3", "prompt": question, "stream": True},
                ) as response:
                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                obj = json.loads(line)
                                content = obj.get("response")
                                if content:
                                    yield content
                                    await asyncio.sleep(0.02)  # smooth output pacing
                            except json.JSONDecodeError:
                                pass
        except Exception as e:
            yield f"\n[Error connecting to Ollama: {str(e)}]"

    return StreamingResponse(generate(), media_type="text/plain")
