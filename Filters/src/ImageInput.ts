import { ControlElement } from "./ControlElement";

export class ImageInput extends ControlElement {
  constructor(inputId: string, handleChange: (file: File) => void) {
    super();
    this.control = document.getElementById(inputId) as HTMLInputElement | null;
    this.control?.addEventListener("change", () => {
      if (
        this.control?.type === "file" &&
        this.control &&
        this.control?.files?.length
      ) {
        handleChange(this.control.files[0]);
      }
    });
  }
}
