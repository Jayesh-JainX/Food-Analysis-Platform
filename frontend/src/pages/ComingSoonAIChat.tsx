import ComingSoonTemplate from "./ComingSoonTemplate";
import { MessageCircle } from "lucide-react";

export default function ComingSoonAIChat() {
  return (
    <ComingSoonTemplate
      title="Health AI Chat"
      description="Ask health, nutrition, and fitness questions and let AI manage your plans."
      icon={<MessageCircle className="h-5 w-5" />}
      ctaLabel="AI Chat"
    />
  );
}
