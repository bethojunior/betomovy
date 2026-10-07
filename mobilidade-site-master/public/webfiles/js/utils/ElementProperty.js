class ElementProperty {

    /**
     * Tira a visibilidade do elemento da tela dependedo a condição
     * @param elements
     * @param invisible
     */
    hideElements(elements, invisible = true) {
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].classList.contains('visible-transation')) {
                elements[i].classList.add('visible-transation');
            }
            elements[i].style.opacity = invisible ? 0 : 1;
        }

        this.timeHideElement(elements, invisible);
    }

    timeHideElement(elements, status) {
        setTimeout(() => {
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = status ? "none" : "block";
            }
        }, 500)
    }

    /**
     * retorna elementos in array
     * @param name
     * @returns array
     */
    getElements(name) {
        const option = name.substring(0, 1);

        const nameDefault = name;

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
                let elements = document.getElementsByTagName(nameDefault);
                return Object.keys(elements).map(index => elements[index]);
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

    addClass(nameElement,...classes){
        this.getElement(nameElement, element =>{
            classes.map(nameClass=>{
                element.classList.add(nameClass)
            });
        });
    }

    removeClass(nameElement,...classes){
        this.getElement(nameElement, element =>{
            classes.map(nameClass=>{
                element.classList.remove(nameClass)
            });
        });
    }

}