export class SmoothFilter {
  radius = 2;
  ctx;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  async applySmoothingFilter(originalImageData: ImageData | null) {
    if (!originalImageData) {
      return;
    }

    const { data: imageData, width, height } = originalImageData;
    const outputData = new Uint8ClampedArray(imageData.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        let totalRedValue = 0;
        let totalGreenValue = 0;
        let totalBlueValue = 0;

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
              totalRedValue += imageData[neighborIndex];
              totalGreenValue += imageData[neighborIndex + 1];
              totalBlueValue += imageData[neighborIndex + 2];
            }
          }
        }

        const numNeighbors = (2 * this.radius + 1) ** 2;
        outputData[pixelIndex] = totalRedValue / numNeighbors;
        outputData[pixelIndex + 1] = totalGreenValue / numNeighbors;
        outputData[pixelIndex + 2] = totalBlueValue / numNeighbors;
        outputData[pixelIndex + 3] = imageData[pixelIndex + 3];
      }
      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    const imageDataWithFilter = new ImageData(outputData, width, height);

    this.ctx?.putImageData(imageDataWithFilter, 0, 0);
  }
}
