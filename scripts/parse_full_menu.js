const fs = require('fs');

const fileContent = fs.readFileSync('mobilidade-monitor-new-main/src/components/Menu/Items/index.tsx', 'utf8');

// Obter linhas a partir da declaração da lista
const lines = fileContent.split('\n');
const listStart = 411; // 0-indexed

// Vamos extrair os blocos de primeiro nível (Categorias)
// Cada item principal tem `key: "...", name: ..., icon: ...` e pode ter `children: [...]` ou `to: "..."`
const mainSections = [];
let depth = 0;
let currentItem = null;
let currentChild = null;
let currentSubChild = null;

// Encontrar todas as chaves e labels
// Vamos fazer um script robusto para varrer a árvore
const fullMenuTree = [];

// Usar regex com posição ou parser de tokens simples
let inList = false;
let currentObjStr = '';
let braceCount = 0;

for (let i = listStart; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('const list: MenuItem[] = [')) {
        inList = true;
        continue;
    }
    if (!inList) continue;
    if (line.trim().startsWith('return') || line.trim().startsWith('const renderItem')) {
        break;
    }
}

// Extrair nomes das seções principais
const categoryMatches = [...fileContent.slice(fileContent.indexOf('const list: MenuItem[] = [')).matchAll(/{\s*key:\s*["']([^"']+)["'],\s*name:\s*(?:t\(["']([^"']+)["']\)|["']([^"']+)["'])/g)];

console.log('Total de itens e subitens identificados no menu:', categoryMatches.length);
fs.writeFileSync('scripts/menu_raw_matches.json', JSON.stringify(categoryMatches.map(m => ({
    key: m[1],
    name: m[2] || m[3]
})), null, 2));
