# FastAPI backend
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from matcher import match_roommate
import json
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # hoặc ["*"] nếu là dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

DATA_FILE = "data.json"
# Load candidates từ file
def load_candidates():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# Lưu người mới vào file
def save_candidate(user):
    data = load_candidates()
    data.append(user)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@app.get("/", response_class=HTMLResponse)
async def show_form(request: Request):
    return templates.TemplateResponse("form.html", {"request": request})




@app.post("/submit", response_class=JSONResponse)
async def submit_form(
        request: Request,
        gender: str = Form(...),
        yob: int = Form(...),
        hometown: str = Form(...),
        job: str = Form(...),
        hobbies: list = Form([]),
        more: str = Form("")
):
    user = {
        "gender": gender,
        "yob": yob,
        "hometown": hometown,
        "job": job,
        "hobbies": hobbies,
        "more": more
    }

    candidates = load_candidates()
    best_match = match_roommate(user, candidates) if candidates else None
    save_candidate(user)

    return best_match  # Trả về dữ liệu JSON