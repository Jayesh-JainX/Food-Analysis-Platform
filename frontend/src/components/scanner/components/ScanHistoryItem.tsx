import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoodScan } from "@/integrations/supabase/database-types";

interface ScanHistoryItemProps {
  scan: FoodScan;
  onDelete: (scanId: string, event: React.MouseEvent) => void;
}

export function ScanHistoryItem({ scan, onDelete }: ScanHistoryItemProps) {
  const navigate = useNavigate();

  const getScoreInfo = (score: number) => {
    if (score >= 80)
      return {
        style: "bg-emerald-500 text-white hover:bg-emerald-600",
        label: "Excellent",
      };
    if (score >= 60)
      return {
        style: "bg-amber-500 text-white hover:bg-amber-600",
        label: "Good",
      };
    if (score >= 40)
      return {
        style: "bg-orange-500 text-white hover:bg-orange-600",
        label: "Fair",
      };
    return { style: "bg-red-500 text-white hover:bg-red-600", label: "Poor" };
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 my-4 sm:my-2 justify-between rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer shadow-sm"
      onClick={() => navigate(`/scan/${scan.id}`)}
    >
      <div className="flex gap-4 w-full sm:w-auto">
        <div
          className="h-20 w-20 sm:h-16 sm:w-16 rounded-md bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${scan.image_url})` }}
        ></div>

        <div className="flex-grow">
          <div className="font-medium text-lg sm:text-base">{scan.name}</div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {scan.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(scan.scan_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-1 justify-between sm:justify-end">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center font-medium transition-colors ${
              getScoreInfo(scan.health_score).style
            }`}
            title={`Health Score: ${scan.health_score}`}
          >
            {scan.health_score}
          </div>
          <span className="text-xs text-muted-foreground">
            {getScoreInfo(scan.health_score).label}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-100/80 h-12 w-12"
          onClick={(e) => onDelete(scan.id, e)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
