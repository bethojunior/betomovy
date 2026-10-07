class Storaged {
    static get(name) {
        if (localStorage.getItem(name) === null) {
            return false;
        }

        return JSON.parse(localStorage.getItem(name));
    }


    static set(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }

    static delete(name) {
        localStorage.removeItem(name);
    }

    static setAttribute(nameStorage, property, newValue) {

        const data = Storaged.get(nameStorage);

        if (Array.isArray(data)) {
            Storaged.set(nameStorage, data.map(object => {
                object[property] = newValue;
                return object;
            }));
            return;
        }

        data[property] = newValue;

        Storaged.set(nameStorage, data);
    }
}
