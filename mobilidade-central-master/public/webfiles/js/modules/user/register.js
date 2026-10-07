
document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();
    
    // Estado do formulário
    const formState = {
        isValid: false,
        isSubmitting: false,
        validationRules: {
            name: {
                required: true,
                minLength: 2,
                maxLength: 255,
                pattern: /^[a-zA-ZÀ-ÿ\s]+$/
            },
            email: {
                required: true,
                maxLength: 255,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: true,
                maxLength: 20
            },
            dateOfBirth: {
                required: true,
                beforeToday: true
            },
        }
    };

    // Inicializar aplicação
    initRegisterApp();

    function initRegisterApp() {
        setupEventListeners();
        setupFormValidation();
    }

    function setupEventListeners() {
        // Event listeners do formulário
        elementProperty.addEventInElement('#userRegisterForm', 'submit', handleFormSubmit);
        elementProperty.addEventInElement('#cancelBtn', 'click', handleCancel);
        elementProperty.addEventInElement('#confirmSubmit', 'click', confirmSubmit);
        
        // Event listeners para validação em tempo real
        elementProperty.addEventInElement('#name', 'blur', () => validateField('name'));
        elementProperty.addEventInElement('#email', 'blur', () => validateField('email'));
        elementProperty.addEventInElement('#phone', 'blur', () => validateField('phone'));
        elementProperty.addEventInElement('#dateOfBirth', 'blur', () => validateField('dateOfBirth'));
        
        // Adicionar event listener direto no botão de submit
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleFormSubmit(e);
            });
        }
    }

    function setupFormValidation() {
        // Validação em tempo real para todos os campos
        const form = document.getElementById('userRegisterForm');
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.name && formState.validationRules[input.name]) {
                    validateField(input.name);
                }
            });
        });
    }

    function loadCentrals() {
        // Central ID já vem na URL, não precisa carregar opções

        
    }

    function validateField(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        const rules = formState.validationRules[fieldName];
        const value = field.value.trim();
        
        let isValid = true;
        let errorMessage = '';
        
        // Validação de campo obrigatório
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        
        // Validações específicas por campo
        if (isValid && value) {
            switch (fieldName) {
                case 'name':
                    if (value.length < rules.minLength) {
                        isValid = false;
                        errorMessage = `Nome deve ter pelo menos ${rules.minLength} caracteres`;
                    } else if (value.length > rules.maxLength) {
                        isValid = false;
                        errorMessage = `Nome deve ter no máximo ${rules.maxLength} caracteres`;
                    } else if (!rules.pattern.test(value)) {
                        isValid = false;
                        errorMessage = 'Nome deve conter apenas letras e espaços';
                    }
                    break;
                    
                case 'email':
                    if (value.length > rules.maxLength) {
                        isValid = false;
                        errorMessage = `E-mail deve ter no máximo ${rules.maxLength} caracteres`;
                    } else if (!rules.pattern.test(value)) {
                        isValid = false;
                        errorMessage = 'E-mail deve ter um formato válido';
                    }
                    break;
                    
                case 'phone':
                    if (value.length > rules.maxLength) {
                        isValid = false;
                        errorMessage = `Telefone deve ter no máximo ${rules.maxLength} caracteres`;
                    } else if (!rules.pattern.test(value)) {
                        isValid = false;
                        errorMessage = 'Telefone deve estar no formato (11) 99999-9999';
                    }
                    break;
                    
                case 'dateOfBirth':
                    if (rules.beforeToday) {
                        const birthDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        if (birthDate >= today) {
                            isValid = false;
                            errorMessage = 'Data de nascimento deve ser anterior a hoje';
                        }
                    }
                    break;
            }
        }
        
        // Aplicar validação visual
        updateFieldValidation(field, isValid, errorMessage);
        
        return isValid;
    }

    function updateFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        const feedback = formGroup.querySelector('.invalid-feedback');
        
        // Remover classes anteriores
        field.classList.remove('is-valid', 'is-invalid');
        formGroup.classList.remove('has-success', 'has-error');
        
        if (isValid) {
            field.classList.add('is-valid');
            formGroup.classList.add('has-success');
            feedback.textContent = '';
        } else {
            field.classList.add('is-invalid');
            formGroup.classList.add('has-error');
            feedback.textContent = errorMessage;
        }
    }




    function showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        const feedback = field ? field.nextElementSibling : null;
        
        if (field && feedback) {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            feedback.textContent = message;
        }
    }

    function clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        const feedback = field.nextElementSibling;
        
        if (field && feedback) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            feedback.textContent = '';
        }
    }
    
    function clearAllFieldErrors() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            const feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = '';
            }
        });
    }

    function validateForm() {
        console.log('Iniciando validação do formulário...');
        
        // Limpar erros anteriores
        clearAllFieldErrors();
        
        const fields = ['name', 'email', 'phone', 'dateOfBirth'];
        let isFormValid = true;
        
        fields.forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (!field) {
                console.error(`Campo ${fieldName} não encontrado!`);
                return;
            }
            
            const value = field.value.trim();
            console.log(`Validando ${fieldName}:`, value);
            
            if (!value) {
                showFieldError(fieldName, 'Este campo é obrigatório');
                isFormValid = false;
            } else {
                // Validação específica para cada campo
                if (fieldName === 'name') {
                    if (value.length < 2) {
                        showFieldError(fieldName, 'Nome deve ter pelo menos 2 caracteres');
                        isFormValid = false;
                    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                        showFieldError(fieldName, 'Nome deve conter apenas letras e espaços');
                        isFormValid = false;
                    } else {
                        clearFieldError(fieldName);
                    }
                } else if (fieldName === 'email') {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        showFieldError(fieldName, 'E-mail deve ter um formato válido');
                        isFormValid = false;
                    } else {
                        clearFieldError(fieldName);
                    }
                } else if (fieldName === 'phone') {
                    if (value.length < 8) {
                        showFieldError(fieldName, 'Telefone deve ter pelo menos 8 dígitos');
                        isFormValid = false;
                    } else {
                        clearFieldError(fieldName);
                    }
                } else if (fieldName === 'dateOfBirth') {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (isNaN(selectedDate.getTime())) {
                        showFieldError(fieldName, 'Data de nascimento inválida');
                        isFormValid = false;
                    } else if (selectedDate >= today) {
                        showFieldError(fieldName, 'Data de nascimento deve ser anterior a hoje');
                        isFormValid = false;
                    } else {
                        clearFieldError(fieldName);
                    }
                } else {
                    clearFieldError(fieldName);
                }
            }
        });
        
        
        console.log('Validação concluída. Formulário válido:', isFormValid);
        formState.isValid = isFormValid;
        return isFormValid;
    }


    function handleFormSubmit(event) {

        event.preventDefault();
        event.stopPropagation();
        
        if (!validateForm()) {
            Swal.fire({
                title: 'Atenção',
                text: 'Por favor, corrija os erros no formulário antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        // Ir direto para o submit sem modal
        confirmSubmit();
    }

    function confirmSubmit() {
        if (formState.isSubmitting) return;
        
        formState.isSubmitting = true;
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Mostrar loading
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Cadastrando...';
        
        // Criar FormData
        const formData = new FormData(document.getElementById('userRegisterForm'));
        
        // Adicionar centralId da URL se disponível
        const centralId = getCentralIdFromUrl();
        if (centralId) {
            formData.append('centralId', centralId);
        }
        
        // Verificar se UserRepository existe
        if (typeof UserRepository === 'undefined') {
            alert('Erro: UserRepository não foi carregado');
            return;
        }
        
        // Verificar se SweetAlert2 existe
        if (typeof Swal === 'undefined') {
            alert('Erro: SweetAlert2 não foi carregado');
            return;
        }
        
        // Debug: Log dos dados que serão enviados
        console.log('Dados do FormData:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        console.log('CentralId da URL:', getCentralIdFromUrl());
        
        // Enviar dados via UserRepository
        UserRepository.register(formData).then(result => {
            console.log('Resultado do registro:', result);
            
            // Verificar se é sucesso
            if (!result.status) {
                console.log('Registro falhou:', result);
                
                // Erro - mostrar mensagem e erros de validação
                clearAllFieldErrors();
                
                if (result.response && typeof result.response === 'object') {
                    Object.keys(result.response).forEach(fieldName => {
                        const fieldErrors = result.response[fieldName];
                        if (Array.isArray(fieldErrors)) {
                            showFieldError(fieldName, fieldErrors[0]);
                        } else {
                            showFieldError(fieldName, fieldErrors);
                        }
                    });
                }
                
                Swal.fire({
                    title: 'Atenção',
                    text: result.message || 'Erro de validação nos dados',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            
            // Sucesso
            console.log('Registro bem-sucedido:', result);
            Swal.fire({
                title: 'Cadastro Realizado com Sucesso',
                text:  'Seu cadastro foi realizado com sucesso',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Resetar formulário
                document.getElementById('userRegisterForm').reset();
                clearAllFieldErrors();
            });
        }).catch(error => {
            console.error('Erro no registro:', error);
            
            // Tratar erro de validação
            if (error && error.status === false && error.response) {
                clearAllFieldErrors();
                
                if (typeof error.response === 'object') {
                    Object.keys(error.response).forEach(fieldName => {
                        const fieldErrors = error.response[fieldName];
                        if (Array.isArray(fieldErrors)) {
                            showFieldError(fieldName, fieldErrors[0]);
                        } else {
                            showFieldError(fieldName, fieldErrors);
                        }
                    });
                }
                
                Swal.fire({
                    title: 'Atenção',
                    text: error.message || 'Erro de validação nos dados',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            
            // Tratar erro de conexão ou servidor
            let errorMessage = 'Erro ao processar requisição. Tente novamente.';
            
            if (error && error.message) {
                errorMessage = error.message;
            } else if (error && error.responseText) {
                errorMessage = `Erro do servidor: ${error.responseText}`;
            }
            
            Swal.fire({
                title: 'Erro',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }).finally(() => {
            // Restaurar botão
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            formState.isSubmitting = false;
        });
    }
    
    function getCentralIdFromUrl() {
        console.log('URL atual:', window.location.href);
        console.log('Pathname:', window.location.pathname);
        
        // Tentar extrair da query string primeiro
        const urlParams = new URLSearchParams(window.location.search);
        const centralIdFromQuery = urlParams.get('centralId');
        if (centralIdFromQuery) {
            console.log('CentralId da query string:', centralIdFromQuery);
            return centralIdFromQuery;
        }
        
        // Tentar extrair do pathname (último parâmetro)
        const pathParts = window.location.pathname.split('/').filter(part => part !== '');
        const lastPart = pathParts[pathParts.length - 1];
        
        console.log('Path parts:', pathParts);
        console.log('Last part:', lastPart);
        
        // Verificar se é um número
        if (!isNaN(lastPart) && lastPart !== '') {
            console.log('CentralId do pathname:', lastPart);
            return lastPart;
        }
        
        console.log('CentralId não encontrado na URL');
        return null;
    }

    function handleCancel() {
        if (formState.isSubmitting) return;
        
        Swal.fire({
            title: 'Cancelar Cadastro',
            text: 'Tem certeza que deseja cancelar o cadastro? Todas as informações serão perdidas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, cancelar',
            cancelButtonText: 'Não, continuar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Resetar formulário
                document.getElementById('userRegisterForm').reset();
                clearAllFieldErrors();
            }
        });
    }
});
