<?php
$c = $this->customerData ?? null;

$name        = htmlspecialchars($c['name']        ?? '', ENT_QUOTES, 'UTF-8');
$phone       = htmlspecialchars($c['phone']        ?? '', ENT_QUOTES, 'UTF-8');
$document    = htmlspecialchars($c['document']     ?? '', ENT_QUOTES, 'UTF-8');
$dateOfBirth = isset($c['dateOfBirth']) ? substr($c['dateOfBirth'], 0, 10) : '';
$isCompany   = !empty($c['isCompany']);

$labelName     = $isCompany ? 'Nome da empresa'   : 'Nome do cliente';
$labelDocument = $isCompany ? 'CNPJ'              : 'CPF';
$labelDate     = $isCompany ? 'Data de inscrição' : 'Data de nascimento';
$docPlaceholder= $isCompany ? '00.000.000/0000-00' : '000.000.000-00';
?>
<div class="container-main">
    <div class="ce-page">

        <div class="ce-header">
            <div class="ce-header__left">
                <a href="/customer/list" class="ce-back" title="Voltar">
                    <i class="material-icons">arrow_back</i>
                </a>
                <div class="ce-header__info">
                    <h1 class="ce-title">Editar cliente</h1>
                    <span class="ce-subtitle">Atualize os dados cadastrais do cliente</span>
                </div>
            </div>
        </div>

        <div class="ce-card">

            <!-- Tipo de pessoa -->
            <div class="ce-section">
                <p class="ce-section-label">Tipo de pessoa</p>
                <div class="ce-type-group">
                    <label class="ce-type-pill" for="isCompanyCustomerPf">
                        <input type="radio" id="isCompanyCustomerPf" name="find-customer-by"
                               <?= $isCompany ? '' : 'checked' ?>>
                        <i class="material-icons">person</i>
                        Pessoa Física
                    </label>
                    <label class="ce-type-pill" for="isCompanyCustomerPj">
                        <input type="radio" id="isCompanyCustomerPj" name="find-customer-by"
                               <?= $isCompany ? 'checked' : '' ?>>
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
                        <label class="ce-label" id="descriptionName" for="nameCustomer"><?= $labelName ?></label>
                        <input type="text" class="ce-input form-control" id="nameCustomer"
                               placeholder="Nome completo"
                               value="<?= $name ?>">
                    </div>

                    <div class="ce-row">
                        <div class="ce-field">
                            <label class="ce-label" id="descriptionDocument" for="documentCustomer"><?= $labelDocument ?></label>
                            <input type="text" class="ce-input form-control" id="documentCustomer"
                                   placeholder="<?= $docPlaceholder ?>"
                                   value="<?= $document ?>">
                        </div>
                        <div class="ce-field">
                            <label class="ce-label" for="phoneCustomer">Telefone</label>
                            <input type="text" class="ce-input form-control" id="phoneCustomer"
                                   placeholder="(00) 99999-9999"
                                   value="<?= $phone ?>">
                        </div>
                    </div>

                    <div class="ce-row">
                        <div class="ce-field">
                            <label class="ce-label" id="descriptionDate" for="dateOfBirthCustomer"><?= $labelDate ?></label>
                            <input type="date" class="ce-input form-control" id="dateOfBirthCustomer"
                                   value="<?= $dateOfBirth ?>">
                        </div>
                        <div class="ce-field ce-field--empty"></div>
                    </div>

                </div>
            </div>

            <div class="ce-card-footer">
                <a class="ce-btn ce-btn--cancel" href="/customer/list">Cancelar</a>
                <button type="button" class="ce-btn ce-btn--save" id="saveCustomer">
                    <i class="material-icons">save</i>
                    Salvar alterações
                </button>
            </div>

        </div>

    </div>
</div>
