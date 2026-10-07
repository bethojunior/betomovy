<script src="https://unpkg.com/i18next/dist/umd/i18next.js"></script>
<script src="https://unpkg.com/i18next/dist/umd/i18next.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<div class="generalPreRegisterCliente">
    <!-- <img src="<?php echo Host::getLocal() ?>webfiles/img/logo/logo.png"> -->
        <img id="promotion" alt="logo">
     
        <span class="title-name-app"><span class="name-application"></span></span>
        <div class="col l12 divInputs container-form">
            <div class="thisDivInput">
                <label class="thisInput" id="label-name">Nome</label>
                <input placeholder="" id="name" autocapitalize="words">
            </div>
            <div class="thisDivInput">
                <label class="thisInput" id="label-email">Email</label>
                <input placeholder="" type="email" id="email">
            </div>
            <div class="thisDivInput d-flex flex-row-container">
                <div class="container-w-full" >
                    <label class="thisInput" id="label-phone">Telefone</label>
                    <input placeholder="" type="tel" id="telphone">
                </div>
                <div class="col-1 align-self-center">
                    <div>
                        <input class="form-check-input" type="radio" name="ddCountry" id="brDD" value="1" checked>
                        <label class="form-check-label" for="brDD">
                            Brasil
                        </label>
                    </div>
                    <div>
                        <input class="form-check-input" type="radio" name="ddCountry" id="othersDD" value="2">
                        <label class="form-check-label" for="othersDD">
                            Outros
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <label class="city-select" id="label-gender">Gênero</label>
                <select id="genderDependent">
                    <option value="" disabled selected id="select-default-value-gender">Gênero</option>
                    <option value="masculino" id="select-value-male">Masculino</option>
                    <option value="feminino" id="select-value-feminine">Feminino</option>
                    <option value="outro" id="select-value-other">Outro</option>
                </select>
            </div>
            <div class="city-select">
                <label id="label-city">Cidade</label>
                <select id="city">
                    <option value="" selected id="select-default-value-city">Cidade</option>
                </select>
            </div>
            <div class="thisDivInput">
                <label class="thisInput" id="label-password">Senha</label>
                <input placeholder="" type="password" id="password">
            </div>
            <div class="col s12 text-description" id="description-register">
                Após finalizar seu cadastro, você será
                redirecionado para o download
            </div>
            <button class="btn my-btn row col l12 s12" id="sendData">CONCLUIR</button>
        </div>
</div>

<div class="modal" id="chooseApp">
    <div class="contentModal">
        <button class="btnAndroid">
            <a id="text-download-android" style="text-decoration: none; color: white">Baixar para Android</a>
        </button>
        <br>
        <button class="btnIos">
            <a id="text-download-ios" style="text-decoration: none; color: white;">Baixar para IOS</a>
        </button>
    </div>
</div>
