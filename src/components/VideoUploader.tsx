
import { useState } from 'react';
import { Upload, FileType, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Progress } from '@/components/ui/progress'; 

type VideoUploaderProps = {
  onVideoUploaded?: (file: File, previewUrl: string) => void;
  onVideosUploaded?: (files: {file: File, url: string}[]) => void;
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
  adminOnly?: boolean; // Prop to control admin-only access
  multiple?: boolean; // Allow multiple file uploads
};

const VideoUploader = ({ 
  onVideoUploaded, 
  onVideosUploaded,
  className, 
  buttonText = "Upload Video", 
  showPreview = true,
  adminOnly = false, // Default to false - allow all users to upload
  multiple = false // Default to single upload
}: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<{file: File, url: string}[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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

    // Display file info for better user feedback
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.info(`Processing "${file.name}" (${fileSizeMB} MB)`);

    // Simulate upload progress - in a real app, this would be an actual upload
    simulateUploadSingle(file, (previewUrl) => {
      setVideoPreview(previewUrl);
      toast.success(`"${file.name}" uploaded successfully!`);
      
      // Call the callback if provided
      if (onVideoUploaded) {
        onVideoUploaded(file, previewUrl);
      }
    });
  };

  const handleMultipleVideoFiles = (files: File[]) => {
    // Filter only video files
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    if (videoFiles.length === 0) {
      toast.error('Please upload video files.');
      return;
    }
    
    // Check for any non-video files
    if (videoFiles.length < files.length) {
      toast.warning(`${files.length - videoFiles.length} file(s) skipped (not video format)`);
    }
    
    // Display total upload size for better user feedback
    const totalSizeMB = videoFiles.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
    toast.info(`Processing ${videoFiles.length} videos (${totalSizeMB.toFixed(2)} MB total)`);
    
    // Simulate upload progress
    simulateUploadMultiple(videoFiles, (newPreviews) => {
      setVideoPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      toast.success(`${videoFiles.length} video(s) uploaded successfully!`);
      
      // Call the callback if provided
      if (onVideosUploaded) {
        onVideosUploaded(newPreviews);
      }
    });
  };

  // Separate functions for single and multiple uploads to fix type issues
  const simulateUploadSingle = (file: File, onComplete: (result: string) => void) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Higher upload speed for better UX, but still show progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.2; // Faster progress curve
        
        if (newProgress >= 99) {
          clearInterval(interval);
          
          // Small delay before completing to show 100%
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(100);
            
            // Create preview URL - without compression
            const previewUrl = URL.createObjectURL(file);
            onComplete(previewUrl);
          }, 300);
        }
        
        return newProgress;
      });
    }, 100);
  };

  const simulateUploadMultiple = (
    files: File[], 
    onComplete: (result: {file: File, url: string}[]) => void
  ) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Higher upload speed for better UX, but still show progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.2; // Faster progress curve
        
        if (newProgress >= 99) {
          clearInterval(interval);
          
          // Small delay before completing to show 100%
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(100);
            
            // Create preview URLs - without compression
            const previews = files.map(file => ({
              file,
              url: URL.createObjectURL(file) // Direct object URL without compression
            }));
            onComplete(previews);
          }, 300);
        }
        
        return newProgress;
      });
    }, 100);
  };

  const resetUploader = () => {
    setVideoPreview(null);
    setVideoPreviews([]);
    setUploadProgress(0);
  };

  // Format file size in a user-friendly way
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
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
            ${isDragging ? 'border-doodle-purple bg-purple-50/20' : 'border-gray-300'}`}
        >
          <Upload className={`w-12 h-12 mb-4 ${isDragging ? 'text-doodle-purple' : 'text-gray-400'} transition-colors`} />
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
            <p className="text-xs text-gray-500 mt-2 text-center">
              Max size: 100MB per file. Supported formats: MP4, MOV, WebM, etc.
            </p>
          </div>
          
          {isUploading && (
            <div className="w-full max-w-xs mt-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      ) : showPreview ? (
        <div className="space-y-4">
          {videoPreview && !multiple && (
            <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <video 
                src={videoPreview} 
                controls 
                className="w-full h-64 object-contain"
              />
              <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Uploaded successfully
              </div>
            </div>
          )}
          
          {videoPreviews.length > 0 && multiple && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {videoPreviews.map((video, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <video 
                    src={video.url} 
                    muted
                    className="w-full h-32 object-cover"
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => {
                      const player = e.target as HTMLVideoElement;
                      player.pause();
                      player.currentTime = 0;
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-xs truncate pr-2 flex-1">
                        {video.file.name}
                      </span>
                      <span className="text-white/80 text-xs whitespace-nowrap">
                        {formatFileSize(video.file.size)}
                      </span>
                    </div>
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
        <div className="text-center py-6">
          <div className="flex items-center justify-center mb-3 text-green-600">
            <CheckCircle2 className="w-8 h-8 mr-2" />
          </div>
          <p className="text-green-600 font-medium mb-2">
            {multiple && videoPreviews.length > 0 
              ? `${videoPreviews.length} videos uploaded successfully!` 
              : 'Video uploaded successfully!'}
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
