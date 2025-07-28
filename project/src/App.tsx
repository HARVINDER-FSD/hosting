import React, { useState } from 'react';
import { useEffect } from 'react';
import Broadcaster from './components/Broadcaster';
import Viewer from './components/Viewer';
import VideoGallery from './components/VideoGallery';
import QRScanner from './components/QRScanner';
import { Video, Eye, Archive, Smartphone, QrCode } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<'select' | 'broadcast' | 'view' | 'gallery' | 'qr-scan'>('select');
  const [streamId, setStreamId] = useState<string>('');

  useEffect(() => {
    // Check URL parameters for direct stream joining
    const urlParams = new URLSearchParams(window.location.search);
    const urlStreamId = urlParams.get('streamId');
    const urlMode = urlParams.get('mode');
    
    if (urlStreamId && urlMode === 'view') {
      setStreamId(urlStreamId);
      setMode('view');
    }
  }, []);

  const generateStreamId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const startBroadcast = () => {
    const id = generateStreamId();
    setStreamId(id);
    setMode('broadcast');
  };

  const joinStream = () => {
    if (streamId.trim()) {
      setMode('view');
    }
  };

  const goBack = () => {
    setMode('select');
    setStreamId('');
  };

  if (mode === 'broadcast') {
    return <Broadcaster streamId={streamId} onBack={goBack} />;
  }

  if (mode === 'view') {
    return <Viewer streamId={streamId} onBack={goBack} />;
  }

  if (mode === 'gallery') {
    return <VideoGallery onBack={goBack} />;
  }

  if (mode === 'gallery') {
    return <VideoGallery onBack={goBack} />;
  }

  if (mode === 'qr-scan') {
    return (
      <QRScanner 
        onBack={goBack} 
        onStreamIdFound={(id) => {
          setStreamId(id);
          setMode('view');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Mobile Live Stream</h1>
            <p className="text-white/70">Stream live video with auto-save recording</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="space-y-4">
              <button
                onClick={startBroadcast}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Video className="w-5 h-5" />
                <span>📱 Start Mobile Stream + Record</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-white/60">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Stream ID"
                  value={streamId}
                  onChange={(e) => setStreamId(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                />
                <button
                  onClick={joinStream}
                  disabled={!streamId.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  <Eye className="w-5 h-5" />
                  <span>Join Stream</span>
                </button>
                
                <button
                  onClick={() => setMode('gallery')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Archive className="w-5 h-5" />
                  <span>Video Gallery</span>
                </button>
                
                <button
                  onClick={() => setMode('qr-scan')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <QrCode className="w-5 h-5" />
                  <span>📱 Scan QR Code</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-white/50 text-sm mb-2">
              📱 QR Code connection for easy mobile streaming
            </p>
            <p className="text-white/40 text-xs">
              Generate QR codes to instantly connect viewers to your stream
            </p>
          </div>

          <div className="text-center mt-4">
            <p className="text-white/50 text-sm">
              📲 Scan QR code or share Stream ID to join live streams instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;