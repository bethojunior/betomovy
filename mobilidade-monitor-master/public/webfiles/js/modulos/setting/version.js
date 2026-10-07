preload(true);
let page = 1;
let nextPage = page + 1;
let lastPage;
init(page);

elementProperty.addEventInElement('.add-new-version','onclick',function () {
    SettingsController.getApps().then(({status,response: data}) => {
        if(!status){
            return swal('Erro ao buscar apps');
        }
        elementProperty.getElement('#mount-apps',these => {
            let content = '';
            content += data.map(item => {
                return `
                    <option value="${item.idApp}">${item.name}</option>
                `;
            }).join('');
            these.innerHTML = content;
        });
    });
    $('#modal-add-new-version').modal('show');
});

elementProperty.addEventInElement('.insert-new-version','onclick',async function () {
    let data = {};
    data.version  = document.getElementById('version').value;
    data.platform = document.getElementById('platform').value;
    data.link     = document.getElementById('link').value;
    data.appId    = document.getElementById('mount-apps').value;

    if(!data.link || !data.version)
        return swal('Preencha todos os campos');

    preload(true);

    const validLink = await verifyLink(data.link)

    if(!validLink) {
        preload(false);
        return swal('O link não é válido!');
    }

    SettingsController.insertVersion(data).then(({status,response,message}) => {
        if(!status) return swal(message);

        preload(false);
        $('#modal-add-new-version').modal('hide');
        swal(';)',message,'success');
        return init(page);
    });

});
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);

        if (!urlObj.protocol.startsWith('http') || urlObj.hostname === '' || /^\/[^a-zA-Z\d]/.test(urlObj.pathname)) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

async function verifyLink(link) {
    if (!isValidUrl(link)) {
        return false;
    }
    
    try {
        await fetch(link, { method: 'HEAD', mode: 'no-cors' });
        return true
    } catch (error) {
        console.error(`Ping falhou para ${link}:`, error);
        return false
    }
}

function init(page , clear = false) {
    elementProperty.getElement('#mount-versions',these => {
        if(clear){
            these.innerHTML = ' ';
        }
        SettingsController.getVersion(page).then(({status, response: data, message}) => {

            if(!status)
                return swal('COMO SEMPRE, EM TUDO HÁ ERROS', message, 'error')

            elementProperty.getElement('.next-page',these => {
                these.setAttribute('page',page);
            });

            currentPage = data.current_page;
            lastPage    = data.last_page;
            nextPage    = data.nextPage;
            let content = '';

            content += data.data.map(item => {
                return `
                    <tr class=""> 
                        <th scope="row">${item.appName}</th>
                        <td>${item.platform}</td>
                        <td>${item.version}</td>
                        <td>${item.link}</td>
                        <td>${Mask.setDateCrazy(item.created_at)}</td>
                        <td>
                            <div class="custom-control custom-switch">
                              <input ${veriryStatus(item.statusId)} type="checkbox" class="custom-control-input change-status-version ${item.statusId}" id="${item.id}">
                              <label class="custom-control-label" for="${item.id}"></label>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            these.innerHTML = content;

            function veriryStatus(status){
                if(status === 1)
                    return 'checked'
                return ''
            }

            elementProperty.addEventInElement('.change-status-version','onclick',function (event) {
                event.preventDefault();
                SwalCustom.confirm('Voce deseja mudar o status dessa versão?','').then(status =>{
                    if(!status)
                        return false;

                    const active = !event.target.checked;
                    this.checked = active;

                    SettingsController.deleteAndActiveVersionApp(this.getAttribute('id'),active).then(response => {
                        if(response.status){
                            init(1,true);
                            return  swal('',response.message,'success');
                        }
                        return swal('ops',response.message,'error')
                    });
                })
            });
            preload(false);
        });
    });
}


elementProperty.addEventInElement('.next-page','onclick',function () {
    let page = parseInt(this.getAttribute('page'));
    page = page + 1;
    preload(true);
    init(page);
});

