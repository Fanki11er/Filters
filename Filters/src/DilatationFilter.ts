export class DilatationFilter {
  ctx;
  radius = 1;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  applyDilation = async (originalImageData: ImageData | null) => {
    if (!originalImageData) {
      return;
    }

    const { data: imageData, width, height } = originalImageData;

    const outputData = new Uint8ClampedArray(imageData.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        let maxRed = 0;
        let maxGreen = 0;
        let maxBlue = 0;

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

              maxRed = Math.max(maxRed, imageData[neighborIndex]);
              maxGreen = Math.max(maxGreen, imageData[neighborIndex + 1]);
              maxBlue = Math.max(maxBlue, imageData[neighborIndex + 2]);
            }
          }
        }

        outputData[pixelIndex] = maxRed;
        outputData[pixelIndex + 1] = maxGreen;
        outputData[pixelIndex + 2] = maxBlue;
        outputData[pixelIndex + 3] = imageData[pixelIndex + 3];
      }
      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    const imageDataWithFilter = new ImageData(outputData, width, height);

    this.ctx?.putImageData(imageDataWithFilter, 0, 0);
  };
}
