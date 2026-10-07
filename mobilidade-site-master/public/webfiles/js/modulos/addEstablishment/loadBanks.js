bankController
    .getAll(({status,data}) => {
        if(status)
            renderBanks(data)
    })

function renderBanks(listBanks) {

    let list = ''

    listBanks.map(bank => {
        list += `<option value='${bank.idBank}'>${bank.bankName}</option>`
    })

    elementProperty
        .getElement('#bankName', element => {
            element.innerHTML = ''
            element.innerHTML += list
    })
}