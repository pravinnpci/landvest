-- ============================================================================
-- LandVest Platform - Supabase PostgreSQL Schema & Seed Migration
-- Project: iloyapuzfyidxlezixfv (ap-southeast-1)
-- ============================================================================

-- 1. COMPANY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS company_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    "companyName" VARCHAR(255) DEFAULT 'LandVest - NRI & Global Land Investments',
    tagline VARCHAR(255) DEFAULT 'High-Yield DTCP Approved Land Investments with End-to-End Legal Assurance',
    "primaryPhone" VARCHAR(50) DEFAULT '+91 98401 23456',
    "secondaryPhone" VARCHAR(50) DEFAULT '+91 94440 98765',
    "whatsappNumber" VARCHAR(50) DEFAULT '+91 98401 23456',
    email VARCHAR(150) DEFAULT 'invest@landvest.in',
    "nriDeskEmail" VARCHAR(150) DEFAULT 'nri.desk@landvest.in',
    "officeAddress" TEXT DEFAULT 'LandVest Tower, 4th Floor, Anna Salai, Guindy, Chennai, Tamil Nadu - 600032',
    "dtcpAssuranceBadgeText" VARCHAR(255) DEFAULT '100% DTCP & RERA Compliant • 30-Year Clear Title Guarantee',
    "defaultAnnualGrowthRate" FLOAT DEFAULT 15.0,
    "usdtToInrRate" FLOAT DEFAULT 86.5,
    "smtpHost" VARCHAR(150),
    "smtpPort" INTEGER DEFAULT 587,
    "smtpUser" VARCHAR(150),
    "smtpPassword" VARCHAR(150),
    "smtpFromEmail" VARCHAR(150)
);

-- 2. SELLERS TABLE
CREATE TABLE IF NOT EXISTS sellers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    "companyName" VARCHAR(150),
    "incomeTaxPan" VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    status VARCHAR(50) DEFAULT 'active',
    "createdDate" VARCHAR(50) DEFAULT CURRENT_DATE::text
);

CREATE INDEX IF NOT EXISTS idx_sellers_phone ON sellers(phone);
CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email);

-- 3. PLOTS TABLE
CREATE TABLE IF NOT EXISTS plots (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    district VARCHAR(100) NOT NULL,
    locality VARCHAR(255) NOT NULL,
    "dtcpNumber" VARCHAR(100) NOT NULL,
    "isDtcpApproved" BOOLEAN DEFAULT true,
    "totalSqFt" INTEGER NOT NULL,
    cents FLOAT NOT NULL,
    "pricePerSqFt" INTEGER NOT NULL,
    "totalPrice" FLOAT NOT NULL,
    "plotImages" JSONB DEFAULT '[]'::jsonb,
    "locationImage" TEXT DEFAULT '',
    "layoutPlanImage" TEXT DEFAULT '',
    "ownerName1" VARCHAR(150) NOT NULL,
    "ownerPhone1" VARCHAR(50) NOT NULL,
    "ownerName2" VARCHAR(150),
    "ownerPhone2" VARCHAR(50),
    "sellerId" VARCHAR(50) NOT NULL,
    "sellerName" VARCHAR(150) NOT NULL,
    "sellerPhone" VARCHAR(50) NOT NULL,
    "sellerEmail" VARCHAR(150),
    status VARCHAR(50) DEFAULT 'verified_broadcasted',
    "adminNotes" TEXT,
    "expectedAppreciationRate" FLOAT DEFAULT 15.0,
    facing VARCHAR(50) DEFAULT 'East',
    "roadWidthFt" INTEGER DEFAULT 30,
    highlights JSONB DEFAULT '[]'::jsonb,
    "createdAt" VARCHAR(50) DEFAULT CURRENT_DATE::text,
    "updatedAt" VARCHAR(50) DEFAULT CURRENT_DATE::text
);

CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);
CREATE INDEX IF NOT EXISTS idx_plots_district ON plots(district);
CREATE INDEX IF NOT EXISTS idx_plots_sellerId ON plots("sellerId");

-- 4. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(50) PRIMARY KEY,
    "plotId" VARCHAR(50),
    "plotTitle" VARCHAR(255),
    "investorName" VARCHAR(150) NOT NULL,
    "investorEmail" VARCHAR(150) NOT NULL,
    "investorPhone" VARCHAR(50) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    currency VARCHAR(20) DEFAULT 'USD',
    "investmentHorizonYears" INTEGER DEFAULT 5,
    message TEXT,
    "createdAt" VARCHAR(50) DEFAULT CURRENT_DATE::text,
    status VARCHAR(50) DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_inquiries_createdAt ON inquiries("createdAt");

