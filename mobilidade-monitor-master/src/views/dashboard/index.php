<main>
    <div class='list-row'>
        <div class='card'>
            <div class='card-header'>
                <h2>INDICADORES</h2>
            </div>
            <div class="tab">
                <button class="tablinks" onclick="changeCategoryDriver(event, 'taxis')">Taxis</button>
                <button class="tablinks" onclick="changeCategoryDriver(event, 'plus')">Plus</button>
                <button class="tablinks" onclick="changeCategoryDriver(event, 'media')">Estatísticas</button>
            </div>

            <div id="taxis" class="tabcontent" >
                <div class='block-flex'>
                    <span>TOTAL</span>
                    <span id='cabbies_quantity'></span>
                </div>
                <div class='block-flex'>
                    <span>Disponiveis</span>
                    <span id=''>--------</span>
                </div>
                <div class='block-flex'>
                    <span>Em viagem</span>
                    <span>--------</span>
                </div>
                <div class='block-flex'>
                    <span>Ativos</span>
                    <span id='cabbies_active'></span>
                </div>
                <div class='block-flex'>
                    <span>Pendentes</span>
                    <span id='outstanding_cabbies'></span>
                </div>
                <div class='block-flex'>
                    <span>Bloqueados</span>
                    <span id='blocked_cabbies'></span>
                </div>
                <div class='block-flex'>
                    <span>Esperando resposta</span>
                    <span id='cabbies_waiting_answer'></span>
                </div>
            </div>
            <div id="plus" class="tabcontent">
            <div class='block-flex'>
                    <span>TOTAL</span>
                    <span id='personal_drivers_quantity'></span>
                </div>
                <div class='block-flex'>
                    <span>Disponiveis</span>
                    <span>--------</span>
                </div>
                <div class='block-flex'>
                    <span>Em viagem</span>
                    <span>--------</span>
                </div>
                <div class='block-flex'>
                    <span>Ativos</span>
                    <span id='personal_drivers_active'></span>
                </div>
                <div class='block-flex'>
                    <span>Pendentes</span>
                    <span id='outstanding_personal_drivers'></span>
                </div>
                <div class='block-flex'>
                    <span>Bloqueados</span>
                    <span id='blocked_personal_drivers'></span>
                </div>
                <div class='block-flex'>
                    <span>Esperando resposta</span>
                    <span id='personal_drivers_waiting_answer'></span>
                </div>
            </div>

            <div id="media" class="tabcontent">
                <div class='block-flex'>
                    <span>Carros disponíveis</span>
                    <span id='available_drivers'></span>
                </div>
                <div class='block-flex'>
                    <span>Média de atendimento</span>
                    <span>--------</span>
                </div>
                <div class='block-flex'>
                    <span>Valor médio de viagem</span>
                    <span>--------</</span>
                </div>
                <div class='block-flex'>
                    <span></span>
                    <span><small><i>(ultimas 100 viagens)</i></small></span>
                </div>
            </div>
                <!-- <div class='block-flex'>
                    <span>Taxistas</span>
                    <span id='cabbies_quantity'></span>
                </div>
                <div class="block-flex">
                    <span>Taxista & Plus  disponíveis</span>
                    <span id='available_drivers'></span>
                </div>
                <div class="block-flex">
                    <span>motoristas em viagem</span>
                    <span id='drivers_in_trip'></span>
                </div>
                <div class="block-flex">
                    <span>motorista indisponíveis</span>
                    <span id='unavailable_drivers'></span>
                </div>
                <div class="block-flex">
                    <span>motorista ativos</span>
                    <span id='customers_active'></span>
                </div>
                <div class="block-flex">
                    <span>Taxista pendentes</span>
                    <span id="outstanding_cabbies"></span>
                </div>
                <div class="block-flex">
                    <span>Taxista bloqueados</span>
                    <span id="blocked_cabbies"></span>
                </div>
                <div class="block-flex">
                    <span>Taxista esperando resposta</span>
                    <span id="cabbies_waiting_answer"></span>
                </div> -->
        </div>
        <div class='card'>
            <div class='card-header'>
                <h2>Corridas</h2>
            </div>
            <div class='card-body'>
                <div class='chart'>
                    <canvas id="myChart" width="800" height="450"></canvas>
                </div>
            </div>
        </div>
        <div class='card'>
            <div class='card-header'>
                <h2>Canceladas</h2>
            </div>
            <div class='card-body'>
                <div class='chart'>
                <canvas id="bar-chart" width="800" height="450"></canvas>

                </div>
            </div>
        </div>

        <div class='card'>
            <div class='card-header'>
                <h2>Viagens</h2>
            </div>
            <div class='card-body'>
                <div class='chart'>
                    <canvas id="bar-chart-viagens" width="800" height="450"></canvas>
                </div>
            </div>
        </div>
        <div class='card'>
            <div class='card-header'>
                <h2>TOP MOTORISTA</h2>
            </div>
            <div class="tab">
                <button class="tablinks" onclick="changeTime(event, 'day')">Dia</button>
                <button class="tablinks" onclick="changeTime(event, 'week')">Semana</button>
                <button class="tablinks" onclick="changeTime(event, 'month')">Mês</button>
            </div>

            <div id="day" class="tabcontent" >

            </div>

            <div id="week" class="tabcontent">

            </div>

            <div id="month" class="tabcontent">

            </div>

        </div>
        <div class='card' style='display: flex;   justify-content: center;
  align-items: center;'>
            <h2>EM BREVE!</h2>
        </div>
    </div>
</main>

<div id="modal-notification-panic" class="modal" tabindex="-1" role="dialog" style=" background: rgba(255, 0, 0,0.5)">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Botão de pânico acionado</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="mount-notifications">
                <div class="row col-lg-12">
                    <div style="margin-top: 1vw" class="col-lg-12">
                        <div class="col-lg-12">
                            <div id="what-do"></div>
                            <span class="col-lg-12 center" id="message-panic"></span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
<!--                    <button id="find-trip" name="" type="button" class="btn btn-info" data-dismiss="modal">Abrir no mapa</button>-->
                    <button style="display: none" id="open-trip" trip="" type="button" class="btn btn-info" data-dismiss="modal">Abrir viagem</button>
                    <button id="panic-read" type="button" class="btn btn-info" data-dismiss="modal">Marcar como lido</button>
                </div>
            </div>
        </div>
    </div>
</div>
