export default class SortableTable {
  element;
  prevField = "";

  constructor(headersConfig, {
    data = [],
    sorted = {
      id: "",
      order: "asc"
    }
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();

    this.addEventListeners();
  }

  defaultSort() {
    this.prevField = this.sorted.id;
    this.sort(this.sorted.id, this.sorted.order);
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    this.defaultSort();
  }

  onClickHandler = event => {
    const cell = event.target.closest('.sortable-list__item');

    if (!cell) return;

      const { id, order } = cell.dataset;
      const switchedOrder = switchOrder(order);

      this.sorted = {
        id,
        order: switchedOrder
      }

      column.dataset.order = switchedOrder;
      column.append(this.subElements.arrow);

      if (this.isSortLocally) {
        this.sortOnClient(id, newOrder);
      } else {
        this.sortOnServer(id, newOrder);
      }

      const switchOrder = order => {
        const orders = {
          asc: 'desc',
          desc: 'asc'
        }
      }
  }

  addEventListeners() {
    this.subElements.header.addEventListener("click", this.onClickHandler);
  }

  getHeaderTemplates(field = "", order = "desc") {
    return this.headerConfig
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
        return (item.id === field) ?  `
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
          `
        : '';
      }
  }

  getBodyTemplates(data) {
    return data
      .map(item => {
        let str = "";
        str += `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">`;
        for (const head of this.headerConfig) {
          if ('template' in head) {
            str += head.template(item.head);
            continue;
          } else if (item[head.id]) {
            str += `<div class="sortable-table__cell">${item[head.id]}</div>`;
          }
        }
        str += `</a>`;
        return str;
      })
      .join("");
  }

  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row"></div>
        <div data-element="body" class="sortable-table__body"></div>
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

    this.subElements.body.innerHTML = this.getBodyTemplates(sortedData);
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
          throw new Error('Unknown type');
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
