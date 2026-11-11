const fs = require('fs');

// Parser completo para os Menus do Monitor
const menuContent = fs.readFileSync('mobilidade-monitor-new-main/src/components/Menu/Items/index.tsx', 'utf8');

// Vamos extrair as categorias e itens do menu estruturado
// Procurar items do tipo: { key: ..., name: ..., to: ..., children: [...] }
const menuLines = menuContent.split('\n');

const tree = [];
let currentCategory = null;
let currentSubCategory = null;

// Encontrar todas as seções principais
const parsedSections = [];

// Usar script de extração AST ou Regex detalhado
const sectionRegex = /key:\s*["']([^"']+)["'],\s*name:\s*(?:t\(["']([^"']+)["']\)|["']([^"']+)["'])(?:,\s*icon:[^,]+)?(?:,\s*to:\s*["']([^"']+)["'])?/g;

console.log("Iniciando varredura detalhada...");
