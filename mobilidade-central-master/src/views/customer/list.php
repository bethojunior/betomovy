<div class="container-main">
    <div class="cust-page">

        <div class="cust-header">
            <h1 class="cust-title">Clientes</h1>
            <button type="button" class="cust-btn-add" id="openAddCustomer">
                <i class="material-icons">add</i> Novo cliente
            </button>
        </div>

        <div class="cust-toolbar">
            <div class="cust-search">
                <i class="material-icons cust-search__icon">search</i>
                <input type="text" id="filterCustomer" class="cust-search__input" placeholder="Buscar cliente...">
            </div>
            <div class="cust-filter-group">
                <label class="cust-filter-pill">
                    <input type="radio" class="radio-type-filter" name="typeFilter" value="name" checked>
                    <span>Nome</span>
                </label>
                <label class="cust-filter-pill">
                    <input type="radio" class="radio-type-filter" name="typeFilter" value="phone">
                    <span>Telefone</span>
                </label>
                <label class="cust-filter-pill">
                    <input type="radio" class="radio-type-filter" name="typeFilter" value="document">
                    <span>CPF / CNPJ</span>
                </label>
            </div>
        </div>

        <div class="cust-table-wrap">
            <table class="cust-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF / CNPJ</th>
                        <th>Telefone</th>
                        <th>Nascimento / Cadastro</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <div class="container-pagination cust-pagination"></div>

    </div>
</div>
