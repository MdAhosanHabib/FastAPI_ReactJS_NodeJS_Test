import motor.motor_asyncio
from bson import ObjectId

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://192.168.193.133:27017,192.168.193.133:27027,192.168.193.133:27037/?replicaSet=repPrac')
database = client.TodoList
collection = database.todo

async def fetch_one_todo(id):
    document = await collection.find_one({"_id": ObjectId(id)})
    return document

async def fetch_all_todos():
    results = collection.find({}, {"_id": 1, "name": 1, "address": 1, "phone": 1})
    # Extract the fields into a list of dictionaries
    objects = [{"_id": str(result["_id"]), "name": result["name"], "address": result["address"], "phone": result["phone"]} async for result in results]
    #Return the list of objects
    return {"data": objects}

async def create_todo(todo):
    document = todo
    result = await collection.insert_one(document)
    return document

async def remove_todo(id):
    await collection.delete_one({"_id": ObjectId(id)})
    return True

