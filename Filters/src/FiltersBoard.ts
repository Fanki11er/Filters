import { ControlElement } from "./ControlElement";
import { EdgesDetectFilter } from "./EdgesDetectFilter";
import { FilterButton } from "./FilterButton";
import { ImageInput } from "./ImageInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { MedianFilter } from "./MedianFilter";
import { SmoothFilter } from "./SmoothFilter";

export class FiltersBoard {
  canvasWidth = 200;
  canvasHeight = 200;
  imageInput;
  canvas;
  ctx;
  originalImage: File | null = null;
  originalImageData: ImageData | null = null;
  loadingIndicator;

  smoothingFilterButton;
  medianFilterButton;
  edgeDetectFilterButton;
  resetFilterButton;

  smoothFilter;
  medianFilter;
  edgeDetectFilter;

  controlElements: ControlElement[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.ctx = canvas.getContext("2d");
    this.imageInput = new ImageInput("image_input", this.loadImage);

    this.loadingIndicator = new LoadingIndicator("loadingIndicator");

    if (this.imageInput) {
      this.controlElements.push(this.imageInput);
    }

    this.smoothingFilterButton = new FilterButton(
      "smoothing",
      this.handleUseSmoothFilter
    );

    if (this.smoothingFilterButton) {
      this.controlElements.push(this.smoothingFilterButton);
    }

    this.resetFilterButton = new FilterButton("resetFilter", this.resetFilter);

    if (this.resetFilterButton) {
      this.controlElements.push(this.resetFilterButton);
    }

    this.medianFilterButton = new FilterButton(
      "medianFilter",
      this.handleUseMedianFilter
    );
    if (this.medianFilterButton) {
      this.controlElements.push(this.medianFilterButton);
    }

    this.edgeDetectFilterButton = new FilterButton(
      "edgesDetectFilter",
      this.handleUseEdgeDetectFilter
    );
    if (this.medianFilterButton) {
      this.controlElements.push(this.medianFilterButton);
    }

    this.medianFilter = new MedianFilter(this.ctx!);
    this.smoothFilter = new SmoothFilter(this.ctx!);
    this.edgeDetectFilter = new EdgesDetectFilter(this.ctx!);
  }

  handleUseMedianFilter = async () => {
    this.disableAll();
    this.onIndicator();

    this.medianFilter
      .applyMedianFilter(this.originalImageData)
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.enableAll();
        this.offIndicator();
      });
  };

  handleUseSmoothFilter = async () => {
    this.disableAll();
    this.onIndicator();

    this.smoothFilter
      .applySmoothingFilter(this.originalImageData)
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.enableAll();
        this.offIndicator();
      });
  };

  handleUseEdgeDetectFilter = async () => {
    this.disableAll();
    this.onIndicator();

    this.edgeDetectFilter
      .applySobelEdgeDetectionAsync(this.originalImageData)
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.enableAll();
        this.offIndicator();
      });
  };

  loadImage = (file: File) => {
    this.originalImage = file;

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.src = event.target?.result as string;

      image.onload = () => {
        this.canvasWidth = image.width;
        this.canvasHeight = image.height;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        this.ctx!.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.ctx!.drawImage(image, 0, 0);

        const imageData = this.ctx!.getImageData(
          0,
          0,
          this.canvasWidth,
          this.canvasHeight
        );

        this.originalImageData = imageData;
      };
    };
    reader.readAsDataURL(file);
  };

  resetFilter = () => {
    if (this.originalImageData) {
      this.ctx!.putImageData(this.originalImageData!, 0, 0);
    }
  };

  private disableAll() {
    this.controlElements.forEach((element) => {
      element.disable();
    });
  }

  private enableAll() {
    this.controlElements.forEach((element) => {
      element.setActive();
    });
  }

  private onIndicator() {
    if (this.loadingIndicator) {
      this.loadingIndicator.setOn();
    }
  }

  private offIndicator() {
    if (this.loadingIndicator) {
      this.loadingIndicator.setOff();
    }
  }
}
