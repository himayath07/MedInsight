from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Server is running on port 5000!"}

if __name__ == "__main__":
    print("Starting test server on port 5000...")
    uvicorn.run(app, host="0.0.0.0", port=5000)
