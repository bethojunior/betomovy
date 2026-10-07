<div class="general-item">
    <div class="row">
        <div class="col-lg-5">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="description-item">Descrição</span>
                </div>
                <input id="value-description-item" type="text" class="form-control" aria-label="Exemplo do tamanho do input" aria-describedby="description-item">
            </div>
            <div class="input-group">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="fileUpload" aria-describedby="inputGroupFileAddon04">
                    <label class="custom-file-label" for="fileUpload">Escolhe um arquivo</label>
                </div>
            </div>
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
                Calcular cubagem
            </button>
            <br><br>
            <button id="send-item" class="col-lg-12 btn btn-primary">Salvar</button>
        </div>
        <div class="col-lg-7 row">
            <div class="col-lg-6">
                <img id="image-product" class="card-img" src="<?=Host::getLocal()?>webfiles/img/icon/default.png">
            </div>
            <div class="col-lg-4">
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Calculo de cubagem</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <img src="/webfiles/img/icon/image.png">
                <div class="col-lg-12 row">
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input type="number"  id="height" placeholder="Altura" class="form-control" aria-describedby="description-item">
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input type="number"  id="width" class="form-control" placeholder="largura" aria-describedby="description-item">
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input  type="number" id="depth" class="form-control" placeholder="Profundidade" aria-describedby="description-item">
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-12">
                        <div class="input-group">
                            <input  type="number" id="weight" placeholder="Peso" class="form-control" aria-label="Exemplo do tamanho do input" aria-describedby="description-item">
                        </div>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal">Salvar</button>
            </div>
        </div>
    </div>
</div>
