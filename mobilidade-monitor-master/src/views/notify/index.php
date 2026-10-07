<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary" data-toggle="modal" id="openNewNotifyModal">
            Nova notificação
        </button>
        <div class="table-responsive">
            <table class="table table-striped table-sm  mt-2">
                <thead>
                <tr>
                    <th>Assunto</th>
                    <th>Descrição</th>
                    <th>Link</th>
                    <th>Imagem</th>
                    <th>Destinatario</th>
                    <th>Cidade</th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="listNotification"></tbody>
            </table>
        </div>
        <nav>
            <ul class="pagination">
                <li class="page-item disabled prev-page">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item disabled next-page">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
<div class="modal fade" id="newNotifyModal" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nova notificação</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form >
                    <div class="form-group">
                        <label for="title">Assunto*</label>
                        <input type="text" class="form-control" id="title" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="message">Descrição*</label>
                        <textarea class="form-control" id="message" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="citiesNotifySelected">Cidade*</label>
                        <div class="position-relative">
                            <input type="text" class="form-control" id="citiesNotifySelected" placeholder="Digite para buscar uma cidade" autocomplete="off">
                            <div id="citiesDropdown" class="dropdown-menu w-100 cities-dropdown-scroll"></div>
                            <div id="citiesLoading" class="text-center p-2">
                                <small class="text-muted">Buscando...</small>
                            </div>
                        </div>
                        <input type="hidden" id="selectedCityId">
                    </div>
                    <div class="form-group">
                        <label for="link">Url</label>
                        <input type="url" class="form-control" id="link" placeholder="https://examplo.com"
                               autocomplete="off">
                    </div>
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="identifyUserInLink">
                        <label class="form-check-label" for="identifyUserInLink">Vincular usuário a Url</label>
                    </div>
                    <div class="form-group">
                        <label>Imagem</label>
                        <div>
                            <input type="file" id="imageNotify" accept="image/*">
                        </div>
                    </div>
                    <hr/>
                    <button type="button" class="btn btn-info" id="openUserTypeModal">
                        Destinatarios <span class="badge badge-light" id="countUserType">0</span>
                    </button>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="addNewNotify">Enviar</button>
            </div>
        </div>
    </div>
</div>
<div id="userTypesModal" class="modal fade" data-backdrop="static" data-keyboard="false" >
    <div class="modal-dialog  modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Tipos de destinatario</h5>
            </div>
            <div class="modal-body" id="listUserTypesNotify"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveTypeUser">Salvar</button>
            </div>
        </div>
    </div>
</div>