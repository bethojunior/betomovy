const prodApi    = "https://api.taxireturn.com.br/"
const testApi    = "https://apiteste.taxireturn.com.br/"
const productApi = prodApi

class CreditCardController {

    getCardsById(establishmentId) {
        return new Promise( resolve  => {
            ConnectionServer.sendRequest('Card/GetByEstablishment','POST',{establishmentId},resolve)
        })
    }

    getCardsFlags() {
        return new Promise( (resolve,reject) => {
            fetch(productApi+'CardFlag/GetAll')
                .then(response => resolve(response.json()))
                .catch(error   => reject(error) )

        })
    }

    addNewCard(newCard) {
        return new Promise( resolve  => {
            ConnectionServer.sendRequest('Card/Insert','POST',{...newCard},resolve)
        })
    }
}