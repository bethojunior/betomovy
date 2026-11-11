const fs = require('fs');

const fileContent = fs.readFileSync('mobilidade-monitor-new-main/src/components/Menu/Items/index.tsx', 'utf8');

// Extrair de `const list: MenuItem[] = [` até o final da declaração
const startIndex = fileContent.indexOf('const list: MenuItem[] = [');
// Procurar onde fecha o array list
let pos = startIndex + 'const list: MenuItem[] = ['.length - 1;
let openBrackets = 0;
let listStr = '';
for (let i = pos; i < fileContent.length; i++) {
    if (fileContent[i] === '[') openBrackets++;
    else if (fileContent[i] === ']') {
        openBrackets--;
        if (openBrackets === 0) {
            listStr = fileContent.substring(pos, i + 1);
            break;
        }
    }
}

// Criar um sandbox limpo para avaliar a estrutura de objetos substituindo expressões JSX, funções e variáveis
let sanitized = listStr
    // Substituir ícones JSX
    .replace(/icon:\s*<[^>]+>/g, 'icon: null')
    // Substituir traduções t("...")
    .replace(/t\(["']([^"']+)["']\)/g, '"$1"')
    // Substituir chamadas e variáveis de permissão
    .replace(/permission:\s*[^,\n\}]+/g, 'permission: true')
    // Substituir callbacks onClick
    .replace(/onClick:\s*[^,\n\}]+/g, 'onClick: "function"')
    // Substituir speedmob e variáveis
    .replace(/speedmob:\s*[^,\n\}]+/g, 'speedmob: "true"')
    .replace(/children:\s*canAccessImportSettings\s*\?\s*\[/g, 'children: [')
    .replace(/children:\s*hasPermission\([^)]+\)\s*\?\s*\[/g, 'children: [');

// Limpar trailing ternários se houver
sanitized = sanitized.replace(/:\s*\[\]/g, '');

try {
    const fn = new Function('return ' + sanitized);
    const parsedList = fn();
    fs.writeFileSync('scripts/menu_hierarchy.json', JSON.stringify(parsedList, null, 2));
    console.log('Estrutura de menu extraída com sucesso! Top-level categorias:', parsedList.length);
} catch (e) {
    console.error('Erro ao avaliar JSON:', e.message);
    // Salvar o sanitizado para debug
    fs.writeFileSync('scripts/sanitized_menu.js', sanitized);
}
