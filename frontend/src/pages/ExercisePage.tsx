import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Filter,
  Timer,
  Youtube,
  Globe2,
  Search,
  Info,
} from "lucide-react";
import {
  getPreferredCategory,
  getPreferredMaxMinutes,
  getPreferredMinMinutes,
  setPreferredRange,
  getWatchedIds,
  recordPlay,
  getPreferredLanguage,
  setPreferredLanguage,
} from "@/services/exercise/recommendation";
import type { Language } from "@/services/exercise/recommendation";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeSlider } from "@/components/ui/range-slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExerciseVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
  embedUrl: string;
  category:
    | "home"
    | "gym"
    | "yoga"
    | "meditation"
    | "strength"
    | "cardio"
    | "mobility"
    | "pilates"
    | "warmup"
    | "cooldown"
    | "prenatal"
    | "kids"
    | "other";
  durationMin?: number;
  durationSec?: number;
  language?: string;
}

type Category = ExerciseVideo["category"];

type Intensity = "any" | "low" | "moderate" | "high";

type Equipment =
  | "any"
  | "none"
  | "dumbbell"
  | "resistance band"
  | "kettlebell"
  | "barbell";

type Focus =
  | "any"
  | "full body"
  | "abs core"
  | "legs"
  | "arms"
  | "back"
  | "chest"
  | "shoulders"
  | "mobility"
  | "cardio";

type LanguageCode = Language;

type TimeOfDay = "morning" | "afternoon" | "evening" | "night" | "any";

const CATEGORY_LABELS: { key: Category; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "gym", label: "Gym" },
  { key: "yoga", label: "20-min Yoga" },
  { key: "meditation", label: "Meditation" },
  { key: "strength", label: "Strength" },
  { key: "cardio", label: "Cardio" },
  { key: "mobility", label: "Mobility" },
  { key: "pilates", label: "Pilates" },
  { key: "warmup", label: "Warm-up" },
  { key: "cooldown", label: "Cool-down" },
  { key: "prenatal", label: "Prenatal" },
  { key: "kids", label: "Kids" },
  { key: "other", label: "All" },
];

const YOUTUBE_SEARCH_QUERIES: Record<Category, string> = {
  home: "home workout india no equipment",
  gym: "full body gym workout india beginner",
  yoga: "20 minute yoga for beginners india",
  meditation: "meditation guided india",
  strength: "strength training dumbbell india at home",
  cardio: "cardio workout fat loss india",
  mobility: "mobility routine india",
  pilates: "pilates workout india beginner",
  warmup: "workout warm up routine india",
  cooldown: "workout cool down stretching india",
  prenatal: "prenatal yoga india safe",
  kids: "kids workout fun india",
  other: "exercise tutorial india",
};

// Time-based search queries
const TIME_BASED_QUERIES = {
  morning: {
    yoga: "morning yoga india sunrise",
    meditation: "morning meditation india",
    workout: "morning workout india energizing",
  },
  afternoon: {
    yoga: "afternoon yoga india energizing",
    meditation: "afternoon meditation india focus",
    workout: "afternoon workout india strength",
  },
  evening: {
    yoga: "evening yoga india relaxing",
    meditation: "evening meditation india calming",
    workout: "evening workout india moderate",
  },
  night: {
    yoga: "night yoga india bedtime",
    meditation: "night meditation india sleep",
    workout: "night workout india gentle",
  },
};

const LANGUAGE_KEYWORD: Record<Exclude<LanguageCode, "any">, string> = {
  en: "english",
  hi: "hindi",
  mr: "marathi",
  bn: "bengali",
  ta: "tamil",
  te: "telugu",
  kn: "kannada",
  ml: "malayalam",
  gu: "gujarati",
  pa: "punjabi",
};

const SUGGESTION_KEYWORDS = [
  "Surya Namaskar",
  "Full body",
  "Beginner",
  "No equipment",
  "Cardio",
  "Strength",
  "Stretching",
  "Warm up",
  "Cool down",
  "Pilates",
  "Mobility",
  "Meditation",
];

function parseIsoDurationToSec(iso?: string): number | undefined {
  if (!iso) return undefined;
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!match) return undefined;
  const h = parseInt(match[1] || "0", 10);
  const m = parseInt(match[2] || "0", 10);
  const s = parseInt(match[3] || "0", 10);
  return h * 3600 + m * 60 + s;
}

