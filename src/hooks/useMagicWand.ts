import { useCallback } from "react";

// Helper function to get pixel data index
const getPixelIndex = (x: number, y: number, width: number) =>
  (y * width + x) * 4;

// Helper to compare colors based on a tolerance
const colorsMatch = (
  c1: Uint8ClampedArray,
  c2: Uint8ClampedArray,
  tolerance: number
) => {
  return (
    Math.abs(c1[0] - c2[0]) < tolerance &&
    Math.abs(c1[1] - c2[1]) < tolerance &&
    Math.abs(c1[2] - c2[2]) < tolerance &&
    Math.abs(c1[3] - c2[3]) < tolerance
  );
};

export const useMagicWand = (
  imageCanvas: HTMLCanvasElement | null,
  paintCanvas: HTMLCanvasElement | null
) => {
  const selectAndFill = useCallback(
    (x: number, y: number, color: string, tolerance: number) => {
      if (!imageCanvas || !paintCanvas) return;

      const imgCtx = imageCanvas.getContext("2d", { willReadFrequently: true });
      const paintCtx = paintCanvas.getContext("2d");
      if (!imgCtx || !paintCtx) return;

      const { width, height } = imageCanvas;
      const imageData = imgCtx.getImageData(0, 0, width, height);
      const { data } = imageData;

      // --- Flood Fill Algorithm ---
      const startIdx = getPixelIndex(Math.floor(x), Math.floor(y), width);
      const startColor = data.slice(startIdx, startIdx + 4);

      const queue = [[Math.floor(x), Math.floor(y)]];
      const visited = new Set<number>();
      visited.add(startIdx);

      const selectionMask = new Uint8ClampedArray(data.length);

      while (queue.length > 0) {
        const [curX, curY] = queue.shift()!;

        const currentIdx = getPixelIndex(curX, curY, width);
        const currentColor = data.slice(currentIdx, currentIdx + 4);

        if (colorsMatch(startColor, currentColor, tolerance)) {
          // Mark this pixel as part of the selection
          selectionMask[currentIdx] = 255;
          selectionMask[currentIdx + 1] = 0;
          selectionMask[currentIdx + 2] = 0;
          selectionMask[currentIdx + 3] = 70; // semi-transparent red for visual feedback

          // Check neighbors
          const neighbors = [
            [curX + 1, curY],
            [curX - 1, curY],
            [curX, curY + 1],
            [curX, curY - 1],
          ];
          for (const [nx, ny] of neighbors) {
            const neighborIdx = getPixelIndex(nx, ny, width);
            if (
              nx >= 0 &&
              nx < width &&
              ny >= 0 &&
              ny < height &&
              !visited.has(neighborIdx)
            ) {
              visited.add(neighborIdx);
              queue.push([nx, ny]);
            }
          }
        }
      }

      // Temporarily show the selection mask
      const maskImageData = new ImageData(selectionMask, width, height);
      paintCtx.putImageData(maskImageData, 0, 0);

      // After a delay, clear the mask and apply the final blended color
      setTimeout(() => {
        paintCtx.clearRect(0, 0, width, height);
        // Set the blend mode for realistic color application
        paintCtx.globalCompositeOperation = "multiply";
        paintCtx.fillStyle = color;

        // Re-draw the selection, but this time with the final color and blend mode
        for (let i = 0; i < selectionMask.length; i += 4) {
          if (selectionMask[i] === 255) {
            // If this pixel was in our selection
            const px = (i / 4) % width;
            const py = Math.floor(i / 4 / width);
            paintCtx.fillRect(px, py, 1, 1);
          }
        }
        // Reset blend mode to default
        paintCtx.globalCompositeOperation = "source-over";
      }, 300); // 300ms delay to show the red selection mask
    },
    [imageCanvas, paintCanvas]
  );

  return { selectAndFill };
};
