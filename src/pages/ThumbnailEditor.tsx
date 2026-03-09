import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ThumbnailEditor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Top bar with back button */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => navigate('/dashboard/thumbcraft')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ThumbCraft
        </button>
        <h1 className="text-xl font-bold text-white">🎨 Thumbnail Editor</h1>
        <div className="w-32"></div> {/* Spacer for centering */}
      </div>
      
      {/* Editor iframe */}
      <iframe 
        src="/thumb-craft/editor.html" 
        className="flex-1 w-full border-0"
        title="Thumbnail Editor"
      />
    </div>
  );
};

export default ThumbnailEditor;
