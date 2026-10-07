<div class="container-main">
    <div class="df-page">

        <!-- ── Cabeçalho ── -->
        <div class="df-header">
            <h1 class="df-title">Campos dinâmicos</h1>
            <button type="button" class="df-btn-add"
                    data-toggle="modal" data-target="#modalAddFields">
                + Adicionar campo
            </button>
        </div>

        <!-- ── Tabela ── -->
        <div class="df-table-wrap">
            <table class="df-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Título</th>
                        <th>Tipo de resposta</th>
                        <th colspan="2"></th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <!-- ── Modal: Adicionar campo ── -->
        <div class="modal fade" id="modalAddFields" role="dialog"
             aria-labelledby="modalAddTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content app-modal">

                    <div class="modal-header app-modal__header">
                        <h5 class="modal-title app-modal__title" id="modalAddTitle">Novo campo</h5>
                        <button type="button" class="close app-modal__close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body app-modal__body">
                        <div class="app-field">
                            <label class="app-label" for="title-fields">Título da pergunta</label>
                            <input class="app-input form-control" id="title-fields" placeholder="Ex.: Observações para o motorista">
                        </div>
                        <div class="app-field">
                            <label class="app-label" for="required-fields">Tipo de resposta</label>
                            <select class="app-input app-select custom-select" id="required-fields">
                                <option value="0">Opcional</option>
                                <option value="1">Obrigatória</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer app-modal__footer">
                        <button type="button" class="app-btn app-btn--cancel" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="app-btn app-btn--confirm" id="addFields">Adicionar</button>
                    </div>

                </div>
            </div>
        </div>

        <!-- ── Modal: Editar campo ── -->
        <div class="modal fade" id="modalFieldEdit" role="dialog"
             aria-labelledby="modalEditTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content app-modal">

                    <div class="modal-header app-modal__header">
                        <h5 class="modal-title app-modal__title" id="modalEditTitle">Editar campo</h5>
                        <button type="button" class="close app-modal__close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body app-modal__body">
                        <div class="app-field">
                            <label class="app-label" for="title-field-edit">Título da pergunta</label>
                            <input class="app-input form-control" id="title-field-edit">
                        </div>
                        <div class="app-field">
                            <label class="app-label" for="required-field-edit">Tipo de resposta</label>
                            <select class="app-input app-select custom-select" id="required-field-edit">
                                <option value="0">Opcional</option>
                                <option value="1">Obrigatória</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer app-modal__footer">
                        <button type="button" class="app-btn app-btn--cancel" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="app-btn app-btn--confirm" id="editFields">Salvar alterações</button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>
