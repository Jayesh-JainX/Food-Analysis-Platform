import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Stethoscope,
  Pill,
  Leaf,
  Clock,
  AlertCircle,
  X,
  Tags,
  ChevronDown,
  Bot,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Disease } from "@/data/diseases";
import {
  searchByName,
  searchBySymptoms,
  searchByTags,
  diseases,
} from "@/data/diseases";

export default function DiseasesPage() {
  const [mode, setMode] = useState<"by-name" | "by-symptoms">("by-name");
  const [query, setQuery] = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomTokens, setSymptomTokens] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showTagSection, setShowTagSection] = useState(false);

  // Popular tags for quick selection
  const popularTags = [
    "respiratory",
    "chronic",
    "viral",
    "bacterial",
    "cardiovascular",
    "digestive",
    "neurological",
    "infectious",
    "inflammatory",
    "serious",
  ];

  // Quick symptoms for selection
  const quickSymptoms = [
    "headache",
    "fever",
    "cough",
    "nausea",
    "fatigue",
    "pain",
    "dizziness",
    "vomiting",
    "shortness of breath",
    "sore throat",
    "muscle aches",
    "congestion",
  ];

  // Quick disease names for selection
  const quickDiseases = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Arthritis",
    "Depression",
    "Migraine",
    "Pneumonia",
    "Tuberculosis",
  ];

  const results: Disease[] = useMemo(() => {
    let baseResults: Disease[] = [];

    if (mode === "by-name") {
      if (query.trim()) {
        baseResults = searchByName(query);
      }
    } else if (mode === "by-symptoms") {
      const combined = [...symptomTokens];
      if (symptomInput.trim()) combined.push(symptomInput.trim());
      if (combined.length > 0) {
        baseResults = searchBySymptoms(combined.join(" "));
      }
    }

    // If tags are selected, filter the base results by tags or search by tags if no base results
    if (selectedTags.length > 0) {
      if (baseResults.length > 0) {
        // Filter existing results by tags
        return baseResults.filter((disease) =>
          disease.tags?.some((tag) =>
            selectedTags.some((selectedTag) =>
              tag.toLowerCase().includes(selectedTag.toLowerCase())
            )
          )
        );
      } else {
        // Search by tags only if no other search criteria
        return searchByTags(selectedTags);
      }
    }

    return baseResults;
  }, [mode, query, symptomInput, symptomTokens, selectedTags]);

  const handleDiseaseClick = (disease: Disease) => {
    setSelectedDisease(disease);
    setShowDialog(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const addSymptomToken = (value: string) => {
    const v = value.trim();
    if (!v) return;
    setSymptomTokens((prev) => Array.from(new Set([...prev, v.toLowerCase()])));
    setSymptomInput("");
  };

  const removeSymptomToken = (value: string) => {
    setSymptomTokens((prev) => prev.filter((t) => t !== value));
  };

  const addTagToken = (value: string) => {
    const v = value.trim();
    if (!v) return;
    setSelectedTags((prev) => Array.from(new Set([...prev, v.toLowerCase()])));
    setTagInput("");
  };

  const removeTagToken = (value: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== value));
  };

  const addPopularTag = (tag: string) => {
    if (!selectedTags.includes(tag.toLowerCase())) {
      setSelectedTags((prev) => [...prev, tag.toLowerCase()]);
    }
  };

  const addQuickSymptom = (symptom: string) => {
    if (!symptomTokens.includes(symptom.toLowerCase())) {
      addSymptomToken(symptom);
    }
  };

  const addQuickDisease = (disease: string) => {
    setQuery(disease);
  };

  // Common tag section component
  const TagSection = () => (
    <div className="space-y-3 lg:border-t lg:pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Tags className="h-4 w-4" />
          Filter by Tags
        </div>
        <button
          type="button"
          onClick={() => setShowTagSection(!showTagSection)}
          className="lg:hidden flex items-center justify-center w-6 h-6 rounded-md hover:bg-muted transition-colors"
          aria-label={showTagSection ? "Hide tag filters" : "Show tag filters"}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showTagSection ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className={`lg:block ${showTagSection ? "block" : "hidden"}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTagToken(tagInput);
          }}
        >
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTagToken(tagInput);
              }
            }}
            placeholder="Add tags to filter results (e.g., chronic, viral)"
            className="text-sm"
          />
        </form>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Active Filters:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedTags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs bg-primary/10"
                >
                  <Tags className="h-3 w-3" />
                  {t}
                  <button
                    type="button"
                    className="opacity-60 hover:opacity-100 transition"
                    onClick={() => removeTagToken(t)}
                    aria-label={`Remove ${t}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Popular Tags */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Quick Tags:
          </div>
          <div className="flex flex-wrap gap-1">
            {popularTags.slice(0, 6).map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => addPopularTag(tag)}
                className="text-xs h-6 px-2"
                disabled={selectedTags.includes(tag.toLowerCase())}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find Diseases</h1>
        <p className="text-muted-foreground mt-1">
          Search diseases by name or symptoms, and optionally filter by tags to
          view common Indian medicines and Ayurvedic options.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" /> Search Diseases
            </CardTitle>
            <Link to="/ai-chat">
              <Button
                variant="outline"
                size="sm"
                className="wellness-gradient flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                Ask <span className="hidden sm:inline">Health</span> AI
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as any)}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 gap-2">
              <TabsList className="grid grid-cols-2 h-auto p-1 sm:w-[420px]">
                <TabsTrigger value="by-name" className="text-sm">
                  By Disease Name
                </TabsTrigger>
                <TabsTrigger value="by-symptoms" className="text-sm">
                  By Symptoms
                </TabsTrigger>
              </TabsList>
            </div>

            {mode === "by-name" ? (
              <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
                <div className="space-y-2 lg:border-t lg:pt-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Stethoscope className="h-4 w-4" />
                    Disease Name
                  </div>
                  <form onSubmit={handleSearchSubmit}>
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Hypertension, Diabetes"
                        className="flex-1"
                      />
                    </div>
                  </form>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {quickDiseases.map((d) => (
                      <Button
                        key={d}
                        variant="outline"
                        size="sm"
                        onClick={() => addQuickDisease(d)}
                        className="text-xs h-6 px-2"
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="lg:border-l lg:pl-6">
                  <TagSection />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 lg:border-t lg:pt-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Symptoms
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addSymptomToken(symptomInput);
                    }}
                  >
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        value={symptomInput}
                        onChange={(e) => setSymptomInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSymptomToken(symptomInput);
                          }
                        }}
                        placeholder="Type a symptom and press Enter (e.g., headache)"
                        className="flex-1"
                      />
                    </div>
                  </form>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {quickSymptoms.map((s) => (
                      <Button
                        key={s}
                        variant="outline"
                        size="sm"
                        onClick={() => addQuickSymptom(s)}
                        className="text-xs h-6 px-2"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {symptomTokens.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs bg-background"
                      >
                        {t}
                        <button
                          type="button"
                          className="opacity-60 hover:opacity-100 transition"
                          onClick={() => removeSymptomToken(t)}
                          aria-label={`Remove ${t}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lg:border-l lg:pl-6">
                  <TagSection />
                </div>
              </div>
            )}
          </Tabs>

          {/* Search Results */}
          {(
            mode === "by-name"
              ? query.trim() || selectedTags.length > 0
              : symptomTokens.length > 0 ||
                symptomInput.trim() ||
                selectedTags.length > 0
          ) ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Search Results</h3>
              {results.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No matches found. Try different terms or remove some filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((d) => (
                    <DiseaseCard
                      key={d.id}
                      disease={d}
                      onClick={() => handleDiseaseClick(d)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                Common Diseases in India
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diseases.slice(0, 12).map((d) => (
                  <DiseaseCard
                    key={d.id}
                    disease={d}
                    onClick={() => handleDiseaseClick(d)}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disease Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[90%] sm:max-w-3xl max-h-[85vh] overflow-y-auto scrollbar-thin-muted">
          {selectedDisease && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  {selectedDisease.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedDisease.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Disease Image - Smaller */}
                {/* <div className=" bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedDisease.image}
                    alt={selectedDisease.name}
                    className="w-full h-full object-contain"
                  />
                </div> */}

                {/* Symptoms */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Common Symptoms</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedDisease.symptoms.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Ayurvedic Remedies - Moved to top */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Ayurvedic Options
                  </h3>
                  {selectedDisease.ayurvedic.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No data available
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {selectedDisease.ayurvedic.map((m, i) => (
                        <Card key={i} className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{m.name}</h4>
                              {m.brand && (
                                <Badge variant="outline" className="text-xs">
                                  {m.brand}
                                </Badge>
                              )}
                            </div>
                            {m.dosage && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {m.dosage}
                              </div>
                            )}
                            {m.notes && (
                              <p className="text-xs text-muted-foreground">
                                {m.notes}
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allopathic Medicines */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Allopathic Medicines (India)
                  </h3>
                  {selectedDisease.allopathic.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No data available
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {selectedDisease.allopathic.map((m, i) => (
                        <Card key={i} className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{m.name}</h4>
                              {m.otc && (
                                <Badge variant="outline" className="text-xs">
                                  OTC
                                </Badge>
                              )}
                            </div>
                            {m.dosage && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {m.dosage}
                              </div>
                            )}
                            {m.notes && (
                              <p className="text-xs text-muted-foreground">
                                {m.notes}
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lifestyle Advice */}
                {selectedDisease.lifestyle &&
                  selectedDisease.lifestyle.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold">
                        Lifestyle Advice
                      </h3>
                      <div className="grid gap-1">
                        {selectedDisease.lifestyle.map((l, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                            <p className="text-sm">{l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Disclaimer - Compact */}
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Medical Disclaimer</p>
                      <p>
                        This information is for educational purposes only and
                        should not be considered as medical advice. Always
                        consult with a qualified healthcare professional for
                        proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Disease Card Component
function DiseaseCard({
  disease,
  onClick,
}: {
  disease: Disease;
  onClick: () => void;
}) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-video bg-muted relative">
        <img
          src={disease.image}
          alt={disease.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute  bottom-1 left-1 right-2">
          <h3 className=" bg-muted p-1.5 rounded-md w-fit font-semibold text-xs line-clamp-2">
            {disease.name}
          </h3>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        {disease.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {disease.description}
          </p>
        )}

        {/* Tags */}
        {disease.tags && disease.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {disease.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-primary/10"
              >
                {tag}
              </Badge>
            ))}
            {disease.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{disease.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Symptoms */}
        <div className="flex flex-wrap gap-1">
          {disease.symptoms.slice(0, 2).map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
          {disease.symptoms.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{disease.symptoms.length - 2} symptoms
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{disease.allopathic.length} allopathic options</span>
          <span>{disease.ayurvedic.length} ayurvedic options</span>
        </div>
      </CardContent>
    </Card>
  );
}
