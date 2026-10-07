<div class="container-default-monitor list-admin">
    <div class="list-customer">
        <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'admin_adicionar')) { ?>
            <button type="button" class="btn btn-primary mb-2 add-user-admin">Adicionar usuário</button>
        <?php } ?>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">Nome</th>
                <th scope="col">Apelido</th>
                <th scope="col">Perfil</th>
                <th scope="col">Telefone</th>
                <th scope="col">E-mail</th>
                <th scope="col"></th>
            </tr>
            </thead>
            <tbody class="container-list"></tbody>
        </table>
    </div>
</div>