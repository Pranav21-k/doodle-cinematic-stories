
import { useState, useEffect, useRef } from 'react';
import { Play, Video, Upload, BadgeCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import VideoUploader from "@/components/VideoUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

// Portfolio item type
type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const carouselRef = useRef<any>(null);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(true); // Default to autoplay on
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Sample portfolio projects with videos that match the Lemonlight style
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Sprouts Market Campaign",
      client: "Retail Brand Story",
      category: "brand",
      thumbnail: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4"
    },
    {
      id: 2,
      title: "Fitness Challenge Series",
      client: "Active Lifestyle",
      category: "fitness",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-at-sunset-38777-large.mp4"
    },
    {
      id: 3,
      title: "Downtown Fashion Show",
      client: "Seasonal Collection",
      category: "fashion",
      thumbnail: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-fashion-clothes-in-a-urban-environment-40239-large.mp4"
    },
    {
      id: 4,
      title: "Annual Music Festival",
      client: "Entertainment Showcase",
      category: "events",
      thumbnail: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-excited-crowd-partying-at-a-music-festival-18285-large.mp4"
    },
  ]);

  // Handler for new video uploads
  const handleVideoUploaded = (file: File, previewUrl: string) => {
    // Create a new project with the uploaded video
    const newProject: Project = {
      id: projects.length + 1,
      title: "New Upload: " + file.name.split('.')[0],
      client: "Premium Quality Video",
      category: "uploads",
      thumbnail: previewUrl,
      videoUrl: previewUrl
    };
    
    // Add the new project to the list
    setProjects(prev => [newProject, ...prev]);
    toast.success("High quality video added to portfolio!");
    setIsUploadDialogOpen(false);
  };

  // Get videos for the carousel
  const showcaseVideos = projects;

  // Start or stop autoplay
  useEffect(() => {
    if (isAutoplay && showcaseVideos.length > 1) {
      const interval = setInterval(() => {
        setActiveVideoIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % showcaseVideos.length;
          return nextIndex;
        });
      }, 8000); // Change video every 8 seconds
      
      setAutoplayInterval(interval);
      return () => clearInterval(interval);
    } else if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  }, [isAutoplay, showcaseVideos.length]);

  // Toggle video playback
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding bg-black text-white py-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header with Lemonlight-inspired styles */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Our Work</h2>
          <p className="section-subtitle max-w-2xl mx-auto text-gray-300">
            Check out our portfolio of high-quality video productions across industries.
          </p>
        </div>
        
        {projects.length > 0 ? (
          <div className="mb-16">
            {/* Hero featured video with overlay play effect */}
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-5xl mx-auto shadow-2xl mb-16">
              <video 
                ref={videoRef}
                src={projects[0].videoUrl} 
                poster={projects[0].thumbnail}
                className="w-full h-full object-cover"
                preload="metadata"
                onClick={toggleVideoPlay}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
              
              {/* Play button overlay */}
              <div 
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
                onClick={toggleVideoPlay}
              >
                <div className="bg-yellow-400 rounded-full p-6 cursor-pointer hover:bg-yellow-300 transition-all transform hover:scale-110">
                  <Play className="h-12 w-12 text-black" />
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black text-xs px-3 py-1 rounded-full flex items-center font-bold">
                <BadgeCheck className="w-3 h-3 mr-1" />
                FEATURED
              </div>
            </div>
            
            {/* Video Grid with hover effects - Lemonlight style */}
            <div className="mb-12">
              {/* Filter Buttons - Lemonlight style */}
              <div className="flex flex-wrap justify-center mb-12 gap-4">
                {[
                  { id: 'all', label: 'All Work' },
                  { id: 'brand', label: 'Brand Stories' },
                  { id: 'fashion', label: 'Fashion & Modeling' },
                  { id: 'fitness', label: 'Fitness & Training' },
                  { id: 'events', label: 'Events & Entertainment' },
                  { id: 'uploads', label: 'Your Uploads' }
                ].map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                      activeFilter === category.id 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              
              {/* Video Carousel - Horizontal scrolling with snap */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredProjects.slice(0, 6).map((project) => (
                  <HoverCard key={project.id}>
                    <HoverCardTrigger asChild>
                      <div className="relative group rounded-lg overflow-hidden shadow-lg aspect-video cursor-pointer">
                        <video 
                          src={project.videoUrl} 
                          poster={project.thumbnail}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-yellow-400 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <Play className="h-6 w-6 text-black" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="font-bold text-lg">{project.title}</h3>
                          <p className="text-yellow-400 text-sm">{project.client}</p>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-black border border-gray-700 text-white">
                      <h4 className="font-bold">{project.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">{project.client}</p>
                      <p className="text-xs text-gray-400">Click to view this premium quality video in full screen mode.</p>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
            
            {/* Yellow CTA Button - Centered Lemonlight style */}
            <div className="flex justify-center mt-12">
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-10 py-6 rounded-full text-lg">
                    <Upload className="w-5 h-5 mr-2" /> Upload Your Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Upload Premium Video</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Upload your video in its original quality. No compression, no quality loss, no file size limits.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <VideoUploader 
                      onVideoUploaded={handleVideoUploaded} 
                      buttonText="Select Premium Video File"
                      showPreview={true}
                      highQuality={true}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-gray-900 rounded-lg mb-16 max-w-3xl mx-auto">
            <Video className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-medium text-white mb-4">No videos in portfolio yet</h3>
            <p className="text-gray-400 mt-2 mb-6">
              Upload your first premium quality video using the button below.
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full">
              <Upload className="w-5 h-5 mr-2" /> Upload Your First Video
            </Button>
          </div>
        )}
        
        {/* Custom styling remains the same */}
        <style>
          {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          `}
        </style>
      </div>
    </section>
  );
};

export default Portfolio;
