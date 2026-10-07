let elementProperty = new ElementProperty();
let optionals = [];
let complementSelected = 0;

showEventValidate();

elementProperty.addEventInElement('#save-optional', 'onclick', function () {
    let myList = [];
    optional = {};
    optional.id = Math.random();
    optional.name = document.getElementById('optional-selected').value;
    optional.value = document.getElementById('value-this-optional').value;
    myList.push(optional);
    $("#modal-optionals").modal('hide');
    mountListOptionals(myList);
});

elementProperty.addEventInElement('#form-product', 'onsubmit', function (event) {
    event.preventDefault();
    this.setAttribute('disabled', 'disabled');

    document.querySelector('#price-sale').value =
        Mask.removeMaskMoney(document.querySelector('#price-sale').value);

    document.querySelector('#real-price').value =
        Mask.removeMaskMoney(document.querySelector('#real-price').value);

    const groupComplements = [];

    document.querySelectorAll(".group-complement").forEach(element => {
        const id = element.getAttribute("value");
        groupComplements.push({
            "name": document.querySelector(`#nameGroupComplement${id}`).value,
            "minimumQuantity": document.querySelector(`#amountMin${id}`).value,
            "maximumQuantity": document.querySelector(`#amountMax${id}`).value,
            "required": document.querySelector(`#mandatoryComplement${id}`).checked,
            "complements": getComplements(id)
        });
    });
    document.getElementById("complements").value = JSON.stringify(groupComplements);
    document.getElementById('form-product').submit();
    Preload.show();
});

document.getElementById('btn-modal-create-product').addEventListener('click', function () {
    document.getElementById("image-product").required = true;
    document.querySelector('#form-product')
        .setAttribute('action', this.getAttribute('data-linkStoreProduct'));

    clearForm();
});

elementProperty.addEventInElement('#btn-search', 'onclick', function (event) {
    event.preventDefault();
    searchName();
});

elementProperty.addEventInElement('#input-search', 'onkeyup', function (event) {
    if (event.keyCode === 13)
        searchName();
});

function searchName() {
    let input = document.querySelector('#input-search');
    Preload.show();
    location.href =
        input.getAttribute('data-search-uri') +
        "?name=" + input.value;
}

function getComplements(id) {
    const complements = [];

    document.querySelectorAll(`.container-complement[group='${id}']`).forEach(element => {
        const idItem = element.getAttribute("value");

        complements.push({
            "name": document.querySelector(`#nameComplement${idItem}`).value,
            "description": document.querySelector(`#descriptionComplement${idItem}`).value,
            "price": Mask.removeMaskMoney(document.querySelector(`#priceComplement${idItem}`).value),
            "active": document.querySelector(`#activeComplement${idItem}`).checked == true ? 1 : 0,
        });
    });
    return complements;
}

