import { Plot, SubPlot } from '../types';

export interface ProjectInventoryStatus {
  status: 'verified_broadcasted' | 'booked' | 'sold';
  availableCount: number;
  bookedCount: number;
  soldCount: number;
  totalCount: number;
  isAllSold: boolean;
  isAllBooked: boolean;
  hasAvailable: boolean;
  displayText: string;
  badgeLabel: string;
}

/**
 * Calculates the exact inventory status of a plot layout project.
 * BUSINESS RULE:
 * - As long as at least 1 sub-plot is available, the whole project is AVAILABLE.
 * - Only when ALL sub-plots in the project are sold does the project show as SOLD.
 * - If 0 are available and remaining are booked, the project shows as BOOKED.
 */
export function getProjectInventoryStatus(plot: {
  status?: Plot['status'];
  subPlots?: SubPlot[];
}): ProjectInventoryStatus {
  const subPlots = plot.subPlots || [];

  if (subPlots.length > 0) {
    const totalCount = subPlots.length;
    const availableCount = subPlots.filter((p) => p.status === 'available').length;
    const bookedCount = subPlots.filter((p) => p.status === 'booked').length;
    const soldCount = subPlots.filter((p) => p.status === 'sold').length;

    // RULE: If even 1 plot is available, the whole project is AVAILABLE!
    if (availableCount > 0) {
      return {
        status: 'verified_broadcasted',
        availableCount,
        bookedCount,
        soldCount,
        totalCount,
        isAllSold: false,
        isAllBooked: false,
        hasAvailable: true,
        displayText: `Available (${availableCount} of ${totalCount} plots available)`,
        badgeLabel: `AVAILABLE (${availableCount}/${totalCount})`,
      };
    }

    // If 0 available, but there are booked plots:
    if (bookedCount > 0) {
      return {
        status: 'booked',
        availableCount: 0,
        bookedCount,
        soldCount,
        totalCount,
        isAllSold: false,
        isAllBooked: true,
        hasAvailable: false,
        displayText: `All Booked (${bookedCount} Booked, ${soldCount} Sold)`,
        badgeLabel: 'ALL BOOKED',
      };
    }

    // Only when ALL sub-plots are sold:
    return {
      status: 'sold',
      availableCount: 0,
      bookedCount: 0,
      soldCount,
      totalCount,
      isAllSold: true,
      isAllBooked: false,
      hasAvailable: false,
      displayText: `Completely Sold Out (All ${totalCount} plots sold)`,
      badgeLabel: 'SOLD OUT',
    };
  }

  // Fallback for single parcel without demarcated sub-plots:
  if (plot.status === 'sold') {
    return {
      status: 'sold',
      availableCount: 0,
      bookedCount: 0,
      soldCount: 1,
      totalCount: 1,
      isAllSold: true,
      isAllBooked: false,
      hasAvailable: false,
      displayText: 'Completely Sold Out',
      badgeLabel: 'SOLD OUT',
    };
  }
  if (plot.status === 'booked') {
    return {
      status: 'booked',
      availableCount: 0,
      bookedCount: 1,
      soldCount: 0,
      totalCount: 1,
      isAllSold: false,
      isAllBooked: true,
      hasAvailable: false,
      displayText: 'Booked',
      badgeLabel: 'BOOKED',
    };
  }
  return {
    status: 'verified_broadcasted',
    availableCount: 1,
    bookedCount: 0,
    soldCount: 0,
    totalCount: 1,
    isAllSold: false,
    isAllBooked: false,
    hasAvailable: true,
    displayText: 'Available',
    badgeLabel: 'AVAILABLE',
  };
}
