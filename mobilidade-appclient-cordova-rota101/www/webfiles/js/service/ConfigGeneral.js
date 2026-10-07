function ConfigGeneral() {
    function get(name) {
        const configs = Session.get("configGeneral");
        const config =  configs.find(({key}) => name === key);
        return config ? config.value : null;
    }

    return {
        get
    }
}
