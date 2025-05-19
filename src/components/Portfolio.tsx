
import { useState } from 'react';
import { Play } from 'lucide-react';
import VideoUploader from './VideoUploader';
import { Button } from "@/components/ui/button";

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
  const [showUploader, setShowUploader] = useState(false);
  const [userVideos, setUserVideos] = useState<{file: File, url: string}[]>([]);
  
  // Sample portfolio projects (replace with your actual projects)
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

  // Filter categories
  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'commercial', name: 'Commercials' },
    { id: 'brand', name: 'Brand Films' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'social', name: 'Social Media' },
    { id: 'uploaded', name: 'Your Uploads' },
  ];

  const handleVideoUploaded = (file: File, previewUrl: string) => {
    const newVideo = { file, url: previewUrl };
    setUserVideos([...userVideos, newVideo]);
    
    // Add to projects
    const newProject = {
      id: projects.length + 1,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      client: "Your Upload",
      category: "uploaded",
      thumbnail: previewUrl,
      videoUrl: previewUrl,
    };
    
    setProjects([...projects, newProject]);
    setShowUploader(false);
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
          <h2 className="section-title animate-fade-in">Our Portfolio</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Showcasing our best work and creative capabilities across industries.
          </p>
        </div>
        
        {/* Upload Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-doodle-purple hover:bg-purple-700 text-white"
          >
            {showUploader ? 'Cancel Upload' : 'Upload Your Video'} 
          </Button>
        </div>
        
        {/* Video Uploader */}
        {showUploader && (
          <div className="mb-12 max-w-2xl mx-auto">
            <VideoUploader onVideoUploaded={handleVideoUploaded} />
          </div>
        )}
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeFilter === category.id 
                  ? 'bg-doodle-purple text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-video card-hover animate-zoom-in">
              {/* Project Thumbnail */}
              {project.category === 'uploaded' ? (
                <video
                  src={project.thumbnail}
                  className="w-full h-full object-cover"
                  muted
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
                <button className="w-12 h-12 rounded-full bg-doodle-purple text-white flex items-center justify-center">
                  <Play size={20} />
                </button>
              </div>
            </div>
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
