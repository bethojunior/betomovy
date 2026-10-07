<script src="https://unpkg.com/i18next/dist/umd/i18next.js"></script>
<script src="https://unpkg.com/i18next/dist/umd/i18next.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>


<div class="row col l12 col s12">
    <ul id="slide-out" class="side-nav">
        <li>
            <div class="divider"></div>
        </li>
        <li><a class="waves-effect" href="/driver/signup" id="nav-title-driver">Motorista</a> </li>
        <li><a class="waves-effect" href="/cliente/preregister" id="nav-title-passenger">Passageiro</a> </li>
    </ul>
    <a href="#" data-activates="slide-out" class="button-collapse mobile"><i class="material-icons">menu</i></a>
    <ul id="dropdown1" class="dropdown-content">
        <a style="color: var(--main-color)" id="title-drop-driver">Motorista</a>
<!--        <a style="color: var(--main-color)" href="--><?php //=Host::getLinkAppDrivers()?><!--" id="title-drop-driver">Motorista</a>-->
<!--        <a style="color: var(--main-color)" href="--><?php //=Host::getLinkAppClient()?><!--" id="title-drop-passenger">Passageiro</a>-->
        <a style="color: var(--main-color)" id="title-drop-passenger">Passageiro</a>
    </ul>
    <nav>
        <div class="nav-wrapper">
            <a href="#" class="brand-logo"><span class="name-application"></span>
                <ul class="right hide-on-med-and-down">
                    <li><a href="/driver/signup" title="title-dropdown-driver" id="title-dropdown-driver">Motorista</a></li>
                    <li><a href="/cliente/preregister" title="title-dropdown-passenger" id="title-dropdown-passenger">Passageiro</a></li>
                    <!-- Dropdown Trigger -->
                    <li>
                        <a class="dropdown-button" href="#!" data-activates="dropdown1" id="button-download">Download
                            <i class="material-icons right">arrow_drop_down</i>
                        </a>
                    </li>
                    <li>
                        <select value="" id="select-language" class="select-language">
                            <option value="" disabled selected id="option-select-default-language">Idioma</option>
                            <option value="pt" id="option-select-pt-language">Português</option>
                            <option value="en" id="option-select-en-language">Inglês</option>
                            <option value="fr" id="option-select-fr-language">Francês</option>
                            <option value="es" id="option-select-es-language">Espanhol</option>
                        </select>
                    </li>
                </ul>
        </div>
    </nav>

    <div class="parallax-container">
        <div class="parallax"><img src="<?= Host::getLocal() ?>webfiles/img/site/user.jpg"></div>
    </div>

    <div class="mid-site row col l12 s12">
        <div class="col l4 s12">
            <img class="col s12 l12 responsiveImage" id="default-logo" alt="logo">
        </div>
        <div class="col l8 s12 data">
            <p class="main-color main-size">
                <?= Host::getApplicationName() ?> <span class="main-color main-size" id="merchant-text-paragraph-1"> é um aplicativo de mobilidade urbana para solicitar viagens rápidas e confiáveis. </span> 
            </p>

            <p class="main-color main-size" id="merchant-text-paragraph-2">
                <span class="main-color main-size" id="merchant-text-paragraph-2-part-1">Basta abrir o aplicativo, escolher o seu destino e pronto! O </span>
                 <?= Host::getApplicationName() ?> 
                <span class="main-color main-size" id="merchant-text-paragraph-2-part-2">
                    tem a melhor tecnologia
                    para encontrar o motorista certo para você. Você 
                    pode salvar seus mototoristas favoritos, 
                    com ele você terá a comodidade de fazer uma viagem 
                    com alguém que você já conhece e confia.
                </span> 

            </p>

            <p class="main-color main-size" id="merchant-text-paragraph-3">
                Com uma interface bem simples e intuitiva, 
                nosso app é completo e contém todas as 
                funcionalidades para a fácil comunicação 
                entre passageira e motorista.
            </p>
        </div>
    </div>
</div>

<footer class="row col l12 s12 footer">
    <div class="row col l4 s12 form-contact">
        <div class="col l12 s12 row">
            <div class="input-field col l8 s12">
                <input id="nome-email" type="text" class="validate">
                <label for="nome-email" id="label-input-name">Nome</label>
            </div>
            <div class="input-field col l4 s12">
                <input id="contato-email" type="text" class="validate">
                <label for="contato-email" id="label-input-contact">Contato</label>
            </div>
            <div class="input-field col l12 s12">
                <textarea id="assunto-email" class="materialize-textarea"></textarea>
                <label for="assunto-email" id="label-input-subject">Assunto</label>
            </div>
            <button onclick="sendEmail()" id="send-email" style="margin-left: 0.6vw" class="btn my-btn center">Enviar</button>
        </div>

    </div>
</footer>

<div class="col l12 s12 center by">
    <a style="color: var(--color-main)" href="http://fabrica704.com.br" id="text-footer">© Desenvolvido por Fabrica 704</a>
</div>

<div id="modal-cad" class="modal">
    <div class="modal-content">
        <h3 class="row col l12 s12 center"><b><p id="title-modal">Cadastrar como</p></b></h3>
        <div class="row center col l12 s12">
            <div class="row center col l12 s12">
                <a href="/cliente/preregister">
                    <button class="btn my-btn" id="text-passenger-modal">Passageiro</button>
                </a>
            </div>

            <div class="row center col l12 s12">
                <a href="/driver/signup">
                    <button class="btn my-btn" id="text-driver-modal">Motorista</button>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="chooseApp">
    <div class="contentModal">
        <button class="btnAndroid button-modal">
            <a id="text-download-android" style="text-decoration: none; color: white">Baixar para Android</a>
        </button>
        <br>
        <button class="btnIos button-modal">
            <a id="text-download-ios" style="text-decoration: none; color: white;">Baixar para IOS</a>
        </button>
    </div>
</div>

