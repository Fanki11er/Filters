export class NumberInput {
  input;

  constructor(inputId: string, handleFunction: (value: number) => void) {
    this.input = document.getElementById(inputId) as HTMLInputElement | null;
    if (this.input) {
      this.input.addEventListener("change", () => {
        handleFunction(Number(this.input?.value));
      });
    }
  }
}
