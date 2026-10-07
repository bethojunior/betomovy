<div class="modal fade" id="drivers-active-modal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content drivers-modal">

      <div class="drivers-modal__header">
        <div class="drivers-modal__title">
          <i class="material-icons mi-lg">directions_car</i>
          Motoristas ativos
        </div>
        <button type="button" class="drivers-modal__close" data-dismiss="modal" aria-label="Fechar">
          <i class="material-icons">close</i>
        </button>
      </div>

      <div class="drivers-modal__body">

        <!-- Cadastrar motorista -->
        <div class="drivers-register">
          <button type="button" class="drivers-register__toggle" data-toggle="collapse"
                  href="#collapseRegister" aria-expanded="false" aria-controls="collapseRegister">
            <i class="material-icons mi-md">add</i>
            Cadastrar motorista
            <i class="material-icons mi-md drivers-register__chevron">expand_more</i>
          </button>

          <div class="collapse" id="collapseRegister">
            <div class="drivers-register__form">
              <div class="drivers-register__input-row">
                <div class="drivers-register__input-wrap">
                  <input
                    type="text"
                    class="drivers-register__input form-input-uppercase"
                    id="inputCodeDriver"
                    maxlength="8"
                    placeholder="Ex: AB12345C">
                  <small class="drivers-register__hint">Formato: XX00000P</small>
                </div>
                <label class="drivers-register__favorite">
                  <input type="checkbox" id="favoriteCheckBox">
                  <i class="material-icons">star_border</i>
                  <span>Favoritar</span>
                </label>
              </div>
              <button type="button" id="addDriver" class="btn-action">Confirmar</button>
            </div>
          </div>
        </div>

        <!-- Filtro de listagem -->
        <div class="drivers-modal__filter">
          <button type="button" class="drivers-filter-toggle-btn active" data-filter="">Todos</button>
          <button type="button" class="drivers-filter-toggle-btn" data-filter="favorite">Favoritos</button>
          <button type="button" class="drivers-filter-toggle-btn" data-filter="disponivel">Online</button>
          <button type="button" class="drivers-filter-toggle-btn" data-filter="corrida">Ocupado</button>
          <button type="button" class="drivers-filter-toggle-btn" data-filter="desligado">Offline</button>
        </div>

        <!-- Lista de motoristas -->
        <div class="scroll-modal"></div>
        <div class="d-flex mt-2 mb-2 justify-content-center show-more"></div>

      </div>

      <div class="drivers-modal__footer">
        <button type="button" class="btn-action btn-action--outline" data-dismiss="modal">Cancelar</button>
        <button type="button" id="call-custom-trip" class="btn-action">Confirmar</button>
      </div>

    </div>
  </div>
</div>
