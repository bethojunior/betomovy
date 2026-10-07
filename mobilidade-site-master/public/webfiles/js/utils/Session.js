class Session {
    static get(name) {
        let result = $.cookie(name);
        if (result)
            return JSON.parse(atob(result));
        return result;
    }


    static set(name, value) {
        $.cookie(name,btoa(JSON.stringify(value)), {path: '/'});
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

        if (local)
            return JSON.parse(local);

        return [];
    }


    static setLocal(name, value) {
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