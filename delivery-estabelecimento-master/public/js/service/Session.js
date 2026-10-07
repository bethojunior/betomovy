class Session {
    static get(name) {
        $.cookie.json = true;
        return $.cookie(name);
    }


    static set(name, value) {
        $.cookie.json = true;
        $.cookie(name, value, {path: '/'});
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
