from pydantic import BaseModel

class Todo(BaseModel):
    name: str
    address: str
    phone: str
