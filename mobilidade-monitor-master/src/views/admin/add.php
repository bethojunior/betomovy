<div class="container-modal-add-admin">
    <div>
        <div>
            <span>Adicionar administrador</span>
            <i class="material-icons close-modal-add-admin">close</i>
        </div>
        <form id="formAdmin">
            <div>
                <label for="name">Nome</label>
                <input type="text" id="name" class="form-input-admin" required>
            </div>
            <div>
                <label for="nickname">Apelido</label>
                <input type="text" id="nickname" class="form-input-admin" required>
            </div>
            <div>
                <label id="email">E-mail</label>
                <input type="email" id="email" class="form-input-admin" required>
            </div>
            <div class="half-field">
                <div>
                    <label for="phone">Telefone</label>
                    <input type="tel" id="phone"
                           pattern="[\(]\d{2}[\)] \d{4,5}[\-]\d{4}"
                           class="form-input-admin" required>
                </div>
                <div>
                    <label for="document">CPF</label>
                    <input type="tel" id="document"
                           pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                           class="form-input-admin" required>
                </div>
            </div>
            <div class="half-field">
                <div>
                    <label>Senha</label>
                    <input type="password" id="password" class="form-input-admin" required>
                </div>
                <div>
                    <label>Senha de confirmação</label>
                    <input type="password" id="confirmationPassword" class="form-input-admin" required>
                </div>
            </div>
            <div class="form-group">
                <label for="typeProfile">Perfil</label>
                <select class="form-control" id="typeProfile"></select>
            </div>
            <input type="submit" value="Salvar" id="btnAddAdmin"/>
        </form>
    </div>
</div>