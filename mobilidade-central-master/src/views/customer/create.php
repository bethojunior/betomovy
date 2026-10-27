<div class="container-main">
    <div class="ce-page">

        <div class="ce-header">
            <div class="ce-header__left">
                <a href="/customer/list" class="ce-back" title="Voltar">
                    <i class="material-icons">arrow_back</i>
                </a>
                <div class="ce-header__info">
                    <h1 class="ce-title">Novo Cliente</h1>
                    <span class="ce-subtitle">Cadastre um passageiro ou cliente corporativo na central</span>
                </div>
            </div>
        </div>

        <div class="ce-card">

            <!-- Tipo de pessoa -->
            <div class="ce-section">
                <p class="ce-section-label">Tipo de cadastro</p>
                <div class="ce-type-group">
                    <label class="ce-type-pill" for="isCompanyCustomerPf">
                        <input type="radio" id="isCompanyCustomerPf" name="find-customer-by" checked>
                        <i class="material-icons">person</i>
                        Pessoa Física
                    </label>
                    <label class="ce-type-pill" for="isCompanyCustomerPj">
                        <input type="radio" id="isCompanyCustomerPj" name="find-customer-by">
                        <i class="material-icons">business</i>
                        Pessoa Jurídica
                    </label>
                </div>
            </div>

            <div class="ce-divider"></div>

            <!-- Dados cadastrais -->
            <div class="ce-section">
                <p class="ce-section-label">Dados cadastrais</p>
                <div class="ce-form">

                    <div class="ce-field">
                        <label class="ce-label" id="descriptionName" for="nameCustomer">Nome do cliente <span class="ce-required">*</span></label>
                        <input type="text" class="ce-input form-control" id="nameCustomer" placeholder="Nome completo ou razão social">
                    </div>

                    <div class="ce-row">
                        <div class="ce-field">
                            <label class="ce-label" id="descriptionDocument" for="documentCustomer">CPF</label>
                            <input type="text" class="ce-input form-control" id="documentCustomer" placeholder="000.000.000-00">
                        </div>
                        <div class="ce-field">
                            <label class="ce-label" for="phoneCustomer">Telefone celular <span class="ce-required">*</span></label>
                            <input type="text" class="ce-input form-control" id="phoneCustomer" placeholder="(00) 99999-9999">
                        </div>
                    </div>

                    <div class="ce-row">
                        <div class="ce-field">
                            <label class="ce-label" id="descriptionDate" for="dateOfBirthCustomer">Data de nascimento <span class="ce-required">*</span></label>
                            <input type="date" class="ce-input form-control" id="dateOfBirthCustomer">
                        </div>
                        <div class="ce-field">
                            <label class="ce-label" for="emailCustomer">E-mail (opcional)</label>
                            <input type="email" class="ce-input form-control" id="emailCustomer" placeholder="exemplo@email.com">
                        </div>
                    </div>

                </div>
            </div>

            <div class="ce-card-footer">
                <a class="ce-btn ce-btn--cancel" href="/customer/list">Cancelar</a>
                <button type="button" class="ce-btn ce-btn--save" id="saveCustomer">
                    <i class="material-icons">save</i>
                    Salvar Cliente
                </button>
            </div>

        </div>

    </div>
</div>
