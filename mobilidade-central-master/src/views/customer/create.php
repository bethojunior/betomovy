<div class="container-main">
    <div class="container">
        <h5 class="mt-3 mb-4">Cadastrar cliente</h5>
        <div class="row mb-3">
            <div class="form-group col-sm-2">
                <input class="form-check-input" type="radio" id="isCompanyCustomerPf" name="find-customer-by" checked>
                <label class="form-check-label" for="isCompanyCustomerPf">Pessoa Física</label>
            </div>
            <div class="form-group col-sm-2">
                <input class="form-check-input" type="radio" id="isCompanyCustomerPj" name="find-customer-by">
                <label class="form-check-label" for="isCompanyCustomerPj">Pessoa Jurídica</label>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-sm-6">
                <label id="descriptionName" for="nameCustomer" class="mb-0">Nome do cliente</label>
                <input type="text" class="form-control" id="nameCustomer">
            </div>
        </div>
        <div class="row" style="display: none;">
            <div class="form-group col-sm-4">
                <label id="descriptionDocument" for="documentCustomer" class="mb-0">CPF</label>
                <input type="hidden" class="form-control" id="documentCustomer" value="">
            </div>
        </div>
        <div class="row">
            <div class="form-group col-sm-4">
                <label for="phoneCustomer" class="mb-0">Telefone</label>
                <input type="text" class="form-control" id="phoneCustomer">
            </div>
        </div>

        <div class="row">
            <div class="form-group col-sm-4">
                <label id="descriptionDate" for="dateOfBirthCustomer" class="mb-0">Data de nascimento</label>
                <input type="date" class="form-control" id="dateOfBirthCustomer">
            </div>
        </div>
        <div class="mt-3">
            <button type="button" class="btn btn-primary" id="saveCustomer">Salvar</button>
            <a class="btn btn-secondary ml-2" href="/customer/list">Cancelar</a>
        </div>
    </div>
</div>
