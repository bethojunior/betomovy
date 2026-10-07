<div class="modal" id="modalPendecies">
    <div class="modalContent">
        <div id="typePendencies"></div>
        <button id="sendPendecies" class="add">Adicionar</button>
    </div>
</div>
<div class="limitDiv">
    <div class="row generalThisDriver" id="generalThisDriver">
        <div class="card" style="width: 100%;">
            <div class="card-body" style="padding: 0;">
                <div class="card-header">
                    Dados pessoais
                </div>
                <div class="personal-data row">
                    <div class="firstPart">
                        <div class="imageProfile">
                            <div>
                                <img id="imageDriver">
                            </div>
                            <div id="aboutDriver"></div>
                        </div>
                        <button type="button" id="btnRequestImageProfile" class="btn btn-block" data-dismiss="modal">Solicitar nova
                            foto de perfil
                        </button>
                        <button type="button" style="display:none;margin-top: 4px;" id="btnRequestUpdateImageProfile" class="btn" data-dismiss="modal" data-toggle="modal" data-target="#modal-new-photo">Verificar mudança na imagem
                            de perfil
                        </button>
                        <button id="edit-type" class="btn">Editar tipo</button>
                    </div>
                    <div class="secondPart">
                        <div class="divInputs" id="divInputsDataUser">
                            <div class="form-group" id="form-group-data-user">
                                <label for="name">Nome</label>
                                <input disabled id="name" class="form-control" type="text" aria-describedby="emailHelp">

                                <label for="nickname">Apelido</label>
                                <input disabled id="nickname" class="form-control" type="text" aria-describedby="emailHelp">

                                <label for="email">Email</label>
                                <input disabled id="email" class="form-control" type="email" aria-describedby="emailHelp">

                                <label for="phone">Telefone</label>
                                <input disabled id="phone" class="form-control field-phone" type="tel" aria-describedby="emailHelp">

                                <label for="document">CPF/CNPJ</label>
                                <input disabled id="document" class="form-control" type="tel" aria-describedby="emailHelp">
                            </div>
                        </div>
                    </div>
                    <div class="third-part">
                        <div class="divInputs" id="divInputsDataUser">
                            <div class="form-group" id="form-group-data-user">
                                <label for="cnh">CNH</label>
                                <input disabled id="cnh" class="form-control" type="tel" aria-describedby="emailHelp">

                                <label for="gender">Gênero</label>
                                <select disabled class="form-control" id="selectGender">
                                </select>

                                <label for="dateOfBirth">Data de Nascimento</label>
                                <input disabled id="dateOfBirth" class="form-control" type="date" aria-describedby="dateOfBirthHelp">
                            </div>
                        </div>
                    </div>
                    <div class="container-button-edit">
                        <button type="button" class="btn btn-primary btn-edit-driver" data-toggle="modal" data-target="#driverEditData">
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="accordion" id="accordionExample">
        <div class="card">
            <div class="card-header" id="headingOne">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#datacard" aria-expanded="true" aria-controls="collapseOne">
                        Dados bancários
                    </button>
                </h2>
            </div>
            <div id="datacard" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="card-body">
                    <div class="dataCar">
                        <div class="first">
                            <div class="row divInputs">
                                <form class="form-group col-lg-6 col-sm-12 inputs-bank-data">
                                    <label>Banco</label>
                                    <select disabled class="form-control col s12" id="mount-bank">
                                    </select>
                                    <label for="agency">Agência</label>
                                    <input disabled class="form-control" aria-describedby="emailHelp" id="agency">
                                    <label for="numberAccount">Conta</label>
                                    <input disabled class="form-control" aria-describedby="emailHelp" id="numberAccount">
                                    <label for="numberAccount">Digito</label>
                                    <input disabled class="form-control" aria-describedby="emailHelp" id="numberAccountDigit">
                                    <label for="numberAccount">PIX</label>
                                    <input disabled class="form-control" aria-describedby="emailHelp" id="pixAccountDigit">
                                </form>
                                <form class="form-group col-lg-6 col-sm-12 inputs-bank-data">
                                    <label for="op">Operação</label>
                                    <input disabled class="form-control" aria-describedby="emailHelp" id="op">
                                    <label for="typeAccount">Tipo de conta</label>
                                    <input disabled class="form-control" aria-describedby="emailHelp" id="typeAccount">
                                    <label for="bankAccountDocument">Documento do titular da conta</label>
                                    <input disabled class="form-control" aria-describedby="emailHelp" id="bankAccountDocument">
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header" id="headingTwo">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#datacardtwo" aria-expanded="true" aria-controls="collapseOne">
                        Dados do carro
                    </button>
                </h2>
            </div>
            <div id="datacardtwo" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="card-body">
                    <div class="dataCar">
                        <div class="first">
                            <div class="row divInputs">
                                <form class="form-group col-lg-6 col-sm-12" id="firstCarInput">
                                    <label>Modelo</label>
                                    <input disabled id="model" class="form-control">
                                    <label>Marca</label>
                                    <input disabled id="brand" class="form-control">
                                    <label>Cor</label>
                                    <input disabled id="color" class="form-control">
                                </form>
                                <form class="form-group col-lg-6 col-sm-12" id="secondCarInput">
                                    <label>Ano</label>
                                    <input class="form-control" disabled id="year">
                                    <label>Placa</label>
                                    <input class="form-control" disabled id="plate">
                                    <label>Renavan</label>
                                    <input class="form-control" disabled id="renavam">
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="container-button-edit-car">
                        <button type="button" class="btn btn-primary btn-edit-car-data">
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header" id="headingTwo">
                <h2 class="mb-0">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#data-images" aria-expanded="false" aria-controls="collapseTwo">
                        Documentos
                    </button>
                </h2>
            </div>
            <div id="data-images" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                <ul class="list-documents-driver" id="listDocumentDriver"></ul>
                <div style="margin: 0 10px 20px 0;">
                    <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#modalRequestDocument">Solicitar Documento
                    </button>
                    <button id="btnSaveUpdateDocument" type="button" class="btn btn-primary float-right" style="display: none">Salvar
                    </button>
                </div>
            </div>
        </div>
        <!-- ADDRESS CONFIG -->
        <div class="card">
            <div class="card-header" id="headingFour">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#data-driver-address" aria-expanded="true" aria-controls="collapseFour">
                        Endereço
                    </button>
                </h2>
            </div>
            <div id="data-driver-address" class="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                <div class="card-body">
                    <div class="dataDriverAddress">
                        <div class="first">
                            <div class="row divInputs">
                                <div class="form-group col-lg-6 col-sm-12 inputs-driver-address">
                                    <label>CEP</label>
                                    <input disabled id="cep" class="form-control field-cep">
                                    <label>Rua</label>
                                    <input disabled id="street" class="form-control">
                                    <label>Número</label>
                                    <input disabled id="number" class="form-control">
                                    <label>Complemento</label>
                                    <input disabled id="complement" class="form-control">
                                </div>
                                <div class="form-group col-lg-6 col-sm-12 inputs-driver-address">
                                    <label>Bairro</label>
                                    <input disabled id="neighborhood" class="form-control">
                                    <label>Cidade</label>
                                    <select disabled id="city" class="form-control">
                                    </select>
                                    <label>Estado</label>
                                    <input disabled id="state" class="form-control">
                                </div>
                            </div>
                            <div class="container-button-edit-driver-address">
                                <button type="button" class="btn btn-primary btn-edit-driver-address" data-toggle="modal" data-target="#driverAddressEditData">
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- SPLIT CONFIG -->
        <div class="card" id="card-split">
            <div class="card-header" id="headingFive">
                <h2 class="mb-0">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#data-driver-split-config" aria-expanded="false" aria-controls="collapseFive">
                        Split
                    </button>
                </h2>
            </div>
            <div id="data-driver-split-config" class="collapse" aria-labelledby="collapseFive" data-parent="#accordionExample">
                <div class="card-body" id="driver-split-config-content">
                    Carregando informações...
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalExemplo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Tipo da categoria</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="mount-types-user" class="modal-body">

            </div>
            <div class="modal-footer">
                <button id="save-new-type-user" type="button" class="btn btn-primary">Salvar mudanças</button>
            </div>
        </div>
    </div>
