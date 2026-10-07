<div class="modal-confirmation-data-trip">
    <div>
        <div class="data-customer">
            <i class="material-icons data-customer-icon">directions_car</i>
            <h6><strong>Dados da viagem</strong></h6>
        </div>
        <div class="data-trip">
            <p><span>Nome</span><span id="nameCustomerTripConfirmation"></span></p>
            <p><span>Telefone</span><span id="phoneCustomerTripConfirmation"></span></p>
            <p><span>Data e hora</span><span id="scheduleCustomerTripConfirmation"></span></p>
            <p><span id="valueTripConfirmationLabel">Valor</span><span id="valueTripConfirmation"></span></p>
            <p id="totalValueTripSpan" style="display:none"><span id="totalValueTripLabel">Total estimado</span><span id="totalValueTripConfirmation"></span></p>
            <p id="feeSpan" style="display:none"><span>Taxa de retorno estimada</span><span id="returnFee"></span></p>
            <p id="finalPriceSpan" style="display:none"><span>Total estimado com retorno</span><span id="finalPrice"></span></p>
            <p><span>Tipo</span><span id="typeTripConfirmation"></span></p>
            <ul id="routeTrip"></ul>
        </div>
        <div class="form-group form-check ml-2 mt-1">
            <input type="checkbox" class="form-check-input" id="haveReturnTrip">
            <label class="form-check-label" for="haveReturnTrip">Retorno para origem</label>
        </div>
        <hr />
        <div class="data-footer">
            <button type="button" id="btnConfirmationTrip">CONFIRMAR VIAGEM</button>
            <button type="button" id="btnCancelConfirmationTrip">CANCELAR</button>
        </div>
    </div>
</div>
