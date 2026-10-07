class MilitaryForceGraduationController {
    static getMilitaryForceGraduation(page = 1) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`militaryForceGraduation?page=${page}`, 'GET', null, resolve, reject, true);
        });
    }

    static getMilitaryForce() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('militaryForce', 'GET', null, resolve, reject, true);
        });
    }

    static addMilitaryForceGraduation(patent, level, militaryForceId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('militaryForceGraduation', 'POST', {
                patent,
                level,
                militaryForceId
            }, resolve, reject, true);
        });
    }
}