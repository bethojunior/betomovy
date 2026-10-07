class DocUserController {
    static send({text, image, pdf, docId}) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            formData.append("docId", docId);

            if (text != null)
                formData.append("text", text);

            if (pdf != null)
                formData.append(`PDF_${docId}`, pdf);

            if (image != null) {
                FileUpload.prepare(image).then((file) => {
                    formData.append(
                        `DOC_${docId}`,
                        file.data,
                        file.name
                    );

                    ConnectionServer.sendRequestWithFiles(`DocUser/Send`, "POST", formData)
                        .then(resolve).catch(reject);

                })
            } else {
                ConnectionServer.sendRequestWithFiles(`DocUser/Send`, "POST", formData)
                    .then(resolve).catch(reject);
            }
        });
    }

    static find() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DocUser/Find", "GET", null, resolve, reject);
        })
    }
}
