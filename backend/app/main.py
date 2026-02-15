"""StudyConnect FastAPI app — Phase 1 & 2 auth and multi-college with MySQL."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth_routes, college_routes, course_routes, dashboard_routes, websocket_routes, upload_routes, ai_routes

app = FastAPI(
    title="StudyConnect API",
    description="Phase 1 & 2: Auth and multi-college with MySQL persistence.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(college_routes.router)
app.include_router(auth_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(course_routes.router)
app.include_router(websocket_routes.router)
app.include_router(upload_routes.router)
app.include_router(ai_routes.router)


@app.get("/")
def root():
    return {"message": "StudyConnect backend running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)