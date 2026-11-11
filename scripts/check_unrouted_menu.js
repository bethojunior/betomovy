const fs = require('fs');

const menuItems = JSON.parse(fs.readFileSync('scripts/monitor_menu_items.json', 'utf8'));
const routesMap = JSON.parse(fs.readFileSync('scripts/monitor_routes_map.json', 'utf8'));

const unrouted = menuItems.filter(item => !item.hasRoute);
console.log('Menu items without matching route in LoggedRoutes:', unrouted.length);
if (unrouted.length > 0) {
    console.log(JSON.stringify(unrouted, null, 2));
}

// Check which routes in LoggedRoutes have no menu item pointing to them (e.g. details pages, edit pages, etc.)
const menuPaths = new Set(menuItems.map(i => i.to));
const standaloneRoutes = Object.keys(routesMap).filter(r => !menuPaths.has(r));
console.log('Standalone / Detail / Edit routes in LoggedRoutes (not in main menu):', standaloneRoutes.length);
console.log(JSON.stringify(standaloneRoutes, null, 2));
