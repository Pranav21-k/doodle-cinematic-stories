import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

type VideoUploaderProps = {
  onVideoUploaded?: (file: File, previewUrl: string) => void;
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
  adminOnly?: boolean; // Prop to control admin-only access
};

const VideoUploader = ({ 
  onVideoUploaded, 
  className, 
  buttonText = "Upload Video", 
  showPreview = true,
  adminOnly = true // Default to true - only admins can upload
}: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  // In a real app, you would check if the current user is an admin
  const [isAdmin, setIsAdmin] = useState(true); // Default to true for testing

  // Don't render the component if it's admin-only and the user is not an admin
  if (adminOnly && !isAdmin) {
    return null;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleVideoFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleVideoFile(files[0]);
    }
  };

  const handleVideoFile = (file: File) => {
    // Check if the file is a video
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file.');
      return;
    }

    // Check file size (limited to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      toast.error('Video file is too large. Please upload a file smaller than 100MB.');
      return;
    }

    // Simulate upload progress
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // Create a URL for the video preview
        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
        toast.success('Video uploaded successfully!');
        
        // Call the callback if provided
        if (onVideoUploaded) {
          onVideoUploaded(file, previewUrl);
        }
      }
    }, 300);
  };

  const resetUploader = () => {
    setVideoPreview(null);
    setUploadProgress(0);
  };

  return (
    <div 
      className={`w-full ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!videoPreview ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors 
            ${isDragging ? 'border-doodle-purple bg-purple-50' : 'border-gray-300'}`}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{buttonText}</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Drag & drop your video here or click to browse
          </p>
          
          <div className="w-full max-w-xs">
            <Label htmlFor="video-upload" className="sr-only">Choose video</Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          
          {isUploading && (
            <div className="w-full max-w-xs mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-doodle-purple" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}
        </div>
      ) : showPreview ? (
        <div className="relative rounded-lg overflow-hidden">
          <video 
            src={videoPreview} 
            controls 
            className="w-full h-64 object-cover"
          />
          <Button
            variant="secondary"
            className="absolute bottom-4 right-4"
            onClick={resetUploader}
          >
            Replace Video
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-2">Video uploaded successfully!</p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetUploader}
          >
            Upload Another Video
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
