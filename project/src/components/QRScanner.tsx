import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, QrCode, Flashlight, FlashlightOff } from 'lucide-react';

interface QRScannerProps {
  onBack: () => void;
  onStreamIdFound: (streamId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onBack, onStreamIdFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [error, setError] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check if flash is available
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      setHasFlash('torch' in capabilities);

      setIsScanning(true);
      
      // Start QR code detection
      scanIntervalRef.current = setInterval(scanForQRCode, 500);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    
    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      await videoTrack.applyConstraints({
        advanced: [{ torch: !flashEnabled }]
      });
      setFlashEnabled(!flashEnabled);
    } catch (error) {
      console.error('Error toggling flash:', error);
    }
  };

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple QR code detection simulation
    // In a real implementation, you would use a QR code library like jsQR
    const mockQRDetection = () => {
      // This is a simplified mock - in reality you'd use jsQR or similar
      const data = imageData.data;
      let darkPixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness < 128) darkPixels++;
      }
      
      // Mock QR code pattern detection
      if (darkPixels > data.length / 16 && darkPixels < data.length / 4) {
        // Simulate finding a stream URL
        const mockUrl = `${window.location.origin}?streamId=demo123&mode=view`;
        const urlParams = new URLSearchParams(mockUrl.split('?')[1]);
        const streamId = urlParams.get('streamId');
        
        if (streamId) {
          stopScanning();
          onStreamIdFound(streamId);
        }
      }
    };

    mockQRDetection();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          {hasFlash && isScanning && (
            <button
              onClick={toggleFlash}
              className={`p-2 rounded-lg transition-colors ${
                flashEnabled 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {flashEnabled ? <FlashlightOff className="w-5 h-5" /> : <Flashlight className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Scanner Container */}
      <div className="relative flex-1">
        {isScanning ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[calc(100vh-200px)] object-cover"
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  
                  {/* Scanning line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                </div>
                
                <p className="text-white text-center mt-4">
                  Position QR code within the frame
                </p>
              </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)] bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">QR Code Scanner</h3>
              <p className="text-gray-400 mb-6">Scan QR codes to join live streams instantly</p>
              
              {error && (
                <div className="bg-red-600/20 border border-red-600 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={startScanning}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                <span>Start Scanning</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-900 p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">How to use QR Scanner</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>1. Tap "Start Scanning" to activate camera</p>
              <p>2. Point camera at QR code from broadcaster</p>
              <p>3. Wait for automatic detection</p>
              <p>4. Join the live stream instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;