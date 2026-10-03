import { toast } from "sonner";

// Function to preprocess image before OCR
export async function preprocessImage(imageFile: File): Promise<string> {
  console.log('Starting image preprocessing...');
  
  // Create canvas and load image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  // Load image and process
  return new Promise((resolve, reject) => {
    console.log('Loading image into canvas...');
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Detect rotation angle using text orientation
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        reject(new Error('Failed to get temporary canvas context'));
        return;
      }
      
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);
      
      // Get image data for edge detection
      const tempData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
      
      // Simple edge detection for text orientation
      let angle = 0;
      const edges = [];
      for (let y = 0; y < tempCanvas.height; y += 10) {
        for (let x = 0; x < tempCanvas.width - 1; x++) {
          const idx = (y * tempCanvas.width + x) * 4;
          const nextIdx = (y * tempCanvas.width + x + 1) * 4;
          const diff = Math.abs(tempData[idx] - tempData[nextIdx]);
          if (diff > 50) edges.push({x, y});
        }
      }
      
      if (edges.length > 0) {
        // Calculate dominant line angle
        const lineSegments = [];
        for (let i = 0; i < edges.length - 1; i++) {
          const dx = edges[i + 1].x - edges[i].x;
          const dy = edges[i + 1].y - edges[i].y;
          if (Math.abs(dx) > 5) {
            lineSegments.push(Math.atan2(dy, dx));
          }
        }
        
        if (lineSegments.length > 0) {
          angle = lineSegments.reduce((a, b) => a + b) / lineSegments.length;
          angle = angle * (180 / Math.PI);
        }
      }
      
      // Apply rotation correction
      ctx.save();
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(angle * Math.PI / 180);
      ctx.translate(-canvas.width/2, -canvas.height/2);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      
      // Get image data for enhancement
      console.log('Getting image data for enhancement...');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Calculate histogram for adaptive thresholding
      console.log('Calculating histogram for adaptive thresholding...');
      const histogram = new Array(256).fill(0);
      for (let i = 0; i < data.length; i += 4) {
        const avg = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
        histogram[avg]++;
      }
      
      // Find optimal threshold using Otsu's method
      let threshold = 128;
      let maxVariance = 0;
      const totalPixels = data.length / 4;
      
      for (let t = 0; t < 256; t++) {
        const w1 = histogram.slice(0, t).reduce((a, b) => a + b, 0) / totalPixels;
        const w2 = histogram.slice(t).reduce((a, b) => a + b, 0) / totalPixels;
        
        if (w1 === 0 || w2 === 0) continue;
        
        const µ1 = histogram.slice(0, t).reduce((a, b, i) => a + i * b, 0) / (w1 * totalPixels);
        const µ2 = histogram.slice(t).reduce((a, b, i) => a + (i + t) * b, 0) / (w2 * totalPixels);
        
        const variance = w1 * w2 * Math.pow(µ1 - µ2, 2);
        
        if (variance > maxVariance) {
          maxVariance = variance;
          threshold = t;
        }
      }
      
      // Apply adaptive contrast enhancement
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const enhanced = avg > threshold ? 255 : 0;
        
        // Apply local contrast adjustment
        const contrast = 1.2;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        const adjustedValue = factor * (enhanced - 128) + 128;
        
        data[i] = adjustedValue;     // R
        data[i + 1] = adjustedValue; // G
        data[i + 2] = adjustedValue; // B
      }
      
      // Put processed image back
      console.log('Applying processed image data...');
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to base64 with higher quality
      console.log('Converting to base64 with high quality...');
      const base64Data = canvas.toDataURL('image/jpeg', 0.95);
      console.log('Image preprocessing completed successfully');
      resolve(base64Data);
    };
    
    img.onerror = () => reject(new Error('Failed to load image for preprocessing'));
    img.src = URL.createObjectURL(imageFile);
  });
}

// Function to validate image before processing
export async function validateImage(imageFile: File): Promise<void> {
  // Enhanced file validation
  const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
  const allowedTypes = ['jpg', 'jpeg', 'png'];
  
  if (!fileExt || !allowedTypes.includes(fileExt)) {
    throw new Error('Invalid file type. Please upload a JPG or PNG image for best results.');
  }
  
  if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File size too large. Please upload an image under 5MB.');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width < 400 || img.height < 400) {
        reject(new Error('Image dimensions too small. Please provide a larger, clearer image.'));
      }
      if (img.width > 4000 || img.height > 4000) {
        reject(new Error('Image dimensions too large. Please resize the image to a reasonable size.'));
      }
      resolve();
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Invalid image format. Please ensure the image is not corrupted.'));
    };
    
    img.src = objectUrl;
  });
}

// Function to detect inappropriate content in image
export async function isInappropriateContent(imageFile: File): Promise<boolean> {
  // Basic content moderation
  const suspiciousKeywords = ['nsfw', 'xxx', 'adult', 'inappropriate'];
  const fileName = imageFile.name.toLowerCase();
  return suspiciousKeywords.some(keyword => fileName.includes(keyword));
}