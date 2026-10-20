const elementProperty = new ElementProperty();
let central = Session.get("centralSelected") || {};

// Campos de texto da API são escapados antes de ir ao innerHTML para evitar XSS
const escapeHtml = (str) => str
    ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
    : '';

Mask.setMoneyField(".input-value-price");

if (!central || !central.id) {
    const tableEl = document.querySelector("#resultTable");
    if (tableEl) {
        tableEl.innerHTML = '<tr><td colspan="4" class="text-center p-4">Selecione uma central para visualizar as taxas.</td></tr>';
    }
} else {
    listFeeByNeighborhood();
    listNeighborhood();
    listTypeTrip();
}

function listNeighborhood () {
    if (!central.latitude || !central.longitude) return;
    NeighborhoodController.listNeighborhood(central.latitude, central.longitude).then((response) => {
        const items = response?.response || response?.data || [];
        if (!Array.isArray(items)) return;
        const html = items.map((item) =>
            `<option value="${item.id}">${escapeHtml(item.name)}</option>`
        ).join('');
        const select = document.getElementById("neighborhood");
        if (select) select.innerHTML += html;
    }).catch(console.error);
}

function listTypeTrip () {
    NeighborhoodController.listTypeTrip().then((response) => {
        const items = response?.response || response?.data || [];
        if (!Array.isArray(items)) return;
        const html = items.map((item) =>
            `<option value="${item.idTripType}">${escapeHtml(item.type)}</option>`
        ).join('');
        const select = document.getElementById("typeOfCall");
        if (select) select.innerHTML += html;
    }).catch(console.error);
}

function listFeeByNeighborhood () {
    if (typeof preload === "function") preload(true);
    NeighborhoodController.listFeeByNeighborhood(central.id).then((response) => {
        if (typeof preload === "function") preload(false);
        const items = response?.response || response?.data || [];
        const resultTable = document.querySelector("#resultTable");
        if (!resultTable) return;

        if (!Array.isArray(items) || items.length === 0) {
            resultTable.innerHTML = '<tr><td colspan="4" class="text-center p-4 text-muted">Nenhuma taxa cadastrada por bairro.</td></tr>';
            return;
        }

        resultTable.innerHTML = items.map((item) => {
            const money = JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney || Session.getLocal('cityConfig')?.typeMoney || "R$";
            return `
            <tr>
                <td>${escapeHtml(item.neighborhood?.name || item.neighborhoodName || (typeof item.neighborhood === 'string' ? item.neighborhood : '-'))}</td>
                <td>${escapeHtml(item.trip_type?.type || item.tripTypeName || (typeof item.tripType === 'string' ? item.tripType : '-'))}</td>
                <td>${money} ${Mask.maskMoney(item.value)}</td>
                <td>
                    <button class="dt-action-btn dt-action-btn--danger delete-neighborhood" value="${item.id}">Excluir</button>
                </td>
            </tr>
        `;
        }).join('');

        elementProperty.addEventInElement(".delete-neighborhood","onclick",function(el){
            const id = el.target.value;
            SwalCustom.dialogConfirm("Deseja excluir esse bairro?").then(() => {
                NeighborhoodController.deleteNeighborhood(id).then(() => {
                    listFeeByNeighborhood();
                    return SwalCustom.messageDialog("", "Excluido com sucesso", null, "success");
                });
            });
        });
    }).catch((err) => {
        console.error("Erro ao listar taxas de bairro:", err);
        if (typeof preload === "function") preload(false);
        const resultTable = document.querySelector("#resultTable");
        if (resultTable) {
            resultTable.innerHTML = '<tr><td colspan="4" class="text-center p-4 text-danger">Não foi possível carregar as taxas de bairro.</td></tr>';
        }
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
