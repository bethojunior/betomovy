<div class="card">
    <div class="card-header" id="headingMinPrice">
        <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                    data-target="#collapseSettingPix" aria-expanded="false" aria-controls="collapseSettingPix">
                Configuração de crédenciais para recebimento por forma de pagamento via pix
            </button>
        </h2>
    </div>
    <div id="collapseSettingPix" class="collapse" aria-labelledby="headingMinPrice"
         data-parent="#accordionExample">
        <form action="{{ route("pix.update") }}" method="POST" id="formOrderMinPrice">
            @csrf
            <div class="card-body">
                <div class="row">
                    <div class="form-group col">
                        <label for="inputMerchantName">Nome do responsável</label>
                        <input type="text" class="form-control"
                               value="{{ $settingDeliveryCompanyPix ? $settingDeliveryCompanyPix->merchantName : "" }}"
                               id="inputMerchantName" name="merchantName" required autocomplete="off">
                    </div>
                    <div class="form-group col">
                        <label for="inputMerchantCity">Nome da cidade</label>
                        <input type="text" class="form-control"
                               value="{{ $settingDeliveryCompanyPix ? $settingDeliveryCompanyPix->merchantCity : "" }}"
                               id="inputMerchantCity" name="merchantCity" required autocomplete="off">
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col">
                        <label for="inputPixKey">Chave PIX</label>
                        <input type="text" class="form-control"
                               value="{{ $settingDeliveryCompanyPix ? $settingDeliveryCompanyPix->pixKey : "" }}"
                               id="inputPixKey" name="pixKey" required autocomplete="off">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputDescription">Descrição</label>
                    <textarea class="form-control" id="inputDescription" name="description" rows="3" required
                              autocomplete="off">{{ $settingDeliveryCompanyPix ? $settingDeliveryCompanyPix->description : "" }}</textarea>
                </div>
                <input type="tel" class="form-control" value="{{ Auth::user()->companyWorker->companyId }}"
                       name="companyId" hidden>
                <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
        </form>
    </div>
</div>
