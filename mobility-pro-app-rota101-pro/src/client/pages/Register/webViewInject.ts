export const injectDynamic = (titleElement: string) => {
  const css = `
    header,
    nav.content-nav,
    .content-nav,
    .content-logo,
    .content-links,
    .merchant-download,
    .content-merchant-website,
    footer,
    ${titleElement} {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      position: absolute !important;
      top: -9999px !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .brand-header-link {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: transparent !important;
      background-color: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 auto 1.5rem auto !important;
      border: none !important;
      text-decoration: none !important;
      width: auto !important;
    }

    .brand-header-link .brand-name,
    .brand-header-link span {
      display: none !important;
      visibility: hidden !important;
    }

    .brand-header-link img {
      width: 130px !important;
      height: 130px !important;
      max-width: 130px !important;
      max-height: 130px !important;
      border-radius: 16px !important;
      object-fit: contain !important;
      display: block !important;
      margin: 0 auto !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    .content-driver .column-1,
    .content-passenger .column-1 {
      align-items: center !important;
      text-align: center !important;
    }
  `;

  return `
  (function() {
    var injectedCss = ${JSON.stringify(css)};

    function applyStyles() {
      try {
        var parent = document.head || document.documentElement;
        if (!parent) return;
        var styleEl = document.getElementById('hide-app-elements-style');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'hide-app-elements-style';
          styleEl.type = 'text/css';
          parent.appendChild(styleEl);
        }
        if (styleEl.textContent !== injectedCss) {
          styleEl.textContent = injectedCss;
        }
      } catch(e) {}
    }

    function notifyLoaded() {
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAGE_LOADED' }));
        }
      } catch(e) {}
    }

    function cleanElements() {
      try {
        var toRemove = document.querySelectorAll('header, nav.content-nav, .content-nav, .content-logo, .content-links, .merchant-download, .content-merchant-website, footer, ${titleElement}');
        for (var i = 0; i < toRemove.length; i++) {
          toRemove[i].style.setProperty('display', 'none', 'important');
        }
      } catch(e) {}
    }

    function updateBrandLogo() {
      try {
        var brandImgs = document.querySelectorAll('.brand-header-link img');
        for (var i = 0; i < brandImgs.length; i++) {
          var img = brandImgs[i];
          if (img.getAttribute('data-logo-applied') !== 'true') {
            img.src = 'https://minio.704app.com.br/rota101fb704/default.jpg';
            img.setAttribute('data-logo-applied', 'true');
          }
        }
        var brandNames = document.querySelectorAll('.brand-header-link .brand-name, .brand-header-link span');
        for (var k = 0; k < brandNames.length; k++) {
          brandNames[k].style.setProperty('display', 'none', 'important');
        }
      } catch(e) {}
    }

    function removePassengerCpf() {
      try {
        var isPassenger = !window.location.href.includes("motorista") && !window.location.href.includes("driver");
        if (!isPassenger) return;

        var selectors = [
          'input[name="document"]',
          'input[placeholder*="CPF"]',
          'input[placeholder*="cpf"]',
          'input[placeholder*="Cpf"]',
          '#cpf-user',
          '.container-compel-field[type="document"]',
          '[data-field="document"]'
        ];

        for (var s = 0; s < selectors.length; s++) {
          var inputs = document.querySelectorAll(selectors[s]);
          for (var idx = 0; idx < inputs.length; idx++) {
            var el = inputs[idx];
            var ph = (el.getAttribute('placeholder') || '').toLowerCase();
            var nm = (el.getAttribute('name') || '').toLowerCase();
            if (ph.indexOf('nasc') !== -1 || ph.indexOf('data') !== -1 || nm.indexOf('date') !== -1 || nm.indexOf('birth') !== -1) {
              continue;
            }
            var container = el.closest('.cpf-container') || el.closest('.container-compel-field') || el.parentElement;
            if (container && container !== document.body && container !== document.documentElement) {
              var dateInput = container.querySelector('input[name="dateOfBirth"]') || container.querySelector('input[placeholder*="nasc"]');
              if (!dateInput) {
                container.style.display = 'none';
                continue;
              }
            }
            el.style.display = 'none';
          }
        }
      } catch(e) {}
    }

    function runAll() {
      applyStyles();
      cleanElements();
      updateBrandLogo();
      removePassengerCpf();
      notifyLoaded();
    }

    runAll();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runAll);
    }

    window.addEventListener('load', runAll);
    setTimeout(runAll, 300);
    setTimeout(runAll, 1000);

    if (window.location.href.includes("cliente/preregister")) {
      var contentModal = document.querySelector(".contentModal");
      if (contentModal) {
        var originalContent = contentModal.innerHTML;
        contentModal.innerHTML = '';
        var containerModal = document.querySelector("#chooseApp");
        var buttonRedirectLogin = document.createElement("button");
        buttonRedirectLogin.setAttribute("class", "btnAndroid");
        buttonRedirectLogin.textContent = "Fazer Login";
        contentModal.appendChild(buttonRedirectLogin);
        buttonRedirectLogin.addEventListener("click", function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify("redirect-login"));
            if (containerModal) containerModal.setAttribute("class", "modal");
            contentModal.innerHTML = originalContent;
          }
        });
      }
    }
  })();
  true;
  `;
};
