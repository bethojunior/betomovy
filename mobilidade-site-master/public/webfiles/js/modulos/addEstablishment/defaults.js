const bankController          = new BankController()
const countryController       = new CountryController()
const userController          = new UserController()
const elementProperty         = new ElementProperty()
const images                  = []

const establishment = {
        fantasyName: null,
        document: null,
        address: null,
        number: null,
        zipcode: null,
        neighborhood: null,
        cityId: null,
        estateId: null,
        rating: null,
        minDailyRate: null,
        maxDailyRate: null,
        averageValue: null,
        commercialEmail: null,
        administratorEmail: null,
        commercialPhone: null,
        administratorPhone: null,
        indicationDiscount: null,
        latitude: null,
        longitude: null,
        bankAccount: {
            bankId: null,
            typeAccount: null,
            agency: null,
            numberAccount: null,
        },
    employees: []
}

if(screen.width <= 991) {
   window.location.href = 'RegisterMobile'
}