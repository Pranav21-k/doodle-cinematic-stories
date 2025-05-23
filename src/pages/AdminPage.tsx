
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import VideoUploader from "@/components/VideoUploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Upload } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Videos</h2>
          <p className="text-gray-600 mb-6">
            Upload videos to add to your portfolio. These videos will be saved to your browser's local storage.
          </p>
          
          <VideoUploader
            onVideosUploaded={handleVideosUploaded}
            multiple={true}
            buttonText="Add Videos to Portfolio"
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Videos</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={exportVideos} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export Videos to JSON
            </Button>
            
            <div className="relative">
              <input
                type="file"
                id="import-videos"
                accept=".json"
                onChange={importVideos}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload size={16} />
                Import Videos from JSON
              </Button>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Current Videos: {projects.length}</h3>
            
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <div key={project.id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-video">
                      <video 
                        src={project.videoUrl} 
                        className="w-full h-full object-cover"
                        muted
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-medium truncate">{project.title}</p>
                      <p className="text-sm text-gray-500">Category: {project.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No videos uploaded yet.</p>
            )}
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Important Notes:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Videos are stored in your browser's local storage.</li>
              <li>This admin page is only visible during development.</li>
              <li>When you publish your site, visitors will not see this admin page or be able to upload videos.</li>
              <li>To back up your videos, use the Export option and save the JSON file.</li>
              <li>To restore your videos (or transfer to another browser), use the Import option.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
