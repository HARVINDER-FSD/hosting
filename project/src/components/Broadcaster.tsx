import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Users, Download, Clock, QrCode, Share2 } from 'lucide-react';
import QRCode from 'qrcode';

interface BroadcasterProps {
  streamId: string;
  onBack: () => void;
}

const Broadcaster: React.FC<BroadcasterProps> = ({ streamId, onBack }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    generateQRCode();
    return () => {
      stopStreaming();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const generateQRCode = async () => {
    try {
      const viewerUrl = `${window.location.origin}?streamId=${streamId}&mode=view`;
      const qrDataUrl = await QRCode.toDataURL(viewerUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const startStreaming = () => {
    if (!streamRef.current) return;
    
    setIsStreaming(true);
    setIsRecording(true);
    setRecordingDuration(0);
    
    // Start recording
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        saveRecording();
      };
      
      mediaRecorder.start(1000); // Record in 1-second chunks
      
      // Start duration timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Simulate viewer count changes
      const viewerInterval = setInterval(() => {
        setViewerCount(Math.floor(Math.random() * 50) + 1);
      }, 3000);
      
      setTimeout(() => clearInterval(viewerInterval), 30000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    setIsRecording(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const saveRecording = () => {
    if (recordedChunksRef.current.length === 0) return;
    
    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    a.href = url;
    a.download = `stream-${streamId}-${timestamp}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Save to localStorage for gallery
    const recordings = JSON.parse(localStorage.getItem('streamRecordings') || '[]');
    recordings.push({
      id: Date.now(),
      streamId,
      filename: `stream-${streamId}-${timestamp}.webm`,
      date: new Date().toISOString(),
      duration: recordingDuration,
      url: url
    });
    localStorage.setItem('streamRecordings', JSON.stringify(recordings));
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const shareStream = async () => {
    const viewerUrl = `${window.location.origin}?streamId=${streamId}&mode=view`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Live Stream',
          text: `Watch my live stream using Stream ID: ${streamId}`,
          url: viewerUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(viewerUrl);
        alert('Stream link copied to clipboard!');
      } catch (error) {
        alert(`Share this link: ${viewerUrl}`);
      }
    }
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
          {isStreaming && (
            <>
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
              <div className="flex items-center space-x-1 text-white">
                <Users className="w-4 h-4" />
                <span className="text-sm">{viewerCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-white">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatDuration(recordingDuration)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-[calc(100vh-200px)] object-cover bg-gray-900"
        />
        
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Camera is off</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <div className="text-center mb-4">
              <p className="text-white text-sm mb-1">Stream ID</p>
              <p className="text-blue-400 font-mono text-lg">{streamId}</p>
              <div className="flex items-center justify-center space-x-2 mt-3">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                </button>
                <button
                  onClick={shareStream}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
              
              {showQR && qrCodeUrl && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-2" />
                  <p className="text-gray-600 text-xs">Scan to join stream</p>
                </div>
              )}
              
              <p className="text-gray-400 text-xs mt-2">
                📱 Scan QR code or share link with viewers
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 ${
                isVideoEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
          </div>

          <div className="space-y-3">
            {!isStreaming ? (
              <button
                onClick={startStreaming}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Video className="w-5 h-5" />
                <span>Start Live Stream + Record</span>
              </button>
            ) : (
              <button
                onClick={stopStreaming}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Download className="w-5 h-5" />
                <span>Stop Stream & Save Recording</span>
              </button>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm mb-2">
              📱 Optimized for mobile devices with auto-recording
            </p>
            <p className="text-gray-500 text-xs">
              All streams are automatically saved when you stop broadcasting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcaster;