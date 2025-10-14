import { useCallback } from "react";

// Helper function to get a pixel's index in the image data array
const getPixelIndex = (x: number, y: number, width: number) =>
  (y * width + x) * 4;

// Helper to compare two colors based on a tolerance threshold
const colorsMatch = (
  data: Uint8ClampedArray,
  index1: number,
  index2: number,
  tolerance: number
) => {
  const r1 = data[index1],
    g1 = data[index1 + 1],
    b1 = data[index1 + 2],
    a1 = data[index1 + 3];
  const r2 = data[index2],
    g2 = data[index2 + 1],
    b2 = data[index2 + 2],
    a2 = data[index2 + 3];

  return (
    Math.abs(r1 - r2) < tolerance &&
    Math.abs(g1 - g2) < tolerance &&
    Math.abs(b1 - b2) < tolerance &&
    Math.abs(a1 - a2) < tolerance
  );
};

export const useMagicWand = (
  imageCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectionCanvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const createSelectionMask = useCallback(
    (x: number, y: number, tolerance: number) => {
      const imageCanvas = imageCanvasRef.current;
      const selectionCanvas = selectionCanvasRef.current;
      if (!imageCanvas || !selectionCanvas) return;

      const imgCtx = imageCanvas.getContext("2d", { willReadFrequently: true });
      const selCtx = selectionCanvas.getContext("2d");
      if (!imgCtx || !selCtx) return;

      const { width, height } = imageCanvas;
      selCtx.clearRect(0, 0, width, height); // Clear previous selection

      const imageData = imgCtx.getImageData(0, 0, width, height);
      const { data } = imageData;

      const startIdx = getPixelIndex(Math.floor(x), Math.floor(y), width);

      const queue: [number, number][] = [[Math.floor(x), Math.floor(y)]];
      const visited = new Set<number>([startIdx]);

      const selectionMask = new Uint8ClampedArray(data.length);

      while (queue.length > 0) {
        const [curX, curY] = queue.shift()!;
        const currentIdx = getPixelIndex(curX, curY, width);

        // Mark this pixel as part of the selection for visual feedback
        selectionMask[currentIdx] = 255; // R
        selectionMask[currentIdx + 1] = 0; // G
        selectionMask[currentIdx + 2] = 0; // B
        selectionMask[currentIdx + 3] = 70; // Alpha (semi-transparent)

        const neighbors = [
          [curX + 1, curY],
          [curX - 1, curY],
          [curX, curY + 1],
          [curX, curY - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighborIdx = getPixelIndex(nx, ny, width);
            if (
              !visited.has(neighborIdx) &&
              colorsMatch(data, startIdx, neighborIdx, tolerance)
            ) {
              visited.add(neighborIdx);
              queue.push([nx, ny]);
            }
          }
        }
      }

      // Draw the visual selection mask
      const maskImageData = new ImageData(selectionMask, width, height);
      selCtx.putImageData(maskImageData, 0, 0);

      return visited; // Return the set of selected pixel indices
    },
    [imageCanvasRef, selectionCanvasRef]
  );

  return { createSelectionMask };
};
