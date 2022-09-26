export default class SortableTable {
  element;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  get HeaderTemplates() {
    return [...this.headerConfig]
      .map(item => {
        return `      
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        </div>      
        `; 
      })
      .join("");
  }

  getBodyTemplates(data) {
    const array = [];

    const heads = [...this.headerConfig].map(item => (item.title));

    for(let item of data) {
      array.push(`<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">`);
      if (heads.includes("Image")) {
        array.push(`
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${item["images"][0]["url"]}">
        </div>
        `);
      }
      if (heads.includes("Name")) {
        array.push(`<div class="sortable-table__cell">${item.title}</div>`);
      }
      if (heads.includes("Quantity")) {
        array.push(`<div class="sortable-table__cell">${item.quantity}</div>`);
      }
      if (heads.includes("Price")) {
        array.push(`<div class="sortable-table__cell">${item.price}</div>`);
      }
      if (heads.includes("Sales")) {
        array.push(`<div class="sortable-table__cell">${item.sales}</div>`);
      }
      array.push(`</a>`);
    }
    // console.log(array.join(""));
    return array.join("");
  }

  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">

        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.HeaderTemplates}      
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.getBodyTemplates(this.data)}
        </div>

      </div>
    </div>
    `
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

  sort(field, order) {
    const sortedData  = this.sortFields(field, order);
    this.subElements.body.innerHTML = `${this.getBodyTemplates(sortedData)}`
 
  }

  sortFields(field, order) {
    if(!["asc", "desc"].includes(order)) return;

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
}

