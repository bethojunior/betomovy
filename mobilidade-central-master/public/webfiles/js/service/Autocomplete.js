class Autocomplete extends ElementProperty {

    createAutoCompleteDynamic(name,values, showProperty, photo = undefined) {

        this.name = name;

        this.callback = function () {
        };

        this.closeDialogWhenFocusOut(name);

        const dataSelected = {
            data: [],
            listHtml: ""
        };

        values.map(data => {
            const image = photo === undefined ? "" : `<div style="background-image: url(${this.src + data[photo]})"></div>`;
            dataSelected.data.push(data);
            dataSelected.listHtml = dataSelected.listHtml.concat(`<li class="autocomplete-item-${name}" value='${JSON.stringify(data)}'>${image}${data[showProperty]}</li>`);
        });

        this.showDataSelected(name, dataSelected);

    }


    /**
     *
     * @param name
     * @param datas
     * @param showProperty
     * @param findByProperty
     * @param showMaxResult
     * @param photo
     */
    initAutocomplete(name, datas, showProperty, findByProperty, showMaxResult = 25, photo = undefined) {
        const _that = this;

        _that.name = name;

        _that.callback = function () {
        };

        _that.closeDialogWhenFocusOut(name);

        _that.addEventInElement(name, "oninput", function () {

            const value = this.value;

            const dataSelected = {
                data: [],
                listHtml: ""
            };

            datas.map(data => {
                const exist = findByProperty.some(property => {
                    if (data[property] === undefined)
                        return false;

                    return _that.removeAcento(data[property].toUpperCase()).includes(_that.removeAcento(value.toUpperCase()));
                });


                if (dataSelected.data.length >= showMaxResult) {
                    return;
                }

                const image = photo === undefined ? "" : `<div style="background-image: url(${_that.src + data[photo]})"></div>`;

                if (exist) {
                    dataSelected.data.push(data);
                    dataSelected.listHtml = dataSelected.listHtml.concat(`<li class="autocomplete-item-${name}" value='${JSON.stringify(data)}'>${image}${data[showProperty]}</li>`);
                }
            });
            _that.showDataSelected(name, dataSelected);
        });
    }

    setSrc(path) {
        this.src = path;
    }

    /**
     * mostra o dialog de opções
     * @param nameElement {String}
     * @param result {Object}
     */
    showDataSelected(nameElement, result) {

        if (document.getElementById(`autocomplete-${nameElement}`) === null) {
            $(nameElement).after(`<ul class='autocomplete-custom' id='autocomplete-${nameElement}'></ul>`);
        }

        this.getElement(`#autocomplete-${nameElement}`, element => {
            element.innerHTML = result.listHtml;
        });

        this.onSelectedItem();

    }

    closeDialogWhenFocusOut(name) {
        const _that = this;
        this.addEventInElement(name, "onblur", function () {
            setTimeout(function () {
                _that.getElement(`#autocomplete-${name}`, element => {
                    element.remove();
                });
            }, 500);
        });
    }

    /**
     * Ao selecionar o item ele retorna um callback com item selecionado
     * @param callback
     */
    getItemSelected(callback) {
        this.callback = callback;
    }

    /**
     * Adiciona o evento  de callback ao adicionar os elementos
     */
    onSelectedItem() {
        const _that = this;
        this.addEventInElement(`.autocomplete-item-${this.name}`, "onclick", function () {
            const value = this.innerText;

            _that.getElement(_that.name, element => {
                element.value = value;
            });

            _that.callback(JSON.parse(this.getAttribute("value")));
        });
    }

    removeAcento(text) {
        text = text.toLowerCase();
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
        return text;
    }

}
