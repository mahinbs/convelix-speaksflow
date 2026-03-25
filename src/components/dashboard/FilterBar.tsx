
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type DateFilter = 'today' | 'week' | 'month' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}

interface FilterBarProps {
  selectedFilter: DateFilter;
  customRange?: DateRange;
  onFilterChange: (filter: DateFilter, customRange?: DateRange) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  customRange,
  onFilterChange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<{ from?: Date; to?: Date }>({});

  const filterOptions = [
    { value: 'today' as DateFilter, label: 'Today' },
    { value: 'week' as DateFilter, label: 'This Week' },
    { value: 'month' as DateFilter, label: 'This Month' },
    { value: 'custom' as DateFilter, label: 'Custom Range' }
  ];

  const handleCustomRangeApply = () => {
    if (tempRange.from && tempRange.to) {
      onFilterChange('custom', { from: tempRange.from, to: tempRange.to });
      setIsCalendarOpen(false);
    }
  };

  const formatCustomRange = () => {
    if (!customRange) return 'Custom Range';
    return `${format(customRange.from, 'MMM d')} - ${format(customRange.to, 'MMM d')}`;
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <span className="shrink-0 text-sm font-medium text-muted-foreground">
        Filter by:
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.slice(0, 3).map((option) => (
          <Button
            key={option.value}
            variant={selectedFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className="h-8 touch-manipulation"
          >
            {option.label}
          </Button>
        ))}

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={selectedFilter === 'custom' ? 'default' : 'outline'}
            size="sm"
            className="h-8"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedFilter === 'custom' ? formatCustomRange() : 'Custom Range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">From:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !tempRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempRange.from ? format(tempRange.from, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={tempRange.from}
                      onSelect={(date) => setTempRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium">To:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !tempRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempRange.to ? format(tempRange.to, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={tempRange.to}
                      onSelect={(date) => setTempRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleCustomRangeApply}
                  disabled={!tempRange.from || !tempRange.to}
                  className="flex-1"
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsCalendarOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      </div>
    </div>
  );
};
