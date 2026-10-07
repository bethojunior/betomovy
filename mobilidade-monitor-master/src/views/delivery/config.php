<div class="container-default-monitor">
    <div class="p-2 m-4" style="background-color: #fff; border-radius: 5px">
        <div class="accordion" id="accordionExample">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Configurações do tipo de chamado
                        </button>
                    </h2>
                </div>

                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="d-flex justify-content-between w-100 p-3">
                        <div class="pl-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radio" id="typeDeliveryConfig1" value="by_area">
                                <label class="form-check-label" for="typeDeliveryConfig1">
                                    Por área
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radio" id="typeDeliveryConfig2" value="by_neighborhood">
                                <label class="form-check-label" for="typeDeliveryConfig2">
                                    Por bairro
                                </label>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-primary mt-2" id="btnUpdateConfig">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="accordion">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseNameEstablishment" aria-expanded="true" aria-controls="collapseOne">
                            Configuração de nome do painel do estabelecimento
                        </button>
                    </h2>
                </div>

                <div id="collapseNameEstablishment" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="d-flex justify-content-between w-100 p-3">
                        <div class="pl-3 w-25">
                            <input type="text" class="form-control" id="nameEstablishmentDelivery">
                        </div>
                        <div>
                            <button class="btn btn-primary mt-2" id="btnUpdateNameEstablishment">Atualizar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseImageBannerSignUp" aria-expanded="true" aria-controls="collapseOne">
                            Configuração de banner da tela de cadastro no painel do delivery
                        </button>
                    </h2>
                </div>

                <div id="collapseImageBannerSignUp" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="d-flex justify-content-between w-100 p-3">
                        <div class="pl-3 w-25">
                            <input type="file" class="form-control-file" id="imageBannerSignUp">
                        </div>
                        <div>
                            <button class="btn btn-primary mt-2" id="btnUpdateImageBannerSignUp">Atualizar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion" id="accordionExampleConfirmationCode">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseActivateConfirmationCode" aria-expanded="true" aria-controls="collapseOne">
                            Ativar código de confirmação de sms no cadasto do cliente
                        </button>
                    </h2>
                </div>

                <div id="collapseActivateConfirmationCode" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExampleConfirmationCode">
                    <div class="d-flex justify-content-between w-100 p-3">
                        <div class="pl-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radioCodeConfirm" id="codeConfirmYes" value="1">
                                <label class="form-check-label" for="codeConfirmYes">
                                    Sim
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radioCodeConfirm" id="codeConfirmNot" value="0">
                                <label class="form-check-label" for="codeConfirmNot">
                                    Não
                                </label>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-primary mt-2" id="btnUpdateConfirmationCode">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>