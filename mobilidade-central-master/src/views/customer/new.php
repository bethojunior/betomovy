<!-- CDNs necessários -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<link rel="stylesheet" href="webfiles/css/user/register.css">

<div class="register-page">
    <!-- Background simples -->
    <div class="background"></div>

    <!-- Container principal -->
    <div class="register-container">
        <!-- Card principal -->
        <div class="register-card">
            <!-- Header -->
            <div class="card-header">
                <a href="/" style="display: inline-block; margin-bottom: 1rem;">
                    <img src="/webfiles/img/logo/logo.png" alt="MOVY Logo" style="height: 52px; width: auto; object-fit: contain;">
                </a>
                <div class="header-content">
                    <h1>Crie sua conta</h1>
                    <p>Junte-se à nossa plataforma de mobilidade urbana</p>
                </div>
            </div>

            <!-- Formulário -->
            <div class="card-body">
                <form id="userRegisterForm" enctype="multipart/form-data" onsubmit="return false;" class="register-form">
                    <!-- Campos do formulário -->
                    <div class="form-fields">
                        <div class="field-group">
                            <label for="name">Nome Completo</label>
                            <input type="text" id="name" name="name" placeholder="Digite seu nome completo" required>
                            <div class="field-error"></div>
                        </div>
                        
                        <div class="field-group">
                            <label for="email">E-mail</label>
                            <input type="email" id="email" name="email" placeholder="seu@email.com" required>
                            <div class="field-error"></div>
                        </div>
                        
                        <div class="field-group">
                            <label for="phone">Telefone</label>
                            <input type="text" id="phone" name="phone" placeholder="Digite seu telefone" required>
                            <div class="field-error"></div>
                        </div>
                        
                        <div class="field-group">
                            <label for="dateOfBirth">Data de Nascimento</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" required>
                            <div class="field-error"></div>
                        </div>
                        
                    </div>

                    <!-- Botões de ação -->
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">
                            <i class="fas fa-arrow-left"></i>
                            Voltar
                        </button>
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            <i class="fas fa-check"></i>
                            Criar Conta
                        </button>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="card-footer">
                <p class="footer-text">
                    Já tem uma conta? 
                    <a href="/" class="login-link">Faça login</a>
                </p>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Confirmação -->
<div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmModalLabel">Confirmar Cadastro</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p id="confirmMessage">Tem certeza que deseja cadastrar este usuário?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="confirmSubmit">Confirmar</button>
            </div>
        </div>
    </div>
</div>

<script src="webfiles/js/modules/user/register.js"></script>
