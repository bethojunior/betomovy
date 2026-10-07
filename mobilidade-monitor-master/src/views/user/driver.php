<div class="container container-signup">
    <form>
        <div class="group-signup all-size active">
            <h4>Escolha sua categoria de atuação</h4>
            <ul>
                <li class="type-driver-signup" value="3">
                    <img src="<?php echo Host::getLocal() ?>webfiles/img/svg/taxi.svg">
                    <div>
                        <p>Taxista</p>
                        <label>Taxí comum</label>
                    </div>
                    <i class="material-icons">keyboard_arrow_right</i>
                </li>
                <li class="type-driver-signup" value="7">
                    <img src="<?php echo Host::getLocal() ?>webfiles/img/svg/car.svg">
                    <div>
                        <p>Plus</p>
                        <label>Motoristas particulares</label>
                    </div>
                    <i class="material-icons">keyboard_arrow_right</i>
                </li>

            </ul>
        </div>
        <div class="group-signup all-size">
            <h4>Dados pessoais</h4>

            <div class="row remove-margin">
                <div class="form-group col-4">
                    <label for="name">Nome</label>
                    <input type="text" name="name" id="name" class="form-control" placeholder="Nome">
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-2">
                    <label for="cpf">CPF</label>
                    <input type="tel" name="cpf" id="cpf" placeholder="CPF" class="form-control">
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-4">
                    <label for="gender">Gênero</label>
                    <select id="gender" class="custom-select">
                        <option value="" disabled selected>Gênero</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-6">
                    <label for="email">E-mail</label>
                    <input type="email" name="email" id="email" placeholder="E-mail" class="form-control">
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-2">
                    <label for="cpf">Telefone</label>
                    <input type="tel" name="phone" id="phone" placeholder="Telefone" class="form-control">
                </div>
            </div>

            <button type="button" class="btn btn-primary btn-next-step">PRÓXIMO</button>
        </div>
        <div class="group-signup all-size" id="groupReturnDriver">
            <h4>Dados profissionais</h4>
            <div class="row remove-margin">
                <div class="form-group col-4">
                    <label for="ufWork">Estado</label>
                    <select id="ufWork" class="custom-select"></select>
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-4">
                    <label for="cityWork">Cidade de trabalho</label>
                    <select id="cityWork" class="custom-select">
                        <option value="" disabled selected>Selecione a cidade</option>
                    </select>
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-5">
                    <label for="localReturn">Endereço ou bairro que você trabalha mais</label>
                    <input type="text" id="localReturn" class="form-control"
                           placeholder="Endereço ou bairro que você trabalha mais">
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-3">
                    <label for="nameStation">Dê um nome a este local</label>
                    <input type="text" id="nameStation" class="form-control"
                           placeholder="Dê um nome a este local">
                </div>
            </div>

            <div class="row remove-margin">
                <div class="form-group col-3">
                    <label for="typeStation"></label>
                    <select id="typeStation" class="custom-select"></select>
                </div>
            </div>

            <button class="btn btn-primary btn-next-step" type="button">PRÓXIMO</button>
        </div>
        <div class="group-signup all-size">
            <h4>Carteira Nacional de Habilitação - CNH</h4>

            <div class="row remove-margin">
                <div class="form-group col-4">
                    <label for="numberCNH">Número da carteira de motorista</label>
                    <input type="tel" id="numberCNH"
                           class="form-control" placeholder="Número da carteira de motorista">
                </div>
            </div>

            <div class="open-modal-document" value="CNH">
                <input type="file" class="file-image-driver" typeImage="CNH">
                <span>Foto da CNH</span>
                <a>
                    <i class="material-icons">keyboard_arrow_right</i>
                </a>
            </div>
            <img  id="imgPreviewCNH" class="img-thumbnail img-preview-document">
            <button class="btn btn-primary btn-next-step" type="button">PRÓXIMO</button>
        </div>
        <div class="group-signup all-size">
            <h4>Dados do veiculo</h4>
            <div class="row remove-margin">
                <div class="form-group col-3">
                    <label for="numberCRLV">Número do documento do carro</label>
                    <input type="tel" id="numberCRLV"
                           class="form-control" placeholder="Número do documento do carro">
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-3">
                    <label for="markCar">Marca do carro</label>
                    <input id="markCar" class="form-control" placeholder="Informe a marca do carro" />
                </div>
                <div class="form-group col-3">
                    <label for="modelCar">Modelo do carro</label>
                    <input id="modelCar" class="form-control" placeholder="Informe o modelo do carro" />
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-2">
                    <label for="licensePlate">Placa do carro</label>
                    <input type="text" id="licensePlate"
                           class="form-control" placeholder="Placa do carro">
                </div>
                <div class="form-group col-2">
                    <label for="renavam">Número do renavam</label>
                    <input type="tel" id="renavam"
                           class="form-control" placeholder="Número do renavam">
                </div>
            </div>
            <div class="row remove-margin">
                <div class="form-group col-2">
                    <label for="colorCar">Cor do carro</label>
                    <select id="colorCar" class="custom-select">
                        <option value="" disabled selected>Selecione a cor do carro</option>
                        <option value="Branco">Branco</option>
                        <option value="Prata">Prata</option>
                        <option value="Preto">Preto</option>
                        <option value="Cinza">Cinza</option>
                        <option value="Vermelho">Vermelho</option>
                        <option value="Azul">Azul</option>
                        <option value="Verde">Verde</option>
                        <option value="Bege">Bege</option>
                        <option value="Marrom">Marrom</option>
                        <option value="Dourado/Amarelo">Dourado/Amarelo</option>
                        <option value="Laranja">Laranja</option>
                    </select>
                </div>
                <div class="form-group col-2">
                    <label for="numberSeatingCar">Número de assentos</label>
                    <input type="number" id="numberSeatingCar" min="4" max="10" value="4"
                           class="form-control" placeholder="Número de assentos">
                </div>
                <div class="form-group col-2">
                    <label for="yearCar">Ano do carro</label>
                    <input type="text" id="yearCar"
                           class="form-control" placeholder="Ano do carro">
                </div>
            </div>
            <div class="open-modal-document" value="CRLV">
                <input type="file" class="file-image-driver" typeImage="CRLV">
                <span>Foto da CRLV(documento do carro)</span>
                <a>
                    <i class="material-icons">keyboard_arrow_right</i>
                </a>
            </div>
            <img  id="imgPreviewCRLV" class="img-thumbnail img-preview-document">
            <button class="btn btn-primary btn-next-step" type="button">PRÓXIMO</button>
        </div>
        <div class="group-signup all-size">
            <h4>ALVARÁ</h4>

            <div class="row remove-margin">
                <div class="form-group col-4">
                    <label for="numberCNH">Número da carteira de motorista</label>
                    <input type="tel" id="numberAlvara"
                           class="form-control" placeholder="Número do ALVARÁ">
                </div>
            </div>

            <div class="open-modal-document" value="ALVARA">
                <input type="file" class="file-image-driver" typeImage="ALVARA">
                <span>Foto da ALVARÁ</span>
                <a>
                    <i class="material-icons">keyboard_arrow_right</i>
                </a>
            </div>
            <img  id="imgPreviewALVARA" class="img-thumbnail img-preview-document">
            <p>
                <input type="checkbox" id="hasCardReader"/>
                <label for="hasCardReader">Possui maquina de cartão ?</label>
            </p>
            <button class="btn btn-primary btn-next-step" type="button">PRÓXIMO</button>
        </div>
        <div class="group-signup all-size">
            <h4>Atecendentes Criminais</h4>
            <span>Solicite o atestado de atecedentes criminais, <a id="openLinkAtestado">Clique aqui</a>.Tire uma foto e preencha o formúlario.</span>

            <div class="row remove-margin">
                <div class="form-group col-4">
                    <label for="numberCNH">Número da carteira de motorista</label>
                    <input type="number" id="numberCriminalRecord"
                           class="form-control" placeholder="Número do atestado"/>
                </div>
            </div>

            <button class="btn btn-primary btn-next-step" type="button">PRÓXIMO</button>

        </div>
        <div class="group-signup all-size">
            <h4>Perfil</h4>
            <div class="profile-driver-preview" id="imgPreviewPROFILE">
                <input type="file" id="btnCaptureProfile" typeImage="PROFILE">
                <i class="material-icons" value="PROFILE">camera_alt</i>
            </div>
            <button class="btn btn-primary btn-next-step" type="button">PRÓXIMO</button>
        </div>
        <div class="group-signup-finish">
            <img class="icon-taxista" src="<?php echo Host::getLocal() ?>webfiles/img/icon/icon_taxista_zinho.png">
            <p class="text-info">O cadastro do motorista foi realizado com sucesso!</p>
            <p class="text-info">Todas informações do cadastro são de responsabilidade do usuário logado.</p>
            <button class="btn btn-primary finish-form" type="button">CONCLUIR</button>
        </div>
    </form>
    <div>
        <img src="<?php echo Host::getLocal() ?>webfiles/img/icon/pre-load.gif" class="preload-return">
    </div>
</div>
<button class="btn-next-signup bottom-button" type="button">PRÓXIMO</button>
