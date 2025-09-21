import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  featured?: boolean;
};

type VideoShowcaseProps = {
  projects: Project[];
};

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ projects }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Get featured videos for showcase
  const showcaseVideos = projects.filter(p => p.featured).slice(0, 4);
  const displayVideos = showcaseVideos.length > 0 ? showcaseVideos : projects.slice(0, 4);

  if (displayVideos.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl">
        <VideoPlayer
          videoUrl={displayVideos[activeVideoIndex]?.videoUrl || ''}
          thumbnail={displayVideos[activeVideoIndex]?.thumbnail || ''}
          title={displayVideos[activeVideoIndex]?.title || ''}
          autoPlay={true}
          muted={true}
          loop={true}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="backdrop-blur-sm bg-black/30 rounded-xl p-6">
              <h3 className="text-white text-3xl font-bold mb-2">
                {displayVideos[activeVideoIndex]?.title}
              </h3>
              <p className="text-purple-200 text-lg">
                {displayVideos[activeVideoIndex]?.client}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thumbnail Navigation */}
      <div className="flex space-x-4 justify-center">
        {displayVideos.map((video, index) => (
          <div 
            key={video.id}
            className={`w-24 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
              index === activeVideoIndex ? 'ring-4 ring-purple-500 scale-110' : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => setActiveVideoIndex(index)}
          >
            <VideoPlayer
              videoUrl={video.videoUrl}
              thumbnail={video.thumbnail}
              title={video.title}
              autoPlay={true}
              muted={true}
              loop={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoShowcase;