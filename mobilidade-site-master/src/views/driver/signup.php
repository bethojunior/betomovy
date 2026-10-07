<script src="https://unpkg.com/i18next/dist/umd/i18next.js"></script>
<script src="https://unpkg.com/i18next/dist/umd/i18next.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>


<div class="container-signup">
    <form>
        <div class="group-signup all-size active" value="TYPE_DRIVER">
            <h4 id="header-title-categories">Escolha a categoria de atuação</h4>
            <ul id="listTypesDriver"></ul>
        </div>
        <div class="group-signup all-size" value="PERSONAL_DATA">
            <h4 id="step-datas-personal">Dados pessoais</h4>
            <div class="content-form-group">
                <div class="custom-control">
                    <div class="switch-container">
                        <label class="switch">
                            <input id="isBrazil" type="checkbox">
                            <span class="slider"></span>
                        </label>
                        <label class="switch-label"></label>
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="col-lg-4 col-sm-12 form-group">
                        <label for="name" id="label-input-name">Nome</label>
                        <input type="text" name="name" id="name" class="form-control" placeholder="Nome">
                    </div>
                </div>
                <div class="row remove-margin container-cpf">
                    <div class="form-group col-lg-4 col-sm-12">
                        <label for="cpf" id="label-input-cpf-cnpj">CPF/CNPJ</label>
                        <input type="tel" maxlength="100" name="cpf" id="cpf" placeholder="CPF/CNPJ" class="form-control input-cpf-cnpj">
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="col-lg-4 col-sm-12">
                        <label for="gender" id="label-input-gender">Gênero</label>
                        <select id="gender" class="custom-select">
                            <option value="" disabled selected id="gender-default">Gênero</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-4">
                        <label for="email" id="label-input-email">E-mail</label>
                        <input type="email" name="email" id="email" placeholder="E-mail" class="form-control">
                    </div>
                </div>
                <div class="remove-margin">
                    <div class="form-group d-flex row">
                        <div class="col-1 flex-row-container">
                            <div class="container-w-full" >
                                <label for="cpf" id="label-input-phone">Telefone</label>
                                <input type="tel" name="phone" id="phone" placeholder="Telefone" class="form-control">
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-4 col-sm-12">
                        <label for="password" id="label-input-password">Senha</label>
                        <input type="password" name="password" id="password" placeholder="Senha" class="form-control">
                    </div>
                </div>
                <button id="btnPersonalData" type="button" class="btn btn-primary btn-next-step">PRÓXIMO</button>
            </div>
        </div>
        <div class="group-signup all-size" value="CITY" id="groupReturnDriver">
    <h4 id="step-select-city">Selecione a cidade de atuação</h4>
    <div class="content-form-group">
        <div class="row remove-margin">
        <div class="form-group col-lg-4 col-sm-12">
            <label for="cityWork" id="label-input-city">Cidade de trabalho</label>
            <select id="cityWork" class="form-control select2">
                <option value="" disabled selected id="select-default-value-city">Selecione a cidade</option>
            </select>
        </div>

        </div>
        <button class="btn btn-primary btn-next-step btn-next" id="btnCompany" type="button">PRÓXIMO</button>
    </div>
