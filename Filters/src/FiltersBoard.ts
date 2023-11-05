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

    this.resetFilterButton = this.connectButton(
      "resetFilter",
      this.resetFilter
    );

    this.smoothingFilterButton = this.connectButton(
      "smoothing",
      this.handleUseSmoothFilter
    );

    this.medianFilterButton = this.connectButton(
      "medianFilter",
      this.handleUseMedianFilter
    );

    this.edgeDetectFilterButton = this.connectButton(
      "edgesDetectFilter",
      this.handleUseEdgeDetectFilter
    );

    this.medianFilter = new MedianFilter(this.ctx!);
    this.smoothFilter = new SmoothFilter(this.ctx!);
    this.edgeDetectFilter = new EdgesDetectFilter(this.ctx!);
  }

  private handleUseSmoothFilter = async () => {
    this.invokeFilterFunction(this.smoothFilter.applySmoothingFilter);
  };

  private handleUseMedianFilter = async () => {
    this.invokeFilterFunction(this.medianFilter.applyMedianFilter);
  };

  private handleUseEdgeDetectFilter = async () => {
    this.invokeFilterFunction(this.edgeDetectFilter.applySobelEdgeDetection);
  };

  private loadImage = (file: File) => {
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

  private resetFilter = () => {
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

  private invokeFilterFunction = (
    filterFunction: (imageData: ImageData | null) => Promise<void>
  ) => {
    this.resetFilter();
    this.disableAll();
    this.onIndicator();

    filterFunction(this.originalImageData)
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.enableAll();
        this.offIndicator();
      });
  };

  private connectButton(buttonId: string, handleFunction: () => void) {
    const button = new FilterButton(buttonId, handleFunction);

    if (button) {
      this.controlElements.push(button);
      return button;
    }
  }
}
