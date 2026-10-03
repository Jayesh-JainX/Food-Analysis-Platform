import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export default function ComingSoonTemplate({
  title,
  description,
  icon,
  ctaLabel = "Stay tuned",
}: {
  title: string;
  description: string;
  icon: ReactNode;
  ctaLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              We are building this feature. Check back soon!
            </div>
            <Button variant="outline" disabled>
              {ctaLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
