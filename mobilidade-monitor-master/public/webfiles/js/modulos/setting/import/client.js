document.addEventListener("DOMContentLoaded", function () {
    preload(true);

    const fileName = `example.csv`;

    const grid = canvasDatagrid({
        parentNode: document.getElementById('showReportExample'),
        data: []
    });

    const gridPreview = canvasDatagrid({
        parentNode: document.getElementById('previewImport'),
        data: []
    });

    ImportController.getExampleCustomer().then(({blob, contentTypeHeader}) => {
        const objectBlob = new Blob([blob], {type: contentTypeHeader})

        const downloadLink = window.document.createElement('a');

        const fileReader = new FileReader();

        fileReader.onload = function (event) {
            setTimeout(() => {
                grid.style.height = '150px';
                grid.style.width = '100%';

                const workbook = XLSX.read(event.target.result, {type: "binary"});

                workbook.SheetNames.forEach(sheet => {
                    grid.data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                });
            }, 1000);
        };

        fileReader.readAsBinaryString(objectBlob);

        downloadLink.href = window.URL.createObjectURL(objectBlob);
        downloadLink.download = fileName;
    }).finally(() => {
        preload(false);
    });

    elementProperty.addEventInElement("#importFileClient", "onchange", function () {
        if (this.files && this.files[0]) {
            preload(true);
            const fileReader = new FileReader();

            fileReader.onload = function (event) {
                setTimeout(() => {
                    gridPreview.style.height = '300px';
                    gridPreview.style.width = '100%';

                    const workbook = XLSX.read(event.target.result, {type: "binary"});

                    workbook.SheetNames.forEach(sheet => {
                        gridPreview.data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                        preload(false);
                    });
                }, 1000);
            };

            fileReader.readAsBinaryString(this.files[0]);
        }
    });

    elementProperty.addEventInElement("#btnImportClient", "onclick", function () {
        const file = document.querySelector("#importFileClient").files[0];

        if (file == null)
            return alert("Selecione o arquivo de importação");

        preload(true);
        setTimeout(() => {
            preload(false);
            SwalCustom.messageDialog("", "Seu arquivo está sendo processado, em breve irá receber uma notificação de validação",
                "success").then(() => location.reload());
        }, 2000)
        ImportController.importClient(file).then(({status, message}) => {
            if (!status)
                SwalCustom.messageDialog("", message);
        }).finally(() => {
            preload(false);
        });
    });
});