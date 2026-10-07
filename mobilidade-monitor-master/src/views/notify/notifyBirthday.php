<div class="monitor-default-nav mt-4" style="align-items: center">
    <div class="container" style="background-color: #fff; padding: 20px; border-radius: 10px">
        <button class="btn btn-primary mb-2" data-target="#modalCreateNewNotification" data-toggle="modal">Nova notificação</button>
       <div class="table-responsive">
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Tipo</th>
                <th>Título da notificação</th>
                <th>Mensagem</th>
                <th>Excluir</th>
            </tr>
            </thead>
            <tbody id="listNotifications"> </tbody>
        </table>
       </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modalCreateNewNotification">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Criar nova notificação de aniversário</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <label for="inputTitleBirthdayNotification" >Título da notificação</label>
                    <input id="inputTitleBirthdayNotification" class="form-control" />
                </div>
                <div>
                    <label class="mt-2" for="inputMessageBirthday" >Mensagem de aniversário</label>
                    <textarea id="inputMessageBirthday" class="form-control"></textarea>
                </div>

                <div class="mt-2">
                    <label for="selectTypeNotification">Tipo da mensagem</label>
                    <select id="selectTypeNotification" class="form-control">
                        <option value="1">Aniversário de nascimento</option>
                        <option value="2">Aniversário de cadastro</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button id="btnSaveNotify" type="button" class="btn btn-primary">Salvar</button>
            </div>
        </div>
    </div>
</div>