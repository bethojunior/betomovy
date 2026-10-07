class CityConfig {
    static getTypeCoin(){
        const config = Session.get("cityConfig");

        if(Array.isArray(config))
            return "R$";

        return config.typeMoney || "R$";
    }
}
