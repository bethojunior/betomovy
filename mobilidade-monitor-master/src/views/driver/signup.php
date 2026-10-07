<div class="container-signup">
    <form>
        <div class="group-signup all-size active" value="TYPE_DRIVER">
            <h4>Escolha a categoria de atuação</h4>
            <ul id="listTypesDriver"></ul>
        </div>
        <div class="group-signup all-size" value="PERSONAL_DATA">
            <h4>Dados pessoais</h4>
            <div class="content-form-group">
                <div class="row remove-margin">
                    <div class="col-lg-12 col-sm-12 form-group">
                        <label for="name">Nome</label>
                        <input type="text" name="name" id="name" class="form-control" placeholder="Nome">
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-12 col-sm-12">
                        <label for="cpf">CPF/CNPJ</label>
                        <input type="tel" name="cpf" id="cpf" class="form-control">
                    </div>
                </div>
                <div class="row remove-margin mb-1">
                    <div class="col-lg-10 col-sm-12">
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
                    <div class="form-group col-lg-12">
                        <label for="email">E-mail</label>
                        <input type="email" name="email" id="email" placeholder="E-mail" class="form-control">
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-12">
                        <label for="cpf">Telefone</label>
                        <input type="tel" name="phone" id="phone" placeholder="Telefone" class="form-control">
                    </div>
                </div>

                <button id="btnPersonalData" type="button" class="btn btn-primary btn-next-step">PRÓXIMO</button>
            </div>
        </div>
        <div class="group-signup all-size" value="CITY" id="groupReturnDriver">
            <h4>Selecione a cidade de atuação</h4>
            <div class="content-form-group">
                <div class="row remove-margin">
                    <div class="form-group col-lg-12 col-sm-12">
                        <label for="cityWork">Cidade de trabalho</label>
                        <select id="cityWork" class="custom-select">
                            <option value="" disabled selected>Selecione a cidade</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary btn-next-step" id="btnCompany" type="button">PRÓXIMO</button>
            </div>
        </div>
        <div class="group-signup all-size" value="MILITARY_FIELDS">
            <h4>Dados militares</h4>
            <div class="content-form-group">
                <div>
                    <select id="typeMilitaryForce" class="input-custom-signup">
                        <option value="" disabled selected>Escolha o tipo de força</option>
                    </select>

                    <select id="typeGraduations" class="input-custom-signup">
                        <option value="" disabled selected>Escolha o tipo de patente</option>
                    </select>

                    <select id="typeStatus" class="input-custom-signup">
                        <option value="" disabled selected>Tipo de status</option>
                    </select>

                    <input type="tel" name="text" id="numberOM" placeholder="Organização Militar" class="input-custom-signup">
                </div>
                <button class="btn-next-signup" id="btnMilitaryFields" type="button">PRÓXIMO</button>
            </div>
        </div>
        <div class="group-signup all-size" value="CAR_DATA">
            <h4>Dados do veiculo</h4>
            <div class="content-form-group">
                <div class="row remove-margin">
                    <div class="form-group col-lg-12 col-sm-12">
                        <label for="numberCRLV">Número do documento do carro</label>
                        <input type="tel" id="numberCRLV" class="form-control" placeholder="Número do documento do carro">
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-6 col-sm-12">
                        <label for="markCar">Marca do carro</label>
                        <input id="markCar" class="form-control" placeholder="Informe a marca do carro" />
                    </div>
                    <div class="form-group col-lg-6 col-sm-12">
                        <label for="modelCar">Modelo do carro</label>
                        <input id="modelCar" class="form-control" placeholder="Informe o modelo do carro" />
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-6 col-sm-12">
                        <label for="licensePlate">Placa do carro</label>
                        <input type="text" id="licensePlate" class="form-control" placeholder="Placa do carro">
                    </div>
                    <div class="form-group col-lg-6 col-sm-12">
                        <label for="renavam">Número do renavam</label>
                        <input type="tel" id="renavam" class="form-control" placeholder="Número do renavam">
                    </div>
                </div>
                <div class="row remove-margin">
                    <div class="form-group col-lg-6 col-sm-12">
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
                    <div class="form-group col-lg-6 col-sm-12">
                        <label for="numberSeatingCar">Número de assentos</label>
                        <input type="number" id="numberSeatingCar" min="4" max="10" value="4" class="form-control" placeholder="Número de assentos">
                    </div>
                    <div class="form-group col-lg-6 col-sm-12">
                        <label for="yearCar">Ano do carro</label>
                        <input type="text" id="yearCar" class="form-control" placeholder="Ano do carro">
                    </div>
                    <p>
                        <input type="checkbox" id="isRentalOfVehicles" />
                        <label for="isRentalOfVehicles">Veiculo é locado ?</label>
                    </p>
                    <div class="form-group col-lg-6 col-sm-12">
                        <input type="text" id="cnpjCompany" style="display: none" class="form-control" placeholder="CNPJ da empresa">
                    </div>
                </div>
                <button class="btn btn-primary" id="btCRLV" type="button">PRÓXIMO</button>
            </div>
        </div>
        <div class="group-signup all-size" value="PROFILE_IMAGE">
            <h4>Perfil</h4>
            <div class="content-form-group">
                <div class="profile-driver-preview" id="imgPreviewPROFILE">
                    <input type="file" id="btnCaptureProfile" typeImage="PROFILE">
                    <i class="material-icons" value="PROFILE">camera_alt</i>
                </div>
                <button class="btn btn-primary " type="button" id="btnProfile">PRÓXIMO</button>
            </div>
        </div>
        <div class="container-document-list" value="DOCUMENT"></div>
    </form>
    <div>
        <div class="preload-return"></div>
    </div>
</div>
<button class="btn-next-signup bottom-button" type="button">PRÓXIMO</button>