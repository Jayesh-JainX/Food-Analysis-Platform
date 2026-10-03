import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageDataURL: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        toast.error("Failed to access camera. Please check permissions.");
        onCancel();
      }
    };

    setupCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onCancel]);

  const handleCameraCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        try {
          const imageDataURL = canvas.toDataURL("image/png");
          onCapture(imageDataURL);

          // Stop camera stream
          const stream = video.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        } catch (error) {
          console.error("Error capturing image: ", error);
          toast.error("Failed to capture image.");
        }
      }
    }
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[75vh] bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        playsInline
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-10">
        <Button
          variant="default"
          size="lg"
          className="rounded-full wellness-gradient"
          onClick={handleCameraCapture}
        >
          <Camera className="h-6 w-6" />
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full"
          onClick={onCancel}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
