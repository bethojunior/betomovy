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
        var styleEl = document.getElementById('hide-app-elements-style');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'hide-app-elements-style';
          styleEl.type = 'text/css';
          (document.head || document.documentElement).appendChild(styleEl);
        }
        styleEl.textContent = injectedCss;
      } catch(e) {}
    }

    var notifyLoaded = function() {
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAGE_LOADED' }));
        }
      } catch(e) {}
    };

    var cleanElements = function() {
      try {
        var toRemove = document.querySelectorAll('header, nav.content-nav, .content-nav, .content-logo, .content-links, .merchant-download, .content-merchant-website, footer');
        for (var i = 0; i < toRemove.length; i++) {
          toRemove[i].style.setProperty('display', 'none', 'important');
        }
        var titles = document.querySelectorAll('${titleElement}');
        for (var j = 0; j < titles.length; j++) {
          titles[j].style.setProperty('display', 'none', 'important');
        }
      } catch(e) {}
    };

    var updateBrandLogo = function() {
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
    };

    applyStyles();
    cleanElements();
    updateBrandLogo();
    notifyLoaded();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        applyStyles();
        cleanElements();
        updateBrandLogo();
        notifyLoaded();
      });
    }

    window.addEventListener('load', function() {
      applyStyles();
      cleanElements();
      updateBrandLogo();
      notifyLoaded();
    });

    try {
      var observer = new MutationObserver(function() {
        applyStyles();
        cleanElements();
        updateBrandLogo();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    } catch(e) {}

    var removePassengerCpf = function() {
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
    };

    setTimeout(removePassengerCpf, 300);
    setTimeout(removePassengerCpf, 1000);
    removePassengerCpf();

    if(window.location.href.includes("motorista") || window.location.href.includes("driver")) {
      var originalFetch = window.fetch;
      if (originalFetch) {
        window.fetch = function() {
          var args = arguments;
          return originalFetch.apply(this, args)
            .then(function(response) {
              var url = args[0];
              if (typeof url === 'string' && 
                  (url.includes('register') || url.includes('Register') || url.includes('driver'))) {
                var clonedResponse = response.clone();
                clonedResponse.json().then(function(data) {
                  if (data && data.status === true) {
                    setTimeout(function() {
                      var bodyText = document.body.textContent || '';
                      var successTexts = [
                        'Conta criada com sucesso',
                        'Account created successfully',
                        'Compte créé avec succès',
                        'Cuenta creada con éxito'
                      ];
                      var hasSuccessMessage = successTexts.some(function(text) { return bodyText.includes(text); });
                      if (hasSuccessMessage && window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify("redirect-login-new-site"));
                      }
                    }, 2000);
                  }
                }).catch(function() {});
              }
              return response;
            });
        };
      }

      var originalXHR = window.XMLHttpRequest;
      if (originalXHR) {
        window.XMLHttpRequest = function() {
          var xhr = new originalXHR();
          var originalSend = xhr.send;
          xhr.send = function() {
            var args = arguments;
            xhr.addEventListener('readystatechange', function() {
              if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                  var response = JSON.parse(xhr.responseText);
                  var url = xhr.responseURL || '';
                  if ((url.includes('register') || url.includes('Register') || url.includes('driver')) && 
                      response && response.status === true) {
                    setTimeout(function() {
                      var bodyText = document.body.textContent || '';
                      var successTexts = [
                        'Conta criada com sucesso',
                        'Account created successfully',
                        'Compte créé avec succès',
                        'Cuenta creada con éxito'
                      ];
                      var hasSuccessMessage = successTexts.some(function(text) { return bodyText.includes(text); });
                      if (hasSuccessMessage && window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify("redirect-login-new-site"));
                      }
                    }, 2000);
                  }
                } catch (e) {}
              }
            });
            return originalSend.apply(this, args);
          };
          return xhr;
        };
      }
    }

    if(window.location.href.includes("cliente/preregister")){
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
