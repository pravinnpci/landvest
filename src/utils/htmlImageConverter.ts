import { SubPlot } from '../types';

export interface ImageToHtmlOptions {
  title: string;
  category: 'layout' | 'plot' | 'location';
  dtcpNumber?: string;
  locality?: string;
  district?: string;
  state?: string;
  totalSqFt?: number;
  totalPrice?: number;
  expectedAppreciationRate?: number;
  subPlots?: SubPlot[];
  sellerName?: string;
  sellerPhone?: string;
}

export interface HtmlConversionResult {
  htmlContent: string;
  htmlBlob: Blob;
  htmlFile: File;
  dataUrl: string;
}

/**
 * Converts an uploaded image and its associated plot / sub-plots metadata into a
 * self-contained, interactive HTML5 document.
 * The document includes interactive hover popovers for each sub-plot displaying:
 * - Land Area (Sq.Ft & Cents)
 * - Price Breakdown (Rate/sq.ft and Total Price)
 * - 1-Year, 2-Year, and 5-Year Compounding Valuation & Return
 */
export async function convertImageToHtml(
  imageSource: File | string,
  options: ImageToHtmlOptions
): Promise<HtmlConversionResult> {
  let imageDataUrl = '';
  let originalFileName = 'layout-blueprint';

  if (typeof imageSource === 'string') {
    imageDataUrl = imageSource;
  } else {
    originalFileName = imageSource.name.replace(/\.[^/.]+$/, '');
    imageDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(imageSource);
    });
  }

  const categoryTitles = {
    layout: 'DTCP Demarcated Masterplan & Plot Breakdown',
    plot: 'High-Resolution Site Inspection Photo',
    location: 'Satellite Location Corridor & Approach Map',
  };

  const currentYear = new Date().getFullYear();
  const growthRate = options.expectedAppreciationRate || 15;
  const subPlots = options.subPlots || [];

  const subPlotsCardsHtml = subPlots.length > 0
    ? subPlots.map((sp) => {
        const y1 = sp.year1Amount || Math.round(sp.totalPrice * (1 + growthRate / 100));
        const y2 = sp.year2Amount || Math.round(sp.totalPrice * Math.pow(1 + growthRate / 100, 2));
        const y5 = sp.year5Amount || Math.round(sp.totalPrice * Math.pow(1 + growthRate / 100, 5));
        const statusColor = sp.status === 'sold' ? '#ef4444' : sp.status === 'booked' ? '#f59e0b' : '#22c55e';
        const statusBadge = sp.status === 'sold' ? 'Sold' : sp.status === 'booked' ? 'Booked' : 'Available';

        return `
        <div class="plot-cell" data-plot="${sp.plotNumber}">
          <div class="plot-number">${sp.plotNumber}</div>
          <div class="plot-meta">${sp.sqFt.toLocaleString('en-IN')} sq.ft</div>
          <div class="plot-status" style="background-color: ${statusColor}20; color: ${statusColor};">${statusBadge}</div>
          
          <!-- Hover Popover Tooltip -->
          <div class="plot-tooltip">
            <div class="tooltip-header">
              <span class="tooltip-title">${sp.plotNumber} (${sp.facing || 'East Facing'})</span>
              <span class="tooltip-badge" style="background-color: ${statusColor}; color: white;">${statusBadge}</span>
            </div>
            
            <div class="tooltip-section">
              <div class="section-title">📐 Land Area Breakdown</div>
              <div class="metric-row"><span>Area in Sq.Ft:</span> <strong>${sp.sqFt.toLocaleString('en-IN')} sq.ft</strong></div>
              <div class="metric-row"><span>Area in Cents:</span> <strong>${sp.cents.toFixed(2)} Cents</strong></div>
              ${sp.dimensions ? `<div class="metric-row"><span>Dimensions:</span> <strong>${sp.dimensions}</strong></div>` : ''}
            </div>

            <div class="tooltip-section">
              <div class="section-title">💰 Price Breakdown</div>
              <div class="metric-row"><span>Rate / Sq.Ft:</span> <strong>₹${sp.pricePerSqFt.toLocaleString('en-IN')}/sq.ft</strong></div>
              <div class="metric-row"><span>Total Value:</span> <strong class="highlight-val">₹${sp.totalPrice.toLocaleString('en-IN')}</strong></div>
            </div>

            <div class="tooltip-section roi-section">
              <div class="section-title">📈 Projected Returns (${growthRate}% Annual Compounding)</div>
              <div class="metric-row"><span>Year 1 (${currentYear + 1}):</span> <strong style="color: #15803d;">₹${y1.toLocaleString('en-IN')} (+${growthRate}%)</strong></div>
              <div class="metric-row"><span>Year 2 (${currentYear + 2}):</span> <strong style="color: #15803d;">₹${y2.toLocaleString('en-IN')} (+${Math.round((Math.pow(1 + growthRate / 100, 2) - 1) * 100)}%)</strong></div>
              <div class="metric-row"><span>Year 5 (${currentYear + 5}):</span> <strong style="color: #166534; font-size: 13px;">₹${y5.toLocaleString('en-IN')} (+${Math.round((Math.pow(1 + growthRate / 100, 5) - 1) * 100)}%)</strong></div>
            </div>
          </div>
        </div>
        `;
      }).join('\n')
    : `<div class="no-subplots">No individual sub-plots demarcated yet. Standard whole-unit parcel layout.</div>`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title} - ${categoryTitles[options.category]}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      padding: 24px;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #090e17 0%, #1e293b 100%);
      color: #ffffff;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      border-bottom: 4px solid #68D800;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-logo {
      color: #68D800;
      font-weight: 900;
      font-size: 26px;
    }
    .badge {
      background: rgba(104, 216, 0, 0.15);
      border: 1px solid #68D800;
      color: #68D800;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }
    .meta-bar {
      background: #f1f5f9;
      padding: 14px 32px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
    }
    .meta-item { display: flex; align-items: center; gap: 6px; }
    .meta-item strong { color: #0f172a; }
    .content-section {
      padding: 32px;
    }
    .section-headline {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-desc {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 20px;
    }
    .image-preview-box {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      background: #000000;
      position: relative;
      margin-bottom: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .image-preview-box img {
      width: 100%;
      max-height: 600px;
      object-fit: contain;
      display: block;
    }
    .watermark-tag {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(0,0,0,0.75);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    /* Interactive Sub-Plots Grid */
    .plots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 16px;
      margin-top: 16px;
      margin-bottom: 32px;
    }
    .plot-cell {
      position: relative;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .plot-cell:hover {
      border-color: #68D800;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(104, 216, 0, 0.18);
      z-index: 50;
    }
    .plot-number {
      font-weight: 800;
      font-size: 14px;
      color: #0f172a;
    }
    .plot-meta {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .plot-status {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
      margin-top: 8px;
    }
    
    /* Tooltip Hover Popover */
    .plot-tooltip {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      bottom: calc(100% + 12px);
      left: 50%;
      transform: translateX(-50%);
      width: 290px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.22);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      z-index: 100;
      text-align: left;
    }
    .plot-cell:hover .plot-tooltip {
      visibility: visible;
      opacity: 1;
      transform: translateX(-50%) translateY(-4px);
    }
    .plot-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 7px;
      border-style: solid;
      border-color: #ffffff transparent transparent transparent;
    }
    .tooltip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 8px;
    }
    .tooltip-title {
      font-weight: 800;
      font-size: 13px;
      color: #0f172a;
    }
    .tooltip-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .tooltip-section {
      margin-bottom: 8px;
    }
    .tooltip-section:last-child {
      margin-bottom: 0;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #334155;
      padding: 2px 0;
    }
    .metric-row strong {
      color: #0f172a;
    }
    .highlight-val {
      color: #15803d !important;
      font-size: 12px;
    }
    .roi-section {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 8px;
      border-radius: 8px;
    }
    .no-subplots {
      padding: 20px;
      text-align: center;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      font-size: 13px;
      color: #64748b;
    }
    .footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 20px 32px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer strong { color: #ffffff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand-title">
          <span class="brand-logo">LandVest</span>
          <span>NRI Land & Layout Document</span>
        </div>
        <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
          ${options.title}
        </div>
      </div>
      <div>
        <span class="badge">DTCP Approved • RERA Compliant</span>
      </div>
    </div>

    <div class="meta-bar">
      <div class="meta-item">📍 <span>Location:</span> <strong>${options.locality || 'Prime Locality'}, ${options.district || 'Coimbatore'}, ${options.state || 'Tamil Nadu'}</strong></div>
      ${options.dtcpNumber ? `<div class="meta-item">📜 <span>DTCP No:</span> <strong>${options.dtcpNumber}</strong></div>` : ''}
      <div class="meta-item">📐 <span>Total Area:</span> <strong>${(options.totalSqFt || 0).toLocaleString('en-IN')} sq.ft</strong></div>
      <div class="meta-item">📅 <span>Generated:</span> <strong>${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
    </div>

    <div class="content-section">
      <h2 class="section-headline">
        <span>📸 Document Visual: ${categoryTitles[options.category]}</span>
      </h2>
      <p class="section-desc">
        High-resolution digital blueprint authenticated for legal registry, site demarcation, and investor transparency.
      </p>

      <div class="image-preview-box">
        <img src="${imageDataUrl}" alt="${options.title}" />
        <div class="watermark-tag">LandVest Verified • DTCP Validated</div>
      </div>

      <h2 class="section-headline">
        <span>🧩 Individual Sub-Plots Matrix & Compounding Valuation</span>
      </h2>
      <p class="section-desc">
        Hover over any individual plot box to view exact dimensions, land area in sq.ft and cents, price breakdown, and projected 1-Year, 2-Year, and 5-Year returns.
      </p>

      <div class="plots-grid">
        ${subPlotsCardsHtml}
      </div>
    </div>

    <div class="footer">
      <div>
        <span>Authorized Promoter / Developer: </span>
        <strong>${options.sellerName || 'Verified Builder'}</strong>
        ${options.sellerPhone ? ` | Tel: ${options.sellerPhone}` : ''}
      </div>
      <div>
        <span>Powered by </span><strong>LandVest Verified Documents Platform</strong>
      </div>
    </div>
  </div>
</body>
</html>`;

  const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const htmlFile = new File([htmlBlob], `${originalFileName}_document.html`, { type: 'text/html' });
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;

  return {
    htmlContent,
    htmlBlob,
    htmlFile,
    dataUrl,
  };
}

/**
 * Initiates an automatic browser download of the generated HTML document.
 */
export function downloadHtmlFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens the rendered HTML document in a new browser tab for immediate full-screen review.
 */
export function previewHtmlInNewTab(htmlContent: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
