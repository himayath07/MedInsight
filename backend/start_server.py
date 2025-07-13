import uvicorn
import sys
import os

# Add the current directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

try:
    print("Starting server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="debug")
except Exception as e:
    print(f"Error starting server: {e}")
    import traceback
    traceback.print_exc()
    input("Press Enter to exit...")