-- 5. SEED INITIAL COMPANY SETTINGS
INSERT INTO company_settings (
    id, "companyName", tagline, "primaryPhone", "secondaryPhone",
    "whatsappNumber", email, "nriDeskEmail", "officeAddress",
    "dtcpAssuranceBadgeText", "defaultAnnualGrowthRate", "usdtToInrRate"
)
VALUES (
    1,
    'LandVest - NRI & Global Land Investments',
    'High-Yield DTCP Approved Land Investments with End-to-End Legal Assurance',
    '+91 98401 23456',
    '+91 94440 98765',
    '+91 98401 23456',
    'invest@landvest.in',
    'nri.desk@landvest.in',
    'LandVest Tower, 4th Floor, Anna Salai, Guindy, Chennai, Tamil Nadu - 600032',
    '100% DTCP & RERA Compliant • 30-Year Clear Title Guarantee',
    15.0,
    86.5
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED ACTIVE SELLERS
INSERT INTO sellers (id, name, phone, email, "companyName", "incomeTaxPan", country, district, state, status, "createdDate")
VALUES
    ('seller-1', 'R. K. Senthil Nathan', '+91 98421 11223', 'senthil.plots@gmail.com', 'Kongu Promoters', 'AAECK1234F', 'India', 'Coimbatore', 'Tamil Nadu', 'active', '2025-01-15'),
    ('seller-2', 'K. Vignesh Kumar', '+91 97890 44556', 'vignesh.realtors@gmail.com', 'Chennai Land Promoters', 'ABEPK5678D', 'India', 'Chennai', 'Tamil Nadu', 'active', '2025-01-20'),
    ('seller-3', 'Praveen AU', '+91 98401 99999', 'praveenau26@gmail.com', 'Prime DTCP Lands', 'ABCDE1234F', 'India', 'Chennai', 'Tamil Nadu', 'active', '2025-01-25'),
    ('seller-admin', 'Super Admin Partner', '+91 98401 23456', 'sapravin46@gmail.com', 'LandVest Direct', 'PANLV9988X', 'India', 'Chennai', 'Tamil Nadu', 'active', '2025-01-01')
ON CONFLICT (id) DO UPDATE SET status = 'active';

-- 7. SEED VERIFIED DTCP PLOTS
INSERT INTO plots (
    id, title, state, district, locality, "dtcpNumber", "isDtcpApproved",
    "totalSqFt", cents, "pricePerSqFt", "totalPrice",
    "plotImages", "locationImage", "layoutPlanImage",
    "ownerName1", "ownerPhone1", "sellerId", "sellerName", "sellerPhone", "sellerEmail",
    status, "adminNotes", "expectedAppreciationRate", facing, "roadWidthFt",
    highlights, "createdAt", "updatedAt"
)
VALUES
(
    'plot-001',
    'DTCP Prime Avenue - Sector 4 Golden Highway Corridor',
    'Tamil Nadu',
    'Coimbatore',
    'Saravanampatti - Kovilpalayam IT Corridor, Near SEZ Hub',
    'DTCP/LP/CBE/148/2024',
    true,
    2400,
    5.51,
    1650,
    3960000,
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'M. Duraiswamy',
    '+91 94433 22110',
    'seller-1',
    'R. K. Senthil Nathan',
    '+91 98421 11223',
    'senthil.plots@gmail.com',
    'verified_broadcasted',
    'DTCP approval verified by Directorate of Town and Country Planning Coimbatore. 30-year clean EC validated.',
    16.5,
    'North-East',
    40,
    '["Just 7 mins to Saravanampatti IT SEZ & Tech Mahindra", "40 Ft Bitumen Tar Road with Streetlights & Storm Drainage", "High Rental Demand Zone with Immediate Construction Approval", "30-Year Encumbrance Free Clean Mother Title"]'::jsonb,
    '2025-02-20',
    '2025-03-01'
),
(
    'plot-002',
    'AeroVista Metro Greens - New Greenfield Airport Proximity',
    'Tamil Nadu',
    'Kanchipuram',
    'Sunguvarchatram - Sriperumbudur Industrial Hub Corridor',
    'DTCP/LP/KPM/082/2024',
    true,
    1800,
    4.13,
    2200,
    3960000,
    '["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'V. Shanmugam',
    '+91 98402 33445',
    'seller-2',
    'K. Vignesh Kumar',
    '+91 97890 44556',
    'vignesh.realtors@gmail.com',
    'verified_broadcasted',
    'Parandur Airport corridor strategic zone. Complete legal search passed.',
    21.0,
    'East',
    33,
    '["12 mins drive to upcoming Parandur Greenfield International Airport", "Surrounded by Hyundai, Samsung, and Foxconn industrial parks", "Gated Community Layout with 24/7 Security & CCTV Infrastructure", "Compound Wall Built around boundary with individual plot markers"]'::jsonb,
    '2025-02-28',
    '2025-03-05'
),
(
    'plot-003',
    'Heritage Palm Valley - Smart City Investment Enclave',
    'Tamil Nadu',
    'Madurai',
    'Othakadai - Ring Road Junction, High Court Extension',
    'DTCP/LP/MDU/215/2024',
    true,
    2178,
    5.0,
    1450,
    3158100,
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'T. Balakrishnan',
    '+91 94421 88990',
    'seller-3',
    'Praveen AU',
    '+91 98401 99999',
    'praveenau26@gmail.com',
    'verified_broadcasted',
    'Madurai Smart City Ring Road direct access. RERA registered layout.',
    14.8,
    'North',
    30,
    '["5 Mins from Madurai Bench of Madras High Court", "Sweet ground water at 25 feet depth throughout the year", "Direct connectivity to Madurai-Tuticorin Industrial Corridor", "Immediate Registry with clear parent deed from 1985"]'::jsonb,
    '2025-03-01',
    '2025-03-08'
),
(
    'plot-004',
    'Emerald Silicon Ridge - Bangalore-Hosur Tech Corridor',
    'Tamil Nadu',
    'Krishnagiri',
    'Hosur - Bagalur Road, Near Electronic City Extension',
    'DTCP/LP/KGI/119/2024',
    true,
    1500,
    3.44,
    2600,
    3900000,
    '["https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'S. Ranganathan',
    '+91 98840 55667',
    'seller-1',
    'R. K. Senthil Nathan',
    '+91 98421 11223',
    'senthil.plots@gmail.com',
    'verified_broadcasted',
    'Hosur EV Hub & Tech corridor. Verified title deed with nil encumbrance certificate.',
    19.2,
    'East',
    30,
    '["15 mins to Electronic City, Bangalore via Elevated Expressway", "Near Tata Electronics, Delta & Ather EV Manufacturing Hub", "Underground cabling for Electricity and High-speed Fiber Optic Internet", "Blacktop tar roads with ornamental street lighting and children park"]'::jsonb,
    '2025-03-04',
    '2025-03-10'
),
(
    'plot-005',
    'Grand Horizon Ocean Breeze - ECR Coastal Investment Corridor',
    'Tamil Nadu',
    'Chengalpattu',
    'Mahabalipuram - ECR Highway, Near Poonjeri Junction',
    'DTCP/LP/CPT/044/2024',
    true,
    3000,
    6.89,
    1850,
    5550000,
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'G. Venkatesh',
    '+91 97910 88991',
    'seller-2',
    'K. Vignesh Kumar',
    '+91 97890 44556',
    'vignesh.realtors@gmail.com',
    'verified_broadcasted',
    'ECR Tourism & High-Appreciation Zone. Complete legal scrutiny passed.',
    17.5,
    'South-East',
    40,
    '["Direct access to 4-Lane East Coast Road (ECR)", "3 mins from UNESCO World Heritage Monuments & Shore Temple", "Ideal for Luxury Villa construction, Weekend Homes or High-Yield Airbnb", "Copious sweet water and crystal clear coastal breeze"]'::jsonb,
    '2025-03-08',
    '2025-03-12'
),
(
    'plot-006',
    'Royal Orchard Phase II - Outer Ring Road Expansion Zone',
    'Tamil Nadu',
    'Tiruvallur',
    'Pattabiram - Nemam Growth Corridor, Near Tidel Park 3',
    'DTCP/LP/TLR/302/2024',
    true,
    1200,
    2.75,
    2150,
    2580000,
    '["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'A. Murali',
    '+91 94451 66778',
    'seller-3',
    'Praveen AU',
    '+91 98401 99999',
    'praveenau26@gmail.com',
    'verified_broadcasted',
    'Near New Pattabiram Eco Tidel Park. Verified 30-year mother deed.',
    18.0,
    'North',
    30,
    '["8 Mins to Newly Opened Pattabiram Tidel Park III", "Easy connectivity to Chennai Outer Ring Road (ORR) 400 Ft Highway", "Fully compounded layout with grand entrance arch and water connection", "Rapid industrial growth belt guaranteeing high liquidity"]'::jsonb,
    '2025-03-10',
    '2025-03-14'
)
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    "plotImages" = EXCLUDED."plotImages",
    "totalPrice" = EXCLUDED."totalPrice";
