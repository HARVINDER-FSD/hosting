import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download, Trash2, Calendar, Clock, Video, Search, Filter } from 'lucide-react';

interface VideoGalleryProps {
  onBack: () => void;
}

interface SavedVideo {
  id: string;
  filename: string;
  url: string;
  timestamp: string;
  duration: number;
  streamId: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ onBack }) => {
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'name'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    loadSavedVideos();
  }, []);

  const loadSavedVideos = () => {
    const videos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
    setSavedVideos(videos);
  };

  const deleteVideo = (videoId: string) => {
    const updatedVideos = savedVideos.filter(video => video.id !== videoId);
    setSavedVideos(updatedVideos);
    localStorage.setItem('savedVideos', JSON.stringify(updatedVideos));
    if (selectedVideo?.id === videoId) {
      setSelectedVideo(null);
    }
  };

  const downloadVideo = (video: SavedVideo) => {
    const a = document.createElement('a');
    a.href = video.url;
    a.download = video.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredAndSortedVideos = savedVideos
    .filter(video => {
      const matchesSearch = video.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.streamId.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      const videoDate = new Date(video.timestamp);
      const now = new Date();
      
      switch (filterBy) {
        case 'today':
          return videoDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return videoDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return videoDate >= monthAgo;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'name':
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-semibold">Video Gallery</h1>
              <p className="text-gray-400 text-sm">{savedVideos.length} saved recordings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Video List */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="duration">Sort by Duration</option>
                <option value="name">Sort by Name</option>
              </select>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Videos</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Video List */}
          <div className="p-4 space-y-3">
            {filteredAndSortedVideos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No videos found</p>
                <p className="text-gray-500 text-sm">Start streaming to create recordings</p>
              </div>
            ) : (
              filteredAndSortedVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`bg-gray-700 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-gray-600 ${
                    selectedVideo?.id === video.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium text-sm truncate flex-1">
                      {video.filename.replace('.webm', '')}
                    </h3>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadVideo(video);
                        }}
                        className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVideo(video.id);
                        }}
                        className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(video.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                      ID: {video.streamId}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black relative">
          {selectedVideo ? (
            <div className="h-full flex flex-col">
              <video
                key={selectedVideo.id}
                controls
                className="flex-1 w-full h-full object-contain"
                src={selectedVideo.url}
              />
              
              {/* Video Info Overlay */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-white font-medium mb-1">
                  {selectedVideo.filename.replace('.webm', '')}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(selectedVideo.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(selectedVideo.duration)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                    Stream ID: {selectedVideo.streamId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => downloadVideo(selectedVideo)}
                  className="p-3 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white rounded-lg transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteVideo(selectedVideo.id)}
                  className="p-3 bg-red-600/60 backdrop-blur-sm hover:bg-red-600/80 text-white rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Video</h3>
                <p className="text-gray-400">Choose a video from the list to play it here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;