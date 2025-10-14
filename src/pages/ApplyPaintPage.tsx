import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { paintColors, ColorCategory } from "../data/colors";
import { useCanvasBrush } from "../hooks/useCanvasBrush";

export const ApplyPaintPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { image } = location.state || {};

  const [activeColor, setActiveColor] = useState<string>("#F8F4F0");
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);

  useCanvasBrush(paintCanvasRef, activeColor, 30);

  useEffect(() => {
    if (image && imageCanvasRef.current) {
      const canvas = imageCanvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        const img = new window.Image();
        img.src = image;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          if (paintCanvasRef.current) {
            paintCanvasRef.current.width = img.width;
            paintCanvasRef.current.height = img.height;
          }
          context.drawImage(img, 0, 0);
        };
      }
    }
  }, [image]);

  const handleDone = () => {
    const imageCanvas = imageCanvasRef.current;
    const paintCanvas = paintCanvasRef.current;
    if (imageCanvas && paintCanvas) {
      const imageContext = imageCanvas.getContext("2d");
      if (imageContext) {
        imageContext.drawImage(paintCanvas, 0, 0);
        const finalImage = imageCanvas.toDataURL("image/png");
        navigate("/output", { state: { image: finalImage } });
      }
    }
  };

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <p className="mb-4">No image was uploaded. Please go back.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F4F0]">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-[#F8F4F0]/80 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 pr-10 text-xl font-bold text-center">
          Apply Paint
        </h1>
      </header>

      <div className="relative w-full aspect-[3/4] bg-gray-200">
        <canvas
          ref={imageCanvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        <canvas
          ref={paintCanvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={handleDone}
            className="flex items-center justify-center h-12 gap-2 px-4 font-bold text-white transition-opacity bg-primary rounded-lg shadow-lg hover:opacity-90"
          >
            <Check size={20} />
            <span>Done</span>
          </button>
        </div>
      </div>

      <main className="flex-1 pb-28 overflow-y-auto">
        {paintColors.map((category: ColorCategory) => (
          <div key={category.name} className="pt-6 space-y-4">
            <div
              className="flex items-center justify-center w-full h-24 rounded-b-xl"
              style={{ backgroundColor: category.swatchColor }}
            >
              <h2 className="text-xl font-semibold text-[#3C3C3C]">
                {category.name}
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-4 px-6">
              {category.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setActiveColor(color.hex)}
                  className={`relative w-full aspect-square rounded-xl shadow-lg border-2 transition-all ${
                    activeColor === color.hex
                      ? "border-[#7A8E89]"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select color ${color.name}`}
                />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
