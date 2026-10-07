<div class="wrapper-mobile">

    <header id="header-steps">
        <div class="content-icon">
            <a id="back-mobile"><img src="<?= Host::getLocal() ?>webfiles/img/icons/left-arrow.png"" alt="Voltar"></a>
        </div>
        <div id="title-header-steps">Cadastro</div>
    </header>


    <div class="wrapper-form">
        <h3>Informações básicas</h3>

        <div class="container-form">
            <input type="text" placeholder="Nome do Hotel / Pousada" id="hostel-name">
            <input type="text" placeholder="CEP" id="hostel-cep">
            <input type="text" placeholder="Rua" id="hostel-address">

            <div class="half-input">

                <input type="text" placeholder="Número" id="hostel-number">
                <input type="text" placeholder="Bairro" id="hostel-neighboor">

            </div>

            <div class="half-input">

                <select  id="hostel-estate">
                    <option value="">Estados</option>
                </select>

                <select  id="hostel-city">
                    <option value="">Cidades</option>
                </select>

            </div>

            <input type="tel" placeholder="CNPJ" id="hostel-cnpj">

            <a id="btn-basic-info" class="btn-add-establishment">Continuar</a>

        </div>

    </div>

    <div class="wrapper-progressbar">
<!--        <section class="form-group progress-content" style="margin: 0">-->
<!--            <div class="progress">-->
<!--                <div class="progress-width"></div>-->
<!--            </div>-->
<!--        </section>-->
    </div>
</div>
