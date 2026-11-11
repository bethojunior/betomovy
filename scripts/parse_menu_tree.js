const fs = require('fs');

const fileContent = fs.readFileSync('mobilidade-monitor-new-main/src/components/Menu/Items/index.tsx', 'utf8');
const listStart = fileContent.indexOf('const list: MenuItem[] = [');

// Faremos um scanner de chaves e propriedades
const lines = fileContent.substring(listStart).split('\n');

const stack = [];
let currentItem = null;
const root = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('//') || line.startsWith('/*')) continue;

    // Detectar abertura de objeto
    if (line.includes('key:') && line.includes('name:')) {
        // Objeto em uma linha só
        const keyM = line.match(/key:\s*["']([^"']+)["']/);
        const nameM = line.match(/name:\s*(?:t\(["']([^"']+)["']\)|["']([^"']+)["'])/);
        const toM = line.match(/to:\s*["']([^"']+)["']/);
        const item = {
            key: keyM ? keyM[1] : '',
            name: nameM ? (nameM[1] || nameM[2]) : '',
            to: toM ? toM[1] : undefined,
            children: []
        };
        // push to parent
        if (stack.length > 0) {
            stack[stack.length - 1].children.push(item);
        } else {
            root.push(item);
        }
        if (line.includes('children:')) {
            stack.push(item);
        }
    } else if (line.startsWith('key:') || line.includes('key: "') || line.includes("key: '")) {
        const keyM = line.match(/key:\s*["']([^"']+)["']/);
        if (keyM) {
            const item = { key: keyM[1], name: '', children: [] };
            // procurar próximas linhas por name, to, children
            for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
                const subLine = lines[j].trim();
                const nameM = subLine.match(/name:\s*(?:t\(["']([^"']+)["']\)|["']([^"']+)["'])/);
                if (nameM && !item.name) {
                    item.name = nameM[1] || nameM[2];
                }
                const toM = subLine.match(/to:\s*["']([^"']+)["']/);
                if (toM && !item.to) {
                    item.to = toM[1];
                }
                if (subLine.includes('children:')) {
                    item.hasChildren = true;
                }
                if (subLine.includes('}') || subLine.includes('{')) break;
            }

            if (stack.length > 0) {
                stack[stack.length - 1].children.push(item);
            } else {
                root.push(item);
            }
            if (item.hasChildren) {
                stack.push(item);
            }
        }
    }

    if (line.includes('],') || line === ']' || line === ']}') {
        if (stack.length > 0) {
            stack.pop();
        }
    }
}

fs.writeFileSync('scripts/parsed_menu_tree.json', JSON.stringify(root, null, 2));
console.log('Total de categorias raiz extraídas:', root.length);
root.forEach((cat, idx) => {
    console.log(`${idx + 1}. [${cat.key}] ${cat.name || 'Sem nome'} (${cat.children ? cat.children.length : 0} subitens, to: ${cat.to || 'none'})`);
});
