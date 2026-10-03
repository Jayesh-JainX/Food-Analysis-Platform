import { supabase } from '../../integrations/supabase/client';

export interface ChatMessage {
  id: string;
  scan_id: string;
  user_id: string;
  message: string;
  message_type: 'text' | 'image' | 'analysis';
  is_ai: boolean;
  image_url?: string;
  extracted_text?: string;
  nutrition?: any;
  ingredients?: string[];
  health_score?: number;
  health_advice?: string;
  created_at: string;
  updated_at: string;
}

export interface MessageData {
  scan_id: string;
  user_id: string;
  message: string;
  message_type?: 'text' | 'image' | 'analysis';
  is_ai?: boolean;
  image_url?: string;
  extracted_text?: string;
  nutrition?: any;
  ingredients?: string[];
  health_score?: number;
  health_advice?: string;
}

class ChatService {
  private static readonly API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Send a message to the chat
  static async sendMessage(messageData: MessageData): Promise<ChatMessage> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          scan_id: messageData.scan_id,
          user_id: messageData.user_id,
          message: messageData.message,
          message_type: messageData.message_type || 'text',
          is_ai: messageData.is_ai || false,
          image_url: messageData.image_url,
          extracted_text: messageData.extracted_text,
          nutrition: messageData.nutrition,
          ingredients: messageData.ingredients,
          health_score: messageData.health_score,
          health_advice: messageData.health_advice
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Upload image and get URL with validation
  static async uploadImage(imageFile: File): Promise<string> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.');
      }

      // Validate file size (5MB limit)
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Please upload images smaller than 5MB.');
      }

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('food-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Generate AI response for text messages
  static async generateAIResponse(userMessage: string, scanId: string, userId: string): Promise<ChatMessage> {
    try {
      // Get scan data for context
      const { data: scanData } = await supabase
        .from('food_scans')
        .select('*')
        .eq('id', scanId)
        .single();

      // Send request to backend for AI processing
      const response = await fetch(`${this.API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          scanData: scanData
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.statusText}`);
      }

      const aiResult = await response.json();

      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI processing failed');
      }

      // Save AI response to database
      const aiMessage = await this.saveMessage({
        scan_id: scanId,
        user_id: userId,
        message: aiResult.result,
        message_type: 'text',
        is_ai: true,
        health_score: scanData?.health_score,
        health_advice: scanData?.health_advice
      });

      return aiMessage;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }

  // Process image with AI analysis
  static async processImageWithAI(imageUrl: string, scanId: string, userId: string): Promise<ChatMessage> {
    try {
      // Send request to backend for AI image processing
      const response = await fetch(`${this.API_BASE_URL}/api/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Analyze this food image and provide detailed nutritional information, ingredients list, and health assessment.",
          imageUrl: imageUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.statusText}`);
      }

      const aiResult = await response.json();

      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI image processing failed');
      }

      // Save AI analysis response to database
      const aiMessage = await this.saveMessage({
        scan_id: scanId,
        user_id: userId,
        message: aiResult.result,
        message_type: 'analysis',
        is_ai: true,
        image_url: imageUrl,
        extracted_text: aiResult.analysis?.extracted_text,
        nutrition: aiResult.analysis?.nutrition,
        ingredients: aiResult.analysis?.ingredients,
        health_score: aiResult.analysis?.health_score,
        health_advice: aiResult.analysis?.health_advice
      });

      return aiMessage;
    } catch (error) {
      console.error('Error processing image with AI:', error);
      throw error;
    }
  }

  // Get chat history for a scan
  static async getChatHistory(scanId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('scan_id', scanId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  // Delete a message
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Save message (internal method)
  private static async saveMessage(message: Partial<MessageData>): Promise<ChatMessage> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }
}

export default ChatService;
