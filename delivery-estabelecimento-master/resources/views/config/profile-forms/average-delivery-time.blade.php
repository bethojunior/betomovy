<div class="card">
    <div class="card-header" id="headingAverageDeliveryTime">
        <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                    data-target="#collapseAverageDeliveryTime" aria-expanded="false" aria-controls="collapseAverageDeliveryTime">
                Tempo médio de entrega (Em minutos)
            </button>
        </h2>
    </div>
    <div id="collapseAverageDeliveryTime" class="collapse" aria-labelledby="headingMinPrice"
         data-parent="#accordionExample">
        <form action="{{ route("companyDeliveryOrderConfig.updateAverageDeliveryTime") }}" method="POST" id="formOrderMinPrice">
            @csrf
            <div class="card-body">
                <div class="row">
                    <div class="form-group col-lg-3 col-md-4 col-sm-12">
                        <input type="number" class="form-control" value="{{ $companyDeliveryOrderConfig ? $companyDeliveryOrderConfig->averageDeliveryTime ?? 0  :0 }}" name="averageDeliveryTime">
                    </div>
                </div>
                <input type="tel" class="form-control mask-money-input"  value="{{ Auth::user()->companyWorker->companyId }}" name="companyId" hidden>
                <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
        </form>
    </div>
</div>
