const managerItemDelivery = {
    itens: [],
    weightTotal: 0,
    photos: [],
    requestMoreItems: false,
    currentPage: 1,
    lastPage: null
};

const managerTypeTrip = {
    type: null,
    infoCalculate: null
};


const editItemDelivery = {
    itens: [],
    weightTotal: 0
};

const maximumWeightDelivery = 840;

function openSelectItem() {
    managerItemDelivery.itens = [];
    managerItemDelivery.weightTotal = 0;
    managerItemDelivery.requestMoreItems = false;
    managerItemDelivery.currentPage = 1;
    managerItemDelivery.photos = [];

    document.querySelector("#searchDeliveryItem").value = '';
    document.querySelector(`#listPhotosItems`).innerHTML = '';

    viewController.elementProperty.getElement("#confirmationItensSelected", element => {
        element.innerHTML = "AVANÇAR";
    });

    viewController.elementProperty.getElement("#listItemFreight", element => {
        element.innerHTML = '';
    });

    window.addEventListener('keyboardDidShow', () => {
        viewController.elementProperty.getElement(".container-photo-items", element => {
            element.style.display = "none";
        });

        viewController.elementProperty.getElement(".data-transport", element => {
            element.style.display = "none";
        });

        viewController.elementProperty.getElement("#confirmationItensSelected", element => {
            element.style.display = "none";
        });
    });

    window.addEventListener('keyboardDidHide', () => {
        viewController.elementProperty.getElement(".container-photo-items", element => {
            element.style = "";
        });

        viewController.elementProperty.getElement(".data-transport", element => {
            element.style = "";
        });

        viewController.elementProperty.getElement("#confirmationItensSelected", element => {
            element.style = "";
        });
    });

    viewController.elementProperty.addEventInElement("#listItemFreight", "onscroll", function () {
        let percent = Math.round(this.scrollHeight - this.scrollTop);

        let dif = percent / 10;

        percent -= dif;

        let total = Math.round(this.clientHeight);

        if (total >= percent && !managerItemDelivery.requestMoreItems) {
            managerItemDelivery.currentPage++;

            if (managerItemDelivery.currentPage > managerItemDelivery.lastPage)
                return;


            this.classList.add("load-more");

            loadPageItemDelivery();
        }
    });


    let timeoutSearchItem = null;

    viewController.elementProperty.addEventInElement("#searchDeliveryItem", "oninput", function () {
        viewController.elementProperty.getElement("#listItemFreight", element => {
            element.innerHTML = '';
        });

        clearTimeout(timeoutSearchItem);

        timeoutSearchItem = setTimeout(() => {
            managerItemDelivery.currentPage = 1;
            loadPageItemDelivery(false);
        }, 500)

    });

    loadPageItemDelivery();
}

function loadPageItemDelivery(isConcat = true) {
    managerItemDelivery.requestMoreItems = true;
    ItemController.getAll(
        managerItemDelivery.currentPage,
        document.querySelector("#searchDeliveryItem").value)
        .then(({status, data: response}) => {
            if (!status)
                return;

            if(!isConcat){
                viewController.elementProperty.getElement("#listItemFreight", element => {
                    element.innerHTML = '';
                });
            }

            managerItemDelivery.lastPage = response.lastPage;
            createListItems(response.data);
        })
        .finally(() => {
            managerItemDelivery.requestMoreItems = false;
            viewController.elementProperty.removeClass("#listItemFreight", "load-more");
        });
}

function initEventSelectedItems() {
    viewController.elementProperty.addEventInElement(".add-item-delivery", "onclick", function () {
        const itemSelected = JSON.parse(this.getAttribute("value"));

        let found = false;

        managerItemDelivery.itens = managerItemDelivery.itens.map((item) => {
            if (itemSelected.id === item.id) {
                found = true;
                item.count++;
                viewController.elementProperty.getElement(`#itemDelivery${item.id}`, element => {
                    element.innerHTML = item.count;
                })
            }

            return item;
        });

        if (!found) {
            managerItemDelivery.itens.push({
                id: itemSelected.id,
                count: 1,
                weight: itemSelected.weight,
                name: itemSelected.description
            });
            viewController.elementProperty.getElement(`#itemDelivery${itemSelected.id}`,
                element => {
                    element.innerHTML = 1;
                })
        }

        calculateWeight()
    });

    viewController.elementProperty.addEventInElement(".remove-item-delivery", "onclick",
        function () {
            const itemSelected = JSON.parse(this.getAttribute("value"));

            managerItemDelivery.itens = managerItemDelivery.itens.map((item) => {
                if (itemSelected.id === item.id) {
                    item.count--;
                    viewController.elementProperty.getElement(`#itemDelivery${item.id}`, element => {
                        element.innerHTML = item.count;
                    })
                }

                return item;
            }).filter((item) => {
                return item.count > 0;
            });

            calculateWeight()
        });

    viewController.elementProperty.addEventInElement("#confirmationItensSelected", "onclick", function () {
        /*if (managerItemDelivery.itens.length === 0)
            return SwalCustom.messageDialog("Informe pelo menos um item", "Nenhum item selecionado");

        if (managerItemDelivery.weightTotal > maximumWeightDelivery)
            return SwalCustom.messageDialog("", "Peso total de todos os items ultrapassa o peso suportado pelo transporte");*/

        //openAccessibilityItem();

        //calculatePriceCustomer();
        if(globalFreight.tripTypeSelected.freightOption == false)
            return showAlertInfoTravel();

        openAccessibilityItem();
    });
}

