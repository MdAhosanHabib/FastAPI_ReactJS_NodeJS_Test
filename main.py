from fastapi import FastAPI, HTTPException
from model import Todo
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Path
from fastapi import Depends, HTTPException
from bson import ObjectId
import motor.motor_asyncio

from database import(
    fetch_all_todos,
    fetch_one_todo,
    create_todo,
    remove_todo,
    #update_todo
)

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://192.168.193.133:27017,192.168.193.133:27027,192.168.193.133:27037/?replicaSet=repPrac')
database = client.TodoList
collection = database.todo

app = FastAPI()

origins = [
    "https://localhost:3000",
    "http://localhost:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"]
)

@app.get("/")
async def read_root():
    return {"Hello": "Ahosan"}

@app.get("/api/todo")
async def get_todo():
    response = await fetch_all_todos()
    return response

@app.get("/api/todo/{id}", response_model=Todo)
async def get_todo_by_id(id):
    response = await fetch_one_todo(id)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with {id}")

@app.post("/api/todo/", response_model=Todo)
async def post_todo(todo: Todo):
    response = await create_todo(todo.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# Define a dependency that extracts the ID from the request path
def get_todo_id(id: str = Path(...)):
    return id
# Define a dependency that extracts the request body
def get_todo_update(todo_update: Todo):
    return todo_update

@app.patch("/api/todo/update/{id}/", response_model=Todo)
async def update_todo(id: str = Depends(get_todo_id), todo_update: Todo = Depends(get_todo_update)):
    # Use the ID to update the document in the database
    result = await collection.update_one({"_id": ObjectId(id)}, {"$set": {"name": todo_update.name, "address": todo_update.address, "phone": todo_update.phone}})
    if result.modified_count == 0:
        # If no document was modified, raise a 404 error
        raise HTTPException(status_code=404, detail="Todo not found")
    else:
        # Return the updated document
        document = await collection.find_one({"_id": ObjectId(id)})
        return document

@app.delete("/api/todo/{id}")
async def delete_todo(id):
    response = await remove_todo(id)
    if response:
        return "Successfully deleted Todo"
    raise HTTPException(404, f"There is no todo with the id {id}")

