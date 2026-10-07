const mountTable = (data) => {
    const html = data
        .map(
            (item) => `
					<tr>
						<th scope="row">${item.cityId ? item.cityId.nome : ""}</th>
						<th scope="row">${item.label || ""}</th>
						<th scope="row">${item.quantity || ""}</th>
						<th scope="row">${item.type || ""}</th>
						<th scope="row">${item.limitedTo ? Mask.maskMoney(item.limitedTo) : ""}</th>
						<th scope="row">${item.startDay || ""}</th>
            <th scope="row">${item.endDay ?? ""}</th>
            <th scope="row">${item.status ? "Ativa" : "Desativada"}</th>
						<td>
              <a href="#" class="delete-sale" idSale="${item.id}">
                <i class="material-icons">delete</i>
              </a>
						</td>
						<td>
							<a href="#" class="edit-sale" editSale='${JSON.stringify(item)}'>
							  <i class="material-icons">edit</i>
							</a>
						</td>
					</tr>
				`
        )
        .join("");

    return html;
};

const mountModal = (data) => {
    const formData = JSON.parse(data);
    const modal = $("#editSaleTripModal");
    const optionDefault = `<option value="0" disabled selected>Selecione uma cidade</option>`;
    const elements = document.querySelector("#formEditSale").elements;

    if(formData.type == 'trip') {
        document.querySelector('.container-limited-to').style.display = 'block';
        document.querySelector('.container-limited-to-edit').style.display = 'block';
    } else {
        document.querySelector('.container-limited-to').style.display = 'none';
        document.querySelector('.container-limited-to-edit').style.display = 'none';
    }

    elements.namedItem("quantity").value = formData.quantity || "";
    elements.namedItem("label").value = formData.label || "";
    elements.namedItem("status").checked = formData.status ? true : false;
    elements.namedItem("type").value = formData.type || "";
    elements.namedItem("startDay").value = formData.startDay || "";
    elements.namedItem("endDay").value = formData.endDay || "";
    elements.namedItem("limitedTo").value = formData.limitedTo || "0,00";

    CityController.getActives()
        .then((data) => data.data)
        .then((cities) => {
            document.querySelector("#city-id-edit").innerHTML =
                optionDefault +
                cities
                    .map((city) => {
                        return `<option value='${city.cityId}' >${city.nome}</option>`;
                    })
                    .join("");
        })
        .finally(() => {
            const selectCity = document.querySelector("#city-id-edit");
            let cityId = formData.cityId ? formData.cityId.id : "0";
            selectCity.value = cityId;
        });

    modal.modal({show: true});

    editPromotion(formData.id);
};

const loadPromotions = () => {
    preload(true);
    SaleTripController.getAll()
        .then((data) => {
            document.querySelector("#listSaleTrip").innerHTML = mountTable(
                data.response
            );
        })
        .finally(() => {
            document.querySelectorAll(".delete-sale").forEach((item) => {
                item.addEventListener("click", (event) => {
                    SwalCustom.dialogConfirm(
                        "Deseja remover essa promoção ?",
                        "",
                        (status) => {
                            if (!status) return;

                            deletePromotion(item.getAttribute("idSale"));
                        }
                    );
                });
            });

            document.querySelectorAll(".edit-sale").forEach((item) => {
                item.addEventListener("click", (event) => {
                    const data = item.getAttribute("editSale");
                    mountModal(data);
                });
            });

            preload(false);
        });
};

const deletePromotion = (id) => {
    preload(true);
    SaleTripController.deleteSaleTrip(id)
        .then((data) => {
            if (data.status) {
                loadPromotions();
                SwalCustom.messageDialog(
                    "",
                    data.message,
                    data.status ? "success" : "info"
                );
            }
        })
        .finally(() => {
            preload(false);
        });
};

