(async () => {
  const routes = [
    '/', '/monitoring', '/config/notifications-admin', '/client/list', '/client/legal',
    '/client/insertLegal', '/client/removeAccountRequest', '/customer/documents',
    '/driver/list', '/driver/signup', '/driver/document', '/car/pending',
    '/trip/list', '/trip/analysis', '/saletrip/list',
    '/delivery/Monitoring', '/delivery/Register', '/delivery/financial', '/delivery/config',
    '/delivery/driverattachmenttype', '/delivery/rate', '/delivery/rateDobby', '/delivery/sections',
    '/delivery/settingCalled', '/delivery/zone', '/delivery/AcquirerConfiguration',
    '/delivery/acquirerDelivery', '/delivery/Charge', '/delivery/deliveryConfiguration',
    '/delivery/registerCategoryEstablishment',
    '/financial/list', '/financial/driverProduction', '/financial/comission', '/financial/charge',
    '/financial/prepaid', '/financial/boleto', '/financial/cancellationFee', '/financial/relatorios',
    '/partner/messagePartner', '/partner/listPartner', '/notify', '/notify/NotifyBirthday',
    '/contact/list', '/contact/report', '/report', '/report/reportNew', '/report/reportList',
    '/dashboard/bi', '/central', '/central/listCustomer', '/central/neighborhoods', '/central/setting',
    '/manager', '/manager/drivers', '/mapSetting', '/mapSetting/configMaps', '/mapSetting/configbycity',
    '/mapSetting/keys', '/mapSetting/routeOptimization', '/mapSetting/test', '/mapsetting/heatmap',
    '/setting', '/setting/modulesActive', '/config/modulesActives', '/setting/admin', '/setting/cities',
    '/setting/rates', '/setting/radius', '/setting/paymentform', '/setting/called', '/setting/keys',
    '/setting/appConfig', '/setting/version', '/setting/password', '/setting/profile', '/setting/smtp',
    '/setting/notification', '/setting/document', '/setting/acquirer', '/setting/acquirerByCity',
    '/setting/additionalsettings', '/setting/address', '/setting/addressblacklist', '/setting/cacheaddress',
    '/setting/chatbot', '/setting/confirmationCode', '/setting/dynamicByArea',
    '/setting/ExternalServicesByCity', '/setting/ExternalServicesGlobals', '/setting/importClient',
    '/setting/importDriver', '/setting/reasonCancellation', '/setting/requiredField',
    '/setting/signup/driver', '/setting/toll', '/setting/trigger', '/setting/triggerLabel',
    '/marketing/listCupom', '/marketing/ListPublicidade', '/marketing/Publicidade',
    '/marketing/menuLinkExternal', '/voucher/voucherList', '/item/list', '/item/index',
    '/item/accessibility', '/item/Obstacles', '/riskArea', '/route/route', '/route/routeList',
    '/route/promotionalBanner', '/route/releaseDrivers', '/support', '/termsusepolicy/list',
    '/versioning/applications', '/militaryForce/list', '/militaryForceGraduation/list',
    '/city/add', '/city/editArea', '/tips'
  ];
  const bad = [];
  const ok = [];
  for (const path of routes) {
    try {
      const res = await fetch(path, { credentials: 'include', redirect: 'follow' });
      const text = await res.text();
      const title = ((text.match(/<title[^>]*>([^<]*)/i) || [])[1] || '').trim().slice(0, 120);
      const head = text.slice(0, 4000);
      const isLogin = /Login Monitor|id=["']password["']/i.test(head) && /login/i.test(title + head);
      const is404 = /404|Página não encontrada|Pagina nao encontrada|não encontrada/i.test(title) ||
        /Página Não Encontrada/i.test(head);
      const isForbid = /Não possui permissão|sem permissão|forbid/i.test(head);
      const isFatal = /Fatal error|SQLSTATE|Uncaught Exception|Whoops!|Parse error|Exception in/i.test(text);
      const item = { r: path, status: res.status, title, isLogin, is404, isForbid, isFatal, len: text.length };
      if (isFatal || is404 || isLogin || isForbid || !res.ok) bad.push(item);
      else ok.push(item);
    } catch (e) {
      bad.push({ r: path, error: String(e) });
    }
  }
  return { okCount: ok.length, badCount: bad.length, bad, okTitles: ok.map(x => x.r + ' => ' + x.title) };
})()
