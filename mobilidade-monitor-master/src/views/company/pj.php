<div class="row container-pj">
    <div class="row col-lg-12">

        <div class="row col-lg-12">
            <div class="col-lg-4">

            </div>
        </div>
        <div class="col-lg-12">
            <h3>Empresa</h3>
            <hr class="col-lg-12">
        </div>
        <div class="col-lg-4 form-group">
            <span>*Nome Empresa</span>
            <input id="name-enterprise" class="form-control" type="text">
        </div>

        <div class="col-lg-4 form-group">
            <span>*Nome fantasia</span>
            <input id="name-fantasy-enterprise" class="form-control" type="text">
        </div>

        <div class="col-lg-4 form-group">
            <span>*CNPJ</span>
            <input id="cnpj" class="form-control" type="text">
        </div>

        <div class="col-lg-4 form-group">
            <span>*Endereço</span>
            <input id="address" type="text" class="form-control">
        </div>

        <div class="col-lg-4 form-group">
            <span>*Estado</span>
            <select id="estate-id" class="custom-select">
            </select>
        </div>

        <div class="col-lg-4 form-group">
            <span>*Cidade</span>
            <select class="custom-select" id="city-id">
            </select>
        </div>

        <div class="col-lg-4 form-group">
            <span>*Telefone Empresarial</span>
            <input class="form-control" id="tel-enterprise">
        </div>

        <div class="col-lg-4 form-group">
            <span>Gestor</span>
            <select hidden class="custom-select" id="mount-users"></select>
        </div>

        <div class="col-lg-4 form-group">
            <span>Telefone do Gestor</span>
            <input class="form-control" id="phone-manager">
        </div>
        <div class="col-lg-4 form-group">
            <span>*Número da matrícula</span>
            <input id="registration-number" class="form-control" type="text">
        </div>

        <div class="col-lg-12">
            <h3>Detalhes da empresa</h3>
            <hr class="col-lg-12">
        </div>

        <div class="col-lg-4 form-group">
            <span>*Email financeiro</span>
            <input id="email-manager" class="form-control">
        </div>

        <div class="col-lg-4 form-group">
            <span>Site da empresa</span>
            <input id="site" class="form-control">
        </div>

        <div class="col-lg-2 form-group">
            <span>Instagram</span>
            <input id="instagram" class="form-control">
        </div>

        <div class="col-lg-2 form-group">
            <span>Facebook</span>
            <input id="facebook" class="form-control">
        </div>

        <div class="form-group col-lg-4">
            <span>*Limite Voucher</span>
            <input id="voucherLimit" class="form-control">
        </div>

        <div class="form-group col-lg-4">
            <span>*Dia do mês para cobrança</span>
            <input type="number" class="form-control" id="billingDay">
        </div>

        <div class="form-group col-lg-4">
            <span>*Finalidade da viagem</span>
            <input type="text" class="form-control" id="purpose-of-travel">
        </div>

        <div class="col-lg-12 user-enterprise">
            <h3>Usuários autorizados</h3>
            <hr class="col-lg-12">
        </div>

        <div class="form-group col-lg-2 user-enterprise">
            <span>ID</span>
            <input id="userId" disabled class="form-control">
        </div>

        <div class="form-group col-lg-3 user-enterprise">
            <span>Email</span>
            <select hidden id="mount-users-by-email"></select>
        </div>

        <div class="form-group col-lg-3 user-enterprise">
            <span>Nome</span>
            <input id="name-user" class="form-control">
        </div>

        <div class="form-group col-lg-3 user-enterprise">
            <span>Fone</span>
            <input id="phone-user" class="form-control">
        </div>


        <div class="col-lg-1 user-enterprise">
            <button id="add-new-user" style="margin-top: 1.8vw" class=" btn btn-primary"><i class="material-icons">add</i></button>
        </div>

        <div class="col-lg-12">
            <div class="center">
                <button class="btn btn-primary send-data">Finalizar</button>
            </div>
        </div>

        <table style="opacity: 0;" class="col-lg-12 table table-striped" id="table-users">
            <thead>
            <tr>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th>Telefone</th>
                <th scope="col"><i class="material-icons">edit</i></th>
            </tr>
            </thead>
            <tbody id="mount-table-users">
            </tbody>
        </table>

    </div>
</div>