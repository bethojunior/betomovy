document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    RulesController.actionGetAll().then(({response}) => {
        document.querySelector("#listRules").innerHTML = response.map(item => {
            return `<li class="list-group-item"  style="cursor: pointer">
                        ${item.name}
                        <div class="float-right">
                            <a href="#"><i class="material-icons m-1 remove-role" value="${item.id}">delete</i></a>
                            <a href="/role/edit/${item.id}"><i class="material-icons m-1">edit</i></a>
                        </div>
                    </li>`;
        }).join("");

        elementProperty.addEventInElement(".remove-role", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja remover esse perfil ?", "", (status) => {
                if (!status)
                    return;
                preload(true);
                RulesController.remove(this.getAttribute("value")).then(({status, message}) => {
                    SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                        if (status)
                            location.reload();
                    })
                }).finally(() => {
                    preload(false);
                });
            });
        });
    }).finally(() => preload(false));
});