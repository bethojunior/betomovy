<div class="container-login">
    <div>
        <div class="logo-monitor"></div>
        <form action="/" id="formLogin" method="POST">
            <div>
                <label for="email"><i class="material-icons">person</i>E-mail</label>
                <input type="email" name="email" id="email" required />
            </div>
            <div>
                <label for="password"><i class="material-icons">vpn_key</i>Senha</label>
                <input type="password" name="password" id="password" required />
            </div>
            <div id="recaptcha"></div>
            <input id="btn-form" type="submit" value="ENTRAR">
            <div class="forgot-password-container">
                <a href="#" data-toggle="modal" data-target="#modal-forgot-password">Esqueci minha senha</a>
            </div>
        </form>
    </div>
</div>

<div class="modal" id="modal-forgot-password" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">Não conseguiu entrar?</h6>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label>Enviaremos um código de recuperação</label>
                <input class="form-control email-input" placeholder="Insira seu e-mail">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary btn-sm btn-send-recuperation">Enviar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="modal-code-verify" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">Código de verificação</h6>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label class="text-center">Digite o código:</label>
                <input class="form-control code-verify">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-code-verify btn-sm">Confirmar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="modal-redefinition-password" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">Redefinir senha</h6>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label class="text-center">Digite sua nova senha:</label>
                <input class="form-control input-password">
                <label class="text-center mt-2 input-password-confirm">Confirme sua nova senha:</label>
                <input class="form-control input-confirm">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm btn-redefinition-password">Redefinir</button>
            </div>
        </div>
    </div>
</div>