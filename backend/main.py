from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pymongo import MongoClient
import uuid, os

app = FastAPI()

# Allow frontend CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or whatever your frontend origin is
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mongo setup
client = MongoClient("mongodb://localhost:27017/")
db = client["traveller_journey"]
collection = db["destinations"]

# Image upload path
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def main():
    return {"message":"Server is running on 8000"}
@app.post("/upload_destination")
async def upload_destination(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),

    image: UploadFile = None,
):
    if not image:
        return JSONResponse(content={"error": "No image provided"}, status_code=400)

    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(await image.read())

    # Store in Mongo
    doc = {
        "name": name,
        "category": category,
        "description":description,
        "image_url": f"/uploads/{filename}",
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
