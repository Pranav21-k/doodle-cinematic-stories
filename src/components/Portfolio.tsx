import { useState, useEffect, useRef } from 'react';
import { Play, Video, Repeat } from 'lucide-react';
import VideoUploader from './VideoUploader';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Portfolio item type
type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  isUserUploaded?: boolean;
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUploader, setShowUploader] = useState(false);
  const [userVideos, setUserVideos] = useState<{file: File, url: string}[]>([]);
  const [isAdmin, setIsAdmin] = useState(true); // In a real app, you would check if the current user is an admin
  const [isAutoplay, setIsAutoplay] = useState(false);
  const carouselRef = useRef<any>(null);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Sample portfolio projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Brand Story Campaign",
      client: "TechVision",
      category: "commercial",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      videoUrl: "https://example.com/video1",
    },
    {
      id: 2,
      title: "Product Launch",
      client: "Innovate Sports",
      category: "brand",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      videoUrl: "https://example.com/video2",
    },
    {
      id: 3,
      title: "Corporate Overview",
      client: "Global Finance",
      category: "corporate",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      videoUrl: "https://example.com/video3",
    },
    {
      id: 4,
      title: "Social Media Campaign",
      client: "Fashion Forward",
      category: "social",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      videoUrl: "https://example.com/video4",
    },
    {
      id: 5,
      title: "App Promo Video",
      client: "FitnessPro",
      category: "brand",
      thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      videoUrl: "https://example.com/video5",
    },
    {
      id: 6,
      title: "Event Coverage",
      client: "Summit Conference",
      category: "corporate",
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      videoUrl: "https://example.com/video6",
    },
  ]);

  // Start or stop autoplay
  useEffect(() => {
    if (isAutoplay) {
      const interval = setInterval(() => {
        if (carouselRef.current && carouselRef.current.scrollNext) {
          carouselRef.current.scrollNext();
        }
      }, 5000); // Change slide every 5 seconds
      
      setAutoplayInterval(interval);
      return () => clearInterval(interval);
    } else if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  }, [isAutoplay]);

  const handleVideoUploaded = (file: File, previewUrl: string) => {
    const newVideo = { file, url: previewUrl };
    setUserVideos([...userVideos, newVideo]);
    
    // Add to projects
    const newProject = {
      id: Date.now(), // Use timestamp for unique ID
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      client: "Your Upload",
      category: "uploaded",
      thumbnail: previewUrl,
      videoUrl: previewUrl,
      isUserUploaded: true
    };
    
    setProjects([...projects, newProject]);
    setShowUploader(false);
  };

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  // Get only user uploaded videos for the carousel
  const userUploadedVideos = projects.filter(project => project.isUserUploaded);

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Our Portfolio</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Showcasing our best work and creative capabilities across industries.
          </p>
        </div>
        
        {/* Upload Button - Only visible to admins */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-doodle-purple hover:bg-purple-700 text-white flex items-center gap-2"
                >
                  <Video size={18} />
                  Upload Your Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl mb-4">Upload Your Video</DialogTitle>
                </DialogHeader>
                <VideoUploader onVideoUploaded={handleVideoUploaded} />
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {/* Video Carousel - Only shows if there are uploaded videos */}
        {userUploadedVideos.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Featured Videos</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="flex items-center gap-2"
              >
                <Repeat size={16} />
                {isAutoplay ? 'Stop Autoplay' : 'Start Autoplay'}
              </Button>
            </div>
            
            <Carousel
              className="w-full"
              ref={carouselRef}
            >
              <CarouselContent>
                {userUploadedVideos.map((project) => (
                  <CarouselItem key={`carousel-${project.id}`} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden rounded-lg">
                        <CardContent className="p-0 aspect-video">
                          <video
                            src={project.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            autoPlay={isAutoplay}
                            controls={!isAutoplay}
                          />
                        </CardContent>
                        <div className="p-4">
                          <h4 className="font-semibold">{project.title}</h4>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {userUploadedVideos.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>
        )}
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {['all', 'commercial', 'brand', 'corporate', 'social'].map(category => {
            const displayName = {
              'all': 'All Work',
              'commercial': 'Commercials',
              'brand': 'Brand Films',
              'corporate': 'Corporate',
              'social': 'Social Media'
            }[category];
            
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === category 
                    ? 'bg-doodle-purple text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {displayName}
              </button>
            );
          })}
          {userUploadedVideos.length > 0 && (
            <button
              onClick={() => setActiveFilter('uploaded')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeFilter === 'uploaded' 
                  ? 'bg-doodle-purple text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Your Uploads
            </button>
          )}
        </div>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group relative overflow-hidden rounded-lg aspect-video card-hover animate-zoom-in border-0 shadow-lg">
              {/* Project Thumbnail */}
              {project.isUserUploaded ? (
                <video
                  src={project.thumbnail}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseOut={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.pause();
                    video.currentTime = 0;
                  }}
                />
              ) : (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              
              {/* Overlay with information */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-xl font-bold">{project.title}</h3>
                <p className="text-white/70 text-sm mb-4">Client: {project.client}</p>
                
                {/* Play button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-12 h-12 rounded-full bg-doodle-purple text-white flex items-center justify-center">
                      <Play size={20} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{project.title}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video w-full">
                      {project.isUserUploaded ? (
                        <video 
                          src={project.videoUrl} 
                          controls 
                          className="w-full h-full object-contain"
                          autoPlay
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
                          <p>Video preview not available</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="btn-outline">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
