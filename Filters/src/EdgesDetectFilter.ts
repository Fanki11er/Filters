export class EdgesDetectFilter {
  ctx;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  applySobelEdgeDetection = async (originalImageData: ImageData | null) => {
    if (!originalImageData) {
      return;
    }

    const { data: imageData, width, height } = originalImageData;
    const outputData = new Uint8ClampedArray(imageData.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const grayscaleValues = [];

        for (let nY = -1; nY <= 1; nY++) {
          for (let nX = -1; nX <= 1; nX++) {
            const neighborX = x + nX;
            const neighborY = y + nY;

            if (
              neighborX >= 0 &&
              neighborY < width &&
              neighborY >= 0 &&
              neighborY < height
            ) {
              const neighborIndex = (neighborY * width + neighborX) * 4;
              const redValue = imageData[neighborIndex];
              const greenValue = imageData[neighborIndex + 1];
              const blueValue = imageData[neighborIndex + 2];

              const grayscaleValue =
                0.2989 * redValue + 0.587 * greenValue + 0.114 * blueValue;
              grayscaleValues.push(grayscaleValue);
            }
          }
        }

        const gx =
          grayscaleValues[2] +
          2 * grayscaleValues[5] +
          grayscaleValues[8] -
          grayscaleValues[0] -
          2 * grayscaleValues[3] -
          grayscaleValues[6];
        const gy =
          grayscaleValues[0] +
          2 * grayscaleValues[1] +
          grayscaleValues[2] -
          grayscaleValues[6] -
          2 * grayscaleValues[7] -
          grayscaleValues[8];

        const intensity = Math.sqrt(gx * gx + gy * gy);

        outputData[pixelIndex] = intensity;
        outputData[pixelIndex + 1] = intensity;
        outputData[pixelIndex + 2] = intensity;
        outputData[pixelIndex + 3] = imageData[pixelIndex + 3]; // Przepisujemy składową alfa.
      }
      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    const imageDataWithFilter = new ImageData(outputData, width, height);

    this.ctx?.putImageData(imageDataWithFilter, 0, 0);
  };
}
