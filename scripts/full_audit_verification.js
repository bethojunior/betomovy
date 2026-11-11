const https = require('https');

const API_BASE = 'https://api.movymob.com';
const HEADERS = {
  'token': 'MTc5MjQzMDc1Mzg=',
  'userid': '8',
  'cityid': '5695',
  'platform': '1',
  'Content-Type': 'application/json'
};

const endpoints = [
  // 1. Configurações Avançadas & Textos
  { method: 'GET', path: '/tripTypeDriver', desc: 'Tipos de Corrida para Motoristas' },
  { method: 'GET', path: '/config/textTripTypes', desc: 'Textos de Tipos de Corrida' },
  { method: 'GET', path: '/cancellationReasons', desc: 'Motivos de Cancelamento' },
  { method: 'GET', path: '/cancellationReasonsType', desc: 'Tipos de Motivo de Cancelamento' },
  { method: 'GET', path: '/termsUsePolicy', desc: 'Termos de Uso e Política de Privacidade' },
  { method: 'GET', path: '/appConfig', desc: 'Configurações Globais dos Apps' },
  { method: 'GET', path: '/doc', desc: 'Documentos Exigidos' },
  { method: 'GET', path: '/appVersion', desc: 'Versões dos Aplicativos' },
  { method: 'GET', path: '/smtpServer', desc: 'Servidores SMTP de Notificação' },
  { method: 'GET', path: '/userPenaltiesType', desc: 'Tipos de Penalidades' },
  { method: 'GET', path: '/adminNotification', desc: 'Notificações Administrativas' },
  { method: 'GET', path: '/adminNotificationType', desc: 'Tipos de Notificações' },
  { method: 'GET', path: '/chatBotTrip', desc: 'Mensagens de ChatBot em Viagem' },
  { method: 'GET', path: '/chatBotTripType', desc: 'Tipos de Mensagens de ChatBot' },
  { method: 'GET', path: '/config_list_phone_general', desc: 'Configuração de Contatos' },
  { method: 'GET', path: '/list_contacts_general', desc: 'Lista Geral de Contatos' },

  // 2. Financeiro & Lançamentos
  { method: 'GET', path: '/creditPrepaid', desc: 'Planos de Crédito Pré-pago' },
  { method: 'GET', path: '/paymentForm', desc: 'Formas de Pagamento' },
  { method: 'GET', path: '/balanceFlowType', desc: 'Tipos de Fluxo Financeiro' },
  { method: 'GET', path: '/balancePosting', desc: 'Lançamentos de Saldo' },
  { method: 'GET', path: '/referralMonetization', desc: 'Monetização por Indicação' },
  { method: 'GET', path: '/userIndication/referredUsers', desc: 'Usuários Indicados' },
  { method: 'GET', path: '/userIndication/referralEarnings', desc: 'Ganhos por Indicação' },
  { method: 'GET', path: '/report/driver/synthetic', desc: 'Relatório Sintético de Motoristas' },
  { method: 'GET', path: '/report/select/driverRegisterStatus', desc: 'Opções de Status de Cadastro' },
  { method: 'GET', path: '/docStatus', desc: 'Status de Documentação' },

  // 3. Mapas, Segurança & Parceiros
  { method: 'GET', path: '/webMapKey', desc: 'Chaves de Mapa Web' },
  { method: 'GET', path: '/addressBlacklist', desc: 'Endereços Bloqueados' },
  { method: 'GET', path: '/riskArea', desc: 'Áreas de Risco' },
  { method: 'GET', path: '/partner', desc: 'Parceiros Comerciais' },
  { method: 'GET', path: '/audit', desc: 'Log de Auditoria' },
  { method: 'GET', path: '/gender', desc: 'Gêneros Cadastrados' },
  { method: 'GET', path: '/advertisingAppSite', desc: 'Banners do App/Site' },
  { method: 'GET', path: '/publicitiesApp', desc: 'Publicidades no Aplicativo' },
  { method: 'GET', path: '/advertising', desc: 'Publicidades Globais' },
  { method: 'GET', path: '/company', desc: 'Empresas Conveniadas' },
  { method: 'GET', path: '/app', desc: 'Lista de Apps Conectados' },

  // 4. Delivery
  { method: 'GET', path: '/deliveryCallConfig', desc: 'Configurações de Chamada Delivery' },
  { method: 'GET', path: '/deliverySection', desc: 'Seções / Categorias Delivery' },
  { method: 'GET', path: '/deliveryNeighborhood', desc: 'Bairros de Atendimento Delivery' },
  { method: 'GET', path: '/typeDeliveryCategory', desc: 'Tipos de Veículo Delivery' },

  // 5. Corridas Ativas & Operação MovyCentral
  { method: 'GET', path: '/central/1/trip/activesRealtime', desc: 'Corridas Ativas em Tempo Real (Central 1)' },
  { method: 'GET', path: '/dashboard/all', desc: 'Dashboard Indicadores em Tempo Real' },
  { method: 'GET', path: '/dashboard/rankingDriver', desc: 'Ranking de Motoristas' },
  { method: 'GET', path: '/dashboard/rankingCustomer', desc: 'Ranking de Passageiros' },
  { method: 'GET', path: '/driver/positions', desc: 'Posições de Motoristas no Mapa' }
];

function testEndpoint(ep) {
  return new Promise((resolve) => {
    const url = new URL(API_BASE + ep.path);
    const start = Date.now();
    const req = https.request(url, {
      method: ep.method,
      headers: HEADERS,
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        let json = null;
        try { json = JSON.parse(data); } catch(e) {}
        
        const isOk = res.statusCode >= 200 && res.statusCode < 300;
        const hasStatus = json && json.status === true;
        resolve({
          path: ep.path,
          desc: ep.desc,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          ok: isOk && (hasStatus || Array.isArray(json) || (json && json.status !== false)),
          details: json ? (Array.isArray(json.response) ? `${json.response.length} itens` : typeof json.response) : data.substring(0, 60)
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path: ep.path,
        desc: ep.desc,
        statusCode: 0,
        duration: 'ERR',
        ok: false,
        details: err.message
      });
    });

    req.end();
  });
}

async function runAll() {
  console.log('='.repeat(80));
  console.log('AUDITORIA DE PRODUÇÃO — MOVY API (https://api.movymob.com)');
  console.log('='.repeat(80));

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    const icon = res.ok ? '[OK PASS]' : '[FALHOU]';
    if (res.ok) passed++; else failed++;
    console.log(`${icon.padEnd(10)} ${res.statusCode} | ${res.duration.padStart(6)} | ${res.path.padEnd(42)} | ${res.desc} (${res.details})`);
  }

  console.log('='.repeat(80));
  console.log(`TOTAL AUDITADOS: ${endpoints.length} | APROVADOS: ${passed} | FALHAS: ${failed}`);
  console.log('='.repeat(80));
}

runAll();