</div>
        <div class="group-signup all-size" value="MILITARY_FIELDS">
            <h4 id="step-datas-military">Dados militares</h4>
            <div class="content-form-group">
                <div>
                    <select id="typeMilitaryForce" class="input-custom-signup">
                        <option value="" disabled selected id="select-type-strength">Escolha o tipo de força</option>
                    </select>

                    <select id="typeGraduations" class="input-custom-signup">
                        <option value="" disabled selected id="select-type-patent">Escolha o tipo de patente</option>
                    </select>

                    <select id="typeStatus" class="input-custom-signup">
                        <option value="" disabled selected id="select-type-status">Tipo de status</option>
                    </select>

                    <input type="tel" name="text" id="numberOM" placeholder="Organização Militar"
                           class="input-custom-signup">
                </div>
                <button class="btn-next-signup" id="btnMilitaryFields" type="button">PRÓXIMO</button>
            </div>
        </div>
        <div class="group-signup all-size" value="CAR_DATA">
            <h4 id="step-datas-vehicle">Dados do veiculo</h4>
            <div class="content-form-group">
                <div class="row remove-margin">
                    <div class="form-group col-lg-3 col-sm-12">
                        <label for="numberCRLV" id="label-input-document-car">Número do documento do carro</label>
                        <input type="tel" id="numberCRLV"
                               class="form-control" placeholder="Número do documento do carro">
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-3 col-sm-12">
                        <label for="markCar" id="label-input-brand-car">Marca do carro</label>
                        <input id="markCar" class="form-control" placeholder="Informe a marca do carro"/>
                    </div>
                    <div class="form-group col-lg-3 col-sm-12">
                        <label for="modelCar" id="label-input-model-car">Modelo do carro</label>
                        <input id="modelCar" class="form-control" placeholder="Informe o modelo do carro"/>
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-2 col-sm-12">
                        <label for="licensePlate" id="label-input-plate-car">Placa do carro</label>
                        <input type="text" id="licensePlate"
                               class="form-control" placeholder="Placa do carro">
                    </div>
                    <div class="form-group col-lg-2 col-sm-12">
                        <label for="renavam" id="label-input-number-renavam">Número do renavam</label>
                        <input type="tel" id="renavam"
                               class="form-control" placeholder="Número do renavam">
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-2 col-sm-12">
                        <label for="colorCar" id="label-input-color-car"></label>
                        <select id="colorCar" class="custom-select">
                            <option value="" disabled selected id="select-color-car"></option>
                            <option value="Branco" id="select-color-white"></option>
                            <option value="Prata" id="select-color-silver"></option>
                            <option value="Preto" id="select-color-black"></option>
                            <option value="Cinza" id="select-color-gray"></option>
                            <option value="Vermelho" id="select-color-red"></option>
                            <option value="Azul" id="select-color-blue"></option>
                            <option value="Verde" id="select-color-green"></option>
                            <option value="Bege" id="select-color-beige"></option>
                            <option value="Marrom" id="select-color-brown"></option>
                            <option value="Dourado/Amarelo" id="select-color-golden"></option>
                            <option value="Laranja" id="select-color-orange"></option>
                        </select>
                    </div>
                    <div class="form-group col-lg-2 col-sm-12">
                        <label for="numberSeatingCar" id="label-input-number-seats">Número de assentos</label>
                        <input type="number" id="numberSeatingCar" min="4" max="10" value="4"
                               class="form-control" placeholder="Número de assentos">
                    </div>
                    <div class="form-group col-lg-2 col-sm-12">
                        <label for="yearCar" id="label-input-year-car">Ano do carro</label>
                        <input type="text" id="yearCar"
                               class="form-control" placeholder="Ano do carro">
                    </div>
                    <p>
                        <input type="checkbox" id="isRentalOfVehicles"/>
                        <label for="isRentalOfVehicles" id="label-input-vehicle-leased">Veiculo é locado ?</label>
                    </p>
                    <input type="text" id="cnpjCompany" style="display: none"
                           class="input-custom-signup" placeholder="CNPJ da empresa">
                </div>
                <button class="btn btn-primary" id="btCRLV" type="button">PRÓXIMO</button>
            </div>
        </div>
        <div class="group-signup all-size" value="PROFILE_IMAGE">
            <h4 id="step-photo-perfil">Perfil</h4>
            <div class="content-form-group">
                <div class="profile-driver-preview" id="imgPreviewPROFILE">
                    <input type="file" id="btnCaptureProfile" typeImage="PROFILE">
                    <i class="material-icons" value="PROFILE">camera_alt</i>
                </div>
                <button class="btn btn-primary" type="button" id="btnProfile">PRÓXIMO</button>
            </div>
        </div>
        <div class="container-document-list" value="DOCUMENT"></div>
        <div class="group-signup-finish">
            <img class="icon-taxista" id="default-logo" alt="logo">
            <p class="text-info" id="message-register-success-title">O cadastro do motorista foi realizado com sucesso!</p>
            <p class="text-info" id="message-register-success-description">Todas informações do cadastro são de responsabilidade do usuário logado.</p>
            <button class="btn btn-primary finish-form" type="button" id="btnSendDatas">CONCLUIR</button>
        </div>
    </form>
    <div>
        <div class="preload-return"></div>
    </div>
</div>
<button class="btn-next-signup bottom-button" type="button" id="button-next">PRÓXIMO</button>
