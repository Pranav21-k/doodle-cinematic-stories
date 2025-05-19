
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type VideoUploaderProps = {
  onVideoUploaded?: (file: File, previewUrl: string) => void;
  className?: string;
};

const VideoUploader = ({ onVideoUploaded, className }: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
      alert('Please upload a video file.');
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
        
        // Call the callback if provided
        if (onVideoUploaded) {
          onVideoUploaded(file, previewUrl);
        }
      }
    }, 300);
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
          <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
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
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <video 
            src={videoPreview} 
            controls 
            className="w-full h-64 object-cover"
          />
          <Button
            variant="secondary"
            className="absolute bottom-4 right-4"
            onClick={() => {
              setVideoPreview(null);
              setUploadProgress(0);
            }}
          >
            Replace Video
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
