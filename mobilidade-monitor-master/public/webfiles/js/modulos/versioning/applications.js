function loadApplicationVersion(jsonPath, targetElementId) {
    fetch(jsonPath)
        .then(result => {
            const contentType = result.headers.get("content-type");
            if (result.status !== 200) {
                console.error("Erro ao buscar o arquivo JSON.");
                return null;
            }
            return contentType.includes("application/json") ? result.json() : null;
        })
        .then(data => {
            if (data) {
                const targetElement = document.querySelector(`#${targetElementId}`);
                const collapseId = `${targetElementId}-collapse`;
                const itemsHTML = data.items.length > 0
                    ? data.items.map(item => `
                        <li class="list-group-item" style="background-color: #F8F8F8">
                            <i class="fa fa-check"></i> ${item.description}
                        </li>
                    `).join('')
                    : '<li class="list-group-item">Não há itens de atualização</li>';

                targetElement.innerHTML = `
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-baseline">
                            <h5>${data.title}</h5>
                            <div class="d-flex justify-content-between align-items-baseline">
                                <p class="card-text text-center mt-2"><b>Versão: </b>${data.version}</p>
                                <p class="card-text text-center ml-5"><b>Data de Atualização: </b>${data.updateDate}</p>  
                            </div>
                        </div>
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${collapseId}" style="text-decoration: none">
                            <i class="fa fa-plus-circle"></i> Ver detalhes
                        </button>
                        <div id="${collapseId}" class="collapse">
                            <h6 class="card-text text-center mt-2">Descrição da atualização:</h6>
                            <ul class="list-group list-group-flush">
                                ${itemsHTML}
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                console.log("Não foi possível ler o arquivo JSON.");
            }
        })
        .catch(error => {
            console.error("Erro na solicitação:", error);
        });
}

// Uso:
loadApplicationVersion('/json/appsVersions/client-app-cordova.json', 'clientAppCordova');
loadApplicationVersion('/json/appsVersions/driver-app-cordova.json', 'driverAppCordova');
loadApplicationVersion('/json/appsVersions/mobilidade-api-php.json', 'mobilityAppApi');
loadApplicationVersion('/json/appsVersions/monitor-front.json', 'monitorFront');
loadApplicationVersion('/json/appsVersions/monitor-api-v2.json', 'monitorApiV2');
loadApplicationVersion('/json/appsVersions/site.json', 'site');
loadApplicationVersion('/json/appsVersions/central-api.json', 'centralVersionApi');
loadApplicationVersion('/json/appsVersions/central-front.json', 'centralVersionFront');
