export default class NotificationMessage {
    element;
    static active;


    constructor(message = "", {duration = 1000, type="error"} = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;    

        this.render();
    }
    
    get template() {
        return `
        <div class="notification ${this.type}" style="--value:${this.duration}ms">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">success</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>
        `;
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
    }

    show(place = document.body) {

        if (NotificationMessage.active) {            
            NotificationMessage.active.remove();
        }
             
        place.append(this.element);
        setTimeout(() => this.remove(), this.duration);
        NotificationMessage.active = this;
    }

    remove() { 
        if (this.element) {
            this.element.remove();    
        }
    }

    destroy() {
        this.remove();
        NotificationMessage.element = null;
        NotificationMessage.active = null;
    }
}
