import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.config.settings import settings
from app.config.database import engine, Base

# استيراد النماذج لضمان تسجيلها
import app.models  # noqa: F401
from app.routers import exploitants, exploitations, parcelles, references, recensements, campagnes

# 1. تحديد المسار الأساسي
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def create_app() -> FastAPI:
    # 2. إنشاء التطبيق
    app = FastAPI(
        title=settings.APP_NAME,
        description="API de gestion agricole",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # 3. إعدادات CORS (يجب أن تكون قبل الـ Routers)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 4. ربط المجلدات الثابتة (Static Files)
    # أضفنا كل المجلدات التي يحتاجها الـ HTML الخاص بك
    static_dirs = ["css", "js", "images", "componts"]
    for folder in static_dirs:
        path = os.path.join(BASE_DIR, folder)
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"⚠️ Warning: Created missing directory at {path}")
        app.mount(f"/{folder}", StaticFiles(directory=path), name=folder)

    # 5. معالج الأخطاء العالمي
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "type": type(exc).__name__},
        )

    # 6. إنشاء الجداول في قاعدة البيانات
    Base.metadata.create_all(bind=engine)

    # 7. ربط الـ Routers (API)
    API_PREFIX = "/api/v1"
    app.include_router(exploitants.router,   prefix=API_PREFIX)
    app.include_router(exploitations.router, prefix=API_PREFIX)
    app.include_router(parcelles.router,     prefix=API_PREFIX)
    app.include_router(references.router,    prefix=API_PREFIX)
    app.include_router(recensements.router,  prefix=API_PREFIX)
    app.include_router(campagnes.router,     prefix=API_PREFIX)

    # 8. مسارات الواجهة الأمامية (Frontend)
    @app.get("/", response_class=HTMLResponse, tags=["Frontend"])
    async def read_index():
        file_path = os.path.join(BASE_DIR, "Recenseur.html")
        if os.path.exists(file_path):
            return FileResponse(file_path)
        return JSONResponse({"error": "Recenseur.html not found"}, status_code=404)

    @app.get("/agri-admin-page", response_class=HTMLResponse, tags=["Frontend"])
    async def get_agri_page():
        file_path = os.path.join(BASE_DIR, "agri.html")
        if os.path.exists(file_path):
            return FileResponse(file_path)
        return JSONResponse({"error": "agri.html not found"}, status_code=404)

    # السطر الأخير والوحيد للإرجاع
    return app

app = create_app()