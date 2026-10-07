<div class="row">
    <div class="row col-lg-12 container">
        <div class="row col-lg-12 col-sm-12">
            <div class="row col-lg-6">
                    <span><b>Suposto problema</b></span><hr>
                    <input class="form-control">
                </div>
                <div class="col-lg-12 form-group">
                    <b>Prioridade</b><hr>
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" id="customRadioInline1" name="urgencia" class="custom-control-input">
                        <label class="custom-control-label" for="customRadioInline1">Baixa</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" id="customRadioInline2" name="urgencia" class="custom-control-input">
                        <label class="custom-control-label" for="customRadioInline2">Média</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" id="customRadioInline3" name="urgencia" class="custom-control-input">
                        <label class="custom-control-label" for="customRadioInline3">Alta</label>
                    </div>
                </div>
                <div class="col-lg-12 form-group">
                    <b for="exampleFormControlTextarea1">Descrição do suposto problema</b><hr>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>
                <div class="col-lg-12 form-group">
                    <b>Anexar imagens</b><hr>
                    <button id="insert-image" class="btn btn-secondary btn-file">
                        <input type="file" id="load-image-report">
                        <i class="material-icons">add</i>
                    </button>
                    <div class="row co-lg-12" id="mount-insert-images">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-12 center">
            <button id="send-support" class="btn btn-primary">Enviar</button>
        </div>
    </div>
</div>