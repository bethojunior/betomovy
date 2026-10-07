<div class="card">
    <div class="card-header" id="headingDriverCalledMode">
        <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                    data-target="#collapseDriverCalledMode" aria-expanded="false" aria-controls="collapseMinPrice">
                Modo de chamado do entregador
            </button>
        </h2>
    </div>
    <div id="collapseDriverCalledMode" class="collapse" aria-labelledby="headingDriverCalledMode"
         data-parent="#accordionExample">
        <form action="{{ route("companyDeliveryOrderConfig.updateCalledMode") }}"  method="POST">
            @csrf
            <div class="card-body">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="callForAll" id="driverCalledModeAny"
                           value="1" {{$companyDeliveryOrderConfig ? $companyDeliveryOrderConfig->callForAll ? "checked" : "" : "checked" }}>
                    <label class="form-check-label" for="driverCalledModeAny">
                        Chamar para qualquer entregador da plataforma
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="callForAll" id="driverCalledModeSwitch"
                           value="0" {{$companyDeliveryOrderConfig ? $companyDeliveryOrderConfig->callForAll ? "" : "checked" : "" }}>
                    <label class="form-check-label" for="driverCalledModeSwitch">
                        Escolher entregador do estabelecimento
                    </label>
                </div>
                <hr/>
                <input type="tel" class="form-control mask-money-input"
                       value="{{ Auth::user()->companyWorker->companyId }}" name="companyId" hidden>
                <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
        </form>
    </div>
</div>
