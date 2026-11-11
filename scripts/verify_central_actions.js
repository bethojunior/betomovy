const fs = require('fs');

const menuLinks = [
    { url: '/', controller: 'DefaultController', action: 'actionIndex' },
    { url: '/trip/list', controller: 'TripController', action: 'actionList' },
    { url: '/district/list', controller: 'DistrictController', action: 'actionList' },
    { url: '/neighborhoodRides/list', controller: 'NeighborhoodRidesController', action: 'actionList' },
    { url: '/customer/list', controller: 'CustomerController', action: 'actionList' },
    { url: '/voucher/list', controller: 'VoucherController', action: 'actionList' },
    { url: '/driver/list', controller: 'DriverController', action: 'actionList' },
    { url: '/dynamicfields/list', controller: 'DynamicFieldsController', action: 'actionList' },
    { url: '/language/management', controller: 'LanguageController', action: 'actionManagement' },
    { url: '/whatsapp/management', controller: 'WhatsappController', action: 'actionManagement' },
    { url: '/whatsapp/groups', controller: 'WhatsappController', action: 'actionGroups' },
    { url: '/logout', controller: 'DefaultController', action: 'actionLogout' }
];

console.log('=== AUDITORIA DE CONTROLLERS E ACTIONS DA CENTRAL ===');
menuLinks.forEach(item => {
    const file = `mobilidade-central-master/src/controller/${item.controller}.php`;
    if (!fs.existsSync(file)) {
        console.log(`[ERRO] Controller inexistente: ${file}`);
        return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const hasAction = content.includes(`function ${item.action}`) || content.includes(`function ${item.action}(`);
    console.log(`[${hasAction ? 'OK' : 'FALHA'}] ${item.url} -> ${item.controller}::${item.action}`);
});
