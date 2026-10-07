<div class="accordion general-relatorio" id="accordionExample">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h2 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Gerar Boleto
        </button>
      </h2>
    </div>
    <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body">
        <div class="container-financial-driver center row col-lg-12">
          <select style="margin-top: 1vw" class="col-lg-4 custom-select" id="select-cities" aria-label=".form-select-lg example">
          </select>
          <div class="col-lg-4 form-group">
            <label for="validationDefaultUsername" class="form-label">Valor a partir</label>
            <div class="input-group">
              <span class="input-group-text" id="inputGroupPrepend2">R$</span>
              <input type="number" class="form-control" value="5" id="input-valor" aria-describedby="inputGroupPrepend2" required>
            </div>
          </div>
          <div class="col-lg-4 form-group">
            <span>&nbsp;</span>
            <input id="btn-do-filter" type="button" class="form-control btn btn-primary" value="Buscar">
          </div>
        </div>
        <div class="col-lg-12 center form-group row">
          <div class="col-lg-4 form-group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-clipboard-data" viewBox="0 0 16 16">
              <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z" />
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
            </svg>
            <span> Valor total</span>
            <div id="total">
            </div>
          </div>
          <div class="col-lg-4 form-group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-clipboard-data" viewBox="0 0 16 16">
              <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z" />
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
            </svg>
            <span> Motoristas</span>
            <div id="total-motoristas">
            </div>
          </div>
          <div class="col-lg-4 center">
            <button type="button" id="show-modal-btn-data" class="btn btn-primary">Gerar boleto</button>
          </div>
        </div>
        <div class="col-lg-12">
          <hr>
          <div class="col-lg-12">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Motorista</th>
                  <th scope="col">Taxa</th>
                </tr>
              </thead>
              <tbody id="mount-here-relatorio">
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- BUSCAR MOTORISTAS -->
<div class="accordion general-relatorio" id="buscarMotoristas">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h2 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseOne">
          Buscar Motoristas
        </button>
      </h2>
    </div>
    <div id="collapseFour" class="collapse" aria-labelledby="headingOne" data-parent="#buscarMotoristas">
      <div class="card-body">
        <div class="container-financial-driver center row col-lg-12">
          <div class="col-lg-4 form-group">
            <label for="inputCPF" class="form-label">CPF</label>
            <input type="text" class="form-control" id="inputCPF" aria-describedby="input-cpf">
            <div id="input-cpf" class="form-text">Informe o CPF sem dígitos e traços.</div>
          </div>
          <div class="col-lg-4 center">
            <input id="btn-buscar-motoristas" type="button" class="form-control btn btn-primary" value="Buscar">
          </div>
        </div>
        <div class="col-lg-12">
          <hr>
          <div class="col-lg-12">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Motorista</th>
                  <th scope="col">Valor a receber</th>
                </tr>
              </thead>
              <tbody id="mount-here-user">
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- GERENCIAR BLOQUEIO -->
<div class="accordion general-relatorio" id="gerenciarBloqueio">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h2 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseOne">
          Gerenciar Bloqueios
        </button>
      </h2>
    </div>
    <div id="collapseThree" class="collapse" aria-labelledby="headingOne" data-parent="#gerenciarBloqueio">
      <div class="card-body">
        <div class="container-financial-driver center row col-lg-12">
          <div class="col-lg-4 form-group">
            <input id="btn-verificarBoletos" type="button" class="form-control btn btn-primary" value="Verificar boletos">
          </div>
          <div class="col-lg-4 form-group">
            <input id="btn-bloquear" type="button" class="form-control btn btn-primary" disabled=true value="Bloquear">
          </div>
          <div class="col-lg-4 form-group">
            <input id="btn-desbloquear" type="button" class="form-control btn btn-primary" disabled=true value="Desbloquear">
          </div>
        </div>
        <div class="col-lg-12 center form-group row">
          <div class="col-lg-4 form-group">
            <span>Motoristas</span>
            <div id="total-motoristas-est">
            </div>
          </div>
          <div class="col-lg-4 form-group">
            <span>Vencidos</span>
            <div id="total-vencido-est">
            </div>
          </div>
          <div class="col-lg-4 form-group">
            <span>Em dia e bloqueado</span>
            <div id="total-unblock-est">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Modal progress send boleto -->
<div class="modal fade" id="modalProgress" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Enviando boletos</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">&nbsp;</button>
      </div>
      <div class="modal-body">
        <div class="progress" style="height: 20px;">
          <div class="progress-bar" id="progress-sendboleto-api" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Modal progress verify drivers-->
<div class="modal fade" id="modalDrivers" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Verificando motoristas</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">&nbsp;</button>
      </div>
      <div class="modal-body">
        <div class="progress" style="height: 20px;">
          <div class="progress-bar" id="progress-bar-verify" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Modal progress block drivers-->
<div class="modal fade" id="blockDrivers" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Bloqueando motoristas</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">&nbsp;</button>
      </div>
      <div class="modal-body">
        <div class="progress" style="height: 20px;">
          <div class="progress-bar" id="progress-bar-block" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Modal progress unblock drivers-->
<div class="modal fade" id="unblockDrivers" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Desbloqueando motoristas</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">&nbsp;</button>
      </div>
      <div class="modal-body">
        <div class="progress" style="height: 20px;">
          <div class="progress-bar" id="progress-bar-unblock" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
</div>
