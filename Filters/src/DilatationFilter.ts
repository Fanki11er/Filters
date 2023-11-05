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
        const index = (y * width + x) * 4;

        let maxRed = 0;
        let maxGreen = 0;
        let maxBlue = 0;

        // Iteruj przez obszar otoczenia w oparciu o promień.
        for (let dy = -this.radius; dy <= this.radius; dy++) {
          for (let dx = -this.radius; dx <= this.radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const neighborIndex = (ny * width + nx) * 4;
              // Aktualizuj maksymalne wartości koloru w obszarze otoczenia.
              maxRed = Math.max(maxRed, imageData[neighborIndex]);
              maxGreen = Math.max(maxGreen, imageData[neighborIndex + 1]);
              maxBlue = Math.max(maxBlue, imageData[neighborIndex + 2]);
            }
          }
        }

        // Zapisz maksymalne wartości koloru jako wynik dylatacji.
        outputData[index] = maxRed;
        outputData[index + 1] = maxGreen;
        outputData[index + 2] = maxBlue;
        outputData[index + 3] = imageData[index + 3]; // Przepisujemy składową alfa.
      }
      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    // Oczekiwanie na zakończenie wszystkich asynchronicznych operacji.

    const imageDataWithFilter = new ImageData(outputData, width, height);

    this.ctx?.putImageData(imageDataWithFilter, 0, 0);
  };
}
