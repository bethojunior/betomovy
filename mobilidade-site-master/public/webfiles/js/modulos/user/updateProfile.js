document.addEventListener("DOMContentLoaded", function () {
    const url = new URL(location.href);

    const userId = atob(url.searchParams.get("q"));

    document.querySelector("#captureImage").onchange = function () {
        const input = this;
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                document.querySelector(".preview-profile").style.backgroundImage = `url(${e.target.result})`;
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    document.querySelector("#btnSendProfile").onclick = function () {
        const file = document.querySelector("#captureImage").files[0];

        if (!file)
            return alert("Selecione a foto de perfil");

        ImageUpload.resize(file, 500, 500).then(result => {

            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("photo", result.data, result.name);

            preload(true)
            ConnectionServer.sendRequestWithFilesMain(`user/changeprofile`, "POST", formData)
                .then(() => {
                    SwalCustom.messageDialog("", "Foto atualizada com sucesso!", () => {
                        location.reload();
                    }, "success");
                }).finally(() => preload(false))
        });
    }
});