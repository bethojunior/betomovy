const fs = require('fs');

console.log('=== ROTAS E MENUS DO MONITOR (movymonitor.com) ===');
const monitorRoutesContent = fs.readFileSync('mobilidade-monitor-new-main/src/routes/LoggedRoutes.tsx', 'utf8');
const routeRegex = /<Route[^>]*path=["']([^"']+)["'][^>]*component=\{([^}]+)\}/g;
let match;
const monitorRoutes = [];
while ((match = routeRegex.exec(monitorRoutesContent)) !== null) {
    monitorRoutes.push({ path: match[1], component: match[2].trim() });
}

// Menu items
const menuContent = fs.readFileSync('mobilidade-monitor-new-main/src/components/Menu/Items/index.tsx', 'utf8');

console.log(JSON.stringify({
    totalMonitorRoutes: monitorRoutes.length,
    routes: monitorRoutes
}, null, 2));

console.log('\n=== ROTAS E MENUS DA CENTRAL (movycentral.com) ===');
const centralControllers = fs.readdirSync('mobilidade-central-master/src/controller');
const centralViews = fs.readdirSync('mobilidade-central-master/src/views');

console.log(JSON.stringify({
    controllers: centralControllers,
    views: centralViews
}, null, 2));
