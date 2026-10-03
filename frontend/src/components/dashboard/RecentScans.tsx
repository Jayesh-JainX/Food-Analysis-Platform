"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FoodScan } from "@/integrations/supabase/database-types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentScans() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scans, setScans] = useState<FoodScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentScans();
    }
  }, [user]);

  const fetchRecentScans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_scans')
        .select('*')
        .eq('user_id', user?.id)
        .order('scan_date', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      setScans(data || []);
    } catch (error) {
      console.error("Error fetching recent scans:", error);
      toast.error("Failed to load recent scans");
    } finally {
      setLoading(false);
    }
  };

  // Calculate health score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-grow">
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            ))}
          </div>
        ) : scans.length > 0 ? (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/scan/${scan.id}`)}
              >
                <div 
                  className="h-16 w-16 rounded-md bg-cover bg-center shrink-0" 
                  style={{ backgroundImage: `url(${scan.image_url})` }}
                ></div>
                
                <div className="flex-grow">
                  <div className="font-medium">{scan.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {scan.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(scan.scan_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div 
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${getScoreColor(scan.health_score)}`}
                >
                  {scan.health_score}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No scans yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Use the scanner to analyze your food
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/scan-history")}
        >
          View All Scan History
        </Button>
      </CardFooter>
    </Card>
  );
}
