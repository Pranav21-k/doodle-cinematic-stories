import React from 'react';
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import VideoPlayer from './VideoPlayer';

type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  featured?: boolean;
};

type VideoGridProps = {
  projects: Project[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

const VideoGrid: React.FC<VideoGridProps> = ({ projects, activeFilter, onFilterChange }) => {
  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'fashion', name: 'Fashion & Modeling' },
    { id: 'fitness', name: 'Fitness & Training' },
    { id: 'events', name: 'Events & Nightlife' },
    { id: 'brand', name: 'Brand Collaborations' }
  ];

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  if (projects.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue="all" onValueChange={onFilterChange}>
      <TabsList className="w-full flex justify-center mb-8 bg-transparent">
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
        <TabsContent key={cat.id} value={cat.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group relative overflow-hidden rounded-lg aspect-video hover:shadow-xl transition-shadow duration-300">
                <VideoPlayer
                  videoUrl={project.videoUrl}
                  thumbnail={project.thumbnail}
                  title={project.title}
                  autoPlay={true}
                  muted={true}
                  loop={true}
                />
                
                {/* Overlay with information */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                  <p className="text-white/70 text-sm mb-4">Client: {project.client}</p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-fit bg-purple-600 hover:bg-purple-700">
                        <Play size={16} className="mr-2" />
                        Watch Full Video
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{project.title}</DialogTitle>
                        <DialogDescription>Client: {project.client}</DialogDescription>
                      </DialogHeader>
                      <div className="aspect-video w-full">
                        <VideoPlayer
                          videoUrl={project.videoUrl}
                          thumbnail={project.thumbnail}
                          title={project.title}
                          controls={true}
                          autoPlay={true}
                          muted={false}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default VideoGrid;