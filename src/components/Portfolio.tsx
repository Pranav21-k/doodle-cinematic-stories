
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
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [previewLimit, setPreviewLimit] = useState(4);
  const [isFeaturedDialogOpen, setIsFeaturedDialogOpen] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  const ADMIN_PASSWORD = "admin123"; 
  
  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'fashion', name: 'Fashion & Modeling' },
    { id: 'fitness', name: 'Fitness & Training' },
    { id: 'events', name: 'Events & Nightlife' },
    { id: 'brand', name: 'Brand Collaborations' }
  ];
  
  const [projects, setProjects] = useState<Project[]>([]);

  // Load videos from local storage on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoadingError(null);
        console.log('Loading videos from localStorage...');
        
        const savedVideos = localStorage.getItem(STORAGE_KEY);
        
        if (savedVideos) {
          try {
            const parsedVideos = JSON.parse(savedVideos);
            console.log(`Found ${parsedVideos.length} videos in localStorage`);
            
            // Set videos immediately without validation
            setProjects(parsedVideos);
            setVideosLoaded(true);
            console.log('Videos loaded successfully');
            
          } catch (error) {
            console.error('Failed to parse saved videos', error);
            setLoadingError('Failed to parse saved videos from storage');
          }
        } else {
          console.log('No videos found in localStorage');
          setLoadingError('No videos found. Please reload the page to initialize default videos.');
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
      const featuredCount = prev.filter(p => p.featured).length;
      
      const updated = prev.map(project => {
        if (project.id === id) {
          if (project.featured) {
            return { ...project, featured: false };
          } 
          else if (featuredCount < previewLimit) {
            return { ...project, featured: true };
          } 
          else {
            toast.error(`You can only feature ${previewLimit} videos. Unfeature one first.`);
            return project;
          }
        }
        return project;
      });
      
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
      }, 8000);
      
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
        
        if (importedProjects.some(p => !p.title || !p.videoUrl)) {
          throw new Error("Invalid format: Missing required fields");
        }
        
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
      
      e.target.value = '';
    };
    
    reader.readAsText(file);
  };

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  // Video error handler
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.log('Video error occurred, but continuing...');
    // Don't show error to user, just log it
  };

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="section-title animate-fade-in-up">Your Videos</h2>
          <p className="section-subtitle max-w-2xl mx-auto animate-fade-in-up">
            Watch and explore videos in our portfolio.
          </p>
          
          {/* Manage Featured Videos Button */}
          {projects.length > 0 && (
            <div className="mt-8">
              <Dialog open={isFeaturedDialogOpen} onOpenChange={setIsFeaturedDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="animate-pulse-glow">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Choose Featured Videos
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto glass">
                  <DialogHeader>
                    <DialogTitle>Choose Featured Videos</DialogTitle>
                    <DialogDescription>
                      Select up to {previewLimit} videos to feature in the preview carousel
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      {projects.map(project => (
                        <div key={project.id} className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md cursor-pointer animate-card-hover" onClick={() => toggleFeaturedVideo(project.id)}>
                          <div className="relative w-24 h-16 rounded overflow-hidden">
                            <video
                              src={project.videoUrl}
                              className="w-full h-full object-cover"
                              muted
                              onError={handleVideoError}
                            />
                            {project.featured && (
                              <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
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
                              <CheckCircle className="text-purple-600 h-6 w-6" />
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
            </div>
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
        
        {/* Immersive Video Carousel */}
        {showcaseVideos.length > 0 && !loadingError ? (
          <div className="mb-16 relative animate-fade-in-up">
            {/* Preview Limit Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 animate-fade-in-up">
                  Showing {Math.min(showcaseVideos.length, previewLimit)} of {projects.length} videos
                </span>
              </div>
              
              {/* Autoplay Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="group flex items-center gap-2 z-10 bg-white/10 backdrop-blur-sm border-purple-300/30 hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <Video size={16} className="group-hover:animate-pulse" />
                {isAutoplay ? 'Stop Rotation' : 'Start Rotation'}
              </Button>
            </div>
            
            {/* Main Feature Video */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl group">
              {showcaseVideos[activeVideoIndex] && showcaseVideos[activeVideoIndex].videoUrl && (
                <video
                  key={`feature-${showcaseVideos[activeVideoIndex]?.id}-${activeVideoIndex}`}
                  src={showcaseVideos[activeVideoIndex].videoUrl}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onError={handleVideoError}
                />
              )}
              {/* Enhanced overlay with better gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                <div className="p-8 w-full">
                  <div className="backdrop-blur-sm bg-black/30 rounded-xl p-6 transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-white text-3xl font-bold mb-2 animate-text-glow">
                      {showcaseVideos[activeVideoIndex]?.title}
                    </h3>
                    <p className="text-purple-200 text-lg">
                      {showcaseVideos[activeVideoIndex]?.client}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating play indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse-glow">
                  <Play size={32} className="text-white ml-1" />
                </div>
              </div>
            </div>
            
            {/* Horizontally Scrolling Video Thumbnails */}
            <div className="relative -mt-4 z-10 overflow-x-auto pb-8 no-scrollbar">
              <div className="flex space-x-8 px-4">
                {showcaseVideos.map((video, index) => (
                  <div 
                    key={`thumb-${video.id}-${index}`}
                    className={`flex-shrink-0 w-64 h-44 rounded-xl overflow-hidden cursor-pointer 
                      shadow-xl transition-all duration-700 ease-out transform
                      ${index === activeVideoIndex 
                        ? 'ring-4 ring-purple-500 scale-110 z-10 shadow-purple-500/50' 
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }
                      ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}
                      ${index === activeVideoIndex - 1 || index === activeVideoIndex + 1 
                        ? 'translate-y-2' 
                        : index === activeVideoIndex - 2 || index === activeVideoIndex + 2
                          ? 'translate-y-4' 
                          : 'translate-y-0'
                      }
                    `}
                    onClick={() => {
                      setActiveVideoIndex(index);
                    }}
                  >
                    <video 
                      src={video.videoUrl} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
                      onError={handleVideoError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                      <div className="p-4 w-full">
                        <p className="text-white text-sm font-bold truncate backdrop-blur-sm bg-black/30 rounded px-2 py-1">
                          {video.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* Active indicator */}
                    {index === activeVideoIndex && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !loadingError ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-2xl mb-12 animate-fade-in-up bg-gradient-to-br from-gray-50 to-white">
            <Video className="w-16 h-16 mx-auto text-gray-300 mb-6 animate-float" />
            <h3 className="text-2xl font-medium mb-4 text-gray-600">No videos available</h3>
            <p className="text-gray-500 text-lg">
              Loading videos from your portfolio...
            </p>
            <div className="mt-6">
              <div className="animate-shimmer w-64 h-2 bg-gray-200 rounded mx-auto"></div>
            </div>
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
                    className="px-6 py-2 rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white"
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
                          onError={handleVideoError}
                        />
                        
                        {/* Overlay with information */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white text-xl font-bold">{project.title}</h3>
                          <p className="text-white/70 text-sm mb-4">Client: {project.client}</p>
                          
                          <div className="flex gap-2">
                            {/* Play button */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center">
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
                                    onError={handleVideoError}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {/* Featured toggle button */}
                            <button 
                              className={`px-3 py-1.5 ${project.featured ? 'bg-purple-600 text-white' : 'bg-white/20 text-white'} text-sm rounded-full hover:bg-purple-600/70 hover:text-white`}
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
                                  {categories.slice(1).map((cat) => (
                                    <Button 
                                      key={cat.id} 
                                      variant="outline" 
                                      className={cat.id === project.category ? "bg-purple-600 text-white" : ""}
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
                        </div>
                        
                        {/* Featured badge */}
                        {project.featured && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
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
