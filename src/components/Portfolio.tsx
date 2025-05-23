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
  
  // Empty portfolio projects - removed all videos
  const [projects, setProjects] = useState<Project[]>([]);

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

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding bg-black text-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header with Lemonlight-inspired styles */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Our Work</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Check out our portfolio of high-quality video productions across industries.
          </p>
          
          {/* Yellow CTA Button - Lemonlight style */}
          <div className="mt-8">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-10 py-6 rounded-full text-lg">
                  Upload Your Video
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Premium Video</DialogTitle>
                  <DialogDescription>
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
        
        {/* Large Featured Video Area - Lemonlight style */}
        {projects.length > 0 ? (
          <div className="mb-16">
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto shadow-2xl mb-12">
              <video 
                src={projects[0].videoUrl} 
                poster={projects[0].thumbnail}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black text-xs px-3 py-1 rounded-full flex items-center font-bold">
                <BadgeCheck className="w-3 h-3 mr-1" />
                FEATURED
              </div>
            </div>
            
            {/* Filter Buttons - Lemonlight style */}
            {projects.length > 0 && (
              <div className="flex flex-wrap justify-center mb-12 gap-4">
                {[
                  { id: 'all', label: 'All Work' },
                  { id: 'fashion', label: 'Fashion & Modeling' },
                  { id: 'fitness', label: 'Fitness & Training' },
                  { id: 'events', label: 'Events & Nightlife' },
                  { id: 'brand', label: 'Brand Collaborations' },
                  { id: 'uploads', label: 'Uploaded Videos' }
                ].map(category => {
                  return (
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
                  );
                })}
              </div>
            )}
            
            {/* Video Grid - Lemonlight style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProjects.slice(1).map((project) => (
                <div key={project.id} className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group">
                  <div className="aspect-video">
                    <video 
                      src={project.videoUrl} 
                      poster={project.thumbnail}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{project.title}</h3>
                      <p className="text-yellow-400 text-sm">{project.client}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Lemonlight-style CTA */}
            <div className="text-center">
              <p className="text-xl mb-6">Ready to create high-quality videos for your business?</p>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-10 py-6 rounded-full text-lg">
                Get Started
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-gray-900 rounded-lg mb-16 max-w-3xl mx-auto">
            <Video className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-medium text-white mb-4">No videos in portfolio yet</h3>
            <p className="text-gray-400 mt-2 mb-6">
              Upload your first premium quality video using the button above.
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full">
              Upload Your First Video
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
