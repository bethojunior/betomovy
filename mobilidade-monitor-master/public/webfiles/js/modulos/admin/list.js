document.addEventListener("DOMContentLoaded", listAdmins);

function listAdmins() {
    const elementProperty = new ElementProperty();

    AdminController.get().then(({status, response: data}) => {
        if (!status)
            return;
        elementProperty.getElement(".container-list", element => {
            element.innerHTML = data.map((admin) => {
                return ` <tr>
                            <td>${admin.name}</td>
                            <td>${admin.nickname}</td>
                            <td>${admin.roleName}</td>
                            <td>${admin.phone}</td>
                            <td>${admin.email}</td>
                            <td><a href="#" class="remove-user" value="${admin.idUser}">Excluir</a></td>
                        </tr>`;
            }).join("");

            elementProperty.addEventInElement(".remove-user", "onclick", function () {
                SwalCustom.confirm("Deseja excluir esse usuário").then(() => {
                    preload(true);
                    AdminController.delete(this.getAttribute("value")).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            if (status)
                                location.reload();
                        })
                    }).finally(() => {
                        preload(false);
                    })
                });
            })
        });
    });
}