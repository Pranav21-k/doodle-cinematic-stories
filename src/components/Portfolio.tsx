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
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Our Portfolio</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Showcasing our highest quality work and creative capabilities across industries.
          </p>
          
          {/* Premium Quality Badge */}
          <div className="flex items-center justify-center mt-2 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <BadgeCheck className="w-4 h-4 mr-1" />
              Premium Quality Video Uploads
            </span>
          </div>
          
          {/* Upload Video Button - Now available for all users */}
          <div className="mt-6">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-doodle-purple hover:bg-doodle-purple/90">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload High-Quality Video
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
        
        {/* Empty state message when there are no videos */}
        {projects.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-lg mb-16">
            <Video className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No videos in portfolio</h3>
            <p className="text-gray-600 mt-2">
              Upload premium quality videos using the Upload button above.
            </p>
          </div>
        ) : (
          <>
            {/* Filter Buttons - only show if there are videos */}
            <div className="flex flex-wrap justify-center mb-12 gap-2">
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
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      activeFilter === category.id 
                        ? 'bg-doodle-purple text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
            
            {/* Video Grid when we have videos - restored to previous styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProjects.map((project) => (
                <div key={project.id} className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                  <video 
                    src={project.videoUrl} 
                    poster={project.thumbnail}
                    className="w-full h-64 object-cover"
                    controls
                    preload="metadata"
                  />
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    Full HD
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-medium text-lg">{project.title}</h3>
                    <p className="text-gray-600 text-sm">{project.client}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
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