function mountListOptionals(list) {
    elementProperty.getElement('#mount-optionals-' + complementSelected, tbody => {
        let tr = '';
        document.getElementById('table-complements-' + complementSelected).style.display = '';
        tr += list.map(item => {
            return `
                <tr class="${item.id}">
                    <td>${item.name}</td>
                    <td>${item.value}</td>?
                    <td class="remove" id="${item.id}"><button type="button" class="btn btn-danger"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
        }).join('');
        tbody.innerHTML += tr;
        elementProperty.addEventInElement('.remove', 'onclick', function () {
            let id = this.getAttribute('id');
            list.map(item => {
                if (item.id == id) {
                    list.splice(list.indexOf(item), 1);
                    mountListOptionals(list);
                }
            });
        });
    })
}

elementProperty.addEventInElement('#show-optionals', 'onclick', function () {
    elementProperty.getElement('.value-optional', these => {
        if (these.style.display == 'none')
            return these.style.display = 'block';
        return these.style.display = 'none';
    })
});

elementProperty.addEventInElement('.edit-product', 'onclick', function () {
    $('#exampleModal').modal('show');
    Preload.show()

    fetch(this.getAttribute('data-link-product-data'))
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }

            return response.json();
        })
        .then((result) => {
            if (result.status) {
                feedEditForm(result.response);
                document.querySelector('#form-product')
                    .setAttribute('action', this.getAttribute('data-link-edit-product'));

                maskAll();
            }
        }).finally(() => {
        Preload.hide()
    });
});

elementProperty.addEventInElement('.delete-product', 'onclick', function () {
    SwalCustom.dialogConfirm('Deseja apagar produto?', 'Essa ação', () => {
        let id = this.getAttribute('data-id');
        document.querySelector(`#form-delete-${id}`).submit();
        Preload.show();
    });
});

elementProperty.addEventInElement('#add-group-complement', 'onclick', function (event) {
    event.preventDefault();
    const result = createCategory();
    $("#listComplements").append(result.content);
    addTypeComplement(result.id, true)
    showEventValidate();
    initEventCategory();
});

function initEventCategory() {
    elementProperty.addEventInElement(".remove-category", "onclick", function () {
        const id = this.getAttribute("value");

        document.querySelector(`#cardComplement${id}`).remove();
    });

    elementProperty.addEventInElement(".change-mandatory-complement", "onchange", function () {
        const id = this.getAttribute("value");
        const element = document.querySelector(`#amountMin${id}`);
        element.readOnly = !this.checked;

        if (this.checked) {
            element.value = 1;
        } else {
            element.value = 0;
        }
    });

    elementProperty.addEventInElement(".name-complement", "oninput", function () {
        const element = document.querySelector(`small[for='${this.getAttribute("id")}']`);

        element.innerHTML = `${this.value.length}/25 caracteres`;
    });


    elementProperty.addEventInElement(".add-type-complement", "onclick", function () {
        const id = this.getAttribute("value");
        addTypeComplement(id);
    });
}

function addTypeComplement(id, isFirst = false) {
    const item = new Date().getTime();
    $(`#mountComplements${id}`).append(`
            <div class="row mb-1 container-complement" id="complement${item}" value="${item}" group="${id}">
                <div class="col-2">
                    <input type="text" class="form-control" id="nameComplement${item}" placeholder="Nome" required>
                </div>
                <div class="col-6">
                    <input type="text" class="form-control" id="descriptionComplement${item}" placeholder="Descrição">
                </div>
                <div class="col-2">
                    <input type="text" class="form-control class-mask-price" id="priceComplement${item}" placeholder="Preço">
                </div>
                ${!isFirst ? `<div class="col-1">
                    <a href="#" class="remove-complement" value="${item}">Excluir</a>
                </div>` : `<div class="col-1"></div>`}
                <div class="col-1 custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="activeComplement${item}">
                    <label class="custom-control-label" for="activeComplement${item}"></label>
                </div>
            </div>
        `);

    Mask.setMoneyField(".class-mask-price");

    elementProperty.addEventInElement(".remove-complement", "onclick", function () {
        const id = this.getAttribute("value");
        document.querySelector(`#complement${id}`).remove();
    })

    showEventValidate();
}

function createCategory() {
    const id = new Date().getTime();

    return {
        id,
        content: `<div class="card group-complement" id="cardComplement${id}" value="${id}">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <div class="form-group">
                                <input type="text" class="form-control name-complement" id="nameGroupComplement${id}" maxlength="25"
                                    required
                                       placeholder="Nome">
                                <small for="nameGroupComplement${id}"
                                       class="form-text text-muted text-align-right">0/25
                                    caracteres</small>
                            </div>
                        </div>
                        <div class="col-2 d-flex justify-content-center">
                            <a href="#" value="${id}" class="remove-category">Excluir</a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label">Qtd. Min</label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control" required id="amountMin${id}" value="0" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label">Qtd. Max</label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control" required id="amountMax${id}">
                                </div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="custom-control custom-checkbox float-right">
                                <input type="checkbox" class="custom-control-input change-mandatory-complement" id="mandatoryComplement${id}" value="${id}">
                                <label class="custom-control-label" for="mandatoryComplement${id}">Complemento obrigatório</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div id="mountComplements${id}"></div>
                    <a href="#"
                        value="${id}"
                       class="btn btn-link small add-type-complement">
                        <i class="fas fa-plus"></i> Adicionar complementos
                    </a>
                </div>
            </div>`
    };
}

function createCategoryEdit(group) {
    const id = group.id;

    function checkOrDisabled(checked = null, disabled = null) {
        return checked ? "checked" : disabled ? "disabled" : "";
    }
    return `<div class="card group-complement" id="cardComplement${id}" value="${id}">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <div class="form-group">
                                <input type="text" class="form-control name-complement" id="nameGroupComplement${id}" value="${group.name}" maxlength="25"
                                       placeholder="Nome">
                                <small for="nameGroupComplement${id}"
                                       class="form-text text-muted text-align-right">${group.name.length}/25
                                    caracteres</small>
                            </div>
                        </div>
                        <div class="col-2 d-flex justify-content-center">
                            <a href="#" value="${id}" class="remove-category">Excluir</a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label">Qtd. Min</label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control" id="amountMin${id}" value="${group.minimumQuantity}" ${group.required == true ? "" : "readonly"}>
                                </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label">Qtd. Max</label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control" id="amountMax${id}" value="${group.maximumQuantity}">
                                </div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="custom-control custom-checkbox float-right">
                                <input type="checkbox" class="custom-control-input change-mandatory-complement" id="mandatoryComplement${id}" value="${id}">
                                <label class="custom-control-label" for="mandatoryComplement${id}">Complemento obrigatório</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div id="mountComplements${id}">
                <div class="d-flex justify-content-end">
                    <p class=col-1>Ativar</p>
                </div>
                        ${group.delivery_complements.map((complement, index) => {
                            let complementValueChecked = complement.active
        const item = `${group.id}_${complement.id}`;
        return `
                <div class="row mb-1 container-complement" id="complement${item}" value="${item}" group="${id}">
                    <div class="col-2">
                        <input type="text" class="form-control" id="nameComplement${item}" value="${complement.name}" 
                        required ${checkOrDisabled('', complement.active != 1 ? "disabled" : '' )} placeholder="Nome">
                    </div>
                    <div class="col-6">
                        <input type="text" class="form-control" id="descriptionComplement${item}" value="${complement.description}" 
                        ${checkOrDisabled('', complement.active != 1 ? "disabled" : '' )} placeholder="Descrição">
                    </div>
                    <div class="col-2">
                        <input type="text" class="form-control class-mask-price" value="${Mask.maskMoney(complement.price)}"
                         id="priceComplement${item}" ${checkOrDisabled('', complement.active != 1 ? "disabled" : '' )} placeholder="Preço">
                    </div>
                    <div class="col-1">
                        ${index >= 0 ? `<a href="#" class="remove-complement" value="${item}">Excluir</a>` : ``}
                    </div>
                    <div class="col-1 custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="activeComplement${item}"
                        ${checkOrDisabled(complement.active == 1 ? "checked" : "")}>
                        <label class="custom-control-label" for="activeComplement${item}"> </label>
                    </div>
                </div>`
    }).join("")}
                    </div>
                    <a href="#"
                        value="${id}"
                       class="btn btn-link small add-type-complement">
                        <i class="fas fa-plus"></i> Adicionar complementos
                    </a>
                </div>
            </div>`;
}

function feedEditForm(data) {
    document.getElementById("image-product").required = false;
    document.getElementById('name').value = data.name;
    document.getElementById('category').value = data.deliveryCategoryId;
    document.getElementById('description').value = data.description;
    document.getElementById('price-sale').value = Mask.maskMoney(data.costPrice);
    document.getElementById('real-price').value = Mask.maskMoney(data.price);
    document.getElementById('time-read').value = data.preparationTime;
    document.getElementById('freeDelivery').checked = data.freeDelivery;
    document.getElementById('isOpenValueCheck').checked = data.isOpenValue;
    document.getElementById('thumbnail').style.backgroundImage = `url(${data.picture})`;

    document.querySelector("#listComplements").innerHTML = data.delivery_group_complements.map(function (deliveryGroupComplement) {
        return createCategoryEdit(deliveryGroupComplement);
    }).join("");
    initEventCategory();
    elementProperty.addEventInElement(".remove-complement", "onclick", function () {
        const id = this.getAttribute("value");
        document.querySelector(`#complement${id}`).remove();
    });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('category').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price-sale').value = Mask.maskMoney(0);
    document.getElementById('real-price').value = Mask.maskMoney(0);
    document.getElementById('time-read').value = '';
    document.getElementById('freeDelivery').checked = false;
    document.getElementById('thumbnail').style = ``;
    document.getElementById('isOpenValueCheck').checked = false;

    document.querySelector("#listComplements").innerHTML = '';
    initEventCategory();
    elementProperty.addEventInElement(".remove-complement", "onclick", function () {
        const id = this.getAttribute("value");
        document.querySelector(`#complement${id}`).remove();
    });


}

if (document.getElementById("image-product") !== null) {
    document.getElementById("image-product").onchange = function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("thumbnail").style.backgroundImage = `url(${e.target.result})`;
                imageOne = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    };
}

