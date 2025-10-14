import { useCallback } from "react";

// A more accurate color distance function (Euclidean distance)
const getColorDistance = (
  c1: [number, number, number, number],
  c2: [number, number, number, number]
) => {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
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
      if (!imageCanvas || !selectionCanvas) return null;

      const imgCtx = imageCanvas.getContext("2d", { willReadFrequently: true });
      const selCtx = selectionCanvas.getContext("2d");
      if (!imgCtx || !selCtx) return null;

      const { width, height } = imageCanvas;
      selCtx.clearRect(0, 0, width, height);

      const imageData = imgCtx.getImageData(0, 0, width, height);
      const { data } = imageData;

      const startX = Math.floor(x);
      const startY = Math.floor(y);
      const startIdx = (startY * width + startX) * 4;
      const startColor: [number, number, number, number] = [
        data[startIdx],
        data[startIdx + 1],
        data[startIdx + 2],
        data[startIdx + 3],
      ];

      const queue: [number, number][] = [[startX, startY]];
      const visited = new Uint8Array(width * height);
      const selectionIndices = new Set<number>();

      visited[startY * width + startX] = 1;

      while (queue.length > 0) {
        const [curX, curY] = queue.shift()!;
        const currentIdx = (curY * width + curX) * 4;

        selectionIndices.add(currentIdx);

        const neighbors: [number, number][] = [
          [curX + 1, curY],
          [curX - 1, curY],
          [curX, curY + 1],
          [curX, curY - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (
            nx >= 0 &&
            nx < width &&
            ny >= 0 &&
            ny < height &&
            visited[ny * width + nx] === 0
          ) {
            visited[ny * width + nx] = 1;
            const neighborIdx = (ny * width + nx) * 4;
            const neighborColor: [number, number, number, number] = [
              data[neighborIdx],
              data[neighborIdx + 1],
              data[neighborIdx + 2],
              data[neighborIdx + 3],
            ];

            if (getColorDistance(startColor, neighborColor) <= tolerance) {
              queue.push([nx, ny]);
            }
          }
        }
      }

      // Draw the visual selection mask
      const maskImageData = selCtx.createImageData(width, height);
      selectionIndices.forEach((index) => {
        maskImageData.data[index] = 255; // R
        maskImageData.data[index + 1] = 0; // G
        maskImageData.data[index + 2] = 0; // B
        maskImageData.data[index + 3] = 70; // Alpha
      });
      selCtx.putImageData(maskImageData, 0, 0);

      return selectionIndices;
    },
    [imageCanvasRef, selectionCanvasRef]
  );

  return { createSelectionMask };
};
