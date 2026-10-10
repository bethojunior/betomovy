<div class="modal-create-customer">
    <div class="mcc-card">

        <!-- ── Cabeçalho ── -->
        <div class="mcc-header">
            <span class="mcc-title">Cadastro de cliente</span>
            <button class="mcc-close" id="closeModalCreateCustomer" type="button">
                <i class="material-icons mi-lg">close</i>
            </button>
        </div>

        <!-- ── Tipo de pessoa ── -->
        <div class="mcc-type-group">
            <label class="mcc-type-pill" for="isCompanyCustomerPf">
                <input type="radio" id="isCompanyCustomerPf" name="create-customer-type" checked>
                Pessoa Física
            </label>
            <label class="mcc-type-pill" for="isCompanyCustomerPj">
                <input type="radio" id="isCompanyCustomerPj" name="create-customer-type">
                Pessoa Jurídica
            </label>
        </div>

        <!-- ── Toggle internacional ── -->
        <label class="mcc-toggle" for="register-international">
            <input type="checkbox" id="register-international" role="switch" class="mcc-toggle__input">
            <span class="mcc-toggle__track"><span class="mcc-toggle__thumb"></span></span>
            <span class="mcc-toggle__text">Cadastro internacional</span>
        </label>

        <!-- ── Campos ── -->
        <div class="mcc-body">

            <div class="mcc-field mcc-field--full">
                <label class="mcc-label" id="descriptionName" for="nameCustomer">Nome do cliente</label>
                <input type="text" class="mcc-input form-control" id="nameCustomer">
            </div>

            <input type="hidden" id="documentCustomer" value="">
            <span id="descriptionDocument" style="display: none;"></span>

            <div class="mcc-field mcc-field--full">
                <label class="mcc-label" for="phoneCustomer">Telefone</label>
                <input type="text" class="mcc-input form-control" id="phoneCustomer">
            </div>

            <div class="mcc-field mcc-field--full">
                <label class="mcc-label" for="emailCustomer">E-mail <span class="mcc-required">*</span></label>
                <input type="email" class="mcc-input form-control" id="emailCustomer">
            </div>

            <div class="mcc-field">
                <label class="mcc-label" id="descriptionDate" for="dateOfBirthCustomer">Data de nascimento</label>
                <input type="date" class="mcc-input form-control" id="dateOfBirthCustomer">
            </div>

        </div>

        <!-- ── Botões ── -->
        <div class="mcc-footer">
            <button type="button" class="mcc-btn mcc-btn--cancel" id="btnCancelModalCreateCustomer">Cancelar</button>
            <button type="button" class="mcc-btn mcc-btn--save" id="saveCustomer">Salvar</button>
        </div>

    </div>
</div>
