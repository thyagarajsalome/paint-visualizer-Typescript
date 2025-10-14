import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Wand2,
  Brush,
  Eraser,
  MinusCircle,
} from "lucide-react";
import { paintColors, type ColorCategory } from "../data/colors";
import { useMagicWand } from "../hooks/useMagicWand";

export const ApplyPaintPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { image } = location.state || {};

  const [activeColor, setActiveColor] = useState<string>("#F8F4F0");
  const [tolerance, setTolerance] = useState<number>(30);
  const [selection, setSelection] = useState<Set<number> | null>(null);

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);

  const { createSelectionMask } = useMagicWand(
    imageCanvasRef,
    selectionCanvasRef
  );

  useEffect(() => {
    if (image && imageCanvasRef.current) {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = image;
      img.onload = () => {
        const canvases = [
          imageCanvasRef.current,
          selectionCanvasRef.current,
          paintCanvasRef.current,
        ];
        canvases.forEach((canvas) => {
          if (canvas) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }
        });
        const context = imageCanvasRef.current?.getContext("2d");
        context?.drawImage(img, 0, 0);
      };
    }
  }, [image]);

  const getCoords = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
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
      const selectedPixels = createSelectionMask(coords.x, coords.y, tolerance);
      setSelection(selectedPixels);
    }
  };

  const handleApplyPaint = () => {
    const paintCanvas = paintCanvasRef.current;
    if (!paintCanvas || !selection || selection.size === 0) return;

    const { width } = paintCanvas;
    const paintCtx = paintCanvas.getContext("2d");
    if (!paintCtx) return;

    paintCtx.globalCompositeOperation = "multiply";
    paintCtx.fillStyle = activeColor;

    selection.forEach((index) => {
      const x = (index / 4) % width;
      const y = Math.floor(index / 4 / width);
      paintCtx.fillRect(x, y, 1, 1);
    });

    paintCtx.globalCompositeOperation = "source-over";
    handleClearSelection();
  };

  const handleClearSelection = () => {
    const selectionCanvas = selectionCanvasRef.current;
    if (selectionCanvas) {
      const ctx = selectionCanvas.getContext("2d");
      ctx?.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    }
    setSelection(null);
  };

  const handleClearPaint = () => {
    const paintCanvas = paintCanvasRef.current;
    if (paintCanvas) {
      const ctx = paintCanvas.getContext("2d");
      ctx?.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
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
      <header className="flex items-center p-4 bg-white/80 backdrop-blur-sm z-10">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-xl font-bold text-center pr-10">
          Apply Paint
        </h1>
      </header>

      <div className="relative w-full h-[50vh] bg-gray-800 flex items-center justify-center">
        <canvas
          ref={imageCanvasRef}
          className="absolute max-w-full max-h-full object-contain"
        />
        <canvas
          ref={paintCanvasRef}
          className="absolute max-w-full max-h-full object-contain pointer-events-none"
        />
        <canvas
          ref={selectionCanvasRef}
          onClick={handleCanvasClick}
          className="absolute max-w-full max-h-full object-contain cursor-crosshair"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={handleDone}
            className="flex items-center justify-center h-12 gap-2 px-4 font-bold text-white transition bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
          >
            <Check size={20} />
            <span>Done</span>
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 bg-white/50 border-t border-b">
          <label
            htmlFor="tolerance"
            className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
          >
            <Wand2 size={16} /> Selection Tolerance
          </label>
          <input
            id="tolerance"
            type="range"
            min="1"
            max="200"
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <button
            onClick={handleApplyPaint}
            disabled={!selection}
            className="flex items-center justify-center w-full h-12 gap-2 font-bold text-white transition bg-blue-600 rounded-lg shadow disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            <Brush size={20} /> Apply Color
          </button>
          <button
            onClick={handleClearSelection}
            disabled={!selection}
            className="flex items-center justify-center w-full h-12 gap-2 font-bold text-gray-700 transition bg-gray-200 rounded-lg shadow disabled:opacity-50 hover:bg-gray-300"
          >
            <MinusCircle size={20} /> Deselect
          </button>
          <button
            onClick={handleClearPaint}
            className="col-span-2 lg:col-span-1 flex items-center justify-center w-full h-12 gap-2 font-bold text-red-700 transition bg-red-100 rounded-lg shadow hover:bg-red-200"
          >
            <Eraser size={20} /> Clear All Paint
          </button>
        </div>

        {paintColors.map((category: ColorCategory) => (
          <div key={category.name} className="pt-2 space-y-4">
            <div
              className="flex items-center justify-center w-full h-20"
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
                  className={`w-full aspect-square rounded-xl shadow-lg border-2 transition-all ${
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
