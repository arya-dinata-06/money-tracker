"""
MoneyTracker - Personal Finance Management Application
Copyright © 2025 Arya Dinata. All rights reserved.

Backend API built with FastAPI and MongoDB
"""

from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import shutil
import tempfile

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== MODELS =====
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    role: str = "user"  # user or superadmin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    username: str
    password: str

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # income or expense
    is_custom: bool = False
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CategoryCreate(BaseModel):
    name: str
    type: str  # income or expense

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # income or expense
    category_id: str
    category_name: Optional[str] = None
    amount: float
    description: Optional[str] = None
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TransactionCreate(BaseModel):
    type: str
    category_id: str
    amount: float
    description: Optional[str] = None
    date: str

class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    category_id: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[str] = None

# ===== AUTH UTILITIES =====
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_current_superadmin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Not authorized. Superadmin access required")
    return current_user

# ===== INITIALIZE DEFAULT DATA =====
@app.on_event("startup")
async def startup_event():
    # Create superadmin if not exists
    superadmin = await db.users.find_one({"username": "superadmin"})
    if not superadmin:
        superadmin_obj = User(username="superadmin", role="superadmin")
        doc = superadmin_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['password_hash'] = get_password_hash("admin123")
        await db.users.insert_one(doc)
        logger.info("Superadmin created: username=superadmin, password=admin123")
    
    # Create default categories
    default_categories = [
        {"name": "Gaji", "type": "income", "is_custom": False},
        {"name": "Bonus", "type": "income", "is_custom": False},
        {"name": "Freelance", "type": "income", "is_custom": False},
        {"name": "Lainnya (Income)", "type": "income", "is_custom": False},
        {"name": "Makanan", "type": "expense", "is_custom": False},
        {"name": "Belanja Online", "type": "expense", "is_custom": False},
        {"name": "Paket", "type": "expense", "is_custom": False},
        {"name": "Tagihan", "type": "expense", "is_custom": False},
        {"name": "Transportasi", "type": "expense", "is_custom": False},
        {"name": "Lainnya (Expense)", "type": "expense", "is_custom": False},
    ]
    
    for cat_data in default_categories:
        exists = await db.categories.find_one({"name": cat_data["name"], "is_custom": False})
        if not exists:
            cat_obj = Category(**cat_data)
            doc = cat_obj.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.categories.insert_one(doc)

# ===== AUTH ROUTES =====
@api_router.post("/auth/login")
async def login(user_login: UserLogin):
    user = await db.users.find_one({"username": user_login.username}, {"_id": 0})
    if not user or not verify_password(user_login.password, user.get("password_hash")):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": user["id"], "username": user["username"], "role": user["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "role": user["role"]
        }
    }

