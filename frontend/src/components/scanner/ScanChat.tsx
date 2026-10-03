import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Image as ImageIcon,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Apple,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ChatService, { ChatMessage } from "../../services/scanner/chatService";

interface ScanChatProps {
  scanId: string;
  userId: string;
}

const ScanChat: React.FC<ScanChatProps> = ({ scanId, userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [chatLimitCount, setChatLimitCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
    loadChatLimitCount();
  }, [scanId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      if (messagesEndRef.current && scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
  };

  const loadChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await ChatService.getChatHistory(scanId);
      setMessages(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadChatLimitCount = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("chat_limit_count")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading chat limit count:", error);
        // If there's an error, assume 0 count
        setChatLimitCount(0);
        return;
      }

      setChatLimitCount(data?.chat_limit_count || 0);
    } catch (error) {
      console.error("Error loading chat limit count:", error);
      setChatLimitCount(0);
    }
  };

  const checkChatLimit = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("chat_limit_count")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error checking chat limit:", error);
        return false;
      }

      const currentCount = data?.chat_limit_count || 0;
      setChatLimitCount(currentCount);

      if (currentCount >= 80) {
        toast.error(
          "🚫 Chat limit reached! You've used 40/40 daily messages. Please upgrade your plan or try again tomorrow.",
          {
            duration: 5000,
            style: {
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              border: "none",
            },
          }
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking chat limit:", error);
      toast.error("Unable to verify chat limit. Please try again.");
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Check chat limit before proceeding
    const canSendMessage = await checkChatLimit();
    if (!canSendMessage) {
      return;
    }

    const userMessage = newMessage;
    setNewMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Save user message to database first
      const userMessageData = await ChatService.sendMessage({
        scan_id: scanId,
        user_id: userId,
        message: userMessage,
        message_type: "text",
        is_ai: false,
      });

      // Update UI with user message
      setMessages((prev) => [...prev, userMessageData]);

      // Generate AI response (this will call backend and save to DB)
      const aiResponse = await ChatService.generateAIResponse(
        userMessage,
        scanId,
        userId
      );

      // Update UI with AI response
      setMessages((prev) => [...prev, aiResponse]);

      // Refresh chat limit count after successful message
      await loadChatLimitCount();

      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check chat limit before proceeding with image upload
    const canSendMessage = await checkChatLimit();
    if (!canSendMessage) {
      return;
    }

    setIsLoading(true);
    setIsTyping(true);

    try {
      // Upload image to storage first
      const imageUrl = await ChatService.uploadImage(file);

      // Save user image message to database
      const userImageMessage = await ChatService.sendMessage({
        scan_id: scanId,
        user_id: userId,
        message: "Uploaded an image for analysis",
        message_type: "image",
        is_ai: false,
        image_url: imageUrl,
      });

      // Update UI with user message
      setMessages((prev) => [...prev, userImageMessage]);

      // Process with AI (this will call backend and save to DB)
      const aiResponse = await ChatService.processImageWithAI(
        imageUrl,
        scanId,
        userId
      );

      // Update UI with AI response
      setMessages((prev) => [...prev, aiResponse]);

      // Refresh chat limit count after successful message
      await loadChatLimitCount();

      toast.success("Image uploaded and analyzed successfully");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Helper function to format nutrition values with proper typing
  const formatNutritionValue = (key: string, value: unknown): string => {
    if (typeof value === "number") {
      switch (key.toLowerCase()) {
        case "calories":
        case "energy":
          return `${value} kcal`;
        case "sodium":
        case "potassium":
        case "calcium":
        case "iron":
        case "magnesium":
        case "phosphorus":
        case "zinc":
        case "vitamin_c":
        case "vitaminc":
          return `${value} mg`;
        case "protein":
        case "carbs":
        case "carbohydrates":
        case "fat":
        case "totalfat":
        case "fiber":
        case "sugar":
        case "cholesterol":
          return `${value} g`;
        default:
          return value > 1 ? `${value} g` : `${value} mg`;
      }
    }
    return String(value || "N/A");
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 81) return "text-green-600";
    if (score >= 61) return "text-blue-600";
    if (score >= 41) return "text-yellow-600";
    if (score >= 21) return "text-orange-600";
    return "text-red-600";
  };

  // Helper function to format markdown-like text
  const formatMessageText = (text: string) => {
    // Replace **text** with bold formatting
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Replace *text* with italic formatting
    const withItalics = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Replace line breaks with proper spacing
    const withLineBreaks = withItalics.replace(/\n/g, "<br />");

    return withLineBreaks;
  };

  const formatNutritionData = (nutrition: any) => {
    if (!nutrition) return null;

    return (
      <Card className="mt-3 bg-muted/50 border border-border">
        <CardContent className="p-2 sm:p-3">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
            <Apple className="w-3 h-3 text-green-500" />
            Nutrition Facts
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-1 sm:gap-2">
            {Object.entries(nutrition)
              .slice(0, 4)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="bg-background rounded p-2 text-center border border-border"
                >
                  <span className="block text-xs text-muted-foreground capitalize mb-1">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="block text-sm font-semibold text-foreground">
                    {formatNutritionValue(key, value)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMessage = (message: ChatMessage) => {
    const isAI = message.is_ai;
    const messageTime = new Date(message.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div
        key={message.id}
        className={`flex items-start gap-3 mb-4 ${
          isAI ? "" : "flex-row-reverse"
        }`}
      >
        <Avatar
          className={`w-8 h-8 flex-shrink-0 ${
            isAI
              ? "bg-gradient-to-r from-blue-500 to-blue-600"
              : "bg-gradient-to-r from-green-500 to-green-600"
          }`}
        >
          <AvatarFallback>
            {isAI ? (
              <Bot className="w-4 h-4 text-white" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </AvatarFallback>
        </Avatar>

        <div
          className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${
            isAI ? "" : "items-end"
          }`}
        >
          <div
            className={`rounded-lg p-2 sm:p-3 ${
              isAI
                ? "bg-muted/50 border border-border"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
            }`}
          >
            {message.image_url && (
              <div className="mb-2">
                <img
                  src={message.image_url}
                  alt="Uploaded content"
                  className="rounded-lg max-w-full h-auto border border-border"
                  style={{ maxHeight: "150px" }}
                />
              </div>
            )}

            <div
              className={`text-sm leading-relaxed ${
                isAI ? "text-foreground" : "text-white"
              }`}
              dangerouslySetInnerHTML={{
                __html: formatMessageText(message.message),
              }}
            />

            {message.health_score && (
              <div className="mt-3 p-2 sm:p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-500" />
                    Health Score
                  </span>
                  <span
                    className={`font-bold text-sm ${getHealthScoreColor(
                      message.health_score
                    )}`}
                  >
                    {message.health_score}/100
                  </span>
                </div>
                <Progress value={message.health_score} className="h-1 mb-2" />
                {message.health_advice && (
                  <div
                    className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 rounded p-2 border border-blue-200 dark:border-blue-800"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageText(message.health_advice),
                    }}
                  />
                )}
              </div>
            )}

            {message.ingredients && message.ingredients.length > 0 && (
              <div className="mt-3 p-2 sm:p-3 bg-muted/30 rounded-lg border border-border">
                <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-blue-500" />
                  Ingredients
                </h5>
                <div className="flex flex-wrap gap-1">
                  {message.ingredients.slice(0, 3).map((ingredient, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                  {message.ingredients.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{message.ingredients.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {formatNutritionData(message.nutrition)}

            {isAI && (
              <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(message.message)}
                  className="h-6 px-2 text-xs border"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
            )}
          </div>

          <div
            className={`text-xs text-muted-foreground px-1 ${
              isAI ? "text-left" : "text-right"
            }`}
          >
            <span>{messageTime}</span>
            {message.message_type === "analysis" && (
              <Badge variant="outline" className="text-xs ml-1">
                AI Analysis
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-4 p-3 sm:p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-[500px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-border bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600">
            <AvatarFallback>
              <Bot className="w-4 h-4 text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h3 className="font-semibold text-foreground text-sm">
                AI Nutrition Assistant
              </h3>
              <p className="text-xs text-muted-foreground sm:hidden">
                Ask me about this food item
              </p>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Ask me about this food item
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center sm:justify-end">
          {/* Chat Limit Counter */}
          <Badge
            variant={
              chatLimitCount >= 35
                ? "destructive"
                : chatLimitCount >= 30
                ? "secondary"
                : "outline"
            }
            className="text-xs"
          >
            {chatLimitCount / 2}/40 messages
          </Badge>

          {/* AI Thinking Badge */}
          <Badge
            variant="outline"
            className={`text-xs ${
              isTyping ? "animate-pulse ml-0" : "ml-10 sm:ml-0"
            }`}
          >
            {isTyping ? "AI is thinking..." : " "}
          </Badge>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-3 sm:p-4">
            {isLoadingHistory ? (
              renderSkeleton()
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-1 text-sm">
                  Start a conversation!
                </h4>
                <p className="text-muted-foreground text-xs max-w-xs mx-auto">
                  Ask me about nutrition, ingredients, or get personalized
                  health advice
                </p>
              </div>
            ) : (
              <>
                {messages.map(renderMessage)}
                {isTyping && (
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 border border-border rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Sticky at Bottom */}
      <div className="border-t border-border p-3 sm:p-4 bg-background/95 backdrop-blur rounded-b-lg">
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                chatLimitCount >= 80
                  ? "Daily limit reached..."
                  : "Ask about nutrition, ingredients..."
              }
              disabled={isLoading || chatLimitCount >= 80}
              className="pr-10 border-border focus:border-primary focus:ring-primary"
            />
            {/* <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || chatLimitCount >= 80}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
            >
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </Button> */}
          </div>

          <Button
            type="button"
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim() || chatLimitCount >= 80}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <p className="text-xs text-muted-foreground mt-2 text-center">
          {chatLimitCount >= 80
            ? "🚫 Daily chat limit reached. Resets at 12:00 AM IST."
            : "💡 Get AI-Powered Insights or Ask Questions"}
        </p>
      </div>
    </div>
  );
};

export default ScanChat;