function buildQuery(
  category: Category,
  intensity: Intensity,
  equipment: Equipment,
  focus: Focus,
  userSearch: string,
  language: LanguageCode,
  timeOfDay: TimeOfDay = "any"
) {
  let base = YOUTUBE_SEARCH_QUERIES[category] || "exercise india";

  // Apply time-based modifications
  if (timeOfDay !== "any" && TIME_BASED_QUERIES[timeOfDay]) {
    const timeQueries = TIME_BASED_QUERIES[timeOfDay];
    if (category === "yoga" && timeQueries.yoga) {
      base = timeQueries.yoga;
    } else if (category === "meditation" && timeQueries.meditation) {
      base = timeQueries.meditation;
    } else if (timeQueries.workout) {
      base = timeQueries.workout;
    }
  }

  const parts = [base];
  if (userSearch.trim()) parts.push(userSearch.trim());
  if (intensity === "low") parts.push("low impact");
  if (intensity === "moderate") parts.push("moderate intensity");
  if (intensity === "high") parts.push("intense");
  if (equipment === "none") parts.push("no equipment");
  if (equipment === "dumbbell") parts.push("dumbbell");
  if (equipment === "resistance band") parts.push("resistance band");
  if (equipment === "kettlebell") parts.push("kettlebell");
  if (equipment === "barbell") parts.push("barbell");
  if (focus !== "any") parts.push(focus);
  if (language !== "any") parts.push(LANGUAGE_KEYWORD[language] || language);
  return parts.join(" ");
}

// safe search param applied in fetch
async function fetchYouTubeWithDurations(
  query: string,
  apiKey?: string,
  category: Category | "meditation" = "other",
  pageToken?: string
): Promise<{ items: ExerciseVideo[]; nextPageToken?: string }> {
  try {
    if (!apiKey) return { items: [], nextPageToken: undefined };
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("maxResults", "50");
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("regionCode", "IN");
    searchUrl.searchParams.set("safeSearch", "moderate");
    if (pageToken) searchUrl.searchParams.set("pageToken", pageToken);
    searchUrl.searchParams.set("key", apiKey);
    const res = await fetch(searchUrl.toString());
    const data = await res.json();
    if (!data.items || data.items.length === 0)
      return { items: [], nextPageToken: data.nextPageToken };
    const ids = data.items.map((i: any) => i.id.videoId).join(",");
    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("part", "contentDetails,status");
    videosUrl.searchParams.set("id", ids);
    videosUrl.searchParams.set("key", apiKey);
    const vres = await fetch(videosUrl.toString());
    const vdata = await vres.json();
    const idToMeta: Record<
      string,
      { sec?: number; embeddable?: boolean; allowedInIN?: boolean }
    > = {};
    (vdata.items || []).forEach((v: any) => {
      const rr = v.contentDetails?.regionRestriction;
      let allowedInIN = true;
      if (rr?.blocked && Array.isArray(rr.blocked) && rr.blocked.includes("IN"))
        allowedInIN = false;
      if (
        rr?.allowed &&
        Array.isArray(rr.allowed) &&
        !rr.allowed.includes("IN")
      )
        allowedInIN = false;
      idToMeta[v.id] = {
        sec: parseIsoDurationToSec(v.contentDetails?.duration),
        embeddable: v.status?.embeddable !== false,
        allowedInIN,
      };
    });
    const items: ExerciseVideo[] = data.items
      .map((item: any) => {
        const id = item.id.videoId as string;
        const meta = idToMeta[id] || {};
        const thumbs = item.snippet.thumbnails || {};
        const thumb =
          thumbs.maxres?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url;
        const languageGuess =
          (
            item.snippet.defaultAudioLanguage ||
            item.snippet.defaultLanguage ||
            ""
          ).slice(0, 2) || undefined;
        const sec = meta.sec || 0;
        const min = sec > 0 ? Math.max(1, Math.floor(sec / 60)) : undefined;
        return {
          id,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: thumb || getPlaceholderUrl(),
          url: `https://www.youtube.com/watch?v=${id}`,
          embedUrl: `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`,
          category,
          durationMin: min,
          durationSec: sec,
          language: languageGuess,
        };
      })
      .filter(
        (v: ExerciseVideo) =>
          !!v.id &&
          !!v.thumbnail &&
          !!v.embedUrl &&
          idToMeta[v.id]?.embeddable !== false &&
          idToMeta[v.id]?.allowedInIN !== false
      );
    return { items, nextPageToken: data.nextPageToken };
  } catch (e) {
    console.error("YouTube API error", e);
    return { items: [], nextPageToken: undefined };
  }
}

