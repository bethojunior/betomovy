<div class="wrapper-mobile">

    <header id="header-steps">
        <div id="title-header-steps">Cadastro</div>
    </header>

    <header class="row" id="headerWebSignUp">
        <span class="titleHeaderSignUp">Cadastro</span>
        <div class="content-icon">
            <a id="back-mobile"><img src="<?= Host::getLocal() ?>webfiles/img/icons/left-arrow.png"" alt="Voltar"></a>
        </div>
    </header>

    <div id="screenMobile" class="wrapper-form">

        <h3>Informações básicas</h3>

        <form class="container-form">
            <input type="text" placeholder="Estabelecimento" autocomplete="off" id="hostel-name">
            <input type="text" placeholder="Endereço" id="hostel-address" autocomplete="off" class="address-hostel">
            <div class="half-input">

                <input type="text" placeholder="Número" id="hostel-number" class="number-half" autocomplete="off" hidden>
            </div>
            <input type="text" placeholder="Bairro" autocomplete="off" id="hostel-neighboor" hidden>
            <div class="half-input" hidden>
                <input type="text" autocomplete="off" placeholder="CEP" id="hostel-cep" class="input-cep" hidden>

                <select id="hostel-estate" class="input-uf" hidden>
                    <option value="">Estados</option>
                </select>

                <select id="hostel-city" hidden>
                    <option value="">Cidades</option>
                </select>

            </div>

        </form>
        <a id="btn-basic-info" class="btn-add-establishment">Continuar</a>

    </div>

    <div class="wrapper-progressbar">
        <!--        <section class="form-group progress-content" style="margin: 0">-->
        <!--            <div class="progress">-->
        <!--                <div class="progress-width"></div>-->
        <!--            </div>-->
        <!--        </section>-->
    </div>
</div>
