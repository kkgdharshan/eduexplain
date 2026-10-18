"""
EduExplain AI - Backend Server Entrypoint
Runs FastAPI backend serving API endpoints (/api/...) and health probes (/health).
Can be deployed to Render, Railway, Fly.io, Heroku, or run locally.
"""

import os
import sys
import uvicorn

if __name__ == '__main__':
    # Ensure backend directory and parent directory are on sys.path
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(backend_dir)
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")

    print("===============================================================")
    print("  EduExplain AI - Backend API Server")
    print("  Official Hackathon Challenge 01: Explain My Learning Risk")
    print("===============================================================")
    print(f"  Listening on: http://{host}:{port}")
    print(f"  Health check: http://{host}:{port}/health")
    print(f"  API base:     http://{host}:{port}/api")
    print("===============================================================\n")

    uvicorn.run("main:app", host=host, port=port, reload=False)
