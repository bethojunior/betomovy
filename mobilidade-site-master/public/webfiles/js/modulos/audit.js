class AuditController {
    constructor() {
        this.driverId = this.getDriverIdFromUrl();
        this.apiBase = typeof HOST_API !== 'undefined' ? HOST_API : 'https://apiteste.taxireturn.com.br/';
        
        if (this.driverId) {
            this.loadDriverData();
        } else {
            this.showError('QR code inválido ou parâmetro não encontrado.');
        }
    }

    getDriverIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q');
    }

    async loadDriverData() {
        try {
            this.showLoading();
            const response = await this.fetchDriverData(this.driverId);
            
            if (response && response.driver) {
                this.hideLoading();
                this.showContent();
            } else {
                throw new Error('Motorista não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.hideLoading();
            this.showError(error.message || 'Erro ao carregar informações do motorista.');
        }
    }

    async fetchDriverData(driverId) {
        try {
            // TODO: Substituir pela chamada real da API quando o endpoint estiver disponível
            // const response = await axios.get(`${this.apiBase}audit/driver/${driverId}`);
            // return response.data;

            // Dados mockados temporários - REMOVER quando API estiver pronta
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        driver: {
                            id: driverId,
                            status: "active"
                        }
                    });
                }, 1000);
            });
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    }

    showLoading() {
        const loading = document.getElementById('audit-loading');
        const error = document.getElementById('audit-error');
        const content = document.getElementById('audit-content');
        
        if (loading) loading.style.display = 'block';
        if (error) error.style.display = 'none';
        if (content) content.style.display = 'none';
    }

    hideLoading() {
        const loading = document.getElementById('audit-loading');
        if (loading) loading.style.display = 'none';
    }

    showError(message) {
        const loading = document.getElementById('audit-loading');
        const error = document.getElementById('audit-error');
        const content = document.getElementById('audit-content');
        
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'none';
        if (error) {
            error.style.display = 'block';
            const errorText = error.querySelector('.describ-text strong');
            if (errorText) errorText.textContent = message;
        }
    }

    showContent() {
        const loading = document.getElementById('audit-loading');
        const error = document.getElementById('audit-error');
        const content = document.getElementById('audit-content');
        
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'none';
        if (content) content.style.display = 'block';
    }
}

function loadLogos() {
    const logoNavbar = document.querySelector('#default-logo-navbar');
    const logoFooter = document.querySelector('#default-logo-footer');
    
    if (!logoNavbar && !logoFooter) return;
    
    // URL padrão do bucket como fallback (mesma lógica do Host.php)
    const bucketName = 'taxireturnteste'; // Default bucket
    const defaultLogoUrl = `https://s3.amazonaws.com/${bucketName}/default.jpg`;
    
    function setLogos(url) {
        if (logoNavbar) {
            logoNavbar.setAttribute('src', url);
            logoNavbar.style.width = '50px';
            logoNavbar.style.height = 'auto';
        }
        if (logoFooter) {
            logoFooter.setAttribute('src', url);
            logoFooter.style.width = '70px';
            logoFooter.style.height = 'auto';
        }
    }
    
    // Tentar carregar da API
    if (typeof HomeController !== 'undefined') {
        const appVersion = new HomeController();
        appVersion.getDefaultAppLogo()
            .then(response => {
                // A resposta pode vir como string ou objeto com .data
                const logoUrl = (response && response.data) ? response.data : (response || defaultLogoUrl);
                if (logoUrl) {
                    setLogos(logoUrl);
                } else {
                    setLogos(defaultLogoUrl);
                }
            })
            .catch(error => {
                // Em caso de erro, usar URL padrão do bucket
                console.log('Erro ao carregar logo da API, usando fallback:', error);
                setLogos(defaultLogoUrl);
            });
    } else {
        // Se HomeController não estiver disponível, usar URL padrão
        setLogos(defaultLogoUrl);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.auditController = new AuditController();
    
    // Aguardar um pouco para garantir que HomeController está carregado
    setTimeout(loadLogos, 100);
});
