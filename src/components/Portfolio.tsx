import React, { useState, useEffect, useRef } from 'react';
import { Play, Video, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
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
};

// Storage key for local storage
const STORAGE_KEY = 'portfolio_videos';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(true); // Default to autoplay on
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [previewLimit, setPreviewLimit] = useState(4); // Limit of videos to show in preview
  const [isFeaturedDialogOpen, setIsFeaturedDialogOpen] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
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

  // Detect if we're in development mode
  const isDevelopment = import.meta.env.MODE === 'development';

  // Load videos from local storage on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoadingError(null);
        const savedVideos = localStorage.getItem(STORAGE_KEY);
        
        if (savedVideos) {
          try {
            const parsedVideos = JSON.parse(savedVideos);
            
            // Check if first video is accessible
            const firstVideo = parsedVideos[0];
            if (firstVideo && firstVideo.videoUrl) {
              const videoEl = document.createElement('video');
              
              videoEl.onloadedmetadata = () => {
                console.log(`Video successfully loaded: ${firstVideo.videoUrl}`);
                setProjects(parsedVideos);
                setVideosLoaded(true);
                console.log(`${parsedVideos.length} videos loaded from storage`);
              };
              
              videoEl.onerror = (e) => {
                console.error('Error loading video:', e);
                setLoadingError(`Unable to load video at ${firstVideo.videoUrl}. Check if video files exist in the public folder.`);
              };
              
              videoEl.src = firstVideo.videoUrl;
            } else {
              setLoadingError('No valid videos found in storage');
            }
          } catch (error) {
            console.error('Failed to parse saved videos', error);
            toast.error('Failed to load saved videos');
            setLoadingError('Failed to parse saved videos');
          }
        } else {
          setLoadingError('No videos found in storage. Please reload the page.');
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setLoadingError('Error loading videos. Please reload the page.');
      }
    };
    
    loadVideos();
  }, []);

  // Save videos to local storage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      console.log('Videos saved to localStorage:', projects.length);
    }
  }, [projects]);

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

  // Handle category update
  const handleCategoryUpdate = (id: number, category: string) => {
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === id ? { ...project, category } : project
      );
      // Save updated projects to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast.success("Category updated");
      return updated;
    });
  };

  // Export all videos to a downloadable JSON file
  const exportVideos = () => {
    if (projects.length === 0) {
      toast.error("No videos to export");
      return;
    }
    
    try {
      const dataStr = JSON.stringify(projects, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `portfolio_videos_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success(`${projects.length} videos exported successfully`);
    } catch (error) {
      console.error('Failed to export videos', error);
      toast.error("Failed to export videos");
    }
  };

  // Import videos from a JSON file
  const importVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedProjects = JSON.parse(event.target?.result as string);
        
        if (!Array.isArray(importedProjects)) {
          throw new Error("Invalid format: Expected an array");
        }
        
        // Basic validation to ensure we have the right format
        if (importedProjects.some(p => !p.title || !p.videoUrl)) {
          throw new Error("Invalid format: Missing required fields");
        }
        
        // Merge with existing videos, avoiding duplicates by ID
        const existingIds = projects.map(p => p.id);
        const newProjects = importedProjects.filter(p => !existingIds.includes(p.id));
        const mergedProjects = [...projects, ...newProjects];
        
        setProjects(mergedProjects);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProjects));
        toast.success(`${newProjects.length} videos imported successfully`);
      } catch (error) {
        console.error('Failed to import videos', error);
        toast.error("Failed to import videos: Invalid format");
      }
      
      // Reset the input
      e.target.value = '';
    };
    
    reader.readAsText(file);
  };

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  // Check if a video URL is valid
  const checkVideoURL = (url: string) => {
    try {
      // Test if URL is valid (starts with http or /)
      return url && (url.startsWith('http') || url.startsWith('/'));
    } catch (e) {
      return false;
    }
  };

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Your Videos</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Watch and explore videos in our portfolio.
          </p>
          
          {/* Admin Button - Only visible in development */}
          {isDevelopment && (
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link to="/admin" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Manage Videos (Admin)
                </Link>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This button is only visible during development
              </p>
            </div>
          )}
          
          {/* Debug info - Only visible in development mode */}
          {isDevelopment && (
            <div className="mt-4 text-xs text-left bg-gray-100 p-4 rounded-md">
              <h4 className="font-bold">Debug Info:</h4>
              <p>Videos loaded: {videosLoaded ? 'Yes' : 'No'}</p>
              <p>Number of videos: {projects.length}</p>
              <p>Error loading: {loadingError || 'None'}</p>
              <p>Storage key: {STORAGE_KEY}</p>
              <p>First video URL: {projects.length > 0 ? projects[0].videoUrl : 'None'}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  window.location.reload();
                }}
                className="mt-2"
              >
                Clear Storage & Reload
              </Button>
            </div>
          )}
          
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
            
            {/* Export/Import Video Buttons */}
            {projects.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={exportVideos}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Export Videos
                </Button>
              </>
            )}
          )}
        </div>
        
        {/* Loading error message */}
        {loadingError && (
          <div className="text-center py-16 border-2 border-dashed border-red-300 rounded-xl mb-12 bg-red-50">
            <Video className="w-12 h-12 mx-auto text-red-300 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-red-700">Unable to load videos</h3>
            <p className="text-gray-700 mb-6">
              {loadingError}
            </p>
            <Button 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        )}
        
        {/* Immersive Video Carousel - Enhanced Style */}
        {showcaseVideos.length > 0 && !loadingError ? (
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
              {showcaseVideos[activeVideoIndex] && showcaseVideos[activeVideoIndex].videoUrl && (
                <video
                  key={`feature-${showcaseVideos[activeVideoIndex]?.id}-${activeVideoIndex}`}
                  src={showcaseVideos[activeVideoIndex].videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onError={(e) => {
                    console.error('Error loading feature video:', e);
                    // Set a fallback image if video fails to load
                    (e.target as HTMLVideoElement).style.display = 'none';
                    const parent = (e.target as HTMLVideoElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full bg-gray-800 flex items-center justify-center';
                      fallback.innerHTML = '<p class="text-white">Video unavailable</p>';
                      parent.appendChild(fallback);
                    }
                  }}
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
                    key={`thumb-${video.id}-${index}`}
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
                      className="preview-video w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="auto"
                      autoPlay={index === activeVideoIndex}
                      onLoadedMetadata={(e) => {
                        if (index !== activeVideoIndex) {
                          (e.target as HTMLVideoElement).pause();
                        } else {
                          (e.target as HTMLVideoElement).play();
                        }
                      }}
                      onError={(e) => {
                        console.error(`Error loading thumbnail video ${video.id}:`, e);
                        // Replace with fallback on error
                        const videoEl = e.target as HTMLVideoElement;
                        videoEl.style.display = 'none';
                        
                        // Create fallback element
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full bg-gray-800 flex items-center justify-center';
                        fallback.innerHTML = '<p class="text-white text-xs">Video error</p>';
                        
                        // Add fallback to parent
                        if (videoEl.parentElement) {
                          videoEl.parentElement.appendChild(fallback);
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
        ) : !loadingError ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl mb-12">
            <Video className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No videos available</h3>
            <p className="text-gray-500 mb-6">
              Loading videos from your public folder...
            </p>
          </div>
        ) : null}
        
        {/* Updated Category Tabs */}
        {projects.length > 0 && !loadingError && (
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
                      <Card key={`project-${project.id}`} className="group relative overflow-hidden rounded-lg aspect-video card-hover animate-zoom-in border-0 shadow-lg">
                        {/* Project Thumbnail */}
                        <video
                          src={project.videoUrl}
                          className="grid-video w-full h-full object-cover"
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
                                    preload="auto"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {/* Featured toggle button */}
                            <button 
                              className={`px-3 py-1.5 ${project.featured ? 'bg-doodle-purple text-white' : 'bg-white/20 text-white'} text-sm rounded-full hover:bg-doodle-purple/70 hover:text-white`}
                              onClick={() => toggleFeaturedVideo(project.id)}
                            >
                              {project.featured ? 'Featured' : 'Feature Video'}
                            </button>
                            
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
                          </div>
                        
                        {/* Featured badge */}
                        {project.featured && (
                          <div className="absolute top-2 right-2 bg-doodle-purple text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </Card>
                    ))}
                    
                    {(cat.id === 'all' ? projects.length === 0 : projects.filter(p => p.category === cat.id).length === 0) && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                        <p>No videos in this category.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
      
      {/* Add custom styling for scrollbar hiding and video autoplay */}
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
