<!-- Loading State -->
<div id="audit-loading" class="audit-loading">
    <div class="preload-return"></div>
    <p>Carregando informações...</p>
</div>

<!-- Error State -->
<div id="audit-error" class="audit-error" style="display: none;">
    <div class="container-home">
        <h2 class="describ-text" style="text-align: center;">
            <strong>QR code inválido</strong> ou motorista não encontrado no sistema.
        </h2>
        <div class="btn-center">
            <a href="javascript:window.location.reload()" class="btn-saiba-mais">Tentar novamente</a>
        </div>
    </div>
</div>

<!-- Content -->
<div id="audit-content" style="display: none;">
    <div class="audit-hero-image">
        <img src="<?= Host::getLocal() ?>webfiles/img/background/motoristaAgente.jpeg" alt="Auditoria de Trânsito">
    </div>

    <div class="container-home" id="features">
        <div class="audit-text-wrapper">
            <h1 class="audit-title">Fiscalização evasiva</h1>
            <h2 class="describ-text">
                Sistema de <strong>verificação e auditoria</strong> de motoristas para fiscalização de trânsito. 
                Verifique documentos e status de forma rápida e eficiente através do <strong>QR code</strong> do motorista.
            </h2>
        </div>
    </div>

    <div class="audit-promotion-section">
        <div class="container-home">
            <div class="promotion-content">
                <h1>O melhor app com vantagens para motoristas e passageiros</h1>
                <p>Somos um aplicativo de mobilidade urbana, totalmente brasileiro, valorizamos nossos motoristas parceiros e passageiros, oferecendo vantagens e benefícios exclusivos</p>
                
                <div class="promotion-buttons">
                    <a href="<?= Host::getLocal() ?>cliente/preregister" class="btn-promotion">QUERO SER PASSAGEIRO</a>
                    <a href="<?= Host::getLocal() ?>driver/signup" class="btn-promotion">QUERO SER MOTORISTA</a>
                </div>
            </div>
        </div>
    </div>
</div>
