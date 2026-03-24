
import React from 'react';
import { Mic } from 'lucide-react';

interface AuthBackgroundProps {
  isPlaying: boolean;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ isPlaying }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Floating accents */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-brand-400 rounded-full animate-bounce opacity-50" style={{
        animationDelay: '0s'
      }}></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-brand-300 rounded-full animate-bounce opacity-40" style={{
        animationDelay: '1s'
      }}></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-brand-500 rounded-full animate-bounce opacity-45" style={{
        animationDelay: '2s'
      }}></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-brand-600 rounded-full animate-bounce opacity-50" style={{
        animationDelay: '1.5s'
      }}></div>
      
      {/* Voice waveform animation */}
      <div className="absolute top-1/4 left-1/4 flex space-x-1 opacity-25">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 bg-gradient-to-t from-brand-500 to-brand-300 rounded-full animate-pulse" 
            style={{
              height: `${Math.random() * 40 + 10}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>

      {/* Voice visualization when playing */}
      {isPlaying && (
        <div className="absolute bottom-1/4 left-1/3 flex items-center space-x-1">
          <Mic className="h-4 w-4 text-brand-500 mr-2" />
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-full animate-pulse" 
              style={{
                height: `${Math.random() * 20 + 8}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};