function maskAll() {
    Mask.setMoneyField(".class-mask-price");
}

maskAll();

elementProperty.addEventInElement(".change-active-product", "onclick", function () {
    const myHeaders = new Headers();
    myHeaders.append("token", document.getElementById('header-api_token').value);
    myHeaders.append("userid", document.getElementById('header-user_id').value);
    myHeaders.append("Content-Type", "application/json");

    fetch(`/api/product/${this.value}/changeActive`,
        {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify({
                active: this.checked
            })
        }
    )
});

$(".table-products tbody").sortable({
    cursor: "move",
    placeholder: "sortable-placeholder",
    helper: function(e, tr)
    {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index)
        {
            // Set helper cell sizes to match the original sizes
            $(this).width($originals.eq(index).width());
        });
        return $helper;
    },
    update: function(event){
        const products = [];
        event.target.querySelectorAll(".item-order-selected").forEach((element,index)=>{
            products.push({
                id: element.getAttribute("value"),
                position: index + 1
            });
        });

        const myHeaders = new Headers();
        myHeaders.append("token",  document.getElementById('header-api_token').value);
        myHeaders.append("userid", document.getElementById('header-user_id').value);
        myHeaders.append("Content-Type", "application/json");

        fetch(`/api/product/positions`,
            {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify({
                    products
                })
            }
        )
    }
}).disableSelection();

$(".list-category").sortable({
    cursor: "move",
    placeholder: "sortable-placeholder",
    helper: function(e, tr)
    {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index)
        {
            // Set helper cell sizes to match the original sizes
            $(this).width($originals.eq(index).width());
        });
        return $helper;
    }
}).disableSelection();

elementProperty.addEventInElement("#formPositionCategory","onsubmit", function(event){
    event.preventDefault();

    const categories = [];

    document.querySelectorAll(".item-category").forEach((element,index)=>{
        categories.push({
            id: element.getAttribute("value"),
            position: index + 1
        });
    });

    Preload.show();

    const myHeaders = new Headers();
    myHeaders.append("token",  document.getElementById('header-api_token').value);
    myHeaders.append("userid", document.getElementById('header-user_id').value);
    myHeaders.append("Content-Type", "application/json");

    fetch(`/api/category/positions`,
        {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify({
                categories
            })
        }
    ).then(()=> location.reload())

})

function showEventValidate() {
    document.querySelectorAll("input[required]").forEach(element => {
        element.addEventListener("invalid", function (event) {
            document.querySelector("#alertRequired").hidden = false;
        });
    });
}
