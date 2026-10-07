<img src='<?= Host::getLocal(); ?>webfiles/img/background/cadplus.jpg' class='responsiveImage'/>
<div class="generalPreRegister row">
    <div class="col s12 inputData">
        <input id="email" placeholder="E-mail" type="email">
        <input id="name" placeholder="Nome" class="col s6">
        <div class="center">
            <input id="sobreNome" placeholder="Sobrenome" class="col s6">
            <input id="phone" placeholder="Telefone" type="number">
        </div>
        <select id="city">
            <option value="796">Juazeiro</option>
            <option value="748">Crato</option>
            <option value="721">Barbalha</option>
        </select>
        <input id="pass" placeholder="Senha"   type="password">
        <input id="passAgain" placeholder="Senha *" type="password">
    </div>
    <div class="labelTermos">
        <label>
            Ao prosseguir, eu concordo em receber chamadas e mensagens SMS inclusive automáticas provenientes da RETURN e de suas afiliadas para fins informativos e/ou de marketing no número informado acima. A aceitação do recebimento da mensagem de marketing não é condição para usar os serviços da RETURN.
            <br>
            Eu li e concordo com os <a>Termos de uso</a> e a <a>Declaração de Privacidade</a>.
        </label>
    </div>
    <div class="center">
        <button id="finishThat" class="button">AVANÇAR <i class="material-icons">arrow_forward</i></button>
    </div>
</div>