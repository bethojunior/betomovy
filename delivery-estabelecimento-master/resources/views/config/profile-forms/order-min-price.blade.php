<div class="card">
    <div class="card-header" id="headingMinPrice">
        <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                    data-target="#collapseMinPrice" aria-expanded="false" aria-controls="collapseMinPrice">
                Valor minimo do pedido
            </button>
        </h2>
    </div>
    <div id="collapseMinPrice" class="collapse" aria-labelledby="headingMinPrice"
         data-parent="#accordionExample">
        <form action="{{ route("companyDeliveryOrderConfig.updateMinPrice") }}" method="POST" id="formOrderMinPrice">
            @csrf
            <div class="card-body">
                <div class="row">
                    <div class="form-group col-lg-3 col-md-4 col-sm-12">
                        <input type="tel" class="form-control mask-money-input" value="{{ $companyDeliveryOrderConfig ? $companyDeliveryOrderConfig->minimumOrderValue ?? 0  :0 }}" id="inputOrderMinPrice" name="minimumOrderValue">
                    </div>
                </div>
                <input type="tel" class="form-control mask-money-input"  value="{{ Auth::user()->companyWorker->companyId }}" name="companyId" hidden>
                <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
        </form>
    </div>
</div>
