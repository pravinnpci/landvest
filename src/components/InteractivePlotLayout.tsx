import React, { useState } from 'react';
import { SubPlot, CurrencyCode } from '../types';
import { formatCurrency, formatRatePerSqFt } from '../utils/currency';
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  TrendingUp,
  Compass,
  CheckCircle2,
  Clock,
  Ban,
  Maximize2,
  Edit2,
  Eye,
  Info
} from 'lucide-react';

interface InteractivePlotLayoutProps {
  subPlots: SubPlot[];
  onChange?: (subPlots: SubPlot[]) => void;
  readOnly?: boolean;
  totalSqFt?: number;
  totalPrice?: number;
  pricePerSqFt?: number;
  expectedAppreciationRate?: number;
  activeCurrency?: CurrencyCode;
}

export const InteractivePlotLayout: React.FC<InteractivePlotLayoutProps> = ({
  subPlots = [],
  onChange,
  readOnly = false,
  totalSqFt = 9600,
  totalPrice = 19200000,
  pricePerSqFt = 2000,
  expectedAppreciationRate = 15,
  activeCurrency = 'INR',
}) => {
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null);
  const [editingPlot, setEditingPlot] = useState<SubPlot | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'booked' | 'sold'>('all');

  const currentYear = new Date().getFullYear();

  // Calculate allocated area
  const allocatedSqFt = subPlots.reduce((sum, sp) => sum + (sp.sqFt || 0), 0);
  const allocatedCents = Number((allocatedSqFt / 435.6).toFixed(2));
  const allocatedPercent = totalSqFt > 0 ? Math.min(100, Math.round((allocatedSqFt / totalSqFt) * 100)) : 0;

  // Auto-generate plots splitter helper
  const handleAutoSplit = (divisions: number) => {
    if (!onChange || divisions <= 0) return;
    const baseSqFt = Math.floor(totalSqFt / divisions);
    const remainder = totalSqFt % divisions;
    const rate = pricePerSqFt || (totalSqFt > 0 ? Math.round(totalPrice / totalSqFt) : 2000);
    const growth = expectedAppreciationRate || 15;

    const facings: Array<SubPlot['facing']> = ['North', 'East', 'North-East', 'Corner Plot', 'South', 'West'];

    const newPlots: SubPlot[] = [];
    for (let i = 1; i <= divisions; i++) {
      const sqFt = i === divisions ? baseSqFt + remainder : baseSqFt;
      const cents = Number((sqFt / 435.6).toFixed(2));
      const plotPrice = sqFt * rate;
      const dimensions = sqFt >= 2400 ? '40 x 60' : sqFt >= 1500 ? '30 x 50' : '30 x 40';

      const y1 = Math.round(plotPrice * (1 + growth / 100));
      const y2 = Math.round(plotPrice * Math.pow(1 + growth / 100, 2));
      const y5 = Math.round(plotPrice * Math.pow(1 + growth / 100, 5));

      newPlots.push({
        id: `sp-${Date.now()}-${i}`,
        plotNumber: `Plot ${i < 10 ? '0' + i : i}`,
        sqFt,
        cents,
        dimensions,
        facing: facings[(i - 1) % facings.length],
        pricePerSqFt: rate,
        totalPrice: plotPrice,
        status: i === 3 ? 'booked' : i === 7 ? 'sold' : 'available',
        year1Amount: y1,
        year2Amount: y2,
        year5Amount: y5,
      });
    }

    onChange(newPlots);
  };

  const handleAddSubPlot = () => {
    if (!onChange) return;
    const nextNum = subPlots.length + 1;
    const defaultSqFt = 1200;
    const cents = Number((defaultSqFt / 435.6).toFixed(2));
    const rate = pricePerSqFt || 2000;
    const plotPrice = defaultSqFt * rate;
    const growth = expectedAppreciationRate || 15;

    const newPlot: SubPlot = {
      id: `sp-${Date.now()}`,
      plotNumber: `Plot ${nextNum < 10 ? '0' + nextNum : nextNum}`,
      sqFt: defaultSqFt,
      cents,
      dimensions: '30 x 40',
      facing: 'East',
      pricePerSqFt: rate,
      totalPrice: plotPrice,
      status: 'available',
      year1Amount: Math.round(plotPrice * (1 + growth / 100)),
      year2Amount: Math.round(plotPrice * Math.pow(1 + growth / 100, 2)),
      year5Amount: Math.round(plotPrice * Math.pow(1 + growth / 100, 5)),
    };

    onChange([...subPlots, newPlot]);
    setEditingPlot(newPlot);
  };

  const handleUpdateSubPlot = (updated: SubPlot) => {
    if (!onChange) return;
    const growth = expectedAppreciationRate || 15;
    const sqFt = Number(updated.sqFt) || 0;
    const rate = Number(updated.pricePerSqFt) || 0;
    const plotPrice = sqFt * rate;
    const cents = Number((sqFt / 435.6).toFixed(2));

    const finalPlot: SubPlot = {
      ...updated,
      sqFt,
      cents,
      pricePerSqFt: rate,
      totalPrice: plotPrice,
      year1Amount: Math.round(plotPrice * (1 + growth / 100)),
      year2Amount: Math.round(plotPrice * Math.pow(1 + growth / 100, 2)),
      year5Amount: Math.round(plotPrice * Math.pow(1 + growth / 100, 5)),
    };

    const nextList = subPlots.map((p) => (p.id === updated.id ? finalPlot : p));
    onChange(nextList);
    setEditingPlot(null);
  };

  const handleDeleteSubPlot = (id: string) => {
    if (!onChange) return;
    onChange(subPlots.filter((p) => p.id !== id));
    if (editingPlot?.id === id) setEditingPlot(null);
  };

  const filteredPlots = subPlots.filter((sp) => {
    if (filterStatus === 'all') return true;
    return sp.status === filterStatus;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-[#68D800]">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Demarcated Sub-Plots Breakdown & Hover ROI Projections
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hover over any demarcated plot to inspect square footage, cents, price breakdown, and 1-Yr / 5-Yr returns.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'all' ? 'bg-[#68D800] text-black font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            All ({subPlots.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('available')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'available' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Available ({subPlots.filter((p) => p.status === 'available').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('booked')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'booked' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Booked ({subPlots.filter((p) => p.status === 'booked').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('sold')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterStatus === 'sold' ? 'bg-rose-500 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Sold ({subPlots.filter((p) => p.status === 'sold').length})
          </button>
        </div>
      </div>

      {/* Area Allocation Bar for Sellers */}
      {!readOnly && (
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Land Area:</span>
              <strong className="text-white font-mono text-sm">{totalSqFt.toLocaleString('en-IN')} sq.ft</strong>
              <span className="text-slate-500">({(totalSqFt / 435.6).toFixed(2)} Cents)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Allocated into Plots:</span>
              <strong className={`font-mono text-sm ${allocatedSqFt > totalSqFt ? 'text-rose-400' : 'text-[#68D800]'}`}>
                {allocatedSqFt.toLocaleString('en-IN')} sq.ft ({allocatedCents} Cents)
              </strong>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-bold">
                {allocatedPercent}% Demarcated
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                allocatedSqFt > totalSqFt
                  ? 'bg-rose-500'
                  : allocatedPercent === 100
                  ? 'bg-[#68D800]'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, allocatedPercent)}%` }}
            />
          </div>

          {/* Quick Auto-Split generator buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-700/50">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-[#68D800]" />
                <span>Auto-Split:</span>
              </span>
              <button
                type="button"
                onClick={() => handleAutoSplit(4)}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors"
              >
                4 Plots
              </button>
              <button
                type="button"
                onClick={() => handleAutoSplit(6)}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors"
              >
                6 Plots
              </button>
              <button
                type="button"
                onClick={() => handleAutoSplit(8)}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors"
              >
                8 Plots
              </button>
              <button
                type="button"
                onClick={() => handleAutoSplit(12)}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors"
              >
                12 Plots
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddSubPlot}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#68D800] hover:bg-[#5bc200] text-black text-xs font-extrabold rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Plot</span>
            </button>
          </div>
        </div>
      )}

      {/* Visual Plot Grid Blueprint */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Interactive DTCP Demarcation Blueprint</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Hover over any plot cell below
          </span>
        </div>

        {subPlots.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-dashed border-slate-700 space-y-3">
            <Layers className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              No individual sub-plots created yet
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click &quot;Auto-Split&quot; above to immediately break this land into individual plots with live square footage and price breakdown hover cards.
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={() => handleAutoSplit(6)}
                className="px-4 py-2 bg-[#68D800] text-black font-bold text-xs rounded-xl hover:bg-[#5bc200] transition-colors"
              >
                Generate 6 Sub-Plots Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 relative">
            {filteredPlots.map((sp) => {
              const isHovered = hoveredPlotId === sp.id;
              const y1 = sp.year1Amount || Math.round(sp.totalPrice * (1 + expectedAppreciationRate / 100));
              const y2 = sp.year2Amount || Math.round(sp.totalPrice * Math.pow(1 + expectedAppreciationRate / 100, 2));
              const y5 = sp.year5Amount || Math.round(sp.totalPrice * Math.pow(1 + expectedAppreciationRate / 100, 5));

              const statusBorder =
                sp.status === 'sold'
                  ? 'border-rose-500/50 hover:border-rose-400'
                  : sp.status === 'booked'
                  ? 'border-amber-500/50 hover:border-amber-400'
                  : 'border-emerald-500/40 hover:border-[#68D800]';

              const statusBadgeBg =
                sp.status === 'sold'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : sp.status === 'booked'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

              return (
                <div
                  key={sp.id}
                  onMouseEnter={() => setHoveredPlotId(sp.id)}
                  onMouseLeave={() => setHoveredPlotId(null)}
                  className={`group relative bg-slate-800/90 rounded-xl p-3 border transition-all duration-200 cursor-pointer ${statusBorder} ${
                    isHovered ? 'ring-2 ring-[#68D800] shadow-lg shadow-[#68D800]/10 scale-[1.02] z-30' : 'z-10'
                  }`}
                >
                  {/* Top card bar */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sm text-white group-hover:text-[#68D800] transition-colors">
                      {sp.plotNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize ${statusBadgeBg}`}>
                      {sp.status}
                    </span>
                  </div>

                  {/* Area */}
                  <div className="text-xs text-slate-300 font-medium">
                    {sp.sqFt.toLocaleString('en-IN')} sq.ft
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {sp.cents} Cents • {sp.facing || 'East'}
                  </div>

                  {/* Price */}
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      {formatCurrency(sp.totalPrice, activeCurrency)}
                    </span>
                    {!readOnly && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPlot(sp);
                          }}
                          className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                          title="Edit Sub-plot"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubPlot(sp.id);
                          }}
                          className="p-1 hover:bg-rose-900/50 rounded text-slate-400 hover:text-rose-400"
                          title="Delete Sub-plot"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* HOVER TOOLTIP POPOVER (Interactive & Complete Breakdown) */}
                  {/* ======================================================== */}
                  {isHovered && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 bg-slate-950 border border-slate-700 rounded-2xl p-4 shadow-2xl shadow-black/80 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                      style={{ filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.7))' }}
                    >
                      {/* Tooltip Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-[#68D800]/20 text-[#68D800]">
                            <Compass className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <div className="font-extrabold text-sm text-white">
                              {sp.plotNumber} ({sp.facing || 'East Facing'})
                            </div>
                            {sp.dimensions && (
                              <div className="text-[11px] text-slate-400 font-mono">
                                Dimensions: {sp.dimensions} ft
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${statusBadgeBg}`}>
                          {sp.status}
                        </span>
                      </div>

                      {/* Land Area Breakdown */}
                      <div className="space-y-1.5 pb-2.5 border-b border-slate-800">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Maximize2 className="w-3 h-3 text-[#68D800]" />
                          <span>Land Area Breakdown</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[11px] text-slate-400 block">Total Area</span>
                            <strong className="text-white font-mono text-sm">
                              {sp.sqFt.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">sq.ft</span>
                            </strong>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[11px] text-slate-400 block">Area in Cents</span>
                            <strong className="text-white font-mono text-sm">
                              {sp.cents.toFixed(2)} <span className="text-xs font-normal text-slate-400">Cents</span>
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-1.5 py-2.5 border-b border-slate-800">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <span className="text-emerald-400">💰</span>
                          <span>Price Breakdown</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-slate-400">Rate per Sq.Ft:</span>
                          <span className="font-mono text-slate-200">
                            {formatRatePerSqFt(sp.pricePerSqFt, activeCurrency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-slate-400">Current Valuation:</span>
                          <span className="font-extrabold text-emerald-400 text-sm">
                            {formatCurrency(sp.totalPrice, activeCurrency)}
                          </span>
                        </div>
                      </div>

                      {/* Compounding ROI Valuation Table */}
                      <div className="space-y-2 pt-2.5">
                        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          <span className="flex items-center gap-1 text-[#68D800]">
                            <TrendingUp className="w-3 h-3" />
                            <span>Projected Return ({expectedAppreciationRate}% YoY)</span>
                          </span>
                          <span className="text-slate-500 font-mono">Compounding</span>
                        </div>

                        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">1 Year ({currentYear + 1}):</span>
                            <span className="font-bold text-white">
                              {formatCurrency(y1, activeCurrency)}
                              <span className="text-[11px] text-[#68D800] ml-1">+{expectedAppreciationRate}%</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">2 Years ({currentYear + 2}):</span>
                            <span className="font-bold text-white">
                              {formatCurrency(y2, activeCurrency)}
                              <span className="text-[11px] text-[#68D800] ml-1">
                                +{Math.round((Math.pow(1 + expectedAppreciationRate / 100, 2) - 1) * 100)}%
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
                            <span className="font-bold text-emerald-200">5 Years ({currentYear + 5}):</span>
                            <span className="font-extrabold text-[#68D800] text-sm">
                              {formatCurrency(y5, activeCurrency)}
                              <span className="text-[11px] text-white ml-1 font-semibold">
                                (+{Math.round((Math.pow(1 + expectedAppreciationRate / 100, 5) - 1) * 100)}%)
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-950" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Sub-Plot Modal / Panel for Seller */}
      {!readOnly && editingPlot && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#68D800]" />
                <span>Edit Sub-Plot Details ({editingPlot.plotNumber})</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingPlot(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Plot Identifier *</label>
                <input
                  type="text"
                  value={editingPlot.plotNumber}
                  onChange={(e) => setEditingPlot({ ...editingPlot, plotNumber: e.target.value })}
                  placeholder="e.g. Plot 01"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#68D800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Area (Sq.Ft) *</label>
                  <input
                    type="number"
                    value={editingPlot.sqFt}
                    onChange={(e) => {
                      const sq = Number(e.target.value) || 0;
                      setEditingPlot({
                        ...editingPlot,
                        sqFt: sq,
                        cents: Number((sq / 435.6).toFixed(2)),
                        totalPrice: sq * (editingPlot.pricePerSqFt || pricePerSqFt),
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-[#68D800]"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block font-mono">
                    = {(editingPlot.sqFt / 435.6).toFixed(2)} Cents
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dimensions (ft)</label>
                  <input
                    type="text"
                    value={editingPlot.dimensions || ''}
                    onChange={(e) => setEditingPlot({ ...editingPlot, dimensions: e.target.value })}
                    placeholder="e.g. 30 x 40"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#68D800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Facing Direction</label>
                  <select
                    value={editingPlot.facing || 'East'}
                    onChange={(e) => setEditingPlot({ ...editingPlot, facing: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#68D800]"
                  >
                    <option value="North">North</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                    <option value="Corner Plot">Corner Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={editingPlot.status}
                    onChange={(e) => setEditingPlot({ ...editingPlot, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#68D800]"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Rate per Sq.Ft (₹)</label>
                <input
                  type="number"
                  value={editingPlot.pricePerSqFt}
                  onChange={(e) => {
                    const r = Number(e.target.value) || 0;
                    setEditingPlot({
                      ...editingPlot,
                      pricePerSqFt: r,
                      totalPrice: (editingPlot.sqFt || 0) * r,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-[#68D800]"
                />
                <span className="text-[11px] text-emerald-400 mt-1 block font-bold">
                  Total Value: ₹{((editingPlot.sqFt || 0) * (editingPlot.pricePerSqFt || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPlot(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateSubPlot(editingPlot)}
                className="px-4 py-2 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold rounded-lg shadow"
              >
                Save Plot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
