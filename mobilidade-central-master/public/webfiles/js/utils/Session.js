class Session {
    static get(name) {
        let result = $.cookie(name);
        if (!result) {
            try {
                const local = localStorage.getItem("session_" + name);
                if (local) return JSON.parse(local);
            } catch (e) {}
            return null;
        }

        try {
            return JSON.parse(decodeURIComponent(escape(atob(result))));
        } catch (e) {
            try {
                return JSON.parse(atob(result));
            } catch (err) {
                try {
                    return JSON.parse(result);
                } catch (e3) {
                    try {
                        const local = localStorage.getItem("session_" + name);
                        if (local) return JSON.parse(local);
                    } catch (e4) {}
                    return null;
                }
            }
        }
    }

    static set(name, value) {
        try {
            localStorage.setItem("session_" + name, JSON.stringify(value));
        } catch (storageErr) {}

        try {
            const str = JSON.stringify(value);
            const valueB64 = btoa(unescape(encodeURIComponent(str)));
            $.cookie(name, valueB64, {path: '/', expires: 30});
        } catch (e) {
            try {
                const valueB64 = btoa(JSON.stringify(value));
                $.cookie(name, valueB64, {path: '/', expires: 30});
            } catch (err) {
                $.cookie(name, JSON.stringify(value), {path: '/', expires: 30});
            }
        }
    }

    static delete(name) {
        try {
            localStorage.removeItem("session_" + name);
        } catch (e) {}
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