document.addEventListener("DOMContentLoaded", function () {
    const TYPE_MAP = 21;
    const TYPE_CREDENTIAL = 13;
    const elementProperty = new ElementProperty();
    const ALLOWED_CREDENTIAL_KEYS = new Set([
        "google_api_key",
        "google_api_key_backend",
        "firebase_cloud_firestore_key",
        "here_api_key",
        "mapbox_access_token",
        "google_service_account_json",
        "mapbox_access_token_monitor"
    ]);
    const BLOCKED_MAP_KEYS = new Set([
        "enable_address_cache_fb704",
        "url_address_cache_fb704",
        "keysearch_address_cache_fb704",
        "keyreadwrite_address_cache_fb704"
    ]);
    list()

    function hasPermission(nameGroup, namePermission) {
      const roles = JSON.parse(localStorage.getItem("@roles"));
  
      if (!roles) {
        return false;
      }
  
      let hasPermission = false;
  
      roles.groups.forEach((group) => {
        if (group.name !== nameGroup) {
          return;
        }
  
        group.permissions.forEach((permission) => {
          if (permission === namePermission) {
            hasPermission = true;
            return;
          }
        });
  
        if (hasPermission) {
          return;
        }
      });
  
      return hasPermission;
    }

  function normalizeKey(key) {
    return String(key || "").trim();
  }

  function removeBlockedKeys(items, blockedKeys) {
    return items.filter((item) => !blockedKeys.has(normalizeKey(item.key)));
  }

  function keepAllowedKeys(items, allowedKeys) {
    return items.filter((item) => allowedKeys.has(normalizeKey(item.key)));
  }

  function getItemsFromResult(result) {
    if (Array.isArray(result?.response)) {
      return result.response;
    }

    if (Array.isArray(result?.data?.response)) {
      return result.data.response;
    }

    return [];
  }

  function list() {
    preload(true);
    Promise.all([
      getConfigCredential(),
      getConfigMap()
    ]).then((values) => {
      const responseCredential = keepAllowedKeys(getItemsFromResult(values[0]), ALLOWED_CREDENTIAL_KEYS);
      const responseMap = removeBlockedKeys(getItemsFromResult(values[1]), BLOCKED_MAP_KEYS);
      document.getElementById('containerFormCredentialsMap').innerHTML = responseCredential.map((item, index) => {
          return `
                    <div class="card">
                        <div class="card-header" id="heading${index}">
                          <h2 class="mb-0">
                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseCredential${index}" 
                            aria-expanded="true" aria-controls="collapseOne">${item.description}
                            </button>
                            
                          </h2>
                        </div>
                    
                        <div id="collapseCredential${index}" class="collapse" aria-labelledby="heading${index}">
                          <div class="card-body">
                            <div class="col-lg-6">
                             <div class="form-group">
                                <input class="form-control" id="input-${item.key}" value="${item.value || ""}">
                              </div>
                              ${hasPermission("mapa", "editar_configuracoes_gerais") ? 
                                `<button id="${item.key}" type="button" class="btn btn-primary btn-save-setting" for="${item.key}">Salvar</button>` : ""
                              }
                            </div>
                          </div>
                        </div>
                    </div>
                   `;
            }).join("");

            document.getElementById('containerFormMapSetting').innerHTML = responseMap.map((item, index) => {
                return `
                <div class="card">
                    <div class="card-header" id="heading${item.key}">
                      <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}" 
                        key="${item.key}"
                        aria-expanded="true" aria-controls="collapseOne">${item.description}
                        </button>
                      </h2>
                    </div>
                
                    <div id="collapse${index}" class="collapse" aria-labelledby="heading${item.key}">
                      <div class="card-body">
                        <div class="col-lg-6">
                         <div class="form-group">
                            <input class="form-control" id="input-${item.key}" value="${item.value || ""}">
                          </div>
                          <button id="${item.key}" type="button" class="btn btn-primary btn-save-setting" for="${item.key}">Salvar</button>
                        </div>
                      </div>
                    </div>
                  </div>
               `
            }).join("");

            focusInComponent();
            elementProperty.addEventInElement('.btn-save-setting', 'onclick', function () {
                let key = this.getAttribute('id');
                let value = document.getElementById(`input-${key}`).value;
                let data = {};
                data[key] = value;

                if (data[key] === '' || data[key] === ' ') {
                    swal('Você precisa digitar um valor', '', 'info');
                    return;
                }

                SwalCustom.dialogConfirm('Você deseja alterar esse dado?', 'Certifique-se que está alterando o item certo!', callback => {
                    if (callback) {
                        MapSettingController.update(data).then(resolve => {
                            if (resolve.status) {
                                swal('Modificado com sucesso', '', 'success');
                                list();
                                return;
                            }
                            swal('ops', 'Erro ao modificar atributo', 'error')
                        });
                        return;
                    }
                });
            });
        }).catch(() => {
            swal('Ops', 'Erro ao carregar configurações de mapa', 'error');
        }).finally(() => {
            preload(false);
        });
    }

    function getConfigCredential() {
        return MapSettingController.getById(TYPE_CREDENTIAL);
    }

    function getConfigMap() {
        return MapSettingController.getById(TYPE_MAP);
    }

    function focusInComponent() {
        const link = location.href;
        if (link.includes("#")) {
            const id = link.split("#")[1];

            setTimeout(() => {
                const element = document.querySelector(`*[key='${id}']`);
                if (!element) {
                    return;
                }
                element.focus();
                $(`${element.getAttribute("data-target")}`).collapse('show');
            }, 500)
        }
    }
});
