<div class="modal fade" id="schedule-driver-pool-modal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content drivers-modal">

      <div class="drivers-modal__header">
        <div class="drivers-modal__title">
          <i class="material-icons mi-lg">group</i>
          Restringir a motoristas
        </div>
        <button type="button" class="drivers-modal__close" data-dismiss="modal" aria-label="Fechar">
          <i class="material-icons">close</i>
        </button>
      </div>

      <div class="drivers-modal__body">

        <div class="drivers-modal__filter">
          <button type="button" class="drivers-filter-toggle-btn active" data-filter="">Todos</button>
          <button type="button" class="drivers-filter-toggle-btn" data-filter="disponivel">Online</button>
          <button type="button" class="drivers-filter-toggle-btn" data-filter="corrida">Ocupado</button>
          <button type="button" class="drivers-filter-toggle-btn" data-filter="desligado">Offline</button>
        </div>

        <div class="scroll-modal" id="scheduleDriverPoolList"></div>
        <div class="d-flex mt-2 mb-2 justify-content-center show-more" id="scheduleDriverPoolShowMore"></div>

      </div>

      <div class="drivers-modal__footer">
        <span class="drivers-modal__count" id="scheduleDriverPoolCount">0 motoristas selecionados</span>
        <button type="button" id="confirmScheduleDriverPool" class="btn-action" data-dismiss="modal">Confirmar</button>
      </div>

    </div>
  </div>
</div>
