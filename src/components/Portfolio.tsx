
import React, { useState, useEffect, useRef } from 'react';
import { Play, Video, LockIcon, CheckCircle, Save } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Portfolio item type
type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  featured?: boolean;
  dateAdded?: number;
};

// Storage key for local storage
const STORAGE_KEY = 'portfolio_videos';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const carouselRef = useRef<any>(null);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [previewLimit, setPreviewLimit] = useState(4);
  const [isFeaturedDialogOpen, setIsFeaturedDialogOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('fashion');
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  
  // In a real application, this would be stored securely on the server
  // This is just for demonstration purposes
  const ADMIN_PASSWORD = "admin123"; 
  
  // Updated categories based on user's request
  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'fashion', name: 'Fashion & Modeling' },
    { id: 'fitness', name: 'Fitness & Training' },
    { id: 'events', name: 'Events & Nightlife' },
    { id: 'brand', name: 'Brand Collaborations' },
    { id: 'snapinsta', name: 'SnapInsta Videos' } // Added new category for SnapInsta videos
  ];
  
  // Updated to only include user uploads - no default videos
  const [projects, setProjects] = useState<Project[]>([]);

  // Load videos from local storage on component mount
  useEffect(() => {
    const savedVideos = localStorage.getItem(STORAGE_KEY);
    if (savedVideos) {
      try {
        const parsedVideos = JSON.parse(savedVideos);
        
        // Check for videos with SnapInsta in the title and ensure they're categorized properly
        const updatedVideos = parsedVideos.map((video: Project) => {
          if (video.title.includes('SnapInsta') && video.category !== 'snapinsta') {
            return { ...video, category: 'snapinsta' };
          }
          return video;
        });
        
        setProjects(updatedVideos);
        
        // Get the timestamp of when videos were last saved
        const lastSaved = localStorage.getItem(STORAGE_KEY + '_last_saved');
        if (lastSaved) {
          setLastSaveTime(new Date(parseInt(lastSaved)));
        }
        
        // Check specifically for SnapInsta videos
        const snapInstaVideos = updatedVideos.filter((video: Project) => 
          video.title.includes('SnapInsta') || video.category === 'snapinsta'
        );
        
        if (snapInstaVideos.length > 0) {
          toast.info(`Loaded ${snapInstaVideos.length} SnapInsta videos`, {
            description: "Your SnapInsta videos are available in the 'SnapInsta Videos' category"
          });
        } else {
          toast.info(`${updatedVideos.length} videos loaded from your device storage`);
        }
      } catch (error) {
        console.error('Failed to parse saved videos', error);
        toast.error('Failed to load saved videos');
      }
    }
  }, []);

  // Handler for new video uploads
  const handleVideoUploaded = (file: File, previewUrl: string) => {
    // Check if the filename contains SnapInsta
    const isSnapInsta = file.name.toLowerCase().includes('snapinsta');
    const videoCategory = isSnapInsta ? 'snapinsta' : uploadCategory;
    
    // Create a new project with the uploaded video
    const newProject: Project = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      title: "New Upload: " + file.name.split('.')[0],
      client: isSnapInsta ? "SnapInsta" : "Your Project",
      category: videoCategory,
      thumbnail: previewUrl,
      videoUrl: previewUrl,
      featured: projects.length < previewLimit,
      dateAdded: Date.now()
    };
    
    // Add the new project to the list
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY + '_last_saved', now.toString());
    setLastSaveTime(new Date(now));
    
    toast.success(`Video uploaded and saved to ${categories.find(c => c.id === videoCategory)?.name || videoCategory}!`, {
      description: "Your video is saved in your browser's local storage."
    });
    setIsUploadDialogOpen(false);
    
    // If it's a SnapInsta video, set the filter to 'snapinsta' to immediately show it
    if (isSnapInsta) {
      setActiveFilter('snapinsta');
    }
  };

  // Save videos to local storage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      // Save the timestamp when we last saved the videos
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY + '_last_saved', now.toString());
      setLastSaveTime(new Date(now));
    }
  }, [projects]);

  // Manual save function - for peace of mind
  const handleManualSave = () => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY + '_last_saved', now.toString());
      setLastSaveTime(new Date(now));
      
      // Check for SnapInsta videos
      const snapInstaVideos = projects.filter(video => 
        video.title.includes('SnapInsta') || video.category === 'snapinsta'
      );
      
      if (snapInstaVideos.length > 0) {
        toast.success(`All videos saved, including ${snapInstaVideos.length} SnapInsta videos`, {
          description: "Your videos are securely stored in your browser's local storage."
        });
      } else {
        toast.success("Videos have been saved to your device", {
          description: "Your videos are securely stored in your browser's local storage."
        });
      }
    } else {
      toast.info("No videos to save");
    }
  };

  // Toggle a video's featured status
  const toggleFeaturedVideo = (id: number) => {
    setProjects(prev => {
      // Count how many videos are currently featured
      const featuredCount = prev.filter(p => p.featured).length;
      
      const updated = prev.map(project => {
        if (project.id === id) {
          // If it's already featured, we can always unfeature it
          if (project.featured) {
            return { ...project, featured: false };
          } 
          // If it's not featured and we have less than the limit, we can feature it
          else if (featuredCount < previewLimit) {
            return { ...project, featured: true };
          } 
          // Otherwise, show a toast that we've reached the limit
          else {
            toast.error(`You can only feature ${previewLimit} videos. Unfeature one first.`);
            return project;
          }
        }
        return project;
      });
      
      // Save updated projects to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY + '_last_saved', now.toString());
      setLastSaveTime(new Date(now));
      return updated;
    });
  };

  // Get featured videos for the carousel, limited to previewLimit
  const showcaseVideos = React.useMemo(() => {
    const featured = projects.filter(p => p.featured);
    
    if (featured.length >= previewLimit) {
      return featured.slice(0, previewLimit);
    } else {
      // If we don't have enough featured videos, add some non-featured ones
      const nonFeatured = projects.filter(p => !p.featured);
      return [...featured, ...nonFeatured].slice(0, previewLimit);
    }
  }, [projects, previewLimit]);

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

  // Handle video deletion
  const handleDeleteVideo = (id: number) => {
    setProjects(prev => {
      const updated = prev.filter(project => project.id !== id);
      // Save updated projects to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY + '_last_saved', now.toString());
      setLastSaveTime(new Date(now));
      toast.success("Video deleted successfully");
      return updated;
    });
  };

  // Handle category update
  const handleCategoryUpdate = (id: number, category: string) => {
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === id ? { ...project, category } : project
      );
      // Save updated projects to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY + '_last_saved', now.toString());
      setLastSaveTime(new Date(now));
      toast.success("Category updated");
      return updated;
    });
  };

  // Format the last save time in a readable way
  const formatSaveTime = (date: Date | null) => {
    if (!date) return "Never";
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return "Just now";
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Format the date
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  // Check for SnapInsta videos
  const snapInstaCount = projects.filter(video => 
    video.title.toLowerCase().includes('snapinsta') || video.category === 'snapinsta'
  ).length;

  // Fix: Force video play when thumbnail is visible by adding a useEffect
  useEffect(() => {
    const playVisibleVideos = () => {
      // Play the main feature video if it exists
      if (showcaseVideos.length > 0) {
        const mainVideo = document.querySelector('.feature-video') as HTMLVideoElement;
        if (mainVideo) {
          mainVideo.play().catch(err => console.log('Autoplay prevented:', err));
        }
      }
      
      // Make sure all thumbnail videos are set to play
      const thumbnailVideos = document.querySelectorAll('.thumbnail-video') as NodeListOf<HTMLVideoElement>;
      thumbnailVideos.forEach((video, index) => {
        if (index === activeVideoIndex) {
          video.play().catch(err => console.log('Thumbnail autoplay prevented:', err));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };
    
    // Play videos when they're initially loaded or when the active index changes
    playVisibleVideos();
    
    // Also set up an intersection observer to play videos when they become visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target instanceof HTMLVideoElement) {
          entry.target.play().catch(err => console.log('Observer autoplay prevented:', err));
        } else if (entry.target instanceof HTMLVideoElement) {
          entry.target.pause();
        }
      });
    }, { threshold: 0.5 });
    
    // Observe all video elements in the portfolio section
    const allVideos = document.querySelectorAll('.card-video') as NodeListOf<HTMLVideoElement>;
    allVideos.forEach(video => observer.observe(video));
    
    return () => {
      observer.disconnect();
    };
  }, [showcaseVideos, activeVideoIndex]);

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Your Videos</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Upload and showcase your videos. You can upload new videos using the button below.
          </p>
          
          {/* Storage Status */}
          <div className="flex items-center justify-center mt-4 mb-6 text-sm text-gray-500">
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-full shadow-sm">
              {projects.length > 0 ? (
                <>
                  <span>
                    {projects.length} video{projects.length !== 1 ? 's' : ''} saved • 
                    {snapInstaCount > 0 && ` ${snapInstaCount} SnapInsta • `}
                    Last saved: {formatSaveTime(lastSaveTime)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleManualSave} 
                    className="ml-2 text-doodle-purple hover:text-doodle-purple/90"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Now
                  </Button>
                </>
              ) : (
                <span>No videos saved yet</span>
              )}
            </div>
          </div>
          
          {/* SnapInsta Notice - Show if we have SnapInsta videos */}
          {snapInstaCount > 0 && (
            <div className="mt-2 mb-4 p-3 bg-doodle-purple/10 rounded-lg mx-auto max-w-2xl">
              <p className="text-sm">
                <span className="font-bold">{snapInstaCount} SnapInsta videos</span> are available. 
                View them in the <Button 
                  variant="link" 
                  className="p-0 h-auto text-doodle-purple" 
                  onClick={() => setActiveFilter('snapinsta')}
                >
                  SnapInsta Videos
                </Button> category.
              </p>
            </div>
          )}
          
          {/* Upload Video Button - Available to all users */}
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
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
                
                {/* Add category selection before upload */}
                <div className="py-4 space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                      Select Category
                    </label>
                    <Select
                      value={uploadCategory}
                      onValueChange={setUploadCategory}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => ( // Skip "All Videos"
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Videos with "SnapInsta" in the name will automatically be categorized as SnapInsta Videos.
                    </p>
                  </div>
                  <VideoUploader 
                    onVideoUploaded={handleVideoUploaded} 
                    buttonText="Select Video File"
                    showPreview={true}
                    adminOnly={false} // Set to false so all users can upload
                  />
                  <p className="text-xs text-gray-500">
                    Videos will be saved to your device's browser storage and will be available when you return.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Manage Featured Videos Button */}
            {projects.length > 0 && (
              <Dialog open={isFeaturedDialogOpen} onOpenChange={setIsFeaturedDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Choose Featured Videos
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Choose Featured Videos</DialogTitle>
                    <DialogDescription>
                      Select up to {previewLimit} videos to feature in the preview carousel
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      {projects.map(project => (
                        <div key={project.id} className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => toggleFeaturedVideo(project.id)}>
                          <div className="relative w-24 h-16 rounded overflow-hidden">
                            <video
                              src={project.videoUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              loop
                              autoPlay
                            />
                            {project.featured && (
                              <div className="absolute inset-0 bg-doodle-purple/30 flex items-center justify-center">
                                <CheckCircle className="text-white h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{project.title}</p>
                            <p className="text-sm text-gray-500">{project.client}</p>
                          </div>
                          <div>
                            {project.featured ? (
                              <CheckCircle className="text-doodle-purple h-6 w-6" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500">
                      {projects.filter(p => p.featured).length} of {previewLimit} featured videos selected
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            {/* Clear All Videos Button - Only show if there are videos */}
            {projects.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm("Are you sure you want to delete all videos? This cannot be undone.")) {
                    setProjects([]);
                    localStorage.removeItem(STORAGE_KEY);
                    toast.success("All videos cleared");
                  }
                }}
              >
                Clear All Videos
              </Button>
            )}
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
                  key={`feature-${showcaseVideos[activeVideoIndex]?.id}`}
                  src={showcaseVideos[activeVideoIndex]?.videoUrl}
                  className="w-full h-full object-cover feature-video"
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
                      className="w-full h-full object-cover thumbnail-video"
                      muted
                      loop
                      playsInline
                      autoPlay={index === activeVideoIndex}
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
            <p className="text-xs text-gray-500 mt-4">
              Your videos will be saved to your device's browser storage
            </p>
          </div>
        )}
        
        {/* Updated Category Tabs */}
        {projects.length > 0 && (
          <div className="mb-12">
            <Tabs defaultValue={activeFilter} value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="w-full flex justify-center flex-wrap mb-8 bg-transparent">
                {categories.map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className={`px-6 py-2 rounded-full data-[state=active]:bg-doodle-purple data-[state=active]:text-white ${
                      cat.id === 'snapinsta' && snapInstaCount > 0 ? 'relative' : ''
                    }`}
                  >
                    {cat.name}
                    {cat.id === 'snapinsta' && snapInstaCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {snapInstaCount}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(cat.id === 'all' ? projects : projects.filter(p => p.category === cat.id)).map((project) => (
                      <Card key={project.id} className={`group relative overflow-hidden rounded-lg aspect-video card-hover animate-zoom-in border-0 shadow-lg ${
                        project.title.toLowerCase().includes('snapinsta') || project.category === 'snapinsta' 
                          ? 'ring-2 ring-doodle-purple' 
                          : ''
                      }`}>
                        {/* Project Thumbnail */}
                        <video
                          src={project.videoUrl}
                          className="w-full h-full object-cover card-video"
                          muted
                          loop
                          playsInline
                          preload="auto"
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
                          
                          <div className="flex gap-2">
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
                                    playsInline
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {/* Category selector */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-full hover:bg-white/30">
                                  Change Category
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-xs">
                                <DialogHeader>
                                  <DialogTitle>Change Category</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 gap-2 mt-4">
                                  {categories.slice(1).map((cat) => ( // Skip "All Videos"
                                    <Button 
                                      key={cat.id} 
                                      variant="outline" 
                                      className={cat.id === project.category ? "bg-doodle-purple text-white" : ""}
                                      onClick={() => {
                                        handleCategoryUpdate(project.id, cat.id);
                                      }}
                                    >
                                      {cat.name}
                                    </Button>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {/* Delete button */}
                            <button 
                              className="ml-auto px-3 py-1.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this video?")) {
                                  handleDeleteVideo(project.id);
                                }
                              }}
                            >
                              Delete Video
                            </button>
                          </div>
                        </div>
                        
                        {/* Featured badge */}
                        {project.featured && (
                          <div className="absolute top-2 right-2 bg-doodle-purple text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                        
                        {/* SnapInsta badge */}
                        {(project.title.toLowerCase().includes('snapinsta') || project.category === 'snapinsta') && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            SnapInsta
                          </div>
                        )}
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
