import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

export function ScanHistoryHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Scan History</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your food scan history
        </p>
      </div>
      <Button
        onClick={() => navigate("/scanner")}
        className="wellness-gradient "
      >
        <Camera className="mr-2 h-4 w-4" />
        New Scan
      </Button>
    </div>
  );
}
