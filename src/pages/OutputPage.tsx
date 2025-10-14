import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Share2 } from "lucide-react";

export const OutputPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { image } = location.state || {};

  const handleSave = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "painted-room.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!navigator.share || !image) {
      alert("Sharing is not supported on this browser.");
      return;
    }
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "painted-room.png", { type: blob.type });
      await navigator.share({
        title: "My Painted Room",
        text: "Check out my new paint color!",
        files: [file],
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center p-4 border-b border-primary/20">
        <button onClick={() => navigate("/apply")} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 pr-10 text-xl font-bold text-center">Output</h1>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        {image ? (
          <div
            className="w-full max-w-lg aspect-[3/4] bg-center bg-no-repeat bg-cover rounded-xl shadow-lg"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className="w-full max-w-lg aspect-[3/4] flex items-center justify-center bg-gray-200 rounded-xl">
            <p>No final image to display.</p>
          </div>
        )}
      </main>

      <footer className="p-4 space-y-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save size={20} />
            <span>Save</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-gray-200 text-primary font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
