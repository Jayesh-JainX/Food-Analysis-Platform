import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FoodItem, searchFoods } from "@/data/foodDatabase";
import { Search, Clock, Database } from "lucide-react";

interface FoodSearchProps {
  onSelect: (food: FoodItem) => void;
  autoFocus?: boolean;
  searchUserMeals?: (searchTerm: string) => Promise<FoodItem[]>;
  dietaryRestrictions?: string[];
}

export function FoodSearch({
  onSelect,
  autoFocus = false,
  searchUserMeals,
  dietaryRestrictions,
}: FoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [userMeals, setUserMeals] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setUserMeals([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        // Search local food database with dietary restrictions
        const localResults = searchFoods(searchTerm, dietaryRestrictions);
        setSearchResults(localResults);

        // Search user's previous meals if function is provided
        if (searchUserMeals) {
          const userResults = await searchUserMeals(searchTerm);
          setUserMeals(userResults);
        }
      } catch (error) {
        console.error("Error searching foods:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchUserMeals]);

  const handleSelect = (food: FoodItem) => {
    console.log("Food selected in FoodSearch:", food); // Debug log
    onSelect(food);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowResults(false), 200);
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  const allResults = [...userMeals, ...searchResults];
  const hasResults = allResults.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for foods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-10"
          autoFocus={autoFocus}
        />
        {dietaryRestrictions && dietaryRestrictions.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            Filtering for: {dietaryRestrictions.join(", ")}
          </div>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border">
          <CardContent className="p-0">
            <div
              className="max-h-64 overflow-y-auto overscroll-contain"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(203 213 225) transparent",
              }}
              onWheel={(e) => {
                // Prevent wheel events from bubbling up to parent
                e.stopPropagation();

                const element = e.currentTarget;
                const { scrollTop, scrollHeight, clientHeight } = element;

                // If at top and scrolling up, or at bottom and scrolling down, prevent default
                if (
                  (scrollTop === 0 && e.deltaY < 0) ||
                  (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
                ) {
                  e.preventDefault();
                }
              }}
            >
              {isSearching ? (
                <div className="flex items-center justify-center py-4 px-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              ) : hasResults ? (
                <div className="space-y-0">
                  {/* User's Previous Meals */}
                  {userMeals.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 sticky top-0 z-10">
                        <Clock className="h-3 w-3" />
                        Your Previous Meals
                      </div>
                      {userMeals.map((food, index) => (
                        <Button
                          key={`user-${index}`}
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 text-left rounded-none hover:bg-muted/50 border-b border-border/50"
                          onMouseDown={(e) => e.preventDefault()} // Prevent blur
                          onClick={() => handleSelect(food)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium truncate">
                                {food.name}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-xs shrink-0"
                              >
                                Recent
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {food.calories} cal • {food.servingSize}
                            </div>
                          </div>
                        </Button>
                      ))}

                      {searchResults.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 sticky top-0 z-10">
                          <Database className="h-3 w-3" />
                          Food Database
                        </div>
                      )}
                    </>
                  )}

                  {/* Food Database Results */}
                  {searchResults.map((food, index) => (
                    <Button
                      key={`db-${index}`}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left rounded-none hover:bg-muted/50 border-b border-border/50 last:border-b-0"
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur
                      onClick={() => handleSelect(food)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {food.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize shrink-0"
                          >
                            {food.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {food.calories} cal • {food.servingSize}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : searchTerm.length >= 2 ? (
                <div className="text-center py-6 px-2 text-sm text-muted-foreground">
                  No foods found for "{searchTerm}"
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
