<div class="container-index">
    <button id="btnOpenCustomerModal" type="button" class="waves-effect waves-light btn">Adicionar novo cliente</button>
    <table>
        <thead>
        <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Endereço</th>
            <th></th>
        </tr>
        </thead>
        <tbody id="listCustomers"></tbody>
    </table>

    <div id="modalAddCustomer" class="modal">
        <form id="formAddCustomer">
            <div class="modal-content">
                <div class="row">
                    <div class="input-field col s12 l6">
                        <input placeholder="Digite o nome do passageiro" id="nameCustomer" type="text" class="validate"
                               required autocomplete="off">
                        <label for="nameCustomer">Nome</label>
                    </div>
                    <div class="input-field col s12 l6">
                        <input placeholder="Digite o cpf do passageiro" id="documentCustomer" type="text"
                               class="validate" required autocomplete="off">
                        <label for="documentCustomer">CPF</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12 l3">
                        <input placeholder="Digite o telefone do passageiro" id="phoneCustomer" type="tel" class="validate"
                               required autocomplete="off">
                        <label for="phoneCustomer">Telefone</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12 l10">
                        <input placeholder="Digite o endereço de embarque do passageiro" id="addressCustomer"
                               type="text" class="validate" required autocomplete="off">
                        <label for="addressCustomer">Endereço de embarque</label>
                    </div>
                    <div class="col s12 l2">
                        <br/>
                        <button type="button" id="btnSearchPlace" class="waves-effect waves-green btn-flat">Buscar</button>
                    </div>
                </div>
                <ul class="collection" id="listLocal"></ul>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Cancelar</a>
                <button type="submit" id="btnSaveCustomer" class="waves-effect waves-green btn-flat">Salvar</button>
            </div>
        </form>
    </div>
</div>