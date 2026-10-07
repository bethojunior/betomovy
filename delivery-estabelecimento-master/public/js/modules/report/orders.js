document.addEventListener("DOMContentLoaded", function () {
    elementProperty.addEventInElement("#dateStart", "onchange", function () {
        document.querySelector("#dateEnd").min = this.value;
        document.querySelector("#dateEnd").required = true;
    });

    elementProperty.addEventInElement("#formReport", "onsubmit", function (event) {
        event.preventDefault();

        const params = {
            dateStart: document.querySelector("#dateStart").value,
            dateEnd: document.querySelector("#dateEnd").value,
            status: document.querySelector("#status").value,
            paymentForm: document.querySelector("#paymentForm").value
        };

        const filters = "?" + Object.keys(params).filter((attribute) => {
            return params[attribute] != "";
        }).map(attribute => {
            return `${attribute}=${params[attribute]}`;
        }).join("&");

        Preload.show();

        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    if (request.response.type === "application/json")
                        return SwalCustom.messageDialog("", "Ocorreu um erro ao emitir relatório");

                    const fileName = `orders_${new Date().toLocaleString()}.xls` ;
                    const blob = this.response;

                    const downloadLink = window.document.createElement('a');
                    const contentTypeHeader = request.getResponseHeader("Content-Type");

                    const objectBlob = new Blob([blob], {type: contentTypeHeader});

                    Preload.hide();

                    downloadLink.href = window.URL.createObjectURL(objectBlob);
                    downloadLink.download = fileName;

                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    }
                } else {
                    Preload.hide();
                    let decode = new TextDecoder();
                    const response = JSON.parse(decode.decode(this.response));
                    return SwalCustom.messageDialog("", response.message);
                }

                if (request.status === 404) {
                    Preload.hide();
                    return alert("Ocorreu um erro ao emitir relatório");
                }
            }
        };
        request.open('GET', `/api/company/${document.querySelector("#header-company-id").value}/report/orders${filters}`);
        request.setRequestHeader('token', document.querySelector("#header-api_token").value);
        request.setRequestHeader('userid', document.querySelector("#header-user_id").value);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.responseType = 'arraybuffer';
        request.send(ConnectionServer.prepareRequest(null, false));
    });
});
