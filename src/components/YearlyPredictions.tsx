import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calculator, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  HelpCircle,
  Building,
  Coins
} from 'lucide-react';
import { CurrencyCode, Plot } from '../types';
import { formatCurrency, formatRatePerSqFt } from '../utils/currency';

interface YearlyPredictionsProps {
  plots: Plot[];
  activeCurrency: CurrencyCode;
  onSelectPlotForInquiry: (plot: Plot) => void;
}

export const YearlyPredictions: React.FC<YearlyPredictionsProps> = ({
  plots,
  activeCurrency,
  onSelectPlotForInquiry,
}) => {
  const verifiedPlots = plots.filter((p) => p.status === 'verified_broadcasted');
  const [selectedPlotId, setSelectedPlotId] = useState<string>(
    verifiedPlots.length > 0 ? verifiedPlots[0].id : 'custom'
  );
  const [customAmount, setCustomAmount] = useState<number>(4000000); // 40 Lakhs INR default
  const [growthRate, setGrowthRate] = useState<number>(15); // 15% annual growth
  const [horizonYears, setHorizonYears] = useState<number>(5);

  const selectedPlot = verifiedPlots.find((p) => p.id === selectedPlotId);
  const baseInvestment = selectedPlot ? selectedPlot.totalPrice : customAmount;

  // Calculate year by year progression (Compound interest: P * (1 + r)^n)
  const yearlyBreakdown = Array.from({ length: 10 }, (_, i) => {
    const yearNumber = i + 1;
    const landValue = Math.round(baseInvestment * Math.pow(1 + growthRate / 100, yearNumber));
    // In comparison: standard apartment has ~6% appreciation minus 2.5% building depreciation net ~4%
    const flatValue = Math.round(baseInvestment * Math.pow(1 + 0.05, yearNumber));
    // FD at 7%
    const fdValue = Math.round(baseInvestment * Math.pow(1 + 0.07, yearNumber));

    const gain = landValue - baseInvestment;
    const roiPercentage = ((gain / baseInvestment) * 100).toFixed(0);

    return {
      year: yearNumber,
      landValue,
      flatValue,
      fdValue,
      gain,
      roiPercentage,
    };
  });

  const targetLandValue = Math.round(baseInvestment * Math.pow(1 + growthRate / 100, horizonYears));
  const targetGain = targetLandValue - baseInvestment;
  const targetRoiPercentage = ((targetGain / baseInvestment) * 100).toFixed(0);
  const targetFlatValue = Math.round(baseInvestment * Math.pow(1 + 0.05, horizonYears));
  const targetFdValue = Math.round(baseInvestment * Math.pow(1 + 0.07, horizonYears));

  const targetYearData = {
    year: horizonYears,
    landValue: targetLandValue,
    flatValue: targetFlatValue,
    fdValue: targetFdValue,
    gain: targetGain,
    roiPercentage: targetRoiPercentage,
  };

  return (
    <div id="predictions" className="py-12 bg-[#FAFCF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#EBFBD5] border border-[#68D800]/40 px-3 py-1 rounded-full text-xs font-bold text-black mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#4FAF00]" />
            <span>INSTANT YEARLY PREDICTIONS & FLAT CAST COMPARISON</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tight">
            Predict Land ROI Year-by-Year
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            No bulky 50-page reports. Get clean, mathematical yearly valuations based on verifiable historical growth corridors across Tamil Nadu & South India.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-black font-bold text-base">
                <Calculator className="w-5 h-5 text-[#4FAF00]" />
                <span>Investment Parameters</span>
              </div>
              <span className="text-xs font-semibold bg-[#EBFBD5] text-black px-2 py-0.5 rounded">
                Simulate 1-10 Yrs
              </span>
            </div>

            {/* Select Plot or Custom Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Verified Plot or Custom Budget
              </label>
              <select
                value={selectedPlotId}
                onChange={(e) => setSelectedPlotId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
              >
                <option value="custom">Custom Investment Budget</option>
                {verifiedPlots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    {plot.title} ({formatCurrency(plot.totalPrice, activeCurrency)})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Amount Input if chosen */}
            {selectedPlotId === 'custom' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Initial Capital (INR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="100000"
                    min="500000"
                    max="50000000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Math.max(100000, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-extrabold text-emerald-800">
                    {formatCurrency(customAmount, activeCurrency)}
                  </div>
                </div>
                <div className="flex gap-2 pt-1 flex-wrap">
                  {[2500000, 4000000, 6000000, 10000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomAmount(amt)}
                      className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
                    >
                      {formatCurrency(amt, 'INR')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Growth Rate Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Annual Appreciation Rate: <span className="text-[#4FAF00] text-sm font-black">{growthRate}%</span>
                </label>
                <span className="text-[11px] text-gray-500 font-medium">Per Annum (Compounded)</span>
              </div>

              {/* Quick Rate Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { rate: 10, label: '10% (Stable)', desc: 'Standard Tier-2' },
                  { rate: 15, label: '15% (Growth)', desc: 'Highway/Ring Rd' },
                  { rate: 20, label: '20% (High)', desc: 'Airport/SEZ Belt' },
                ].map((item) => (
                  <button
                    key={item.rate}
                    type="button"
                    onClick={() => setGrowthRate(item.rate)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      growthRate === item.rate
                        ? 'bg-[#EBFBD5] border-[#68D800] text-black font-bold shadow-xs'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-gray-500">{item.desc}</div>
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="8"
                max="25"
                step="0.5"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="w-full accent-[#68D800] cursor-pointer mt-2"
              />
            </div>

            {/* Holding Horizon Buttons & Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Holding Horizon: <span className="text-black text-sm font-black">{horizonYears} Years</span>
                </label>
                <span className="text-[11px] text-emerald-800 font-semibold bg-[#EBFBD5] px-2 py-0.5 rounded">
                  Year {horizonYears} Valuation
                </span>
              </div>

              {/* Quick Period Buttons: 1.5, 3, 4, 5, 7, 10 Yrs */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[1.5, 3, 4, 5, 7, 10].map((yrs) => (
                  <button
                    key={yrs}
                    type="button"
                    onClick={() => setHorizonYears(yrs)}
                    className={`py-2 px-1 text-center rounded-xl font-extrabold text-xs transition-all border ${
                      horizonYears === yrs
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {yrs} Yrs
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={horizonYears}
                onChange={(e) => setHorizonYears(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-mono px-1">
                <span>1 Yr</span>
                <span>3 Yrs</span>
                <span>5 Yrs</span>
                <span>7 Yrs</span>
                <span>10 Yrs</span>
              </div>
            </div>

            {/* Selected Plot Brief Details if any */}
            {selectedPlot && (
              <div className="p-3 bg-[#F8FCF5] border border-[#D5F2B5] rounded-xl text-xs space-y-1">
                <div className="font-bold text-black flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF00]" />
                  <span>{selectedPlot.locality}</span>
                </div>
                <div className="text-gray-600">
                  Area: <strong>{selectedPlot.totalSqFt} sq.ft</strong> ({selectedPlot.cents} Cents) • Rate: {formatRatePerSqFt(selectedPlot.pricePerSqFt, activeCurrency)}
                </div>
                <div className="text-gray-600">
                  DTCP No: <strong>{selectedPlot.dtcpNumber}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Forecast Results & Yearly Timeline */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Highlight Card */}
            <div className="bg-black text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#68D800]/15 rounded-full blur-3xl -z-0 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#68D800] uppercase tracking-wider">
                      Year {horizonYears} Projected Value
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                      {formatCurrency(targetYearData.landValue, activeCurrency)}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-gray-400">Net Estimated Profit</span>
                    <div className="text-xl sm:text-2xl font-black text-[#68D800]">
                      +{formatCurrency(targetYearData.gain, activeCurrency)}
                    </div>
                    <span className="text-xs text-gray-300 font-semibold">
                      (+{targetYearData.roiPercentage}% ROI)
                    </span>
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                  <div className="bg-gray-900/90 border border-gray-800 p-2.5 rounded-xl">
                    <div className="text-[10px] text-gray-400 font-medium">Initial Invested</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                      {formatCurrency(baseInvestment, activeCurrency)}
                    </div>
                  </div>
                  <div className="bg-gray-900/90 border border-gray-800 p-2.5 rounded-xl">
                    <div className="text-[10px] text-gray-400 font-medium">Annual Growth</div>
                    <div className="text-xs sm:text-sm font-bold text-[#68D800] mt-0.5">
                      {growthRate}% CAGR
                    </div>
                  </div>
                  <div className="bg-gray-900/90 border border-gray-800 p-2.5 rounded-xl">
                    <div className="text-[10px] text-gray-400 font-medium">Land vs Flat Gain</div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5">
                      +{formatCurrency(targetYearData.landValue - targetYearData.flatValue, activeCurrency)}
                    </div>
                  </div>
                </div>

                {/* Plot Action */}
                {selectedPlot && (
                  <div className="mt-4 pt-3 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-gray-300">
                      Lock this verified plot with 30-day price guarantee:
                    </span>
                    <button
                      onClick={() => onSelectPlotForInquiry(selectedPlot)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs rounded-xl transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
                    >
                      <span>Inquire / Lock Plot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Year-by-Year Flat Cast Progression Table */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-black text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#4FAF00]" />
                  <span>Yearly Predictions Breakdown (1 to 10 Years)</span>
                </h4>
                <span className="text-[11px] text-gray-500 font-mono">
                  Values in {activeCurrency}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 font-bold">Horizon</th>
                      <th className="py-2.5 font-bold">Land Projected Value</th>
                      <th className="py-2.5 font-bold">Net Profit</th>
                      <th className="py-2.5 font-bold">Total Gain %</th>
                      <th className="py-2.5 font-bold text-gray-400">Flat Cast (Depreciating)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {yearlyBreakdown.map((item) => {
                      const isSelected = item.year === horizonYears;
                      return (
                        <tr
                          key={item.year}
                          onClick={() => setHorizonYears(item.year)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-[#EBFBD5] font-bold text-black' 
                              : 'hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <td className="py-2 px-1">
                            <span className="inline-flex items-center gap-1">
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4FAF00]" />}
                              Year {item.year}
                            </span>
                          </td>
                          <td className="py-2 font-bold text-emerald-800">
                            {formatCurrency(item.landValue, activeCurrency)}
                          </td>
                          <td className="py-2 text-black font-semibold">
                            +{formatCurrency(item.gain, activeCurrency)}
                          </td>
                          <td className="py-2">
                            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              +{item.roiPercentage}%
                            </span>
                          </td>
                          <td className="py-2 text-gray-400 font-medium">
                            {formatCurrency(item.flatValue, activeCurrency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-[#4FAF00] shrink-0" />
                <span>
                  Projections are based on verified DTCP layouts located in active SEZ, NH Expansion, and Metro rail corridors.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
