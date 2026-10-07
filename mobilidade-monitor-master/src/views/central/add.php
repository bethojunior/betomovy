<div class="container-default-monitor">
    <form class="container pl-lg-5">
        <div class="form-group row">
            <div class="col-md-4 upload-image-central">
                <input type="file" id="inputPreviewImageCentral">
                <img class="img-thumbnail" id="previewImageCentral">
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-4">
                <label for="nameCentral">Informe o nome da central</label>
                <input type="text" class="form-control" id="nameCentral" placeholder="Nome da central">
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-5">
                <label for="addressCentral">Informe o endereço da central</label>
                <div class="input-group" style="cursor: pointer" data-toggle="modal" data-target="#staticBackdrop">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="material-icons">place</i></div>
                    </div>
                    <input type="text" class="form-control" id="addressCentral" placeholder="Endereço" disabled>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-4">
                <label for="centralCallDriver">Formas de chamado de motorista</label>
                <select class="form-control" id="centralCallDriver">
                    <option value="" disabled selected>Selecione um tipo de chamado</option>
                </select>
            </div>
        </div>
        <div class="mb-4">
            <p class="mb-1">Escolha o tipo de exibição da tarifa:</p>
            <div class="custom-control custom-radio">
                <input type="radio" id="customRadioInline1" name="showAllPrices" value="1" class="custom-control-input" checked>
                <label class="custom-control-label" for="customRadioInline1">Mostrar todos os preços</label>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" id="customRadioInline2" name="showAllPrices" value="0" class="custom-control-input">
                <label class="custom-control-label" for="customRadioInline2">Mostrar apenas preços da central</label>
            </div>
        </div>
        <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="syncCustomers">
            <label class="custom-control-label" for="syncCustomers">Unificar clientes da central junto com da
                plataforma</label>
        </div>
        <hr/>
        <h5>Usuário responsavel</h5>
        <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="register-international" role="switch" id="flexSwitchCheckDefault">
            <label class="form-check-label" for="flexSwitchCheckDefault">Cadastro internacional</label>
        </div>
        <div class="form-group row">
            <div class="col-md-4">
                <label for="nameUserCentral">Nome</label>
                <input type="text" class="form-control" id="nameUserCentral" placeholder="Nome">
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-6">
                <label for="emailUserCentral">E-mail</label>
                <input type="email" class="form-control" id="emailUserCentral" placeholder="E-mail">
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-3">
                <label for="phoneUserCentral">Telefone</label>
                <input type="tel" class="form-control" id="phoneUserCentral" placeholder="Telefone">
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-3">
                <label for="phoneUserCentral">Senha</label>
                <input type="password" class="form-control" id="passwordUserCentral" placeholder="Senha">
            </div>
        </div>
        <div class="form-group row mb-sm-1">
            <div class="col-lg-2 col-6">
                <button type="button" id="btnSaveCentral" class="btn btn-primary  w-100">Salvar</button>
            </div>
            <div class="col-lg-2  col-6">
                <a href="<?php echo Host::getLocal() ?>central" class="btn btn-danger w-100">Cancelar</a>
            </div>
        </div>
    </form>
</div>

<div class="modal fade" id="staticBackdrop" data-backdrop="static" tabindex="-1" role="dialog"
     aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Procurar endereço</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="sr-only" for="addressCentralSearch">Procure o endereço da central</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="material-icons">search</i></div>
                        </div>
                        <input type="text" class="form-control" id="addressCentralSearch"
                               placeholder="Digite o endereço">
                    </div>
                </div>
                <ul id="listAddress" class="list-group"></ul>
            </div>
        </div>
    </div>
</div>