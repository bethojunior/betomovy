document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    ReportNewController.get().then((result) => {
        elementProperty.getElement('#reportList', element => {
            element.innerHTML = result.response.map(item => {
                return `<details>
                <summary>${item.name}</summary>
                ${item.reports.map(type => {
                    return `<a href="#" class="open-type-report" value='${JSON.stringify(type)}'>${type.name}</a>`;
                }).join("")}
                </details>`
            }).join("");

            elementProperty.addEventInElement(".open-type-report", "onclick", function () {
                const type = JSON.parse(this.getAttribute("value"));

                if(type.enablePdf) {
                    document.querySelector('#pdfOption').innerHTML = `
                        <input class="form-check-input input-type-report" type="radio" name="isPdf" id="isPdf" value="1">
                        <label class="form-check-label" for="isPdf">
                            PDF
                        </label>
                    `
                }

                elementProperty.getElement("#contentReport", element => {
                    const listSelect = [];
                    const listSelect2 = [];
                    element.innerHTML = type.report_filters.map(item => {

                        switch (item.fieldType) {
                            case "select2" : {
                                listSelect2.push(item);
                                return `<div class="form-group">
                                        <label>${item.name}</label>
                                        <select class="select2-${item.field} form-control field-report"  id="${item.field}" ${item.required == true ? "required" : ""}></select>
                                    </div>`;
                            }
                            case "select": {
                                listSelect.push(item);
                                return ` <div class="form-group">
                                            <label for="${item.field}">${item.name}</label>
                                            <select class="form-control field-report" id="${item.field}" ${item.required == true ? "required" : ""}>
                                            </select>
                                        </div>`;
                            }

                            default : {
                                return `<div class="form-group">
                                    <label>${item.name}</label>
                                    <input type="${item.fieldType}" class="form-control field-report" field="${item.field}" ${item.required == true ? "required" : ""}>
                                </div>`;
                            }
                        }

                        
                    }).join("");
                    initEventSelect2(listSelect2);
                    intiEventSelect(listSelect);
                });

                document.querySelector("#reportModalLabelNew").innerHTML = type.name;

                $('#reportModalNew').modal('show');

                elementProperty.addEventInElement("#btnIssueReportNew", "onclick", function () {
                    const filtersValidate = {
                        isPdf : document.querySelector(".input-type-report:checked").value
                    };
                    elementProperty.getElements(".field-report").map((element) => {
                        filtersValidate[`${element.getAttribute("field") || element.getAttribute("id")}`] = element.value;
                    });

                    for (let item of type.report_filters) {
                        if (item.required == true) {
                            if (filtersValidate[item.field] == null || filtersValidate[item.field] == "")
                                return alert(`Informe o '${item.name}'`);
                        }
                    }
                    const { id } = type;
                    createReport(filtersValidate, id);
                });
            });

        });
    }).finally(() => {
        preload(false);
    });

    function initEventSelect2(listSelect2) {
        listSelect2.map(item => {
            $(`.select2-${item.field}`).select2({
                width: '100%',
                ajax: {
                    url: `${environment.hosts.hostRequestNew}${item.path_url}`,
                    headers: {
                        'token': Session.getValueInSession('user', 'api_token'),
                        'userid': Session.getValueInSession('user', 'idUser')
                    },
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term,
                        };
                    },
                    processResults: function (result) {
                        return {
                            results: result.response.map(item => {
                                return {
                                    id: item.id,
                                    text: item.text
                                }
                            })
                        }
                    },
                    cache: true
                },
                placeholder: "Pesquisar",
                minimumInputLength: 1,
                templateSelection: function (result) {
                    return result.text;
                },
                dropdownParent: $('#reportModalNew .modal-body'),
            })
        });
    }

    function intiEventSelect(listSelect) {
        listSelect.map(item => {
            ReportNewController.getListSelect(item.path_url).then(({response}) => {
                document.getElementById(item.field).innerHTML = `<option value="" selected>-----------------------</option>` + response.map(option => {
                    return `<option value="${option.id}">${option.text}</option>`
                }).join("");
            })
        })
    }

    function createReport(filtersValidate, id) {
        const filters = filtersValidate;

        const data = {
            reportId: id,
            filters
        }

        preload(true);
        ReportNewController.solicitationReport(data).then((result) => {
            preload(false);
            $('#reportModalNew').modal('hide');
            if (!result.status) {
                return SwalCustom.messageDialog('Tente novamente', 'Ops.. ocorreu um erro ao fazer sua solicitação', 'error');
            }

            SwalCustom.dialogConfirm(
                'Relatório solicitado',
                'O relatório foi solicitado com sucesso, deseja visualizar agora?',
                function (status) {
                    if (status){
                        window.open(`reportList`);
                    }
                }
            )
        });
    }
});