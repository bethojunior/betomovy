<div class="modal fade" id="modalAddDriverInCentral" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content drivers-modal">

            <div class="drivers-modal__header">
                <div class="drivers-modal__title">
                    <i class="material-icons mi-lg">person_add</i>
                    Adicionar motorista na central
                </div>
                <button type="button" class="drivers-modal__close" data-dismiss="modal" aria-label="Fechar">
                    <i class="material-icons">close</i>
                </button>
            </div>

            <div class="drivers-modal__body">
                <div class="drivers-register__input-wrap">
                    <label class="drivers-register__label">
                        Código do motorista
                    </label>
                    <input
                        type="text"
                        class="drivers-register__input form-input-uppercase"
                        id="inputCodeDriver"
                        maxlength="8"
                        placeholder="Ex: AB12345C">
                    <small class="drivers-register__hint">Formato: XX00000P</small>
                </div>
            </div>

            <div class="drivers-modal__footer">
                <button type="button" class="btn-action btn-action--outline" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn-action" id="addDriverInCentral">Adicionar</button>
            </div>

        </div>
    </div>
</div>
