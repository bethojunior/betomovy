<div class="mobile">
    Não disponivel para versão mobile
</div>
<div class="web">
    <div id="accordion">
        <div class="card">
            <div class="card-header" id="headingOne">
                <h5 class="mb-0">
                    <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        <span class="span-accordion">Tipos de viagens</span>
                    </button>
                </h5>
            </div>

            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                <div class="card-body general-app">
                    <div class="row" id="mount-types"></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header" id="headingTwo">
                <h5 class="mb-0">
                    <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Informações sobre tipos de viagens
                    </button>
                </h5>
            </div>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                <div class="card-body">
                    <div class="col-lg-4 form-group">
                        <label for="input0title">Titulo</label>
                        <input class="form-control" id="input0title" placeholder="">
                    </div>
                    <div class="col-lg-4 form-group">
                        <label for="description-input">Descrição</label>
                        <input class="form-control" id="description-input" placeholder="">
                    </div>
                    <div class="center col-lg-2">
                        <button id="send-about-trips" class="btn">Salvar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div id="modal-edit" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="col-lg-12">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Nome tipo item</span>
                            </div>
                            <input id="new-name-type-item" type="text" class="form-control" aria-label="Exemplo do tamanho do input" aria-describedby="description-item">
                        </div>

                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="new-item-upload" aria-describedby="inputGroupFileAddon04">
                                <label class="custom-file-label" for="new-item-upload">Escolhe um arquivo</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="edit-type-icon">Finalizar edição</button>
                </div>
            </div>
        </div>
    </div>

</div>
