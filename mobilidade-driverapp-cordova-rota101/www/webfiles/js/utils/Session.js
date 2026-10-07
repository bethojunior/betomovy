class Session {
    static get(name) {

        if (SessionCache[name])
            return SessionCache[name];

        if (localStorage.getItem(name) === "undefined")
            Session.delete(name);

        if (localStorage.getItem(name) === null) {
            return [];
        }

        SessionCache[name] = JSON.parse(localStorage.getItem(name));

        return SessionCache[name];
    }

    static observeStorage(id,callback){
        SessionEvents.push({id,callback});
    }

    static set(name, value, saveInStorage = true) {
        if (saveInStorage)
            localStorage.setItem(name, JSON.stringify(value));

        SessionCache[name] = value;

        checkEventStorage(name);
    }

    static delete(name) {
        localStorage.removeItem(name);
        delete SessionCache[name];
    }

    static setAttribute(nameStorage, property, newValue) {

        const data = Session.get(nameStorage);

        if (Array.isArray(data)) {
            Session.set(nameStorage, data.map(object => {
                object[property] = newValue;
                return object;
            }));
            return;
        }

        data[property] = newValue;
        SessionCache[name] = data;

        Session.set(nameStorage, data);
    }

    static getValueInSession(id, attribute) {
        const session = Session.get(id);

        if (Array.isArray(session))
            return session.map(item => {
                return item[attribute];
            });

        return session[attribute];

    }
}

const SessionCache = {};

const SessionEvents = [];

function checkEventStorage(id){
    SessionEvents.filter(item=>{
        return item.id === id;
    }).map(item=>{
        item.callback();
    })
}