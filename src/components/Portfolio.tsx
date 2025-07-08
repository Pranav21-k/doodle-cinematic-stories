
import React, { useState, useEffect, useRef } from 'react';
import { Play, Video, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Portfolio item type
type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  featured?: boolean;
};

// Simple video component with better error handling
const VideoPlayer: React.FC<{
  videoUrl: string;
  thumbnail: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}> = ({ videoUrl, thumbnail, title, className = "", autoPlay = false, muted = true, loop = false, controls = false }) => {
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

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'fashion', name: 'Fashion & Modeling' },
    { id: 'fitness', name: 'Fitness & Training' },
    { id: 'events', name: 'Events & Nightlife' },
    { id: 'brand', name: 'Brand Collaborations' }
  ];

  // Load videos from localStorage
  useEffect(() => {
    try {
      const savedVideos = localStorage.getItem('portfolio_videos');
      if (savedVideos) {
        const parsedVideos = JSON.parse(savedVideos);
        if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
          setProjects(parsedVideos);
        }
      }
    } catch (error) {
      console.error('Error loading videos from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get featured videos for showcase
  const showcaseVideos = projects.filter(p => p.featured).slice(0, 4);
  const displayVideos = showcaseVideos.length > 0 ? showcaseVideos : projects.slice(0, 4);

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  if (isLoading) {
    return (
      <section id="portfolio" className="section-padding bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-2xl font-medium mb-4 text-gray-600">Loading Videos...</h3>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of cinematic videos across different categories.
          </p>
        </div>

        {/* Featured Video Showcase */}
        {displayVideos.length > 0 && (
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
        )}

        {/* Category Tabs and Grid */}
        {projects.length > 0 && (
          <Tabs defaultValue="all" onValueChange={setActiveFilter}>
            <TabsList className="w-full flex justify-center mb-8 bg-transparent">
              {categories.map((cat) => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="px-6 py-2 rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="group relative overflow-hidden rounded-lg aspect-video hover:shadow-xl transition-shadow duration-300">
                      <VideoPlayer
                        videoUrl={project.videoUrl}
                        thumbnail={project.thumbnail}
                        title={project.title}
                        autoPlay={true}
                        muted={true}
                        loop={true}
                      />
                      
                      {/* Overlay with information */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-xl font-bold">{project.title}</h3>
                        <p className="text-white/70 text-sm mb-4">Client: {project.client}</p>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-fit bg-purple-600 hover:bg-purple-700">
                              <Play size={16} className="mr-2" />
                              Watch Full Video
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{project.title}</DialogTitle>
                              <DialogDescription>Client: {project.client}</DialogDescription>
                            </DialogHeader>
                            <div className="aspect-video w-full">
                              <VideoPlayer
                                videoUrl={project.videoUrl}
                                thumbnail={project.thumbnail}
                                title={project.title}
                                controls={true}
                                autoPlay={true}
                                muted={false}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      {/* Featured badge */}
                      {project.featured && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Empty state */}
        {projects.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-gray-600">No videos found</h3>
            <p className="text-gray-500">Videos will appear here once they're loaded.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
