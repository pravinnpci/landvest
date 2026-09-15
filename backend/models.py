from sqlalchemy import Column, String, Integer, Float, Boolean, Text, JSON, DateTime
from datetime import datetime
from database import Base

class PlotModel(Base):
    __tablename__ = "plots"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    state = Column(String(100), default="Tamil Nadu")
    district = Column(String(100), nullable=False, index=True)
    locality = Column(String(255), nullable=False)
    dtcpNumber = Column(String(100), nullable=False, index=True)
    isDtcpApproved = Column(Boolean, default=True)
    totalSqFt = Column(Integer, nullable=False)
    cents = Column(Float, nullable=False)
    pricePerSqFt = Column(Integer, nullable=False)
    totalPrice = Column(Float, nullable=False)
    plotImages = Column(JSON, default=list)
    locationImage = Column(Text, default="")
    layoutPlanImage = Column(Text, default="")
    ownerName1 = Column(String(150), nullable=False)
    ownerPhone1 = Column(String(50), nullable=False)
    ownerName2 = Column(String(150), nullable=True)
    ownerPhone2 = Column(String(50), nullable=True)
    sellerId = Column(String(50), nullable=False, index=True)
    sellerName = Column(String(150), nullable=False)
    sellerPhone = Column(String(50), nullable=False)
    status = Column(String(50), default="verified_broadcasted", index=True)
    adminNotes = Column(Text, nullable=True)
    expectedAppreciationRate = Column(Float, default=15.0)
    facing = Column(String(50), default="East")
    roadWidthFt = Column(Integer, default=30)
    highlights = Column(JSON, default=list)
    createdAt = Column(String(50), default=lambda: datetime.now().strftime("%Y-%m-%d"))
    updatedAt = Column(String(50), default=lambda: datetime.now().strftime("%Y-%m-%d"))

class SellerModel(Base):
    __tablename__ = "sellers"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False, index=True)
    email = Column(String(150), nullable=False)
    companyName = Column(String(150), nullable=True)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Tamil Nadu")
    status = Column(String(50), default="active")
    createdDate = Column(String(50), default=lambda: datetime.now().strftime("%Y-%m-%d"))

class InquiryModel(Base):
    __tablename__ = "inquiries"

    id = Column(String(50), primary_key=True, index=True)
    plotId = Column(String(50), nullable=True, index=True)
    plotTitle = Column(String(255), nullable=True)
    investorName = Column(String(150), nullable=False)
    investorEmail = Column(String(150), nullable=False)
    investorPhone = Column(String(50), nullable=False)
    country = Column(String(100), default="USA")
    currency = Column(String(20), default="USD")
    investmentHorizonYears = Column(Integer, default=5)
    message = Column(Text, nullable=True)
    createdAt = Column(String(50), default=lambda: datetime.now().strftime("%Y-%m-%d"))
    status = Column(String(50), default="new")

class CompanySettingsModel(Base):
    __tablename__ = "company_settings"

    id = Column(Integer, primary_key=True, default=1)
    companyName = Column(String(255), default="LandVest - NRI & Global Land Investments")
    tagline = Column(String(255), default="High-Yield DTCP Approved Land Investments with End-to-End Legal Assurance")
    primaryPhone = Column(String(50), default="+91 98401 23456")
    secondaryPhone = Column(String(50), default="+91 94440 98765")
    whatsappNumber = Column(String(50), default="+91 98401 23456")
    email = Column(String(150), default="invest@landvest.in")
    nriDeskEmail = Column(String(150), default="nri.desk@landvest.in")
    officeAddress = Column(Text, default="LandVest Tower, 4th Floor, Anna Salai, Guindy, Chennai, Tamil Nadu - 600032")
    dtcpAssuranceBadgeText = Column(String(255), default="100% DTCP & RERA Compliant • 30-Year Clear Title Guarantee")
    defaultAnnualGrowthRate = Column(Float, default=15.0)
    usdtToInrRate = Column(Float, default=86.5)
