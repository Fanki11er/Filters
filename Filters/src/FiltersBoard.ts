import { BinaryFilter } from "./BinaryFilter";
import { BinarySection } from "./BinarySection";
import { ControlElement } from "./ControlElement";
import { DilatationFilter } from "./DilatationFilter";
import { EdgesDetectFilter } from "./EdgesDetectFilter";
import { ErosionFilter } from "./ErosionFilter";
import { FilterButton } from "./FilterButton";
import { ImageInput } from "./ImageInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { MedianFilter } from "./MedianFilter";
import { NumberInput } from "./NumberInput";
import { SmoothFilter } from "./SmoothFilter";

export class FiltersBoard {
  canvasWidth = 200;
  canvasHeight = 200;
  imageInput;
  structuralElementSizeInput;
  canvas;
  ctx;
  originalImage: File | null = null;
  originalImageData: ImageData | null = null;
  loadingIndicator;

  smoothingFilterButton;
  medianFilterButton;
  edgeDetectFilterButton;
  resetFilterButton;
  binaryImageButton;
  dilatationFilterButton;
  erosionFilterButton;

  smoothFilter;
  medianFilter;
  edgeDetectFilter;
  binaryImageFilter;
  dilatationFilter;
  erosionFilter;

  binarySection;

  controlElements: ControlElement[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.ctx = canvas.getContext("2d");
    this.imageInput = new ImageInput("image_input", this.loadImage);
    this.structuralElementSizeInput = new NumberInput(
      "structuralElementInput",
      this.handleSetStructuralElementSize
    );

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

    this.binaryImageButton = this.connectButton(
      "binaryImage",
      this.handleUseBinaryFilter
    );
    this.dilatationFilterButton = this.connectButton(
      "dilatationFilter",
      this.handleUseDilatationFilter
    );

    this.erosionFilterButton = this.connectButton(
      "erosionFilter",
      this.handleUseErosionFilter
    );

    this.binarySection = new BinarySection("binarySection");

    this.medianFilter = new MedianFilter(this.ctx!);
    this.smoothFilter = new SmoothFilter(this.ctx!);
    this.edgeDetectFilter = new EdgesDetectFilter(this.ctx!);
    this.binaryImageFilter = new BinaryFilter(this.ctx!, 100);
    this.dilatationFilter = new DilatationFilter(this.ctx!);
    this.erosionFilter = new ErosionFilter(this.ctx!);
  }

  private handleUseSmoothFilter = async () => {
    this.binarySection.hideSection();
    this.invokeFilterFunction(this.smoothFilter.applySmoothingFilter, true);
  };

  private handleUseMedianFilter = async () => {
    this.binarySection.hideSection();
    this.invokeFilterFunction(this.medianFilter.applyMedianFilter, true);
  };

  private handleUseEdgeDetectFilter = async () => {
    this.binarySection.hideSection();
    this.invokeFilterFunction(
      this.edgeDetectFilter.applySobelEdgeDetection,
      true
    );
  };

  private handleUseBinaryFilter = async () => {
    this.invokeFilterFunction(
      this.binaryImageFilter.convertToBinaryImage,
      true,
      this.binarySection.showSection
    );
  };

  private handleUseDilatationFilter = async () => {
    this.invokeFilterFunction(
      () =>
        this.dilatationFilter.applyDilation(
          this.binaryImageFilter.getBinaryImageData()
        ),
      false
    );
  };

  private handleUseErosionFilter = async () => {
    this.invokeFilterFunction(
      () =>
        this.erosionFilter.applyErosion(
          this.binaryImageFilter.getBinaryImageData()
        ),
      false
    );
  };

  private handleSetStructuralElementSize = (size: number) => {
    if (this.dilatationFilter) {
      this.dilatationFilter.radius = size;
    }
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
      this.binaryImageFilter.binaryImageData = null;
      this.binarySection.hideSection();
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
    filterFunction: (imageData: ImageData | null) => Promise<void>,
    resetFilter: boolean,
    successHelper?: () => void
  ) => {
    if (resetFilter) {
      this.resetFilter();
    }
    this.disableAll();
    this.onIndicator();

    filterFunction(this.originalImageData)
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        if (successHelper) {
          successHelper();
        }
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
