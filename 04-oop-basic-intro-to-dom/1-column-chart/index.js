export default class ColumnChart {
  element;
  chartHeight = 50;

  constructor({ data = [], label = "", link = "", value = 0 } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading(value);


    this.render();
  }

  formatHeading(data) {
    this.value = `USD ${data}`;
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);

    return data
      .map((height) => {
        const scale = this.chartHeight / maxValue;
        const percent = ((height / maxValue) * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(
            height * scale
        )}" data-tooltip="${percent}%"></div>`;
      })
      .join("");
  }

  getLink() {
    return this.link
      ? `<a class="column-chart__link" href="${this.link}">View all</a>`
      : "";
  }

  get template() {
    return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${
          this.chartHeight
        }">
          <div class="column-chart__title">
            Total ${this.label}
            ${this.getLink()}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
              ${this.value}
            </div>
            <div data-element="body" class="column-chart__chart">
              ${this.getColumnBody(this.data)}
            </div>
          </div>
        </div>
      `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove("column-chart_loading");
    }
  }

  update({ headerData, bodyData }) {
    if (headerData) this.header.textContent = headerData;
    if (bodyData) this.body.innerHTML = this.getColumnBody(bodyData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
