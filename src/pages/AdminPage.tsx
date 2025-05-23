
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import VideoUploader from "@/components/VideoUploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Portfolio item type (same as in Portfolio.tsx)
type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  featured?: boolean;
};

const STORAGE_KEY = 'portfolio_videos';

const AdminPage = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Load videos from localStorage on component mount
    const savedVideos = localStorage.getItem(STORAGE_KEY);
    if (savedVideos) {
      try {
        return JSON.parse(savedVideos);
      } catch (error) {
        console.error('Failed to parse saved videos', error);
        return [];
      }
    }
    return [];
  });

  const handleVideosUploaded = (videos: {file: File, url: string}[]) => {
    // Create new project entries from the uploaded videos
    const newProjects = videos.map(video => {
      // Extract filename without extension to use as title
      const filename = video.file.name.split('.')[0].replace(/_/g, ' ');
      
      return {
        id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique ID
        title: filename,
        client: 'New Client', // Default client name
        category: 'fashion', // Default category
        thumbnail: video.url,
        videoUrl: video.url,
        featured: false
      };
    });
    
    // Add new projects to state
    const updatedProjects = [...projects, ...newProjects];
    setProjects(updatedProjects);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    toast.success(`${newProjects.length} videos added to portfolio`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Videos</h2>
          <p className="text-gray-600 mb-6">
            Upload videos to add to your portfolio. These videos will be saved to your browser's local storage.
          </p>
          
          <VideoUploader
            onVideosUploaded={handleVideosUploaded}
            multiple={true}
            buttonText="Add Videos to Portfolio"
          />
          
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Important Notes:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Videos are stored in your browser's local storage.</li>
              <li>This admin page is only visible during development.</li>
              <li>When you publish your site, visitors will not see this admin page or be able to upload videos.</li>
              <li>To manage your existing videos, use the main portfolio page.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
