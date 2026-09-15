from database import SessionLocal
from models import PlotModel, SellerModel, InquiryModel, CompanySettingsModel

INITIAL_PLOTS = [
    {
        "id": "plot-001",
        "title": "DTCP Prime Avenue - Sector 4 Golden Highway Corridor",
        "state": "Tamil Nadu",
        "district": "Coimbatore",
        "locality": "Saravanampatti - Kovilpalayam IT Corridor, Near SEZ Hub",
        "dtcpNumber": "DTCP/LP/CBE/148/2024",
        "isDtcpApproved": True,
        "totalSqFt": 2400,
        "cents": 5.51,
        "pricePerSqFt": 1650,
        "totalPrice": 3960000,
        "plotImages": [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80"
        ],
        "locationImage": "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
        "layoutPlanImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "ownerName1": "M. Duraiswamy",
        "ownerPhone1": "+91 94433 22110",
        "sellerId": "seller-1",
        "sellerName": "R. K. Senthil Nathan",
        "sellerPhone": "+91 98421 11223",
        "status": "verified_broadcasted",
        "adminNotes": "DTCP approval verified by Directorate of Town and Country Planning Coimbatore. 30-year clean EC validated.",
        "expectedAppreciationRate": 16.5,
        "facing": "North-East",
        "roadWidthFt": 40,
        "highlights": [
            "Just 7 mins to Saravanampatti IT SEZ & Tech Mahindra",
            "40 Ft Bitumen Tar Road with Streetlights & Storm Drainage",
            "High Rental Demand Zone with Immediate Construction Approval",
            "30-Year Encumbrance Free Clean Mother Title"
        ],
        "createdAt": "2025-02-20",
        "updatedAt": "2025-03-01"
    },
    {
        "id": "plot-002",
        "title": "AeroVista Metro Greens - New Greenfield Airport Proximity",
        "state": "Tamil Nadu",
        "district": "Kanchipuram",
        "locality": "Sunguvarchatram - Sriperumbudur Industrial Hub Corridor",
        "dtcpNumber": "DTCP/LP/KPM/082/2024",
        "isDtcpApproved": True,
        "totalSqFt": 1800,
        "cents": 4.13,
        "pricePerSqFt": 2200,
        "totalPrice": 3960000,
        "plotImages": [
            "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80"
        ],
        "locationImage": "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
        "layoutPlanImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "ownerName1": "V. Shanmugam",
        "ownerPhone1": "+91 98402 33445",
        "sellerId": "seller-2",
        "sellerName": "K. Vignesh Kumar",
        "sellerPhone": "+91 97890 44556",
        "status": "verified_broadcasted",
        "adminNotes": "Parandur Airport corridor strategic zone. Complete legal search passed.",
        "expectedAppreciationRate": 21.0,
        "facing": "East",
        "roadWidthFt": 33,
        "highlights": [
            "12 mins drive to upcoming Parandur Greenfield International Airport",
            "Surrounded by Hyundai, Samsung, and Foxconn industrial parks",
            "Gated Community Layout with 24/7 Security & CCTV Infrastructure",
            "Compound Wall Built around boundary with individual plot markers"
        ],
        "createdAt": "2025-02-28",
        "updatedAt": "2025-03-05"
    },
    {
        "id": "plot-003",
        "title": "Heritage Palm Valley - Smart City Investment Enclave",
        "state": "Tamil Nadu",
        "district": "Madurai",
        "locality": "Othakadai - Ring Road Junction, High Court Extension",
        "dtcpNumber": "DTCP/LP/MDU/215/2024",
        "isDtcpApproved": True,
        "totalSqFt": 2178,
        "cents": 5.0,
        "pricePerSqFt": 1450,
        "totalPrice": 3158100,
        "plotImages": [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
        ],
        "locationImage": "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
        "layoutPlanImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "ownerName1": "T. Balakrishnan",
        "ownerPhone1": "+91 94421 88990",
        "sellerId": "seller-3",
        "sellerName": "Anand Gopalakrishnan",
        "sellerPhone": "+91 99620 77889",
        "status": "verified_broadcasted",
        "adminNotes": "Approved by Madurai LPA & DTCP. Ready for immediate sale deed registration.",
        "expectedAppreciationRate": 15.0,
        "facing": "Corner Plot",
        "roadWidthFt": 40,
        "highlights": [
            "Corner Plot with Dual 40ft & 30ft Road Access",
            "High Ground Water Zone with Sweet Potable Water at 40 Ft",
            "Quick Connectivity to Madurai Ring Road & AIIMS Hospital Site",
            "Clear Title Deed with Bank Loan Approval Guarantee"
        ],
        "createdAt": "2025-03-02",
        "updatedAt": "2025-03-10"
    }
]

INITIAL_SELLERS = [
    {
        "id": "seller-1",
        "name": "R. K. Senthil Nathan",
        "phone": "+91 98421 11223",
        "email": "senthil.nathan@realtyholdings.in",
        "companyName": "Kongu Land Developers",
        "district": "Coimbatore",
        "state": "Tamil Nadu",
        "status": "active",
        "createdDate": "2025-01-15"
    },
    {
        "id": "seller-2",
        "name": "K. Vignesh Kumar",
        "phone": "+91 97890 44556",
        "email": "vignesh.kumar@greenacres.in",
        "companyName": "Vignesh Promoters & Infra",
        "district": "Chennai",
        "state": "Tamil Nadu",
        "status": "active",
        "createdDate": "2025-02-10"
    }
]

def seed_database():
    db = SessionLocal()
    try:
        # Settings
        existing_settings = db.query(CompanySettingsModel).first()
        if not existing_settings:
            settings = CompanySettingsModel(id=1)
            db.add(settings)
            db.commit()
            print("Company settings seeded.")

        # Sellers
        for s_data in INITIAL_SELLERS:
            existing_seller = db.query(SellerModel).filter_by(id=s_data["id"]).first()
            if not existing_seller:
                seller = SellerModel(**s_data)
                db.add(seller)
        db.commit()
        print("Sellers seeded.")

        # Plots
        for p_data in INITIAL_PLOTS:
            existing_plot = db.query(PlotModel).filter_by(id=p_data["id"]).first()
            if not existing_plot:
                plot = PlotModel(**p_data)
                db.add(plot)
        db.commit()
        print("Initial DTCP plots seeded.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
