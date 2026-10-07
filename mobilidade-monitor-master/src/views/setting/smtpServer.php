<div class="container-default-monitor">

    <div class="container" style="max-width:1175px">
        <div class="row d-flex justify-content-end">
            <button id="btn-list-smtp" class="btn btn-primary mr-2 mb-2">Listar SMTP<i class="material-icons close-modal-option-trip">list</i></button>
            <button id="btn-create-smtp" class="btn btn-primary mr-2 mb-2">Cadastrar Novo SMTP<i class="material-icons close-modal-option-trip">add</i></button>
        </div>
     <div class="table-responsive">
            <table class="table table-striped" id="headerSmtpTable" hidden>
                <thead class="table-dark">
                <tr>
                    <th scope="row">Nome do serviço</th>
                    <th scope="row">Email do remetente</th>
                    <th scope="row">Nome do remetente</th>
                    <th scope="row">Host</th>
                    <th scope="row">Porta</th>
                    <th scope="row">Usuário</th>
                    <th scope="row">Criptografia</th>
                    <th scope="row">Padrão</th>
                    <th scope="row">Opções</th>
                </tr>
                </thead>
                <tbody id="tableSmtpServer"></tbody>
            </table>
     </div>
    <div class="row">
        <div class="col-3"></div>
        <form class="col-12 col-md-6" id="formSMTPServer" method="POST" hidden>
            <div class="p-2">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="smtpOptions" id="inlineRadio1" value="1" checked>
                    <label class="form-check-label" for="inlineRadio1">Usar o serviço de E-mail padrão</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="smtpOptions" id="inlineRadio2" value="2">
                    <label class="form-check-label" for="inlineRadio2">Usar serviço de E-mail personalizado
                        (SMTP)</label>
                </div>
            </div>
            <div class="mt-3 col-12 col-md-12" hidden id="contentSMTPServer">
                <div class="form-group">
                    <label for="nameService">Nome do serviço</label>
                    <input type="text" class="form-control input-required" id="nameService">
                </div>
                <div class="form-group">
                    <label for="fromMail">Email do remetente</label>
                    <input type="email" class="form-control input-required" id="fromMail">
                </div>
                <div class="form-group">
                    <label for="fromName">Nome do remetente</label>
                    <input type="text" class="form-control input-required" id="fromName">
                </div>
                <div class="form-group">
                    <label for="hostname">Host</label>
                    <input type="text" class="form-control input-required" id="hostname">
                </div>
                <div class="form-group">
                    <label for="port">Porta</label>
                    <input type="text" class="form-control input-required" id="port" required>
                </div>
                <div class="form-group">
                    <label for="username">Usuário</label>
                    <input type="text" class="form-control" id="username">
                </div>
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" class="form-control" id="password">
                    <div class="form-check mt-1">
                        <input class="form-check-input" type="checkbox" id="showPassword">
                        <label class="form-check-label" for="showPassword">
                            Mostrar senha
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="encryption">Criptografia</label>
                    <select class="form-control" id="encryption">
                        <option value="">Nenhuma</option>
                        <option value="ssl">SSL</option>
                        <option value="tls">TLS</option>
                    </select>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <button type="submit" id="btn-save-smtp" class="btn btn-success ml-2">Salvar</button>
                </div>
                <div class="col-12">
                    <button type="button" id="btn-update-smtp" class="btn btn-success ml-2">Atualizar</button>
                </div>
            </div>
        </form>
        <div class="col-3"></div>
    </div>
</div>
<div class="modal" id="myModal">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Teste de e-mail</h3>
        <button type="button" class="close-smtp" data-dismiss="modal" aria-label="Fechar">&times;</button>
      </div>
      <div class="modal-body">
        <input type="email" id="emailInput" class="form-control" placeholder="Digite o seu e-mail">
      </div>
      <div class="modal-footer">
        <button id="sendButton" class="btn btn-primary">Enviar</button>
      </div>
    </div>
  </div>
</div>