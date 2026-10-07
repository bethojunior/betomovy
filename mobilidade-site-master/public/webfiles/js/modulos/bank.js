$(document).ready(function () {
    const Bank = new BankController

    Bank.getAll(response => {
        response.data
            .map(bankItem => renderListBank(bankItem))
    })

    function renderListBank(bank){
        const element = document.getElementsByClassName("bankList")
        Object.keys(element).map(key => {
            element[key].innerHTML += `
            <option value='${bank.idBank}'>${bank.bankName}</option>
        `
        })
    }

})
