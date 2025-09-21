
import React, { useState, useEffect } from 'react';
import { Video } from 'lucide-react';
import VideoShowcase from './portfolio/VideoShowcase';
import VideoGrid from './portfolio/VideoGrid';

// Portfolio item type
type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  featured?: boolean;
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load videos from localStorage
  useEffect(() => {
    try {
      const savedVideos = localStorage.getItem('portfolio_videos');
      if (savedVideos) {
        const parsedVideos = JSON.parse(savedVideos);
        if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
          setProjects(parsedVideos);
        }
      }
    } catch (error) {
      console.error('Error loading videos from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <section id="portfolio" className="section-padding bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-2xl font-medium mb-4 text-gray-600">Loading Videos...</h3>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of cinematic videos across different categories.
          </p>
        </div>

        {/* Featured Video Showcase */}
        <VideoShowcase projects={projects} />

        {/* Category Tabs and Grid */}
        <VideoGrid 
          projects={projects} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        {/* Empty state */}
        {projects.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-gray-600">No videos found</h3>
            <p className="text-gray-500">Videos will appear here once they're loaded.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
