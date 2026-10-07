class Modal {

    constructor(reference) {
        elementProperty.getElement(reference, element => {
            this.element = element;

            this.element.onclick = () => {
                this.close();
            };

            for (let i = 0; i < element.childNodes.length; i++) {
                element.childNodes[i].onclick = (e) => {
                    e.stopPropagation();
                };
            }
        });

    }

    open() {
        this.element.classList.add('show');
    }

    close() {
        if (this.element.classList.contains('show')) {
            this.element.classList.remove('show');
        }
    }

}