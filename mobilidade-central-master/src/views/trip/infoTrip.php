<div class="container-finish-trip">
    <div>
        <i class="material-icons" id="closeFinishTrip">close</i>
        <div class="info-trip-finish">
            <h4>Origem: </h4>
            <span id="originAddressFinishTrip">
            </span>
        </div>
        <div class="info-trip-finish">
            <h4>Destino: </h4>
            <span id="destinationAddressFinishTrip">
            </span>
        </div>

        <div class="info-trip-finish">
            <span class="value-trip-finish">$ <span id="priceTrip"></span></span>
            <span class="payment-form-trip-finish">
                Valor fixo em <b><span id="tripPaymentForm"></span></b>
            </span>
        </div>

        <header class="info-trip-finish img-cars eco-trip">
            <div class="img-car-finish">
                <div id="co2Economized"><span>CO²</span></div>
                <img src="webfiles/img/icon/carro_eco.png">
            </div>

            <div class="img-car-finish">
                <div  id="co2ShouldSpent"><span>CO²</span></div>
                <img src="webfiles/img/icon/carro_eco2.png">
            </div>
        </header>

        <footer class="footer-finish-trip eco-trip">
            Parabéns <span id="nameClientTrip"></span>, você acaba de salvar o planeta em
            <span id="economizedC02"></span> kg de Co²

            <footer>Cálculo aproximado</footer>
        </footer>
        <div class="trip-normal-finish">
            <img src="webfiles/img/icon/icon_taxista_zinho.png">
            <h4>Obrigado por utilizar<br> nosso serviço.</h4>
        </div>
    </div>

    <!--<div id="tripPay">

        <?php
    $co2      = "5,0";
    $otherCo2 = "20,5";
    ?>
        <div class="row ecoGeral">

            <header class="col s12 images">
                <div class="col s6">
                    <img class="responsive-img" src="webfiles/img/icon/carro_eco.png">
                    <span class="firstValueCo"><?=$co2?><span class="sub">CO²</span></span>
                </div>

                <div class="col s6 carTwo">
                    <img class="responsive-img" src="webfiles/img/icon/carro_eco2.png">
                    <span class="secondValueEco"><?=$otherCo2?><span class="sub">CO²</span></span>
                </div>
            </header>

            <div class="col s12 bodyPage">
        <span class="col s12 firstText">
            Parabéns <span id="nameInfoTrip"></span>, você acaba de salvar o planeta de
            <span class="co2">
                <?=$co2?>
            </span>
            <span class="subLeft">CO²</span>
        </span>
            </div>

            <div class="col s12 divKnowMore">
                <button class="col s12 btn large">Saiba mais</button>
            </div>

            <footer class="col s12 footerPage">
                A TaxiReturn tem um modo mais eficiente de chamadas de carros, assim procuramos os veículos que já estão
                retornando
                para seu destino, ou seja, uma viajem de retorno, com isso o carro que fez sua viagem roda em média 50%
                menos,
                consumindo menos combustíveis, gastando menos pneu e emitindo menos CO² na atmosfera.
            </footer>
        </div>
    </div>-->
</div>