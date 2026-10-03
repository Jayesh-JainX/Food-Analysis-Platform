import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { FoodScan } from "@/integrations/supabase/database-types";
import { Skeleton } from "@/components/ui/skeleton";
import { ScanHistoryHeader } from "@/components/scanner/components/ScanHistoryHeader";
import { ScanHistoryFilters } from "@/components/scanner/components/ScanHistoryFilters";
import { ScanHistoryItem } from "@/components/scanner/components/ScanHistoryItem";
import { useNavigate } from "react-router-dom";

const SCANS_PER_PAGE = 10;

export function ScanHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scans, setScans] = useState<FoodScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [lastFetchedDate, setLastFetchedDate] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Intersection Observer callback for infinite loading
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            fetchMoreScans();
          }
        },
        {
          rootMargin: "100px",
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadingMore]
  );

  useEffect(() => {
    if (user) {
      fetchScans();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [user]);

  // Reset pagination when filters change
  useEffect(() => {
    if (user) {
      setScans([]);
      setLastFetchedDate(null);
      setHasMore(true);
      fetchScans();
    }
  }, [searchTerm, filterType, user]);

  const fetchScans = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let query = supabase
        .from("food_scans")
        .select("*")
        .eq("user_id", user?.id)
        .order("scan_date", { ascending: false })
        .limit(SCANS_PER_PAGE);

      // Apply search filter
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      // Apply type filter
      if (filterType) {
        query = query.eq("type", filterType);
      }

      // Apply pagination
      if (isLoadMore && lastFetchedDate) {
        query = query.lt("scan_date", lastFetchedDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (isLoadMore) {
        setScans((prev) => [...prev, ...(data || [])]);
      } else {
        setScans(data || []);
      }

      // Update pagination state
      if (data && data.length > 0) {
        setLastFetchedDate(data[data.length - 1].scan_date);
        setHasMore(data.length === SCANS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching scan history:", error);
      toast.error("Failed to load scan history");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchMoreScans = () => {
    if (!loadingMore && hasMore) {
      fetchScans(true);
    }
  };

  const handleDeleteScan = async (scanId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      const { error } = await supabase
        .from("food_scans")
        .delete()
        .eq("id", scanId)
        .eq("user_id", user?.id);

      if (error) throw error;

      // Remove from local state
      setScans(scans.filter((scan) => scan.id !== scanId));
      toast.success("Scan deleted successfully");
    } catch (error) {
      console.error("Error deleting scan:", error);
      toast.error("Failed to delete scan");
    }
  };

  // Get unique food types for filtering (from all scans, not just loaded ones)
  const foodTypes = [...new Set(scans.map((scan) => scan.type))];

  return (
    <div className="mx-auto">
      <ScanHistoryHeader />

      <Card>
        <CardHeader>
          <ScanHistoryFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            foodTypes={foodTypes}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border"
                >
                  <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-md flex-shrink-0" />
                  <div className="flex-grow space-y-2 min-w-0">
                    <Skeleton className="h-4 sm:h-5 w-full max-w-[200px] sm:max-w-[300px]" />
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : scans.length > 0 ? (
            <div className="space-y-4">
              {scans.map((scan, index) => (
                <div
                  key={scan.id}
                  ref={index === scans.length - 1 ? lastElementRef : null}
                >
                  <ScanHistoryItem scan={scan} onDelete={handleDeleteScan} />
                </div>
              ))}

              {/* Loading indicator for infinite scroll */}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more scans...</span>
                  </div>
                </div>
              )}

              {/* End of results indicator */}
              {!hasMore && scans.length > 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No more scans to load
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Scan className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No scans found</p>
              {searchTerm || filterType ? (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType(null);
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <>
                  <p className="mt-2 text-sm text-muted-foreground mb-6">
                    Use the scanner to add your first food scan
                  </p>
                  <Button
                    onClick={() => navigate("/scanner")}
                    className="gap-2"
                    size="lg"
                  >
                    <Camera className="h-4 w-4" />
                    New Scan
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {scans.length > 0 && (searchTerm || filterType) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterType(null);
              }}
            >
              Show all scans
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