@api_router.post("/auth/register")
async def register(user_create: UserCreate, current_user: dict = Depends(get_current_superadmin)):
    # Check if username already exists
    existing_user = await db.users.find_one({"username": user_create.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_obj = User(username=user_create.username, role=user_create.role)
    doc = user_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['password_hash'] = get_password_hash(user_create.password)
    
    await db.users.insert_one(doc)
    return {"message": "User created successfully", "user": {"id": user_obj.id, "username": user_obj.username, "role": user_obj.role}}

# ===== USER ROUTES =====
@api_router.get("/users/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "role": current_user["role"]
    }

@api_router.get("/users", response_model=List[User])
async def get_all_users(current_user: dict = Depends(get_current_superadmin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    for user in users:
        if isinstance(user['created_at'], str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
    return users

# ===== CATEGORY ROUTES =====
@api_router.get("/categories", response_model=List[Category])
async def get_categories(current_user: dict = Depends(get_current_user)):
    # Get default categories + user's custom categories
    categories = await db.categories.find(
        {"$or": [{"is_custom": False}, {"user_id": current_user["id"]}]},
        {"_id": 0}
    ).to_list(1000)
    
    for cat in categories:
        if isinstance(cat['created_at'], str):
            cat['created_at'] = datetime.fromisoformat(cat['created_at'])
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(category_create: CategoryCreate, current_user: dict = Depends(get_current_user)):
    # Check if category name already exists for this user
    existing = await db.categories.find_one({
        "name": category_create.name,
        "type": category_create.type,
        "$or": [{"is_custom": False}, {"user_id": current_user["id"]}]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    cat_obj = Category(
        name=category_create.name,
        type=category_create.type,
        is_custom=True,
        user_id=current_user["id"]
    )
    doc = cat_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.categories.insert_one(doc)
    return cat_obj

# ===== TRANSACTION ROUTES =====
@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("date", -1).to_list(1000)
    
    # Enrich with category names
    for trans in transactions:
        if isinstance(trans.get('created_at'), str):
            trans['created_at'] = datetime.fromisoformat(trans['created_at'])
        
        category = await db.categories.find_one({"id": trans["category_id"]}, {"_id": 0})
        if category:
            trans['category_name'] = category['name']
    
    return transactions

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(trans_create: TransactionCreate, current_user: dict = Depends(get_current_user)):
    # Verify category exists and user has access
    category = await db.categories.find_one({
        "id": trans_create.category_id,
        "$or": [{"is_custom": False}, {"user_id": current_user["id"]}]
    })
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    trans_obj = Transaction(
        user_id=current_user["id"],
        type=trans_create.type,
        category_id=trans_create.category_id,
        category_name=category['name'],
        amount=trans_create.amount,
        description=trans_create.description,
        date=trans_create.date
    )
    doc = trans_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.transactions.insert_one(doc)
    return trans_obj

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: str,
    trans_update: TransactionUpdate,
    current_user: dict = Depends(get_current_user)
):
    # Check transaction exists and belongs to user
    transaction = await db.transactions.find_one({"id": transaction_id, "user_id": current_user["id"]})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    update_data = {k: v for k, v in trans_update.model_dump().items() if v is not None}
    
    # If category is being updated, verify it
    if "category_id" in update_data:
        category = await db.categories.find_one({
            "id": update_data["category_id"],
            "$or": [{"is_custom": False}, {"user_id": current_user["id"]}]
        })
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        update_data['category_name'] = category['name']
    
    await db.transactions.update_one({"id": transaction_id}, {"$set": update_data})
    
    updated_transaction = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
    if isinstance(updated_transaction['created_at'], str):
        updated_transaction['created_at'] = datetime.fromisoformat(updated_transaction['created_at'])
    
    return updated_transaction

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.transactions.delete_one({"id": transaction_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}

@api_router.get("/transactions/stats")
async def get_transaction_stats(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(10000)
    
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    total_expense = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    balance = total_income - total_expense
    
    # Category breakdown
    category_stats = {}
    for trans in transactions:
        cat_name = trans.get('category_name', 'Unknown')
        if cat_name not in category_stats:
            category_stats[cat_name] = {'income': 0, 'expense': 0}
        category_stats[cat_name][trans['type']] += trans['amount']
    
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "transaction_count": len(transactions),
        "category_breakdown": category_stats
    }

# ===== DOWNLOAD SOURCE CODE =====
@api_router.get("/download/source-code")
async def download_source_code(current_user: dict = Depends(get_current_user)):
    try:
        # Create a temporary directory for the zip file
        temp_dir = tempfile.mkdtemp()
        zip_path = os.path.join(temp_dir, "money-tracker-source-code.zip")
        
        # Define what to include in the zip
        app_dir = "/app"
        
        # Create zip file excluding unnecessary files
        shutil.make_archive(
            zip_path.replace('.zip', ''),
            'zip',
            app_dir,
            '.',
        )
        
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="money-tracker-source-code.zip"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating zip file: {str(e)}")

# ===== BASIC ROUTES =====
@api_router.get("/")
async def root():
    return {"message": "Money Tracker API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()