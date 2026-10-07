export const injectDynamic = (titleElement: string) => {
  return `
  let first = true
  let interval = setInterval(function() {
    if(first) {
      const title = document.querySelector('${titleElement}');
      const storeContainer = document.querySelector('.content-merchant-website') 
      if (title) {
        title.style.display = "none";
      }
      if (storeContainer) {
        storeContainer.style.display = "none";
      }
      if(title && storeContainer) {
        clearInterval(interval)
        first = false
      } else {
        interval
      }
    }
    }, 200);
    interval
    
  true;

  if(window.location.href.includes("motorista") || window.location.href.includes("driver")) {
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      return originalFetch.apply(this, args)
        .then(response => {
          const url = args[0];
          
          if (typeof url === 'string' && 
              (url.includes('register') || url.includes('Register') || url.includes('driver'))) {
            
            const clonedResponse = response.clone();
            clonedResponse.json().then(data => {
              
              if (data && data.status === true) {
                
                setTimeout(() => {
                  const bodyText = document.body.textContent || '';
                  const successTexts = [
                    'Conta criada com sucesso',
                    'Account created successfully',
                    'Compte créé avec succès',
                    'Cuenta creada con éxito'
                  ];
                  
                  const hasSuccessMessage = successTexts.some(text => bodyText.includes(text));
                  
                  if (hasSuccessMessage && window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify("redirect-login-new-site"));
                  }
                }, 2000);
              }
            }).catch(err => {
              
            });
          }
          
          return response;
        });
    };
    
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalSend = xhr.send;
      
      xhr.send = function(...args) {
        
        xhr.addEventListener('readystatechange', function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              const url = xhr.responseURL || '';
              
              if ((url.includes('register') || url.includes('Register') || url.includes('driver')) && 
                  response && response.status === true) {
                
                setTimeout(() => {
                  const bodyText = document.body.textContent || '';
                  const successTexts = [
                    'Conta criada com sucesso',
                    'Account created successfully',
                    'Compte créé avec succès',
                    'Cuenta creada con éxito'
                  ];
                  
                  const hasSuccessMessage = successTexts.some(text => bodyText.includes(text));
                  
                  if (hasSuccessMessage && window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify("redirect-login-new-site"));
                  }
                }, 2000);
              }
            } catch (e) {
              
            }
          }
        });
        
        return originalSend.apply(this, args);
      };
      
      return xhr;
    };
  }

  if(window.location.href.includes("cliente/preregister")){

    const contentModal = document.querySelector(".contentModal");
    const originalContent = contentModal.innerHTML;
    contentModal.innerHTML = '';

    const containerModal = document.querySelector("#chooseApp");

    const buttonRedirectLogin = document.createElement("button");
    buttonRedirectLogin.setAttribute("class", "btnAndroid");
    buttonRedirectLogin.textContent = "Fazer Login";

    contentModal.appendChild(buttonRedirectLogin);

    buttonRedirectLogin.addEventListener("click", () => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify("redirect-login"));
        containerModal.setAttribute("class", "modal");
        contentModal.innerHTML = originalContent;
      }
    });
  }
  `;
};
