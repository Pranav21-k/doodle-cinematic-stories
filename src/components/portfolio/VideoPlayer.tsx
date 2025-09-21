import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

type VideoPlayerProps = {
  videoUrl: string;
  thumbnail: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  className = "", 
  autoPlay = false, 
  muted = true, 
  loop = false, 
  controls = false 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && !hasError) {
      const video = videoRef.current;
      video.load();
    }
  }, [videoUrl, hasError]);

  const handleVideoError = () => {
    setHasError(true);
    console.log(`Video failed to load: ${videoUrl}`);
  };

  const handleVideoLoaded = () => {
    setIsLoaded(true);
    setHasError(false);
    console.log(`Video loaded successfully: ${videoUrl}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80';
  };

  if (hasError) {
    return (
      <div className="relative w-full h-full group bg-gray-100">
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover ${className}`}
          onError={handleImageError}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={videoUrl}
        className={`w-full h-full object-cover ${className}`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        preload="metadata"
        poster={thumbnail}
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onError={handleVideoError}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;