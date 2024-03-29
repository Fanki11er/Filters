export abstract class ControlElement {
  control: HTMLInputElement | HTMLButtonElement | null = null;
  setActive = () => {
    if (this.control) {
      this.control.classList.remove("disabled");
      this.control.removeAttribute("disabled");
    }
  };
  disable = () => {
    if (this.control) {
      this.control.classList.add("disabled");
      this.control.setAttribute("disabled", "true");
    }
  };
}
