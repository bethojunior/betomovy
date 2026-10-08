<div class="container-main">
    <div class="language-page" style="padding: 24px; max-width: 900px; margin: 0 auto;">

        <!-- ── Cabeçalho ── -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
                <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin: 0;">Configuração de Idiomas</h1>
                <p style="font-size: 14px; color: #64748b; margin-top: 4px;">Ative ou desative os idiomas disponíveis no Site e nos formulários da plataforma.</p>
            </div>
            <button type="button" id="btnSaveLanguages" class="btn btn-primary" style="background-color: #2563eb; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <i class="material-icons" style="font-size: 18px;">save</i>
                Salvar Alterações
            </button>
        </div>

        <!-- ── Alerta Informativo ── -->
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <i class="material-icons" style="color: #3b82f6; font-size: 22px;">info</i>
                <div>
                    <strong style="color: #1e40af; font-size: 14px;">Comportamento ao desativar o idioma Brasil:</strong>
                    <p style="color: #1e3a8a; font-size: 13px; margin: 4px 0 0;">
                        Quando o Brasil estiver <strong>desativado</strong> e os <strong>Estados Unidos</strong> ativado como padrão, o site abrirá automaticamente em Inglês (US), o campo de <strong>CPF será ocultado</strong> da página de cadastro e o código de telefone padrão será <strong>+1 (Estados Unidos)</strong>.
                    </p>
                </div>
            </div>
        </div>

        <!-- ── Lista de Idiomas ── -->
        <div style="display: flex; flex-direction: column; gap: 16px;" id="languagesContainer">

            <!-- Estados Unidos (English) -->
            <div class="language-card" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 36px; line-height: 1;">🇺🇸</span>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <strong style="font-size: 16px; color: #0f172a;">English (United States)</strong>
                            <span style="background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">PADRÃO</span>
                        </div>
                        <span style="font-size: 13px; color: #64748b;">Código: <code>en</code> | Telefone DDI: <strong>+1</strong> | Sem exigência de CPF</span>
                    </div>
                </div>
                <div>
                    <label style="position: relative; display: inline-block; width: 50px; height: 26px; margin: 0; cursor: pointer;">
                        <input type="checkbox" id="lang_en" checked style="opacity: 0; width: 0; height: 0;">
                        <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #22c55e; transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
            </div>

            <!-- Brasil (Português) -->
            <div class="language-card" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 36px; line-height: 1;">🇧🇷</span>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <strong style="font-size: 16px; color: #0f172a;">Português (Brasil)</strong>
                            <span id="badge_pt" style="background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">DESATIVADO</span>
                        </div>
                        <span style="font-size: 13px; color: #64748b;">Código: <code>pt</code> | Telefone DDI: <strong>+55</strong> | Exige validação de CPF</span>
                    </div>
                </div>
                <div>
                    <label style="position: relative; display: inline-block; width: 50px; height: 26px; margin: 0; cursor: pointer;">
                        <input type="checkbox" id="lang_pt" style="opacity: 0; width: 0; height: 0;">
                        <span id="slider_pt" class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
            </div>

            <!-- Espanha (Español) -->
            <div class="language-card" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 36px; line-height: 1;">🇪🇸</span>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <strong style="font-size: 16px; color: #0f172a;">Español (América Latina / Espanha)</strong>
                            <span id="badge_es" style="background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">DESATIVADO</span>
                        </div>
                        <span style="font-size: 13px; color: #64748b;">Código: <code>es</code></span>
                    </div>
                </div>
                <div>
                    <label style="position: relative; display: inline-block; width: 50px; height: 26px; margin: 0; cursor: pointer;">
                        <input type="checkbox" id="lang_es" style="opacity: 0; width: 0; height: 0;">
                        <span id="slider_es" class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
            </div>

            <!-- França (Français) -->
            <div class="language-card" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 36px; line-height: 1;">🇫🇷</span>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <strong style="font-size: 16px; color: #0f172a;">Français</strong>
                            <span id="badge_fr" style="background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">DESATIVADO</span>
                        </div>
                        <span style="font-size: 13px; color: #64748b;">Código: <code>fr</code></span>
                    </div>
                </div>
                <div>
                    <label style="position: relative; display: inline-block; width: 50px; height: 26px; margin: 0; cursor: pointer;">
                        <input type="checkbox" id="lang_fr" style="opacity: 0; width: 0; height: 0;">
                        <span id="slider_fr" class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
            </div>

        </div>

    </div>
</div>

<style>
.slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}
input:checked + .slider {
    background-color: #22c55e !important;
}
input:checked + .slider:before {
    transform: translateX(24px);
}
</style>
