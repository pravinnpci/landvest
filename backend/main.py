import os
import time
import uuid
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy import func, text
from database import engine, Base, get_db
from models import PlotModel, SellerModel, InquiryModel, CompanySettingsModel
from seed import seed_database
from storage_s3 import init_s3_bucket, upload_file_bytes

# Ensure local uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto migrate tables
    for i in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            try:
                with engine.connect() as conn:
                    conn.execute(text('ALTER TABLE plots ADD COLUMN IF NOT EXISTS "sellerEmail" VARCHAR(150);'))
                    # Automatically restore plots that were accidentally suspended if their seller is currently active
                    conn.execute(text('''
                        UPDATE plots 
                        SET status = 'verified_broadcasted',
                            "adminNotes" = 'DTCP verification passed & approved for public NRI broadcast.'
                        WHERE status = 'suspended' 
                        AND "sellerId" IN (SELECT id FROM sellers WHERE status = 'active');
                    '''))
                    conn.commit()
            except Exception as mig_err:
                print(f"Migration note: {mig_err}")
            seed_database()
            break
        except Exception as e:
            print(f"Waiting for database connection ({e})... {i+1}/10")
            time.sleep(2)
    
    # Optional MinIO initialization (non-blocking if MinIO is not running)
    use_minio = os.getenv("USE_MINIO", "false").lower() == "true"
    if use_minio:
        for i in range(3):
            try:
                init_s3_bucket()
                break
            except Exception as e:
                print(f"Waiting for MinIO ({e})... {i+1}/3")
                time.sleep(1)
    yield

app = FastAPI(title="LandVest Real Estate API", version="1.0.0", lifespan=lifespan)

# Mount local uploads directory for static file serving
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

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
    sellerEmail: Optional[str] = None
    expectedAppreciationRate: float = 15.0
    facing: str = "East"
    roadWidthFt: int = 30
    highlights: List[str] = []

class PlotUpdateSchema(BaseModel):
    status: Optional[str] = None
    adminNotes: Optional[str] = None
    title: Optional[str] = None
    state: Optional[str] = "Tamil Nadu"
    district: Optional[str] = None
    locality: Optional[str] = None
    dtcpNumber: Optional[str] = None
    isDtcpApproved: Optional[bool] = True
    totalSqFt: Optional[int] = None
    cents: Optional[float] = None
    pricePerSqFt: Optional[int] = None
    totalPrice: Optional[float] = None
    plotImages: Optional[List[str]] = []
    locationImage: Optional[str] = ""
    layoutPlanImage: Optional[str] = ""
    ownerName1: Optional[str] = None
    ownerPhone1: Optional[str] = None
    ownerName2: Optional[str] = None
    ownerPhone2: Optional[str] = None
    sellerId: Optional[str] = None
    sellerName: Optional[str] = None
    sellerPhone: Optional[str] = None
    sellerEmail: Optional[str] = None
    expectedAppreciationRate: Optional[float] = 15.0
    facing: Optional[str] = "East"
    roadWidthFt: Optional[int] = 30
    highlights: Optional[List[str]] = []

class RejectSchema(BaseModel):
    reason: Optional[str] = "Revision requested by Admin."