function calculateWeight() {
    let weight = 0;

    managerItemDelivery.itens.map(item => {
        weight += item.count * item.weight;
    });

    managerItemDelivery.weightTotal = weight;

    viewController.elementProperty.getElement(".weight-all-objects", element => {
        element.innerHTML = `${weight}kg`;
    });

    viewController.elementProperty.getElement(".total-weight-free", element => {
        element.innerHTML = `${maximumWeightDelivery - weight}kg`;
    });

    viewController.elementProperty.getElement(".amount-item-selected", element => {
        if (managerItemDelivery.itens.length === 0)
            return element.innerHTML = "0";

        element.innerHTML = managerItemDelivery.itens.map(item => {
            return item.count;
        }).reduce((a, b) => {
            return a + b;
        });
    })
}

function createListItems(items) {

    viewController.elementProperty.getElement("#listItemFreight", element => {
        element.innerHTML += items.map(item => {
            return ` <li>
                    <span>
                        <span style="background-image: url(${item.picture})"></span>
                        <span>
                            <span>${item.description}</span>
                            <span>Larg. ${item.width} x Alt. ${item.height} x Prof. ${item.depth}</span>
                        </span>
                    </span>
                    <div class="container-count-item">
                        <i class="material-icons remove-item-delivery" value='${JSON.stringify(item)}'>remove</i>
                        <span class="count-item-delivery" id="itemDelivery${item.id}">0</span>
                        <i class="material-icons add-item-delivery" value='${JSON.stringify(item)}'>add</i>                       
                    </div>
                </li>`
        }).join("");


        calculateWeight();
        initEventSelectedItems();

        calculateItemSelected();
    });
}


function calculateItemSelected() {
    viewController.elementProperty.getElement(".count-item-delivery", element => {
        element.innerHTML = '0';
    });

    managerItemDelivery.itens.map(item => {
        viewController.elementProperty.getElement(`#itemDelivery${item.id}`, element => {
            element.innerHTML = item.count;
        });
    });
}

function openEditItemSelected() {

    editItemDelivery.itens = managerItemDelivery.itens.map(item => {
        return {...item};
    });
    editItemDelivery.weightTotal = managerItemDelivery.weightTotal;

    Route.startClassesInComponent([
        {component: ".container-selected-item", class: "show-active"},
    ], () => {
        viewController.elementProperty.removeClass(".container-selected-item", "show-active")

        managerItemDelivery.itens = editItemDelivery.itens.map(item => {
            return {...item};
        });

        managerItemDelivery.weightTotal = editItemDelivery.weightTotal;

        viewController.elementProperty.getElement(".count-item-delivery", element => {
            element.innerHTML = '0';
        });

        editItemDelivery.itens.map(item => {
            viewController.elementProperty.getElement(`#itemDelivery${item.id}`, element => {
                element.innerHTML = item.count;
            });
        });

        calculateWeight();

    }, COMPONENT_CREATE_TRIP);

    viewController.elementProperty.addEventInElement("#confirmationItensSelected", "onclick", () => {
        if (managerItemDelivery.itens.length === 0)
            return SwalCustom.messageDialog("Informe pelo menos um item", "Nenhum item selecionado");

        if (managerItemDelivery.weightTotal > maximumWeightDelivery)
            return SwalCustom.messageDialog("", "Peso total de todos os items ultrapassa o peso suportado pelo transporte");

        Route.backPage();
        //viewController.elementProperty.removeClass(".container-selected-item", "show-active");
        showBudgetFreight();
    });

    viewController.elementProperty.getElement("#confirmationItensSelected", element => {
        element.innerHTML = "CONFIRMAR";
    })
}

function getItemsSelected() {
    return managerItemDelivery.itens.map(item => {
        return {itemId: item.id, quantity: item.count};
    })
}
