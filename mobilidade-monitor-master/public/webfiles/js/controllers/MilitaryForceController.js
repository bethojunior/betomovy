class MilitaryForceController {
    static getMilitaryForce() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('militaryForce', 'GET', null, resolve, reject, true);
        });
    }

    static addMilitaryForce(name) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('militaryForce', 'POST', {
                name
            }, resolve, reject, true);
        });
    }
}