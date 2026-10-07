<div class="container-index">
    <a class="waves-effect waves-light btn modal-trigger" href="<?php echo Host::getLocal() ?>corporateroute/add">Adicionar
        uma nova rota</a>
    <div class="container-table">
        <table class="table">
            <thead>
            <tr>
                <th>Titulo</th>
                <th>Rota</th>
                <th>Horário</th>
                <th>Vagas</th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody id="listCorporateRoute"></tbody>
        </table>
    </div>
    <div id="modalCustomers" class="modal">
        <div class="modal-content">
            <ul class="collection" id="listCustomers"></ul>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Cancelar</a>
            <a href="#!" class="waves-effect waves-green btn-flat" id="openModalAddCustomer">Adicionar</a>
        </div>
    </div>

    <div id="modalAddCustomer" class="modal">
        <div class="modal-content">
            <div class="row">
                <div class="input-field col s12 l6">
                    <input placeholder="Digite o endereço de embarque do passageiro" id="documentCustomer"
                           type="text" class="validate" required autocomplete="off">
                    <label for="documentCustomer">CPF</label>
                </div>
                <div class="col s12 l6">
                    <br/>
                    <button type="button" id="btnSearchCustomer" class="waves-effect waves-green btn-flat">Buscar
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12 l6">
                    <input placeholder="Nenhum cliente informado" id="nameCustomer"
                           type="text" required autocomplete="off"
                           style="text-transform: capitalize" readonly>
                    <label for="nameCustomer">Nome do cliente</label>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Cancelar</a>
            <button type="submit" id="btnSaveCustomer" class="waves-effect waves-green btn-flat">Salvar</button>
        </div>
    </div>
</div>
