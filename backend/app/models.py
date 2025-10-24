from pydantic import BaseModel
from typing import Optional

class Destination(BaseModel):
    id: Optional[str]
    name: str
    category: str
    description: str
    image_url: str
