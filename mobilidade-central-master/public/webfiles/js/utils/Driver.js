class Driver {
    static TAXI_USER_TYPE_ID = '3';

    static removeAccents(value) {
        return (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Mesmo formato exibido no app do motorista (2 letras do nickname + idDriver com 5 dígitos + tipo)
    static code(driver) {
        const nickname = Driver.removeAccents(driver.user?.nickname || driver.user?.name || driver.nickname || driver.name || '').trim();

        if (!nickname) return `${driver.idDriver}`;

        const letters = `${nickname[0]}${nickname[nickname.length - 1]}`.toUpperCase();
        const digits = `00000${driver.idDriver}`.slice(-5);
        const userTypeId = driver.user?.userTypeId ?? driver.userTypeId;
        const type = String(userTypeId) === Driver.TAXI_USER_TYPE_ID ? 'T' : 'P';

        return `${letters}${digits}${type}`;
    }
}
