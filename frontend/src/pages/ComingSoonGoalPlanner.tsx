import ComingSoonTemplate from "./ComingSoonTemplate";
import { Target } from "lucide-react";

export default function ComingSoonGoalPlanner() {
  return (
    <ComingSoonTemplate
      title="Goal Planner"
      description="Plan long-term goals like 6-month cricket pro training or army selection."
      icon={<Target className="h-5 w-5" />}
      ctaLabel="Goal Planner"
    />
  );
}
