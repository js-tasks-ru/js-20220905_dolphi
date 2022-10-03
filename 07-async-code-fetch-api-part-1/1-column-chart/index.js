import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element;
  chartHeight = 50;
  subElements = {};


  constructor({
    url = "",
    range = {
        from: new Date(),
        to: new Date()
    },
    label = "",
    link = "",
    formatHeading = (data) => data
  } = {}) {

    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
    this.update(this.range.from, this.range.to);
  }

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));

    return Object.entries(data)
      .map(([key, value]) => {
        const scale = this.chartHeight / maxValue;
        const percent = ((value / maxValue) * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(
            value * scale
        )}" data-tooltip="${percent}%"></div>`;
      })
      .join("");
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((total, item) => (total + item), 0 ));
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
            <div data-element="header" class="column-chart__header"></div>
            <div data-element="body" class="column-chart__chart"></div>
          </div>
        </div>
      `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');

    const data = await this.dataLoad(from, to);

    this.range.from = from;
    this.range.to = to;

    if (data && Object.values(data).length) {
        this.subElements.header.textContent = this.getHeaderValue(data);
        this.subElements.body.innerHTML = this.getColumnBody(data);

        this.element.classList.remove('column-chart_loading');
    }

    this.data = data;
    return this.data;
  }

  async dataLoad(from, to) {
    this.url.searchParams.set("from", from.toISOString());
    this.url.searchParams.set("to", to.toISOString());

    return await fetchJson(this.url);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }
    return result;
  }


  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
