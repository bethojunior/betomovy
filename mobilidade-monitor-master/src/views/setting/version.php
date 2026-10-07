<div class="row">
    <div class="row col-lg-12 col-sm-12">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col">App</th>
                    <th scope="col">Plataforma</th>
                    <th scope="col">Versão</th>
                    <th scope="col">Link</th>
                    <th scope="col">Data</th>
                    <th scope="col"><button class="btn btn-outline-primary add-new-version"><i class="material-icons">add</i></button></th>
                </tr>
                </thead>
                <tbody id="mount-versions">
                </tbody>
            </table>
        </div>
    </div>

    <div class="col-lg-12 read-more">
        <a page="1" class="next-page center">Ver mais</a>
    </div>
</div>


<div class="modal fade" id="modal-add-new-version" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Adcionar nova versão</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                <div class="form-group">
                    <span>Escolha o app</span>
                    <select class="custom-select custom-select-lg mb-3" id="mount-apps">

                    </select>
                </div>

                <div class="form-group">
                    <span>Plataforma</span>
                    <select class="custom-select custom-select-lg mb-3" id="platform">
                        <option value="android">Android</option>
                        <option value="ios">Ios</option>
                    </select>
                </div>

                <div class="form-group">
                    <span>Link do app na loja</span>
                    <input value="" class="form-control" type="text" id="link">
                </div>

                <div class="form-group">
                    <span>Versão</span>
                    <input value="" class="form-control" type="text" id="version">
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary insert-new-version">Salvar</button>
            </div>
        </div>
    </div>
</div>
