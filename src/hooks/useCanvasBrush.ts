import { useEffect, useRef, useState } from "react";

export const useCanvasBrush = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  color: string,
  brushSize: number = 30
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, [canvasRef, color, brushSize]);

  const getCoords = (
    event: MouseEvent | TouchEvent
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in event ? event.touches[0] : null;
    const clientX = touch ? touch.clientX : (event as MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (event as MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (event: MouseEvent | TouchEvent) => {
    const coords = getCoords(event);
    if (!coords || !contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    event.preventDefault();
  };

  const draw = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoords(event);
    if (!coords || !contextRef.current) return;
    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();
    event.preventDefault();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, [isDrawing, startDrawing, draw, stopDrawing]);
};
