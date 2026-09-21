import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CurrencyCode, Plot } from '../types';
import { PlotCard } from './PlotCard';
import { formatCurrency } from '../utils/currency';

interface PlotsCatalogProps {
  plots: Plot[];
  activeCurrency: CurrencyCode;
  onViewDetails: (plot: Plot) => void;
  onCalculateYield: (plot: Plot) => void;
  onInquire: (plot: Plot) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
}

export const PlotsCatalog: React.FC<PlotsCatalogProps> = ({
  plots,
  activeCurrency,
  onViewDetails,
  onCalculateYield,
  onInquire,
  selectedDistrict,
  onDistrictChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'yield_high'>('recommended');
  const [maxBudget, setMaxBudget] = useState<number>(10000000); // 1 Crore default
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, sortBy, maxBudget, itemsPerPage]);

  // We filter broadcasted plots for the public view
  const broadcastedPlots = plots.filter((p) => p.status === 'verified_broadcasted');

  const filteredPlots = broadcastedPlots
    .filter((plot) => {
      const matchesSearch =
        plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.dtcpNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict =
        !selectedDistrict ||
        plot.district.toLowerCase().includes(selectedDistrict.toLowerCase());

      const matchesBudget = plot.totalPrice <= maxBudget;

      return matchesSearch && matchesDistrict && matchesBudget;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.totalPrice - b.totalPrice;
      if (sortBy === 'price_high') return b.totalPrice - a.totalPrice;
      if (sortBy === 'yield_high') return b.expectedAppreciationRate - a.expectedAppreciationRate;
      return 0; // recommended order
    });

  const totalPlots = filteredPlots.length;
  const totalPages = Math.ceil(totalPlots / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedPlots = filteredPlots.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const el = document.getElementById('plots');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const uniqueDistricts = Array.from(new Set(broadcastedPlots.map((p) => p.district)));

  return (
    <section id="plots" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EBFBD5] border border-[#68D800]/50 px-3 py-1 rounded-full text-xs font-bold text-black mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF00]" />
              <span>100% DTCP SANCTIONED & ADMIN BROADCASTED ONLY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
              Verified Investment Plots
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Every plot features verified ownership, 30-year clear title deeds, and projected 12-22% annual appreciation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span>Displaying:</span>
            <span className="bg-[#68D800] text-black px-2.5 py-0.5 rounded-full font-black">
              {filteredPlots.length} Verified Plots
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-[#FAFCF9] border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Locality, District, Landmark or DTCP No..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* District Filter Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
              >
                <option value="">All Growth Corridors</option>
                {uniqueDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
              >
                <option value="recommended">Sort: Curated Prime</option>
                <option value="yield_high">Sort: Highest Projected Yield</option>
                <option value="price_low">Sort: Price (Low to High)</option>
                <option value="price_high">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Quick District Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="font-bold text-gray-500 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#4FAF00]" />
              Quick Pick:
            </span>
            <button
              onClick={() => onDistrictChange('')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                !selectedDistrict
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Regions
            </button>
            {uniqueDistricts.map((dist) => (
              <button
                key={dist}
                onClick={() => onDistrictChange(dist)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  selectedDistrict === dist
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        {/* Plots Grid */}
        {filteredPlots.length === 0 ? (
          <div className="text-center py-16 bg-[#FAFCF9] border border-gray-200 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-black text-lg">No matching verified plots found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting the region filter to browse all active broadcasted DTCP plots.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                onDistrictChange('');
              }}
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedPlots.map((plot) => (
                <PlotCard
                  key={plot.id}
                  plot={plot}
                  activeCurrency={activeCurrency}
                  onViewDetails={onViewDetails}
                  onCalculateYield={onCalculateYield}
                  onInquire={onInquire}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Result counter and items per page */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 order-2 sm:order-1">
                  <span>
                    Showing <strong className="text-black">{startIndex + 1}</strong> to{' '}
                    <strong className="text-black">
                      {Math.min(startIndex + itemsPerPage, totalPlots)}
                    </strong>{' '}
                    of <strong className="text-black">{totalPlots}</strong> verified plots
                  </span>
                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="text-gray-400">Per page:</span>
                    {[6, 12, 24].map((size) => (
                      <button
                        key={size}
                        onClick={() => setItemsPerPage(size)}
                        className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                          itemsPerPage === size
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Navigation Buttons */}
                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      safeCurrentPage <= 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-xs active:scale-95'
                    }`}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[36px] h-9 rounded-xl text-xs font-black transition-all ${
                          safeCurrentPage === pageNum
                            ? 'bg-[#68D800] text-black shadow-sm ring-2 ring-[#68D800]/50'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= totalPages}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      safeCurrentPage >= totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-xs active:scale-95'
                    }`}
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
