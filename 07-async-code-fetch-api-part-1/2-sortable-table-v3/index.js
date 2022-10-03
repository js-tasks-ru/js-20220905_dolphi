import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  prevField = "title";

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;

    this.render();

    this.defaultSort();

    this.addEventListeners();
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  sortOnClient (id, order) {

  }

  sortOnServer (id, order) {

  }

  defaultSort() {
    this.sort(this.sorted.id, this.sorted.order);
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  onClickHandler(field, order) {
    this.sort(field, order);
  }

  addEventListeners() {
    for (let elem of this.subElements.header.children) {
      if (elem.getAttribute("data-sortable") == "true") {
        elem.addEventListener("click", () => this.onClickHandler(elem.getAttribute("data-id"), elem.getAttribute("data-order")));
      }
    }
  }

  getHeaderTemplates(field = "", order = "") {
    return [...this.headerConfig]
      .map(item => {
        return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
          <span>${item.title}</span>
          ${putArrows(item)}
        </div>
        `;
      })
      .join("");

    function putArrows(item) {
      if (item.id === field) {
        return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
        `
      }
      return '';
    }
  }

  getBodyTemplates(data) {
    const array = [];

    data
      .map(item => {
        array.push(`<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">`);
        for (const head of this.headerConfig) {
          if ('template' in head) {
            array.push(head.template(item.head));
            continue;
          } else if (item[head.id]) {
            array.push(`<div class="sortable-table__cell">${item[head.id]}</div>`);
          }
        }
        array.push(`</a>`);
      });

    return array.join("");
  }

  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">

        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeaderTemplates()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.getBodyTemplates(this.data)}
        </div>

      </div>
    </div>
    `
  }


  sort(field, order) {
    const exchange = {
      desc: "asc",
      asc: "desc"
    }
    if (this.prevField === field) {
      order = exchange[order];
    }
    this.prevField = field;

    const sortedData  = this.sortFields(field, order);

    this.subElements.header.innerHTML = this.getHeaderTemplates(field, order);

    this.subElements.body.innerHTML = `${this.getBodyTemplates(sortedData)}`

    this.addEventListeners();
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  sortFields(field, order) {

    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const {sortType} = column;

    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((elem1, elem2) => {
      switch(sortType) {
        case 'number':
          return direction * ( elem1[field] - elem2[field] );
        case 'string':
          return direction * elem1[field].localeCompare(elem2[field], ['ru', 'en']);
        default:
          throw new Error('Unknown type ${SortType}');
      }
    })
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
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
