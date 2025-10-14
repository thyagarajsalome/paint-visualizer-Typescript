import { useEffect, useRef, useState, useCallback } from "react";

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

  // CHANGED: Wrapped getCoords in useCallback
  const getCoords = useCallback(
    (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const touch = "touches" in event ? event.touches[0] : null;
      const clientX = touch ? touch.clientX : (event as MouseEvent).clientX;
      const clientY = touch ? touch.clientY : (event as MouseEvent).clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    },
    [canvasRef]
  );

  // CHANGED: Wrapped startDrawing in useCallback
  const startDrawing = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const coords = getCoords(event);
      if (!coords || !contextRef.current) return;
      contextRef.current.beginPath();
      contextRef.current.moveTo(coords.x, coords.y);
      setIsDrawing(true);
      event.preventDefault();
    },
    [getCoords]
  );

  // CHANGED: Wrapped draw in useCallback
  const draw = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const coords = getCoords(event);
      if (!coords || !contextRef.current) return;
      contextRef.current.lineTo(coords.x, coords.y);
      contextRef.current.stroke();
      event.preventDefault();
    },
    [isDrawing, getCoords]
  );

  // CHANGED: Wrapped stopDrawing in useCallback
  const stopDrawing = useCallback(() => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  }, []);

  // CHANGED: Updated the dependency array to use the memoized functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    // ADDED: { passive: false } for better mobile experience
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
  }, [startDrawing, draw, stopDrawing]); // The dependency array is now stable
};
