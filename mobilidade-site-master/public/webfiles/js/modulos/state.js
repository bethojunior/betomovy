const State =  new CountryController

let idState = 0;

State.getAllStates(response =>{
    response.data
        .map(StatesItem =>{
            renderListState(StatesItem)
        })
})


document.getElementById("inf-uf").addEventListener("change", () => {

    let select = document.getElementById("inf-uf")
    let idState = select.options[select.selectedIndex].getAttribute('idEstate')
    const infCidade = document.getElementById("inf-cidade")

    infCidade.disabled = false
    searchCity(idState, infCidade, (listCyty => console.log(listCity)))
})

async function searchCity(idState, selectElement, callback) {

    selectElement.disabled = false

    await State.getAllCityByIdState(idState, response=>{

        selectElement.innerHTML = ""
        Object.keys(response.data).map(cityItem =>{
            selectElement.innerHTML += `
               <option idCity='${response.data[cityItem].id}' value='${response.data[cityItem].nome}'>${response.data[cityItem].nome}</option>
           `
        })

        callback(selectElement)
    })
}


function renderListState(state){
    const element = document.getElementById("inf-uf")
    element.innerHTML += `
            <option idEstate='${state.id}' value='${state.nome}'>${state.nome}</option>
        `
}
