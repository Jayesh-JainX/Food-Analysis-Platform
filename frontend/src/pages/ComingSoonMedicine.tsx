import ComingSoonTemplate from "./ComingSoonTemplate";
import { Pill } from "lucide-react";

export default function ComingSoonMedicine() {
  return (
    <ComingSoonTemplate
      title="Medicine Info"
      description="Drug interactions, dosage guidance, and safety checks."
      icon={<Pill className="h-5 w-5" />}
      ctaLabel="Medicine"
    />
  );
}
