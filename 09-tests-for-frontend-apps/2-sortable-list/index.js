export default class SortableList {
    element;
    currentDroppable = null;
    movingElement = null;
    placeHolder = null;
    shiftX = null;
    shiftY = null;
    bounding = null;

    constructor( elements = { items: [] } = {} ) {
        this.items = elements.items;

        this.render();
    }

    render() {
        const element = document.createElement("ul");
        element.classList.add("sortable-list");

        element.innerHTML = this.template;

        this.element = element;

        this.initEventListeners();
    }


    get template() {
        return this.items.map(item => {
            item.classList.add("sortable-list__item");
            return item.outerHTML;
        })
        .join("");
    }

    initEventListeners() {
        this.controller = new AbortController();
        document.body.addEventListener('pointerdown', this.onPointerdownHandler, { signal: this.controller.signal });
    }

    onPointerdownHandler = event => {
        this.checkIfDeleteElement(event);
        this.checkIfGrabElement(event);
    }

    checkIfDeleteElement(event) {
        const item = event.target.closest('[data-delete-handle]');
        if (item) {
            item.closest('.sortable-list__item').remove();
        }
    }

    checkIfGrabElement(event) {
        event.preventDefault();
        const item = event.target.closest('[data-grab-handle]');
        if (item) {
            this.renderMovingElement(event);

            window.addEventListener("pointermove", this.onElementMovement, { signal: this.controller.signal });
            window.addEventListener("pointerup", this.onPoinerUp, { signal: this.controller.signal });
        }
    }

    renderMovingElement(event) {
        const element = event.target.closest('.sortable-list__item');
        const content = element.outerHTML;

        this.renderPlaceHolder(element);

        const movingElement = document.createElement("div");
        movingElement.innerHTML = content;
        this.movingElement = movingElement.firstElementChild;
        this.movingElement.classList.add("sortable-list__item.sortable-list__item_dragging");
        this.movingElement.classList.add("sortable-list__placeholder")
        const sortableList = document.querySelector('.sortable-list');
        sortableList.append(this.movingElement);

        this.saveMouseCoordinates(event, element);

        this.moveElement(event.pageX, event.pageY);
    }

    saveMouseCoordinates(event, element) {
        this.shiftX = event.clientX - element.getBoundingClientRect().left;
        this.shiftY = event.clientY - element.getBoundingClientRect().top;
        this.bounding = this.movingElement.getBoundingClientRect();
    }

    renderPlaceHolder(element) {
        element.innerHTML = "";
        element.classList.add("sortable-list__placeholder");
        this.placeHolder = element;
    }

    onPoinerUp = () => {
        this.placeHolder.innerHTML = this.movingElement.innerHTML;
        this.placeHolder.classList.remove("sortable-list__placeholder");
        this.movingElement.outerHTML = null;

        window.removeEventListener("pointermove", this.onElementMovement);
        window.removeEventListener("pointerup", this.onPoinerUp);
        this.shiftX = this.shiftY = this.bounding = null
        this.currentDroppable = this.placeHolder = this.movingElement = null;
    }

    onElementMovement = event => {

        this.moveElement(event.pageX, event.pageY);

        this.movingElement.style.display = "none";
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        this.movingElement.style.display = "";

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.sortable-list__item');

        if (this.currentDroppable != droppableBelow) {
          this.currentDroppable = droppableBelow;

          if (this.currentDroppable) {
            this.enterDroppable();
          }

        }
    }

    enterDroppable() {
        this.placeHolder.innerHTML = this.currentDroppable.innerHTML;
        this.placeHolder.classList.remove("sortable-list__placeholder");
        this.renderPlaceHolder(this.currentDroppable);
    }

    moveElement(pageX, pageY) {
        let left = pageX - this.bounding.left - this.shiftX;
        let top = pageY - this.bounding.top - this.shiftY;
        this.movingElement.style.left = left +'px';
        this.movingElement.style.top = top + 'px';
    }

    remove() {
        if(this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
        this.controller.abort();
        this.shiftX = this.shiftY = this.bounding = null
        this.currentDroppable = this.placeHolder = this.movingElement = null;
    }
}
