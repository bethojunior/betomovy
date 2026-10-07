document.addEventListener("DOMContentLoaded", () => {
    list();

    function list() {
        preload(true);
        MilitaryForceController.getMilitaryForce().then(({response}) => {
            document.querySelector('#listMilitaryForce').innerHTML = response.map((item) => {
                return `
                    <button type="button" class="btn btn-info">${item.name}</button>
                `
            }).join("");

            preload(false);
        });

        elementProperty.addEventInElement("#formAddMilitaryForce", "onsubmit", addMilitaryForce);
    }

    function addMilitaryForce(event) {
        event.preventDefault();
        const name = document.getElementById("nameÓrgão").value;

        preload(true);
        MilitaryForceController.addMilitaryForce(name).then(() => {
            preload(false);

            $('#modalAddMilitaryForce').modal('hide');
            SwalCustom.messageDialog("", "Órgão militar adicionado com sucesso!", "success").then(() => list());
        });
    }

});