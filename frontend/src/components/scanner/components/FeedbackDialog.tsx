// FeedbackDialog.tsx
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  detectedContent: string;
}

export function FeedbackDialog({
  isOpen,
  onClose,
  imageUrl,
  detectedContent,
}: FeedbackDialogProps) {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    {
      value: "wrong_detection",
      label: "Wrong Detection - This is actually food",
    },
    { value: "inappropriate_content", label: "Inappropriate Content" },
    { value: "poor_quality", label: "Poor Image Quality" },
    { value: "other", label: "Other Issue" },
  ];

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit feedback");
      return;
    }

    if (!feedbackType) {
      toast.error("Please select a feedback type");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("image_feedback").insert([
        {
          user_id: user.id,
          image_url: imageUrl,
          feedback_type: feedbackType,
          user_message: message.trim() || null,
          image_type_detected: detectedContent,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success(
        "Feedback submitted successfully. Thank you for helping us improve!"
      );
      onClose();

      // Reset form
      setFeedbackType("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] rounded-lg md:rounded-lg">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="feedback-type" className="text-sm font-medium">
              What's the issue?
            </Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-medium">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Please provide any additional details that might help us improve..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {imageUrl && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Image in Question</Label>
              <img
                src={imageUrl}
                alt="Feedback image"
                className="w-full h-52 object-contain rounded-lg border mt-2"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-end sm:space-x-2 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !feedbackType}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
