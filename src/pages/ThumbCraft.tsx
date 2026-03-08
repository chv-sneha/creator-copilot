import { useEffect } from 'react';

const ThumbCraft = () => {
  useEffect(() => {
    // Load external scripts
    const script = document.createElement('script');
    script.src = '/thumb-craft/js/app.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <iframe 
        src="/thumb-craft/index.html" 
        className="w-full h-screen border-0"
        title="ThumbCraft Video Thumbnail Generator"
      />
    </div>
  );
};

export default ThumbCraft;
