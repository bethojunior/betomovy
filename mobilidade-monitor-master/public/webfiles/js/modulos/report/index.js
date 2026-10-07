document.addEventListener("DOMContentLoaded", function () {

    const grid = canvasDatagrid({
        parentNode: document.getElementById('showReportInTable'),
        data: []
    });

    preload(true);
    ReportController.get().then(({response}) => {
        elementProperty.getElement("#accordionList", element => {
            element.innerHTML = response.map(item => {
                return `<details>
                          <summary>${item.name}</summary>
                          ${item.reports.map(type => {
                    return `<a href="#" class="open-type-report" value='${JSON.stringify(type)}'>${type.name}</a>`;
                }).join("")}
                        </details>`
            }).join("");

            elementProperty.addEventInElement(".open-type-report", "onclick", function () {
                const type = JSON.parse(this.getAttribute("value"));

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

                document.querySelector("#reportModalLabel").innerHTML = type.name;
                document.querySelector("#reportModalLabelTable").innerHTML = type.name;

                $('#reportModal').modal('show');

                elementProperty.addEventInElement("#btnIssueReport", "onclick", function () {
                    const filtersValidate = {};

                    elementProperty.getElements(".field-report").map((element) => {
                        filtersValidate[`${element.getAttribute("field") || element.getAttribute("id")}`] = element.value;
                    });

                    for (let item of type.report_filters) {
                        if (item.required == true) {
                            if (filtersValidate[item.field] == null || filtersValidate[item.field] == "")
                                return alert(`Informe o '${item.name}'`);
                        }
                    }

                    createReport(type);
                });
            });

        });
    }).finally(() => {
        preload(false);
    });

    function createReport(type) {
        const filters = elementProperty.getElements(".field-report").filter(element => {
            return !(element.value === "");
        }).map((element) => {
            return `${element.getAttribute("field") || element.getAttribute("id")}=${element.value}`;
        }).join("&");

        const typeReport = document.querySelector(".input-type-report:checked").value;

        preload(true);

        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    if (request.response.type === "application/json")
                        return SwalCustom.messageDialog("", "Ocorreu um erro ao emitir relatório");

                    const fileName = typeReport == false ? `${type.name}.xls` : `${type.name}.pdf`;
                    const blob = this.response;

                    const downloadLink = window.document.createElement('a');
                    const contentTypeHeader = request.getResponseHeader("Content-Type");

                    const objectBlob = new Blob([blob], {type: contentTypeHeader});

                    preload(false);

                    const fileReader = new FileReader();

                    fileReader.onload = function (event) {

                        $('#reportModal').modal('hide');
                        $('#reportTableModal').modal('show');

                        if (typeReport == false) {
                            document.querySelector("#showReportInPDF").style.display = "none";
                            document.querySelector("#showReportInTable").style.display = "block";
                            setTimeout(() => {
                                grid.style.height = '400px';
                                grid.style.width = '100%';

                                const workbook = XLSX.read(event.target.result, {type: "binary"});

                                workbook.SheetNames.forEach(sheet => {
                                    grid.data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                                });
                            }, 1000);
                        } else {
                            document.querySelector("#showReportInPDF").style.display = "block";
                            document.querySelector("#showReportInTable").style.display = "none";
                            document.querySelector("#showReportInPDF").innerHTML =
                                `<embed src="${window.URL.createObjectURL(objectBlob)}" height="400" class="w-100" />`;
                        }
                    };

                    fileReader.readAsBinaryString(objectBlob);

                    downloadLink.href = window.URL.createObjectURL(objectBlob);
                    downloadLink.download = fileName;

                    elementProperty.addEventInElement("#btnDownloadReport", "onclick", function () {
                        if (window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveBlob(blob, fileName);
                        } else {
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        }
                    });
                } else {
                    preload(false);
                    let decode = new TextDecoder();
                    console.log(this.response);
                    const response = JSON.parse(decode.decode(this.response));
                    return SwalCustom.messageDialog("", response.message);
                }

                if (request.status === 404) {
                    preload(false);
                    return SwalCustom.messageDialog("", "Ocorreu um erro ao emitir relatório");
                }
            }
        };
        request.open('GET', `${environment.hosts.hostRequestNew}${type.path}?isPdf=${typeReport}&${filters}`);
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.responseType = 'arraybuffer';
        request.send(ConnectionServer.prepareRequest(null, false));
    }

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
                }
            })
        });
    }

    function intiEventSelect(listSelect) {
        listSelect.map(item => {
            ReportController.getListSelect(item.path_url).then(({response}) => {
                document.getElementById(item.field).innerHTML = `<option value="" selected>-----------------------</option>` + response.map(option => {
                    return `<option value="${option.id}">${option.text}</option>`
                }).join("");
            })
        })
    }
});