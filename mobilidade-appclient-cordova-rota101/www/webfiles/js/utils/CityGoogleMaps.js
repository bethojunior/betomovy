class CityGoogleMaps {

    constructor() {

        this.estates = [];

        EstateController.getAll().then(({data}) => {
            this.estates = data;
        });
    }


    getCityByPlace(place) {
        return new Promise((resolve, reject) => {
            const estate = this.estates.filter(estate => {
                return estate.sigla === this.getLocalFilter("administrative_area_level_1", place);
            })[0];

            CityController.getAll(estate.id).then(({data}) => {
                const city = data.filter(city => {
                    return city.nome === this.getLocalFilter("administrative_area_level_2", place) ||
                        city.nome ===  this.getLocalFilter("locality", place);
                })[0];

                if(city === undefined){
                    reject();
                    return;
                }

                resolve(parseInt(city.id));
            })
        })
    }


    getLocalFilter(name, place) {
        const data = place.address_components.filter(data => {
            return data.types.includes(name);
        });

        if (data.length === 0)
            return "";

        return data[0].short_name;
    }
}