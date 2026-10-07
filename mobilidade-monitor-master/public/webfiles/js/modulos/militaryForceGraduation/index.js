document.addEventListener("DOMContentLoaded", () => {
    let page = 1;
    list();

    function list() {
        preload(true);
        MilitaryForceGraduationController.getMilitaryForceGraduation(page).then(({response}) => {
            document.querySelector("#listMilitaryForceGraduation").innerHTML = response.data.map((item) => {
                return `
                    <tr>
                        <td>${item.patent}</td>
                        <td>${item.military_force.name}</td>
                    </tr>
                `
            }).join("");
            if(response.prev_page_url === null) {
                document.getElementById("backPage").classList.add("disabled");
            } else {
                document.getElementById("backPage").classList.remove("disabled");
            }

            if (response.next_page_url === null) {
                document.getElementById("nextPage").classList.add("disabled");
            } else {
                document.getElementById("nextPage").classList.remove("disabled");
            }
            preload(false);
        });

        MilitaryForceGraduationController.getMilitaryForce().then(({response}) => {
            document.querySelector("#categoryMilitarySelect").innerHTML = response.map((item) => {
                return `
                    <option value="${item.id}">${item.name}</option>
                `
            }).join("");
        });

        elementProperty.addEventInElement("#formAddMilitaryGraduation", "onsubmit", addMilitaryGraduation);
        elementProperty.addEventInElement("#nextPage", "onclick", nextPage);
        elementProperty.addEventInElement("#backPage", "onclick", backPage);
    }

    function addMilitaryGraduation(event) {
        event.preventDefault();
        const patent = document.getElementById("namePatent").value;
        const level = document.getElementById("level").value;
        const militaryForceId = document.getElementById("categoryMilitarySelect").value;

        preload(true);
        MilitaryForceGraduationController.addMilitaryForceGraduation(patent, level, militaryForceId).then(() => {
            preload(false);

            $('#modalAddMilitaryGraduation').modal('hide');
            SwalCustom.messageDialog("", "Pantente adicionada com sucesso!", "success").then(() => list());
        });
    }

    function nextPage(event) {
        event.preventDefault();
        if(this.classList.contains("disabled"))
            return;
        page += 1;
        list();
    }

    function backPage(event) {
        event.preventDefault();
        if(this.classList.contains("disabled"))
            return;
        page -= 1;
        list();
    }
});