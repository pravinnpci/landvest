require('dotenv').config({ path: ['.env.local', '.env'] });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. SUPABASE POSTGRES CONNECTION POOL
const dbUrl = process.env.DATABASE_URL || 
  'postgresql://postgres.iloyapuzfyidxlezixfv:Land%40vest123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require';

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client:', err.message);
});

// In-Memory OTP Store
const OTP_STORE = {};

// Multer memory storage for uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// ROUTER THAT HANDLES BOTH /api/ AND ROOT PREFIXES
const router = express.Router();

// HEALTH CHECK
router.get(['/health', '/api/health'], async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      app: 'LandVest Platform',
      version: '1.0.0',
      database: 'Connected to Supabase PostgreSQL',
      timestamp: dbRes.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// SETTINGS
router.get(['/settings', '/api/settings'], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM company_settings WHERE id = 1 LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        companyName: 'LandVest - NRI & Global Land Investments',
        tagline: 'High-Yield DTCP Approved Land Investments',
        primaryPhone: '+91 98401 23456',
        secondaryPhone: '+91 94440 98765',
        whatsappNumber: '+91 98401 23456',
        email: 'invest@landvest.in',
        nriDeskEmail: 'nri.desk@landvest.in',
        officeAddress: 'LandVest Tower, Guindy, Chennai',
        dtcpAssuranceBadgeText: '100% DTCP Compliant',
        defaultAnnualGrowthRate: 15.0,
        usdtToInrRate: 86.5
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put(['/settings', '/api/settings'], async (req, res) => {
  try {
    const updates = req.body;
    const fields = Object.keys(updates);
    if (fields.length === 0) return res.json({ message: 'No changes provided' });

    const setClauses = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
    const values = fields.map(f => updates[f]);

    const sql = `UPDATE company_settings SET ${setClauses} WHERE id = 1 RETURNING *`;
    const result = await pool.query(sql, values);
    res.json(result.rows[0] || updates);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// PLOTS
router.get(['/plots', '/api/plots'], async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM plots';
    const params = [];
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    query += ' ORDER BY "createdAt" DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching plots:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get(['/plots/:id', '/api/plots/:id'], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plots WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ detail: 'Plot not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(['/plots', '/api/plots'], async (req, res) => {
  try {
    const plotData = req.body;
    const plotId = `plot-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const keys = [
      'id', 'title', 'state', 'district', 'locality', 'dtcpNumber', 'isDtcpApproved',
      'totalSqFt', 'cents', 'pricePerSqFt', 'totalPrice', 'plotImages', 'locationImage',
      'layoutPlanImage', 'ownerName1', 'ownerPhone1', 'ownerName2', 'ownerPhone2',
      'sellerId', 'sellerName', 'sellerPhone', 'sellerEmail', 'status', 'adminNotes',
      'expectedAppreciationRate', 'facing', 'roadWidthFt', 'highlights', 'createdAt', 'updatedAt'
    ];

    const plotImages = typeof plotData.plotImages === 'string' ? plotData.plotImages : JSON.stringify(plotData.plotImages || []);
    const highlights = typeof plotData.highlights === 'string' ? plotData.highlights : JSON.stringify(plotData.highlights || []);

    const values = [
      plotId,
      plotData.title || 'DTCP Sanctioned Prime Plot',
      plotData.state || 'Tamil Nadu',
      plotData.district || 'Chennai',
      plotData.locality || '',
      plotData.dtcpNumber || 'DTCP/PENDING',
      plotData.isDtcpApproved ?? true,
      Number(plotData.totalSqFt) || 1200,
      Number(plotData.cents) || 2.75,
      Number(plotData.pricePerSqFt) || 1500,
      Number(plotData.totalPrice) || 1800000,
      plotImages,
      plotData.locationImage || '',
      plotData.layoutPlanImage || '',
      plotData.ownerName1 || 'Land Owner',
      plotData.ownerPhone1 || '',
      plotData.ownerName2 || null,
      plotData.ownerPhone2 || null,
      plotData.sellerId || 'seller-guest',
      plotData.sellerName || 'Seller',
      plotData.sellerPhone || '',
      plotData.sellerEmail || null,
      'pending_verification',
      plotData.adminNotes || 'New seller submission. Pending DTCP verification and Admin broadcast.',
      Number(plotData.expectedAppreciationRate) || 15.0,
      plotData.facing || 'East',
      Number(plotData.roadWidthFt) || 30,
      highlights,
      today,
      today
    ];

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const colNames = keys.map(k => `"${k}"`).join(', ');

    const sql = `INSERT INTO plots (${colNames}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating plot:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put(['/plots/:id', '/api/plots/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).filter(k => k !== 'id');
    if (fields.length === 0) return res.json({ message: 'No fields to update' });

    const values = [];
    const setClauses = fields.map((f, i) => {
      let val = updates[f];
      if ((f === 'plotImages' || f === 'highlights') && typeof val !== 'string') {
        val = JSON.stringify(val);
      }
      values.push(val);
      return `"${f}" = $${i + 1}`;
    });

    values.push(id);
    const sql = `UPDATE plots SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(sql, values);
    if (result.rows.length === 0) return res.status(404).json({ detail: 'Plot not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating plot:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put(['/plots/:id/verify', '/api/plots/:id/verify'], async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE plots 
      SET status = 'verified_broadcasted', 
          "adminNotes" = 'DTCP verification passed & approved for public NRI broadcast.' 
      WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(sql, [id]);
    if (result.rows.length === 0) return res.status(404).json({ detail: 'Plot not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(['/plots/:id/reject', '/api/plots/:id/reject'], async (req, res) => {
  try {
    const { id } = req.params;
    const reason = req.body.reason || 'Revision requested by Admin.';
    const sql = `
      UPDATE plots 
      SET status = 'rejected', 
          "adminNotes" = $2 
      WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(sql, [id, reason]);
    if (result.rows.length === 0) return res.status(404).json({ detail: 'Plot not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(['/plots/:id', '/api/plots/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM plots WHERE id = $1', [id]);
    res.json({ success: true, message: 'Plot deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SELLERS
router.get(['/sellers', '/api/sellers'], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sellers ORDER BY "createdDate" DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(['/sellers', '/api/sellers'], async (req, res) => {
  try {
    const s = req.body;
    const sellerId = `seller-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const sql = `
      INSERT INTO sellers (id, name, phone, email, "companyName", "incomeTaxPan", country, district, state, status, "createdDate")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      sellerId,
      s.name,
      s.phone,
      s.email,
      s.companyName || null,
      s.incomeTaxPan || null,
      s.country || 'India',
      s.district || 'Chennai',
      s.state || 'Tamil Nadu',
      'active',
      today
    ];
    const result = await pool.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(['/sellers/:id/toggle', '/api/sellers/:id/toggle'], async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT status FROM sellers WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ detail: 'Seller not found' });

    const newStatus = existing.rows[0].status === 'active' ? 'suspended' : 'active';
    const result = await pool.query('UPDATE sellers SET status = $1 WHERE id = $2 RETURNING *', [newStatus, id]);

    // If suspended, suspend their plots; if activated, restore them
    if (newStatus === 'suspended') {
      await pool.query('UPDATE plots SET status = $1 WHERE "sellerId" = $2', ['suspended', id]);
    } else {
      await pool.query('UPDATE plots SET status = $1 WHERE "sellerId" = $2 AND status = $3', ['verified_broadcasted', id, 'suspended']);
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(['/sellers/:id', '/api/sellers/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).filter(k => k !== 'id');
    if (fields.length === 0) return res.json({ message: 'No fields provided' });

    const values = fields.map(f => updates[f]);
    values.push(id);
    const setClauses = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');

    const sql = `UPDATE sellers SET ${setClauses} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(sql, values);
    if (result.rows.length === 0) return res.status(404).json({ detail: 'Seller not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(['/sellers/:id', '/api/sellers/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sellers WHERE id = $1', [id]);
    res.json({ success: true, message: 'Seller deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SELLER OTP AUTH
router.post(['/auth/seller/send-otp', '/api/auth/seller/send-otp'], async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ detail: 'Email is required' });

    const checkSeller = await pool.query('SELECT * FROM sellers WHERE LOWER(email) = LOWER($1)', [email]);
    if (checkSeller.rows.length === 0) {
      return res.status(404).json({ detail: 'No seller account found with this email address. Please register first.' });
    }

    const seller = checkSeller.rows[0];
    if (seller.status === 'suspended') {
      return res.status(403).json({ detail: 'Your seller account has been suspended by Admin. Please contact support.' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    OTP_STORE[email.toLowerCase()] = {
      otp: otpCode,
      sellerId: seller.id,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
    };

    console.log(`[OTP LOGIN] Verification code for ${email} is: ${otpCode}`);

    res.json({
      success: true,
      message: `Verification code sent to ${email}.`,
      email_delivered: false,
      code_hint: otpCode // For seamless testing & demo
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.post(['/auth/seller/verify-otp', '/api/auth/seller/verify-otp'], async (req, res) => {
  try {
    const { email, otp } = req.body;
    const store = OTP_STORE[email?.toLowerCase()];

    if (!store || store.otp !== otp || Date.now() > store.expiresAt) {
      return res.status(400).json({ detail: 'Invalid or expired OTP code.' });
    }

    delete OTP_STORE[email.toLowerCase()];
    const result = await pool.query('SELECT * FROM sellers WHERE id = $1', [store.sellerId]);
    if (result.rows.length === 0) return res.status(404).json({ detail: 'Seller not found' });

    res.json({ success: true, seller: result.rows[0] });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.post(['/auth/seller/send-signup-otp', '/api/auth/seller/send-signup-otp'], async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ detail: 'Email is required' });

    const checkSeller = await pool.query('SELECT id FROM sellers WHERE LOWER(email) = LOWER($1)', [email]);
    if (checkSeller.rows.length > 0) {
      return res.status(400).json({ detail: 'An account with this email already exists. Please login instead.' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    OTP_STORE[email.toLowerCase()] = {
      otp: otpCode,
      name: name || 'Seller',
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    console.log(`[SIGNUP OTP] Verification code for ${email} is: ${otpCode}`);

    res.json({
      success: true,
      message: `Registration OTP sent to ${email}`,
      email_delivered: false,
      code_hint: otpCode
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.post(['/auth/seller/verify-signup-otp', '/api/auth/seller/verify-signup-otp'], async (req, res) => {
  try {
    const { email, otp } = req.body;
    const store = OTP_STORE[email?.toLowerCase()];

    if (!store || store.otp !== otp || Date.now() > store.expiresAt) {
      return res.status(400).json({ detail: 'Invalid or expired OTP code.' });
    }

    delete OTP_STORE[email.toLowerCase()];
    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// INQUIRIES
router.get(['/inquiries', '/api/inquiries'], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(['/inquiries', '/api/inquiries'], async (req, res) => {
  try {
    const inq = req.body;
    const inqId = `inq-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const sql = `
      INSERT INTO inquiries (id, "plotId", "plotTitle", "investorName", "investorEmail", "investorPhone", country, currency, "investmentHorizonYears", message, "createdAt", status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      inqId,
      inq.plotId || null,
      inq.plotTitle || 'General Inquiry',
      inq.investorName,
      inq.investorEmail,
      inq.investorPhone,
      inq.country || 'USA',
      inq.currency || 'USD',
      Number(inq.investmentHorizonYears) || 5,
      inq.message || '',
      today,
      'new'
    ];
    const result = await pool.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FILE UPLOAD (Converts to Data URL for serverless resilience)
router.post(['/upload', '/api/upload'], upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file provided' });
    }
    const mimeType = req.file.mimetype || 'image/jpeg';
    const base64Data = req.file.buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    res.json({
      url: dataUrl,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MOUNT ROUTER
app.use(router);

// Standalone Server Start (for local testing)
const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LandVest Serverless Express API running on port ${PORT}`);
  });
}

module.exports = app;
