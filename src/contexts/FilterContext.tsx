import React, { createContext, useContext, useState } from 'react';
import { DateFilter, DateRange } from '@/components/dashboard/FilterBar';
import { useToast } from '@/hooks/use-toast';

interface FilterContextType {
  selectedFilter: DateFilter;
  customRange?: DateRange;
  setFilter: (filter: DateFilter, customRange?: DateRange) => void;
  getDateRange: () => { from: Date; to: Date };
}



const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

const isValidDateRange = (from: Date, to: Date): boolean => {
  // Convert both dates to start of day for fair comparison
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(0, 0, 0, 0);
  return fromDate <= toDate;
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>('today');
  const [customRange, setCustomRange] = useState<DateRange>();
  const { toast } = useToast();

  const setFilter = (filter: DateFilter, range?: DateRange) => {
    try {
      // Validate custom range if provided
      if (filter === 'custom' && range) {
        if (!range.from || !range.to || isNaN(range.from.getTime()) || isNaN(range.to.getTime())) {
          console.error('Invalid custom date range provided');
          toast({
            title: "Invalid Date Range",
            description: "Please provide valid start and end dates",
            variant: "destructive"
          });
          return;
        }
        // Check if end date is not before start date
        if (!isValidDateRange(range.from, range.to)) {
          console.error('End date cannot be before start date');
          toast({
            title: "Invalid Date Range",
            description: "End date cannot be before start date",
            variant: "destructive"
          });
          return;
        }
        setCustomRange(range);
      }
      setSelectedFilter(filter);
    } catch (error) {
      console.error('Error setting filter:', error);
      toast({
        title: "Error",
        description: "Failed to set date filter. Please try again.",
        variant: "destructive"
      });
      // Fallback to today if there's an error
      setSelectedFilter('today');
      setCustomRange(undefined);
    }
  };

  const getDateRange = (): { from: Date; to: Date } => {
    try {
      const now = new Date();
      now.setMilliseconds(0); // Normalize milliseconds

      switch (selectedFilter) {
        case 'today': {
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const endOfDay = new Date(startOfDay);
          endOfDay.setHours(23, 59, 59, 999);
          return { from: startOfDay, to: endOfDay };
        }
        case 'week': {
          const startOfWeek = new Date(now);
          startOfWeek.setHours(0, 0, 0, 0);
          const dayOfWeek = startOfWeek.getDay();
          const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);

          const endOfWeek = new Date(now);
          endOfWeek.setHours(23, 59, 59, 999);

          return { from: startOfWeek, to: endOfWeek };
        }
        case 'month': {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          startOfMonth.setHours(0, 0, 0, 0);

          const endOfMonth = new Date(now);
          endOfMonth.setHours(23, 59, 59, 999);

          return { from: startOfMonth, to: endOfMonth };
        }
        case 'custom': {
          if (customRange && customRange.from && customRange.to &&
            !isNaN(customRange.from.getTime()) && !isNaN(customRange.to.getTime()) &&
            isValidDateRange(customRange.from, customRange.to)) {
            const from = new Date(customRange.from);
            from.setHours(0, 0, 0, 0);

            const to = new Date(customRange.to);
            to.setHours(23, 59, 59, 999);

            return { from, to };
          }
          // Fallback to today if custom range is invalid
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const endOfDay = new Date(startOfDay);
          endOfDay.setHours(23, 59, 59, 999);
          return { from: startOfDay, to: endOfDay };
        }
        default: {
          // Default to today
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const endOfDay = new Date(startOfDay);
          endOfDay.setHours(23, 59, 59, 999);
          return { from: startOfDay, to: endOfDay };
        }
      }
    } catch (error) {
      console.error('Error getting date range:', error);
      // Return today's range as fallback
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      return { from: startOfDay, to: endOfDay };
    }
  };

  return (
    <FilterContext.Provider value={{
      selectedFilter,
      customRange,
      setFilter,
      getDateRange
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
