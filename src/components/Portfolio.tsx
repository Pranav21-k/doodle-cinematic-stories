
import { useState, useEffect, useRef } from 'react';
import { Play, Video, LockIcon } from 'lucide-react';
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
  videoUrl?: string;
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const carouselRef = useRef<any>(null);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(true); // Default to autoplay on
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [previewLimit, setPreviewLimit] = useState(4); // Limit of videos to show in preview
  
  // In a real application, this would be stored securely on the server
  // This is just for demonstration purposes
  const ADMIN_PASSWORD = "admin123"; 
  
  // Updated categories based on user's request
  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'fashion', name: 'Fashion & Modeling' },
    { id: 'fitness', name: 'Fitness & Training' },
    { id: 'events', name: 'Events & Nightlife' },
    { id: 'brand', name: 'Brand Collaborations' }
  ];
  
  // Updated to only include user uploads - no default videos
  const [projects, setProjects] = useState<Project[]>([]);

  // Handler for new video uploads
  const handleVideoUploaded = (file: File, previewUrl: string) => {
    // Create a new project with the uploaded video
    const newProject: Project = {
      id: projects.length + 1,
      title: "New Upload: " + file.name.split('.')[0],
      client: "Your Project",
      category: "fashion", // Default category for new uploads
      thumbnail: previewUrl,
      videoUrl: previewUrl
    };
    
    // Add the new project to the list
    setProjects(prev => [newProject, ...prev]);
    toast.success("Video uploaded successfully!");
    setIsUploadDialogOpen(false);
  };

  // Get videos for the carousel, limited to previewLimit
  const showcaseVideos = projects.slice(0, previewLimit);

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

  // Handle admin login attempt
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsAdminLoginOpen(false);
      toast.success("Admin access granted!");
    } else {
      toast.error("Incorrect password");
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword("");
    toast.info("Logged out of admin mode");
  };

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Your Videos</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Upload and showcase your videos. You can upload new videos using the button below.
          </p>
          
          {/* Upload Video Button - Available to all users */}
          <div className="mt-6">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-doodle-purple hover:bg-doodle-purple/90">
                  <Video className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Video</DialogTitle>
                  <DialogDescription>
                    Upload your video to add it to your portfolio
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <VideoUploader 
                    onVideoUploaded={handleVideoUploaded} 
                    buttonText="Select Video File"
                    showPreview={true}
                    adminOnly={false} // Set to false so all users can upload
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Immersive Video Carousel - Enhanced Style */}
        {showcaseVideos.length > 0 ? (
          <div className="mb-16 relative">
            {/* Preview Limit Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Showing {Math.min(showcaseVideos.length, previewLimit)} of {projects.length} videos
                </span>
              </div>
              
              {/* Autoplay Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="flex items-center gap-2 z-10"
              >
                <Video size={16} />
                {isAutoplay ? 'Stop Rotation' : 'Start Rotation'}
              </Button>
            </div>
            
            {/* Main Feature Video */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-xl">
              {showcaseVideos[activeVideoIndex] && (
                <video
                  key={`feature-${activeVideoIndex}`}
                  src={showcaseVideos[activeVideoIndex]?.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end">
                <div className="p-6">
                  <h3 className="text-white text-2xl font-bold">
                    {showcaseVideos[activeVideoIndex]?.title}
                  </h3>
                  <p className="text-white/80">
                    {showcaseVideos[activeVideoIndex]?.client}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Horizontally Scrolling Video Thumbnails - Limited by previewLimit */}
            <div className="relative -mt-4 z-10 overflow-x-auto pb-8 no-scrollbar">
              <div className="flex space-x-6 px-4">
                {showcaseVideos.map((video, index) => (
                  <div 
                    key={`thumb-${video.id}`}
                    className={`flex-shrink-0 w-60 h-40 rounded-lg overflow-hidden cursor-pointer 
                      shadow-lg transition-all duration-500 ease-out transform
                      ${index === activeVideoIndex 
                        ? 'ring-4 ring-doodle-purple scale-110 z-10' 
                        : 'opacity-70 hover:opacity-90'
                      }
                      ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'}
                      ${index === activeVideoIndex - 1 || index === activeVideoIndex + 1 
                        ? 'translate-y-3' 
                        : index === activeVideoIndex - 2 || index === activeVideoIndex + 2
                          ? 'translate-y-4' 
                          : 'translate-y-0'
                      }
                    `}
                    onClick={() => {
                      setActiveVideoIndex(index);
                    }}
                    style={{
                      transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <video 
                      src={video.videoUrl} 
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay={index === activeVideoIndex}
                      onLoadedMetadata={(e) => {
                        if (index !== activeVideoIndex) {
                          (e.target as HTMLVideoElement).pause();
                        } else {
                          (e.target as HTMLVideoElement).play();
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 flex items-end">
                      <div className="p-3">
                        <p className="text-white text-sm font-bold truncate">{video.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl mb-12">
            <Video className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No videos yet</h3>
            <p className="text-gray-500 mb-6">Upload your first video to get started</p>
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="bg-doodle-purple hover:bg-doodle-purple/90"
            >
              Upload Now
            </Button>
          </div>
        )}
        
        {/* Updated Category Tabs */}
        {projects.length > 0 && (
          <div className="mb-12">
            <Tabs defaultValue="all" onValueChange={setActiveFilter}>
              <TabsList className="w-full flex justify-center flex-wrap mb-8 bg-transparent">
                {categories.map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="px-6 py-2 rounded-full data-[state=active]:bg-doodle-purple data-[state=active]:text-white"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(cat.id === 'all' ? projects : projects.filter(p => p.category === cat.id)).map((project) => (
                      <Card key={project.id} className="group relative overflow-hidden rounded-lg aspect-video card-hover animate-zoom-in border-0 shadow-lg">
                        {/* Project Thumbnail */}
                        <video
                          src={project.videoUrl}
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
                                <video 
                                  src={project.videoUrl} 
                                  controls 
                                  className="w-full h-full object-contain"
                                  autoPlay
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Card>
                    ))}
                    
                    {(cat.id === 'all' ? projects.length === 0 : projects.filter(p => p.category === cat.id).length === 0) && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                        <p>No videos in this category. Upload some!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
      
      {/* Add custom styling for scrollbar hiding */}
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
    </section>
  );
};

export default Portfolio;
