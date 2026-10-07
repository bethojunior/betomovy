class ElementProperty {

    /**
     * Tira a visibilidade do elemento da tela dependedo a condição
     * @param elements
     * @param invisible
     */
    visibleElements(elements, visible = true) {
        const _that = this;
        elements.map(elementName => {
            _that.getElement(elementName, element => {
                element.style.display = (visible) ? "block" : "none";
            })
        })

    }

    /**
     * retorna elementos in array
     * @param name
     * @returns array
     */
    getElements(name) {
        const option = name.substring(0, 1);

        name = name.substring(1, name.length);

        switch (option) {
            case "#" : {
                let element = document.getElementById(name);
                if (element === null)
                    return [];
                return [element];
            }

            case "." : {
                let elements = document.getElementsByClassName(name);
                return Object.keys(elements).map(index => elements[index]);
            }

            default : {
                return [];
            }
        }
    }

    /**
     * retorna o elemento
     * @param name
     * @param callback
     */
    getElement(name, callback) {
        this.getElements(name).map(callback);
    }

    /**
     * Adicionar eventos no elemento
     * @param description
     * @param event
     * @param callback
     */
    addEventInElement(description, event, callback) {
        this.getElements(description).map(element => {
            element[event] = callback;
        })

    }

    addClass(nameElement, ...classes) {
        this.getElement(nameElement, element => {
            classes.map(nameClass => {
                element.classList.add(nameClass)
            });
        });
    }

    removeClass(nameElement, ...classes) {
        this.getElement(nameElement, element => {
            classes.map(nameClass => {
                element.classList.remove(nameClass)
            });
        });
    }

}

window.viewController = {elementProperty: new ElementProperty()};