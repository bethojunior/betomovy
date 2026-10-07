<div class="container-default-monitor">
    <div class="container">
        <div class="form-group">
            <label>Valor</label>
            <input type="text" class="form-control" id="value">
        </div>
        <div class="form-group">
            <label>Tipo de Taxa</label>
            <select  class="form-control" id="type">
                <option value="0" disabled>Tipo de Taxa</option>
            </select>
        </div>
        <div class="form-group">
            <label>Forma de Pagamento da taxa ao entregador</label>
            <select  class="form-control" id="paidByPlatform">
                <option value="" selected>Selecione a forma de pagamento</option>
                <option value="1">Pago pela plataforma</option>
                <option value="0">Pago pelo estabelecimento no local</option>
            </select>
        </div>
        <div class="d-flex justify-content-end">
            <button class="btn btn-primary" id="btnUpdateRate">Atualizar</button>
        </div>
    </div>
</div>