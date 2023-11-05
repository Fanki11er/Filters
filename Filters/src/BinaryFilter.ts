export class BinaryFilter {
  ctx;
  threshold;
  binaryImageData: ImageData | null = null;

  constructor(ctx: CanvasRenderingContext2D, threshold: number) {
    this.ctx = ctx;
    this.threshold = threshold;
  }

  convertToBinaryImage = async (originalImageData: ImageData | null) => {
    if (!originalImageData) {
      return;
    }

    const { data: imageData, width, height } = originalImageData;
    const outputData = new Uint8ClampedArray(imageData.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        const brightness =
          (imageData[pixelIndex] +
            imageData[pixelIndex + 1] +
            imageData[pixelIndex + 2]) /
          3;

        const binaryValue = brightness > this.threshold ? 0 : 255;

        outputData[pixelIndex] = binaryValue;
        outputData[pixelIndex + 1] = binaryValue;
        outputData[pixelIndex + 2] = binaryValue;
        outputData[pixelIndex + 3] = 255;
      }
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    const imageDataWithFilter = new ImageData(outputData, width, height);

    this.binaryImageData = imageDataWithFilter;

    this.ctx?.putImageData(imageDataWithFilter, 0, 0);
  };

  getBinaryImageData() {
    return this.binaryImageData;
  }
}
