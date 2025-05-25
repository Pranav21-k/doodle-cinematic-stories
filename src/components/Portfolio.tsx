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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set());
  
  // In a real application, this would be stored securely on the server
  const ADMIN_PASSWORD = "admin123"; 
  
  // Updated categories based on user's request
  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'fashion', name: 'Fashion & Modeling' },
    { id: 'fitness', name: 'Fitness & Training' },
    { id: 'events', name: 'Events & Nightlife' },
    { id: 'brand', name: 'Brand Collaborations' }
  ];
  
  // --------------------------------------------------------------------
  // Fallback videos located in /public/modelling so that a fresh visitor
  // always sees content even before any admin upload occurs.
  const modellingFiles = [
    '01.mp4', '02.mp4', '03.mp4', '04.mp4', '05.mp4', '06.mp4',
    '07.mp4', '08.mp4', '1.mp4', '2.mp4', '3.mp4', '4.mp4',
    'ad1.mp4', 'f1.mp4', 'f2.mp4', 'p2.mp4', 'p3.mp4', 'p4.mp4',
    'p5.mp4', 'p6.mp4', 't1.mp4', 't2.mp4', 't3.mp4'
  ];

  const DEFAULT_PROJECTS: Project[] = modellingFiles.map((file, idx) => ({
    id: idx + 1,
    title: `Video ${idx + 1}`,
    client: 'Doodle',
    category: 'fashion',
    thumbnail: `/modelling/${file}`,
    videoUrl: `/modelling/${file}`,
    featured: idx < 4, // first few highlighted in carousel
  }));
  // --------------------------------------------------------------------
  
  const [projects, setProjects] = useState<Project[]>([]);

  // Load videos from local storage on component mount
  useEffect(() => {
    const loadVideos = () => {
      try {
        console.log('Loading videos from localStorage...');
        const savedVideos = localStorage.getItem(STORAGE_KEY);
        
        if (savedVideos) {
          try {
            const parsedVideos = JSON.parse(savedVideos);
            if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
              console.log('Parsed videos from localStorage:', parsedVideos.length);
              setProjects(parsedVideos);
              setVideosLoaded(true);
              setLoadingError(null);
              setIsInitialLoad(false);
            } else {
              throw new Error('Empty or invalid saved videos');
            }
          } catch (e) {
            console.warn('Falling back to default videos due to error:', e);
            setProjects(DEFAULT_PROJECTS);
            setVideosLoaded(true);
            setLoadingError(null);
            setIsInitialLoad(false);
          }
        } else {
          // No videos in storage – use bundled defaults
          console.log('No videos found in localStorage, loading defaults');
          setProjects(DEFAULT_PROJECTS);
          setVideosLoaded(true);
          setLoadingError(null);
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setLoadingError('Error loading videos. Please refresh the page.');
        setIsInitialLoad(false);
      }
    };
    
    // Add a small delay to ensure localStorage is ready
    const timer = setTimeout(loadVideos, 100);
    return () => clearTimeout(timer);
  }, []);

  // Save videos to local storage whenever projects change
  useEffect(() => {
    if (projects.length > 0 && !isInitialLoad) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      console.log('Videos saved to localStorage:', projects.length);
    }
  }, [projects, isInitialLoad]);

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

  // Check if a video URL is valid
  const checkVideoURL = (url: string) => {
    try {
      // Test if URL is valid (starts with http or /)
      return url && (url.startsWith('http') || url.startsWith('/'));
    } catch (e) {
      return false;
    }
  };

  // Preload videos for better performance
  const preloadVideo = (videoUrl: string) => {
    if (preloadedVideos.has(videoUrl)) return;
    
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = videoUrl;
    video.muted = true;
    
    video.addEventListener('canplaythrough', () => {
      setPreloadedVideos(prev => new Set([...prev, videoUrl]));
    });
    
    video.addEventListener('error', () => {
      console.warn(`Failed to preload video: ${videoUrl}`);
    });
    
    // Start loading
    video.load();
  };

  // Preload featured videos when component mounts
  useEffect(() => {
    if (showcaseVideos.length > 0) {
      showcaseVideos.forEach(video => {
        if (video.videoUrl) {
          preloadVideo(video.videoUrl);
        }
      });
    }
  }, [showcaseVideos]);

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="section-title animate-fade-in-up">Our Videos</h2>
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
                              className="w-full h-full object-cover mobile-video"
                              muted
                              preload="auto"
                              poster={project.thumbnail || project.videoUrl}
                              playsInline
                              webkit-playsinline="true"
                              onLoadedData={(e) => {
                                // Ensure video is visible once loaded
                                const videoEl = e.target as HTMLVideoElement;
                                videoEl.style.opacity = '1';
                              }}
                              onError={(e) => {
                                console.error(`Error loading thumbnail video ${project.id}:`, e);
                                // Fallback: try to show a poster image
                                const videoEl = e.target as HTMLVideoElement;
                                if (videoEl && project.thumbnail) {
                                  const img = document.createElement('img');
                                  img.src = project.thumbnail;
                                  img.className = 'w-full h-full object-cover';
                                  img.alt = project.title;
                                  videoEl.parentElement?.appendChild(img);
                                  videoEl.style.display = 'none';
                                }
                              }}
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
        
        {/* Loading state for initial load */}
        {isInitialLoad && (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-2xl mb-12 animate-fade-in-up bg-gradient-to-br from-gray-50 to-white">
            <Video className="w-16 h-16 mx-auto text-gray-300 mb-6 animate-spin" />
            <h3 className="text-2xl font-medium mb-4 text-gray-600">Loading Videos...</h3>
            <p className="text-gray-500 text-lg">
              Please wait while we load your portfolio videos.
            </p>
          </div>
        )}
        
        {/* Loading error message */}
        {loadingError && !isInitialLoad && (
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
        
        {/* Video Carousel - Fixed alignment and overlay issues */}
        {showcaseVideos.length > 0 && videosLoaded && !loadingError ? (
          <div className="mb-16 relative animate-fade-in-up">
            {/* Controls - Fixed positioning */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500 animate-fade-in-up">
                  Showing {Math.min(showcaseVideos.length, previewLimit)} of {projects.length} videos
                </span>
              </div>
              
              {/* Autoplay Toggle - Fixed z-index */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="relative z-20 bg-white/90 backdrop-blur-sm border-purple-300/30 hover:bg-purple-600 hover:text-white transition-all duration-300 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                <Video size={16} />
                <span className="ml-1 sm:ml-2 hidden sm:inline">{isAutoplay ? 'Stop Rotation' : 'Start Rotation'}</span>
                <span className="ml-1 sm:hidden">{isAutoplay ? 'Stop' : 'Play'}</span>
              </Button>
            </div>
            
            {/* Main Feature Video - Fixed positioning */}
            <div className="relative w-full aspect-video rounded-lg sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-2xl group">
              {showcaseVideos[activeVideoIndex] && showcaseVideos[activeVideoIndex].videoUrl && (
                <video
                  key={`feature-${showcaseVideos[activeVideoIndex]?.id}-${activeVideoIndex}`}
                  src={showcaseVideos[activeVideoIndex].videoUrl}
                  className="w-full h-full object-cover transition-all duration-700 mobile-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  poster={showcaseVideos[activeVideoIndex].thumbnail || showcaseVideos[activeVideoIndex].videoUrl}
                  onLoadedData={(e) => {
                    // Video is ready to play smoothly
                    const video = e.target as HTMLVideoElement;
                    video.style.opacity = '1';
                  }}
                  onError={(e) => {
                    console.error('Error loading feature video:', e);
                  }}
                />
              )}
              
              {/* Overlay - Fixed positioning */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <div className="backdrop-blur-sm bg-black/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                    <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 mobile-safe-text">
                      {showcaseVideos[activeVideoIndex]?.title}
                    </h3>
                    <p className="text-purple-200 text-sm sm:text-base md:text-lg mobile-safe-text">
                      {showcaseVideos[activeVideoIndex]?.client}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Play indicator - Fixed positioning */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={20} className="text-white ml-1 sm:ml-1 md:ml-1" />
                </div>
              </div>
            </div>
            
            {/* Thumbnail Navigation - Fixed scrolling and alignment */}
            <div className="relative">
              <div className="overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex space-x-3 sm:space-x-4 md:space-x-6 px-2 min-w-max">
                  {showcaseVideos.map((video, index) => (
                    <div 
                      key={`thumb-${video.id}-${index}`}
                      className={`flex-shrink-0 w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all duration-500 relative
                        ${index === activeVideoIndex 
                          ? 'ring-4 ring-purple-500 scale-105 shadow-purple-500/50' 
                          : 'opacity-80 hover:opacity-100 hover:scale-102'
                        }
                      `}
                      onClick={() => setActiveVideoIndex(index)}
                    >
                      <video 
                        src={video.videoUrl} 
                        className="w-full h-full object-cover mobile-video"
                        muted
                        preload="auto"
                        poster={video.thumbnail || video.videoUrl}
                        playsInline
                        webkit-playsinline="true"
                        onLoadedData={(e) => {
                          // Ensure video is visible once loaded
                          const videoEl = e.target as HTMLVideoElement;
                          videoEl.style.opacity = '1';
                        }}
                        onError={(e) => {
                          console.error(`Error loading thumbnail video ${video.id}:`, e);
                          // Fallback: try to show a poster image
                          const videoEl = e.target as HTMLVideoElement;
                          if (videoEl && video.thumbnail) {
                            const img = document.createElement('img');
                            img.src = video.thumbnail;
                            img.className = 'w-full h-full object-cover';
                            img.alt = video.title;
                            videoEl.parentElement?.appendChild(img);
                            videoEl.style.display = 'none';
                          }
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                          <p className="text-white text-xs sm:text-sm font-medium truncate mobile-safe-text">
                            {video.title}
                          </p>
                        </div>
                      </div>
                      
                      {/* Active indicator */}
                      {index === activeVideoIndex && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Category Tabs and Grid - Only show when videos are loaded */}
        {projects.length > 0 && videosLoaded && !loadingError && (
          <div className="mb-12">
            <Tabs defaultValue="all" onValueChange={setActiveFilter}>
              <TabsList className="w-full flex justify-center flex-wrap mb-6 sm:mb-8 bg-transparent gap-2 sm:gap-0">
                {categories.map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 text-xs sm:text-sm rounded-full data-[state=active]:bg-doodle-purple data-[state=active]:text-white"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {(cat.id === 'all' ? projects : projects.filter(p => p.category === cat.id)).map((project) => (
                      <Card key={`project-${project.id}`} className="group relative overflow-hidden rounded-lg aspect-video card-hover animate-zoom-in border-0 shadow-lg">
                        <video
                          src={project.videoUrl}
                          className="w-full h-full object-cover mobile-video"
                          muted
                          loop
                          playsInline
                          webkit-playsinline="true"
                          preload="auto"
                          poster={project.thumbnail || project.videoUrl}
                          onMouseOver={(e) => {
                            const video = e.target as HTMLVideoElement;
                            setTimeout(() => {
                              video.play().catch(() => {
                                // Ignore autoplay errors
                              });
                            }, 100);
                          }}
                          onMouseOut={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.pause();
                            video.currentTime = 0;
                          }}
                          onLoadedData={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.style.opacity = '1';
                          }}
                          onError={(e) => {
                            console.error(`Error loading grid video ${project.id}:`, e);
                            // Fallback: try to show a poster image
                            const videoEl = e.target as HTMLVideoElement;
                            if (videoEl && project.thumbnail) {
                              const img = document.createElement('img');
                              img.src = project.thumbnail;
                              img.className = 'w-full h-full object-cover';
                              img.alt = project.title;
                              videoEl.parentElement?.appendChild(img);
                              videoEl.style.display = 'none';
                            }
                          }}
                        />
                        
                        {/* Overlay with information */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 md:p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white text-sm sm:text-lg md:text-xl font-bold mobile-safe-text">{project.title}</h3>
                          <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-4 mobile-safe-text">Client: {project.client}</p>
                          
                          <div className="flex gap-1 sm:gap-2 flex-wrap">
                            {/* Play button */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-doodle-purple text-white flex items-center justify-center">
                                  <Play size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>{project.title}</DialogTitle>
                                </DialogHeader>
                                <div className="aspect-video w-full relative">
                                  {/* Loading overlay */}
                                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
                                    <div className="flex flex-col items-center gap-3">
                                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                      <p className="text-gray-600 text-sm">Loading video...</p>
                                    </div>
                                  </div>
                                  <video 
                                    src={project.videoUrl} 
                                    controls 
                                    className="w-full h-full object-contain relative z-10"
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                    onLoadStart={() => {
                                      // Show loading state
                                      const loadingDiv = document.querySelector('.absolute.inset-0.bg-gray-100');
                                      if (loadingDiv) {
                                        (loadingDiv as HTMLElement).style.display = 'flex';
                                      }
                                    }}
                                    onCanPlay={() => {
                                      // Hide loading state when video can play
                                      const loadingDiv = document.querySelector('.absolute.inset-0.bg-gray-100');
                                      if (loadingDiv) {
                                        (loadingDiv as HTMLElement).style.display = 'none';
                                      }
                                    }}
                                    onError={(e) => {
                                      console.error('Error loading dialog video:', e);
                                      // Hide loading and show error
                                      const loadingDiv = document.querySelector('.absolute.inset-0.bg-gray-100');
                                      if (loadingDiv) {
                                        (loadingDiv as HTMLElement).innerHTML = `
                                          <div class="flex flex-col items-center gap-3">
                                            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                              </svg>
                                            </div>
                                            <p class="text-red-600 text-sm">Error loading video</p>
                                          </div>
                                        `;
                                      }
                                    }}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {/* Featured toggle button */}
                            <button 
                              className={`px-2 py-1 sm:px-3 sm:py-1.5 ${project.featured ? 'bg-doodle-purple text-white' : 'bg-white/20 text-white'} text-xs sm:text-sm rounded-full hover:bg-doodle-purple/70 hover:text-white`}
                              onClick={() => toggleFeaturedVideo(project.id)}
                            >
                              {project.featured ? 'Featured' : 'Feature'}
                            </button>
                            
                            {/* Category selector */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/20 text-white text-xs sm:text-sm rounded-full hover:bg-white/30">
                                  <span className="hidden sm:inline">Change Category</span>
                                  <span className="sm:hidden">Category</span>
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
                        </div>
                        
                        {/* Featured badge */}
                        {project.featured && (
                          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-doodle-purple text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </Card>
                    ))}
                    
                    {(cat.id === 'all' ? projects.length === 0 : projects.filter(p => p.category === cat.id).length === 0) && (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 sm:py-10">
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
      
      {/* Custom styles for proper scrolling */}
      <style>
        {`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Mobile video improvements */
        @media (max-width: 640px) {
          video, .mobile-video {
            object-fit: cover;
            width: 100%;
            height: 100%;
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }
          
          video[poster], .mobile-video[poster] {
            opacity: 1;
          }
          
          video:not([poster]), .mobile-video:not([poster]) {
            background: linear-gradient(45deg, #7c3aed, #a855f7);
          }
          
          /* Ensure videos load properly on mobile */
          .mobile-video {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            will-change: transform;
          }
          
          .mobile-safe-text {
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9);
            font-weight: 700;
          }
        }
        
        /* iOS specific video fixes */
        @supports (-webkit-touch-callout: none) {
          .mobile-video {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
        }
        
        /* Touch improvements for mobile */
        @media (hover: none) and (pointer: coarse) {
          .group:hover .opacity-0 {
            opacity: 1;
          }
          
          .group .opacity-0 {
            opacity: 0.8;
          }
          
          /* Better video visibility on touch devices */
          .mobile-video {
            opacity: 1 !important;
          }
        }
        
        /* Video loading improvements for all devices */
        video {
          opacity: 0.8;
          transition: opacity 0.5s ease-in-out;
        }
        
        video[data-loaded="true"] {
          opacity: 1;
        }
        
        /* Smooth video transitions */
        .video-container {
          position: relative;
          overflow: hidden;
        }
        
        .video-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, #7c3aed, #a855f7);
          opacity: 0.1;
          z-index: 1;
          transition: opacity 0.3s ease;
        }
        
        .video-container:hover::before {
          opacity: 0;
        }
        `}
      </style>
    </section>
  );
};

export default Portfolio;
