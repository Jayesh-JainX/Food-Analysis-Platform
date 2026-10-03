import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScanHistoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string | null;
  setFilterType: (value: string | null) => void;
  foodTypes: string[];
}

export function ScanHistoryFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  foodTypes,
}: ScanHistoryFiltersProps) {
  const handleFilterChange = (value: string) => {
    setFilterType(value === "all" ? null : value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search scans..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select
        value={filterType === null ? "all" : filterType}
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All food types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All food types</SelectItem>
          {foodTypes.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}