const editPromotion = (id) => {
    preload(true);
    const elementProperty = new ElementProperty();

    setTimeout(() => {
        preload(false);
    }, 1500);

    elementProperty.addEventInElement('#editSaleTrip', 'onclick', function (event) {
        const valueLimitedTo = document.getElementById('limitedToEdit').value;
        const formData = Object.fromEntries(
            new FormData(document.querySelector("#formEditSale"))
        );
        formData.status = formData.status ? "1" : "0";

        formData.type === "voucher"
            ? formData.limitedTo = null
            : formData.limitedTo = Mask.removeMaskMoney(valueLimitedTo);

        if(!formData.limitedTo && formData.limitedTo !== null) {
            if(formData.limitedTo <= 0) {
                preload(false);
                return SwalCustom.messageDialog(
                    "Valor Máximo da corrida não pode ser igual a 0.",
                    "Atenção");
            }
        }

        SaleTripController.update(id, formData)
            .then((data) => {
                if (!data.status) {
                    return Array.isArray(data.response)
                        ? data.response.map((error) => Toastr.error(error))
                        : Toastr.error(data.response);
                }

                if (data.status) {
                    SwalCustom.messageDialog(
                        "",
                        data.message,
                        data.status ? "success" : "info"
                    );
                }
            })
            .finally(() => {
                loadPromotions();
            });
    });
};

const loadCities = () => {
    const optionDefault = `<option value="" disabled selected>Selecione uma cidade</option>`;

    preload(true);
    CityController.getActives()
        .then((data) => data.data)
        .then((cities) => {
            document.querySelector("#city-id").innerHTML =
                optionDefault +
                cities
                    .map((city) => {
                        return `<option value='${city.cityId}' >${city.nome}</option>`;
                    })
                    .join("");
        })
        .finally(() => {
            preload(false);
        });
};

const newPromotion = () => {
    document
        .querySelector("#addSaleTrip")
        .addEventListener("click", function (event) {
            event.preventDefault();
            const valueLimitedTo = document.getElementById('limitedTo').value;
            preload(true);
            const formData = Object.fromEntries(
                new FormData(document.querySelector("#formAddSale"))
            );
            formData.status = formData.status ? "1" : "0";

            formData.type === "voucher"
            ? formData.limitedTo = null
            : formData.limitedTo = Mask.removeMaskMoney(valueLimitedTo);

            if (formData.type === "trip") {
                formData.tripPaymentFormId = null;
            }

            if(!formData.limitedTo && formData.limitedTo !== null) {
                if(formData.limitedTo <= 0) {
                    preload(false);
                    return SwalCustom.messageDialog(
                        "Valor Máximo da corrida não pode ser igual a 0.",
                        "Atenção");
                }
            }

            SaleTripController.newSale(formData)
                .then((data) => {
                    if (!data.status) {
                        return Array.isArray(data.response)
                            ? data.response.map((error) => Toastr.error(error))
                            : Toastr.error(data.response);
                    }

                    if (data.status) {
                        $('#addSaleTripModal').modal('hide');
                        SwalCustom.messageDialog(
                            "",
                            data.message,
                            data.status ? "success" : "info"
                        );
                    }
                })
                .finally(() => {
                    preload(false);
                    loadPromotions();
                });
        });
};

document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();
    Mask.setMoneyField('#limitedTo', null,null, 'left');
    Mask.setMoneyField('#limitedToEdit', null,null, 'left');
    document.querySelector('.container-limited-to-edit').style.display = 'none';
    document.querySelector('.container-limited-to').style.display = 'none';
    loadPromotions();
    loadCities();
    newPromotion();

    $("#addSaleTripModal").on("hidden.bs.modal", function () {
        $(this).find("form")[0].reset();
        document.querySelector('.container-limited-to').style.display = 'none';
        document.getElementById('limitedTo').value = '0,00';
    });

    elementProperty.addEventInElement('#type', 'onchange', function () {
        if (this.value == "trip") {
            document.querySelector('.container-limited-to').style.display = 'block';
        } else {
            document.querySelector('.container-limited-to').style.display = 'none';
            document.getElementById('limitedTo').value = '0,00';
        }
    });

    elementProperty.addEventInElement('#typeEdit', 'onchange', function () {
        if (this.value == "trip") {
            document.querySelector('.container-limited-to-edit').style.display = 'block';
        } else {
            document.querySelector('.container-limited-to-edit').style.display = 'none';
            document.getElementById('limitedToEdit').value = '0,00';
        }
    });
});