class SellerUpdateSchema(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    companyName: Optional[str] = None
    incomeTaxPan: Optional[str] = None
    country: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    status: Optional[str] = None

class SendOtpSchema(BaseModel):
    email: str
    name: Optional[str] = "Seller"

class VerifyOtpSchema(BaseModel):
    email: str
    otp: str

class SellerCreateSchema(BaseModel):
    name: str
    phone: str
    email: str
    companyName: Optional[str] = None
    incomeTaxPan: Optional[str] = None
    country: Optional[str] = "India"
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
    smtpHost: Optional[str] = None
    smtpPort: Optional[int] = None
    smtpUser: Optional[str] = None
    smtpPassword: Optional[str] = None
    smtpFromEmail: Optional[str] = None

# OTP In-Memory Store: { email.lower(): { "otp": "...", "expires_at": ..., "seller_id": ... } }
OTP_STORE = {}

def send_otp_email(to_email: str, recipient_name: str, otp_code: str, db: Session) -> bool:
    settings = db.query(CompanySettingsModel).first()
    smtp_host = (settings.smtpHost if settings and settings.smtpHost else os.getenv("SMTP_HOST"))
    smtp_port = int(settings.smtpPort if settings and settings.smtpPort else os.getenv("SMTP_PORT", "587"))
    smtp_user = (settings.smtpUser if settings and settings.smtpUser else os.getenv("SMTP_USER"))
    smtp_password = (settings.smtpPassword if settings and settings.smtpPassword else os.getenv("SMTP_PASSWORD"))
    from_email = (settings.smtpFromEmail if settings and settings.smtpFromEmail else os.getenv("SMTP_FROM_EMAIL", smtp_user or "noreply@landvest.in"))
    brand_name = (settings.companyName if settings and settings.companyName else "LandVest")

    if not smtp_host or not smtp_user:
        print(f"[OTP LOG] SMTP not configured. OTP for {to_email} is: {otp_code}")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{brand_name} - Seller Login Verification Code: {otp_code}"
        msg["From"] = f"{brand_name} <{from_email}>"
        msg["To"] = to_email

        text_content = f"Hello {recipient_name},\n\nYour 6-digit verification code to access your seller account is: {otp_code}\n\nThis code is valid for 10 minutes.\n\nRegards,\n{brand_name}"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 24px; margin: 0;">
          <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: #090d16; padding: 28px 24px; text-align: center;">
              <h1 style="color: #68d800; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">{brand_name}</h1>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 12px; font-weight: 600;">SELLER PORTAL AUTHENTICATION</p>
            </div>
            <div style="padding: 32px 28px;">
              <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 700;">Seller Login Verification Code</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                Hello <strong>{recipient_name}</strong>,<br/>
                Enter the following 6-digit One-Time Password (OTP) on the LandVest Seller Portal to verify your session:
              </p>
              <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 14px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
                <div style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #166534; font-family: 'Courier New', Courier, monospace;">
                  {otp_code}
                </div>
              </div>
              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
                <strong>Security Notice:</strong> This code expires in 10 minutes. Never share this code with anyone.
              </p>
            </div>
            <div style="background: #f8fafc; padding: 16px 28px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">&copy; {brand_name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
        server.ehlo()
        try:
            server.starttls()
            server.ehlo()
        except Exception:
            pass
        if smtp_password:
            server.login(smtp_user, smtp_password)
        server.sendmail(from_email, [to_email], msg.as_string())
        server.quit()
        print(f"[OTP LOG] Real email successfully sent to {to_email}!")
        return True
    except Exception as e:
        print(f"[OTP LOG] Error sending email via SMTP ({e}). OTP is {otp_code}")
        return False

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

@app.put("/api/plots/{plot_id}")
def update_plot(plot_id: str, plot_update: PlotUpdateSchema, db: Session = Depends(get_db)):
    plot = db.query(PlotModel).filter(PlotModel.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    
    update_data = plot_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(plot, key, value)
    
    # If status wasn't explicitly provided, default to pending_verification for seller resubmission
    if "status" not in update_data or update_data["status"] is None:
        plot.status = "pending_verification"
    if "adminNotes" not in update_data or update_data["adminNotes"] is None:
        plot.adminNotes = "Seller revised plot details. Pending Admin re-audit and broadcast approval."
    db.commit()
    db.refresh(plot)
    return plot

@app.put("/api/plots/{plot_id}/verify")
def verify_plot(plot_id: str, db: Session = Depends(get_db)):
    plot = db.query(PlotModel).filter(PlotModel.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    
    # Check if the submitter seller is currently suspended
    seller = None
    if plot.sellerId:
        seller = db.query(SellerModel).filter(SellerModel.id == plot.sellerId).first()
    if not seller and plot.sellerEmail:
        seller = db.query(SellerModel).filter(func.lower(SellerModel.email) == plot.sellerEmail.strip().lower()).first()
    
    if seller and seller.status == "suspended":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve plot: The seller '{seller.name}' ({seller.email}) is currently SUSPENDED. Please reactivate the seller account in the Sellers Directory before broadcasting this plot."
        )

    plot.status = "verified_broadcasted"
    plot.adminNotes = "DTCP verification passed & approved for public NRI broadcast."
    db.commit()
    db.refresh(plot)
    return plot

@app.put("/api/plots/{plot_id}/reject")
def reject_plot(plot_id: str, body: Optional[RejectSchema] = None, reason: Optional[str] = None, db: Session = Depends(get_db)):
    plot = db.query(PlotModel).filter(PlotModel.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    
    rejection_reason = "Revision requested by Admin."
    if body and body.reason:
        rejection_reason = body.reason
    elif reason:
        rejection_reason = reason
        
    plot.status = "rejected"
    plot.adminNotes = rejection_reason
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
    existing = db.query(SellerModel).filter(
        (SellerModel.phone == seller.phone) | (func.lower(SellerModel.email) == seller.email.strip().lower())
    ).first()
    if existing:
        return existing
    
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
    
    new_status = "suspended" if seller.status == "active" else "active"
    seller.status = new_status

    # Synchronize ONLY plots belonging to this specific seller (by sellerId or sellerEmail, NEVER by phone!)
    seller_plots = db.query(PlotModel).filter(
        (PlotModel.sellerId == seller_id) |
        (PlotModel.sellerEmail.isnot(None) & (func.lower(PlotModel.sellerEmail) == seller.email.strip().lower()))
    ).all()

    for p in seller_plots:
        if new_status == "suspended":
            if p.status == "verified_broadcasted":
                p.status = "suspended"
                p.adminNotes = "Seller account suspended by Administrator. Plot hidden from public broadcast."
        else:
            if p.status == "suspended":
                p.status = "verified_broadcasted"
                p.adminNotes = "Seller account reactivated. Plot restored to broadcast."

    db.commit()
    db.refresh(seller)
    return seller

@app.put("/api/sellers/{seller_id}")
def update_seller(seller_id: str, update_data: SellerUpdateSchema, db: Session = Depends(get_db)):
    seller = db.query(SellerModel).filter(SellerModel.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    data_dict = update_data.dict(exclude_unset=True)
    if "status" in data_dict and data_dict["status"] is not None:
        new_status = data_dict["status"]
        seller_plots = db.query(PlotModel).filter(
            (PlotModel.sellerId == seller_id) |
            (PlotModel.sellerEmail.isnot(None) & (func.lower(PlotModel.sellerEmail) == seller.email.strip().lower()))
        ).all()
        for p in seller_plots:
            if new_status == "suspended":
                if p.status == "verified_broadcasted":
                    p.status = "suspended"
                    p.adminNotes = "Seller account suspended by Administrator. Plot hidden from public broadcast."
            elif new_status == "active":
                if p.status == "suspended":
                    p.status = "verified_broadcasted"
                    p.adminNotes = "Seller account reactivated. Plot restored to broadcast."

    for key, value in data_dict.items():
        if value is not None:
            setattr(seller, key, value)
    db.commit()
    db.refresh(seller)
    return seller

@app.delete("/api/sellers/{seller_id}")
def delete_seller(seller_id: str, db: Session = Depends(get_db)):
    seller = db.query(SellerModel).filter(SellerModel.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    db.delete(seller)
    db.commit()
    return {"success": True, "message": "Seller deleted successfully"}

# AUTH / OTP
@app.post("/api/auth/seller/send-otp")
def send_seller_otp(data: SendOtpSchema, db: Session = Depends(get_db)):
    clean_email = data.email.strip().lower()
    seller = db.query(SellerModel).filter(func.lower(SellerModel.email) == clean_email).first()
    if not seller:
        # Also allow matching by phone number if user typed phone
        seller = db.query(SellerModel).filter(SellerModel.phone == data.email.strip()).first()
    if not seller:
        raise HTTPException(status_code=404, detail="This email is not registered as a seller. Please click 'Become a Seller' to register your account.")
    if seller.status != "active":
        raise HTTPException(status_code=403, detail="Your seller account is currently suspended. Please contact Administrator.")
    
    otp_code = f"{random.randint(100000, 999999)}"
    OTP_STORE[clean_email] = {
        "otp": otp_code,
        "expires_at": time.time() + 600,
        "seller_id": seller.id
    }
    delivered = send_otp_email(seller.email, seller.name, otp_code, db)
    return {
        "success": True,
        "message": f"6-digit OTP sent to {seller.email}",
        "email": seller.email,
        "email_delivered": delivered,
        "code_hint": otp_code if not delivered else None
    }

@app.post("/api/auth/seller/verify-otp")
def verify_seller_otp(data: VerifyOtpSchema, db: Session = Depends(get_db)):
    clean_email = data.email.strip().lower()
    record = OTP_STORE.get(clean_email)
    if not record:
        # Check by phone
        seller_by_phone = db.query(SellerModel).filter(SellerModel.phone == data.email.strip()).first()
        if seller_by_phone and seller_by_phone.email.lower() in OTP_STORE:
            record = OTP_STORE.get(seller_by_phone.email.lower())
            clean_email = seller_by_phone.email.lower()

    if not record:
        raise HTTPException(status_code=400, detail="OTP session not found or expired. Please click 'Resend OTP'.")
    
    if time.time() > record["expires_at"]:
        OTP_STORE.pop(clean_email, None)
        raise HTTPException(status_code=400, detail="OTP code has expired. Please request a new code.")
    
    if record["otp"] != data.otp.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please enter the correct 6-digit code.")
    
    seller_id = record["seller_id"]
    OTP_STORE.pop(clean_email, None)
    seller = db.query(SellerModel).filter(SellerModel.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller account not found.")
    return {
        "success": True,
        "seller": seller
    }

@app.post("/api/auth/seller/send-signup-otp")
def send_seller_signup_otp(data: SendOtpSchema, db: Session = Depends(get_db)):
    clean_email = data.email.strip().lower()
    existing_seller = db.query(SellerModel).filter(func.lower(SellerModel.email) == clean_email).first()
    if existing_seller:
        raise HTTPException(status_code=400, detail="An account with this email is already registered. Please log in using Email OTP Login.")
    
    otp_code = f"{random.randint(100000, 999999)}"
    OTP_STORE[clean_email] = {
        "otp": otp_code,
        "expires_at": time.time() + 600,
        "is_signup": True
    }
    recipient_name = data.name.strip() if data.name else "New Seller"
    delivered = send_otp_email(clean_email, recipient_name, otp_code, db)
    return {
        "success": True,
        "message": f"6-digit registration OTP sent to {clean_email}",
        "email": clean_email,
        "email_delivered": delivered,
        "code_hint": otp_code if not delivered else None
    }

@app.post("/api/auth/seller/verify-signup-otp")
def verify_seller_signup_otp(data: VerifyOtpSchema):
    clean_email = data.email.strip().lower()
    record = OTP_STORE.get(clean_email)
    if not record:
        raise HTTPException(status_code=400, detail="OTP session not found or expired. Please click 'Resend OTP'.")
    if time.time() > record["expires_at"]:
        OTP_STORE.pop(clean_email, None)
        raise HTTPException(status_code=400, detail="OTP code has expired. Please request a new code.")
    if record["otp"] != data.otp.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please enter the correct 6-digit code.")
    
    OTP_STORE.pop(clean_email, None)
    return {
        "success": True,
        "message": "Email verified successfully"
    }

# INQUIRIES
@app.get("/api/inquiries")
def list_inquiries(db: Session = Depends(get_db)):
    return db.query(InquiryModel).all()

@app.post("/api/inquiries")
def create_inquiry(inquiry: InquiryCreateSchema, db: Session = Depends(get_db)):
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

# FILE UPLOAD (Local Storage by default, MinIO optional)
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    content_type = file.content_type or "image/jpeg"
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    safe_filename = f"{int(time.time())}_{uuid.uuid4().hex[:8]}{ext}"

    file_url = None

    # Check if MinIO is explicitly enabled
    if os.getenv("USE_MINIO", "false").lower() == "true":
        try:
            file_url = upload_file_bytes(contents, safe_filename, content_type)
        except Exception as e:
            print(f"MinIO upload skipped/failed: {e}")

    # Fallback to direct local disk storage (100% Free, zero container dependency)
    if not file_url:
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        file_url = f"/uploads/{safe_filename}"

    return {"url": file_url, "filename": file.filename}
