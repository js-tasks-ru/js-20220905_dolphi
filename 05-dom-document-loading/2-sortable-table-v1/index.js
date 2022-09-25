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

  get bodyTemplates() {
    const array = [];

    const heads = [...this.headerConfig].map(item => (item.title));

    for(let item of this.data) {
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
          ${this.bodyTemplates}
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
    this.destroy();
  }
}

