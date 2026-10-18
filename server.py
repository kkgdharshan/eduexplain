"""
EduExplain AI - Unified Application Server
Runs FastAPI backend serving both API endpoints (/api/...) and the compiled frontend UI at http://localhost:8000
"""

import sys
import os
import uvicorn

if __name__ == '__main__':
    # Ensure current directory is on python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

    print("===============================================================")
    print("  EduExplain AI - Academic Learning Risk Explainability Platform")
    print("  Official Hackathon Challenge 01: Explain My Learning Risk")
    print("===============================================================")
    print("  Starting unified server at: http://127.0.0.1:8000")
    print("  Serving API endpoints at:   http://127.0.0.1:8000/api")
    print("  Serving Research UI at:     http://127.0.0.1:8000/")
    print("===============================================================\n")

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")

    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
