from fastapi import FastAPI, UploadFile, Form, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient
from ollama import chat
from pydantic import BaseModel
import uuid, os

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
async def ask_ai(data: AIRequest):
    try:
        response = chat(model="llama3:latest", messages=[
            {"role": "user", "content": data.question}
        ])
        return {"answer": response["message"]["content"]}
    except Exception as e:
        return {"error": str(e)}
