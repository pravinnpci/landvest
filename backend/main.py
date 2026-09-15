import os
import time
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from database import engine, Base, get_db
from models import PlotModel, SellerModel, InquiryModel, CompanySettingsModel
from seed import seed_database
from storage_s3 import init_s3_bucket, upload_file_bytes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto migrate tables
    for i in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            seed_database()
            break
        except Exception as e:
            print(f"Waiting for database connection ({e})... {i+1}/10")
            time.sleep(2)
    
    # Auto init MinIO Bucket
    for i in range(10):
        try:
            init_s3_bucket()
            break
        except Exception as e:
            print(f"Waiting for MinIO ({e})... {i+1}/10")
            time.sleep(2)
    yield

app = FastAPI(title="LandVest Real Estate API", version="1.0.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class PlotCreateSchema(BaseModel):
    title: str
    state: str = "Tamil Nadu"
    district: str
    locality: str
    dtcpNumber: str
    isDtcpApproved: bool = True
    totalSqFt: int
    cents: float
    pricePerSqFt: int
    totalPrice: float
    plotImages: List[str] = []
    locationImage: str = ""
    layoutPlanImage: str = ""
    ownerName1: str
    ownerPhone1: str
    ownerName2: Optional[str] = None
    ownerPhone2: Optional[str] = None
    sellerId: str
    sellerName: str
    sellerPhone: str
    expectedAppreciationRate: float = 15.0
    facing: str = "East"
    roadWidthFt: int = 30
    highlights: List[str] = []

class SellerCreateSchema(BaseModel):
    name: str
    phone: str
    email: str
    companyName: Optional[str] = None
    district: str
    state: str = "Tamil Nadu"

class InquiryCreateSchema(BaseModel):
    plotId: Optional[str] = None
    plotTitle: Optional[str] = None
    investorName: str
    investorEmail: str
    investorPhone: str
    country: str = "USA"
    currency: str = "USD"
    investmentHorizonYears: int = 5
    message: Optional[str] = None

class SettingsUpdateSchema(BaseModel):
    companyName: Optional[str] = None
    tagline: Optional[str] = None
    primaryPhone: Optional[str] = None
    secondaryPhone: Optional[str] = None
    whatsappNumber: Optional[str] = None
    email: Optional[str] = None
    nriDeskEmail: Optional[str] = None
    officeAddress: Optional[str] = None
    dtcpAssuranceBadgeText: Optional[str] = None
    defaultAnnualGrowthRate: Optional[float] = None
    usdtToInrRate: Optional[float] = None

# Routes
@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "LandVest Platform", "version": "1.0.0"}

# PLOTS
@app.get("/api/plots")
def list_plots(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PlotModel)
    if status:
        query = query.filter(PlotModel.status == status)
    return query.all()

@app.get("/api/plots/{plot_id}")
def get_plot(plot_id: str, db: Session = Depends(get_db)):
    plot = db.query(PlotModel).filter(PlotModel.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot

@app.post("/api/plots")
def create_plot(plot: PlotCreateSchema, db: Session = Depends(get_db)):
    import time
    plot_id = f"plot-{int(time.time())}"
    new_plot = PlotModel(
        id=plot_id,
        **plot.dict(),
        status="pending_verification"
    )
    db.add(new_plot)
    db.commit()
    db.refresh(new_plot)
    return new_plot

@app.put("/api/plots/{plot_id}/verify")
def verify_plot(plot_id: str, db: Session = Depends(get_db)):
    plot = db.query(PlotModel).filter(PlotModel.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    plot.status = "verified_broadcasted"
    plot.adminNotes = "DTCP verification passed & approved for public NRI broadcast."
    db.commit()
    db.refresh(plot)
    return plot

@app.put("/api/plots/{plot_id}/reject")
def reject_plot(plot_id: str, reason: str = Form(...), db: Session = Depends(get_db)):
    plot = db.query(PlotModel).filter(PlotModel.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    plot.status = "rejected"
    plot.adminNotes = reason
    db.commit()
    db.refresh(plot)
    return plot

@app.delete("/api/plots/{plot_id}")
def delete_plot(plot_id: str, db: Session = Depends(get_db)):
    plot = db.query(PlotModel).filter(PlotModel.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    db.delete(plot)
    db.commit()
    return {"message": "Plot deleted successfully"}

# SELLERS
@app.get("/api/sellers")
def list_sellers(db: Session = Depends(get_db)):
    return db.query(SellerModel).all()

@app.post("/api/sellers")
def create_seller(seller: SellerCreateSchema, db: Session = Depends(get_db)):
    import time
    seller_id = f"seller-{int(time.time())}"
    new_seller = SellerModel(
        id=seller_id,
        **seller.dict(),
        status="active"
    )
    db.add(new_seller)
    db.commit()
    db.refresh(new_seller)
    return new_seller

@app.put("/api/sellers/{seller_id}/toggle")
def toggle_seller(seller_id: str, db: Session = Depends(get_db)):
    seller = db.query(SellerModel).filter(SellerModel.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    seller.status = "suspended" if seller.status == "active" else "active"
    db.commit()
    db.refresh(seller)
    return seller

# INQUIRIES
@app.get("/api/inquiries")
def list_inquiries(db: Session = Depends(get_db)):
    return db.query(InquiryModel).all()

@app.post("/api/inquiries")
def create_inquiry(inquiry: InquiryCreateSchema, db: Session = Depends(get_db)):
    import time
    inq_id = f"inq-{int(time.time())}"
    new_inq = InquiryModel(
        id=inq_id,
        **inquiry.dict(),
        status="new"
    )
    db.add(new_inq)
    db.commit()
    db.refresh(new_inq)
    return new_inq

# SETTINGS
@app.get("/api/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(CompanySettingsModel).first()
    if not settings:
        settings = CompanySettingsModel(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.put("/api/settings")
def update_settings(update_data: SettingsUpdateSchema, db: Session = Depends(get_db)):
    settings = db.query(CompanySettingsModel).first()
    if not settings:
        settings = CompanySettingsModel(id=1)
        db.add(settings)
    
    for key, val in update_data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(settings, key, val)
    db.commit()
    db.refresh(settings)
    return settings

# FILE UPLOAD (MINIO S3)
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    content_type = file.content_type or "application/octet-stream"
    file_url = upload_file_bytes(contents, file.filename, content_type)
    return {"url": file_url, "filename": file.filename}
