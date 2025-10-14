import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Wand2 } from "lucide-react";
import { paintColors, type ColorCategory } from "../data/colors";
import { useMagicWand } from "../hooks/useMagicWand";

export const ApplyPaintPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { image } = location.state || {};

  // State
  const [activeColor, setActiveColor] = useState<string>("#F8F4F0");
  const [tolerance, setTolerance] = useState<number>(30);

  // Canvas Refs
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);

  // Our new Magic Wand Hook
  const { selectAndFill } = useMagicWand(
    imageCanvasRef.current,
    paintCanvasRef.current
  );

  // Effect to draw the initial image
  useEffect(() => {
    if (image && imageCanvasRef.current) {
      const canvas = imageCanvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        const img = new window.Image();
        img.src = image;
        img.onload = () => {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          if (paintCanvasRef.current) {
            paintCanvasRef.current.width = img.naturalWidth;
            paintCanvasRef.current.height = img.naturalHeight;
          }
          context.drawImage(img, 0, 0);
        };
      }
    }
  }, [image]);

  const getCoords = useCallback(
    (
      event: React.MouseEvent<HTMLCanvasElement>
    ): { x: number; y: number } | null => {
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCoords(event);
    if (coords) {
      selectAndFill(coords.x, coords.y, activeColor, tolerance);
    }
  };

  const handleDone = () => {
    const imageCanvas = imageCanvasRef.current;
    const paintCanvas = paintCanvasRef.current;
    if (imageCanvas && paintCanvas) {
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = imageCanvas.width;
      finalCanvas.height = imageCanvas.height;
      const finalCtx = finalCanvas.getContext("2d");
      if (finalCtx) {
        finalCtx.drawImage(imageCanvas, 0, 0);
        finalCtx.drawImage(paintCanvas, 0, 0);
        const finalImage = finalCanvas.toDataURL("image/png");
        navigate("/output", { state: { image: finalImage } });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#F8F4F0]">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-[#F8F4F0]/80 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="p-2">
          {" "}
          <ArrowLeft size={24} />{" "}
        </button>
        <h1 className="flex-1 pr-10 text-xl font-bold text-center">
          Apply Paint
        </h1>
      </header>

      <div className="relative w-full h-[55vh] bg-gray-900 flex items-center justify-center">
        <canvas
          ref={imageCanvasRef}
          className="absolute max-w-full max-h-full object-contain"
        />
        <canvas
          ref={paintCanvasRef}
          onClick={handleCanvasClick}
          className="absolute max-w-full max-h-full object-contain cursor-crosshair"
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

      <main className="flex-1 overflow-y-auto pb-28">
        <div className="p-4 bg-white/50 border-b">
          <label
            htmlFor="tolerance"
            className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
          >
            <Wand2 size={16} /> Selection Tolerance
          </label>
          <input
            id="tolerance"
            type="range"
            min="5"
            max="100"
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

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
            <div className="grid grid-cols-4 gap-4 px-6 sm:grid-cols-6">
              {category.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setActiveColor(color.hex)}
                  className={`relative w-full aspect-square rounded-xl shadow-lg border-2 transition-all ${
                    activeColor === color.hex
                      ? "border-blue-500 ring-2 ring-blue-500"
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
