class PermissionUser {
    static hasPermission(nameGroup, namePermission) {
        const roles = JSON.parse(localStorage.getItem("@roles"));
     
        if (!roles)
            return false;

        let hasPermission = false;

        roles.groups.map(group => {
            if (group.name !== nameGroup)
                return;

            group.permissions.map(permission => {
                if (permission === namePermission)
                    hasPermission = true;
            });

        });

        return hasPermission;
    }
}


const CLIENTE = 'cliente';
const MOTORISTA = 'motorista';
const CIDADE = 'cidade';
const CONFIGURACAO = 'configuracao';
const CONTATO = 'contato';
const CORRIDA = 'corrida';
const MARKETING = 'marketing';
const FINANCEIRO = 'financeiro';
const TARIFAS = 'tarifas';