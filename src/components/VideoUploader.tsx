
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

type VideoUploaderProps = {
  onVideoUploaded?: (file: File, previewUrl: string) => void;
  onVideosUploaded?: (files: {file: File, url: string}[]) => void;
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
  adminOnly?: boolean; // Prop to control admin-only access
  multiple?: boolean; // Allow multiple file uploads
  highQuality?: boolean; // New prop for high quality options
};

const VideoUploader = ({ 
  onVideoUploaded, 
  onVideosUploaded,
  className, 
  buttonText = "Upload Video", 
  showPreview = true,
  adminOnly = true, // Default to true - only admins can upload
  multiple = false, // Default to single upload
  highQuality = true // Default to high quality
}: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<{file: File, url: string}[]>([]);
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
      if (multiple) {
        handleMultipleVideoFiles(Array.from(files));
      } else {
        handleVideoFile(files[0]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        handleMultipleVideoFiles(Array.from(files));
      } else {
        handleVideoFile(files[0]);
      }
    }
  };

  const handleVideoFile = (file: File) => {
    // Check if the file is a video
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file.');
      return;
    }

    // Always use high quality mode - no size restrictions
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.info(`Processing ${fileSizeMB}MB high-quality video`);

    // Simulate upload progress
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // Create a URL for the video preview - using original quality
        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
        toast.success(`${file.name} (${fileSizeMB}MB) uploaded successfully at original quality`);
        
        // Call the callback if provided
        if (onVideoUploaded) {
          onVideoUploaded(file, previewUrl);
        }
      }
    }, 300);
  };

  const handleMultipleVideoFiles = (files: File[]) => {
    // Filter only video files
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    if (videoFiles.length === 0) {
      toast.error('Please upload video files.');
      return;
    }
    
    // Always use high quality mode - no size limits
    const totalSizeMB = videoFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
    toast.info(`Processing ${videoFiles.length} videos (${totalSizeMB.toFixed(2)}MB total) at original quality`);
    
    // Simulate upload progress
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // Create preview URLs for all files - using original quality
        const newPreviews = videoFiles.map(file => ({
          file,
          url: URL.createObjectURL(file)
        }));
        
        setVideoPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        toast.success(`${videoFiles.length} video(s) uploaded successfully at original quality`);
        
        // Call the callback if provided
        if (onVideosUploaded) {
          onVideosUploaded(newPreviews);
        }
      }
    }, 200); // Speed up upload simulation a bit
  };

  const resetUploader = () => {
    setVideoPreview(null);
    setVideoPreviews([]);
    setUploadProgress(0);
  };

  return (
    <div 
      className={`w-full ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {(!videoPreview && videoPreviews.length === 0) ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors 
            ${isDragging ? 'border-doodle-purple bg-purple-50' : 'border-gray-300'}`}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{buttonText}</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            {multiple ? 'Select multiple videos or drag & drop them here' : 'Drag & drop your video here or click to browse'}
          </p>
          
          <div className="w-full max-w-xs">
            <Label htmlFor="video-upload" className="sr-only">Choose video</Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="cursor-pointer"
              multiple={multiple}
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
          
          <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-100">
            <p className="text-xs text-green-700 font-medium">
              <span className="font-bold">Premium Quality:</span> Videos will be uploaded at their original quality with no compression
            </p>
          </div>
        </div>
      ) : showPreview ? (
        <div className="space-y-4">
          {videoPreview && !multiple && (
            <div className="relative rounded-lg overflow-hidden">
              <video 
                src={videoPreview} 
                controls 
                className="w-full h-64 object-contain bg-black"
              />
              <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                High Quality
              </div>
            </div>
          )}
          
          {videoPreviews.length > 0 && multiple && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {videoPreviews.map((video, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden">
                  <video 
                    src={video.url} 
                    muted
                    className="w-full h-32 object-contain bg-black"
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                  <div className="absolute bottom-2 right-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    {video.file.name.substring(0, 15)}...
                  </div>
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    HD
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={resetUploader}
            >
              Upload More Videos
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-2">
            {multiple && videoPreviews.length > 0 
              ? `${videoPreviews.length} high-quality videos uploaded successfully!` 
              : 'High-quality video uploaded successfully!'}
          </p>
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