</div>


<div id="modal-new-photo" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">O motorista solicitou alteração de foto do perfil</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <img id="new-photo" class="img-fluid">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="release-photo">Liberar Foto</button>
                <button type="button" class="btn btn-secondary" id="deny-photo" data-dismiss="modal">Recusar
                </button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="modalDocumentView" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Documento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <img class="img-fluid" id="modalImage" />
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="modalRequestDocument" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form>
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Solicitar Documento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="requestDocument">Documento</label>
                        <select class="form-control" id="requestDocument"></select>
                    </div>
                    <div class="form-group">
                        <label for="statusRequestDocument">Status</label>
                        <select class="form-control" id="statusRequestDocument"></select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="btnRequestDocument">Solicitar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="carEditData">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="titleDataCar">Editar dados do carro</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="formDataCarDriver">
                <div class="modal-body">
                    <label>Modelo</label>
                    <input id="editModel" required class="form-control">
                    <label>Marca</label>
                    <input id="editBrand" required class="form-control">
                    <label>Cor</label>
                    <input id="editColor" required class="form-control">
                    <label>Ano</label>
                    <input id="editYear" required class="form-control">
                    <label>Placa</label>
                    <input id="editPlate" required class="form-control">
                    <label>Renavan</label>
                    <input id="editRenavan" required class="form-control">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary btn-save-data-car">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="driverEditData">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="titleModalEditDriver">Editar dados pessoais</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="formDataDriver">
                <div class="modal-body">
                    <label for="name">Nome</label>
                    <input required id="editName" class="form-control" type="text" aria-describedby="emailHelp">

                    <label for="nickname">Apelido</label>
                    <input required id="editNickname" class="form-control" type="text" aria-describedby="emailHelp">

                    <label for="email">Email</label>
                    <input required id="editEmail" class="form-control" type="email" aria-describedby="emailHelp">

                    <label for="phone">Telefone</label>
                    <input required id="editPhone" class="form-control field-phone" type="tel" aria-describedby="emailHelp">

                    <label for="document">CPF/CNPJ</label>
                    <input required id="editDocument" class="form-control" type="tel" aria-describedby="emailHelp">

                    <label for="cnh">CNH</label>
                    <input required id="editCnh" class="form-control" type="tel" aria-describedby="emailHelp">

                    <label for="gender">Gênero</label>
                    <select class="form-control" id="editSelectGender">
                    </select>

                    <label for="editDateOfBirth">Data de Nascimento</label>
                    <input required id="editDateOfBirth" class="form-control" type="date" aria-describedby="dateOfBirthHelp">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary btn-save-data-edit-driver">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="driverAddressEditData">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="titleModalEditDriverAddress" class="modal-title">Editar endereço do motorista</h5>
                <button id="closeModalEditDriverAddress" type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="formDataDriverAddress">
                <div class="modal-body">
                    <label>CEP</label>
                    <input id="editCep" class="form-control field-cep">
                    <label>Rua</label>
                    <input id="editStreet" class="form-control">
                    <label>Número</label>
                    <input id="editNumber" class="form-control">
                    <label>Complemento</label>
                    <input id="editComplement" class="form-control">
                    <label>Bairro</label>
                    <input id="editNeighborhood" class="form-control">
                    <label>Cidade</label>
                    <select id="editCity" class="form-control">
                    </select>
                    <label>Estado</label>
                    <input id="editState" disabled class="form-control">
                </div>
                <div class="modal-footer">
                    <button id="closeModalEditDriverAddress" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button id="btnSaveEditDriverAddress" type="button" class="btn btn-primary btn-save-data-edit-driver-address">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>