/**
 * Abre o modal de avaliação de locais após finalização da corrida
 * Permite que motoristas avaliem pontos de embarque e desembarque independentemente
 * para os critérios de Precisão do Mapa e Segurança
 * 
 * @param {Object} trip - Objeto da corrida contendo origem, destino e pontos intermediários
 */
function openEvaluateLocation(trip) {
    if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) return;

    const places = buildPlacesArray(trip);
    const { showRiskAreaInCall } = Session.get("cityConfig");

    viewController.elementProperty.getElement("#listPlacesEvaluate", element => {
        element.innerHTML = generatePlacesHTML(places, showRiskAreaInCall);
        attachEvaluationListeners();
    });
}

(function() {
    /**
     * Constrói array de locais (origem, pontos intermediários, destino) para avaliação
     * 
     * @param {Object} trip - Objeto da corrida
     * @returns {Array} Array de objetos de locais com tipo, endereço e coordenadas
     */
    window.buildPlacesArray = function(trip) {
        const places = [];

        // Adiciona origem
        places.push({
            type: "Embarque",
            address: trip.origin.address,
            latitude: trip.origin.latitude,
            longitude: trip.origin.longitude
        });

        // Adiciona pontos intermediários (paradas)
        if (trip.tripWayPoints && trip.tripWayPoints.length > 0) {
            places.push(...trip.tripWayPoints.map(place => ({
                type: "Desembarque",
                address: place.address,
                latitude: place.latitude,
                longitude: place.longitude
            })));
        }

        // Adiciona destino final
        places.push({
            type: "Desembarque",
            address: trip.destination.name,
            latitude: trip.destination.latitude,
            longitude: trip.destination.longitude
        });

        return places;
    };

    /**
     * Gera HTML para a lista de avaliação de locais
     * 
     * @param {Array} places - Array de objetos de locais
     * @param {Boolean} showRiskAreaInCall - Se deve mostrar avaliação de segurança
     * @returns {String} String HTML
     */
    window.generatePlacesHTML = function(places, showRiskAreaInCall) {
        return places.map((place, index) => {
            // Escapa JSON para atributo HTML (previne XSS)
            const placeDataEscaped = escapeHtml(JSON.stringify(place));
            
            return `
                <li>
                    <b>${escapeHtml(place.type)}</b>
                    <p>${escapeHtml(place.address)}</p>
                    <div>
                        <div>
                            <span>Mapa</span>
                            <div>
                                <span class="material-icons select-type-evaluation active" 
                                    data-group="mapa" 
                                    data-index="${index}"
                                    data-type="positive"
                                    aria-label="Avaliação positiva do mapa"
                                    role="button"
                                    tabindex="0">thumb_up_alt</span>
                                <span class="material-icons select-type-evaluation blacklist-address-selected" 
                                    data-group="mapa" 
                                    data-index="${index}"
                                    data-type="negative"
                                    label='${placeDataEscaped}'
                                    aria-label="Avaliação negativa do mapa"
                                    role="button"
                                    tabindex="0">thumb_down_alt</span>
                            </div>
                        </div>
                        ${showRiskAreaInCall ? `
                        <div>
                            <span>Seguro</span>
                            <div>
                                <span class="material-icons select-type-evaluation active" 
                                    data-group="seguro" 
                                    data-index="${index}"
                                    data-type="positive"
                                    aria-label="Avaliação positiva de segurança"
                                    role="button"
                                    tabindex="0">thumb_up_alt</span>
                                <span class="material-icons select-type-evaluation risk-area-address-selected" 
                                    data-group="seguro" 
                                    data-index="${index}"
                                    data-type="negative"
                                    label='${placeDataEscaped}'
                                    aria-label="Avaliação negativa de segurança"
                                    role="button"
                                    tabindex="0">thumb_down_alt</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </li>`;
        }).join("");
    };

    /**
     * Adiciona listeners de clique nos botões de avaliação
     * Garante que avaliações de Mapa e Segurança sejam independentes para cada local
     */
    window.attachEvaluationListeners = function() {
        viewController.elementProperty.addEventInElement(".select-type-evaluation", 'onclick', function (event) {
            const element = event.currentTarget || this;
            const index = element.getAttribute("data-index");
            const group = element.getAttribute("data-group");

            if (!index || !group) {
                console.warn("Elemento de avaliação sem atributos data obrigatórios");
                return;
            }

            // Remove classe active apenas dos botões do mesmo grupo e índice
            const selector = `.select-type-evaluation[data-group="${group}"][data-index="${index}"]`;
            document.querySelectorAll(selector).forEach(el => {
                el.classList.remove("active");
            });

            element.classList.add("active");
        });

        // Adiciona suporte para navegação por teclado (Enter/Espaço)
        viewController.elementProperty.addEventInElement(".select-type-evaluation", 'onkeydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    };

    /**
     * Escapa caracteres especiais HTML para prevenir XSS
     * Trata valores null e undefined retornando string vazia
     * 
     * @param {String} text - Texto a ser escapado
     * @returns {String} Texto escapado ou string vazia
     */
    window.escapeHtml = function(text) {
        const safeText = text ?? '';
        const div = document.createElement('div');
        
        div.textContent = safeText;
        return div.innerHTML;
    };
})();
