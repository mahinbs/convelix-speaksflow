
import React from 'react';

interface VideoBackgroundProps {
  src: string;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ src, className = "" }) => {
  // Add autoplay parameters to the Cloudinary URL
  const getAutoplayVideoUrl = (originalSrc: string) => {
    if (originalSrc.includes('player.cloudinary.com')) {
      // Add autoplay, muted, loop, and controls parameters
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}autoplay=true&muted=true&loop=true&controls=false&showinfo=false&rel=0&modestbranding=1`;
    }
    return originalSrc;
  };

  const videoUrl = getAutoplayVideoUrl(src);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <iframe
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          border: 'none',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"
        allowFullScreen
        title="Background Video"
        loading="eager"
      />
    </div>
  );
};
