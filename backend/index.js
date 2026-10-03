const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mime = require("mime-types");
const axios = require("axios");
const { InferenceClient } = require("@huggingface/inference");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// === Hugging Face SDK Config ===
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "meta-llama/Llama-4-Scout-17B-16E-Instruct";
const HF_PROVIDER = "novita";

const client = new InferenceClient(HF_API_KEY);

// === CORS Configuration ===
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// === Multer Memory Storage (Vercel Compatible) ===
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// === Helper function to download image from URL ===
const downloadImageFromUrl = async (imageUrl) => {
  try {
    console.log(`📥 Downloading image from URL: ${imageUrl}`);

    const response = await axios({
      method: "GET",
      url: imageUrl,
      responseType: "arraybuffer",
      timeout: 30000, // 30 second timeout
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const buffer = Buffer.from(response.data);
    const contentType = response.headers["content-type"];

    // Validate it's an image
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("URL does not point to a valid image");
    }

    console.log(
      `✅ Successfully downloaded image, size: ${buffer.length} bytes`
    );

    return {
      buffer: buffer,
      mimetype: contentType,
    };
  } catch (error) {
    console.error("Error downloading image from URL:", error.message);
    throw new Error(`Failed to download image: ${error.message}`);
  }
};

// === API: Chat endpoint for text-based queries ===
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, scanData } = req.body;

    console.log(
      `💬 Processing chat request with prompt: ${prompt?.substring(0, 100)}...`
    );

    // Validate input
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Create enhanced prompt with scan data context - optimized for shorter responses
    const enhancedPrompt = scanData
      ? `You are a nutrition expert AI assistant. Based on the food scan data and user question, provide a brief, helpful response in 2-3 sentences maximum.

Food Scan Data:
${JSON.stringify(scanData, null, 2)}

User Question: ${prompt}

Provide a concise, accurate response focusing on the most important nutritional information. Keep it conversational and under 150 words.`
      : `You are a nutrition expert AI assistant. Answer this question about food, nutrition, or health in 2-3 sentences maximum:

${prompt}

Provide a brief, helpful, and accurate response under 150 words.`;

    console.log(`🤖 Sending chat request to AI model`);

    // Prepare chat request with reduced token limit for shorter responses
    const chatCompletion = await client.chatCompletion({
      provider: HF_PROVIDER,
      model: HF_MODEL,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: enhancedPrompt }],
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
    });

    console.log(`✅ Chat processing completed successfully`);

    // Extract the content from the AI response
    const aiContent = chatCompletion.choices[0].message.content;

    // Truncate response if it's still too long
    const truncatedContent =
      aiContent.length > 500 ? aiContent.substring(0, 500) + "..." : aiContent;

    // Send response with the extracted content
    res.json({
      success: true,
      result: truncatedContent,
      response: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error("❌ Chat processing failed:", error);

    // Send error response
    res.status(500).json({
      success: false,
      error:
        error.message || "Unexpected error occurred during chat processing.",
    });
  }
});

// === API: Process image and return chat completion ===
app.post("/api/process", upload.single("image"), async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.text;
    const imageUrl = req.body.imageUrl;

    console.log(
      `🔍 Processing request - Has file: ${!!req.file}, Has URL: ${!!imageUrl}`
    );

    // Validate input
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    if (!req.file && !imageUrl) {
      return res.status(400).json({
        error: "Either image file or imageUrl is required.",
      });
    }

    let imageBuffer;
    let mimeType;

    // Handle image from URL
    if (imageUrl && !req.file) {
      try {
        const downloadedImage = await downloadImageFromUrl(imageUrl);
        imageBuffer = downloadedImage.buffer;
        mimeType = downloadedImage.mimetype;
      } catch (downloadError) {
        console.error("Download error:", downloadError.message);
        return res.status(400).json({
          error: `Failed to process image URL: ${downloadError.message}`,
        });
      }
    }
    // Handle uploaded file
    else if (req.file) {
      console.log(`📁 Processing uploaded file: ${req.file.originalname}`);
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    }

    // Validate image type
    if (!mimeType || !mimeType.startsWith("image/")) {
      return res.status(400).json({ error: "Invalid image file type." });
    }

    // Convert image to base64
    const base64Image = imageBuffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    console.log(
      `🤖 Sending request to AI model with image size: ${imageBuffer.length} bytes`
    );

    // Enhanced prompt for better structured analysis
    const enhancedImagePrompt = `${prompt}

Please provide a structured analysis with:
1. Brief description of the food item
2. Key nutritional highlights
3. Health assessment (1-2 sentences)
4. Any notable ingredients or concerns

Keep the response concise and informative.`;

    // Prepare chat request
    const chatCompletion = await client.chatCompletion({
      provider: HF_PROVIDER,
      model: HF_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: enhancedImagePrompt },
            { type: "image_url", image_url: { url: dataUri } },
          ],
        },
      ],
      max_tokens: 1000, // Reduced from 5000 to 1000 for more focused responses
      temperature: 0.1,
    });

    console.log(`✅ AI processing completed successfully`);

    // Extract the content from the AI response
    const aiContent = chatCompletion.choices[0].message.content;

    // Mock structured analysis data (you can enhance this with actual AI parsing)
    const mockAnalysis = {
      extracted_text:
        "Nutrition Facts: Calories 250, Protein 12g, Carbs 30g, Fat 8g, Sodium 450mg",
      nutrition: {
        calories: 250,
        protein: 12,
        carbs: 30,
        fat: 8,
        sodium: 450,
        fiber: 3,
        sugar: 6,
      },
      ingredients: [
        "wheat flour",
        "vegetable oil",
        "salt",
        "sugar",
        "preservatives",
      ],
      health_score: 65,
      health_advice:
        "Moderate nutritional value. Consider portion control due to sodium content.",
    };

    // Send response with the extracted content
    res.json({
      success: true,
      result: aiContent,
      analysis: mockAnalysis,
      response: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error("❌ Processing failed:", error);

    // Send error response
    res.status(500).json({
      success: false,
      error: error.message || "Unexpected error occurred during processing.",
    });
  }
});

// === Health check endpoint ===
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// === Root endpoint ===
app.get("/", (req, res) => {
  res.json({
    message: "Food Analysis API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      process: "/api/process",
      chat: "/api/chat",
    },
  });
});

// === Error handling middleware ===
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// === Export for Vercel ===
module.exports = app;

// === Start server (for local development) ===
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📦 Running in ${process.env.NODE_ENV || "development"} mode`);
  });
}
