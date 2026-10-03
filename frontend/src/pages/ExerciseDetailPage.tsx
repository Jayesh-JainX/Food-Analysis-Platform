import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Youtube } from "lucide-react";

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const video = location?.state?.video as
    | {
        id: string;
        title: string;
        channel: string;
        embedUrl: string;
        thumbnail?: string;
        durationMin?: number;
      }
    | undefined;
  const fromCategory = location?.state?.fromCategory as string | undefined;
  const filters = (location?.state?.filters || {}) as any;
  const prevSearch = (location?.state?.search as string) || "";
  const backTo = "/exercise";

  const recommended = (location?.state?.recommended as any[]) || [];

  useEffect(() => {
    if (video?.title) {
      document.title = `${video.title} | Workout`;
    }
    return () => {
      document.title = "Exercise | Wellness AI Lens";
    };
  }, [video?.title]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate(backTo)}>
          <ArrowLeft className="h-4 w-4 " />
          <span className="text-md pb-0.5"> Back</span>
        </Button>
        <h1 className="text-2xl font-semibold">Workout</h1>
      </div>

      <Card>
        {video ? (
          <>
            <CardHeader>
              <CardTitle className="text-lg">{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <iframe
                  title={video.title}
                  className="w-full h-full"
                  src={video.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Youtube className="h-4 w-4" /> {video.channel}
                {video.durationMin ? (
                  <span>• {video.durationMin} min</span>
                ) : null}
              </div>

              {/* Recommended below */}
              {recommended && recommended.length > 0 && (
                <div className="pt-2">
                  <h2 className="text-base font-semibold mb-2">
                    Recommended for you
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recommended.slice(0, 6).map((r: any) => (
                      <Card
                        key={r.id}
                        className="overflow-hidden cursor-pointer"
                        onClick={() =>
                          navigate(`/exercise/${r.id}`, {
                            state: {
                              video: r,
                              fromCategory,
                              filters,
                              search: prevSearch,
                            },
                          })
                        }
                      >
                        <div className="relative aspect-video bg-muted">
                          <img
                            src={r.thumbnail}
                            alt={r.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Youtube className="h-3 w-3" /> {r.channel}
                          </div>
                          <div className="text-sm font-medium leading-tight line-clamp-2">
                            {r.title}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Video couldn’t be loaded. Please go back and select another one.
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