function fallbackSearchAsVideoList(
  query: string,
  category: Category
): ExerciseVideo[] {
  return [];
}

// helper to choose placeholder by theme (light/dark)
function getPlaceholderUrl() {
  if (typeof document !== "undefined") {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return isDark ? "/placeholder-dark.png" : "/placeholder.svg";
  }
  return "/placeholder.svg";
}

export default function ExercisePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState<Category>(
    getPreferredCategory(user?.id) as Category
  );

  // Restore range from navigation state or use preferences
  const [rangeMinutes, setRangeMinutes] = useState<[number, number]>(() => {
    const stateRange = location.state?.filters;
    if (
      stateRange?.minMinutes !== undefined &&
      stateRange?.maxMinutes !== undefined
    ) {
      // Restore exact range from navigation state
      return [stateRange.minMinutes, stateRange.maxMinutes];
    }
    // Use preferences as fallback
    return [getPreferredMinMinutes(user?.id), getPreferredMaxMinutes(user?.id)];
  });

  // Persist range to preferences so it stays the same across navigation
  useEffect(() => {
    const [min, max] = rangeMinutes;
    setPreferredRange(user?.id, min, max);
  }, [rangeMinutes, user?.id]);

  // Add a ref to track if range has been manually set by user
  const userSetRange = useRef(false);

  // Mark when user manually changes range
  const handleRangeChange = (v: number[]) => {
    if (Array.isArray(v) && v.length === 2) {
      const next: [number, number] = [
        Math.min(v[0], v[1]),
        Math.max(v[0], v[1]),
      ];
      userSetRange.current = true;
      setRangeMinutes(next);
    }
  };

  const [videos, setVideos] = useState<ExerciseVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
  const [intensity, setIntensity] = useState<Intensity>("any");
  const [equipment, setEquipment] = useState<Equipment>("any");
  const [focus, setFocus] = useState<Focus>("any");
  const [language, setLanguageState] = useState<LanguageCode>(
    getPreferredLanguage(user?.id)
  );
  const [sortBy, setSortBy] = useState<
    "relevance" | "duration-asc" | "duration-desc" | "title"
  >("relevance");
  const [hideWatched, setHideWatched] = useState(false);
  const [committedSearch, setCommittedSearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Cache key for time of day selection
  const TIME_OF_DAY_CACHE_KEY = `exercise_time_of_day_${
    user?.id || "anonymous"
  }`;
  const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Auto-select time of day based on current time
  const getCurrentTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  // Get cached time of day or auto-select based on current time
  const getTimeOfDayFromCache = (): TimeOfDay => {
    try {
      const cached = localStorage.getItem(TIME_OF_DAY_CACHE_KEY);
      if (cached) {
        const { timeOfDay, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid (within 2 hours)
        if (now - timestamp < CACHE_DURATION) {
          return timeOfDay;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(TIME_OF_DAY_CACHE_KEY);
        }
      }
    } catch (error) {
      console.error("Error reading time of day cache:", error);
      localStorage.removeItem(TIME_OF_DAY_CACHE_KEY);
    }

    // Auto-select based on current time if no valid cache
    return getCurrentTimeOfDay();
  };

  // Save time of day to cache
  const saveTimeOfDayToCache = (timeOfDay: TimeOfDay) => {
    try {
      const cacheData = {
        timeOfDay,
        timestamp: Date.now(),
      };
      localStorage.setItem(TIME_OF_DAY_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving time of day cache:", error);
    }
  };

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => {
    return getTimeOfDayFromCache();
  });

  // Update cache when time of day changes
  useEffect(() => {
    saveTimeOfDayToCache(timeOfDay);
  }, [timeOfDay]);

  // Check if current time selection is auto-selected (matches current time)
  const isAutoSelected = (): boolean => {
    return timeOfDay === getCurrentTimeOfDay();
  };

  // Function to clear cache (for testing purposes)
  const clearTimeOfDayCache = () => {
    localStorage.removeItem(TIME_OF_DAY_CACHE_KEY);
    // Reset to current time
    setTimeOfDay(getCurrentTimeOfDay());
  };

  // Debounce only for suggestions (not for fetch)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(id);
  }, [search]);

  const submitSearch = (term?: string) => {
    const q = (term ?? search).trim();
    setCommittedSearch(q);
    setShowSuggestions(false);
  };

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSearch();
    }
  }

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setPreferredLanguage(user?.id, lang);
  };

  useEffect(() => {
    // Ensure 20-min Yoga has max >= 20, but only if current max is less than 20 AND user hasn't manually set the range
    if (category === "yoga" && !userSetRange.current) {
      setRangeMinutes(([min, max]) => {
        // Only modify if current max is less than 20
        if (max < 20) {
          const newMax = 20;
          const clampedMin = Math.min(min, newMax);
          return [clampedMin, newMax];
        }
        // Don't modify if already valid
        return [min, max];
      });
    }
  }, [category]);

  // Fetch videos when committedSearch changes or filters change
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const queryBase = buildQuery(
          category,
          intensity,
          equipment,
          focus,
          committedSearch,
          language,
          timeOfDay
        );
        const viaApi = await fetchYouTubeWithDurations(
          queryBase,
          apiKey,
          category
        );
        let combined = viaApi.items;
        // Remove playlist-style fallbacks; show only proper video results from API
        if (isMounted) {
          setVideos(combined);
          setNextPageToken(viaApi.nextPageToken);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [
    category,
    apiKey,
    intensity,
    equipment,
    focus,
    committedSearch,
    language,
    timeOfDay,
  ]);

  // Infinite loader: fetch up to 12 new items per intersection
  useEffect(() => {
    if (!apiKey) return;
    const node = sentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && nextPageToken) {
          setIsFetchingMore(true);
          try {
            const queryBase = buildQuery(
              category,
              intensity,
              equipment,
              focus,
              committedSearch,
              language,
              timeOfDay
            );
            let collected: ExerciseVideo[] = [];
            let token: string | undefined = nextPageToken;
            // collect until we have at least 12 new videos or token ends
            while (token && collected.length < 12) {
              const more = await fetchYouTubeWithDurations(
                queryBase,
                apiKey,
                category,
                token
              );
              collected = [...collected, ...more.items];
              token = more.nextPageToken;
            }
            setVideos((prev) => {
              // Deduplicate videos based on ID to prevent duplicates
              const existingIds = new Set(prev.map((v) => v.id));
              const uniqueNewVideos = collected.filter(
                (v) => !existingIds.has(v.id)
              );
              return [...prev, ...uniqueNewVideos];
            });
            setNextPageToken(token);
          } catch (e) {
            console.error(e);
          } finally {
            setIsFetchingMore(false);
          }
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [
    apiKey,
    category,
    nextPageToken,
    isFetchingMore,
    intensity,
    equipment,
    focus,
    committedSearch,
    language,
    timeOfDay,
  ]);

  const filtered = useMemo(() => {
    const q = committedSearch.trim().toLowerCase();
    const [minM, maxM] = rangeMinutes;
    let list = videos
      .filter((v) => (q ? v.title.toLowerCase().includes(q) : true))
      .filter((v) =>
        category ? v.category === category || category === "other" : true
      )
      .filter((v) => (v.durationMin ? v.durationMin <= maxM : true))
      .filter((v) => (v.durationMin ? v.durationMin >= minM : true))
      .filter((v) =>
        language === "any"
          ? true
          : !v.language || v.language.startsWith(language)
      );

    if (hideWatched) {
      const w = getWatchedIds(user?.id);
      list = list.filter((v) => !w.has(v.id));
    }

    // Deduplicate videos based on ID to prevent duplicates in final results
    const seenIds = new Set<string>();
    list = list.filter((v) => {
      if (seenIds.has(v.id)) {
        return false;
      }
      seenIds.add(v.id);
      return true;
    });

    if (sortBy === "duration-asc") {
      list = [...list].sort(
        (a, b) => (a.durationMin || 9999) - (b.durationMin || 9999)
      );
    } else if (sortBy === "duration-desc") {
      list = [...list].sort(
        (a, b) => (b.durationMin || 0) - (a.durationMin || 0)
      );
    } else if (sortBy === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [
    videos,
    committedSearch,
    category,
    rangeMinutes,
    language,
    hideWatched,
    sortBy,
    user?.id,
  ]);

  const watched = useMemo(() => getWatchedIds(user?.id), [user?.id]);

  const openVideo = (video: ExerciseVideo) => {
    recordPlay(user?.id, video.category, video.durationMin, video.id, language);
    const recommendations = filtered
      .filter((r) => r.id !== video.id)
      .slice(0, 9);
    navigate(`/exercise/${video.id}`, {
      state: {
        video,
        fromCategory: category,
        filters: {
          intensity,
          equipment,
          focus,
          minMinutes: rangeMinutes[0],
          maxMinutes: rangeMinutes[1],
          language,
        },
        search: committedSearch,
        recommended: recommendations,
      },
    });
  };

  const suggestionMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [] as string[];
    const fromKeywords = SUGGESTION_KEYWORDS.filter((k) =>
      k.toLowerCase().includes(q)
    );
    const fromTitles = videos
      .map((v) => v.title)
      .filter((t) => t.toLowerCase().includes(q))
      .slice(0, 5);
    const joined = Array.from(new Set([...fromKeywords, ...fromTitles]));
    return joined.slice(0, 5);
  }, [search, videos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exercise</h1>
        <p className="text-muted-foreground mt-1">
          Search and filter workouts. India-friendly programs and quick yoga
          options.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Explore Workouts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Row 1: Search + Language */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search by name (e.g., Surya Namaskar, Meditation)"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onKeyDown={handleSearchKeyDown}
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => submitSearch()}
                  className="px-3 py-2 rounded-md border hover:bg-accent text-sm h-10"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              {showSuggestions && suggestionMatches.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow">
                  {suggestionMatches.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearch(s);
                        submitSearch(s);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-1">
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as Language)}
              >
                <SelectTrigger className="flex items-center gap-2 text-left">
                  <Globe2 className="h-4 w-4" />
                  <div className="min-w-0 flex-1 truncate">
                    <SelectValue placeholder="Language" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="kn">Kannada</SelectItem>
                  <SelectItem value="ml">Malayalam</SelectItem>
                  <SelectItem value="gu">Gujarati</SelectItem>
                  <SelectItem value="pa">Punjabi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Categories */}
          <div className="grid grid-cols-1 gap-3">
            <Tabs
              value={category}
              onValueChange={(v) => setCategory(v as Category)}
              className="pt-2"
            >
              {/* Mobile TabsList - Collapsible Layout */}
              <div className="w-full sm:hidden">
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_LABELS.slice(0, 4).map((c) => (
                    <TabsList key={c.key} className="w-full">
                      <TabsTrigger value={c.key} className="w-full text-xs">
                        {c.label}
                      </TabsTrigger>
                    </TabsList>
                  ))}
                </div>

                {CATEGORY_LABELS.length > 4 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="w-full flex items-center justify-center gap-2 p-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showAllCategories ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          Show More
                        </>
                      )}
                    </button>

                    {showAllCategories && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {CATEGORY_LABELS.slice(4).map((c) => (
                          <TabsList key={c.key} className="w-full">
                            <TabsTrigger
                              value={c.key}
                              className="w-full text-xs"
                            >
                              {c.label}
                            </TabsTrigger>
                          </TabsList>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop TabsList - Single Row */}
              <div className="hidden sm:block">
                <TabsList className="flex flex-nowrap justify-start items-center overflow-x-auto h-auto py-1 lg:w-full gap-2">
                  {CATEGORY_LABELS.map((c) => (
                    <TabsTrigger
                      key={c.key}
                      value={c.key}
                      className="text-sm whitespace-nowrap flex-shrink-0 px-3 rounded-md"
                    >
                      {c.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Row 3: Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="lg:col-span-2 space-y-2">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1"
              >
                <Timer className="h-3 w-3" /> {rangeMinutes[0]}–
                {rangeMinutes[1]} min
              </Badge>
              <div className="max-w-full sm:max-w-[420px] px-1 py-1 rounded-md border bg-background">
                <RangeSlider
                  className="py-2"
                  value={rangeMinutes}
                  onValueChange={handleRangeChange}
                  min={0}
                  max={120}
                  step={5}
                  aria-label="Duration range in minutes"
                />
              </div>
            </div>
            <div className="flex lg:justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center text-sm px-3 py-2 rounded-md border hover:bg-accent"
                  >
                    <Filter className="h-4 w-4 mr-2" /> More filters
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[90%] sm:max-w-[520px] px-4 sm:px-6">
                  <DialogHeader>
                    <DialogTitle>More filters</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-5">
                    {/* Intensity, Equipment, Focus, Sort, Hide watched */}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort by</label>
                      <Select
                        value={sortBy}
                        onValueChange={(v) => setSortBy(v as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Relevance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="duration-asc">
                            Duration (short first)
                          </SelectItem>
                          <SelectItem value="duration-desc">
                            Duration (long first)
                          </SelectItem>
                          <SelectItem value="title">Title (A–Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hide watched</span>
                      <button
                        type="button"
                        className={`h-6 w-11 rounded-full border transition-colors ${
                          hideWatched ? "bg-primary" : "bg-muted"
                        }`}
                        onClick={() => setHideWatched((v) => !v)}
                        aria-pressed={hideWatched}
                      >
                        <span
                          className={`block h-5 w-5 bg-background rounded-full m-0.5 transition-transform ${
                            hideWatched ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Row 1.5: Time of Day Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                Time of Day:
              </span>
              {isAutoSelected() && timeOfDay !== "any" && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Auto-selected
                  </span>
                  <div className="relative group">
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Time selection is cached for 2 hours and auto-updates
                      based on current time
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                { key: "any", label: "Any Time" },
                { key: "morning", label: "🌅 Morning" },
                { key: "afternoon", label: "☀️ Afternoon" },
                { key: "evening", label: "🌆 Evening" },
                { key: "night", label: "🌙 Night" },
              ].map((time) => (
                <Button
                  key={time.key}
                  variant={timeOfDay === time.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeOfDay(time.key as TimeOfDay)}
                  className={`text-xs h-7 sm:h-8 flex-shrink-0 ${
                    timeOfDay === time.key &&
                    isAutoSelected() &&
                    time.key !== "any"
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  }`}
                >
                  {time.label}
                </Button>
              ))}
            </div>
            {import.meta.env.DEV && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTimeOfDayCache}
                className="text-xs h-6 px-2"
                title="Clear cache (dev only)"
              >
                Clear Cache
              </Button>
            )}
          </div>
          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {loading && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={`s-${i}`} className="overflow-hidden">
                    <Skeleton className="w-full aspect-video" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </Card>
                ))}
              </>
            )}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full text-center text-sm text-muted-foreground py-8">
                No videos found. Try a different keyword or adjust filters.
              </div>
            )}
            {!loading &&
              filtered.map((v) => (
                <Card
                  key={v.id}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => openVideo(v)}
                >
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {v.language && (
                        <span className="text-[10px] rounded px-1.5 py-0.5 bg-background/80 border">
                          {v.language.toUpperCase()}
                        </span>
                      )}
                      {typeof v.durationSec === "number" &&
                        (v.durationSec >= 60 ? (
                          <span className="text-[10px] rounded px-1.5 py-0.5 bg-background/80 border">
                            {v.durationMin}m
                          </span>
                        ) : (
                          <span className="text-[10px] rounded px-1.5 py-0.5 bg-background/80 border">
                            {v.durationSec}s
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Youtube className="h-4 w-4" /> {v.channel}
                      </span>
                      {watched.has(v.id) && (
                        <span className="text-primary">Watched</span>
                      )}
                    </div>
                    <div className="font-medium text-sm leading-tight line-clamp-2">
                      {v.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      {v.category.toUpperCase()}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
          <div ref={sentinelRef} />
          {isFetchingMore && (
            <div className="text-center text-xs text-muted-foreground">
              Loading more…
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
