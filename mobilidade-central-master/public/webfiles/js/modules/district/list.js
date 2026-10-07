const elementProperty = new ElementProperty();
let central = Session.get("centralSelected");

// Campos de texto da API são escapados antes de ir ao innerHTML para evitar XSS
const escapeHtml = (str) => str
    ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
    : '';

Mask.setMoneyField(".input-value-price");
listFeeByNeighborhood();
listNeighborhood();
listTypeTrip()

function listNeighborhood () {
    NeighborhoodController.listNeighborhood(central.latitude, central.longitude).then((response) => {
        const html = response.response.map((item) =>
            `<option value="${item.id}">${escapeHtml(item.name)}</option>`
        ).join('');
        document.getElementById("neighborhood").innerHTML += html;
    })
}

function listTypeTrip () {
    NeighborhoodController.listTypeTrip().then((response) => {
        const html = response.response.map((item) =>
            `<option value="${item.idTripType}">${escapeHtml(item.type)}</option>`
        ).join('');
        document.getElementById("typeOfCall").innerHTML += html;
    })
}

function listFeeByNeighborhood () {
    preload(true);
    NeighborhoodController.listFeeByNeighborhood(central.id).then((response) => {     
        document.querySelector("#resultTable").innerHTML = response.response.map((item) => {
            const money = JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney ?? "R$";
            return `
            <tr>
                <td>${escapeHtml(item.neighborhood?.name)}</td>
                <td>${escapeHtml(item.trip_type?.type)}</td>
                <td>${money} ${Mask.maskMoney(item.value)}</td>
                <td>
                    <button class="dt-action-btn dt-action-btn--danger delete-neighborhood" value="${item.id}">Excluir</button>
                </td>
            </tr>
        `;
        }).join('');
        preload(false)
        elementProperty.addEventInElement(".delete-neighborhood","onclick",function(el){
            const id = el.target.value;
            SwalCustom.dialogConfirm("Deseja excluir esse bairro?").then(() => {
                NeighborhoodController.deleteNeighborhood(id).then(() => {
                    listFeeByNeighborhood();
                    return SwalCustom.messageDialog("", "Excluido com sucesso", null, "success");
                });
            });
        })
    });
}

elementProperty.addEventInElement(".save", "onclick", () => {
    const tripType = document.querySelector("#typeOfCall").value;
    const neighborhood = document.querySelector("#neighborhood").value;
    const value = document.querySelector(".input-value-price").value;

    if(tripType == null || tripType == '0')
        return SwalCustom.messageDialog("Escolha o tipo de chamado", "Atenção", null, "Warning");
    
    if(neighborhood == null || neighborhood == '0')
        return SwalCustom.messageDialog("Escolha o bairro", "Atenção", null, "Warning");

    if(Mask.removeMaskMoney(value) == null || Mask.removeMaskMoney(value) == 0)
        return SwalCustom.messageDialog("Digite o valor da taxa", "Atenção", null, "Warning");    

    const data = {
        value: Mask.removeMaskMoney(value),
        centralId: central.id,
        tripTypeId: tripType,
        neighborhoodId: neighborhood
    }
    
    NeighborhoodController.sendAmountByNeighborhood(data).then(({status, message}) => {
        if(status){
            document.querySelector("#typeOfCall").value = '0';
            document.querySelector("#neighborhood").value = '0';
            document.querySelector(".input-value-price").value = '0';  
            SwalCustom.messageDialog(message, "Adicionado com sucesso", null, "success");        
            $('#AddValueByNeighborhood').modal('hide');
            return listFeeByNeighborhood();
        }else{
            SwalCustom.messageDialog(message, "Atenção", null, "warning");
        }
    }).catch(({message, response}) => {
        return SwalCustom.messageDialog(response[0], message, null, "warning");
    })
});
