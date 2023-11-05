export class BinarySection {
  section;

  constructor(sectionId: string) {
    this.section = document.getElementById(sectionId);
  }

  showSection = () => {
    if (this.section) {
      this.section.classList.remove("hide");
    }
  };

  hideSection = () => {
    if (this.section) {
      this.section.classList.add("hide");
    }
  };
}
