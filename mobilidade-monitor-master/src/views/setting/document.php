<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-primary float-right mb-2" data-toggle="modal" data-target="#addDocumentModal">
            Adicionar Documento
        </button>
        <div class="table-responsive ">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Link</th>
                        <th scope="col">Foto</th>
                        <th scope="col">Texto</th>
                        <th scope="col">PDF</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="listDocuments"></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="addDocumentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form id="addDocument">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Documento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="nameDocument">Nome</label>
                            <input type="text" class="form-control" id="nameDocument" placeholder="" required>
                            <small id="emailHelp" class="form-text text-muted">Descrição de como irá aparecer no
                                aplicativo</small>
                        </div>
                        <div class="form-group">
                            <label for="linkDocument">Link</label>
                            <input type="url" class="form-control" id="linkDocument" placeholder="">
                            <small id="linkDocument" class="form-text text-muted">Link de suporte para facilitar na
                                solicitação
                                do documento</small>
                        </div>
                        <div class="form-group">
                            <label for="descriptionDocument">Descrição</label>
                            <textarea class="form-control" id="descriptionDocument" rows="3"></textarea>
                        </div>
                        <hr />
                        <div class="form-group">
                            <label for="descriptionPaymentForm">Solicitar no documento</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="imageCheck">
                                <label class="form-check-label" for="imageCheck">
                                    Foto
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="textCheck">
                                <label class="form-check-label" for="textCheck">
                                    Texto
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="pdfCheck">
                                <label class="form-check-label" for="pdfCheck">
                                    PDF
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Adicionar</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="modal fade" id="editDocumentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form id="editDocument">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Editar Documento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group" hidden>
                            <input type="text" class="form-control" id="idDocumentEdit" placeholder="" required>
                        </div>
                        <div class="form-group">
                            <label for="nameDocumentEdit">Nome</label>
                            <input type="text" class="form-control" id="nameDocumentEdit" aria-describedby="emailHelp"
                                placeholder="" required>
                            <small id="emailHelp" class="form-text text-muted">Descrição de como irá aparecer no
                                aplicativo</small>
                        </div>
                        <div class="form-group">
                            <label for="linkDocumentEdit">Link</label>
                            <input type="url" class="form-control" id="linkDocumentEdit" placeholder="">
                            <small id="linkDocument" class="form-text text-muted">Link de suporte para facilitar na
                                solicitação
                                do documento</small>
                        </div>
                        <div class="form-group">
                            <label for="descriptionDocumentEdit">Descrição</label>
                            <textarea class="form-control" id="descriptionDocumentEdit" rows="3"></textarea>
                        </div>
                        <hr />
                        <div class="form-group">
                            <label for="descriptionPaymentForm">Solicitar no documento</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="imageCheckEdit">
                                <label class="form-check-label" for="imageCheckEdit">
                                    Foto
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="textCheckEdit">
                                <label class="form-check-label" for="textCheckEdit">
                                    Texto
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="pdfCheckEdit">
                                <label class="form-check-label" for="pdfCheckEdit">
                                    PDF
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Atualizar</button>
                </div>
            </div>
        </form>
    </div>
</div>