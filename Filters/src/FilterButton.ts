import { ControlElement } from "./ControlElement";

export class FilterButton extends ControlElement {
  constructor(buttonId: string, handleAction: () => void) {
    super();
    this.control = document.getElementById(
      buttonId
    ) as HTMLButtonElement | null;
    if (this.control) {
      this.control.addEventListener("click", () => {
        handleAction();
      });
    }
  }
}
