
getRemoveRequest()

function getRemoveRequest(page = 1) {
    preload(true)
    ClientController.getAllRemoveAccountRequest(page)
    .then(response => {
        preload(false)
        const result = response.response.data;
        const current_page = response.response.current_page
        const last_page = response.response.last_page

        current_page == last_page
        ? document.getElementById("nextPage").disabled = true
        : document.getElementById("nextPage").disabled = false

        current_page == 1 
        ? document.getElementById("prevPage").disabled = true
        : document.getElementById("prevPage").disabled = false

        document.querySelector("#tableRemoveAccountRequest").innerHTML = result.map(item => {
            return mountList(item)
        }).join("");

        elementProperty.addEventInElement('#nextPage', 'onclick', function() {
            getRemoveRequest(current_page + 1)      
        })

        elementProperty.addEventInElement('#prevPage', 'onclick', function() {
            getRemoveRequest(current_page - 1)      
        })

        elementProperty.addEventInElement(".btn-view-notification", "onclick", function () {
            const idNotification = this.getAttribute("idNotification");

            SwalCustom.dialogConfirm("Confirma Exclusão de Conta", "", (status) => {
                if (status) {
                    preload(true);
                    removeAccountUser(idNotification)
                }
            })
        });
    })
}

function removeAccountUser(idNotification) {
    ClientController.removeAccountUser(idNotification)
    .then(({status}) => {
        if(!status) {
            return SwalCustom.messageDialog('', 'Erro ao exclir conta!', 'error')
        }

        SwalCustom.messageDialog('', 'Conta Excluida com sucesso!', 'success').then(() => {
            getRemoveRequest();
        })
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        preload(false);
    });
}

function mountList(item) {
    return `
    <tr ${item.read == true ? "style='opacity:0.75'" : ""}>
        <td style="max-width: 300px;">${item.reason}. ${item.details}</td>
        <td>${new Date(item.created_at).toLocaleString()}</td>
        <td>${item.userName}</td>
        <td>${item.platform || '-'}</td>
        <td><a href="https://wa.me/55${item.userPhone != null && item.userPhone.replace(/[^0-9.]/g, "")}" target="_blank">${ item.userPhone != null ? Mask.setMaskPhoneValue(item.userPhone) : "Não Informado"}</a></td>
        <td>${`<button type="button" class="btn btn-info btn-view-notification" idNotification="${item.userId}">Excluir Conta</button>`}</td>
    </tr>`
}