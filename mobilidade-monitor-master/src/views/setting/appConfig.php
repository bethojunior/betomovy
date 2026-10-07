<div class="container-default-monitor p-2">
    <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addAppConfigModal">Adicionar
        configuração
    </button>
    <small>As configurações de aplicativos são utilizadas para personalizar a aparência dos aplicativos de mobilidade.
    </small>
    <div class="table-responsive">
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Cor principal</th>
                <th>Cor de texto principal</th>
                <th>Cor secundária</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>
    </div>

    <div class="logo-customization-section mt-4">
        <h4>Personalização da Logo</h4>
        <small>Altere a logo do site e do monitor de configuração, aqui.</small>
        <div class="logo-customization-form mt-3">
                <div class="form-group">
                    <img src="" id="monitor-logo" alt="Avatar" class="logo-monitor img-fluid rounded-circle" width="250" height="250" />
                    <div
                    style="margin-top: 10px;"
                    >
                        <input type="file" id="siteLogo" accept="image/*" required>
                    </div>
                </div>
                <button type="submit" id="btn-update-save" class="btn btn-primary mt-10">Salvar Alterações</button>
        </div>
    </div>

    <div class="modal fade" id="addAppConfigModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="addAppConfigForm">
                    <div class="modal-header">
                        <h5 class="modal-title">Adicionar nova configuração</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="exampleFormControlSelect1">Selecione o tipo de app</label>
                            <select class="form-control" id="appId">
                                <option value="4">APP CLIENTE MOBILIDADE</option>
                                <option value="2">APP MOTORISTA MOBILIDADE</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="name">Nome do aplicativo</label>
                            <input type="text" class="form-control" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="logo">Logo</label>
                            <div>
                                <input type="file" id="logo" accept="image/*" required>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group d-flex justify-content-between align-items-center">
                            <label for="mainColor" class="m-0">Cor principal</label>
                            <input type="color" id="mainColor" class="ml-1">
                        </div>
                        <hr>
                        <div class="form-group d-flex justify-content-between align-items-center">
                            <label for="mainColorText" class="m-0">Cor de texto principal</label>
                            <input type="color" id="mainColorText" class="ml-1">
                        </div>
                        <hr>
                        <div class="form-group d-flex justify-content-between align-items-center">
                            <label for="secondaryColor" class="m-0">Cor secundária</label>
                            <input type="color" id="secondaryColor" class="ml-1">
                        </div>
                        <hr>
                        <div class="form-group d-flex justify-content-between align-items-center">
                            <label for="secondaryColorText" class="m-0" style="display: none">Cor de texto secundária</label>
                            <input type="color" id="secondaryColorText" style="display: none" value="#fff" class="ml-1">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
