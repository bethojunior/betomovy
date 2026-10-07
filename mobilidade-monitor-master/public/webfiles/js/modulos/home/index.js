document.addEventListener("DOMContentLoaded", function () {
    let data_user = Session.get('user');
    init();

    if(Session.getLocal('init_push') === undefined)
        Session.setLocal('init_push','0');


    function init(){
        preload(true);
        let verifyPush = Session.getLocal('init_push');
        if(verifyPush == 0){
            Session.setLocal('init_push','1');
            sendPush('Seja bem vindo, '+ data_user.name);
        }
    }

    const elementProperty = new ElementProperty();
    const monitorController = new MonitorController();
    CityController.getActives().then(({status, data}) => {
        if (!status)
            return;

        Session.setLocal64("cities", data.map((city) => {
            return {
                cityId: city.cityId,
                nome: city.nome,
                shortName: city.shortName,
                polygon: city.polygon,
            }
        }));

        if (Array.isArray(Session.getLocal("citySelected"))) {
            const city = data[0];
            Session.setLocal("citySelected", city);
            Session.setLocal("pointsCity", getPathByPolygon(city.polygon));
        }
        
        CityController.getConfigs().then((result) => {
            Session.setLocal64('keysConfig', result.response);
            const userProfile = Session.get("nameRole");
            const manager = result.response.find(el => el.type === 'GESTOR');
            const publicityKey = manager.config.find(el => el.key === "enable_publicity");
            if(publicityKey.value === '2' || publicityKey.value === '1' && userProfile === 'Admin'){
                return showPublicity();
            }
        });

        showDataDashboard();
        preload(false);
    });

    function showPublicity() {
        MonitorController.publicities().then(response=>{
            const publicities = response.data.data;

            if(publicities.length === 0)
                return;

            document.querySelector("#listPublicity").innerHTML = publicities.map((item, index)=>{
                let active = index === 0 ? 'active' : '';

                return `<div class="carousel-item ${active}">
                                    <div class="carousel-container">
                                        <div class="details-container">
                                            <img src="${item.banner}" class="d-block w-10"
                                                 alt="minha foto"/>
                                            <h5>${item.title}</h5>
                                            <div class="details-of-contact">
                                                <p>Data: ${new Date(item.created_at).toLocaleString()}</p>
                                                <p>Mais informações:</p>
                                                <p>Site: <a href="${item.link}" target="_blank">${item.link}</a></p>
                                                <p>Whatsapp/Telefone: ${item.phone_number}</p>
                                            </div>
                                        </div>
                                        <div class="text-container">
                                            <p class="text-justify">${item.description}</p>
                                            <hr/>
                                            <p class="video-container">Vídeos relacionados:</p>
                                                <ul class="row" style="list-style: none;padding: 0">
                                                    ${item.publicity_videos.map(video=>{
                    return `<li class="col-3">
                                                        <a href="${video.link}" target="_blank">   
                                                            <img width="200px" height="200px" class="img-thumbnail"
                                                                src="${video.image}" />
                                                        </a>
                                                    </li>`
                }).join("")}
                                                </ul>
                                        </div>
                                    </div>
                                </div>`;
            }).join("");

            $('#modal-promotional').modal('show');
        });
    }

    function showDataDashboard() {
        monitorController.currentQuantities().then(({status, response, errors, message}) => {
            if (!status) {
                SwalCustom.messageDialog(message, "Ops...ocorreu um error", undefined, "warning");
                return;
            }
            const filtered = Object.fromEntries(Object.entries(response).filter(([key]) => key != 'customers_polygon'));
            elementProperty.getElement('#panel-dashboard', panel => {
                let content = '';
                Object.keys(filtered).filter(id => {
                    content += response[id].map(item => {
                        if (item.type === null) {
                            return "<div class='without'><span>Sem dados para essa cidade</span></div>";
                        }
                        return `
                            <div>
                                <h4>${item.type}</h4>
                                <ul>
                                    <li>
                                        <div>
                                            <div class="d-flex flex-row dashboard-card">
                                                <p class="mb-1 dashboard-card-text" ><small>Total</small></p>
                                                <p class="mb-0 dashboard-card-icon">${item.type === 'CLIENTE FINAL' ? '<i id="total-value" class="material-icons" data-toggle="tooltip" >info</i>' : ''}</p>
                                            </div>    
                                            <span>${item.total}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <div class="d-flex flex-row dashboard-card">
                                                <p class="mb-1 dashboard-card-text" ><small>Ativo</small></p>
                                                <p class="mb-0 dashboard-card-icon">${item.type === 'CLIENTE FINAL' ? '<i id="active-value" class="material-icons" data-toggle="tooltip" >info</i>' : ''}</p>
                                            </div>
                                            <span>${item.active}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <div class="d-flex flex-row dashboard-card">
                                                <p class="mb-1 dashboard-card-text" ><small>Pendente</small></p>
                                                <p class="mb-0 dashboard-card-icon">${item.type === 'CLIENTE FINAL' ? '<i id="pending-value" class="material-icons" data-toggle="tooltip" >info</i>' : ''}</p>
                                            </div>
                                            <span>${item.pending}</span>
                                        </div>
                                    </li>
                                    ${item.waiting_answer ?
                            `<li>
                                        <div>
                                            <div class="d-flex flex-row dashboard-card">
                                                <p class="mb-1 dashboard-card-text" ><small>Aguardando Liberação</small></p>
                                            </div>
                                            <span>${item.waiting_answer}</span>
                                        </div>
                                    </li>` :
                            ""
                        }
                                    <li>
                                        <div>
                                            <div class="d-flex flex-row dashboard-card">
                                                <p class="mb-1 dashboard-card-text"><small>Bloqueado</small></p>
                                                <p class="mb-0 dashboard-card-icon">${item.type === 'CLIENTE FINAL' ? '<i id="blocked-value" class="material-icons" data-toggle="tooltip" >info</i>' : ''}</p>
                                            </div>
                                            <span>${item.blocked}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        `;
                    }).join('')
                });
                panel.innerHTML = content;
                preload(false);
            });
            response.customers_polygon.map((item) => {
                document.getElementById('total-value').setAttribute('title', `Quantidade de clientes contabilizados neste momento na cidade/área: ${item.total}`);
                document.getElementById('active-value').setAttribute('title', `Quantidade de clientes contabilizados neste momento na cidade/área: ${item.active}`);
                document.getElementById('pending-value').setAttribute('title', `Quantidade de clientes contabilizados neste momento na cidade/área: ${item.pending}`);
                document.getElementById('blocked-value').setAttribute('title', `Quantidade de clientes contabilizados neste momento na cidade/área: ${item.blocked}`);
            })
        });
    }

    function getPathByPolygon(stringPolygon) {
        stringPolygon = stringPolygon.replace("POLYGON((", "").replace("))", "");

        return stringPolygon.split(",").map((locationString) => {
            const location = locationString.split(" ");

            return {lat: parseFloat(location[0]), lng: parseFloat(location[1])};
        });
    }
});