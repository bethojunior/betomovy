const fs = require('fs');

// 1. Parse LoggedRoutes.tsx
const routesFile = fs.readFileSync('mobilidade-monitor-new-main/src/routes/LoggedRoutes.tsx', 'utf8');
const routeBlockRegex = /<Route[^>]*path=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Route>/g;
let rMatch;
const routesMap = {};
while ((rMatch = routeBlockRegex.exec(routesFile)) !== null) {
    const path = rMatch[1];
    const body = rMatch[2];
    const compMatch = body.match(/<([A-Z][A-Za-z0-9]+)/);
    const component = compMatch ? compMatch[1] : 'Unknown';
    routesMap[path] = component;
}

// 2. Parse Menu/Items/index.tsx
const menuFile = fs.readFileSync('mobilidade-monitor-new-main/src/components/Menu/Items/index.tsx', 'utf8');

// Extrair items do array de menu
console.log('Total Routes mapped in LoggedRoutes:', Object.keys(routesMap).length);
fs.writeFileSync('scripts/monitor_routes_map.json', JSON.stringify(routesMap, null, 2));

// Parse Menu items
const keyRegex = /key:\s*["']([^"']+)["'],\s*name:\s*(?:t\(["']([^"']+)["']\)|["']([^"']+)["']),\s*to:\s*["']([^"']+)["']/g;
let mMatch;
const directMenuItems = [];
while ((mMatch = keyRegex.exec(menuFile)) !== null) {
    directMenuItems.push({
        key: mMatch[1],
        name: mMatch[2] || mMatch[3],
        to: mMatch[4],
        hasRoute: !!routesMap[mMatch[4]]
    });
}

console.log('Total direct menu items parsed:', directMenuItems.length);
fs.writeFileSync('scripts/monitor_menu_items.json', JSON.stringify(directMenuItems, null, 2));
