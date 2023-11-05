export class ErosionFilter {
  ctx;
  radius = 1;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  applyErosion = async (originalImageData: ImageData | null) => {
    if (!originalImageData) {
      return;
    }

    const { data: imageData, width, height } = originalImageData;

    const outputData = new Uint8ClampedArray(imageData.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        let minRed = 255;
        let minGreen = 255;
        let minBlue = 255;

        for (let nY = -this.radius; nY <= this.radius; nY++) {
          for (let nX = -this.radius; nX <= this.radius; nX++) {
            const neighborX = x + nX;
            const neighborY = y + nY;

            if (
              neighborX >= 0 &&
              neighborX < width &&
              neighborY >= 0 &&
              neighborY < height
            ) {
              const neighborIndex = (neighborY * width + neighborX) * 4;
              minRed = Math.min(minRed, imageData[neighborIndex]);
              minGreen = Math.min(minGreen, imageData[neighborIndex + 1]);
              minBlue = Math.min(minBlue, imageData[neighborIndex + 2]);
            }
          }
        }

        outputData[pixelIndex] = minRed;
        outputData[pixelIndex + 1] = minGreen;
        outputData[pixelIndex + 2] = minBlue;
        outputData[pixelIndex + 3] = imageData[pixelIndex + 3];
      }
      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    const imageDataWithFilter = new ImageData(outputData, width, height);

    this.ctx?.putImageData(imageDataWithFilter, 0, 0);
  };
}
