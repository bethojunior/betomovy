<div id="spinner-preload-groups-wpp">
  <div class="spinner-simple"></div>
</div>

<div class="simple-card group-content-card active">

  <div class="card-header-simple" style="display:flex;align-items:center;justify-content:space-between;">
    <h4 style="margin:0">Configurações gerais</h4>
    <button id="btn-add-new-group-wpp" class="btn-add-new-group-wpp" title="Adicionar grupo">
      <i class="material-icons" style="font-size:18px;font-family:'Material Icons'">add</i>
    </button>
  </div>

  <div class="configs-form-body">

    <div class="config-section">
      <label class="config-label" for="list-groups-by-current-session-activies">
        <i class="material-icons config-label-icon">group</i>
        Grupo de notificação
      </label>
      <select class="group-select" id="list-groups-by-current-session-activies">
        <option id="option-dafault-list-groups-by-current-session-activies">Carregando opções…</option>
      </select>
    </div>

    <div class="config-section">
      <label class="config-label">
        <i class="material-icons config-label-icon">send</i>
        Envio automático para o Grupo
      </label>
      <div class="feature-toggle-card">
        <div class="feature-text">
          <span class="feature-subtitle">Habilita ou desabilita o envio automático para o Grupo selecionado</span>
        </div>
        <label class="modern-switch">
          <input type="checkbox" id="manage-group-notification">
          <span class="modern-slider"></span>
        </label>
      </div>
    </div>

    <div class="config-section">
      <label class="config-label">
        <i class="material-icons config-label-icon">directions_car</i>
        Envio automático para Motoristas
      </label>
      <div class="feature-toggle-card">
        <div class="feature-text">
          <span class="feature-subtitle">Habilita ou desabilita o envio automático para os Motoristas durante o chamado</span>
        </div>
        <label class="modern-switch">
          <input type="checkbox" id="manage-user-notification">
          <span class="modern-slider"></span>
        </label>
      </div>
    </div>

    <div class="config-section">
      <label class="config-label" for="message_send_to_group">
        <i class="material-icons config-label-icon">chat</i>
        Mensagem para o Grupo
      </label>
      <div class="feature-toggle-card">
        <input placeholder="Ex: Nova corrida disponível na central…" type="text" id="message_send_to_group">
        <button class="btn-wpp-action" id="button_message_send_to_group">Salvar</button>
      </div>
    </div>

    <div class="config-section">
      <label class="config-label" for="message_send_to_driver">
        <i class="material-icons config-label-icon">person</i>
        Mensagem para o Motorista
      </label>
      <div class="feature-toggle-card">
        <input placeholder="Ex: Você tem uma nova solicitação…" type="text" id="message_send_to_driver">
        <button class="btn-wpp-action" id="button_message_send_to_driver">Salvar</button>
      </div>
    </div>

  </div>

  <div class="modal fade" id="modal-new-group" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content wpp-modal">

        <div class="wpp-modal__header">
          <div class="wpp-modal__title">
            <i class="material-icons wpp-group-icon">group_add</i>
            Adicionar Grupo
          </div>
          <button type="button" class="wpp-modal__close" data-dismiss="modal" aria-label="Fechar">
            <i class="material-icons" style="font-size:20px;font-family:'Material Icons'">close</i>
          </button>
        </div>

        <div class="wpp-modal__body">
          <label class="config-label" style="margin-bottom:8px">
            <i class="material-icons config-label-icon">group</i>
            Grupos disponíveis
          </label>
          <select class="group-select" id="list-groups-by-current-session">
            <option>Selecione um grupo</option>
          </select>
        </div>

        <div class="wpp-modal__footer">
          <button type="button" class="btn-wpp-action btn-wpp-action--outline" data-dismiss="modal">Cancelar</button>
          <button type="button" class="btn-wpp-action" id="save-groups-selected">Salvar</button>
        </div>

      </div>
    </div>
  </div>
</div>
