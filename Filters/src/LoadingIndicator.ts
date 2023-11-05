export class LoadingIndicator {
  indicator;
  constructor(indicatorId: string) {
    this.indicator = document.getElementById(indicatorId);
  }

  setOn() {
    if (this.indicator) {
      this.indicator.classList.remove("indicatorOff");
    }
  }

  setOff() {
    if (this.indicator) {
      this.indicator.classList.add("indicatorOff");
    }
  }
}
