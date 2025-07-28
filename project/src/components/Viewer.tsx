import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Maximize, Users, Clock } from 'lucide-react';

interface ViewerProps {
  streamId: string;
  onBack: () => void;
}

const Viewer: React.FC<ViewerProps> = ({ streamId, onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Simulate viewer count and duration updates
      const viewerInterval = setInterval(() => {
        setViewerCount(Math.floor(Math.random() * 50) + 1);
      }, 3000);
      
      const durationInterval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
      
      return () => {
        clearInterval(viewerInterval);
        clearInterval(durationInterval);
      };
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
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
          {isConnected && (
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
                <span className="text-sm">{formatDuration(streamDuration)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div className="relative flex-1">
        {connectionStatus === 'connecting' ? (
          <div className="h-[calc(100vh-200px)] bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg mb-2">Connecting to stream...</p>
              <p className="text-gray-400 text-sm">Stream ID: {streamId}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[calc(100vh-200px)] object-cover bg-gray-900"
              poster="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            />
            
            {/* Video overlay with demo content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm opacity-75">Live Stream Preview</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <div className="text-center mb-4">
              <p className="text-white text-sm mb-1">Watching Stream</p>
              <p className="text-blue-400 font-mono text-lg">{streamId}</p>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-600 text-white' 
                    : connectionStatus === 'connecting'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {connectionStatus === 'connected' ? 'Connected' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all duration-200 ${
                  !isMuted 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {!isMuted ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm mb-2">
              📱 Mobile-optimized live streaming experience
            </p>
            <p className="text-gray-500 text-xs">
              Enjoying high-quality video with automatic recording
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;