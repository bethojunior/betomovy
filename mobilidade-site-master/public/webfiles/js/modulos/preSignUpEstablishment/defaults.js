const elementProperty         = new ElementProperty()
const countryController       = new CountryController()
const bankController          = new BankController()
const images = []

const establishment = {

    alias: null,
    document: null,
    address: null,
    number: null,
    zipcode: null,
    neighborhood: null,
    cityId: null,
    estateId: null,

    // secondstep
    rating: null,
    commercialPhone: null,

    latitude: null,
    longitude: null,
    user:{
        bankAccount: {
            bankId: null,
            typeAccount: null,
            agency: null,
            numberAccount: null,
        },
    }
}