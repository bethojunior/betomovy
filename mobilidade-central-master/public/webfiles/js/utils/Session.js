class Session {
    static get(name) {
        const result = $.cookie(name);
        if (!result) return null;

        return JSON.parse(atob(result));
    }

    static set(name, value) {
        const valueB64 = btoa(JSON.stringify(value));
        $.cookie(name, valueB64, {path: '/'});
    }

    static delete(name) {
        $.removeCookie(name, {path: '/'});
    }

    static getValueInSession(id, attribute) {
        const session = Session.get(id);

        if (!session)
            return null;

        if (Array.isArray(session))
            return session.map(item => {
                return item[attribute];
            });

        return session[attribute];

    }


    static getLocal(name) {
        let local = localStorage.getItem(name);

        if (local) {
            try {
                return JSON.parse(local);
            } catch (e) {
                return [];
            }
        }

        return [];
    }


    static setLocal(name, value) {
        if (value === undefined) return;

        localStorage.setItem(name, JSON.stringify(value));
    }

    static deleteLocal(name) {
        localStorage.removeItem(name);
    }

    static getValueInSessionLocal(id, attribute) {
        const session = Session.getLocal(id);

        if (!session)
            return null;

        if (Array.isArray(session))
            return session.map(item => {
                return item[attribute];
            });

        return session[attribute];

    }

}