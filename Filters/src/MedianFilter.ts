export class MedianFilter {
  radius = 2;
  ctx;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  applyMedianFilter = async (originalImageData: ImageData | null) => {
    if (!originalImageData) {
      return;
    }

    const { data: imageData, width, height } = originalImageData;
    const outputData = new Uint8ClampedArray(imageData.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const redValues = [];
        const greenValues = [];
        const blueValues = [];

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
              redValues.push(imageData[neighborIndex]);
              greenValues.push(imageData[neighborIndex + 1]);
              blueValues.push(imageData[neighborIndex + 2]);
            }
          }
        }

        redValues.sort((a, b) => a - b);
        greenValues.sort((a, b) => a - b);
        blueValues.sort((a, b) => a - b);

        const medianIndex = redValues.length >> 1;
        outputData[index] = redValues[medianIndex];
        outputData[index + 1] = greenValues[medianIndex];
        outputData[index + 2] = blueValues[medianIndex];
        outputData[index + 3] = imageData[index + 3];
      }
      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    const imageDataWithFilter = new ImageData(outputData, width, height);

    this.ctx?.putImageData(imageDataWithFilter, 0, 0);
  };
}
